app.controller(
  "multiMarketController",
  function (
    $scope,
    $http,
    $cookies,
    $rootScope,
    $timeout,
    $window,
    NavigationServices,
    $routeParams,
    $interval,
    $location,
    $websocket
  ) {
    $rootScope.selectedTab = "multiMarket";

    $scope.multiMarketsCalls = false;
    // $scope.getMultiMarkets = function () {
    //   if ($rootScope.token == undefined || $rootScope.token == "") {
    //     return false;
    //   }
    //   if ($scope.multiMarketsCalls == false) {
    //     return false;
    //   }
    //   $scope.multiMarketsCalls = false;

    //   $rootScope.marketBfIdArray = [];
    //   $rootScope.fancyBfIdArray = [];

    //   $("#loading").css("display", "flex");
    //   $scope.multiMarketsCalls = true;
    //   $rootScope.multiMarketData = JSON.parse(
    //     localStorage.getItem(multiMarketArray)
    //   );
    //   $("#loading").css("display", "none");

    //   $timeout(function () {
    //     angular.forEach($rootScope.multiMarketData, function (item) {
    //       $rootScope.getExposureBook(item.mktId);
    //       $rootScope.marketBfIdArray.push(item.bfId);
    //       if ($scope.marketHubAddress == null && item.dataMode == 1) {
    //         $scope.getHubAddress(item.mktId);
    //       }
    //     });
    //   }, 300);
    //   $scope.multiMarketsCalls = true;
    //   $("#loading").css("display", "none");
    //   if (err.status == 401) {
    //     $rootScope.clearCookies();
    //   }
    // };
    // $("#loading").css("display", "none");
    // $scope.multiMarketsCalls = true;
    // if ($rootScope.SportsDatas != undefined) {
    //   $rootScope.multiMarketDatas = $rootScope.multiMarketsWise(
    //     $rootScope.sportsData
    //   );
    //   $rootScope.multiMarketData = $rootScope.multiMarketDatas.marketData;
    //   $rootScope.multiFancyData = $rootScope.multiMarketDatas.fancyData;

    //   $timeout(function () {
    //     // if ($rootScope.multiFancyData.length!=0) {
    //     // 	$scope.MatchSessionSignalr();
    //     // }
    //     angular.forEach($rootScope.multiMarketData, function (item) {
    //       // angular.forEach(item.runnerData, function(item2) {
    //       //                       item2.back1 = null;
    //       //                       item2.back2 = null;
    //       //                       item2.back3 = null;
    //       //                       item2.backSize1 = null;
    //       //                       item2.backSize2 = null;
    //       //                       item2.backSize3 = null;
    //       //                       item2.lay1 = null;
    //       //                       item2.lay2 = null;
    //       //                       item2.lay3 = null;
    //       //                       item2.laySize1 = null;
    //       //                       item2.laySize2 = null;
    //       //                       item2.laySize3 = null;
    //       //                   })
    //       $rootScope.getExposureBook(item.mktId);
    //       $rootScope.marketBfIdArray.push(item.bfId);
    //       if ($scope.marketHubAddress == null && item.dataMode == 1) {
    //         $scope.getHubAddress(item.mktId);
    //       }
    //     });
    //     angular.forEach($rootScope.multiFancyData, function (item) {
    //       $rootScope.fancyBfIdArray.push(item.matchId);

    //       if (item.sportName == "Cricket" && $scope.fancyHubAddres == null) {
    //         $scope.getHubAddress(item.mktId);
    //       }
    //       angular.forEach(item.fancyData, function (item) {
    //         $scope.fBook = $rootScope._fancyBook[item.name];
    //         if ($scope.fBook == undefined) {
    //           $scope.fBook = 0;
    //           $rootScope.getFancyExpoBook(item.matchId, item.id, $scope.fBook);
    //         } else {
    //           $rootScope.getFancyExpoBook(item.matchId, item.id, $scope.fBook);
    //         }
    //       });
    //     });
    //   }, 300);
    // }

    $scope.betDelay = {};
    $scope.volMultiplier = {};

    $scope.loadEvent = function (matchId) {
      $http({
        url: ApiUrl + "/loadEvent/" + matchId,
        method: "GET",
        headers: {
          Authorization: token,
        },
      }).then(
        function mySuccess(response) {
          if (response.data.errorCode === 0) {
            $scope.betDelay[matchId] = response.data.result[0].betDelay;
            $scope.volMultiplier[matchId] =
              response.data.result[0].volMultiplier;
          }
        },
        function myError(error) {}
      );
    };

    $scope.marketIdWiseData = function (markets) {
      var newMarkets = {};
      angular.forEach(markets, function (item, key) {
        var runnerarray = [];
        angular.forEach(item.runnerData1, function (item, key) {
          if (item.Key != undefined) {
            runnerarray.push(item.Value);
          } else {
            runnerarray.push(item);
          }
        });
        console.log("-------- item:", item);
        item.runnerData1 = runnerarray;
        item.runnerData = item.runnerData1;
        // item['marketName'] = item.name;
        item["mktStatus"] = item.status;
        // item['mktId'] = item.id;
        // item['mtBfId']=item.bfId;
        newMarkets[item.bfId] = item;
      });
      return newMarkets;
      // console.log($scope.markets)
    };
    $scope.marketDepth = function (eventid, selection, mktid) {
      window.open(
        "marketDepth.html?eventId=" +
          eventid +
          "&selectionId=" +
          selection +
          "&marketId=" +
          mktid,
        "_blank",
        "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width=1000,height=700"
      );
    };

    $scope.loadEventInterval;
    $scope.eventIds = [];

    $rootScope.getMultiMarkets = function () {
      if (!!$rootScope.token && $rootScope.sportsData != undefined) {
        $scope.MarketIds = JSON.parse(localStorage.getItem("multiMarketArray"));
        $scope.marketodds = [];
        angular.forEach($scope.MarketIds, function (Main) {
          angular.forEach($rootScope.sportsData, function (sport) {
            angular.forEach(sport.tournaments, function (tour) {
              angular.forEach(tour.matches, function (match) {
                angular.forEach(match.markets, function (market) {
                  if (market.id == Main) {
                    var data = {};
                    data["bfId"] = market.bfId;
                    data["dataMode"] = match.dataMode;
                    data["isInplay"] = match.inPlay;
                    data["isMulti"] = market.isMulti;
                    data["matchBfId"] = match.bfId;
                    data["matchDate"] = match.startDate;
                    data["matchId"] = match.id;
                    data["matchName"] = match.name;
                    data["matchStatus"] = match.status.trim();
                    data["mktId"] = market.id;
                    data["mktName"] = market.name;
                    data["runnerData"] = market.runnerData;
                    data["runnerData1"] = market.runnerData1;
                    data["sportId"] = sport.bfId;
                    data["tourId"] = tour.bfId;
                    data["isBettingAllow"] = market.isBettingAllow;
                    data["sportName"] = sport.name;
                    $scope.marketodds.push(data);
                    $scope.eventIds.push(data.matchBfId);
                    $scope.volMultiplier[data.matchBfId] = 1;
                    $scope.loadEvent(data.matchBfId);
                  }
                });
              });
            });
          });
        });
        // console.log($scope.marketsdddddd)
        $scope.markets = $scope.marketIdWiseData($scope.marketodds);
        if (!!$scope.markets) {
          $scope.ws.forEach((ws) => {
            ws.$close();
          });
          $scope.getWebSocketData();
          $scope.multiMarketsCalls = true;
        }
      }
    };

    $scope.ws = [];
    $scope.multiMarketData = [];

    var fieldMap = {
      MarketId: "marketId",
      IsMarketDataDelayed: "isMarketDataDelayed",
      Status: "status",
      IsInplay: "isInplay",
      NumberOfRunners: "numberOfRunners",
      NumberOfActiveRunners: "numberOfActiveRunners",
      TotalMatched: "totalMatched",
      Runners: "runners",
      selectionId: "SelectionId",
      ExchangePrices: "ex",
      AvailableToBack: "availableToBack",
      AvailableToLay: "availableToLay",
      Price: "price",
      Size: "size",
      LastPriceTraded: "lastPriceTraded",
      SelectionId: "selectionId",
    };
    $scope.getWebSocketData = function () {
      var markets = $scope.marketodds;
      if (markets && markets.length) {
        markets.forEach((market) => {
          $scope.marketdata =
            $rootScope.sportsData[market.sportId].tournaments[
              market.tourId
            ].matches[market.matchBfId];

          var url =
            "ws://209.250.242.175:" +
            $scope.marketdata.port +
            "/" +
            ($rootScope.token !== null && $rootScope.token !== undefined
              ? "?logged=true"
              : "?logged=false");
          var ws = $websocket.$new(url);
          $scope.ws.push(ws);
          ws.$on("$message", function (message) {
            message = JSON.parse(message);
            if (
              message &&
              Object.keys(message).length > 0 &&
              message.length > 0
            ) {
              message = message
                .filter((m) => !!m)
                .map((m) => {
                  Object.keys(m).forEach((f) => {
                    var newKey = fieldMap[f] ? fieldMap[f] : f;
                    m[newKey] = m[f];
                    fieldMap[f] ? delete m[f] : "";
                  });
                  m.runners.map((runner) => {
                    Object.keys(runner).forEach((r) => {
                      var runKey = fieldMap[r] ? fieldMap[r] : r;
                      runner[runKey] = runner[r];
                      fieldMap[r] ? delete runner[r] : "";
                    });
                    Object.keys(runner.ex).forEach((k) => {
                      var blKey = fieldMap[k] ? fieldMap[k] : k;
                      runner.ex[blKey] = runner.ex[k];
                      fieldMap[k] ? delete runner.ex[k] : "";
                    });
                    runner.ex.availableToBack.map((b) => {
                      Object.keys(b).forEach((k) => {
                        var blKey = fieldMap[k] ? fieldMap[k] : k;
                        b[blKey] = b[k];
                        fieldMap[k] ? delete b[k] : "";
                      });
                      if (b.size) {
                        if (b.size > 100) {
                          b.size =
                            Math.round(b.size) *
                            $scope.volMultiplier[$scope.marketdata.bfId];
                        } else {
                          b.size = +(
                            b.size *
                            $scope.volMultiplier[$scope.marketdata.bfId]
                          ).toFixed(2);
                        }
                      }
                    });
                    runner.ex.availableToLay.map((b) => {
                      Object.keys(b).forEach((k) => {
                        var blKey = fieldMap[k] ? fieldMap[k] : k;
                        b[blKey] = b[k];
                        fieldMap[k] ? delete b[k] : "";
                      });
                      if (b.size) {
                        if (b.size > 100) {
                          b.size =
                            Math.round(b.size) *
                            $scope.volMultiplier[$scope.marketdata.bfId];
                        } else {
                          b.size = +(
                            b.size *
                            $scope.volMultiplier[$scope.marketdata.bfId]
                          ).toFixed(2);
                        }
                      }
                    });
                    return m;
                  });
                  return m;
                })
                .sort(function (a, b) {
                  return a.marketName < b.marketName
                    ? -1
                    : a.marketName > b.marketName
                    ? 1
                    : 0;
                });
              message.forEach((market) => {
                market["runnerData"] = market.runners;
                if (market.marketId in $scope.markets) {
                  $scope.markets[market.marketId] = Object.assign(
                    {},
                    $scope.markets[market.marketId],
                    market
                  );
                }
                // console.log("-------- websocket message:",market);
                $scope.$apply();
              });

              //   angular.forEach($scope.markets, (market) => {
              //     $scope.markets[market.bfId] = Object.assign(
              //         {},
              //         $scope.markets[market.bfId],
              //         message.find((m) => m.marketId === market.bfId)
              //       );
              //       $scope.markets[market.bfId].runnerData = message.find((m) => m.marketId === market.bfId)? message.find((m) => m.marketId === market.bfId).runners: [];
              //       $scope.$apply();
              //   })
            }
            if (message && message.Fancymarket) {
              $scope.fancyData = message.Fancymarket;
              //   $rootScope.FancyData($scope.fancyData);
            }
          });
        });
      }
    };

    $rootScope.getMultiMarkets();
    $rootScope.$on("event:sportsData", () => {
      if (
        $location.path().toLowerCase().includes("multimarket") &&
        !$scope.multiMarketsCalls
      ) {
        $rootScope.getMultiMarkets();
      }
    });

    $scope.marketSessionNameWise = function (sessions) {
      var newMarkets = {};
      angular.forEach(sessions, function (item, key) {
        newMarkets[item.name] = item;
      });
      return newMarkets;
    };

    $scope.loadEventInterval = $interval(() => {
      $scope.eventIds.forEach((eventId) => {
        $scope.loadEvent(eventId);
      });
    }, 5000);

    $scope.$on("$destroy", function () {
      // $interval.cancel(marketInterval);
      // $scope.unSubscribMatchSession();
      $interval.cancel($scope.loadEventInterval);

      $scope.ws.forEach((w) => {
        w.$close();
      });
    });
  }
);
