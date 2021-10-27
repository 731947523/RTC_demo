let constraints = {
  // video:{
  //   with: 720,
  //   height: 480
  // },
  video: false,
  audio: true
}


let count = 0
let setTimer = null
let start = document.querySelector('.start')
let local = document.querySelector('#localVideo')
let canvas = document.querySelector('#canvas')

let context = canvas.getContext('2d')
console.log('context', context)

function drawImageShow(){
  context.drawImage(local, 0, 0, constraints.video.with, constraints.video.height)
} 

// start.addEventListener('click', ()=>{
//   navigator.mediaDevices.getUserMedia(constraints).then(mediaStream=>{
//       local.srcObject = mediaStream
//       local.onloadedmetadata = function(e) {
//         local.play()
//       }
//   }).catch(err=>{
//       console.log('获取失败---',err)
//   })
// })
let opt = {'appId':'d317f559','inavId':'inav_c421258d','roomId':'lss_706f5237','accountId':'master_3316','token':'access:d317f559:75107dced08acdb1','mode':'rtc','role':'administrator','videoCodec':'VP8','autoSubscribe':true,'autoStartBroadcast':false}
VhallRTC.createInstance(opt, function(res){
  console.log('创建实例成功---', res)
  let vhallrtc = res.vhallrtc
  vhallrtc.createStream({videoNode: 'localVideo', video: false, audio: true}).then(res=>{
    console.log('创建流成功--', res)
  }).catch((err)=>{
    console.error(err, '创建stream失败')
  })
}, function(err){
  console.error(err, '创建实例失败')
})