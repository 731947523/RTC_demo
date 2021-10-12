function main() {
  var image = new Image(512, 512)
  //image.crossOrigin = "anonymous"
  image.src = './lena512color.jpg'  // MUST BE SAME DOMAIN!!!
  //image.src = "https://www.baidu.com/img/dong_30a61f45c8d4634ca14da8829046271f.gif";  // MUST BE SAME DOMAIN!!!
  document.body.appendChild(image)
  image.onload = function() {
	render(image)
  }
}

function render(image) {
  // Get A WebGL context
  var canvas = document.getElementById('myCanvas')
  var gl = canvas.getContext('experimental-webgl')

  //Set a GLSL program
  var program = createProgramFromScripts(gl, ['2d-vertex-shader', '2d-fragment-shader'])
  gl.useProgram(program)
	
  // look up where the texture coordinates need to go.
  var texCoordLocation = gl.getAttribLocation(program, 'a_texCoord')

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
  gl.enableVertexAttribArray(texCoordLocation)
  gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0)

  // Create a texture.
  var texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  
  // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,new Uint8Array([0, 0, 255, 255]))

  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

}
main()
