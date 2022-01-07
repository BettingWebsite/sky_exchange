app.controller(
  "inplayController",
  function ($scope, $http, $cookieStore, $interval, $rootScope) {
    $rootScope.inplaydiv = true;
    $rootScope.mainfooter = true;
    $rootScope.isCasinoPage = false;

    // console.log($('a[href="#!inplay"]').hasClass('select'))
    $("#tabMenu li a").removeClass("select");
    if (!$('a[href="#!inplay"]').hasClass("select")) {
      $('a[href="#!inplay"]').addClass("select");
      $rootScope.inplaydiv = true;
      $rootScope.mainfooter = true;
    }

    $scope.active = false;
    $rootScope.inplayRunnerData = {};
    var favoriteCookie = $cookieStore.get("Userdata");

    // console.log(favoriteCookie)
    $scope.oldInplayListData = [];
    $scope.inplayListData = [];
    $("#loading_page").css("display", "grid");

    $scope.inplay_interval = false;
    $scope.inplay = function () {
      $(".btn-lay").removeClass("spark");
      $(".btn-back").removeClass("spark");
      if ($scope.inplay_interval == false) {
        $scope.inplay_interval = true;
      }
      $scope.inplay_interval = false;
      // console.log(response.data.data);
      $scope.inplayListData = $rootScope
        .inplaylistwise($rootScope.sportsData, 0)
        .reverse();

      // console.log($scope.inplayListData);
      $scope.dataCount = $scope.inplayListData.length;

      $("#loading_page").css("display", "none");

      if ($scope.oldInplayListData.length != $scope.inplayListData.length) {
        $scope.oldInplayListData = $scope.inplayListData;
      }

      angular.forEach($scope.inplayListData, function (item, index) {
        if (item.name == $scope.oldInplayListData[index].name) {
          // console.log(item.name)
          $scope.oldInplayData = $scope.oldInplayListData[index].inplayData;
          angular.forEach(item.inplayData, function (item2, index2) {
            if (
              item2.matchName &&
              $scope.oldInplayData[index2] &&
              item2.matchName == $scope.oldInplayData[index2].matchName
            ) {
              // console.log(item2.matchName)

              if (
                item2.runner1Back != $scope.oldInplayData[index2].runner1Back
              ) {
                $("#back1_" + index2).addClass("spark");
              }
              if (item2.runner1Lay != $scope.oldInplayData[index2].runner1Lay) {
                $("#lay1_" + index2).addClass("spark");
              }
              if (
                item2.runner2Back != $scope.oldInplayData[index2].runner2Back
              ) {
                $("#back2_" + index2).addClass("spark");
              }
              if (item2.runner2Lay != $scope.oldInplayData[index2].runner2Lay) {
                $("#lay2_" + index2).addClass("spark");
              }
              if (
                item2.runner3Back != $scope.oldInplayData[index2].runner3Back
              ) {
                $("#back3_" + index2).addClass("spark");
              }
              if (item2.runner3Lay != $scope.oldInplayData[index2].runner3Lay) {
                $("#lay3_" + index2).addClass("spark");
              }
            }
          });
        }
      });
      $scope.oldInplayListData = $scope.inplayListData;
    };

    $scope.getOdds = function () {
      var ids = "";
      var highlightdataIds = [];

      // var inplay
      angular.forEach($scope.inplayListData, (sport) => {
        angular.forEach(sport.inplayData, (event) => {
          highlightdataIds.push(event.bfId);
        });
        ids = highlightdataIds.join(",");
        if (ids !== "") {
          $http({
            url:
              "http://209.250.242.175:33332/matchOdds/" +
              sport.bfId +
              "/?ids=" +
              ids,
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }).then(
            function mySuccess(response) {
              angular.forEach(response.data, function (market, index) {
                $rootScope.inplayRunnerData[market.eventId] = market;
              });
            },
            function () {
              angular.forEach($scope.events, function (match, index) {
                $rootScope.inplayRunnerData[match.eventId] = {};
              });
            }
          );
        }
      });
    };

    var inplayTimer = $interval(function () {
      if (!$scope.inplayListData.length) {
        $scope.inplay();
      }
      $scope.getOdds();
    }, 1000);

    var getGamesTimer = $interval(() => {
      $scope.inplay();
    }, 15000);

    $scope.$on("$destroy", function () {
      $interval.cancel(inplayTimer);
      $interval.cancel(getGamesTimer);
    });
  }
);
