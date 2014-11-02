// Mounted on localhost:3000/comments/

var express = require('express');
var router = express.Router();

// Angular Template
router.get('/comment-template', function (req, res){
	res.render('../views/comments/comment-template');
});

module.exports = router;