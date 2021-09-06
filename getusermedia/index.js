
 let sdkInstance,currentStreams
 let opt = {
    appId:'d317f559',
    inavId:'inav_c421258d',
    roomId:'lss_706f5237',
    token:'vhall',
    accountId:'cxs',
    mode: VhallRTC.MODE_LIVE,
    role: VhallRTC.ROLE_AUDIENCE
 }
 VhallRTC.createInstance(opt,(event) => {
      console.log('创建实例成功---', event)
      sdkInstance = event.vhallrtc
      currentStreams = event.currentStreams
      if (currentStreams.length != 0) {
        const opt = {
          videoNode: 'remote', // 页面显示的容器ID， 必填
          streamId: currentStreams[0].streamId, // 远端流ID，必填
          mute: { // 选填，订阅成功后立即mute远端流
            audio: false, // 是否关闭音频，默认false
            video: false // 是否关闭视频，默认false
          },
          dual: 1
        }
        sdkInstance.subscribe(opt).then(res => {
          console.log('订阅成功---', res)
        }).catch(err => {
          console.log('订阅失败---', err)
        })
      } else {
        alert('不存在远端，无video订阅播放')
      }
    }, (err) => {
      console.error('创建实例失败', err)
    }
  )
  let videoP =  document.querySelector('video')
//   videoP.addEventListener('click', function(){
//       vhallrtc.setStreamFullscreen(opt).then(res=>{console.log('sucess--', res)}).catch(err=>{console.log('error----', err)})
//   })

  document.querySelector('#full').addEventListener('click', function(){
    vhallrtc.setStreamFullscreen({streamId: currentStreams[0].streamId}).then(res=>{console.log('sucess--', res)}).catch(err=>{console.log('error----', err)})
  })

  document.querySelector('#full').addEventListener('click', function(){
    vhallrtc.exitStreamFullscreen({streamId:currentStreams[0].streamId}).then(res=>{console.log('sucess--', res)}).catch(err=>{console.log('error----', err)})
  })

let constraints = {
    // video:{
    //     with: 1280,
    //     height: 720,
    //     // aspectRatio: 1.3
    //     // aspectRatio: 1.7
    // },
    video: false,
    audio: false
    // audio: {
    //     noiseSuppression: true,
    //     echoCancellation: true,
    //     volume: 0
    // }
}
let local = document.querySelector('#localVideo')

window.AudioContext = window.AudioContext || window.webkitAudioContext
let analyser =null
var dataArray
function draw(){
    // window.requestAnimationFrame(draw)
    console.log('analyser-----', analyser)
    console.log('analyser-----', analyser.getByteTimeDomainData(dataArray))
    
}

// navigator.getUserMedia(
//     { audio: true },
//     stream => {
//         console.log(stream, 'stream')
//         const audioContext = new AudioContext()
//         let script = audioContext.createScriptProcessor(2048, 1, 1)
//         let distortion = audioContext.createWaveShaper()
//         console.log('创建音量波形--distortion',distortion)

//         analyser = audioContext.createAnalyser()
//         analyser.fftSize = 2048
//         var bufferLength = analyser.fftSize
//         dataArray = new Uint8Array(bufferLength)
//         analyser.getByteTimeDomainData(dataArray)

//         setInterval(() => {
//             draw()
//         }, 2000)
//         // console.log('创建数据可视化---analyser',analyser)
//         // let audioInput = audioContext.createMediaStreamSource(stream)
//         // console.log('audioInput',audioInput)
//         // audioInput.connect(script)
//         // console.log(script, 'script')

//         // script.onaudioprocess=function(e){
//         //     console.log(e)
//         // }
//     },
//     e => {
//       console.error(e)
//     }
//   )

// navigator.mediaDevices.getUserMedia(constraints).then(mediaStream=>{
//     console.log('获取成功---',local,mediaStream)
//     local.srcObject = mediaStream
//     local.onloadedmetadata = function(e) {
//         local.play()
//       }
// }).catch(err=>{
//     console.log('获取失败---',err)
// })