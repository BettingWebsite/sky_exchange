app.controller(
  "horseracingController",
  function ($scope, $http, $cookieStore, $interval, $rootScope) {
    $("#tabMenu li a").removeClass("select");
    $rootScope.isCasinoPage = false;
    if (!$('a[href="#!Horse Racing"]').hasClass("select")) {
        $('a[href="#!Horse Racing"]').addClass("select");
        $rootScope.inplaydiv = false;
        $rootScope.mainfooter = false;
        $rootScope.TournamentList("7.1", "Horse Racing Today's Card");
    }
    
    $scope.Highlightlist = [];
    $scope.todaysCard = {};
    $scope.todaysList = {};
    $scope.tomorrow = {};
    $scope.tomorrowList = {};

    $scope.getListWise = function(obj, field) {
      let list = [];
      angular.forEach(obj[field], (value) => {
        list.push(value);
      })
      return list;
    } 

    $scope.showHorseRacing = function() {
      $scope.todaysCard = $rootScope.sportsData[7.1]? $rootScope.sportsData[7.1]: {};
      $scope.tomorrow = $rootScope.sportsData[7.2]? $rootScope.sportsData[7.2]: {};
      $scope.todaysList = $scope.getListWise($scope.todaysCard, "tournaments");
      $scope.tomorrowList = $scope.getListWise($scope.tomorrow, "tournaments");
    }

    $scope.showHorseRacing();

    $scope.getMatches = function(tour, day) {
      tour.day = day;
      $scope.selectedTournament = tour? tour: null;
      $scope.matchesList = $scope.getListWise($scope.selectedTournament, 'matches');
      $scope.selectedMatch = null;
      console.log($scope.matchesList);
    }

    $scope.getMarkets = function(match, day) {
      match.day = day;
      $scope.selectedMatch = match? match: null;
      if (day === 1) {
        var sportid = 7.1;
      } else {
        var sportid = 7.2;
      }
      $scope.marketsList = $rootScope.marketlistwise($scope.selectedMatch, $scope.selectedMatch.id, $scope.selectedTournament.id, sportid)
    }

    var highlightTimer;
    highlightTimer = $interval(function() {
      if (!(Object.keys($scope.todaysCard).length && Object.keys($scope.tomorrow).length)) {
        $scope.showHorseRacing();
      } else {
        console.log($scope.todaysCard);
        $interval.cancel(highlightTimer);
      }
    }, 500);

    $scope.$on("$destroy", function () {
      $interval.cancel(highlightTimer);
    });
  }
);
