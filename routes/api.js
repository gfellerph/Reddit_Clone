var express = require('express');
var router = express.Router();


router.get('/list', function (req, res){
	res.send('list');
});


module.exports = router;