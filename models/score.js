// Score model
module.exports = function (object){

	var $this = this;
	this.upvotes = object.upvotes || 0;
	this.downvotes = object.downvotes || 0;

	this.get = function (){
		return $this.upvotes - $this.downvotes;
	};
}