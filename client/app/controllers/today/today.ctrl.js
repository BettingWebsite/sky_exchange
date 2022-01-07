app.controller(
  "todayController",
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

    // $scope.sportNameFilter=[]
    $scope.filteredSports = ["Cricket", "Soccer", "Tennis", "Kabaddi"];
    $scope.getsportNameFilter = ["Cricket", "Soccer", "Tennis", "Kabaddi"];
    $scope.sportNameFilter = ["Cricket", "Soccer", "Tennis", "Kabaddi"];
    $scope.todevent = [];

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

    $scope.upcomingevents = function () {
      $scope.todevent = [];
      if ($rootScope.sportsData != undefined) {
        $scope.todevent_data = $rootScope
          .inplaylistwise($rootScope.sportsData, 1)
          .reverse();
        // console.log($scope.todevent_data,"today")
      }
    };

    var todayTimer = $interval(() => {
      $scope.upcomingevents();
    }, 5000);

    $scope.$on("$destroy", () => {
      $interval.cancel(todayTimer);
    });
  }
);
