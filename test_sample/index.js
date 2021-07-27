class CreateInstance{
    constructor(){
        this.initCount = 19
    }
    createClient(opt, success = (params) => { }, failed = (params) => {}){
        let {name, age} = opt
        let sex = '男'
        success({name, age, sex})
    }
    init (opt){
        let {name, age} = opt
        let sex = '男'
        let _obj = {
            name,
            age,
            sex
        }
        return new Promise((resolve, reject)=>{
            if(this.initCount > 7){
                reject(_obj)
            }else{
                resolve( _obj)
            }
        })
    }
}

let test_ = new CreateInstance()
test_.createClient({name: '晨曦', age: 27, like: '打游戏'}, function(params) {
    console.log('createClient------success', params);
})

test_.init({name: '晨曦', age: 27, like: '打游戏'}).then(res=>{
    console.log('初始化成功---', res);
}).catch(err=>{
    console.error('初始化失败', err);
})




