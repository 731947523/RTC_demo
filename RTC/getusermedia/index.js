let constraints = {
  video: true,
  audio: false
}


let count = 0
let setTimer = null
let start = document.querySelector('.start')
let newMe = document.querySelector('#newMe')
let local = document.querySelector('#localVideo')


start.addEventListener('click', ()=>{
  navigator.mediaDevices.getUserMedia(constraints).then(mediaStream=>{
      local.srcObject = mediaStream
      let str = new MediaStream()
      mediaStream.getTracks().forEach(track=>{
        str.addTrack(track)
      })
      local.onloadedmetadata = function(e) {
        local.play()
      }
      setTimeout(() => {
        newMe.srcObject = str
      }, 1000)
  }).catch(err=>{
      console.log('获取失败---',err)
  })
})
