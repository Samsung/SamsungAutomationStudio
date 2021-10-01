# Hands Detection Node

<div align="center">
<img style="width:150px" src="https://user-images.githubusercontent.com/45550607/135408100-b4899882-a518-4ba2-bef8-64d0d400277c.png">
</div><br>

삼성SW청년아카데미 5기의 5FNSaaS팀에서 Node-red에 "동작인식"이라는 새로운 Node를 제시하고자 합니다.
다양한 기기의 제어는 일반적으로 터치와 음성으로 하는 경우가 많습니다.
하지만 이러한 방법이 제한되거나 자유롭게 사용하지 못하는 사용자들이 존재하며, 이러한 문제점을 해결하기 위해 "동작인식"이라는 추가적인 제어방법을 제안하게 되었습니다.
더 나아가, 5FNSaaS의 Node를 활용하면 신체의 정보를 활용하는 서비스의 Flow를 개발할 수 있습니다.
개발자가 이용하는 Node-red의 특성한 커스터마이징에 유용하도록 코드를 작성하였습니다.

## Local Install
1. Node-Red 설치
  ```
  npm install node-red -g
  ```
2. Hands Detection Repository Clone
  ```
  git clone https://github.com/5FNSaaS/detection-hyeona.git
  ```
3. Node-Red에 Hands Detection Node 설치
  ```
  npm install <clone_받은_경로>\detection-hyeona
  ```
4. 명령프롬프트에서 실행하기
  ```
  node-red
  ```
5. Node-red [http://127.0.0.1:1880/](http://127.0.0.1:1880/) 접속해서 Hands Detection 확인하기


## Reference

- [Node-RED Creating Nodes](https://nodered.org/docs/creating-nodes/)
- [Google Mediapipe Repository](https://github.com/google/mediapipe)
- [Tensorflow Model Github Repository](https://github.com/tensorflow/tfjs-models)