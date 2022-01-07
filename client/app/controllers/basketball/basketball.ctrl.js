app.controller(
  "BasketballController",
  function ($scope, $http, $cookieStore, $interval, $rootScope) {
    $("#tabMenu li a").removeClass("select");
    if (!$('a[href="#!Basketball"]').hasClass("select")) {
      $('a[href="#!Basketball"]').addClass("select");
    }
  }
);
