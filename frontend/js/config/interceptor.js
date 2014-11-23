module.exports = [
	'$httpProvider'
	, function ($httpProvider) {
		
		//Http Intercpetor to check auth failures for xhr requests
		$httpProvider.interceptors.push('authInterceptor');
	}
]