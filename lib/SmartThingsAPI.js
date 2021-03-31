const request = require('request');
const baseApiUrl = "https://api.smartthings.com/v1";
const ST_KEY_URL = "https://key.smartthings.com"

function createReqOption(method,url,token){
    const option={
        method:method,
        url:url
    }
    if (process.env.http_proxy != null) {
        option.prox = process.env.http_proxy;
    }
    if (process.env.HTTP_PROXY != null) {
        option.prox = process.env.HTTP_PROXY;
    }
    if(token){
        option.headers = {Authorization: 'Bearer ' + token};
    }
    return option;
}

function keyValidate(keyId) {
    return new Promise((resolve, reject) => {
        request(createReqOption('GET',ST_KEY_URL + keyId), function (error, response, body) {
            if (error) {
                reject(error)
                return
            }
            resolve(response)
        });
    })
}
function confirmUrl(url){
    return new Promise((resolve, reject) => {
        request(createReqOption('GET',url), function (error, response, body) {
            if (error) {
                reject(error)
                return
            }
            resolve(response)
        });
    })
}
function getLocations(token){
    return new Promise((resolve, reject) => {
        request(createReqOption('GET',"https://api.smartthings.com/v1/locations",token), function (error, response, body) {
            if (error) {
                reject(error)
                return;
            }
            resolve(response)
        });
    })
}
function getLocationsRooms(token,locationId){
    return new Promise((resolve, reject) => {
        request(createReqOption('GET',`https://api.smartthings.com/v1/locations/${locationId}/rooms`,token), function (error, response, body) {
            if (error) {
                reject(error)
                return;
            }
            resolve(response)
        });
    })
}
function getDevices(token) {
    return new Promise((resolve, reject) => {
        request(createReqOption('GET','https://api.smartthings.com/v1/devices',token), function (error, response, body) {
            if (error) {
                reject(error)
                return;
            }
            resolve(response)
        });
    })
}
function getCapability(token,cpId,cpVersion){
    return new Promise((resolve, reject) => {
        request(createReqOption('GET',`https://api.smartthings.com/v1/capabilities/${cpId}/${cpVersion||1}`,token), function (error, response, body) {
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
