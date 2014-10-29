// MOUNTED ON '/api/...'

var express 	= require('express');
var router 		= express.Router();
var posts 		= require('../controllers/posts');
var comments 	= require('../controllers/comments');

// Posts API
router.get('/posts', posts.getAll);
router.get('/post/:id', posts.getOne);
router.post('/post', posts.add);
router.put('/post/:id', posts.update);
router.put('/post/:id/upvote', posts.upvote);
router.put('/post/:id/downvote', posts.downvote);
router.delete('/post/:id', posts.delete);

// Comments API
router.get('/comments', comments.getAll);
router.get('/comment/:id', comments.getOne);
router.post('/comment', comments.add);
router.put('/comment/:id', comments.update);
router.put('/comment/:id/upvote', comments.upvote);
router.put('/comment/:id/downvote', comments.downvote);
router.delete('/comment/:id', comments.delete);

// Return router
module.exports = router;