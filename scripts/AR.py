from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
from cvzone.PoseModule import PoseDetector
import cvzone
import traceback

app = Flask(__name__)
CORS(app)

# Initialize pose detector
detector = PoseDetector()

# Fixed ratios based on your working code
fixedRatio = 262 / 190  # Adjusted based on the shirt image dimensions
shirtRatioHeightWidth = 581 / 440  # Height-to-width ratio of the shirt image

def overlay_image(background, overlay, position):
    """Overlay an image with alpha channel onto another image using cvzone"""
    try:
        background = cvzone.overlayPNG(background, overlay, position)
    except Exception as e:
        print(f"Error in overlay_image: {e}")
        traceback.print_exc()
    return background

@app.route('/process_frame', methods=['POST'])
def process_frame():
    try:
        data = request.json
        if 'frame' not in data or 'productImage' not in data:
            return jsonify({'error': 'Missing frame or product image data'}), 400

        # Decode video frame
        img_data = base64.b64decode(data['frame'])
        nparr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Flip the frame horizontally to match user's perspective
        frame = cv2.flip(frame, 1)

        # Convert frame to RGB as MediaPipe expects RGB images
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Decode product image from base64
        img_data = base64.b64decode(data['productImage'])
        nparr = np.frombuffer(img_data, np.uint8)
        product_img = cv2.imdecode(nparr, cv2.IMREAD_UNCHANGED)

        if product_img is None:
            return jsonify({'error': 'Failed to process product image'}), 500

        # Detect pose
        frame_rgb = detector.findPose(frame_rgb, draw=False)
        lmList, bboxInfo = detector.findPosition(
            frame_rgb, bboxWithHands=False, draw=False
        )

        if lmList and len(lmList) >= 13:
            # Convert frame back to BGR for OpenCV processing
            frame = cv2.cvtColor(frame_rgb, cv2.COLOR_RGB2BGR)

            # Get shoulder points
            lm11 = lmList[11][1:3]  # Left shoulder
            lm12 = lmList[12][1:3]  # Right shoulder

            # Calculate shirt width based on shoulder distance
            shoulder_distance = lm12[0] - lm11[0]
            widthOfShirt = int(shoulder_distance * fixedRatio)
            if widthOfShirt <= 0:
                widthOfShirt = 200  # Default width if calculation fails

            # Resize the shirt image
            shirtHeight = int(widthOfShirt * shirtRatioHeightWidth)
            product_resized = cv2.resize(product_img, (widthOfShirt, shirtHeight), interpolation=cv2.INTER_AREA)

            # Calculate current scale and offsets
            currentScale = shoulder_distance / 190  # 190 is base shoulder width in pixels
            offset = (int(44 * currentScale), int(48 * currentScale))
            # Determine position to overlay
            xPos = int(lm11[0]) - 2 * offset[0]
            yPos = int(lm11[1]) - 2 * offset[1]

            # Debug statements
            print(f"Left Shoulder: {lm11}")
            print(f"Right Shoulder: {lm12}")
            print(f"Shoulder Distance: {shoulder_distance}")
            print(f"Width of Shirt: {widthOfShirt}")
            print(f"Shirt Height: {shirtHeight}")
            print(f"Position X: {xPos}, Position Y: {yPos}")

            # Overlay the shirt
            frame = overlay_image(frame, product_resized, (xPos, yPos))
        else:
            print("Insufficient landmarks detected")

        # Encode processed frame
        _, buffer = cv2.imencode('.jpg', frame)
        processed_frame = base64.b64encode(buffer).decode('utf-8')

        return jsonify({'frame': processed_frame})

    except Exception as e:
        print(f"Error processing frame: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
