app.controller(
  "soccerController",
  function ($scope, $http, $cookieStore, $interval, $rootScope) {
    $rootScope.isCasinoPage = false;
    $("#tabMenu li a").removeClass("select");
    if (!$('a[href="#!Soccer"]').hasClass("select")) {
      $('a[href="#!Soccer"]').addClass("select");
      $rootScope.inplaydiv = false;
      $rootScope.mainfooter = false;
      if ($rootScope.sportsData) {
        $rootScope.TournamentList("1", "Soccer");
      }
    }

    $("#loading_page").css("display", "grid");

    $scope.Highlightlist = [];
    $scope.oldHighlightlist = [];
    $scope.showsoccerinter = false;
    $rootScope.s_id = "1";
    $scope.showsoccer = function () {
      $rootScope.getMatchDataFromWebSocket();
      $(".btn-lay").removeClass("spark");
      $(".btn-back").removeClass("spark");
      if ($scope.showsoccerinter == false) {
        $scope.showsoccerinter = true;
      }
      if ($rootScope.fType == 1) {
        $http({
          url:
            "http://www.lcexchanges247.com/Client/BetClient.svc/Data/Highlights?sid=" +
            1,

          method: "GET",

          headers: {
            Token: authtoken,
          },
        }).then(
          function mySuccess(response) {
            $("#loading_page").css("display", "none");
            $scope.showsoccerinter = false;
            // console.log(response);
            // $scope.cricket = response.data.data;
            if (response.data.data.length < 1) {
              $scope.shoNoEvents = true;
            } else {
              $scope.shoNoEvents = false;
            }
            $scope.Highlightlist = response.data.data;

            if ($scope.oldHighlightlist.length != $scope.Highlightlist.length) {
              $scope.oldHighlightlist = $scope.Highlightlist;
            }

            angular.forEach($scope.Highlightlist, function (item, index) {
              if (item.matchName == $scope.oldHighlightlist[index].matchName) {
                if (
                  item.runner1Back != $scope.oldHighlightlist[index].runner1Back
                ) {
                  $("#hback1_" + index).addClass("spark");
                }
                if (
                  item.runner1Lay != $scope.oldHighlightlist[index].runner1Lay
                ) {
                  $("#hlay1_" + index).addClass("spark");
                }
                if (
                  item.runner2Back != $scope.oldHighlightlist[index].runner2Back
                ) {
                  $("#hback2_" + index).addClass("spark");
                }
                if (
                  item.runner2Lay != $scope.oldHighlightlist[index].runner2Lay
                ) {
                  $("#hlay2_" + index).addClass("spark");
                }
                if (
                  item.runner3Back != $scope.oldHighlightlist[index].runner3Back
                ) {
                  $("#hback3_" + index).addClass("spark");
                }
                if (
                  item.runner3Lay != $scope.oldHighlightlist[index].runner3Lay
                ) {
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

            // console.log($scope.cricket)
          },
          function myError(error) {
            $scope.showsoccerinter = false;
            if (error.status == 401) {
              // $.removeCookie("authtoken");
              // window.location.href="index.html"
            }
          }
        );
      } else {
        $("#loading_page").css("display", "none");
        $scope.showsoccerinter = false;
        // console.log(response);
        // $scope.cricket = response.data.data;

        $scope.Highlightlist = $rootScope.highlightwisedata(1);
        if ($scope.Highlightlist.length < 1) {
          $scope.shoNoEvents = true;
        } else {
          $scope.shoNoEvents = false;
        }

        if ($scope.oldHighlightlist.length != $scope.Highlightlist.length) {
          $scope.oldHighlightlist = $scope.Highlightlist;
          $("#tabMenu li a").removeClass("select");
          if (!$('a[href="#!Soccer"]').hasClass("select")) {
            $('a[href="#!Soccer"]').addClass("select");
            $rootScope.inplaydiv = false;
            $rootScope.mainfooter = false;
            if ($rootScope.sportsData) {
              $rootScope.TournamentList("1", "Soccer");
            }
          }
        }

        angular.forEach($scope.Highlightlist, function (item, index) {
          if (item.matchName == $scope.oldHighlightlist[index].matchName) {
            if (
              item.runner1Back != $scope.oldHighlightlist[index].runner1Back
            ) {
              $("#hback1_" + index).addClass("spark");
            }
            if (item.runner1Lay != $scope.oldHighlightlist[index].runner1Lay) {
              $("#hlay1_" + index).addClass("spark");
            }
            if (
              item.runner2Back != $scope.oldHighlightlist[index].runner2Back
            ) {
              $("#hback2_" + index).addClass("spark");
            }
            if (item.runner2Lay != $scope.oldHighlightlist[index].runner2Lay) {
              $("#hlay2_" + index).addClass("spark");
            }
            if (
              item.runner3Back != $scope.oldHighlightlist[index].runner3Back
            ) {
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
      }
    };

    var highlightTimer;
    if ($rootScope.authcookie) {
      var highlightTimer1 = $interval(() => {
        if (!$scope.Highlightlist.length) {
          $scope.Highlightlist = $rootScope.highlightwisedata(1);
        } else {
          $interval.cancel(highlightTimer1);
        }
      }, 500);
      highlightTimer = $interval(function () {
        $scope.showsoccer();
      }, 10000);
    } else {
      highlightTimer = $interval(function () {
        $scope.showsoccer();
      }, 1000 * 60);
      var highlightTimer1 = $interval(() => {
        if (!$scope.Highlightlist.length) {
          $scope.showsoccer();
        } else {
          $interval.cancel(highlightTimer1);
        }
      }, 1000);
    }

    $scope.$on("$destroy", function () {
      $interval.cancel(highlightTimer);
    });
  }
);
