'use strict'
function main() {
  console.log('main...........')
  // var image = new Image(1280, 720)
  // //image.crossOrigin = "anonymous"
  // image.src = './testimage02_1280_720.png'  // MUST BE SAME DOMAIN!!!
  // document.body.appendChild(image)
  // image.onload = function() {
	//   render(image)
  // }
}
var paramValue = 0.0
var slider = document.querySelector('#slider')
var initialSelection = 'level0' 
var spanT = document.querySelector('.span')

function render(image) {
  // Get A WebGL context
  var canvas = document.getElementById('myCanvas')
  var gl = canvas.getContext( 'webgl' ) || canvas.getContext('experimental-webgl')
  
  if(!gl){
	  return
  }
  //Set a GLSL program
  var program = createProgramFromScripts(gl, ['2d-vertex-shader', '2d-fragment-shader'])
	
  // look up where the texture coordinates need to go.
  var positionLocation = gl.getAttribLocation(program, 'a_position')
  var texCoordLocation = gl.getAttribLocation(program, 'a_texCoord')
  
  // Create a buffer to put three 2d clip space points in
  var positionBuffer = gl.createBuffer()

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  // Set a rectangle the same size as the image.
  // setRectangle(gl, 0, 0, image.width, image.height)
  setRectangle(gl, 0, 0, image.videoWidth, image.videoHeight)

  // provide texture coordinates for the rectangle.
  var texCoordBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0.0,  0.0,
    1.0,  0.0,
    0.0,  1.0,
    0.0,  1.0,
    1.0,  0.0,
    1.0,  1.0]), gl.STATIC_DRAW)
	
	// Create a texture.
  var texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  
  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  // void gl.texImage2D(target, level, internalformat, width, height, border, format, type, HTMLVideoElement source)
  // lookup uniforms
  var resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
  var textureSizeLocation = gl.getUniformLocation(program, 'u_textureSize')
  var kernelLocation = gl.getUniformLocation(program, 'u_kernel[0]')
  var kernelWeightLocation = gl.getUniformLocation(program, 'u_kernelWeight')
  var beautyLvLocation = gl.getUniformLocation(program, 'u_params')
  
  // Define beauty filter level
  var beautyProcessStrength = {
    level0:[0.0],
    level1:[0.1],
    level2:[0.2],
    level3:[0.3],
    level4:[0.4],
    level5:[0.5],
    level6:[0.6],
    level7:[0.7],
    level8:[0.8],
    level9:[0.9],
    level10:[1.0]
  }
  //Setup UI to pick kernels.

  slider.onchange = function(e){
    initialSelection = 'level'+(slider.value/100).toFixed(1)*10
    spanT.innerText = (slider.value/100).toFixed(1)*10
    drawWithBeauty(initialSelection)
  }
  drawWithBeauty(initialSelection)

  function drawWithBeauty(name) {
    resizeCanvasToDisplaySize(gl.canvas)
  
    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    
    // Tell it to use our program (pair of shaders)
    gl.useProgram(program)
    
    // Turn on the position attribute
    gl.enableVertexAttribArray(positionLocation)
    
    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    
    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2          // 2 components per iteration
    var type = gl.FLOAT   // the data is 32bit floats
    var normalize = false // don't normalize the data
    var stride = 0        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset)
    
    // Turn on the teccord attribute
    gl.enableVertexAttribArray(texCoordLocation)
    
    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
    
    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2          // 2 components per iteration
    var type = gl.FLOAT   // the data is 32bit floats
    var normalize = false // don't normalize the data
    var stride = 0        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        texCoordLocation, size, type, normalize, stride, offset)
    
    // set the resolution
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height)
    
    // set the size of the image
    gl.uniform2f(textureSizeLocation, image.width, image.height)
  
  // set the beauty filter level parameters
    gl.uniform1fv(beautyLvLocation, beautyProcessStrength[name])
    //gl.uniform1f(kernelWeightLocation, computeKernelWeight(kernels[name]));
    
    // Draw the rectangle.
    var primitiveType = gl.TRIANGLES
    var offset = 0
    var count = 6
    gl.drawArrays(primitiveType, offset, count)
  }
}


function setRectangle(gl, x, y, width, height) {
  var x1 = x
  var x2 = x + width
  var y1 = y
  var y2 = y + height
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2,
  ]), gl.STATIC_DRAW)
}

// main()

// This is needed if the images are not on the same domain
// NOTE: The server providing the images must give CORS permissions
// in order to be able to use the image with WebGL. Most sites
// do NOT give permission.
// See: http://webglfundamentals.org/webgl/lessons/webgl-cors-permission.html
function requestCORSIfNotSameOrigin(img, url) {
  if ((new URL(url)).origin !== window.location.origin) {
    img.crossOrigin = ''
  }
}
