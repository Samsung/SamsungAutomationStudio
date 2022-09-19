# pip install -r requirements.txt
import cv2
import mediapipe as mp
from mediapipe_functions import mediapipe_detection, extract_keypoints

mp_holistic = mp.solutions.holistic  # Holistic model

sample_img = cv2.imread('./mediapipe/test_picture.jpg')
with mp_holistic.Holistic(static_image_mode=True, model_complexity=2, enable_segmentation=True) as holistic:
    image, results = mediapipe_detection(sample_img, holistic)
    keypoints = extract_keypoints(results)
    print(repr(keypoints)[6:-1])