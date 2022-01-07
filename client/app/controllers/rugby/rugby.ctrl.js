app.controller(
  "rugbyunionController",
  function ($scope, $http, $cookieStore, $interval, $rootScope) {
    $("#tabMenu li a").removeClass("select");
    if (!$('a[href="#!Rugby Union"]').hasClass("select")) {
      $('a[href="#!Rugby Union"]').addClass("select");
    }
  }
);
