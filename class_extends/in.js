// 创建类的第一种方式
class Base {
    constructor (options) {
        console.log('这是一个Base类', options)
        this.baseName = '李莹'
    }
    look(){
        console.log('我是父类的look方法')
        this.childFun1()
    }
}
Base.prototype.cxs = '帅锅锅'


class Test1 extends Base {
    constructor (options) {
        super(options) // ==> Base.prototype.constructor.call(this)
        // super 调用父类的信息   只能放在constructor内使用 仅能获取方法，不能获取基本信息
        // super 是父类原型链上的信息
        console.log('这是一个Test类',options)
    }
    test(){
        console.log(123456789, super.cxs,super.look())
        console.log('我是子类的test方法')
    }
    childFun1(){
        console.log('这是子类的方法')
    }
}
let a = new Test1({name:'晨曦',age:'男'}, '基础')
console.log(a.test())
// console.log(a.copy(),'1--324')
// console.log((new Test1({a:1,b:2})).copy(),2222)
// console.log((new Test1).copy(),333)
