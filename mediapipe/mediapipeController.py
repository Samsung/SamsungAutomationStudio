# pip install -r requirements.txt

import cv2
import mediapipe as mp
from mediapipe_functions import mediapipe_detection, extract_keypoints

holistic = None

def startMediaPipe():
    global holistic
    
    if holistic is not None : 
        try : 
            endMediaPipe()
        except e:
            pass
    mp_holistic = mp.solutions.holistic
    holistic = mp_holistic.Holistic(static_image_mode=True, model_complexity=2, enable_segmentation=True)

def endMediaPipe():
    global holistic
    holistic.close()
    holistic = None

def predict(name):
    global holistic
    
    if holistic is None : 
        print("Holistic is not Set")
        return
    
    img = cv2.imread(f'./mediapipe/{name}.jpg')
    image, results = mediapipe_detection(img, holistic)
    keypoints = extract_keypoints(results)
    return repr(keypoints)[6:-1]