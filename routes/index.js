var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.render('../views/index', {user: req.user, loggedIn: req.isAuthenticated()});
});



module.exports = router;