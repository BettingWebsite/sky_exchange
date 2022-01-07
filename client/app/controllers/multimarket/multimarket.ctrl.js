app.controller(
  "multiMarketController",
  function ($scope, $http, $cookieStore, $interval, $rootScope, $websocket) {
    $rootScope.isCasinoPage = false;
    $("#tabMenu li a").removeClass("select");
    if (!$('a[href="#!multiMarkets"]').hasClass("select")) {
      $('a[href="#!multiMarkets"]').addClass("select");
      $rootScope.SportsList();
      $rootScope.inplaydiv = false;
      $rootScope.mainfooter = false;
    }

    // var authtoken = $cookieStore.get('authtoken');
    $scope.multimarket_data = [];
    $scope.oldMultimarket_data = [];
    $("#loading_page").css("display", "grid");

    $scope.getMultiExposureBook = function (marketId) {
      $scope.mktid = marketId;
      if ($rootScope.authcookie == undefined || $rootScope.authcookie == null) {
        return false;
      }
      $http({
        url:
          "http://www.lcexchanges247.com/Client/BetClient.svc/Bets/ExposureBook?mktid=" +
          $scope.mktid,

        method: "GET",

        headers: {
          Authorization: authtoken,
        },
      }).then(
        function mySuccess(response) {
          $scope.getBookDataList = response.data.data;

          angular.forEach($scope.getBookDataList, function (item, index) {
            $scope.exprunner = item.Key;
            var runName = $scope.exprunner
              .replace(/[^a-z0-9\s]/gi, "")
              .replace(/[_\s]/g, "_");
            if (item.Value > 0) {
              $("#exposure_" + runName).removeClass("lose");
              $("#exposure_" + runName)
                .text("  " + item.Value)
                .addClass("win");
            } else {
              $("#exposure_" + runName).removeClass("win");
              $("#exposure_" + runName)
                .text(item.Value)
                .addClass("lose");
            }
          });
          localStorage.setItem(
            "Exposure_" + $scope.mktid,
            JSON.stringify(response.data.data)
          );
        },
        function myError(error) {
          if (error.status == 401) {
            // $.removeCookie("authtoken");
            // window.location.href="index.html"
          }
        }
      );
    };

    $scope.getMultiMarketsExposure = function () {
      if ($rootScope.fType == 1) {
        $http({
          url:
            "http://www.lcexchanges247.com/Client/BetClient.svc/Data/MultiMarkets",
          method: "GET",
          headers: {
            Token: authtoken,
          },
        }).then(
          function mySuccess(response) {
            $scope.multimarket = response.data.data;
            console.log($scope.multimarket_data);
            // $scope.multibfID= multimarket_data.[0].bfId;
            // console.log($scope.multibfID)

            $("#loading_page").css("display", "none");

            angular.forEach($scope.multimarket, function (item, index) {
              $scope.multibfID = item.bfId;
              // console.log($scope.multibfID)
              $scope.matchBfId = item.matchBfId;
              // console.log($scope.matchBfId)
              $scope.sportId = item.sportId;
              // console.log($scope.sportId)
              $scope.getMultiExposureBook(item.mktId);
            });
          },
          function myError(error) {
            if (error.status == 401) {
              // $.removeCookie("authtoken");
              // window.location.href="index.html"
            }
          }
        );
      } else {
        $scope.MarketIds = JSON.parse(localStorage.getItem("Multimarkets"));
        angular.forEach($scope.MarketIds, function (item, index) {
          $rootScope.ExposureBook(item);
        });
      }
    };
    // $scope.getMultiMarketsExposure();

    // $rootScope.$on("callMultiMarketExp", function () {
    //   $scope.getMultiMarketsExposure();
    // });

    // $scope.refreshMultiMarkets = function () {
    //   $("#loading_page").css("display", "grid");
    //   $rootScope.getMultiMarkets();
    // };

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

    $scope.loadEventInterval;
    $scope.volMultiplier = {};

    $rootScope.getMultiMarkets = function () {
      if (!!$rootScope.authcookie && $rootScope.sportsData != undefined) {
        $scope.MarketIds = JSON.parse(localStorage.getItem("Multimarkets"));
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
                  }
                });
              });
            });
          });
        });
        // console.log($scope.marketsdddddd)
        $scope.markets = $scope.marketIdWiseData($scope.marketodds);
        if (!!$scope.markets) {
          $scope.getWebSocketData();
        }
        angular.forEach($scope.markets, (market) => {
          console.log(market);
          $scope.volMultiplier[market.matchBfId] = 1;

          $scope.loadEventInterval = $interval(() => {
            $scope.loadEvent(market.matchBfId);
          }, 5000);
        });
      }
    };

    $scope.ws = [];

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
            ($rootScope.authcookie !== null &&
            $rootScope.authcookie !== undefined
              ? "?logged=true"
              : "?logged=false");
          var ws = $websocket.$new(url);
          $scope.ws.push(ws);
          ws.$on("$message", function (message) {
            message = JSON.parse(message);
            fieldMap = {
              MarketId: "marketId",
              IsMarketDataDelayed: "isMarketDataDelayed",
              Status: "status",
              IsInplay: "isInplay",
              NumberOfRunners: "numberOfRunners",
              NumberOfActiveRunners: "numberOfActiveRunners",
              TotalMatched: "totalMatched",
              Runners: "runners",
              ExchangePrices: "ex",
              AvailableToBack: "availableToBack",
              AvailableToLay: "availableToLay",
              Price: "price",
              Size: "size",
              LastPriceTraded: "lastPriceTraded",
              SelectionId: "selectionId",
              exchange: "ex",
            };
            if (
              message &&
              message.constructor !== Object &&
              !message.matchId &&
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
                          b.size = Math.round(b.size) * $scope.volMultiplier;
                        } else {
                          b.size = +(b.size * $scope.volMultiplier).toFixed(2);
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
                          b.size = Math.round(b.size) * $scope.volMultiplier;
                        } else {
                          b.size = +(b.size * $scope.volMultiplier).toFixed(2);
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
              
              if (!$scope.exposureCalled) {
                $scope.getExposure();
              }
            } else if (
              message &&
              message.constructor === Object &&
              $scope.marketdata.racing
            ) {
              message.runners.map((runner) => {
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
                runner.ex?.availableToBack?.map((b) => {
                  Object.keys(b).forEach((k) => {
                    var blKey = fieldMap[k] ? fieldMap[k] : k;
                    b[blKey] = b[k];
                    fieldMap[k] ? delete b[k] : "";
                  });
                  // if (b.size) {
                  //   if (b.size > 100) {
                  //     b.size = Math.round(b.size) * $scope.volMultiplier;
                  //   } else {
                  //     b.size = +(b.size * $scope.volMultiplier).toFixed(2);
                  //   }
                  // }
                });
                runner.ex?.availableToLay?.map((b) => {
                  Object.keys(b).forEach((k) => {
                    var blKey = fieldMap[k] ? fieldMap[k] : k;
                    b[blKey] = b[k];
                    fieldMap[k] ? delete b[k] : "";
                  });
                  // if (b.size) {
                  //   if (b.size > 100) {
                  //     b.size = Math.round(b.size) * $scope.volMultiplier;
                  //   } else {
                  //     b.size = +(b.size * $scope.volMultiplier).toFixed(2);
                  //   }
                  // }
                });
                if (
                  $scope.runnersMap &&
                  $scope.runnersMap[runner.selectionId]
                ) {
                  runner["description"] =
                    $scope.runnersMap[runner.selectionId]?.description;
                  runner.runnerName =
                    $scope.runnersMap[
                      runner.selectionId
                    ].description.runnerName;
                }

                return runner;
              });
              message.runners = message.runners.sort((a, b) => {
                return a.state.sortPriority - b.state.sortPriority;
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
            }

            // message = JSON.parse(message);
            // if (
            //   message &&
            //   Object.keys(message).length > 0 &&
            //   message.length > 0
            // ) {
            //   message = message
            //     .filter((m) => !!m)
            //     .map((m) => {
            //       Object.keys(m).forEach((f) => {
            //         var newKey = fieldMap[f] ? fieldMap[f] : f;
            //         m[newKey] = m[f];
            //         fieldMap[f] ? delete m[f] : "";
            //       });
            //       m.runners.map((runner) => {
            //         Object.keys(runner).forEach((r) => {
            //           var runKey = fieldMap[r] ? fieldMap[r] : r;
            //           runner[runKey] = runner[r];
            //           fieldMap[r] ? delete runner[r] : "";
            //         });
            //         Object.keys(runner.ex).forEach((k) => {
            //           var blKey = fieldMap[k] ? fieldMap[k] : k;
            //           runner.ex[blKey] = runner.ex[k];
            //           fieldMap[k] ? delete runner.ex[k] : "";
            //         });
            //         runner.ex.availableToBack.map((b) => {
            //           Object.keys(b).forEach((k) => {
            //             var blKey = fieldMap[k] ? fieldMap[k] : k;
            //             b[blKey] = b[k];
            //             fieldMap[k] ? delete b[k] : "";
            //           });
            //           if (b.size) {
            //             if (b.size > 100) {
            //               b.size = Math.round(b.size) * $scope.volMultiplier[$scope.marketdata.bfId];
            //             } else {
            //               b.size = +(b.size * $scope.volMultiplier[$scope.marketdata.bfId]).toFixed(2);
            //             }
            //           }
            //         });
            //         runner.ex.availableToLay.map((b) => {
            //           Object.keys(b).forEach((k) => {
            //             var blKey = fieldMap[k] ? fieldMap[k] : k;
            //             b[blKey] = b[k];
            //             fieldMap[k] ? delete b[k] : "";
            //           });
            //           if (b.size) {
            //             if (b.size > 100) {
            //               b.size = Math.round(b.size) * $scope.volMultiplier[$scope.marketdata.bfId];
            //             } else {
            //               b.size = +(b.size * $scope.volMultiplier[$scope.marketdata.bfId]).toFixed(2);
            //             }
            //           }
            //         });
            //         return m;
            //       });
            //       return m;
            //     })
            //     .sort(function (a, b) {
            //       return a.marketName < b.marketName
            //         ? -1
            //         : a.marketName > b.marketName
            //         ? 1
            //         : 0;
            //     });
            //   // message.forEach((market) => {
            //   //   market["runnerData"] = market.runners;
            //   //   if (market.marketId in $scope.markets) {
            //   //     $scope.markets[market.marketId] = Object.assign(
            //   //       {},
            //   //       $scope.markets[market.marketId],
            //   //       market
            //   //     );
            //   //   }
            //   //   // console.log("-------- websocket message:",market);
            //   //   $scope.$apply();
            //   // });

            //   //   angular.forEach($scope.markets, (market) => {
            //   //     $scope.markets[market.bfId] = Object.assign(
            //   //         {},
            //   //         $scope.markets[market.bfId],
            //   //         message.find((m) => m.marketId === market.bfId)
            //   //       );
            //   //       $scope.markets[market.bfId].runnerData = message.find((m) => m.marketId === market.bfId)? message.find((m) => m.marketId === market.bfId).runners: [];
            //   //       $scope.$apply();
            //   //   })
            // }
            // if (message && message.Fancymarket) {
            //   $scope.fancyData = message.Fancymarket;
            //   $rootScope.FancyData($scope.fancyData);
            // }
          });
        });
      }
    };

    $scope.$on("MultiMarkets", function () {
      //   $rootScope.getMultiMarkets();
      $scope.getWebSocketData();
    });

    var multimarketTimer = $interval(() => {
      if (!$scope.markets) {
        $scope.getMultiMarkets();
      }
    }, 1000);

    $scope.$on("$destroy", function () {
      $interval.cancel(multimarketTimer);
      $scope.ws.forEach((w) => {
        w.$close();
      });
    });

    $scope.pending_SessionData = false;

    $scope.sessionIdWiseData = function (sessions) {
      var newMarkets = {};
      angular.forEach(sessions, function (item, key) {
        newMarkets[item.name] = item;
      });
      return newMarkets;
      // console.log($scope.markets)
    };
    if ($rootScope.authcookie != undefined || $rootScope.authcookie != null) {
      //         var sessionstatus = $interval(function() {
      //     angular.forEach($scope.markets, function(items) {
      //         if (items.dataMode==2) {
      //             $scope.SessionData(items.sportId,items.matchBfId);
      //         }
      //     })
      // }, 1000);
    }
    // var highlightTimer
    // $scope.$on('$routeChangeStart', function() {
    //     $interval.cancel(sessionstatus);
    // })

    $scope.exposureCalled = false;
    $scope.getExposure = function () {
      if (!!$scope.markets) {
        Object.keys($scope.markets).forEach((key) => {
          let market = $scope.markets[key];
          $scope.exposureBook = {};
          market.runners.forEach((r) => {
            $scope.exposureBook[r.selectionId] = 0;
          });
          localStorage.setItem(
            "Exposure_" + market.marketId,
            JSON.stringify($scope.exposureBook)
          );
        });
        if (
          $rootScope.authcookie !== null &&
          $rootScope.authcookie !== undefined
        ) {
          angular.forEach($scope.markets, (market) => {
            $rootScope.ExposureBook(market.marketId);
          });
        }
      }
      $scope.exposureCalled = true;
    };

    $scope.loadEvent = function (matchId) {
      $http({
        url: baseUrl + "/loadEvent/" + matchId,
        method: "GET",
        headers: {
          Authorization: authtoken,
        },
      }).then(
        function mySuccess(response) {
          console.log(response.data);
          if (response.data.errorCode === 0) {
            $scope.betDelay = response.data.result[0].betDelay;
            $scope.volMultiplier = response.data.result[0].volMultiplier;
            $scope.sessionSettings = response.data.result[0].sessionSettings;
          }
        },
        function myError(error) {}
      );
    };

    $scope.$on("$destroy", () => {
      $interval.cancel($scope.loadEventInterval);
    });
  }
);
