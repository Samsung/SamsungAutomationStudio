const SmartThingsAPI = require('./SmartThingsAPI');
const fs = require('fs');
const path = require('path');
_PATs={};
_capabilities={};

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
function PATremoveNodeId(nodeId){
    Object.values(_PATs).forEach(PR=>
            PR.then(PAT=>{
                PAT.nodeIds.has(nodeId)&&PAT.nodeIds.delete(nodeId);
            }).catch(()=>{})
    )
}
function clearUnusedPAT(){
    Object.keys(_PATs).forEach(pat=>{
        _PATs[pat]&&_PATs[pat].then(PAT=>{
            if(PAT && PAT.nodeIds && PAT.nodeIds.size==0){
                delete _PATs[pat];
            }
        })
    })
}
function addpat(nodeId,pat,isRefresh){
    PATremoveNodeId(nodeId);

    if(!pat){
        clearUnusedPAT();
        return Promise.resolve(null);
    }
    if(!_PATs[pat]||isRefresh){
        const PAT = {};
        if(_PATs[pat]){
            _PATs[pat].then(_PAT=>{
                PAT.nodeIds=_PAT.nodeIds||new Set();
                PAT.nodeIds.add(nodeId);
            })
        }else{
            PAT.nodeIds = new Set();
            PAT.nodeIds.add(nodeId);
        }
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
                                        location.rooms.push({locationId:location.locationId,roomId:'undefined',name:"'undefined'"});
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
                delete _PATs[pat];
                failed.push(`getDevices failed : ${e}`)
                return Promise.resolve(null);
            })


        _PATs[pat]=getLocationsPR
            .finally(()=>getDevicesPR)
            .then((results)=>{
                if(failed.length>0){
                    console.log(`SmartThings pat=${pat} failed, ${failed.join(' / ')}`);
                }
                if(PAT.devices){
                    _PATs[pat]=Promise.resolve(PAT);
                    return Promise.resolve(PAT);
                }else{
                    delete _PATs[pat];
                    return Promise.resolve(null);
                }
            })
    }else if(_PATs[pat]){
        return _PATs[pat].then(PAT=>{
            if(PAT){
                PAT.nodeIds = PAT.nodeIds||new Set();
                PAT.nodeIds.add(nodeId);
                clearUnusedPAT();
            }
        })
    }
}
function getPATs(){
    const PRs = Object.keys(_PATs).map(pat=>getPAT(pat).then(PAT=>(PAT)?{[pat]:PAT}:null));
    if(PRs.length>0){
        return Promise.all(PRs)
            .then(results=>results.filter(PAT=>PAT).reduce((PATs,PAT)=>Object.assign(PATs,PAT),{}))
            .catch(e=>console.log('SmartThings getPATs failed : ',e))
    }else{
        return Promise.resolve(null);
    }
}
function getPAT(pat){
    if(_PATs[pat]){
        return _PATs[pat];
    }else{
        return Promise.resolve(null);
    }
}
module.exports = {
    getCapabilities:getCapabilities,
    addpat:addpat,
    getPAT:getPAT,
    getPATs:getPATs    
}