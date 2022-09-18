# pip install -r requirements.txt
import cv2
import mediapipe as mp
from mediapipe_functions import mediapipe_detection, extract_keypoints

mp_holistic = mp.solutions.holistic  # Holistic model

sample_img = cv2.imread('test_picture.jpg')
test = cv2.cvtColor(sample_img, cv2.COLOR_BGR2RGB)
with mp_holistic.Holistic(static_image_mode= True, min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
    image, results = mediapipe_detection(test, holistic)
    keypoints = extract_keypoints(results)
    print(repr(keypoints)[6:-1])