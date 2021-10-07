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
사용방법
1. `Table Initialize` Inject 노드를 실행하여 테이블을 생성합니다.
2. items, prices 테이블이 정상적으로 생성되지 않은 경우 `Table Delete` Inject 노드를 실행 후 1번을 다시 실행합니다.
3. 상품을 검색하는 화면은 `{{host}}/shopping`에서 접근가능하며 현재 [http://team3.ssafy.dev.devground.io:1880/shopping](http://team3.ssafy.dev.devground.io:1880/shopping) 에서 볼 수 있습니다. 원하시는 검색어를 입력하고 `Enter(엔터)`키 혹은 `Submit(제출)`버튼을 클릭합니다.
4. 검색 결과가 표시됩니다. `Click Here`를 통해 검색 결과를 바로 확인할 수 있고, `즐겨찾기에 저장`을 통해 즐겨찾기에 저장할 수 있습니다.
5. 즐겨찾기 화면은 `{{host}}/items`에서 접근가능하며 현재 [http://team3.ssafy.dev.devground.io:1880/items](http://team3.ssafy.dev.devground.io:1880/items) 에서 볼 수 있습니다. 
6. 즐겨찾기한 상품이 표시되며 `가격 흐름 보러가기`버튼을 통해 가격의 흐름을 보여주는 그래프를 새창에서 표시합니다. `즐겨찾기에서 제거`를 통해 즐겨찾기에서 제거할 수 있습니다.