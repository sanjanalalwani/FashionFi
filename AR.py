import os
import cvzone
import cv2
from cvzone.PoseModule import PoseDetector

# Initialize webcam capture
cap = cv2.VideoCapture(0)
detector = PoseDetector()

# Use os.path.join to get the correct absolute path for the Shirts folder
shirtFolderPath = os.path.join(os.path.dirname(__file__), 'Resources', 'Shirts')
listShirts = os.listdir(shirtFolderPath)
fixedRatio = 262 / 190  # widthOfShirt/widthOfPoint11to12
shirtRatioHeightWidth = 581 / 440
imageNumber = 0

# Ensure button paths are correctly joined
imgButtonRight = cv2.imread(os.path.join(os.path.dirname(__file__), "Resources", "button.png"), cv2.IMREAD_UNCHANGED)
imgButtonLeft = cv2.flip(imgButtonRight, 1)
counterRight = 0
counterLeft = 0
selectionSpeed = 10

while True:
    success, img = cap.read()
    if not success:
        break

    img = detector.findPose(img, draw=False)
    lmList, bboxInfo = detector.findPosition(img, bboxWithHands=False, draw=False)

    if lmList:
        lm11 = lmList[11][1:3]
        lm12 = lmList[12][1:3]
        imgShirt = cv2.imread(os.path.join(shirtFolderPath, listShirts[imageNumber]), cv2.IMREAD_UNCHANGED)

        widthOfShirt = int((lm11[0] - lm12[0]) * fixedRatio)
        imgShirt = cv2.resize(imgShirt, (widthOfShirt, int(widthOfShirt * shirtRatioHeightWidth)))
        currentScale = (lm11[0] - lm12[0]) / 190
        offset = int(44 * currentScale), int(48 * currentScale)

        try:
            xPos = lm12[0] - offset[0]
            yPos = lm12[1] - offset[1]

            # Ensure overlay does not go out of bounds
            if xPos + imgShirt.shape[1] <= img.shape[1] and yPos + imgShirt.shape[0] <= img.shape[0]:
                img = cvzone.overlayPNG(img, imgShirt, (xPos, yPos))
        except Exception as e:
            print(f"Error overlaying shirt: {e}")

        # Ensure button positions are within the image bounds
        try:
            # Adjust button positions if needed
            right_button_x = img.shape[1] - imgButtonRight.shape[1] - 50
            right_button_y = 50
            left_button_x = 50
            left_button_y = 50

            img = cvzone.overlayPNG(img, imgButtonRight, (right_button_x, right_button_y))
            img = cvzone.overlayPNG(img, imgButtonLeft, (left_button_x, left_button_y))
        except Exception as e:
            print(f"Error overlaying buttons: {e}")

        # Check hand positions to activate the buttons
        if lmList[16][1] < 300:  # Right hand raised
            counterRight += 1
            if counterRight * selectionSpeed > 360:
                counterRight = 0
                imageNumber = (imageNumber + 1) % len(listShirts)
        elif lmList[15][1] < 300:  # Left hand raised
            counterLeft += 1
            if counterLeft * selectionSpeed > 360:
                counterLeft = 0
                imageNumber = (imageNumber - 1) % len(listShirts)
        else:
            counterRight = 0
            counterLeft = 0

    cv2.imshow("Image", img)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
