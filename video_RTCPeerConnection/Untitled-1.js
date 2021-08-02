'use strict'
console.log('look')
// Set up media stream constant and parameters.

// In this codelab, you will be streaming video only: "video: true".
// Audio will not be streamed because it is set to "audio: false" by default.

// Define initial start time of the call (defined as connection between peers).
let startTime = null

// Define peer connections, streams and video elements.
const localVideo = document.getElementById('localVideo')
const remoteVideo = document.getElementById('remoteVideo')

let localStream
let remoteStream

let localPeerConnection
let remotePeerConnection




// Define RTC peer connection behavior.

// Connects with new peer candidate.
function handleConnection(event) {
  const peerConnection = event.target
  const iceCandidate = event.candidate

  if (iceCandidate) {
    const newIceCandidate = new RTCIceCandidate(iceCandidate)
    const otherPeer = getOtherPeer(peerConnection)

    otherPeer.addIceCandidate(newIceCandidate)
      .then(() => {
        handleConnectionSuccess(peerConnection)
      }).catch((error) => {
        handleConnectionFailure(peerConnection, error)
      })

    trace(`${getPeerName(peerConnection)} ICE candidate:\n` +
          `${event.candidate.candidate}.`)
  }
}

// Logs that the connection succeeded.
function handleConnectionSuccess(peerConnection) {
  trace(`${getPeerName(peerConnection)} addIceCandidate success.`)
};

// Logs that the connection failed.
function handleConnectionFailure(peerConnection, error) {
  trace(`${getPeerName(peerConnection)} failed to add ICE Candidate:\n`+
        `${error.toString()}.`)
}

// Logs changes to the connection state.
function handleConnectionChange(event) {
  const peerConnection = event.target
  console.log('ICE state change event: ', event)
  trace(`${getPeerName(peerConnection)} ICE state: ` +
        `${peerConnection.iceConnectionState}.`)
}

// Logs error when setting session description fails.
function setSessionDescriptionError(error) {
  trace(`Failed to create session description: ${error.toString()}.`)
}

// Logs success when setting session description.
function setDescriptionSuccess(peerConnection, functionName) {
  const peerName = getPeerName(peerConnection)
  trace(`${peerName} ${functionName} complete.`)
}

// Logs success when localDescription is set.
function setLocalDescriptionSuccess(peerConnection) {
  setDescriptionSuccess(peerConnection, 'setLocalDescription')
}

// Logs success when remoteDescription is set.
function setRemoteDescriptionSuccess(peerConnection) {
  setDescriptionSuccess(peerConnection, 'setRemoteDescription')
}




// Add click event handlers for buttons.
callButton.addEventListener('click', callAction)



// Gets the "other" peer connection.
function getOtherPeer(peerConnection) {
  return (peerConnection === localPeerConnection) ?
      remotePeerConnection : localPeerConnection
}

// Gets the name of a certain peer connection.
function getPeerName(peerConnection) {
  return (peerConnection === localPeerConnection) ?
      'localPeerConnection' : 'remotePeerConnection'
}

// Logs an action (text) and the time when it happened on the console.
function trace(text) {
  text = text.trim()
  const now = (window.performance.now() / 1000).toFixed(3)

  console.log(now, text)
}

