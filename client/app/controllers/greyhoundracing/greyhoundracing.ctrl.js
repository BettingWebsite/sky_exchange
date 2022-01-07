app.controller(
  "greyhoundracingController",
  function ($scope, $http, $cookieStore, $interval, $rootScope) {
    $("#tabMenu li a").removeClass("select");
    if (!$('a[href="#!Greyhound Racing"]').hasClass("select")) {
        $rootScope.isCasinoPage = false;
        $('a[href="#!Greyhound Racing"]').addClass("select");
        $rootScope.TournamentList("4339.1", "Greyhound Racing Today's Card");
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

    $scope.showGreyhoundRacing = function() {
      $scope.todaysCard = $rootScope.sportsData[4339.1]? $rootScope.sportsData[4339.1]: {};
      $scope.tomorrow = $rootScope.sportsData[4339.2]? $rootScope.sportsData[4339.2]: {};
      $scope.todaysList = $scope.getListWise($scope.todaysCard, "tournaments");
      $scope.tomorrowList = $scope.getListWise($scope.tomorrow, "tournaments");
    }

    $scope.showGreyhoundRacing();

    $scope.getMatches = function(tour, day) {
      tour.day = day;
      $scope.selectedTournament = tour? tour: null;
      $scope.matchesList = $scope.getListWise($scope.selectedTournament, 'matches');
      $scope.selectedMatch = null;
    }

    $scope.getMarkets = function(match, day) {
      match.day = day;
      $scope.selectedMatch = match? match: null;
      if (day === 1) {
        var sportid = 4339.1;
      } else {
        var sportid = 4339.2;
      }
      $scope.marketsList = $rootScope.marketlistwise($scope.selectedMatch, $scope.selectedMatch.id, $scope.selectedTournament.id, sportid)
    }

    var highlightTimer;
    highlightTimer = $interval(function() {
      if (!(Object.keys($scope.todaysCard).length && Object.keys($scope.tomorrow).length)) {
        $scope.showGreyhoundRacing();
      } else {
        $interval.cancel(highlightTimer);
      }
    }, 500);

    $scope.$on("$destroy", function () {
      $interval.cancel(highlightTimer);
    });
  }
);
