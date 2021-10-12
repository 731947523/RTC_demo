window.onload = function(){
    const videoPlayer = document.getElementById('videoPlayer')
    window.videoPlayer = videoPlayer
    // const chrome88Canvas = document.createElement('canvas')
    // const chrome88canvasContext = chrome88Canvas.getContext('2d')
    // videoPlayer.addEventListener('play', ()=>{
    //         chrome88Canvas.width = videoPlayer.videoWidth
    //         chrome88Canvas.height = videoPlayer.videoHeight
    //         drawVideoCanvas()
    //         // 从canvas中抓取MediaStream
    //         const canvasStream = chrome88Canvas.captureStream()
    //         // 从video播放器中抓取MediaStream
    //         const vodCpatureStream = videoPlayer.captureStream()
    //         // audio track 从[video播放器抓取MediaStream对象]中获取
    //         const audioTrack = vodCpatureStream.getAudioTracks()[0]
    //         // video track 从[canvas抓取MediaStream对象]中获取
    //         const videoTrack = canvasStream.getVideoTracks()[0]
    //         console.log('audioTrack--', audioTrack)
    // })
    //将video播放器的画面绘制至canvas上
    // function drawVideoCanvas() {
    //     setInterval(()=>{
    //         chrome88canvasContext.drawImage(videoPlayer, 0, 0, chrome88Canvas.width, chrome88Canvas.height)
    //     }, 40)
    //window.requestAnimationFrame(drawVideoCanvas);
    // 备选方案：大概以 25 fps 渲染到 canvas 中
    // }


    
    
    // var opt = { 
    //     videoNode: 'div',                  // 传入本地互动流的显示容器，必填
    //     audio: false,
    //     video: false,
    //     audioTrack: audioTrack ,           //在上一步已抓取的音频MediaStreamTrack对象
    //     videoTrack: videoTrack,            //在上一步已抓取的视频MediaStreamTrack对象
    // }
    // 创建本地流
    // vhallrtc.createStream(opt).then(() => {   
    //     console.log('创建本地流成功')
    //     // 并开始推送互动流
    // }).catch(error => {
    //     console.log('创建本地流失败', error)
    // })
}