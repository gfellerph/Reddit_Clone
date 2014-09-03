var express = require('express');
var router = express.Router();

router.get('/', function (req, res){
	res.render('../views/posts/index', { title: 'Posts'});
});


module.exports = router;