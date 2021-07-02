const SmartThingsAPI = require('./SmartThingsAPI');
const fs = require('fs');
const path = require('path');

let _capabilities={};
let _mydevices={};

if(!Array.prototype.flat){
    Array.prototype.flat=function(){
        return this.reduce(function(a,b){
            if(Array.isArray(b)&&b.length>0){
                a = a.concat(b);
            }else{
                a.push(b);
            }
            return a;
        },[]);
    }
}

fs.readFile(path.join(__dirname,'SmartThingsCapabilities.json'), (err, data) => {
    if (err) throw err;
    const temp = JSON.parse(data);
    temp.forEach(addCapability); 
  });

function addCapability(cp){
    if(!cp.vid){
        cp.vid = `${cp.id}_v${cp.version}`;
    }
    _capabilities[cp.vid]=cp;
}
function getCapabilities(){
    return _capabilities;
}
function getCapability(vid,version) {
    if(version){
        vid = vid+'_v'+version;
    }
    if(vid&&vid.indexOf('_v')===-1){
        vid+='_v1';
    }
    return _capabilities[vid] || null;
}
function addMydeviceInfo(nodeId,pat){
	if(!pat){
		_mydevices[nodeId]=Promise.resolve(null);
		return Promise.resolve(null);
	}
    const PAT = {};
    let failed = [];
    const getLocationsPR = SmartThingsAPI.getLocations(pat)
        .then(response=>{
            if(response.statusCode==200 && response.body){
                let locationsResult = JSON.parse(response.body);
                return Promise.all(
                    locationsResult.items
                    .sort((l1,l2) => l1.name.localeCompare(l2.name))
                    .map(location=>{
                        return SmartThingsAPI.getLocationsRooms(pat, location.locationId)
                            .then(roomResponse => {
                                if(roomResponse.statusCode==200){
                                    const roomResult=JSON.parse(roomResponse.body);
                                    location.rooms=roomResult.items;
                                    location.rooms.sort((r1,r2)=> r1.name.localeCompare(r2.name));
                                    location.rooms.push({locationId:location.locationId,roomId:'undefined',name:"'unknown'"});
                                }
                            })
                    }))
                    .then(()=>PAT.locations = locationsResult.items)
                    .catch(e=>console.warn(e))
            }else{
                return Promise.reject(response.statusCode+' '+response.statusMessage);
            }
        }).catch(e=>failed.push(`getLocations failed : ${e}`))

    const getDevicesPR = SmartThingsAPI.getDevices(pat)
        .then(response=>{
            if(response.statusCode==200){
                let devicesResult = JSON.parse(response.body);
                return devicesResult.items
                    .map(d=>{
                        return {
                            deviceId:d.deviceId,
                            name:d.label||d.name,
                            locationId:d.locationId,
                            roomId:d.roomId,
                            components:d.components
                        }
                    })
            }else{
                return Promise.reject(response.statusCode+' '+response.statusMessage);
            }
        }).then(devices=>{
            PAT.devices=devices;
            PAT.customCps = PAT.devices.map(d=>d.components).flat()
                .map(cmp=>cmp.capabilities).flat()
                .map(cp=> cp.id+'_v'+cp.version)
                .filter(cpId=>/\./.test(cpId))//only custom capabilities
                .filter((cpId,idx,arr)=>arr.indexOf(cpId)==idx)//remove duplicate items
                .sort();
            return devices;
        }).then(devices=>{
            var prs = devices.map(d=>d.components).flat()
                .map(cmp=>cmp.capabilities).flat()
                .filter(cp=>!getCapability(cp.id,cp.version))
                .map(cp=>SmartThingsAPI.getCapability(pat,cp.id,cp.version)
                    .then(response=>{
                        if(response.statusCode==200&&typeof response.body == 'string'){
                            const cp = JSON.parse(response.body);
                            addCapability(cp);
                            return cp;
                        }
                    })
                )
            return Promise.all(prs).catch(()=>{})
        }).catch(e=>{
            failed.push(`getDevices failed : ${e}`)
            _mydevices[nodeId]=Promise.resolve(null);
            return Promise.resolve(null);
        })


    _mydevices[nodeId]=getLocationsPR
        .finally(()=>getDevicesPR)
        .then((results)=>{
            if(failed.length>0){
                console.log(`SmartThings pat=${pat} failed, ${failed.join(' / ')}`);
            }
            if(PAT.devices){
                _mydevices[nodeId]=Promise.resolve(PAT);
            }else{
                _mydevices[nodeId]=Promise.resolve(null);
            }
            return _mydevices[nodeId];
        })
}
function getMyDevices(){
	const result = {};
	return Promise.all(
		Object.keys(_mydevices).map(nodeId=>_mydevices[nodeId].then(info=>{result[nodeId]=info}))
		).then(()=>{return result});
}
module.exports = {
    getCapabilities:getCapabilities,
    addMydeviceInfo:addMydeviceInfo,
	getMyDevices:getMyDevices
}