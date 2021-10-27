// const obj = {}

function defineReactive(obj, key, val){
    observe(val)
    Object.defineProperty(obj, key, {
        get(){
            console.log(`get ${key}:${val}`)
            return val
        },
        set(newVlaue){
            if(newVlaue != val){
                console.log(`set ${key}: ${newVlaue}`)
                observe(newVlaue)
                val = newVlaue
            }
        }
    })
}

function observe(obj){
    if(typeof obj !== 'object' || obj == null){
        return
    }
    Object.keys(obj).forEach(key => {
        defineReactive(obj, key, obj[key])
    })
}

function setPro(obj, key, val){
    defineReactive(obj, key, val)
}

const obj = {fo:'', ba: 'ba', yu: {cs:'1'} }
observe(obj)
obj.fo
obj.fo = 'cxs'
obj.ba
obj.ba = 'ly'
obj.ba = 'ly真实'
obj.yu.cs
obj.yu.a = 2
setPro(obj, 'da', '吃')
obj.da
obj.da ='cxsss'
obj.da='李莹'