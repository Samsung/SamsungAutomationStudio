# Hands Detection Node

<div align="center">
</div><br>

## Local Install
1. Node-Red 설치
  ```
  npm install node-red -g
  ```
2. Hands Detection Repository Clone
  ```
  git clone https://github.com/5FNSaaS/Motion-Pose-Node-Hands.git
  ```
3. Node-Red에 Hands Detection Node 설치(Node-Red 설치 경로에서)
  ```
  npm install <clone_받은_경로>\hand-similarity-hyeonmin
  ```
4. 명령프롬프트에서 실행하기
  ```
  node-red
  ```
5. Node-red [http://127.0.0.1:1880/](http://127.0.0.1:1880/) 접속해서 hand-find, hand-register 확인하기


## Reference

- [Node-RED Creating Nodes](https://nodered.org/docs/creating-nodes/)
- [Google Mediapipe Repository](https://github.com/google/mediapipe)
- [Tensorflow Model Github Repository](https://github.com/tensorflow/tfjs-models)
