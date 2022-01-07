app.controller(
  "kabaddiController",
  function ($scope, $http, $cookieStore, $interval, $rootScope) {
    $rootScope.isCasinoPage = false;
    $("#tabMenu li a").removeClass("select");
    if (!$('a[href="#!Kabaddi"]').hasClass("select")) {
      $('a[href="#!Kabaddi"]').addClass("select");
      $rootScope.inplaydiv = false;
      $rootScope.mainfooter = false;
      if ($rootScope) {
        $rootScope.TournamentList("20", "Kabaddi");
      }
    }

    $scope.Highlightlist = [];
    $scope.oldHighlightlist = [];
    $("#loading_page").css("display", "grid");

    $scope.showtennisinter = false;
    $scope.showkabaddi = function () {
      $(".btn-lay").removeClass("spark");
      $(".btn-back").removeClass("spark");
      if ($scope.showtennisinter == false) {
        $scope.showtennisinter = true;
      }
      if ($rootScope.fType == 1) {
        $http({
          url:
            "http://www.lcexchanges247.com/Client/BetClient.svc/Data/Highlights?sid=20",

          method: "GET",

          headers: {
            Token: authtoken,
          },
        }).then(
          function mySuccess(response) {
            $scope.showtennisinter = false;
            // console.log(response);
            // $scope.cricket = response.data.data;
            if (response.data.data.length < 1) {
              $scope.shoNoEvents = true;
            } else {
              $scope.shoNoEvents = false;
            }
            $scope.Highlightlist = response.data.data;

            $("#loading_page").css("display", "none");

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
              }
            });
            $scope.oldHighlightlist = $scope.Highlightlist;

            // console.log($scope.cricket)
          },
          function myError(error) {
            $scope.showtennisinter = false;
            if (error.status == 401) {
              // $.removeCookie("authtoken");
              // window.location.href="index.html"
            }
          }
        );
      } else {
        $scope.showtennisinter = false;
        // console.log(response);
        // $scope.cricket = response.data.data;

        $scope.Highlightlist = $rootScope.highlightwisedata(20);
        if ($scope.Highlightlist.length < 1) {
          $scope.shoNoEvents = true;
        } else {
          $scope.shoNoEvents = false;
        }

        $("#loading_page").css("display", "none");

        if ($scope.oldHighlightlist.length != $scope.Highlightlist.length) {
          $scope.oldHighlightlist = $scope.Highlightlist;
          $("#tabMenu li a").removeClass("select");
          if (!$('a[href="#!Kabaddi"]').hasClass("select")) {
            $('a[href="#!Kabaddi"]').addClass("select");
            $rootScope.inplaydiv = false;
            $rootScope.mainfooter = false;
            if ($rootScope.sportsData) {
              $rootScope.TournamentList("20", "Kabaddi");
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
          }
        });
        $scope.oldHighlightlist = $scope.Highlightlist;
      }
    };

    var highlightTimer = $interval(function () {
      $scope.showkabaddi();
    }, 1000);

    $scope.$on("$destroy", function () {
      $interval.cancel(highlightTimer);
    });
  }
);
