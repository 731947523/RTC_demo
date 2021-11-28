let local = $('.local')[0]
let remote = $('.remote')[0]
let localVideo = $('.local video')[0]
let remoteVideo = $('.remote video')[0]
let start = $('.start')[0]
let call = $('.call')[0]
let stopC = $('.stop')[0]
let localStream
let pc1
let pc2

/* 
*   1、获取本地设备，采集本地视频流     将本地Stream防止全局
*   2、创建RTCpeerconnecttion
*   3、设置媒体数据：获取当前流的Tracks 遍历，将遍历出的Track，针对当前的peer进行添加track    即：pc1.addTrack(track, stream)
*   此处增加 pc2的onTrack 事件，进行展示    以及监听candidate事件
*   4、本地peer进行创建offer    此方法为Promise
*       5、成功回调，设置本地描述信息，且进行发生到signal
*       6、pc2接收远端信令后，进行设置本地描述信息，且创建Answer    此方法为Promise
*           7、回调成功后，设置pc2的本地描述    发送至signal
*           8、设置pc1的远端描述信息
*
*
*/

function handleMedia(stream) {
    localVideo.srcObject = stream
    localStream = stream
}

function failMedia(err){
    console.error('获取流失败', err)
}

function startClick(){
    console.log('startClick')
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
        console.error('getUserMedia is not support')
        return
    }
    navigator.mediaDevices.getUserMedia({video: true,audio:false}).then(handleMedia).catch(failMedia)
}

function getRemoteStream(e,s){
    console.error('远端的信息----', e,s)
    remoteVideo.srcObject = e.streams[0]
}

function getOffer(desc){
    pc1.setLocalDescription(desc)
    // send desc to signal
    // receive desc from signal
    pc2.setRemoteDescription(desc)
    pc2.createAnswer().then(getAnswer).catch(handleError)
}

function getAnswer(desc){
    pc2.setLocalDescription(desc)
    // send desc to signal
    // receive desc from signal

    pc1.setRemoteDescription(desc)
}

function handleError(err){
    console.error('err=------', err)
}

function callClick(){
    pc1 = new RTCPeerConnection()
    pc2 = new RTCPeerConnection()

    pc1.onicecandidate = (e) => {
        pc2.addIceCandidate(e.candidate)
    }

    pc2.onicecandidate = (e) => {
        pc1.addIceCandidate(e.candidate)
    }

    pc2.ontrack = getRemoteStream
    /* 
    *   注意：必须要先添加媒体数据 再进行媒体协商  
    *           因为在媒体协商的时候，如果检测出不存在媒体流，就不会去初始化设置一些底层的收发器和接收器 
    */
   console.warn('localStream.getTracks()',localStream.getTracks())
    localStream.getTracks().forEach(track => {
        pc1.addTrack(track, localStream)
    })
    
    let offerOptions = {
        offerToRecieveVideo: 1,
        offerToRecieveAudio: 0
    }
    pc1.createOffer(offerOptions).then(getOffer).catch(handleError)
    
}

function stopClick(){
    console.log('stopClick')

}

start.onclick = startClick
call.onclick = callClick
stopC.onclick = stopClick