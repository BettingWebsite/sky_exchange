app.controller(
  "cricketController",
  function ($scope, $http, $cookieStore, $interval, $rootScope, $websocket) {
    $scope.sportId = "4";
    $rootScope.s_id = "4";
    $rootScope.isCasinoPage = false;
    $("#tabMenu li a").removeClass("select");
    if (!$('a[href="#!Cricket"]').hasClass("select")) {
      $('a[href="#!Cricket"]').addClass("select");
      $rootScope.inplaydiv = false;
      $rootScope.mainfooter = false;
      $rootScope.TournamentList("4", "Cricket");
    }

    // var favoriteCookie = $cookieStore.get('Userdata');

    $("#loading_page").css("display", "grid");

    $scope.Highlightlist = [];
    $scope.oldHighlightlist = [];
    $scope.showcricketinter = false;
    $scope.matchData = [];
    $scope.showcricket = function () {
      $rootScope.getMatchDataFromWebSocket();
      $(".btn-lay").removeClass("spark");
      $(".btn-back").removeClass("spark");
      if ($scope.showcricketinter == false) {
        $scope.showcricketinter = true;
      }
      $scope.showcricketinter = false;
      // console.log(response);
      // $scope.cricket = response.data.data;
      // if (response.data.data.length < 1) {
      //     $scope.shoNoEvents = true;
      // } else {
      //     $scope.shoNoEvents = false;
      // }
      $scope.Highlightlist = $rootScope.highlightwisedata(4);
      console.log(">>>>>>>>>>>", $scope.Highlightlist);
      if ($scope.Highlightlist < 1) {
        $scope.shoNoEvents = true;
      } else {
        $scope.shoNoEvents = false;
      }

      $("#loading_page").css("display", "none");

      if ($scope.oldHighlightlist.length != $scope.Highlightlist.length) {
        $scope.oldHighlightlist = $scope.Highlightlist;
        $("#tabMenu li a").removeClass("select");
        if (!$('a[href="#!Cricket"]').hasClass("select")) {
          $('a[href="#!Cricket"]').addClass("select");
          $rootScope.inplaydiv = false;
          $rootScope.mainfooter = false;
          $rootScope.TournamentList("4", "Cricket");
        }
      }

      angular.forEach($scope.Highlightlist, function (item, index) {
        if (item.matchName == $scope.oldHighlightlist[index].matchName) {
          if (item.runner1Back != $scope.oldHighlightlist[index].runner1Back) {
            $("#hback1_" + index).addClass("spark");
          }
          if (item.runner1Lay != $scope.oldHighlightlist[index].runner1Lay) {
            $("#hlay1_" + index).addClass("spark");
          }
          if (item.runner2Back != $scope.oldHighlightlist[index].runner2Back) {
            $("#hback2_" + index).addClass("spark");
          }
          if (item.runner2Lay != $scope.oldHighlightlist[index].runner2Lay) {
            $("#hlay2_" + index).addClass("spark");
          }
          if (item.runner3Back != $scope.oldHighlightlist[index].runner3Back) {
            $("#hback3_" + index).addClass("spark");
          }
          if (item.runner3Lay != $scope.oldHighlightlist[index].runner3Lay) {
            $("#hlay3_" + index).addClass("spark");
          }

          if (item.bfId == $scope.oldHighlightlist[index].bfId) {
            // console.log(item.bfId)
          }
          if (item.marketId == $scope.oldHighlightlist[index].marketId) {
            // console.log(item.marketId)
          }
          if (item.mtBfId == $scope.oldHighlightlist[index].mtBfId) {
            // console.log(item.mtBfId)
          }
        }
      });
      $scope.oldHighlightlist = $scope.Highlightlist;
    };

    var highlightTimer;
    var highlightTimer1;
    if ($rootScope.authcookie) {
      highlightTimer1 = $interval(() => {
        if (!$scope.Highlightlist.length) {
          $scope.Highlightlist = $rootScope.highlightwisedata(4);
        } else {
          $interval.cancel(highlightTimer1);
        }
      }, 500);
      highlightTimer = $interval(function () {
        $scope.getMatchDataFromWebSocket();
      }, 10000);
    } else {
      highlightTimer = $interval(function () {
        $scope.getMatchDataFromWebSocket();
      }, 1000 * 60);
      highlightTimer1 = $interval(() => {
        if (!$scope.Highlightlist.length) {
          $scope.Highlightlist = $rootScope.highlightwisedata(4);
        } else {
          $interval.cancel(highlightTimer1);
        }
      }, 1000);
    }

    $scope.$on("$destroy", function () {
      $interval.cancel(highlightTimer);
      $interval.cancel(highlightTimer1);
    });
  }
);
