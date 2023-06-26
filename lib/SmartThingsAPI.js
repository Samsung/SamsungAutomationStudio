const _axios = require('axios');
const baseApiUrl = "https://api.smartthings.com/v1";
const ST_KEY_URL = "https://key.smartthings.com"
const ST_API_BASE = 'https://api.smartthings.com/v1';

const axiosConfig = {};
if (process.env.https_proxy || process.env.http_proxy) {
	axiosConfig.httpsAgent = new HttpsProxyAgent(process.env.https_proxy || process.env.http_proxy);
	axiosConfig.proxy = false;
}
const axios = _axios.create(axiosConfig);

function keyValidate(keyId) {
    return axios.get(ST_KEY_URL + keyId);
}
function confirmUrl(url){
    return axios.get(url);
}
function getLocations(token){
    const config = { headers: { Authorization: `Bearer ${token}` } };
    return axios.get(ST_API_BASE + '/locations', config);
}
function getLocationsRooms(token,locationId){
    const config = { headers: { Authorization: `Bearer ${token}` } };
    return axios.get(ST_API_BASE + `/locations/${locationId}/rooms`, config);
}
function getDevices(token) {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    return axios.get(ST_API_BASE + `/devices`, config);
}
function getCapability(token,cpId,cpVersion){
    const config = { headers: { Authorization: `Bearer ${token}` } };
    return axios.get(ST_API_BASE + `/capabilities/${cpId}/${cpVersion || 1}`, config);
}

module.exports = {
    keyValidate: keyValidate,
    confirmUrl:confirmUrl,
    getLocations:getLocations,
    getLocationsRooms:getLocationsRooms,
    getDevices:getDevices,
    getCapability:getCapability
};
