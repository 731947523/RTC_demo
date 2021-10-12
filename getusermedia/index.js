let constraints = {
  video:{
    with: 720,
    height: 480
  }
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

start.addEventListener('click', ()=>{
  navigator.mediaDevices.getUserMedia(constraints).then(mediaStream=>{
      local.srcObject = mediaStream
      setTimer = setInterval(() => {
        count++
        drawImageShow(mediaStream)
        if(count>300){
          clearInterval(setTimer)
          count = 0
        }
      }, 25)
      local.onloadedmetadata = function(e) {
        local.play()
      }
  }).catch(err=>{
      console.log('获取失败---',err)
  })
})