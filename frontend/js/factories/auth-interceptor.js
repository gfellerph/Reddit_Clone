module.exports = [
	'$q'
	, '$location'
	, function ($q, $location) {
		var handler = {
			response: function (response) {
				if (response.status === 401) {
					// console.log(response.status);
				}
				return response || $q.when(response);
			}
			, responseError: function (rejection) {
				if (rejection.status === 401) {
					$location.path('/login').search('returnTo', JSON.parse(rejection.data).returnTo);
				}
				return $q.reject(rejection);
			}
		}

		return handler;
	}
];