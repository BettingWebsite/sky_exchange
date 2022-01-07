app.run(function ($rootScope, $location, $interval) {
  $rootScope.matchDataHome = {};
  $rootScope.$on("$locationChangeStart", function () {
    if ($location.path().split("/").indexOf("full-market") > -1) {
      $(".matched-wrap").css("height", "calc(100% - 30px)");
      $rootScope.showLiveTv = true;
      $rootScope.liveTvContent = true;
    } else {
      // $('.slip-wrap.live_tv').addClass("close")
      $(".matched-wrap").css("height", "calc(100% - 30px)");
      $("#showLiveTvPro").empty();
      $rootScope.showLiveTv = false;
      $rootScope.liveTvContent = false;
    }
  });
})
.config(['$provide', function($provide) {
    var DEFAULT_TIMEZONE = 'Asia/Kolkata';

    $provide.decorator('dateFilter', ['$delegate', '$injector', function($delegate, $injector) {
      var oldDelegate = $delegate;

      var standardDateFilterInterceptor = function(date, format, timezone) {
        if(angular.isUndefined(timezone)) {
          timezone = DEFAULT_TIMEZONE;
        }
        return oldDelegate.apply(this, [date, format, timezone]);
      };

      return standardDateFilterInterceptor;
    }]);
}]);
