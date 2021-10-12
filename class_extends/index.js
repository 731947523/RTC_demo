
class Base {
    constructor(){
        this.text = '这是一个最基本的类'
    }

    getName(){
        console.log('获取放')
    }
}

let Mixin = (SuperClass = null)=>{
    SuperClass = SuperClass || class Empty{}
    return class extends SuperClass {
        constructor(){
            super()
        }
    }
}

// class NameCxs extends Mixin(Base){
//     constructor(){
//         super()
//         console.log('这个是基本name 类 ')
//         console.log('在基本 Name 类里打印Base 类', this.text)
//     }
// }
class Base2 extends Base{
    constructor(){
        super()
    }
    getName1(){
        console.log('获取放')
    }
}

class Base3 extends Base2 {
    constructor(){
        super()
        this.text2 = 'df'
    }
}

let namea = new Base3()
console.log('????--', namea, namea.getName1())
