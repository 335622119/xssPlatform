var config = {
    debug: true,
    cryptionAlgorithm: 'aes-256-cbc',
    cryptionKey: '123456'
};
//parseInt(Math.random(1)*1000000)
config.db = 'mongodb://127.0.0.1/xssPlatform';
module.exports = config;