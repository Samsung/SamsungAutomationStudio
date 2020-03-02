var apiProfile = {
    "device": {
        "getDeviceStates": {
            "relativePath": "/devices/{deviceId}/status",
            "httpMethod":"GET",
            "keys": {
                "deviceId": ""
            }
        },
        "executeDeviceCommands": {
            "relativePath": "/devices/{deviceId}/commands",
            "httpMethod":"POST",
            "keys": {
                "deviceId": ""
            },
            "body": {
                "executeCapabilityCommand ":{
                    "component": "",
                    "capability": "",
                    "command": "",
                    "arguments": []
                },
                "required": true,
                "schema": {
                    "dataType": "array"
                }
            }
        }
      },
      "subscriptions":{
        "executeCreateSubscription": {
            "relativePath": "/installedapps/{installedAppId}/subscriptions",
            "httpMethod":"POST",
            "keys": {
                "installedAppId": ""
            },
            "body": {
                "sourceType": "DEVICE",
                "device": {
                    "componentId": "",
                    "deviceId": "",
                    "capability": "",
                    "attribute": "",
                    "stateChangeOnly": true,
                    "subscriptionName": "",
                    "value": ""
                }
            }
        },
        "executeDeleteSubscription": {
            "relativePath": "/installedapps/{installedAppId}/subscriptions",
            "httpMethod":"DELETE",
            "keys": {
                "installedAppId": ""
            }
        }
    }
};
var request = require('request');
var baseApiUrl = "https://api.smartthings.com/v1";

/*
var ONE_API_URL = {
	test: "http://127.0.0.1:8888",
	development: "https://apid.smartthingsgdev.com",
	staging: "https://apis.smartthingsgdev.com",
	production: "https://api.smartthings.com/v1"
};
*/

var param = {};
var targetApiUrl = "";
var authToken = "";

/*
	apiRole	: user role (samsung, 3rd-party)
	apiGroup : device
	operationId : operation(getDevices, getDeviceStates...)
	keyObject : deviceId, componentId, capabilityId
	qsObject :  Query string for 'getDevices'
	bodyObject : post method body object (executeDeviceCommands)

*/
var callOneApi = function(apiRole, apiGroup, operationId, keyObject, qsObject, bodyObject, tokenObject, callBack){
	//# STEP 1 : GENERATE TARGET URL
	authToken = tokenObject;

	targetApiUrl = generateUrl(apiRole, apiGroup, operationId, keyObject, qsObject, bodyObject);

	var pmethod = apiProfile[apiGroup][operationId].httpMethod;
	if(!process.env.GRUNT_TEST){
		console.log("------------------------------------------------------");
		console.log(`  method : ${pmethod}`);
		console.log(`  url : ${targetApiUrl}`);
		if(pmethod == "POST") {
			console.log("  body : %j", bodyObject);
		} else {
			if(qsObject != undefined && qsObject != null){
				console.log("  query : %j", qsObject);
			}else{
				console.log("  query : %j", keyObject);
			}
		}
	}

	//# STEP 2 : CALL REQUEST API
    if(targetApiUrl != null) {
		return requestApi(apiProfile[apiGroup][operationId].httpMethod, targetApiUrl, bodyObject, callBack);
	} else {
		return targetApiUrl
	}
};

//EX) generateUrl('samsung', 'device', 'getDevices', null, '{capability:operationable...}', null);
var generateUrl = function(apiRole, apiGroup, operationId, keyObj, qsObj, bodyObj) {
	var url = apiProfile[apiGroup][operationId].relativePath;
	var method = apiProfile[apiGroup][operationId].httpMethod;
	var keys = apiProfile[apiGroup][operationId].keys;
	var qs = apiProfile[apiGroup][operationId].qs;
	var body = apiProfile[apiGroup][operationId].body;

	var targetUrl = '';
	var queryString = '';

//0. Oauth2.0 인증
//1. 권한(role) 확인 (samsung keyword check )

//2. PARAMETER SETTING
	if (keys != undefined) {
		for(prop in keys) {
			for(key in keyObj) {
				if(prop == key) {
					url = url.replace('{'+prop+'}', keyObj[key])
				}
			}
		}
	}

	if (qs != undefined) {
		for(prop in qs) {
			var dataType = '';
			dataType = qs[prop].dataType;

			for(query in qsObj) {
				if(prop == query) {
					for(var i=0;i<qsObj[query].length;i++) {
						queryString += '&' + prop + '='+ qsObj[query][i]
					}
					if(qsObj[query].length == undefined) {
						queryString += '&' + prop + '='+ qsObj[query]
					}
				}
			}
		}
	}

	if (method == 'POST' && body == undefined) {
		return {'errCd':'500', 'errMsg':'Body is null'} // error code 정의 후 추후 수정
	}

// PARAMETER SETTING END
	if(queryString.length>0) {
		queryString = '?' + queryString.substring(1, queryString.length)
	}

	if(process.env.ONE_API_HOST){
		baseApiUrl = process.env.ONE_API_HOST;
	}

	targetUrl = baseApiUrl + url + queryString
	return targetUrl;
}


//REQUEST PROCESSING
var requestApi = function(pmethod, url, param, callBack){

	 var prox;
	 if (process.env.http_proxy != null) { prox = process.env.http_proxy; }
	 if (process.env.HTTP_PROXY != null) { prox = process.env.HTTP_PROXY; }

	 var headers = {
		 'Authorization': 'Bearer '+ authToken,
		 'Content-Type': 'application/json; charset=utf-8'
	 };

	//옵션 지정
	var options = {
		url: url,
		method: pmethod,
		headers: headers,
	};

	if(prox){
		options.proxy = prox;
	}

	options.json = true;
	if(pmethod == "POST") {
		options.body = param;
	}

	request(options, function (error, response, body) {
		if(!process.env.GRUNT_TEST){
			console.log("------------------------------------------------------");
			error && console.log("  error : ", error);
			console.log("  statusCode : ", response && response.statusCode);
			console.log("  body : ", body && JSON.stringify(body));
		}

		if(response != undefined){
			if (!error && (response.statusCode == 200 ||response.statusCode == 204)) {
				callBack(body);
			} else {
				callBack({'errCd':response.statusCode, 'errMsg':error});
			}
		} else {
			callBack({'errCd':'404', 'errMsg':'Not found'});
		}
	});
};

module.exports = {
  callOneApi:callOneApi
};
