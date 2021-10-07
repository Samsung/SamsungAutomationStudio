# Templates

## SASM with E-commerce Extensions Pack

### shopping1.json

- 일정 주기(24시간)마다 Slack으로 네이버 쇼핑 검색 결과 사이트 링크를 전달하는 플로우 입니다.
- 웹 소켓을 사용하며 웹 페이지 생성, 24시간 주기로 검색 결과 및 링크 전달, 최초 연결시 초기화하는 부분으로 나뉩니다.
- 네이버 쇼핑 API Key등록 및 Slack Webhook, 사이트 링크 설정이 필요합니다.

### priceTracker.json

- 상품을 검색하고, 검색 결과를 저장하고, 저장한 상품을 토대로 최저가를 일정 주기마다 저장하여 가격 변동을 보여주는 서비스 플로우입니다.
- 웹 소켓을 사용하며 초기 DB 설정, 상품 검색 화면, 즐겨찾기 CRUD, 즐겨찾기 가격 업데이트 하는 부분으로 나뉩니다.
- 초기 DB 설정을 위해 `MySQL` `localhost:3306`에 `sasm` 데이터베이스가 필요합니다. 다른 데이터베이스를 쓰고 싶은 경우 `DB Config` 노드 설정만 변경하면 됩니다.
- 네이버 쇼핑, 11번가 API Key를 필요로 합니다. 필요에 따라 1개만 사용해도 되며, 추가적으로 다른 쇼핑몰을 추가하고 싶은 경우 `params`노드에 맞게 추가하면 됩니다.

**사용방법**

1. `Table Initialize` Inject 노드를 실행하여 테이블을 생성합니다.
2. items, prices 테이블이 정상적으로 생성되지 않은 경우 `Table Delete` Inject 노드를 실행 후 1번을 다시 실행합니다.
3. 상품을 검색하는 화면은 `{{host}}/shopping`에서 접근가능하며 현재 [http://team3.ssafy.dev.devground.io:1880/shopping](http://team3.ssafy.dev.devground.io:1880/shopping) 에서 볼 수 있습니다. 원하시는 검색어를 입력하고 `Enter(엔터)`키 혹은 `Submit(제출)`버튼을 클릭합니다.
4. 검색 결과가 표시됩니다. `Click Here`를 통해 검색 결과를 바로 확인할 수 있고, `즐겨찾기에 저장`을 통해 즐겨찾기에 저장할 수 있습니다.
5. 즐겨찾기 화면은 `{{host}}/items`에서 접근가능하며 현재 [http://team3.ssafy.dev.devground.io:1880/items](http://team3.ssafy.dev.devground.io:1880/items) 에서 볼 수 있습니다.
6. 즐겨찾기한 상품이 표시되며 `가격 흐름 보러가기`버튼을 통해 가격의 흐름을 보여주는 그래프를 새창에서 표시합니다. `즐겨찾기에서 제거`를 통해 즐겨찾기에서 제거할 수 있습니다.

### pricingNotification.json

- 원하는 상품 이름과 원하는 가격 범위를 설정해두고 해당 조건에 맞는 상품이 검색 결과로 생기면 결과 사이트 링크를 전달하는 플로우입니다.
- shopping, shopping-filter, shopping-formatter, switch 노드를 활용하여 조건에 맞는 상품 결과를 판단하고 추출합니다.
- (shopping1.json) 플로우를 쇼핑 결과 사이트 링크 전달합니다.

1. shopping 노드에 원하는 상품 이름과 검색에 이용할 API 종류(naver or 11st)를 선택합니다.
2. shopping-filter 노드에 가격 범위와 정렬 순서를 설정합니다.
3. shopping-formatter 노드에서 검색 결과 포맷을 통일합니다.
4. switch 노드에서 msg.payload.items 배열의 길이를 통해 검색 결과 상품 개수를 판단합니다. 1이상일 경우 slack을 통해 결과 사이트 링크 알림을 전달합니다.

### StockNotificationAutomation.json

- 재고 관리를 원하는 상품이 있는 위치에 스위치를 설치하고, 재고량이 일정 기준치 밑으로 감소하면(스위치가 꺼짐) 알림을 주는 플로우입니다.
- 플로우는 웹 소켓을 사용하며, 재고량이 줄어 꺼져있던 스위치가 켜지는 이벤트를 감지되면서 상품에 대한 보고서를 생성하는 부분, 최초 연결시 초기화하는 부분으로 나뉩니다.
- Shopping 노드 사용시 쇼핑몰에서 API Key를 발급받아 사용해야 합니다.

  - [네이버 쇼핑 API 이용](https://developers.naver.com/docs/search/shopping/)
  - [11번가 쇼핑 API 이용](https://openapi.11st.co.kr/openapi/OpenApiFrontMain.tmall)

- 사용방법

1. 스위치 상태를 감지할 수 있도록 My Device 노드에서 서 [스마트 싱스 사이트](https://account.smartthings.com/tokens)에서 발급받은 토큰을 등록합니다.
2. 스위치가 켜지는 event를 감지하기 위해 Device Profile 노드의 capability를 switch로 선택합니다.
3. automation 노드로 시작하는 플로우와 websocket-in 노드로 시작하는 플로우에서 Query이름을 가진 노드를 선택하여 재고관리 상품을 등록합니다.<br>
   (이벤트 노드와 상태 노드가 스위치가 켜지는 이벤트를 감지한 뒤 Query 노드에서 입력한 상품 키워드로 상품을 검색하고 결과 보고서를 만듭니다.)
4. 상태(status)노드에서 재고관리에 사용되는 스위치를 Device 필드의 속성 값으로 선택하고, 하단에 add filter를 눌러 switch == on을 추가합니다.
5. automation 플로우 말단에 있는 알림노드에서 알림을 보낼 slack 채널의 webhook endpoint를 등록합니다.
   <br>
   <br>
   _참고 : 11번가가 아닌 naver쇼핑 검색 결과 이용시, shopping노드의 API Type을 "Naver Shopping"으로, shopping-formatter, shopping-filter 노드들의 apiType을 naver로 바꿔야 합니다._
