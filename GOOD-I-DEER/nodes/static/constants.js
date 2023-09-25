const YOLO_CLASSES = [
    'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat',
    'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse',
    'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase',
    'frisbee', 'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard',
    'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
    'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch', 'potted plant',
    'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven',
    'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'
];

const COLORS = ['#2ac53c', '#8529cd', '#0ba70a', '#60a317', '#9613ed', '#e71789', '#6b5330', '#b6ad58', '#be4089', '#afd3ab', 
                 '#06314e', '#e3f43b', '#bc9ea9', '#09664f', '#bb8582', '#1c45f1', '#16f2c7', '#16fa6f', '#b23f67', '#56a7ef', 
                 '#333092', '#111633', '#c093b1', '#14088d', '#81a73e', '#b7f799', '#5ebb7a', '#bb06e4', '#c83007', '#cdecf6', 
                 '#e9f481', '#4b000f', '#552fa8', '#60e96e', '#e80c38', '#408c52', '#8602ba', '#579f39', '#fe0229', '#3183ab', 
                 '#293164', '#07f8bb', '#805ae2', '#c9de39', '#60dcee', '#9c9c9e', '#5ace32', '#b30d4a', '#f87005', '#a7ee4a', 
                 '#166aa1', '#122c47', '#dfd002', '#30b006', '#0cd484', '#d24ea1', '#6acc19', '#7c30dd', '#7d13ba', '#b8ad87', 
                 '#4a39a4', '#588fdf', '#a5dba2', '#e8f76d', '#f049e7', '#528fa0', '#c32535', '#80ab5d', '#e6f322', '#d4af25', 
                 '#19783e', '#ff5fdf', '#69c83e', '#8c5ac6', '#503754', '#2481fb', '#c91d51', '#0dac54', '#503df1', '#2d2320'
             ]

export {YOLO_CLASSES, COLORS};