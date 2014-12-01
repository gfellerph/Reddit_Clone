// Mounted on localhost:3000/profile/

var express = require('express');
var router = express.Router();

// Angular Template
router.get('/template', function (req, res){
	res.render('../views/profile/profile');
});

module.exports = router;