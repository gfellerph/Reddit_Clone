var express = require('express');
var router = express.Router();
var users = require('../controllers/users');

/* GET user list */
router.get('/list', users.list);

/* GET add user */
router.get('/add', function (req, res){
	res.render('../views/test/add');
});

/* GET add user */
router.get('/angular', function (req, res){
	res.render('../views/test/angular');
});

/* POST add user */
router.post('/add', users.add);

/* GET user with specific id */
router.get('/user/:id', users.one);

/* GET user update form */
router.get('/update/:id', users.updateForm);

/* PUT update a user */
router.post('/user/:id/update', users.update);


module.exports = router;