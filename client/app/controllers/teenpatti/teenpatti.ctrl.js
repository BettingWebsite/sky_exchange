app.controller(
  "teenpattiController",
  function ($scope, $http, $cookieStore, $interval, $rootScope) {
    $rootScope.isCasinoPage = false;
    $("#tabMenu li a").removeClass("select");
    if (!$('a[href="#!Live Teenpatti"]').hasClass("select")) {
      $('a[href="#!Live Teenpatti"]').addClass("select");
      $rootScope.inplaydiv = false;
      $rootScope.mainfooter = false;
      $rootScope.TournamentList("15", "Live Teenpatti");
    }

    $scope.Highlightlist = [];
    $scope.oldHighlightlist = [];
    $("#loading").css("display", "grid");

    // $scope.showtennisinter = false;
    $scope.showTeenpatti = function () {
      // $(".btn-lay").removeClass("spark");
      // $(".btn-back").removeClass("spark");
      // if ($scope.showtennisinter == false) {
      //   $scope.showtennisinter = true;
      // }
      $http({
        url: baseUrl + "/listCasinoTable",

        method: "GET",

        headers: {
          Authorization: authtoken,
        },
      }).then(
        function mySuccess(response) {
          console.log("teen", response);
          if (
            response.data.result == null ||
            response.data.result[0].tables.length < 1
          ) {
            $scope.shoNoEvents = true;
          } else {
            $scope.shoNoEvents = false;
            $scope.StreamServer = response.data.result[0].streamServer;
            $scope.OddServer1 = response.data.result[0].oddServer1;
            $scope.OddServer2 = response.data.result[0].oddServer2;
            $scope.Highlightlist = response.data.result[0].tables;
          }
          $("#loading").css("display", "none");

          // if ($scope.oldHighlightlist.length != $scope.Highlightlist.length) {
          //   $scope.oldHighlightlist = $scope.Highlightlist;
          // }

          // angular.forEach($scope.Highlightlist, function (item, index) {
          //   if (item.matchName == $scope.oldHighlightlist[index].matchName) {
          //     if (
          //       item.runner1Back != $scope.oldHighlightlist[index].runner1Back
          //     ) {
          //       $("#hback1_" + index).addClass("spark");
          //     }
          //     if (
          //       item.runner1Lay != $scope.oldHighlightlist[index].runner1Lay
          //     ) {
          //       $("#hlay1_" + index).addClass("spark");
          //     }
          //     if (
          //       item.runner2Back != $scope.oldHighlightlist[index].runner2Back
          //     ) {
          //       $("#hback2_" + index).addClass("spark");
          //     }
          //     if (
          //       item.runner2Lay != $scope.oldHighlightlist[index].runner2Lay
          //     ) {
          //       $("#hlay2_" + index).addClass("spark");
          //     }
          //     if (
          //       item.runner3Back != $scope.oldHighlightlist[index].runner3Back
          //     ) {
          //       $("#hback3_" + index).addClass("spark");
          //     }
          //     if (
          //       item.runner3Lay != $scope.oldHighlightlist[index].runner3Lay
          //     ) {
          //       $("#hlay3_" + index).addClass("spark");
          //     }
          //   }
          // });
          // $scope.oldHighlightlist = $scope.Highlightlist;

          // console.log($scope.cricket)
        },
        function myError(error) {
          // $scope.showtennisinter = false;
          if (error.status == 401) {
            // $.removeCookie("authtoken");
            // window.location.href="index.html"
          }
        }
      );

      // if ($rootScope.fType == 1) {
      //   $http({
      //     url:
      //       "http://136.244.79.114:82/listCasinoTable",

      //     method: "GET",

      //     headers: {
      //       Authorization: authtoken,
      //     },
      //   }).then(
      //     function mySuccess(response) {
      //       console.log("------result")
      //       console.log(response)
      //       $scope.showtennisinter = false;
      //       // console.log(response);
      //       // $scope.cricket = response.data.data;
      //       if (response.data.data.length < 1) {
      //         $scope.shoNoEvents = true;
      //       } else {
      //         $scope.shoNoEvents = false;
      //       }
      //       $scope.Highlightlist = response.data.data;

      //       $("#loading_page").css("display", "none");

      //       if ($scope.oldHighlightlist.length != $scope.Highlightlist.length) {
      //         $scope.oldHighlightlist = $scope.Highlightlist;
      //       }

      //       angular.forEach($scope.Highlightlist, function (item, index) {
      //         if (item.matchName == $scope.oldHighlightlist[index].matchName) {
      //           if (
      //             item.runner1Back != $scope.oldHighlightlist[index].runner1Back
      //           ) {
      //             $("#hback1_" + index).addClass("spark");
      //           }
      //           if (
      //             item.runner1Lay != $scope.oldHighlightlist[index].runner1Lay
      //           ) {
      //             $("#hlay1_" + index).addClass("spark");
      //           }
      //           if (
      //             item.runner2Back != $scope.oldHighlightlist[index].runner2Back
      //           ) {
      //             $("#hback2_" + index).addClass("spark");
      //           }
      //           if (
      //             item.runner2Lay != $scope.oldHighlightlist[index].runner2Lay
      //           ) {
      //             $("#hlay2_" + index).addClass("spark");
      //           }
      //           if (
      //             item.runner3Back != $scope.oldHighlightlist[index].runner3Back
      //           ) {
      //             $("#hback3_" + index).addClass("spark");
      //           }
      //           if (
      //             item.runner3Lay != $scope.oldHighlightlist[index].runner3Lay
      //           ) {
      //             $("#hlay3_" + index).addClass("spark");
      //           }
      //         }
      //       });
      //       $scope.oldHighlightlist = $scope.Highlightlist;

      //       // console.log($scope.cricket)
      //     },
      //     function myError(error) {
      //       $scope.showtennisinter = false;
      //       if (error.status == 401) {
      //         // $.removeCookie("authtoken");
      //         // window.location.href="index.html"
      //       }
      //     }
      //   );
      // } else {
      //   $scope.showtennisinter = false;
      //   // console.log(response);
      //   // $scope.cricket = response.data.data;

      //   $scope.Highlightlist = $rootScope.highlightwisedata(15);
      //   if ($scope.Highlightlist.length < 1) {
      //     $scope.shoNoEvents = true;
      //   } else {
      //     $scope.shoNoEvents = false;
      //   }

      //   $("#loading_page").css("display", "none");

      //   if ($scope.oldHighlightlist.length != $scope.Highlightlist.length) {
      //     $scope.oldHighlightlist = $scope.Highlightlist;
      //     $("#tabMenu li a").removeClass("select");
      //     if (!$('a[href="#!Live Teenpatti"]').hasClass("select")) {
      //       $('a[href="#!Live Teenpatti"]').addClass("select");
      //       $rootScope.inplaydiv = false;
      //       $rootScope.mainfooter = false;
      //       $rootScope.TournamentList("15", "Live Teenpatti");
      //     }
      //   }

      //   angular.forEach($scope.Highlightlist, function (item, index) {
      //     if (item.matchName == $scope.oldHighlightlist[index].matchName) {
      //       if (
      //         item.runner1Back != $scope.oldHighlightlist[index].runner1Back
      //       ) {
      //         $("#hback1_" + index).addClass("spark");
      //       }
      //       if (item.runner1Lay != $scope.oldHighlightlist[index].runner1Lay) {
      //         $("#hlay1_" + index).addClass("spark");
      //       }
      //       if (
      //         item.runner2Back != $scope.oldHighlightlist[index].runner2Back
      //       ) {
      //         $("#hback2_" + index).addClass("spark");
      //       }
      //       if (item.runner2Lay != $scope.oldHighlightlist[index].runner2Lay) {
      //         $("#hlay2_" + index).addClass("spark");
      //       }
      //       if (
      //         item.runner3Back != $scope.oldHighlightlist[index].runner3Back
      //       ) {
      //         $("#hback3_" + index).addClass("spark");
      //       }
      //       if (item.runner3Lay != $scope.oldHighlightlist[index].runner3Lay) {
      //         $("#hlay3_" + index).addClass("spark");
      //       }
      //     }
      //   });
      //   $scope.oldHighlightlist = $scope.Highlightlist;
      // }
    };

    // var highlightTimer = $interval(function () {
    $scope.showTeenpatti();
    // }, 15);

    // $scope.$on("$destroy", function () {
    //   $interval.cancel(highlightTimer);
    // });
  }
);
