/* 
*   value: 文本
*   font：字体大小
*   color: 颜色
*   opcity：透明度
*   time: 滚动时间
*   speed：滚动速度
*/
console.log('dsfdsf')
export var a = 1;
class Barrage {
    constructor(option){
        console.log(option, 'dsfdsf')
        let {video, canvas} = option
        if(!video || !canvas){
            return alert('')
        }
        this.video = video
        this.canvas = canvas

        this.canvas.width = video.width
        this.canvas.height = video.height
        this.ctx = canvas.getContext('2d')
        
        this.params = option.params

        render()  
    }

    // 渲染
    render(){
        console.log('走到此处')
        ctx.strokeText(this.params.value, 50 , 50+ 30 * 2)
    }

    // 动态设置canvas宽高
    setCanvas(w,h){
        if(!w || !h){
            return {code: '', message: '参数异常'}
        }
        this.canvas.width = w
        this.canvas.height = h
    }
}