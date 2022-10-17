# data-extractor

A node that extracts specific data you want from REST API response.

<br>

## Usage

This node provides data extraction that you want from REST API response. The criteria for extraction is specific paths checked by you.

<br>

## Properties

### Type

You can choose the type of input data format between JSON and XML.

### URL

This URL makes the data structure tree of API response keys.

### Path

This Paths is a list of path that is checked in key tree.

### Key

This Key Tree is made by URL response. And it provides data path checkboxes for extracting specific data.

<br>

## Features

### Data Path Generator

If you check the location of the data you want, the absolute path to the location is added to the `Path`.

|unchecked|checked and added|
|:---:|:---:|
|![image](https://user-images.githubusercontent.com/86189596/192148412-b65409da-ac39-4fb5-abb5-cc4620b4aee9.png)|![image](https://user-images.githubusercontent.com/86189596/192148303-b38d56cd-1c45-4d3b-ae80-ead365d45454.png)|

<br>

### Single or Multi Path

> Single path

when input has only one path, the output is not in array.

```json
// path
[“api.response.header”]

// output
{ resultCode: '00', resultMsg: 'NORMAL_CODE' }, // extraction result of path
```

<br>

> Multi paths

when input has many paths, the output is in array with Path.

```json
// path
[“api.response.header”, "api.response.body.items.item.SPECIES_KEY", …]

// output
[
  [“api.response.header”, "api.response.body.items.item.SPECIES_KEY", …], // path
  { resultCode: '00', resultMsg: 'NORMAL_CODE' }, // extraction result of first path of path array
  …
]
```

<br>

### JSON and XML

This node provides two input data types: JSON and XML. You can choose from these two types.

![image](https://user-images.githubusercontent.com/86189596/192148927-3920dd14-64a1-477a-9d0f-72e1eb40aab4.png)

<br>

## Use Guide

### Example JSON

```json
{
  "response": {
    "header": {
      "resultCode": "00",
      "resultMsg": "NORMAL_CODE"
    },
    "body": {
      "items": {
        "item": [
          {
            "RNUM": 1.0,
            "SPECIES_KEY": "72044138",
            "BOOK_KEY": "72044140",
            "IDX_TITLE": "클로즈업도쿄 클로즈업 도쿄 CLOSEUPTOKYO CLOSE UPTOKYO UP TOKYO 도쿄디즈니리조트요코하마하코네닛코카마쿠라 디즈니리조트요코하마하코네닛코카마쿠라 디즈니 리조트요코하마하코네닛코카마쿠라 리조트 요코하마하코네닛코카마쿠라 요코하마 하코네닛코카마쿠라 하코네 닛코카마쿠라 닛코 카마쿠라",
            "IDX_AUTHOR": "유재우 손미경 유재우손미경지음",
            "IDX_PUBLISHER": "에디터",
            "IDX_KEYWORD": "클로즈업 도쿄 일본 일본여행 도쿄여행 TOKYO",
            "TITLE_INFO": "클로즈업 도쿄 = Close up Tokyo : 도쿄 디즈니 리조트, 요코하마, 하코네, 닛코, 카마쿠라",
            "AUTHOR_INFO": "유재우, 손미경 지음.",
            "PUBLISHER": "에디터",
            "PUB_YEAR_INFO": "2015.",
            "MANAGE_CODE": "MB",
            "MANAGE_DESC": "도봉어린이문화정보도서관",
            "SUBJECT_CODE": "9",
            "SUBJECT_DESC": "역사",
            "USE_LIMIT_CODE": "GM",
            "USE_LIMIT_DESC": "일반",
            "ISBN": "9788967440886",
            "REG_NO": "AR0000013107",
            "SHELF_LOC_CODE": "001",
            "SHELF_LOC_DESC": "일반자료실",
            "SEPARATE_SHELF_CODE": "",
            "SEPARATE_SHELF_DESC": "적용안함",
            "CLASS_NO": "981.302",
            "BOOK_CODE": "유72ㄷ",
            "WORKING_STATUS": "BOL112N",
            "WORKING_STATUS_DESC": "배가자료(소장자료)",
            "BOOK_APPENDIX_FLAG": "B",
            "BOOK_APPENDIX_DESC": "책"
          },
          ...
        ]
      },
      "numOfRows": 10,
      "pageNo": 1,
      "totalCount": 123570
    }
  }
}
```

<br>

### Example Flow

![image](https://user-images.githubusercontent.com/86189596/192157628-740ae4a4-2433-4dc8-9773-83bc20d2687a.png)

<br>

### http request node

Enter the API URL you want to receive a REST API response from in the URL. The output will be `msg.payload` and its data format is json or xml.

![image](https://user-images.githubusercontent.com/86189596/192157660-83666787-8fe0-411a-bbd1-dfcc8ac1f577.png)

<br>

### data extractor node

> Initial

This is the initial status of data extractor node config.

![image](https://user-images.githubusercontent.com/86189596/192157781-63b576b8-a2a4-4375-bc03-379e112d7106.png)

<br>

> Type and URL


Put the API URL you are expecting a response from in the URL. For Type, select the format of the expected response data exactly. We construct the Key Tree from the responses we receive here.

<br>

> READ Button

After setting the URL and Type and clicking the `Read` button, the Key Tree created from the response data is displayed in the `Key` section.

![image](https://user-images.githubusercontent.com/86189596/192157929-4e08f99b-940b-474e-9a89-a25c9fc64dd7.png)

<br>

> Check of paths

Click the checkbox of the specific data you want to extract. At this time, the absolute path to the checkbox is displayed in the `Path` section.

![image](https://user-images.githubusercontent.com/86189596/192158032-0d4c4089-53ae-4169-9b42-ba2f0db0c620.png)

<br>

> output

Output is returned in the form of msg.payload.