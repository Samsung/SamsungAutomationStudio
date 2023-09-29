# @good-i-deer/node-red-contrib-chromadb

[![platform](https://img.shields.io/badge/platform-Node--RED-red)](https://nodered.org)
[![npm version](https://badge.fury.io/js/@good-i-deer%2Fnode-red-contrib-chromadb.svg)](https://badge.fury.io/js/@good-i-deer%2Fnode-red-contrib-chromadb)
[![GitHub license](https://img.shields.io/github/license/GOOD-I-DEER/node-red-contrib-chromadb)](https://github.com/GOOD-I-DEER/node-red-contrib-chromadb/blob/main/LICENSE)

This module provides a node that connects and operates with ChromaDB in Node-RED.

These nodes require node.js version 18.16.1 and Node-RED version 3.1.0.

<hr>

## Description

This node is part of the Facial Recognition with AI package.  
If you would like to see the entire package, please go to the link.
[@good-i-deer/node-red-contrib-vision-ai](https://www.npmjs.com/package/@good-i-deer/node-red-contrib-vision-ai)

ChromaDB is the open-source embedding database. ChromaDB makes it easy to store and query embedded values. This node makes it possible to run ChromaDB operations(create/delete collection, insert/query/delete embedding) in Node-RED.

<hr>

## Pre-requisites

The Node-Red-Contrib-ChromaDB requires [Node-RED](https://nodered.org) to be installed and requires a running [Chroma-DB](https://github.com/chroma-core/chroma) server.

If necessary, you can install and run the chromaDB server on local. Please refer to [Getting Started](https://docs.trychroma.com/getting-started).

<hr>

## Install

```
cd ~/.node-red
npm install @good-i-deer/node-red-contrib-chromadb
```

Restart your Node-RED instance.

<hr>

## Input

Single Embedding

- The input could be an embedding value in the form of an array of real numbers.
- Used for input of **insert** or **query** operation.

Embedding Array

- The input could be embedding values in the form of an array of real number arrays.
- Used for input of **insert** or **query** operation.

ID Array

- The input could be one or more ids in the form of an array of string.
- Used for input of **delete** operation.

<hr>

## property

![image](https://github.com/GOOD-I-DEER/node-red-contrib-chromadb/blob/main/img/properites.png)

Name

- The name of the node displayed on the screen.

Host

- The addreess where ChromaDB server is running.

Port

- The port number where ChromDB server is running.

Operation

- The operation that want to run on ChromaDB.

- Operation Types

  - list: list all collections in ChromaDB server.

  - create: create collection. Does not create if the collection with same name already exists.

  - insert: insert embedding value(s) into the collection.

  - query: query the N nearest distance embeddings.

  - delete: delete embedding with id.

  - drop: drop collection.

DB Name

- The name of DB(collection) that you want to create, delete, or apply the operation.

Dist Method

- The distance method for calculating distances between embeddings.

- You can set the distance method when you create DB.

Result Count

- The number of result you want to get when you run query operation.

- Query operation return N(=result count) nearest distance for each embedding.

<hr>

## Output

Collection list

- After list operation, collection list in the form of a string array are passed within _msg.payload_.

ID Array

- After inserting embeddings, IDs in the form of a string array are passed within _msg.result_.

Query Response

- After querying embeddings, the query response, which contains IDs, distances, metadatas, and documents in the form of an object, is passed within _msg.payload_.

Result

- After create, drop operation, the result explaining success of operation in the form of a string is passed within _msg.result_.

<hr>

## Examples

The following are example flows using Good ChromaDB.

![image](https://github.com/GOOD-I-DEER/node-red-contrib-chromadb/blob/main/img/example.png)

### JSON

```
[
    {
        "id": "1e6ef671efdf6e7b",
        "type": "tab",
        "label": "ChromaDB",
        "disabled": false,
        "info": "",
        "env": []
    },
    {
        "id": "4792f9f4b8190c2f",
        "type": "inject",
        "z": "1e6ef671efdf6e7b",
        "name": "",
        "props": [],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "x": 290,
        "y": 320,
        "wires": [
            [
                "a1d2c13b66902955"
            ]
        ]
    },
    {
        "id": "a1d2c13b66902955",
        "type": "chroma-db",
        "z": "1e6ef671efdf6e7b",
        "name": "Create Collection",
        "dbIp": "http://localhost",
        "dbPort": "8000",
        "dbName": "MyCollection",
        "distance": "cosine",
        "operation": "create",
        "nResults": "1",
        "x": 530,
        "y": 320,
        "wires": [
            [
                "c6332d85335a6f9f"
            ]
        ]
    },
    {
        "id": "c6332d85335a6f9f",
        "type": "debug",
        "z": "1e6ef671efdf6e7b",
        "name": "Result",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "result",
        "targetType": "msg",
        "statusVal": "",
        "statusType": "auto",
        "x": 750,
        "y": 320,
        "wires": []
    },
    {
        "id": "d831e3ae54f820d8",
        "type": "inject",
        "z": "1e6ef671efdf6e7b",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "[[1.2, 2.4, 4.5], [2.2, 4.4, 4.5]]",
        "payloadType": "jsonata",
        "x": 1110,
        "y": 420,
        "wires": [
            [
                "ad9903267e9a109b"
            ]
        ]
    },
    {
        "id": "ad9903267e9a109b",
        "type": "chroma-db",
        "z": "1e6ef671efdf6e7b",
        "name": "",
        "dbIp": "http://localhost",
        "dbPort": "8000",
        "dbName": "MYDB",
        "distance": "cosine",
        "operation": "insert",
        "nResults": "1",
        "x": 1330,
        "y": 420,
        "wires": [
            [
                "db21bb7308955554",
                "2d3e04c4cc2c2b16"
            ]
        ]
    },
    {
        "id": "db21bb7308955554",
        "type": "debug",
        "z": "1e6ef671efdf6e7b",
        "name": "debug 18",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 1600,
        "y": 420,
        "wires": []
    },
    {
        "id": "2d3e04c4cc2c2b16",
        "type": "debug",
        "z": "1e6ef671efdf6e7b",
        "name": "debug 19",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "result",
        "targetType": "msg",
        "statusVal": "",
        "statusType": "auto",
        "x": 1600,
        "y": 380,
        "wires": []
    },
    {
        "id": "1f6586aa27c10340",
        "type": "inject",
        "z": "1e6ef671efdf6e7b",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "[[1.2, 2.4, 4.5], [2.2, 4.4, 4.5]]",
        "payloadType": "jsonata",
        "x": 1110,
        "y": 560,
        "wires": [
            [
                "f23b2a02822fdbe3"
            ]
        ]
    },
    {
        "id": "f23b2a02822fdbe3",
        "type": "chroma-db",
        "z": "1e6ef671efdf6e7b",
        "name": "",
        "dbIp": "http://localhost",
        "dbPort": "8000",
        "dbName": "MYDB",
        "distance": "cosine",
        "operation": "query",
        "nResults": "1",
        "x": 1330,
        "y": 560,
        "wires": [
            [
                "ab8fe1561ab6a3d1",
                "92a820088001b3d5"
            ]
        ]
    },
    {
        "id": "ab8fe1561ab6a3d1",
        "type": "debug",
        "z": "1e6ef671efdf6e7b",
        "name": "debug 20",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 1600,
        "y": 560,
        "wires": []
    },
    {
        "id": "92a820088001b3d5",
        "type": "debug",
        "z": "1e6ef671efdf6e7b",
        "name": "debug 21",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "result",
        "targetType": "msg",
        "statusVal": "",
        "statusType": "auto",
        "x": 1600,
        "y": 520,
        "wires": []
    },
    {
        "id": "f778fec7898a9492",
        "type": "inject",
        "z": "1e6ef671efdf6e7b",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "[\"id-1\", \"id-3\"]",
        "payloadType": "jsonata",
        "x": 1110,
        "y": 700,
        "wires": [
            [
                "1108f63a24c5d88d"
            ]
        ]
    },
    {
        "id": "1108f63a24c5d88d",
        "type": "chroma-db",
        "z": "1e6ef671efdf6e7b",
        "name": "",
        "dbIp": "http://localhost",
        "dbPort": "8000",
        "dbName": "MYDB",
        "distance": "cosine",
        "operation": "delete",
        "nResults": "1",
        "x": 1330,
        "y": 700,
        "wires": [
            [
                "6586731ca4687b22",
                "81313c3fb44866e5"
            ]
        ]
    },
    {
        "id": "6586731ca4687b22",
        "type": "debug",
        "z": "1e6ef671efdf6e7b",
        "name": "debug 22",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 1600,
        "y": 700,
        "wires": []
    },
    {
        "id": "81313c3fb44866e5",
        "type": "debug",
        "z": "1e6ef671efdf6e7b",
        "name": "debug 23",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "result",
        "targetType": "msg",
        "statusVal": "",
        "statusType": "auto",
        "x": 1600,
        "y": 660,
        "wires": []
    },
    {
        "id": "1d56935af7702c2d",
        "type": "comment",
        "z": "1e6ef671efdf6e7b",
        "name": "Good I Deer ChromaDB",
        "info": "",
        "x": 320,
        "y": 200,
        "wires": []
    },
    {
        "id": "d667ed331e78790d",
        "type": "inject",
        "z": "1e6ef671efdf6e7b",
        "name": "Embeddings",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "[[1.2, 2.4, 4.5], [2.2, 4.4, 4.5]]",
        "payloadType": "jsonata",
        "x": 310,
        "y": 380,
        "wires": [
            [
                "570b7979c422cf5d"
            ]
        ]
    },
    {
        "id": "570b7979c422cf5d",
        "type": "chroma-db",
        "z": "1e6ef671efdf6e7b",
        "name": "Insert Embeddings",
        "dbIp": "http://localhost",
        "dbPort": "8000",
        "dbName": "MyCollection",
        "distance": "cosine",
        "operation": "insert",
        "nResults": "1",
        "x": 530,
        "y": 380,
        "wires": [
            [
                "e778da936ae795f4"
            ]
        ]
    },
    {
        "id": "e778da936ae795f4",
        "type": "debug",
        "z": "1e6ef671efdf6e7b",
        "name": "Result",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "result",
        "targetType": "msg",
        "statusVal": "",
        "statusType": "auto",
        "x": 750,
        "y": 380,
        "wires": []
    },
    {
        "id": "6ae163d47c1f45cf",
        "type": "inject",
        "z": "1e6ef671efdf6e7b",
        "name": "Embeddings",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "[[1.2, 2.4, 4.5], [2.2, 4.4, 4.5]]",
        "payloadType": "jsonata",
        "x": 310,
        "y": 440,
        "wires": [
            [
                "ad2edd8fdd7f5a59"
            ]
        ]
    },
    {
        "id": "ad2edd8fdd7f5a59",
        "type": "chroma-db",
        "z": "1e6ef671efdf6e7b",
        "name": "Query Embeddings",
        "dbIp": "http://localhost",
        "dbPort": "8000",
        "dbName": "MyCollection",
        "distance": "cosine",
        "operation": "query",
        "nResults": "5",
        "x": 530,
        "y": 440,
        "wires": [
            [
                "32ea1864d84fdb4e"
            ]
        ]
    },
    {
        "id": "32ea1864d84fdb4e",
        "type": "debug",
        "z": "1e6ef671efdf6e7b",
        "name": "Payload",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "payload",
        "targetType": "msg",
        "statusVal": "",
        "statusType": "auto",
        "x": 760,
        "y": 440,
        "wires": []
    },
    {
        "id": "8c25f32070d63b87",
        "type": "inject",
        "z": "1e6ef671efdf6e7b",
        "name": "IDs",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "[\"id-1\", \"id-2\"]",
        "payloadType": "jsonata",
        "x": 290,
        "y": 500,
        "wires": [
            [
                "ce5b74ea33560546"
            ]
        ]
    },
    {
        "id": "ce5b74ea33560546",
        "type": "chroma-db",
        "z": "1e6ef671efdf6e7b",
        "name": "Delete Embeddings",
        "dbIp": "http://localhost",
        "dbPort": "8000",
        "dbName": "MyCollection",
        "distance": "cosine",
        "operation": "delete",
        "nResults": "5",
        "x": 530,
        "y": 500,
        "wires": [
            [
                "67946cfb0b10bac5"
            ]
        ]
    },
    {
        "id": "67946cfb0b10bac5",
        "type": "debug",
        "z": "1e6ef671efdf6e7b",
        "name": "Result",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "result",
        "targetType": "msg",
        "statusVal": "",
        "statusType": "auto",
        "x": 750,
        "y": 500,
        "wires": []
    },
    {
        "id": "4acb518fd1eb8271",
        "type": "inject",
        "z": "1e6ef671efdf6e7b",
        "name": "",
        "props": [],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "x": 290,
        "y": 260,
        "wires": [
            [
                "5ca25edbc0087091"
            ]
        ]
    },
    {
        "id": "5ca25edbc0087091",
        "type": "chroma-db",
        "z": "1e6ef671efdf6e7b",
        "name": "Insert Embeddings",
        "dbIp": "http://localhost",
        "dbPort": "8000",
        "dbName": "MyCollection",
        "distance": "cosine",
        "operation": "list",
        "nResults": "1",
        "x": 530,
        "y": 260,
        "wires": [
            [
                "63358d81ceaa24de"
            ]
        ]
    },
    {
        "id": "63358d81ceaa24de",
        "type": "debug",
        "z": "1e6ef671efdf6e7b",
        "name": "Payload",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "payload",
        "targetType": "msg",
        "statusVal": "",
        "statusType": "auto",
        "x": 760,
        "y": 260,
        "wires": []
    },
    {
        "id": "624f10863faede9f",
        "type": "inject",
        "z": "1e6ef671efdf6e7b",
        "name": "",
        "props": [],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "x": 290,
        "y": 560,
        "wires": [
            [
                "b012cae245dd3643"
            ]
        ]
    },
    {
        "id": "b012cae245dd3643",
        "type": "chroma-db",
        "z": "1e6ef671efdf6e7b",
        "name": "Drop Collection",
        "dbIp": "http://localhost",
        "dbPort": "8000",
        "dbName": "MyCollection",
        "distance": "cosine",
        "operation": "drop",
        "nResults": "1",
        "x": 520,
        "y": 560,
        "wires": [
            [
                "796b026101abc5f9"
            ]
        ]
    },
    {
        "id": "796b026101abc5f9",
        "type": "debug",
        "z": "1e6ef671efdf6e7b",
        "name": "Result",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "result",
        "targetType": "msg",
        "statusVal": "",
        "statusType": "auto",
        "x": 750,
        "y": 560,
        "wires": []
    }
]
```

<hr>

## Discussions and suggestions

Use [GitHub Issues](https://github.com/GOOD-I-DEER/node-red-contrib-chromadb/issues) to ask questions or to discuss new features.

<hr>

## Authors

[**GOOD-I-DEER**](https://github.com/GOOD-I-DEER) in SSAFY(Samsung Software Academy for Youth) 9th

- [Kim Jaea](https://github.com/kimjaea)
- [Yi Jong Min](https://github.com/chickennight)
- [Lee Deok Yong](https://github.com/Gitgloo)
- [Lee Che Lim](https://github.com/leecr1215)
- [Lee Hyo Sik](https://github.com/hy06ix)
- [Jung Gyu Sung](https://github.com/ramaking)
<hr>

## Copyright and license

Copyright Samsung Automation Studio Team under the [Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0)

<hr>

## Reference

- [Node-RED Creating Nodes](https://nodered.org/docs/creating-nodes/)
- [SamsungAutomationStudio Github Repository](https://github.com/Samsung/SamsungAutomationStudio)
- [ChromaDB Github Repository](https://github.com/chroma-core/chroma)
