class Beauty{
  constructor(){
    this.canvas = null
    this.beautyProcessStrength = {
      level0:[0.0], level1:[0.1], level2:[0.2],
      level3:[0.3], level4:[0.4], level5:[0.5],
      level6:[0.6], level7:[0.7], level8:[0.8],
      level9:[0.9], level10:[1.0]
    }
    this.initialSelection = 'level0' 
    this.program = null
    this.positionLocation = null
    this.texCoordLocation = null
    this.positionBuffer = null
    this.texCoordBuffer
    this.texture
    this.resolutionLocation
    this.textureSizeLocation
    this.beautyLvLocation
    this.source = null
    this.gl = null
  }

  
  setRectangle(gl, x, y, width, height) {
    var x1 = x
    var x2 = x + width
    var y1 = y
    var y2 = y + height
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      x1, y1, x2, y1, x1, y2,
      x1, y2, x2, y1, x2, y2,
    ]), this.gl.STATIC_DRAW)
  }

  init(){ 
    if(!this.gl){
      return
    }
    //Set a GLSL program
    this.program = this.initShaderProgram(this.gl, window.Vertex, window.Fragment)
    // look up where the texture coordinates need to go.
    this.positionLocation = this.gl.getAttribLocation(this.program, 'a_position')
    this.texCoordLocation = this.gl.getAttribLocation(this.program, 'a_texCoord')
  }

  initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource)
    const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource)
  
    // Create the shader program
  
    const shaderProgram = gl.createProgram()
    
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)
  
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram))
      return null
    }
  
    return shaderProgram
  }

  loadShader(gl, type, source) {
    const shader = gl.createShader(type)
    // Send the source to the shader object
  
    gl.shaderSource(shader, source)

    // Compile the shader program
    gl.compileShader(shader)

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }
  
    return shader
  }

  beautyRender(source) {
    this.source = source
    // Create a buffer to put three 2d clip space points in
    this.positionBuffer = this.gl.createBuffer()
  
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
    // Set a rectangle the same size as the opt.
    
    this.setRectangle(this.gl, 0, 0, source.videoWidth, source.videoHeight)
  
    // provide texture coordinates for the rectangle.
    this.texCoordBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([ 0.0,  0.0, 1.0,  0.0, 0.0,  1.0, 0.0,  1.0, 1.0,  0.0, 1.0,  1.0]), this.gl.STATIC_DRAW)
    
    // Create a texture.
    this.texture = this.gl.createTexture()
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
    
    // Set the parameters so we can render any size opt.
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST)
  
  
    // Upload the opt into the texture.
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, source)

    // void this.gl.texImage2D(target, level, internalformat, width, height, border, format, type, HTMLVideoElement source)
    this.resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution')
    this.textureSizeLocation = this.gl.getUniformLocation(this.program, 'u_textureSize')
    this.beautyLvLocation = this.gl.getUniformLocation(this.program, 'u_params')
    this.drawWithBeauty(this.initialSelection)
    // window.requestAnimationFrame(() => this.beautyRender(window.av))
  }

  drawWithBeauty(level) {
    // Tell WebGL how to convert from clip space to pixels
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    
    // Clear the canvas
    this.gl.clearColor(0, 0, 0, 0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    
    // Tell it to use our program (pair of shaders)
    this.gl.useProgram(this.program)
    
    // Turn on the position attribute
    this.gl.enableVertexAttribArray(this.positionLocation)
    
    // Bind the position buffer.
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer)
    
    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2          // 2 components per iteration
    var type = this.gl.FLOAT   // the data is 32bit floats
    var normalize = false // don't normalize the data
    var stride = 0        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0        // start at the beginning of the buffer
    this.gl.vertexAttribPointer(this.positionLocation, size, type, normalize, stride, offset)
    
    // Turn on the teccord attribute
    this.gl.enableVertexAttribArray(this.texCoordLocation)
    
    // Bind the position buffer.
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordBuffer)
    
    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2          // 2 components per iteration
    var type = this.gl.FLOAT   // the data is 32bit floats
    var normalize = false // don't normalize the data
    var stride = 0        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0        // start at the beginning of the buffer
    this.gl.vertexAttribPointer(this.texCoordLocation, size, type, normalize, stride, offset)
    
    // set the resolution
    this.gl.uniform2f(this.resolutionLocation, this.gl.canvas.width, this.gl.canvas.height)
    
    // set the size of the opt
    this.gl.uniform2f(this.textureSizeLocation, this.source.width, this.source.height)
  
    // set the beauty filter level parameters
    this.gl.uniform1fv(this.beautyLvLocation, this.beautyProcessStrength[level])
    //this.gl.uniform1f(kernelWeightLocation, computeKernelWeight(kernels[name]));
    
    // Draw the rectangle.
    var primitiveType = this.gl.TRIANGLES
    var offset = 0
    var count = 6
    this.gl.drawArrays(primitiveType, offset, count)

    window.requestAnimationFrame(() => this.beautyRender(window.av))
  }

  beautyCreateCanvas(canvasOpt){
    if(this.canvas && document.querySelector('#beautyCanvas')){
      return
    }
    this.canvas = document.createElement('canvas')
    this.cloneCanvasOpt = canvasOpt
    this.canvas.setAttribute('id', 'beautyCanvas')
    this.canvas.setAttribute('width', canvasOpt && canvasOpt.width || 1280)
    this.canvas.setAttribute('height', canvasOpt && canvasOpt.height || 720)
    // 假如canvas不添加到文档流上，则设置的宽高不会生效，需每次重置时再次设置
    window.createWebGl = this.gl = this.canvas.getContext( 'webgl' ) || this.canvas.getContext('experimental-webgl', {
      preserveDrawingBuffer: !0
    })
  }


  beautySetLevel(level = 0) {
    this.initialSelection = `level${level}`
    this.drawWithBeauty(this.initialSelection)
  }
  
  beautySetOpt(opt) {
    this.gl.canvas.width = opt && opt.width || 1280
    this.gl.canvas.height = opt && opt.height || 720
  }

  beautyGetCanStream(frameRate = 25){
    return this.canvas.captureStream(frameRate)
  }


}

window.Beauty = Beauty
// export default Beauty
