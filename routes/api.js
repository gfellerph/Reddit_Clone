var express = require('express');
var router = express.Router();
var posts = require('../controllers/posts');


router.get('/list', function (req, res){
	res.send('list');
});

// Posts API
router.get('/posts', posts.getAll);
router.get('/post/:id', posts.getOne);
router.post('/post', posts.add);
router.put('/post/:id', posts.update);
router.delete('/post/:id', posts.delete);


module.exports = router;