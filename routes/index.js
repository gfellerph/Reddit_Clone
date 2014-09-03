var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

/* GET some subpage */
router.get('/post', function (req, res){
	res.render('post', { title: 'Post' });
});



module.exports = router;