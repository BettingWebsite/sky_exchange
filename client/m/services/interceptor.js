function authInterceptor($rootScope) {
  return {
    response: function (res) {
      if (res.config.url.includes(ApiUrl)) {
        if (res.data.errorDescription && (res.data.errorDescription.toLowerCase().includes('no session') || res.data.errorDescription.toLowerCase().includes('session expired'))) {
            if (token) {
                $rootScope.clearCookies();
            }
        }
      }
      return res;
    },
  };
}

app
  .factory("authInterceptor", authInterceptor)
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push("authInterceptor");
  });
