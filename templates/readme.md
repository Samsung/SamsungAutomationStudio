# Templates 

> 차트 시각화를 위한 Data Formatter Node와 개인 클라우드의 파일을 읽기 위한 File Cloud Node를 활용한 예시 Flow



### kcal.json

- 음식별 칼로리에 대한 엑셀 파일을 구글 드라이브에 저장하였으며 File Cloud Node를 통해 해당 파일을 읽어 Data Formatter Node에 전달합니다. 이후 Data Formatter Node에서는 엑셀 형태의 데이터를 Javascript Object로 변환하여 HTML-OUT 노드의 chart.js로 전달합니다. 이를 통해 시각화된 음식별 칼로리를 볼 수 있습니다.
