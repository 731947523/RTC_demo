/**
 * 日志等级
 */
 let BASE = window.cxsBASE = {
    DEBUG: 'debug',
    INFO: 'log',
    RESULT: 'result',
    WARN: 'warn',
    ERROR: 'error',
    NONE: 'none',
    logLevel: null
}

/* 
*   todo: 1、校验打印信息，查看打印的信息是否是函数等
*/

var LOG = {
    info: function(callback) {
        if (BASE.logLevel == BASE.INFO) {
            console.log('INFO |', callback)
        }
    },
    warn: function(callback) {
        if (BASE.logLevel == BASE.WARN || BASE.logLevel == BASE.INFO) {
            console.log('WARN |', callback)
        }
    },
    error: function(callback) {
        if (BASE.logLevel == BASE.ERROR || BASE.logLevel == BASE.INFO) {
            console.log('ERROR |', callback)
        }
    },
    setLogLevel: function(log_level) {
        // 传级别不符合条件的，当作DEBUG级
        BASE.logLevel = log_level
    },
    setSwitch: function(flag){
        if(typeof flag == 'boolean' && !flag){
            BASE.logLevel = null
        }else{
            BASE.logLevel = BASE.INFO
        }
    }
}
window.cxsLog = LOG