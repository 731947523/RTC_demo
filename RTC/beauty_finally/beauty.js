class Beauty{
  constructor(){
    this.canvas = null  // 中间层 canvas
    this.virtualVideo = null  // 中间层 视频源
    this.gl = null
    this.texture = null

    this.videoSource = null
    this.samplerUniform = null

    this.beautyLevel = 0.0
    this.beautyId = null // 美颜ID requestAnimationFrame ID
    this.intervalId = null // 美颜ID setinterval ID
    this.hidden = document.hidden
    this.listener()
    this.isDestroy = false
    this.id = null
    this.beautyLvLocation = null

    // 创建着色器是创建在Cpu内    销毁的时候进行处理
    this.glProgram = null
    this.vertexS = null
    this.fragmentS = null
  }

  async init(opt){
    if(!opt.source){
      return Promise.reject({message: 'video source is null', code: ''})
    }
    this.isDestroy = false
    this.id = opt.id
    this.videoSource = opt.source
    await this.createCanvas(opt.canvasOpt)
    this.setupContext()
    await this.initShaders()
    this.createTexture()
    this.samplerUniform = this.gl.getUniformLocation(this.glProgram, 'uSampler')
    this.drawBefore()
    window.glcxs = this.gl
    return Promise.resolve()
    
  }

  createCanvas(opt){
    console.log('111-2');

    return new Promise((resolve)=>{
      if(this.canvas){
        resolve()
        return
      }
      this.canvas = document.createElement('canvas')
      this.canvas.setAttribute('class', `beautyCanvas_${opt.id}`)
      this.canvas.setAttribute('width', opt && opt.width || 1280)
      this.canvas.setAttribute('height', opt && opt.height || 720)
      resolve()
    })
  }

  createVideo(sourceId){
    console.log('111-1');
    if(this.virtualVideo){
      return this.virtualVideo
    }
    this.virtualVideo = document.createElement('video')
    this.virtualVideo.setAttribute('class', `virtul_${sourceId}`)
    this.virtualVideo.muted = true
    return this.virtualVideo
  }

  createTexture () {
    this.texture = this.gl.createTexture()
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true)
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.videoSource)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
  }

  // 设置美颜等级 0 - 1
  async setLevel(level = 0){
    if(!this.gl){
      return Promise.reject({code:'611037', message:'beauty is not open'})
    }
    this.beautyLevel = level
    return Promise.resolve(this.beautyLevel)
  }

  // 设置canvas 默认分辨率 初建
 async setCanvasProfile(opt){
    if(!this.canvas){
      return this.createCanvas(opt)
    }
    this.canvas.width = opt.width
    this.canvas.height = opt.height
    return Promise.resolve()
  }

  setupContext() {
    try {
      this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl')
    }catch(e){
      console.error('webgl error------', e)
    }
    if (this.gl) {
      this.gl.clearColor(74 / 255, 115 / 255, 94 / 255, 1.0)
      this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    }
  }

  getCanvasVideoTracks(frameRate = 25){
    window.virtualCanvasStream = this.canvas.captureStream(frameRate)
    let canvasStream = this.canvas.captureStream(frameRate)
    return canvasStream.getVideoTracks()[0]
  }

  startDraw(){
    // console.log('startDraw',Boolean(!this.gl), this.videoSource, this.hidden, document.hidden, this.beautyId);
    if(!this.gl ) return;

    if(this.hidden){
      if(this.beautyId){
        cancelAnimationFrame(()=>{this.draw()})
        this.beautyId = null
      }
      
      if(this.intervalId) clearInterval(this.intervalId)
      // setInterval(()=>{console.log('???')},1000)
      this.intervalId = setInterval(() => { 
        this.draw()
      }, 40)
    }else{
      if(this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
      this.draw()
    }
  }

  /* 
  * 由于内存会缓慢增加， 将此段从draw内移除，查看这些绑定信息 不需要每次画的时候都去创建buffer并执行
  */
  drawBefore(){
    var vertexBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([ -1.0, -1.0, 0.0, 1.0,  -1.0, 0.0, 1.0,  1.0,  0.0, -1.0, 1.0,  0.0]), this.gl.STATIC_DRAW)
    
    // indice data
    var vertexIndiceBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, vertexIndiceBuffer)
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([ 0, 1, 2, 0, 2, 3]), this.gl.STATIC_DRAW)

    // set position attribute
    var aVertexPosition = this.gl.getAttribLocation(this.glProgram, 'aPos')
    this.gl.vertexAttribPointer(aVertexPosition, 3, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(aVertexPosition)
    
    // texture coordinate data
    var trianglesTexCoordBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, trianglesTexCoordBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([ 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0]), this.gl.STATIC_DRAW)
    
    // set texture coordinate attribute
    var vertexTexCoordAttribute = this.gl.getAttribLocation(this.glProgram, 'aVertexTextureCoord')
    this.gl.enableVertexAttribArray(vertexTexCoordAttribute)
    this.gl.vertexAttribPointer(vertexTexCoordAttribute, 2, this.gl.FLOAT, false, 0, 0)

    var resolutionLocation = this.gl.getUniformLocation(this.glProgram, 'u_resolution')
    this.gl.uniform2f(resolutionLocation, this.gl.canvas.width, this.gl.canvas.height)
    
    var textureSizeLocation = this.gl.getUniformLocation(this.glProgram, 'u_textureSize')
    this.gl.uniform2f(textureSizeLocation, this.gl.canvas.width, this.gl.canvas.height)
    
    this.beautyLvLocation = this.gl.getUniformLocation(this.glProgram, 'u_params')
  }

  draw () {
    if(!this.gl) return;

    if(!this.hidden){
      this.beautyId = requestAnimationFrame(()=>{this.draw()})
    }
    this.gl.uniform1f(this.beautyLvLocation, this.beautyLevel)//0.5 is the slider input value(0.0 - 1.0)
    // 
    // bind texture and set the sampler
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
    // this.texture
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGB, this.gl.RGB, this.gl.UNSIGNED_BYTE, this.videoSource)
    this.gl.uniform1i(this.samplerUniform, 0)
    
    this.gl.clearColor(74 / 255, 115 / 255, 94 / 255, 1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    
    this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0)
  }

  /* init shader begain */
  async initShaders() {
    console.log('111-3');

    // compile shaders
    this.vertexS = await this.makeShader(window.Vertex, this.gl.VERTEX_SHADER)
    this.fragmentS = await this.makeShader(window.Fragment, this.gl.FRAGMENT_SHADER)

    // create program
    this.glProgram = this.gl.createProgram()
    // attach and link shaders to the program
    this.gl.attachShader(this.glProgram, this.vertexS)
    this.gl.attachShader(this.glProgram, this.fragmentS)
    this.gl.linkProgram(this.glProgram)

    if (!this.gl.getProgramParameter(this.glProgram, this.gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program.')
    }
    // use program
    this.gl.useProgram(this.glProgram)
    return Promise.resolve()
  }
  
  makeShader(src, type) {
    return new Promise((resolve, reject)=>{
      var shader = this.gl.createShader(type)
      this.gl.shaderSource(shader, src)
      this.gl.compileShader(shader)
  
      if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
        reject({code: '', message: 'Error compiling shader: ' + this.gl.getShaderInfoLog(shader)})
      }
      resolve(shader)
    })
  }
  /* init shader end */

  listener(){
    document.addEventListener("visibilitychange", () => {
      this.hidden = document.hidden
      if(!this.isDestroy) {
        this.startDraw()
      }
    })
  }

 destory(){
   return new Promise((resolve, reject) => {
     this.isDestroy = true
     if(this.beautyId){
       cancelAnimationFrame(this.beautyId)
       this.beautyId = null
     }else if(this.intervalId){
       clearInterval(this.intervalId)
       this.intervalId = null
     }
     this.gl = null
     this.canvas = null
     this.texture = null
     // 销毁Cpu创建的 
     this.glProgram = null
     this.vertexS = null
     this.fragmentS = null
     resolve()
   })
  }
}
window.Beauty = Beauty
