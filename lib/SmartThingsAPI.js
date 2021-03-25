const request = require('request');
const baseApiUrl = "https://api.smartthings.com/v1";
const ST_KEY_URL = "https://key.smartthings.com"

/*
var ONE_API_URL = {
	test: "http://127.0.0.1:8888",
	development: "https://apid.smartthingsgdev.com",
	staging: "https://apis.smartthingsgdev.com",
	production: "https://api.smartthings.com/v1"
};*/

function keyValidate(keyId) {
    var options = {
        url: ST_KEY_URL + keyId,
        method: 'GET',
    };
    if (process.env.http_proxy != null) {
        options.prox = process.env.http_proxy;
    }
    if (process.env.HTTP_PROXY != null) {
        options.prox = process.env.HTTP_PROXY;
    }

    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (error) {
                reject(error)
                return
            }
            resolve(response)
        });
    })
}
function confirmUrl(url){
    var options = {
        url: url,
        method: 'GET',
    };
    if (process.env.http_proxy != null) {
        options.prox = process.env.http_proxy;
    }
    if (process.env.HTTP_PROXY != null) {
        options.prox = process.env.HTTP_PROXY;
    }
    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (error) {
                reject(error)
                return
            }
            resolve(response)
        });
    })
}
function getLocations(token){
    var options = {              
        url: "https://api.smartthings.com/v1/locations",
        method: "GET",
        headers: {Authorization: 'Bearer ' + token}
    };
    if (process.env.http_proxy != null) {options.prox = process.env.http_proxy;}
    if (process.env.HTTP_PROXY != null) {options.prox = process.env.HTTP_PROXY;}

    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (error) {
                reject(error)
                return;
            }
            resolve(response)
        });
    })
}
function getLocationsRooms(token,locationId){
    var options = {
        url: `https://api.smartthings.com/v1/locations/${locationId}/rooms`,
        method: "GET",
        headers: {Authorization: 'Bearer ' + token}
    };
    if (process.env.http_proxy != null) {options.prox = process.env.http_proxy;}
    if (process.env.HTTP_PROXY != null) {options.prox = process.env.HTTP_PROXY;}

    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (error) {
                reject(error)
                return;
            }
            resolve(response)
        });
    })
}
function getDevices(token) {
    var options = {
        url: `https://api.smartthings.com/v1/devices`,
        method: "GET",
        headers: {Authorization: 'Bearer ' + token}
    }

    if (process.env.http_proxy != null) {options.prox = process.env.http_proxy;}
    if (process.env.HTTP_PROXY != null) {options.prox = process.env.HTTP_PROXY;}

    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (error) {
                reject(error)
                return;
            }
            resolve(response)
        });
    })
}
function getCapability(token,cpId,cpVersion){
    var options = {
        url: `https://api.smartthings.com/v1/capabilities/${cpId}/${cpVersion||1}`,
        method: "GET",
        headers: {Authorization: 'Bearer ' + token}
    }

    if (process.env.http_proxy != null) {options.prox = process.env.http_proxy;}
    if (process.env.HTTP_PROXY != null) {options.prox = process.env.HTTP_PROXY;}

    return new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (error) {
                reject(error)
                return;
            }
            resolve(response)
        });
    })
}
module.exports = {
    keyValidate: keyValidate,
    confirmUrl:confirmUrl,
    getLocations:getLocations,
    getLocationsRooms:getLocationsRooms,
    getDevices:getDevices,
    getCapability:getCapability
};
