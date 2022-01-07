app.controller(
  "fullmarketController",
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
    $websocket,
    $sce
  ) {
    $rootScope.selectedTab = "sports";

    $scope.sportId = +$routeParams.sportid;
    $scope.mtBfId = $routeParams.bfId;
    $scope.matchId = +$routeParams.matchId;
    $scope.marketId = +$routeParams.marketId;
    $scope.bfId = $routeParams.bfId;
    $scope.tourId = +$routeParams.tourid;

    $scope.getMarketData;
    $scope.volMultiplier = 1;
    $scope.sessionSettings = {};
    $scope.loadEvent = function () {
      $http({
        url: ApiUrl + "/loadEvent/" + $routeParams.matchId,
        method: "GET",
        headers: {
          Authorization: token,
        },
      }).then(
        function mySuccess(response) {
          if (response.data.errorCode === 0) {
            $rootScope.betDelay = response.data.result[0].betDelay;
            $scope.volMultiplier = response.data.result[0].volMultiplier;
            $scope.sessionSettings = response.data.result[0].sessionSettings;
          }
        },
        function myError(error) { }
      );
    };

    $scope.getOdds = function () {
      $http({
        url:
          "http://209.250.242.175:33332/oddsInplay/?ids=" + $scope.marketsIds,
        method: "GET",
      }).then((response) => {
        $scope.setOddsData(JSON.stringify(response.data), true);
      });
    };

    $scope.loadEvent();

    $scope.runnersMap = {};

    $scope.getMarketDescription = function () {
      NavigationServices.marketDescription($scope.marketdata.id).then(
        (data) => {
          $scope.marketDescription = data.data;
          if ($scope.marketDescription) {
            $scope.marketDescription.eventTypes.eventNodes.marketNodes.runners.forEach(
              (runner) => {
                $scope.runnersMap[runner.selectionId] = runner;
              }
            );
            $scope.currentMatchData.forEach((market) => {
              market.runners.forEach((runner) => {
                runner.runnerName = $scope.runnersMap[runner.selectionId]
                  .description.runnerName
                  ? $scope.runnersMap[runner.selectionId].description.runnerName
                  : "";
              });
            });
          }
        }
      );
    };


    $scope.marketsIds = "";
    $scope.marketCalls = true;
    $scope.getMarket = function () {
      if ($scope.marketCalls == false) {
        return false;
      }

      if (
        $rootScope.sportsData !== undefined &&
        $rootScope.sportsData[+$routeParams.sportid]
      ) {
        $interval.cancel(marketSessionInterval);
        if (Boolean($routeParams.o)) {
          $scope.marketdata = $rootScope.sportsData[
            +$routeParams.sportid
          ].tournaments[$scope.tourId].matches[$scope.matchId].markets.find(
            (market) => +market.id === +$scope.bfId
          );

          let startTime = $scope.marketdata.startDate
            ? $scope.marketdata.startDate
            : $scope.marketdata.startTime;

          $scope.countDownInterval = $interval(() => {
            let diff = Math.abs(
              new Date(startTime).getTime() - new Date().getTime()
            );
            let millis = diff % 1000;
            diff = (diff - millis) / 1000;
            let seconds = diff % 60;
            diff = (diff - seconds) / 60;
            let minutes = diff % 60;
            diff = (diff - minutes) / 60;
            let hours = diff % 24;
            diff = (diff - hours) / 24;
            let days = diff;
            // let nd = Date.UTC(1970, 1, 1, hours, minutes, seconds);

            let timeRemain = "";
            if (days) {
              timeRemain += String(days) + "d ";
            }
            if (hours || hours === 0) {
              timeRemain += String(hours).padStart(2, "0") + ":";
            }
            if (minutes || minutes === 0) {
              timeRemain += String(minutes).padStart(2, "0") + ":";
            }
            if (seconds || seconds === 0) {
              timeRemain += String(seconds).padStart(2, "0");
            }

            $scope.countDown = timeRemain;
          }, 1000);
          $scope.getMarketDescription();
          $scope.marketDescInterval = $interval(() => {
            $scope.getMarketDescription($scope.marketdata.id);
          }, 5000);
        } else {
          if (
            $rootScope.sportsData &&
            $rootScope.sportsData[+$routeParams.sportid]
          ) {
            $scope.marketdata =
              $rootScope.sportsData[+$routeParams.sportid].tournaments[
                $scope.tourId
              ].matches[$scope.matchId];
          }
        }
        console.log($scope.marketdata);
        let match = $scope.marketdata;
        if (match && !match.racing) {
          $scope.setOddsInterval(match.inPlay === 1 ? 2000 : 5000);
          let ids = match.markets.reduce((acc, c) => [...acc, c.bfId], []);
          $scope.marketsIds = ids.join(',');
          $scope.getOdds();
        }
        $scope.getWebSocketData();
        $scope.marketCalls = false;
        $scope.getMarketData = $rootScope.mktWise(
          $scope.marketdata,
          $scope.bfId
        );
        if ($scope.marketdata.inPlay == 1) {
          $scope.getMarketData.isInplay = "true";
        } else {
          $scope.getMarketData.isInplay = "false";
        }
        $scope.getMarketData.matchDate = $scope.marketdata.startDate;

        $rootScope.matchName = $scope.marketdata.name;
        $scope.tv = $scope.marketdata.tv;
        $scope.matchBfId = $scope.marketdata.bfId;

        // if ($scope.tv) {
        $scope.tvPid = $scope.marketdata.tvPid;
        $scope.tvMapid = $scope.marketdata.tvMapid;
        // $rootScope.tvUrl = $sce.trustAsResourceUrl(
        //   "http://3.7.254.125:" +
        //     $scope.tvPid +
        //     "/" +
        //     $scope.tvMapid +
        //     "/" +
        //     $scope.tvMapid +
        //     "/"
        // );
        $rootScope.tvUrl = $sce.trustAsResourceUrl(
          "https://streamingtv.fun/live_tv/index.html?eventId=" + $scope.matchBfId
        );
        // console.log($rootScope.tvUrl);
        // }
      }
    };

    // $scope.getMarket();

    // $scope.getMatchSettings = function () {
    // 	if ($rootScope.sportsData != undefined) {
    // 		$scope.marketdata = $rootScope.sportsData[$scope.sportId].tournaments[$scope.tourId].matches[$scope.matchId];
    // 		if ($scope.marketdata.inPlay == 1) {
    // 			$scope.getMarketData.isInplay = 'true';
    // 		} else {
    // 			$scope.getMarketData.isInplay = 'false';
    // 		}
    // 		if ($scope.marketdata.settings != null) {
    // 			if ($scope.marketdata.settings.volMulti != null && $scope.marketdata.settings.volMulti != 0) {
    // 				$scope.volMulti = $scope.marketdata.settings.volMulti;
    // 			} else {
    // 				$scope.volMulti = 10;
    // 			}
    // 			$scope.getMarketData.matchDate = $scope.marketdata.settings.matchDate;

    // 		}

    // 		$rootScope.liveTvConfig = $scope.marketdata.tvConfig;

    // 		// if($scope.fancyHubAddress==null && $scope.marketdata.hasFancy==1 && ($rootScope.token!=undefined && $rootScope.token!="")){
    // 		// 	$scope.getHubAddress();
    // 		// }

    // 	}

    // }

    $scope.exposureCalled = false;
    $scope.getExposure = function () {
      if (!!$scope.currentMatchData) {
        $scope.currentMatchData.forEach((market) => {
          $scope.mktExpoBook = {};
          market.runners.forEach((r) => {
            $scope.mktExpoBook[r.selectionId] = 0;
          });
          localStorage.setItem(
            "MktExpo_" + market.marketId,
            JSON.stringify($scope.mktExpoBook)
          );
        });
        angular.forEach($scope.currentMatchData, (market) => {
          $rootScope.getExposureBook(market.marketId, "1");
        });
      }

      $scope.exposureCalled = true;
    };

    $scope.bmExposureCalled = false;
    $scope.getBMExposure = function () {
      if (!!$scope.bookmakingData) {
        $scope.BMExposure = {};
        $scope.bookmakingData.forEach((bm1) => {
          bm1.forEach((bm) => {
            $scope.BMExposure[bm.sid] = 0;
          })
        })
        $scope.bookmakingData.forEach((bm1) => {
          bm1.forEach((bm) => {
            $scope.BMExposure[bm.sid] = 0;
          })
        })
        localStorage.setItem('BMExpo_' + $routeParams.bfId, JSON.stringify($scope.BMExposure));
        $scope.getBMExposureBook('bm_' + $routeParams.bfId);
        $scope.bmExposureCalled = true;
      }
    }

    $scope.totalMatched = 0;
    $scope.fancyType = {};

    $scope.socketTimeOut = true;
    let timeOutOdds = 0;

    $scope.setOddsInterval = function (intervalTime) {
      $scope.oddsInterval = $interval(() => {
        if (!$scope.socketTimeOut) {
          $scope.getOdds();
        }
      }, intervalTime);
    }

    $scope.currentMatchData = [];
    $scope.getWebSocketData = function () {
      var match = $scope.marketdata;
      if (match && match.port) {
        var url =
          "ws://209.250.242.175:" +
          match.port +
          "/" +
          ($rootScope.token !== null && $rootScope.token !== undefined
            ? "?logged=true"
            : "?logged=false");
        var ws = $websocket.$new(url);
        ws.$on("$message", (data) => {
          $scope.socketTimeOut = true;
          clearTimeout(timeOutOdds);
          timeOutOdds = setTimeout(() => {
            $scope.socketTimeOut = false;
          }, $scope.marketdata.inPlay ? 3000 : 5000);

          $scope.setOddsData(data, false);
        });
        $rootScope.ws = ws;
      }
    };

    let fieldMap = {
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

    $scope.marketsInApi = {};
    $scope.setOddsData = function (message, fromApi) {
      message = JSON.parse(message);
      // $scope.resetFancyType();
      //   console.log("-------- websocket message:", message);
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
            if (fromApi) {
              $scope.marketsInApi[m.marketId] = true;
            }
            return m;
          })
          .sort(function (a, b) {
            return a.marketName < b.marketName
              ? -1
              : a.marketName > b.marketName
                ? 1
                : 0;
          });

        $scope.oddsChangeBlink($scope.currentMatchData,message);
        $scope.totalMatched = message[0].totalMatched;
        $scope.currentMatchData = message.slice();
        if (!$scope.exposureCalled) {
          $scope.getExposure();
        }
        // $rootScope.matchDataHome[match.bfId] = message.slice();
      } else if (
        message &&
        message.constructor === Object &&
        $scope.marketdata.racing
      ) {
        $scope.marketsInApi[message.marketId] = true;
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
          if ($scope.runnersMap && $scope.runnersMap[runner.selectionId]) {
            runner["description"] =
              $scope.runnersMap[runner.selectionId]?.description;
            runner.runnerName =
              $scope.runnersMap[runner.selectionId].description.runnerName;
          }

          return runner;
        });
        message.runners = message.runners.sort((a, b) => {
          return a.state.sortPriority - b.state.sortPriority;
        });

        $scope.totalMatched = message.state.totalMatched;

        $scope.currentMatchData = Object.assign([], [message]);
        if (!$scope.exposureCalled) {
          $scope.getExposure();
        }
      } else if (message && message.Fancymarket) {
        message.Fancymarket = message.Fancymarket.filter((f1) =>
          !(
            /[0-9]+.[1-9]\s+(ball|over)\s+run/.test(f1.nat) ||
            /[\d]+\s+runs\s+bhav\s+/i.test(f1.nat) ||
            /run\s+bhav/i.test(f1.nat) ||
            /(total\s+match\s+boundaries)/i.test(f1.nat) ||
            /\d+\s+to\s+\d+\s+overs\s+/i.test(f1.nat)
          ));
        $scope.fancyData = Object.assign([], message).Fancymarket.map((f1) => {
          f1.sid = +f1.sid;
          return f1;
        }).sort((a, b) => a.sid - b.sid);
        $rootScope.FancyData($scope.fancyData);
      } else if (message && message.BMmarket) {
        message.BMmarket.bm1 = message.BMmarket.bm1
          .map((bm) => {
            bm.sr = +bm.sr;
            return bm;
          })
          .sort((a, b) => a.sr - b.sr);
        $scope.bookmakingData = Object.assign([], [message.BMmarket.bm1]);

        if (!$scope.bmExposureCalled) {
          $scope.getBMExposure();
        }
      }
    }


    $scope.oddsChangeBlink = function (oldMarkets, newMarkets) {

      angular.forEach(oldMarkets, (market, index) => {
        angular.forEach(market.runners, (runner, index2) => {
          let BackRunner = newMarkets[index]?.runners[index2]?.ex.availableToBack;

          if (BackRunner) {
            angular.forEach(runner.ex.availableToBack, (value, index3) => {
              // || value.size != BackRunner[index3]?.size
              if (value.price != BackRunner[index3]?.price) {
                const back = $('#selection_' + runner.selectionId + ' .back-' + (index3 + 1));
                back.addClass('spark');
                this.removeChangeClass(back);
              }
            })
          }

          let LayRunner = newMarkets[index]?.runners[index2]?.ex.availableToLay;


          if (LayRunner) {
            angular.forEach(runner.ex.availableToLay, (value, index3) => {
              // || value.size != LayRunner[index3]?.size
              if (value.price != LayRunner[index3]?.price) {
                const back = $('#selection_' + runner.selectionId + ' .lay-' + (index3 + 1));
                back.addClass('spark');
                this.removeChangeClass(back);
              }
            })
          }

        })
      })

    }

    $scope.removeChangeClass = function (changeClass) {
      setTimeout(() => {
        changeClass.removeClass('spark');
      }, 300);
    }

    $scope.volMulti = 1;

    $scope.fancyBookCalled = false;

    $rootScope.FancyData = function (matchfancyData) {
      //   console.log("- $scope.matchfancyData:", matchfancyData);
      $scope.mtid = $routeParams.matchId;
      $scope.fancyData = matchfancyData;
      // console.log($rootScope.fancyBook)
      // $scope.getBMExposureBook();
      $scope.top = 0;
      if (!$scope.fancyBookCalled) {
        $rootScope.getFancyExposure();
        $scope.fancyBookCalled = true;
      }
    };

    $rootScope.getFancyExposure = function (matchId, fancyId, bookData) {
      // console.log(bookData)

      NavigationServices.fancyExposure($scope.matchId, fancyId).then(
        function success(response) {
          if (response.data.errorCode === 0) {
            angular.forEach(response.data.result[0], function (value, item) {
              angular.forEach($scope.fancyData, function (fancy) {
                if (+item.split("_")[2] == fancy.sid) {
                  $("#fancyBetBookBtn_" + fancy.sid).css("display", "block");
                  // if (value[0][1] == 0) {
                  //   value[0][1] = 0;
                  // } else {
                  $("#fancyBetBookBtn_" + fancy.sid).css("display", "block");
                  if (value < 0) {
                    $("#beforeFancyExpo_" + fancy.sid).addClass("lose");
                    $("#beforeFancyExpo_" + fancy.sid + " span")
                      .text("(" + value.toFixed(2) + ")")
                      .addClass("red");
                  } else {
                    $("#beforeFancyExpo_" + fancyId).addClass("lose");
                    $("#beforeFancyExpo_" + fancy.sid + " span")
                      .text("(" + (value * -1).toFixed(2) + ")")
                      .addClass("red");
                  }
                }
                // }
              });
            });
          }
        },
        function error(err) {
          if (err.status == 401) {
            $rootScope.clearCookies();
          }
        }
      );
    };

    $scope.fancyInfo = null;
    $scope.openCloseFancyInfo = function (fancy) {
      $scope.fancyInfo = fancy;
    };

    $scope.marketSessionNameWise = function (sessions) {
      var newMarkets = {};
      angular.forEach(sessions, function (item, key) {
        newMarkets[item.name.trim()] = item;
      });
      return newMarkets;
    };

    $scope.getScore = function () {
      if ($scope.marketdata != null) {
        if ($scope.marketdata.method == 1) {
          $scope.fullScore = null;
          return false;
        }
      }
      // https://ips.betfair.com/inplayservice/v1/scores?regionCode=UK&_ak=dyMLAanpRyIsjkpJ&alt=json&locale=en_GB&eventIds=29134308
      $scope.scoreUrl =
        "https://streamingtv.fun:3440/score_api/" + $scope.matchId;
      $http({
        url: $scope.scoreUrl,
        method: "GET",
      }).then(function success(data) {
        if ($scope.sportId == 1) {
          $scope.fullScore = data.data;
        } else if ($scope.sportId == 2) {
          $scope.fullScore = data.data;
        } else {
          $scope.fullScore = data.data.score;
          $scope.matcheventId = data.data.eventId;
        }
        // console.log($scope.fullScore)
      });
    };

    $scope.scoreRun = function () {
      var displayRun = "";
      if ($scope.fullScore.stateOfBall != undefined) {
        if ($scope.fullScore.stateOfBall.appealTypeName == "Not Out") {
          if ($scope.fullScore.stateOfBall.dismissalTypeName == "Not Out") {
            if ($scope.fullScore.stateOfBall.bye != "0") {
              return (displayRun =
                $scope.fullScore.stateOfBall.bye + " Run (Bye)");
            }
            if ($scope.fullScore.stateOfBall.legBye != "0") {
              return (displayRun =
                $scope.fullScore.stateOfBall.legBye + " Run (Leg Bye)");
            }
            if ($scope.fullScore.stateOfBall.wide != "0") {
              return (displayRun =
                $scope.fullScore.stateOfBall.wide + " Run (Wide)");
            }
            if ($scope.fullScore.stateOfBall.noBall != "0") {
              return (displayRun =
                $scope.fullScore.stateOfBall.batsmanRuns + " Run (No Ball)");
            }
            if ($scope.fullScore.stateOfBall.batsmanRuns == "0") {
              return (displayRun = "No Run");
            } else if ($scope.fullScore.stateOfBall.batsmanRuns == "1") {
              return (displayRun =
                $scope.fullScore.stateOfBall.batsmanRuns + " Run");
            } else if (parseInt($scope.fullScore.stateOfBall.batsmanRuns) > 1) {
              return (displayRun =
                $scope.fullScore.stateOfBall.batsmanRuns + " Runs");
            }
            // if ($scope.fullScore.stateOfBall.batsmanRuns=="0" && $scope.fullScore.stateOfBall.legBye=="0") {
            // 	displayRun="No Run";
            // }
            // else if ($scope.fullScore.stateOfBall.batsmanRuns!="0" && $scope.fullScore.stateOfBall.legBye=="0") {
            // 	displayRun=$scope.fullScore.stateOfBall.batsmanRuns+" Runs";
            // }
            // else if ($scope.fullScore.stateOfBall.batsmanRuns=="0" && $scope.fullScore.stateOfBall.legBye!="0") {
            // 	displayRun=$scope.fullScore.stateOfBall.legBye+" Runs (Leg Bye)";
            // }
          } else {
            return (displayRun =
              "WICKET (" +
              $scope.fullScore.stateOfBall.dismissalTypeName +
              ")");
          }
        } else {
          if ($scope.fullScore.stateOfBall.outcomeId == "0") {
            return (displayRun =
              "Appeal : " + $scope.fullScore.stateOfBall.appealTypeName);
          } else {
            return (displayRun = "WICKET (Not Out)");
          }
        }
      }

      // return displayRun;
    };

    $scope.allMarketCalls = true;
    $scope.getAllMarket = function () {
      if ($scope.allMarketCalls == false) {
        return false;
      }
      $scope.allMarketCalls = false;
      $("#loading").css("display", "flex");

      if ($rootScope.fType == 1) {
        NavigationServices.allMarket($scope.matchId).then(
          function success(data) {
            $scope.allMarketCalls = true;

            $scope.allMarketData = data.data.data;
            $("#loading").css("display", "none");
            $scope.getMarket();
          },
          function error(err) {
            $scope.allMarketCalls = true;
            $("#loading").css("display", "none");
            if (err.status == 401) {
              $rootScope.clearCookies();
            }
          }
        );
      } else {
        // $('#loading').css('display','none');
        $scope.allMarketCalls = true;
        if ($rootScope.sportsData != undefined) {
          $scope.allMarketData = $rootScope.allMarketWise(
            $rootScope.sportsData[$scope.sportId].tournaments[$scope.tourId]
              .matches[$scope.matchId]
          );
          $scope.getMarket();
          $("#loading").css("display", "none");
        }
      }
    };

    // var callAllMktEvent = $rootScope.$on("allMktEvent", function (event, data) {
    //   $scope.getAllMarket();
    //   $rootScope.clientCount++;
    // });
    // $scope.$on("$destroy", callAllMktEvent);

    $scope.scoreId = 0;
    $scope.GetScoreId = function () {
      // $http({
      // 	method: 'GET',
      // 	url: 'http://173.249.21.26/SkyImporter/MatchImporter.svc/GetScoreId?eventid=' + $scope.mtBfId,
      // 	headers: {
      // 		Token: "without"
      // 	}
      // }).then(function mySuccess(data) {
      // 	$scope.scoreId = data.data.scoreId;
      // 	if ($scope.scoreId != 0) {
      // 		$scope.get_event();
      // 	}
      // }, function myError(error) {
      // 	console.log("Error in response GetServices ", error)
      // })
    };

    $scope.get_event = function () {
      if (!$scope.scoreId) {
        return;
      }

      $http({
        url:
          "https://lmt.fn.sportradar.com/common/en/Etc:UTC/cricket/get_event/" +
          $scope.scoreId,
        method: "GET",
      }).then(function success(data) {
        $scope.sportEvent = data.data.doc[0].data.sportEvent;
        $scope.get_scorecard();
      });
    };

    $scope.get_scorecard = function () {
      if ($scope.scoreId == 0) {
        return;
      }

      $http({
        url:
          "https://lmt.fn.sportradar.com/common/en/Etc:UTC/cricket/get_scorecard/" +
          $scope.scoreId,
        method: "GET",
      }).then(function success(data) {
        $scope.scorecard = data.data.doc[0].data.score;
        if ($scope.scorecard) {
          $scope.scorecard.ballByBallSummaries.reverse();
          // $scope.scorecard.innings[$scope.scorecard.currentInningsNumber - 1].bowlers

          $scope.fours = 0;
          $scope.sixes = 0;
          $scope.extrasSummary = 0;
          angular.forEach(
            $scope.scorecard.innings[$scope.scorecard.currentInningsNumber - 1]
              .bowlers,
            function (item, index) {
              $scope.fours = $scope.fours + item.fours;
              $scope.sixes = $scope.sixes + item.sixes;
            }
          );
          $scope.extrasSummary =
            $scope.scorecard.innings[$scope.scorecard.currentInningsNumber - 1]
              .extrasSummary.byes +
            $scope.scorecard.innings[$scope.scorecard.currentInningsNumber - 1]
              .extrasSummary.legByes +
            $scope.scorecard.innings[$scope.scorecard.currentInningsNumber - 1]
              .extrasSummary.noBalls +
            $scope.scorecard.innings[$scope.scorecard.currentInningsNumber - 1]
              .extrasSummary.penalties +
            $scope.scorecard.innings[$scope.scorecard.currentInningsNumber - 1]
              .extrasSummary.wides;
        }
      });
    };

    $scope.scoreTab = "Pitch";
    $scope.selectedScoreTab = function (tab) {
      $scope.scoreTab = tab;
    };

    $scope.inningTab = 0;
    $scope.selctedInning = function (tab) {
      $scope.inningTab = tab;
    };

    $scope.getBallClass = function (ball) {
      if (ball == "w") {
        return "srm-wicket";
      } else if (ball == 0) {
        return "srm-dot";
      } else if (ball > 0 && ball < 4) {
        return "srm-normal";
      } else if (ball > 3 && ball < 7) {
        return "srm-bound";
      } else {
        return "srm-normal";
      }
    };

    $scope.getInning = function (teamName) {
      let indexPos = -1;
      if ($scope.scorecard) {
        angular.forEach($scope.scorecard.innings, function (item, index) {
          if (item.teamName == teamName) {
            indexPos = index;
          }
        });
      }
      return indexPos;
    };

    $scope.StrikeRate = function (batsmen) {
      if (batsmen.runs == 0 || batsmen.balls == 0) {
        return 0.0;
      }
      return ((batsmen.runs / batsmen.balls) * 100).toFixed(2);
    };

    $scope.economy = function (bowlers) {
      if (bowlers.runs == 0 || bowlers.overs == 0) {
        return 0.0;
      }
      return (bowlers.runs / bowlers.overs).toFixed(2);
    };

    $scope.scoreDateTime = function () {
      let matchDate = $scope.getMarketData.matchDate;
      let currentDate = $rootScope.curTime;

      if (matchDate == undefined || currentDate == undefined) {
        return false;
      }
      var matchDateTime = new Date(
        $scope.matchDateDigit(matchDate).replace(/ /g, "T")
      );
      currentDate = currentDate.replace(/ /g, "T");
      currentDate = new Date(currentDate);
      var dateTime = matchDateTime.getTime() - currentDate.getTime();
      $scope.day = parseInt(dateTime / (1000 * 3600 * 24));
      $scope.hrs = parseInt(dateTime / (1000 * 3600)) - $scope.day * 24;
      $scope.minutes =
        parseInt(dateTime / (1000 * 60)) -
        ($scope.day * 24 * 60 + $scope.hrs * 60);
      $scope.seconds =
        parseInt(dateTime / 1000) -
        ($scope.day * 24 * 3600 + $scope.hrs * 3600 + $scope.minutes * 60);
    };

    var marketSessionInterval = $interval(function () {
      $scope.getMarket();
      // $scope.getScore();
      // $scope.getMatchSettings();
    }, 500);

    var scoreInterval = $interval(function () {
      if ($scope.marketdata && !$scope.marketdata.racing) {
        $scope.getScore();
      }
    }, 1500);

    var stscoreInterval = $interval(function () {
      // $scope.get_scorecard();
      // $scope.scoreDateTime();
    }, 1000);

    var loadEventInterval = $interval(() => {
      if ($scope.matchId) {
        $scope.loadEvent();
      }
    }, 5000);

    // $scope.getAllMarket();
    $scope.GetScoreId();

    $scope.$on("$destroy", function () {
      if ($rootScope.ws) {
        $rootScope.ws.$close();
      }
      $interval.cancel(marketSessionInterval);
      $interval.cancel($scope.marketDescInterval);
      $interval.cancel(scoreInterval);
      $interval.cancel(stscoreInterval);
      $interval.cancel(loadEventInterval);
      $interval.cancel($scope.oddsInterval);
    });
  }
);
