# data-filter

A node that filter out specific data you want from REST API response.

<br>

## Usage

A node that filter out specific data you want from REST API response. The criteria for filtering starts from data that satisfy a specific path and value.

<br>

## Properties

### Type

You can choose the type of input data format between JSON and XML.

### URL

This URL makes the data structure tree of API response keys.

### Standard Key
This path is the path to check to extract specific target data. It is made by REST API response of URL.

### Compare
It is a reference value required to extract specific data through comparison of data corresponding to the above path.

### Output
It is data paths that are sibling to reference data. You can check about multiple selection.

<br>

## Features

### Data Path Generator

If you check the location of the target data you want, the absolute path to the location is checked. This is a unique path to find the target data.

|unchecked|checked and added|
|:---:|:---:|
|![image](https://user-images.githubusercontent.com/86189596/192461923-e3789268-736a-41bb-ae44-981c7e6d5512.png)|![image](https://user-images.githubusercontent.com/86189596/192462103-a9d55960-7154-4833-acc0-c421315d2f1c.png)|

<br>

### JSON and XML

This node provides two input data types: JSON and XML. You can choose from these two types.

![image](https://user-images.githubusercontent.com/86189596/192462655-09a38b6b-911a-40b8-bf12-4de5b3c4c863.png)

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

![image](https://user-images.githubusercontent.com/86189596/192275973-9e1eaa9c-b5dc-4056-ae9b-3c4c859dcf00.png)

<br>

### http request node

Enter the API URL you want to receive a REST API response from in the URL. The output will be `msg.payload` and its data format is json or xml.

![image](https://user-images.githubusercontent.com/86189596/192157660-83666787-8fe0-411a-bbd1-dfcc8ac1f577.png)

<br>

### data filter node

> Initial

This is the initial status of data filter node config.

![image](https://user-images.githubusercontent.com/86189596/192275746-facfea53-1ec7-48b1-a447-e7edcb00dc0c.png)

<br>

> Type and URL

Put the API URL you are expecting a response from in the URL. For Type, select the format of the expected response data exactly. We construct the Key Tree from the responses we receive here.

<br>

> READ Button

After setting the URL and Type and clicking the `Read` button, the Key Tree created from the response data is displayed in the `Standard Key` section.

![image](https://user-images.githubusercontent.com/86189596/192283393-3c6b376c-f481-4857-8197-f89cad3cc8bc.png)

<br>

> Check of standard key path

Click on the reference path you want to reference through the radio button. At this time, the absolute path to the radio button is displayed in the `compare` section.

![image](https://user-images.githubusercontent.com/86189596/192336170-d716f168-c6ca-4ef4-b510-1881a984a22c.png)

<br>

> compare value

The compare value is a standard value to compare the data of the standard key path. If the standard key path data is the same as the compare value, it is extracted as the target data.
You can choose from three types: string, number, and boolean.

![image](https://user-images.githubusercontent.com/86189596/192461192-26e067d5-9463-4095-9feb-da5056922ac6.png)

<br>

> output

Output is returned in the form of msg.payload.