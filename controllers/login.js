var LocalStrategy   	= require('passport-local').Strategy;
var UserCtrl 			= require('./users');
var AuthCtrl			= require('./auth');
var bCrypt = require('bcrypt-nodejs');
var isValidPassword = function (user, password) {
		return bCrypt.compareSync(password, user.password);
	}
	var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
module.exports = function (passport) {
	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 
            // check in mongo if a user with username exists or not
            UserCtrl.readOne(username, 
                function(err, user) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done(null, false);                 
                    }
                    // User exists but wrong password, log the error
                    console.log('user.password');
                    console.log(user.password);
                    console.log(password);
                    var npassword = createHash(password);
                    console.log(npassword)
                    if (isValidPassword(user, npassword)){
                        console.log('Invalid Password');
                        return done(null, false); // redirect back to login page
                    }
                    // User and password both match, return user from done method
                    // which will be treated like success
                    return done(null, user);
                }
            );

        })
    );
}