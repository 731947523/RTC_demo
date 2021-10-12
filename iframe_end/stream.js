
let constraints = {
    video:{
      with: 1280,
      height: 720
    }
  }
  
  let beauty = new Beauty()
  beauty.beautyCreateCanvas(constraints.video)
  beauty.init()

  let start = document.querySelector('.start')
  let draw = document.querySelector('.draw')
  let captureVideo = document.querySelector('#captureVideo')
  let captureMediaStream

  var slider = document.querySelector('#slider')

  slider.onchange = function(){
    document.querySelector('.span').innerText = slider.value
    beauty.beautySetLevel(slider.value)
  }

  function replaceStream(){
    let canvasStream =  beauty.beautyGetCanStream()
    let newVideoTracks = canvasStream.getVideoTracks()[0]
    let oldVideoTracks = captureMediaStream.getVideoTracks()[0]
    captureMediaStream.removeTrack(oldVideoTracks)
    captureMediaStream.addTrack(newVideoTracks)
  }

  draw.addEventListener('click', () => {
    beauty.drawWithBeauty('level5')
  })
  
  start.addEventListener('click', ()=>{
    window.av = document.createElement('video')
    navigator.mediaDevices.getUserMedia(constraints).then(mediaStream => {
        window.cloneStream = new MediaStream()
        cloneStream.addTrack(mediaStream.getVideoTracks()[0])
        av.srcObject = mediaStream
        av.play()
        

        beauty.beautyRender(av)
        captureMediaStream = cloneStream
        captureVideo.srcObject = cloneStream
        setTimeout(() => {
          replaceStream()
        }, 600)
    }).catch(err=>{
        console.log('获取失败---',err)
    })
  })