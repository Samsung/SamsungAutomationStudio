[데이터 모델링](#데이터 모델링)
[알림 Flow](#알림 Flow)
[차트 Flow](#차트 Flow)


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

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/407d4649-8dc4-4dea-bffc-35c73475e83d/Untitled.png)

### 들어가는 Data 형식

```json
{ label: 라벨
, payload: 데이터 값}
```

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b87553e3-fdaa-49c2-bf7d-37dcc75ed11d/Untitled.png)

### Sum Chart

기간 내의 location에 머문 값을 바 차트 형태로 나타낸다.

### Pie Chart

기간 내의 location에 머문 값을 파이 차트 형태로 나타낸다.

### Avg Chart

기간 내의 location에 머문 값을 기간으로 나누어서 일당 location에 머문 시간을 바 차트 형태로 나타낸다.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/20118e4b-9c74-481e-9db7-085dee690918/Untitled.png)

### Day Chart

기간 내의 location에 머문 값을 기간별로 나누어서 바 차트 형태로 나타낸다. 

### Timeline Chart(Day)

지정한 날에 저장된 Log 값을 Timeline 그래프로 나타낸다.

```json
{
	label: 라벨,
	datasets: {label: 라벨,
						 timestamp: 타임스탬프, 
						 data: [시작시간, 끝시간, 색상]
						}
}
```

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0360448c-6583-4eb7-ad6a-057b9a2baff2/Untitled.png)

### Timeline Chart(Live)

실시간 저장되는 Log 값을 Timeline 차트로 나타낸다.

```json
{
	label: 라벨,
	datasets: {label: 라벨,
						 timestamp: 타임스탬프, 
						 data: [시작시간, 끝시간, 색상]
						}
}
```

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5dc6cee3-33b3-4286-8d2a-18533ab5d38e/Untitled.png)
