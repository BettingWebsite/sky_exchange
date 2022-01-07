app.controller(
  "tomorrowController",
  function ($scope, $http, $cookieStore, $rootScope, $interval) {
    $rootScope.isCasinoPage = false;
    // var favoriteCookie = $cookieStore.get('Userdata');
    $("#tabMenu li a").removeClass("select");
    if (!$('a[href="#!inplay"]').hasClass("select")) {
      $('a[href="#!inplay"]').addClass("select");
      $rootScope.inplaydiv = true;
      $rootScope.mainfooter = true;
    }
    $("#loading_page").css("display", "grid");

    $scope.filteredSports = ["Cricket", "Soccer", "Tennis", "Kabaddi"];
    $scope.getsportNameFilter = ["Cricket", "Soccer", "Tennis", "Kabaddi"];
    $scope.sportNameFilter = ["Cricket", "Soccer", "Tennis", "Kabaddi"];
    $scope.tomevent = [];

    $scope.selectedAll = true;

    $scope.existSport = function (item) {
      return $scope.sportNameFilter.indexOf(item) > -1;
    };
    $scope.toggleSportSelection = function (item) {
      var idx = $scope.sportNameFilter.indexOf(item);
      if (idx > -1) {
        $scope.sportNameFilter.splice(idx, 1);
      } else {
        $scope.sportNameFilter.push(item);
      }
    };

    $scope.checkAll = function () {
      if (!$scope.selectedAll) {
        $scope.sportNameFilter = [];
      } else {
        angular.forEach($scope.getsportNameFilter, function (item) {
          idx = $scope.sportNameFilter.indexOf(item);
          if (idx >= 0) {
            return true;
          } else {
            $scope.sportNameFilter.push(item);
          }
        });
      }
    };

    $scope.upcomingeventstom = function () {
      $scope.tomevent = [];
      if ($rootScope.sportsData != undefined) {
        $scope.tomevent_data = $rootScope
          .inplaylistwise($rootScope.sportsData, 2)
          .reverse();
        // console.log($scope.tomevent_data,"tomorrow")
      }
    };

    var tomorrowTimer = $interval(() => {
      $scope.upcomingeventstom();
    }, 5000);

    $scope.$on("$destroy", () => {
      $interval.cancel(tomorrowTimer);
    });
  }
);
