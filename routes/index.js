var express = require('express');
var plugin = require('../controllers/plugin');
var project = require('../controllers/project');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express', changeItem: 'project,DynamicProject' });
});

router.get('/login', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/register', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/logout', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

//project router
router.get('/DynamicProject', project.DynamicIndex);
router.post('/addDynamicProject', project.addDynamicProject);
router.get('/verifyName', project.verifyName);
router.get('/StaticProject', project.StaticIndex);


//PC router
router.get('/DynamicPC', function(req, res, next) {
    res.render('pages/PC', { title: 'Express', changeItem: 'PC,DynamicPC' });
});
router.get('/StaticPC', function(req, res, next) {
    res.render('pages/PC', { title: 'Express', changeItem: 'PC,StaticPC' });
});



//plugin router
router.get('/plugin', plugin.index);
router.post('/addPlugin', plugin.addPlugin);


router.get('/notice', function(req, res, next) {
    res.render('pages/notice', { title: 'Express', changeItem: 'notice' });
});

router.get('/coding', function(req, res, next) {
    res.render('pages/codings', { title: 'Express', changeItem: 'coding' });
});

router.get('/users', function(req, res, next) {
    res.render('index', { title: 'Express', changeItem: 'user' });
});

router.get('/information', function(req, res, next) {
    res.render('index', { title: 'Express', changeItem: 'information' });
});

router.get('/settings', function(req, res, next) {
    res.render('pages/settings', { title: 'Express', changeItem: 'settings' });
});

router.get('/document', function(req, res, next) {
    res.render('index', { title: 'Express', changeItem: 'document' });
});

module.exports = router;
