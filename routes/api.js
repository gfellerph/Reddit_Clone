var express = require('express');
var router = express.Router();
var posts = require('../controllers/posts');


// Posts API
router.get('/posts', posts.getAll);
router.get('/post/:id', posts.getOne);
router.post('/post', posts.add);
router.put('/post/:id', posts.update);
router.put('/post/:id/upvote', posts.upvote);
router.put('/post/:id/downvote', posts.downvote);
router.delete('/post/:id', posts.delete);


module.exports = router;