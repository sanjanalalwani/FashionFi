import os
import cvzone
import cv2
from cvzone.PoseModule import PoseDetector

# Initialize webcam capture
cap = cv2.VideoCapture(0)
detector = PoseDetector()
# Folders for shirts and bottoms
shirtFolderPath = "Resources/Shirts"
bottomFolderPath = "Resources/Bottoms"

listShirts = os.listdir(shirtFolderPath)
listBottoms = os.listdir(bottomFolderPath)

# Constants
fixedRatio = 262 / 190  # widthOfShirt/widthOfPoint11to12
shirtRatioHeightWidth = 581 / 440
bottomRatioHeightWidth = 600 / 400  # Adjust based on your bottom images

imageNumberShirt = 0
imageNumberBottom = 0
imgButtonRight = cv2.imread("Resources/button.png", cv2.IMREAD_UNCHANGED)
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
        # Overlay Shirt
        lm11 = lmList[11][1:3]  # Left shoulder
        lm12 = lmList[12][1:3]  # Right shoulder
        imgShirt = cv2.imread(os.path.join(shirtFolderPath, listShirts[imageNumberShirt]), cv2.IMREAD_UNCHANGED)

        widthOfShirt = int((lm11[0] - lm12[0]) * fixedRatio)
        imgShirt = cv2.resize(imgShirt, (widthOfShirt, int(widthOfShirt * shirtRatioHeightWidth)))
        currentScale = (lm11[0] - lm12[0]) / 190
        offsetShirt = int(44 * currentScale), int(48 * currentScale)

        try:
            xPosShirt = lm12[0] - offsetShirt[0]
            yPosShirt = lm12[1] - offsetShirt[1]

            # Ensure overlay does not go out of bounds
            if xPosShirt + imgShirt.shape[1] <= img.shape[1] and yPosShirt + imgShirt.shape[0] <= img.shape[0]:
                img = cvzone.overlayPNG(img, imgShirt, (xPosShirt, yPosShirt))
        except Exception as e:
            print(f"Error overlaying shirt: {e}")

        # Overlay Bottom (Pants/Skirt)
        lm23 = lmList[23][1:3]  # Left hip
        lm24 = lmList[24][1:3]  # Right hip
        imgBottom = cv2.imread(os.path.join(bottomFolderPath, listBottoms[imageNumberBottom]), cv2.IMREAD_UNCHANGED)

        widthOfBottom = int((lm23[0] - lm24[0]) * fixedRatio)
        imgBottom = cv2.resize(imgBottom, (widthOfBottom, int(widthOfBottom * bottomRatioHeightWidth)))
        currentScaleBottom = (lm23[0] - lm24[0]) / 190
        offsetBottom = int(44 * currentScaleBottom), int(120 * currentScaleBottom)  # Adjust offset as needed

        try:
            xPosBottom = lm24[0] - offsetBottom[0]
            yPosBottom = lm24[1] - offsetBottom[1]

            # Ensure overlay does not go out of bounds
            if xPosBottom + imgBottom.shape[1] <= img.shape[1] and yPosBottom + imgBottom.shape[0] <= img.shape[0]:
                img = cvzone.overlayPNG(img, imgBottom, (xPosBottom, yPosBottom))
        except Exception as e:
            print(f"Error overlaying bottom: {e}")

        # Overlay Buttons for Shirt Selection
        try:
            right_button_x = img.shape[1] - imgButtonRight.shape[1] - 50
            right_button_y = 50
            left_button_x = 50
            left_button_y = 50

            img = cvzone.overlayPNG(img, imgButtonRight, (right_button_x, right_button_y))
            img = cvzone.overlayPNG(img, imgButtonLeft, (left_button_x, left_button_y))
        except Exception as e:
            print(f"Error overlaying buttons: {e}")

        # Button Logic for Shirt and Bottom Selection
        if lmList[16][1] < 300:  # Right hand raised
            counterRight += 1
            if counterRight * selectionSpeed > 360:
                counterRight = 0
                imageNumberShirt = (imageNumberShirt + 1) % len(listShirts)
        elif lmList[15][1] < 300:  # Left hand raised
            counterLeft += 1
            if counterLeft * selectionSpeed > 360:
                counterLeft = 0
                imageNumberBottom = (imageNumberBottom + 1) % len(listBottoms)
        else:
            counterRight = 0
            counterLeft = 0

    cv2.imshow("Image", img)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
