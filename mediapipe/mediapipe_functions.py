
import cv2
import time

import numpy as np
import os
from matplotlib import pyplot as plt
import mediapipe as mp

mp_holistic = mp.solutions.holistic # Holistic model
mp_drawing = mp.solutions.drawing_utils # Drawing utilities
# Make keypoint detection, model can only detect in RGB
def mediapipe_detection(image, model):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) # COLOR CONVERSION BGR 2 RGB as model can only detect in RGB
    image.flags.writeable = False                  # Image is no longer writeable
    results = model.process(image)                 # Use Model to make prediction
    image.flags.writeable = True                   # Image is now writeable 
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR) # COLOR COVERSION RGB 2 BGR
    return image, results

def draw_landmarks(image, results): # draw landmarks for each image/frame
    
    mp_drawing.draw_landmarks(image, results.face_landmarks, mp_holistic.FACEMESH_CONTOURS) # Draw face connections
    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS) # Draw pose connections
    mp_drawing.draw_landmarks(image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS) # Draw left hand connections
    mp_drawing.draw_landmarks(image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS) # Draw right hand connections
    
    
def draw_styled_landmarks(image, results): # draw landmarks for each image/frame, fix colour of landmark drawn
    
    # Draw face connections
    #mp_drawing.draw_landmarks(image, results.face_landmarks, mp_holistic.FACEMESH_CONTOURS, 
                             #mp_drawing.DrawingSpec(color=(80,110,10), thickness=1, circle_radius=1), 
                             #mp_drawing.DrawingSpec(color=(80,256,121), thickness=1, circle_radius=1)
                             #) 
    # Draw pose connections
    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS,
                             mp_drawing.DrawingSpec(color=(80,22,10), thickness=2, circle_radius=2), 
                             mp_drawing.DrawingSpec(color=(80,44,121), thickness=2, circle_radius=1)
                             ) 
    # Draw left hand connections
    mp_drawing.draw_landmarks(image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS, 
                             mp_drawing.DrawingSpec(color=(121,22,76), thickness=2, circle_radius=2), 
                             mp_drawing.DrawingSpec(color=(121,44,250), thickness=2, circle_radius=1)
                             ) 
    # Draw right hand connections  
    mp_drawing.draw_landmarks(image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS, 
                             mp_drawing.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=2), 
                             mp_drawing.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=1)
                             ) 

def add_image(image,results, action):

    #height,width = image.shape
    #print(image.shape)
    width = image.shape[1]#480
    height= image.shape[0]#640

    def overlay_transparent(background, overlay, x, y):
        
        # height and width of background image
        background_width = background.shape[1]
        background_height = background.shape[0]
        
        # if coordinate x and y is larger than background width and height, stop code
        if x >= background_width or y >= background_height:
            return background

        
        
        # height and width of overlay image
        h, w = overlay.shape[0], overlay.shape[1]

        #print('x:',x)
        #print('overlay_width:',w)
        #print('background_width:',background_width)
       

        #print('y:',y)
        #print('overlay_height:',h)
        #print('background_height:',background_width)
        

        if w >= background_width:
            return background
        if h >= background_height:
            return background
        
        # if coordinate x + width of overlay is larger than background width and height, stop code
        if x + w > background_width:
            #w = background_width - x
            #overlay = overlay[:, :w]
            return background
        if x - w < 2:
            #w = background_width - x
            #overlay = overlay[:, :w]
            return background
        if y + h > background_height:
            #h = background_height - y
            #overlay = overlay[:h]
            return background
        
        if y - h < 2:
            #h = background_height - y
            #overlay = overlay[:h]
            return background
        
        if overlay.shape[2] < 4:
            overlay = np.concatenate(
                [
                    overlay,
                    np.ones((overlay.shape[0], overlay.shape[1], 1), dtype = overlay.dtype) * 255
                ],
                axis = 2,
            )

        overlay_image = overlay[..., :3]
        mask = overlay[..., 3:] / 255.0

        background[y:y+h, x:x+w] = (1.0 - mask) * background[y:y+h, x:x+w] + mask * overlay_image

        return background

    index = 10
    
    face_keypoint=np.array([[res.x, res.y, res.z] for res in results.face_landmarks.landmark])if results.face_landmarks else np.zeros(468*3)
    #print(len(face_keypoint))
    #print(action)
    if face_keypoint.size != 0 and np.any(face_keypoint[index]) == True:

        if action =='Bird':
            file_name = './emoji/bird.png'
        elif action =='Butterfly':
            file_name = './emoji/butterfly.png'
        elif action =='Gorilla':
            file_name = './emoji/gorilla.png'
        elif action == 'Cow':
            file_name = './emoji/cow.png'
        elif action == 'Elephant':
            file_name = './emoji/elephant.png'
        elif action == 'Alligator':
            file_name = './emoji/alligator.png'
        else:
            file_name = './emoji/No_sign.png'
            
        if action != 'No Action':    
            overlay= cv2.imread(file_name, cv2.IMREAD_UNCHANGED)

            #overlay= cv2.resize(overlay, (0,0), fx=min(0.1,float(1/face_keypoint[index][2]*-20)), fy=min(0.1,float(1/face_keypoint[index][2]*-20)))
            #print('z normalized',face_keypoint[index][2])
            #if face_keypoint[index][2]*-100 >1:
                #print('close to camera')
            #else:
                #print('far from camera')

            new_z = 0.1/((float(face_keypoint[index][2]*10)-(-1))/(1+1))
            #print('new_z',new_z)
            #print('z ',face_keypoint[index][2]*-10)
            #print('fx:',new_z)
            #print('fy:',new_z)

            #print(min(0.5,float(new_z)))

            overlay= cv2.resize(overlay, (0,0), fx=min(0.5,abs(float(new_z))), fy=min(0.5,abs(float(new_z))))

            #print('Normalized',face_keypoint[index])
            x = int(float(face_keypoint[index][0])*width)
            y = int(float(face_keypoint[index][1])*height)
            #print('Actual x',x)
            #print('Actual y',y)
            #cv2.circle(image,(x,y),3,(255,255,0),thickness= -1)

            #overlay = img2.copy()
            #image = cv2.rectangle(image, (x,y), (x+overlay.shape[1],y-overlay.shape[0]), (255,0,0), 3)

            #image = cv2.addWeighted(image,0.4,overlay,0.1,0)

            image = overlay_transparent(image, overlay, x - int(overlay.shape[0]/2), y-overlay.shape[0])


            #Setting the paste destination coordinates. For the time being, in the upper left
            #x1, y1, x2, y2 = x, y, overlay.shape[1], overlay.shape[0]

            #Synthetic!
            #image[y1:y2, x1:x2] = overlay[y1:y2, x1:x2]

    
