class Beauty{
    constructor(){
        this.canvas = null
        this.gl = null
        this.glProgram = null
        this.texture = null

        this.vertex = [ -1.0, -1.0, 0.0, 1.0,  -1.0, 0.0, 1.0,  1.0,  0.0, -1.0, 1.0,  0.0]
        this.vertexIndice = [ 0, 1, 2, 0, 2, 3]
        this.triangleTexCoords = [ 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0]

        this.videoSource = null
        this.samplerUniform = null

        this.beautyLevel = 0.0
        this.beautyId = null // 美颜的ID 唯一标识
        this.hidden = document.hidden
        this.listener()
        this.isDestroy = false
    }


    createCanvas(canvasOpt){
        this.canvas = document.createElement('canvas')
        this.canvas.setAttribute('id', 'beautyCanvas')
        this.canvas.setAttribute('width', canvasOpt && canvasOpt.width || 1280)
        this.canvas.setAttribute('height', canvasOpt && canvasOpt.height || 720)
        // document.querySelector('.canvasWrap').append(this.canvas)
    }
    
    listener(){
        document.addEventListener('visibilitychange', () => {
            // console.log('visibilitychange', document.hidden)
            this.hidden = document.hidden
            if(!this.isDestroy) this.startDraw()
        })
    }


    setupContext() {
        try {
           this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl')
        }catch(e){
        }
        if (this.gl) {
            this.gl.clearColor(74 / 255, 115 / 255, 94 / 255, 1.0)
            this.gl.clear(this.gl.COLOR_BUFFER_BIT)
        }
    }

    init(source, opt){
        this.isDestroy = false
        if(!source){
            // 进行修改promise
            return console.error('不存在Video来源，请确认')
        }
        this.videoSource = source
        this.createCanvas(opt)
        this.setupContext()
        this.initShaders()
        this.createTexture()
        this.samplerUniform = this.gl.getUniformLocation(this.glProgram, 'uSampler')
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

    startDraw(){
        if(!this.gl) {
            return
        }
        if(this.hidden){
            if(this.beautyId){
                cancelAnimationFrame(()=>{this.draw()})
            }
            setInterval(()=>{console.log('???')},1000)
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
    

    draw () {
        if(!this.hidden){
            this.beautyId = requestAnimationFrame(()=>{this.draw()})
        }
        console.log(this.intervalId? '定时器' : 'Animation')
        // vertex data
        var vertexBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertex), this.gl.STATIC_DRAW)
        
        // indice data
        var vertexIndiceBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, vertexIndiceBuffer)
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.vertexIndice), this.gl.STATIC_DRAW)
    
        // set position attribute
        var aVertexPosition = this.gl.getAttribLocation(this.glProgram, 'aPos')
        this.gl.vertexAttribPointer(aVertexPosition, 3, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(aVertexPosition)
        
        // texture coordinate data
        var trianglesTexCoordBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, trianglesTexCoordBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.triangleTexCoords), this.gl.STATIC_DRAW)
        
        // set texture coordinate attribute
        var vertexTexCoordAttribute = this.gl.getAttribLocation(this.glProgram, 'aVertexTextureCoord')
        this.gl.enableVertexAttribArray(vertexTexCoordAttribute)
        this.gl.vertexAttribPointer(vertexTexCoordAttribute, 2, this.gl.FLOAT, false, 0, 0)
    
        var resolutionLocation = this.gl.getUniformLocation(this.glProgram, 'u_resolution')
        this.gl.uniform2f(resolutionLocation, this.gl.canvas.width, this.gl.canvas.height)
        
        var textureSizeLocation = this.gl.getUniformLocation(this.glProgram, 'u_textureSize')
        this.gl.uniform2f(textureSizeLocation, 1280, 720)
        
        var beautyLvLocation = this.gl.getUniformLocation(this.glProgram, 'u_params')
        this.gl.uniform1f(beautyLvLocation, this.beautyLevel)//0.5 is the slider input value(0.0 - 1.0)
        
        // bind texture and set the sampler
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
        // this.texture
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGB, this.gl.RGB, this.gl.UNSIGNED_BYTE, this.videoSource)
        this.gl.uniform1i(this.samplerUniform, 0)
        
        this.gl.clearColor(74 / 255, 115 / 255, 94 / 255, 1.0)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)
        
        this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0)
    }

    destroy(captureMediaStream, cloneStream){
        cloneStream.addTrack(captureMediaStream.getVideoTracks()[0])
        cloneStream.removeTrack(cloneStream.getVideoTracks()[0])
        this.isDestroy = true 
        if(this.beautyId){
            cancelAnimationFrame(this.beautyId)
            this.beautyId = null
        }else if(this.intervalId){
            clearInterval(this.intervalId)
            this.intervalId = null
        }
    }

    setBeautyLevel(level){
        this.beautyLevel = level
    }

    getCap(frameRate = 25){
        window.canvas = this.canvas.captureStream(frameRate)
        return this.canvas.captureStream(frameRate)
    }

    /* init shader begain */
    initShaders() {
        // compile shaders
        var vertexShader = this.makeShader(window.Vertex, this.gl.VERTEX_SHADER)
        var fragmentShader = this.makeShader(window.Fragment, this.gl.FRAGMENT_SHADER)
    
        // create program
        this.glProgram = this.gl.createProgram()
        // attach and link shaders to the program
        this.gl.attachShader(this.glProgram, vertexShader)
        this.gl.attachShader(this.glProgram, fragmentShader)
        this.gl.linkProgram(this.glProgram)
    
        if (!this.gl.getProgramParameter(this.glProgram, this.gl.LINK_STATUS)) {
            console.error('Unable to initialize the shader program.')
        }
        // use program
        this.gl.useProgram(this.glProgram)
    }
    
    makeShader(src, type) {
        //compile the vertex shader
        var shader = this.gl.createShader(type)
        this.gl.shaderSource(shader, src)
        this.gl.compileShader(shader)
    
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Error compiling shader: ' + this.gl.getShaderInfoLog(shader))
        }
        return shader
    }
    /* init shader end */
}

window.Beauty = Beauty
