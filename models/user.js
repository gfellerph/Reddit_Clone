// User model
module.exports = function (object){
	if(!object) object = {};

	this.name = object.name || '';
	this.joined = object.joined || Date.now();
};