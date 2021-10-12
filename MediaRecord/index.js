
        let start = document.querySelector('.start')
        let record = document.querySelector('.record')
        let play = document.querySelector('.play')
        let DomErr = document.querySelector('.error span')
        let recordedBlobs = []
        let recordMedia 
        start.addEventListener('click', async ()=>{
            let constraints = {
                video: {
                    with: 360, height: 240
                },
                audio: true
            }
            await init(constraints)
        })
        async function init(constraints){
            let a = await navigator.mediaDevices.getUserMedia(constraints).then(stream=>{
                handleSuccess(stream)
            }).catch(error=>{
                DomErr.innerHTML = error.message
                console.log(error, '错误信息');
            })
        }
        function handleSuccess(stream){
            window.stream = stream
            // let mediaStreamtrack = stream.getTracks()
            // console.log('handleSuccess----',mediaStreamtrack);
            const startVideo = document.querySelector('.startVideo')
            startVideo.srcObject = stream
        }

        record.addEventListener('click', (e)=>{
            if(e.target.innerText == '开启录制'){
                e.target.innerText = '停止录制'
                startRecord()
            }else{
                e.target.innerText = '开始录制'
                stopRecord()
            }
        })
        // 开始录制
        function startRecord(){
            try {
                recordMedia = new MediaRecorder(stream)
            } catch (error) {
                console.error('创建mediaRecord错误----', error)
                return
            }
            console.log('Created MediaRecorder', recordMedia);
            recordMedia.onstop = event =>{
                console.log('record--- stop', event);
                console.log('record--- blobs', recordedBlobs);
            }
            recordMedia.ondataavailable = handleDataAvailable
            recordMedia.start()

        }
        function handleDataAvailable(event){
            console.log('handleDataAvailable---', event);
            if(event.data && event.data.size>0){
                recordedBlobs.push(event.data)
            }
        }
        // 停止录制
        function stopRecord(){
            recordMedia.stop()
        }
        play.addEventListener('click', (e)=>{
            const recordDom = document.querySelector('.recordVideo')
            const superBuffer = new Blob(recordedBlobs);
            recordDom.src = null;
            recordDom.srcObject = null;
            recordDom.src = window.URL.createObjectURL(superBuffer);
            recordDom.controls = true;
            recordDom.play();
        })