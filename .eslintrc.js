module.exports = {
    env:{
        'browser': true,
        'node': true,
        'commonjs': true,
        es6: true,
        'amd': true
    },
    rules: {
        'semi': ['warn', 'never'],
        'quotes': ['error', 'single', { 'allowTemplateLiterals': true }], // 单引号  ` ` 都可以, 'backtick'
    }
}