# define extract keypoint function
def extract_keypoints(results):
    pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33*4)
    #face = np.array([[res.x, res.y, res.z] for res in results.face_landmarks.landmark]).flatten() if results.face_landmarks else np.zeros(468*3)
    lh = np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]).flatten() if results.left_hand_landmarks else np.zeros(21*3)
    rh = np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]).flatten() if results.right_hand_landmarks else np.zeros(21*3)
    #return np.concatenate([pose, face, lh, rh]) # concatenate all the keypoints that are flattened
    return np.concatenate([pose, lh, rh])

def prob_viz(res, actions, input_frame, colors, threshold):
    output_frame = input_frame.copy()

    #print(res)

    multiple = 47

    # num = class index , prob = probability of the class
    for num, prob in enumerate(res):


        
        #print(num, prob)
        if np.argmax(res) == num and  res[np.argmax(res)] >= threshold:
            #print(res[np.argmax(res)])
            (text_width, text_height), baseline = cv2.getTextSize(actions[num]+' '+str(round(prob*100,2))+'% ', cv2.FONT_HERSHEY_SIMPLEX,1, 2)
            
            cv2.rectangle(output_frame, (0,60+num*multiple), (int(prob*text_width), 95+num*multiple), colors[num], -1) #change length of bar depending on probability

            cv2.putText(output_frame, actions[num]+' '+str(round(prob*100,2))+'%', (5, 90+num*multiple), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,0), 2, cv2.LINE_AA)
        
        else:
            (text_width, text_height), baseline = cv2.getTextSize(actions[num]+' '+str(round(prob*100,2))+'% ', cv2.FONT_HERSHEY_SIMPLEX,1, 2)

            cv2.rectangle(output_frame, (0,60+num*multiple), (int(prob*text_width), 95+num*multiple), colors[num], -1) #change length of bar depending on probability
            
            cv2.putText(output_frame, actions[num]+' '+str(round(prob*100,2))+'%', (5, 90+num*multiple), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 2, cv2.LINE_AA)
        
        

        #thres = 0.5
        #if prob >= thres:
            #cv2.putText(output_frame, actions[num]+' '+str(round(prob*100,2))+'%', (0, 85+num*40), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0,0,0), 1, cv2.LINE_AA)

        #cv2.putText(image, text, org, font, fontScale, color[, thickness[, lineType[, bottomLeftOrigin]]])
    return output_frame

'''
def display_correct_screen(image):
    width = image.shape[1]#480
    height= image.shape[0]#640
    alpha = 0.5

    overlay = image.copy()
	

    cv2.rectangle(overlay, (0, 0), (width, height),
		(0, 255, 0), -1)
    
    # apply the overlay
    cv2.addWeighted(overlay, alpha, image, 1 - alpha,
		0, image)
'''
    

def overlay_transparent(background, overlay, x, y):
        
        # height and width of background image
        background_width = background.shape[1]
        background_height = background.shape[0]
        
        # if coordinate x and y is larger than background width and height, stop code
        if x >= background_width or y >= background_height:
            return background

        
        
        # height and width of overlay image
        h, w = overlay.shape[0], overlay.shape[1]

        #print('x:',x)
        #print('overlay_width:',w)
        #print('background_width:',background_width)
       

        #print('y:',y)
        #print('overlay_height:',h)
        #print('background_height:',background_width)
        

        if w >= background_width:
            return background
        if h >= background_height:
            return background
        
        # if coordinate x + width of overlay is larger than background width and height, stop code
        if x + w > background_width:
            #w = background_width - x
            #overlay = overlay[:, :w]
            return background
        if x - w < 2:
            #w = background_width - x
            #overlay = overlay[:, :w]
            return background
        if y + h > background_height:
            #h = background_height - y
            #overlay = overlay[:h]
            return background
        
        if y - h < 2:
            #h = background_height - y
            #overlay = overlay[:h]
            return background
        
        if overlay.shape[2] < 4:
            overlay = np.concatenate(
                [
                    overlay,
                    np.ones((overlay.shape[0], overlay.shape[1], 1), dtype = overlay.dtype) * 255
                ],
                axis = 2,
            )

        overlay_image = overlay[..., :3]
        mask = overlay[..., 3:] / 255.0

        background[y:y+h, x:x+w] = (1.0 - mask) * background[y:y+h, x:x+w] + mask * overlay_image

        return background