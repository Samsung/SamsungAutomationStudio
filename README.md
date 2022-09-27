[데이터 모델링](#데이터-모델링)
[알림 Flow](#알림-Flow)
[차트 Flow](#차트-Flow)


# Object Detection Nodes

# 데이터 모델링

---

### ObjectDetection 결과값 저장 로그 (매초마다 저장)

```json
{
  "_id": {
    "$oid": "63328e72995d727ec2d5171e"
  },
  "location": "Bed", 
  "pose": "Stand",
  "timestamp": {
    "$date": {
      "$numberLong": "1665100800000"
    }
  }
}
```

- location: ObjectDetection으로 탐지한 사용자의 location
- pose: PoseDetection으로 탐지한 사용자의 pose
- timestamp: 탐지 결과를 로그에 저장한 시간

### 알람 옵션 저장 로그

```json
{
  "_id": {
    "$oid": "6332fd24995d727ec2d5485b"
  },
  "location": "Bed",
  "setTime": 180,
  "poseData": [
    "Lie"
  ],
  "timestamp": {
    "$date": {
      "$numberLong": "1664285988780"
    }
  }
}
```

- location: 알람 조건(location)
- setTime: 알람 설정 시간(sec)
- poseData: 알람 조건(pose)
- timestamp: 알람 시작 시간

# 알림 Flow

---
# 차트 Flow

---

### 시작 날짜와 끝 날짜 입력 받음

![Untitled (1)](https://user-images.githubusercontent.com/67916174/192566343-fbb107a9-e972-4eba-b273-0e202868238c.png)

### 들어가는 Data 형식

```json
{ "label" : "라벨"
, "payload" : "데이터 값"}
```

![Untitled (2)](https://user-images.githubusercontent.com/67916174/192566492-be507666-b4e0-44b8-a075-e89350244056.png)

### Sum Chart

기간 내의 location에 머문 값을 바 차트 형태로 나타낸다.

### Pie Chart

기간 내의 location에 머문 값을 파이 차트 형태로 나타낸다.

### Avg Chart

기간 내의 location에 머문 값을 기간으로 나누어서 일당 location에 머문 시간을 바 차트 형태로 나타낸다.

![Untitled (3)](https://user-images.githubusercontent.com/67916174/192566609-9c445d51-f01e-4209-80e0-ab6544a6be7e.png)

### Day Chart

기간 내의 location에 머문 값을 기간별로 나누어서 바 차트 형태로 나타낸다. 

### Timeline Chart(Day)

지정한 날에 저장된 Log 값을 Timeline 그래프로 나타낸다.

```json
{"labels":["Bed","Couch"],"datasets":[{"label":"Bed","timestamp":"2022-09-27T14:29:26.395Z","data":[["2022-11-06T18:02:00.000Z","2022-11-06T18:22:00.000Z","#FF6633"],["2022-11-06T18:42:00.000Z","2022-11-06T19:01:00.000Z","#FF6633"]]},{"label":"Couch","timestamp":"2022-09-27T14:29:26.395Z","data":[["2022-11-06T18:22:00.000Z","2022-11-06T18:42:00.000Z","#5DA5DA"]]}]}
```

![Untitled (4)](https://user-images.githubusercontent.com/67916174/192567130-0d7f5690-f19c-45ce-af07-4933758e4c8c.png)

### Timeline Chart(Live)

실시간 저장되는 Log 값을 Timeline 차트로 나타낸다.


![Untitled (5)](https://user-images.githubusercontent.com/67916174/192567188-f7c809f1-8183-4d47-a195-412fde022725.png)
