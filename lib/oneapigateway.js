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

var param = {};
var targetApiUrl = "";
var authToken = "";

var callOneApi = function(apiGroup, operationId, keyObject, qsObject, bodyObject, tokenObject, callBack, isLogging){
	//# STEP 1 : GENERATE TARGET URL
	authToken = tokenObject;

	targetApiUrl = generateUrl(apiGroup, operationId, keyObject, qsObject, bodyObject);

	var pmethod = apiProfile[apiGroup][operationId].httpMethod;

	console.log(` request method : ${pmethod} / url : ${targetApiUrl}`  );
	if(isLogging){
		if(pmethod == "POST") {
			console.log("         body : %j", bodyObject);
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
		return requestApi(apiProfile[apiGroup][operationId].httpMethod, targetApiUrl, bodyObject, callBack, isLogging);
	} else {
		return targetApiUrl
	}
};

//EX) generateUrl('device', 'getDevices', null, '{capability:operationable...}', null);
var generateUrl = function(apiGroup, operationId, keyObj, qsObj, bodyObj) {
	var url = apiProfile[apiGroup][operationId].relativePath;
	var method = apiProfile[apiGroup][operationId].httpMethod;
	var keys = apiProfile[apiGroup][operationId].keys;
	var qs = apiProfile[apiGroup][operationId].qs;
	var body = apiProfile[apiGroup][operationId].body;

	var targetUrl = '';
	var queryString = '';

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
var requestApi = function(pmethod, url, param, callBack, isLogging){

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
		if(isLogging){
			error && console.log(" response error : ", error);
			console.log(" response statusCode : ", response && response.statusCode);
			console.log("          body : ", body && JSON.stringify(body));
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
