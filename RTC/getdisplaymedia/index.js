/*
 *  Copyright (c) 2018 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
'use strict'
// Polyfill in Firefox.
// See https://blog.mozilla.org/webrtc/getdisplaymedia-now-available-in-adapter-js/
if (adapter.browserDetails.browser == 'firefox') {
  adapter.browserShim.shimGetDisplayMedia(window, 'screen')
}

function handleSuccess(stream) {
  console.log('捕获成功,',stream)
  window.streamxs = stream
  startButton.disabled = true
  const video = document.querySelector('video')
  video.srcObject = stream

  // demonstrates how to detect that the user has stopped
  // sharing the screen via the browser UI.
  stream.getVideoTracks()[0].addEventListener('ended', () => {
    errorMsg('The user has ended sharing the screen')
    startButton.disabled = false
  })
}

function handleError(error) {
  errorMsg(`getDisplayMedia error: ${error.name}`, error)
}

function errorMsg(msg, error) {
  console.log('error', msg, error)
  const errorElement = document.querySelector('#errorMsg')
  errorElement.innerHTML += `<p>${msg}</p>`
  if (typeof error !== 'undefined') {
    console.error(error)
  }
}

function funB(){
  end()
  
}

function end(){
  
  console.log('嵌套执行')
  let opt = {
    video: {
      width: 1920, 
      height: 1080
    },
    aspectRatio:{
      exact: 1.7777 
    },
    frameRate: 25,
    audio: true
  }
  console.log(opt)
  navigator.mediaDevices.getDisplayMedia(opt)
      .then(handleSuccess, handleError)
}


const startButton = document.getElementById('startButton')
startButton.addEventListener('click', () => {
  funB()
})

// window.onload = function() {
//   setTimeout(() => {
//     console.log('自动执行----')
//     document.querySelector('#startButton').click()
//   }, 2000)
// }