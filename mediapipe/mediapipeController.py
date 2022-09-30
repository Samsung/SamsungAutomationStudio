import cv2
import mediapipe as mp
import numpy as np
from mediapipe_functions import mediapipe_detection, extract_keypoints

holistic = None

def startMediaPipe():
    global holistic
    
    if holistic is not None : 
        try : 
            endMediaPipe()
        except Exception as e:
            pass
    mp_holistic = mp.solutions.holistic
    holistic = mp_holistic.Holistic(static_image_mode=True, model_complexity=2, enable_segmentation=True)

def endMediaPipe():
    global holistic
    holistic.close()
    holistic = None

def predict(data):
    global holistic
    
    if holistic is None : 
        print("Holistic is not Set")
        return

    img = ""

    try:
        img = np.fromstring(data, dtype = np.uint8)
    except Exception as e:
        raise Exception(e + "np.fromstring Error")

    try:
        img = cv2.imdecode(img, cv2.IMREAD_COLOR)
    except Exception as e:
        raise Exception(e + "cv2.imdecode Error")

    #img = cv2.imread(f'./mediapipe/{name}.jpg')
    try :
        image, results = mediapipe_detection(img, holistic)
        keypoints = extract_keypoints(results)
        return repr(keypoints)[6:-1]
    except Exception as e :
        cv2.imshow('image',img)
        cv2.waitKey(0)
        cv2.destroyAllWindows()
        raise Exception(str(e) + "mediaPipe Error")