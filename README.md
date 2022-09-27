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
