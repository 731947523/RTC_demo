let constraints = {
    video:{
      with: 1280,
      height: 720
    }
  }
  
  
  let count = 0
  let setTimer = null
  let start = document.querySelector('.start')
  let local = document.querySelector('#localVideo')
  
  
  start.addEventListener('click', ()=>{
    render(local)
    // navigator.mediaDevices.getUserMedia(constraints).then(mediaStream=>{
    //     local.srcObject = mediaStream
        // setTimer = setInterval(() => {
        //   render(local)
        // }, 40)
    //     local.onloadedmetadata = function(e) {
    //       local.play()
    //     }
    // }).catch(err=>{
    //     console.log('获取失败---',err)
    // })
  })