// Generate random room name if needed
if (!location.hash) {
    location.hash = Math.floor(Math.random() * 0xFFFFFF).toString(16);
}
const roomHash = location.hash.substring(1)
 
console.log(roomHash, 'roomHash--查看地址---');
let localVideo = document.querySelector('.local')
// let remoteVideo = document.querySelector('.remote')
let localPeer
let room 
const configuration = {
    iceServers: [{
        urls: 'stun:stun.l.google.com:19302'
    }]
}

const drone = new ScaleDrone('yiS12Ts5RdNhebyM')
console.log('drone',drone);
const roomName = 'observable-'+ roomHash
drone.on('open', error=>{
    if(error){
        return console.error(error, 'drone open错误')
    }
    room = drone.subscribe(roomName)
    room.on('open', error=>{
        if(error){
            console.log(error);
        }
    })
    room.on('members', members =>{
        console.log(`members------`, members);
        const isOffer = members.length == 2
        startWebRTC(isOffer)
    })
})


// startWebRTC()
function icecandidateHandle(event){
    // console.log(event, 'icecandidateHandle');
    if(event.candidate){
        sendMessage({'candidate': event.candidate, name: 'cxs1'})
    }

}
function localCreated(desc){
    localPeer.setLocalDescription(desc).then(()=>{
        sendMessage({'sdp': localPeer.localDescription})
    }).catch(errFun)
}

function sendMessage(message){
    drone.publish({
        room: roomName,
        message
    })
}

function startWebRTC(isOffer) {
    localPeer = new RTCPeerConnection(configuration)
    console.log('本地的lcoalPeer', localPeer);

    localPeer.onicecandidate = icecandidateHandle
    console.log('offer---', isOffer);
    if(isOffer){
        localPeer.onnegotiationneeded = ()=>{
            localPeer.createOffer().then(localCreated).catch(errFun)
        }
    } 

    localPeer.ontrack = event => {
        console.log('监听到的本地添加stream事件成功---', event);
        let stream = event.streams[0]
        remoteVideo.srcObject = stream;
    }
    
    navigator.mediaDevices.getUserMedia({video: {
        width: 480,
        height:320
    }, audio: {
        volume: 0.2
    }}).then(mediaStream=>{
        let stream = mediaStream
        localVideo.srcObject = stream
        try {
            stream.getTracks().forEach(track=> localPeer.addTrack(track, stream))
        } catch (error) {
            console.error('ee--', error);            
        }
    }).catch(errFun)
    room.on('data', (message, client)=>{
        console.log('message', message, 'client-',client);
        if(client.id == drone.clientId){
            return
        }
        if(message.sdp){
            localPeer.setRemoteDescription(new RTCSessionDescription(message.sdp)).then(()=>{
                if(localPeer.remoteDescription.sdp == 'offer'){
                    localPeer.createAnswer().then(localCreated).catch(errFun)
                }
            }).catch(errFun)
        }else if(message.candidate){
            localPeer.addIceCandidate(new RTCIceCandidate(message.candidate)).then(()=>{}).catch(err=>{})
        }

    })
}





function errFun(err) {
    console.log(`错误信息----${err.message}, ${err}`);
}