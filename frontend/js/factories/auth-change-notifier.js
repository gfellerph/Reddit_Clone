module.exports = function ($root) {
	var state;

	var broadcast = function ( state ) {
		$root.$broadcast('auth.update', state);
	};

	var update = function ( newState ) {
		state = newState;
		broadcast( state );
	};

	return {
		update: update,
		state: state
	};
};