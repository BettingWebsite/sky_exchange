app.controller(
  "casinoController",
  function ($scope, $http, $cookieStore, $interval, $rootScope) {
    $rootScope.isCasinoPage = true;
    $rootScope.inplaydiv = false;
    $rootScope.mainfooter = false;
    $("#tabMenu li a").removeClass("select");
    if (!$('a[href="#!Casino"]').hasClass("select")) {
      $('a[href="#!Casino"]').addClass("select");
    }
  }
);
