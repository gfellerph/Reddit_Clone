// Mounted on localhost:3000/comments/

var express = require('express');
var router = express.Router();

// Angular Template
router.get('/comment-template', function (req, res){
	res.render('../views/comments/comment-template');
});

// Form template
router.get('/comment-form', function (req, res) {
	res.render('../views/comments/comment-form');
});

module.exports = router;