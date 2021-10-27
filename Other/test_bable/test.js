const name = () => {
    console.log('test的fun name is name...')
}
let a = () =>{
    name()
}
window.name = name
function filterDevices(devices, flag) {

  }
class test{
    constructor(){
        this.name = '小腿'
    }
    
    eat(){
        console.log(this.name+'是很强壮的')
    }
}

export {
    test
}