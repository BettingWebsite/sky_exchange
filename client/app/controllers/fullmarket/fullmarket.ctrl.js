app.controller(
  "fullmarketController",
  function (
    $scope,
    $http,
    $websocket,
    $routeParams,
    $rootScope,
    $interval,
    $sce,
    $timeout,
    gamesService
  ) {
    $scope.currentMatchData = [];
    $scope.volMultiplier = 1;
    $scope.sessionSettings = {};
    $scope.loadEvent = function () {
      $http({
        url: baseUrl + "/loadEvent/" + $routeParams.matchId,
        method: "GET",
        headers: {
          Authorization: authtoken,
        },
      }).then(
        function mySuccess(response) {
          if (response.data.errorCode === 0) {
            if (response.data.result[0]) {
              $scope.betDelay = response.data.result[0].betDelay;
              $scope.volMultiplier = response.data.result[0].volMultiplier;
              $scope.sessionSettings = response.data.result[0].sessionSettings;
            }
          }
        },
        function myError(error) { }
      );
    };

    $scope.marketsIds = "";
    $scope.getOdds = function () {
      // http://209.250.242.175:33332/oddsInplay/?ids=1.173913242

      $http({
        url:
          "http://209.250.242.175:33332/oddsInplay/?ids=" + $scope.marketsIds,
        method: "GET",
      }).then((response) => {
        $scope.setOddsData(JSON.stringify(response.data), true);
      });
    };

    $scope.loadEvent();

    $rootScope.progressdata = {
      progress: 0,
    };

    setTimeout(() => {
      $rootScope.remainsecs = 3;
    }, 500);

    $rootScope.progress = function () {
      if ($rootScope.progressdata.progress < 100) {
        $timeout(function () {
          $rootScope.progressdata.progress += 2;
          $rootScope.progress();
        }, 100);
      } else {
        $rootScope.progressdata.progress = 0;
      }
    };
    $rootScope.remainseconds = function () {
      if ($rootScope.remainsecs >= 0) {
        $timeout(function () {
          $rootScope.remainsecs -= 1;
          $rootScope.remainseconds();
        }, 1000);
      } else {
        $rootScope.remainsecs = 3;
      }
    };

    $(document).ready(function () {
      // $("#eventType").on('click',function(){
      //    $(".slip-wrap").toggleClass("close");
      // })
      if ($("#betslip_open").hasClass("close") == true) {
        $(".matched-wrap").css("height", "calc(100% - 31px)");
      } else {
        $(".matched-wrap").css("height", "calc(100% - 325px)");
      }
    });
    $rootScope.mainfooter = true;
    $scope.selectMenuMatch = $routeParams.matchId;
    $("#loading_page").css("display", "grid");
    // $scope.dataMode=$routeParams.dataMode;
    $scope.mktId = $routeParams.marketId;
    $scope.matchid = $routeParams.matchId;
    $scope.bfId = $routeParams.bfId;
    $rootScope.routbfid = $routeParams.bfId;
    var mktbfId = $routeParams.bfId;
    $scope.sportId = $routeParams.sportid;
    $scope.tourID = $routeParams.tourid;

    // $scope.BookDataList = []
    $scope.fancyDataList = [];
    $scope.runeerdataList = [];
    $scope.marketWiseData = function (markets) {
      var newMarkets = {};
      angular.forEach(markets, function (item, key) {
        if ($rootScope.fType == 1) {
          newMarkets[item.bfId] = item;
        } else {
          var runnerarray = [];
          angular.forEach(item.runnerData1, function (item, key) {
            if (item.Key != undefined) {
              runnerarray.push(item.Value);
            } else {
              runnerarray.push(item);
            }
          });
          item.runnerData1 = runnerarray;
          item.runnerData = item.runnerData1;
          item["marketName"] = item.name;
          item["mktStatus"] = item.status.trim("");
          item["mktId"] = item.id;
          // item['mtBfId']=item.bfId;
          newMarkets[item.bfId] = item;
        }
      });
      return newMarkets;
      // console.log($scope.markets)
    };

    $scope.exposureCalled = false;
    $scope.getExposure = function () {
      if (!!$scope.markets) {
        $scope.currentMatchData.forEach((market) => {
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
          angular.forEach($scope.currentMatchData, (market) => {
            $rootScope.ExposureBook(market.marketId);
          });
        }
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
        $rootScope.getBMExposureBook('bm_' + $routeParams.bfId);
        $scope.bmExposureCalled = true;
      }
    }

    $scope.resetFancyType = function () {
      $scope.fancyType = {
        isScrap: false,
        isStable: false,
        isDiamond: false,
      };
    };

    $scope.resetFancyType();

    $scope.socketTimeOut = true;
    let timeOutOdds = 0;

    $scope.getFancyOdds = function () {
      $http({
        url:
          "http://209.250.242.175:33332/fancyMarkets/" + $scope.marketId,
        method: "GET",
      }).then((response) => {
        if (response.errorCode && response.errorCode != 1) {
          $scope.setOddsData(JSON.stringify({ BMmarket: response.data.BMmarket }));
          $scope.setOddsData(JSON.stringify({ Fancymarket: response.data.Fancymarket[0] }));
        }
      });
    }

    $scope.oddsInterval;
    $scope.setOddsInterval = function (intervalTime) {
      $scope.oddsInterval = $interval(() => {
        if (!$scope.socketTimeOut) {
          $scope.getOdds();
          if ($routeParams.sportid == 4) {
            $scope.getFancyOdds();
          }
        }
      }, intervalTime);
    }

    $scope.skyFancyMap = {
      10: "Ball Running",
      6: "Suspended",
    };
    $scope.fancyData = [];
    $scope.bookmakingData = [];
    $scope.socketMarketsIds = []
    $scope.getWebSocketData = function () {
      let match = $scope.marketdata;
      if (match && match.port) {
        $scope.marketId = match.bfId;
        var url =
          "ws://209.250.242.175:" +
          match.port +
          "/" +
          ($rootScope.authcookie !== null &&
            $rootScope.authcookie !== undefined
            ? "?logged=true"
            : "?logged=false");
        var ws = $websocket.$new(url);
        ws.$on("$message", (data) => {
          $scope.socketTimeOut = true;
          clearTimeout(timeOutOdds);
          timeOutOdds = setTimeout(() => {
            $scope.socketTimeOut = false;
          }, 3000);
          $scope.socketMarketsIds.push()
          $scope.setOddsData(data);
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
        message && message.length && (message[0].marketName.toLowerCase().includes('match odds') || message[0].marketName.toLowerCase().includes('winner'))
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

        $scope.oddsChangeBlink($scope.currentMatchData, message);
        $scope.totalMatched = message.totalMatched;
        $scope.currentMatchData = message.slice();
        if (!$scope.exposureCalled) {
          $scope.getExposure();
        }
        // $rootScope.matchDataHome[match.bfId] = message.slice();
      } else if (
        message &&
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

        $scope.currentMatchData = Object.assign([], [message]);
        if (!$scope.exposureCalled) {
          $scope.getExposure();
        }
      } else if (message && message.Fancymarket) {
        message.Fancymarket = message.Fancymarket.filter((f1) =>
          !(
            /[0-9]+\.[1-9]\s+(ball|over)\s+run/.test(f1.nat) ||
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
        $scope.bookmakingData = [message.BMmarket.bm1];

        if (!$scope.bmExposureCalled) {
          $scope.getBMExposure();
        }
      }
    };


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

    $scope.bfscoresocketData = function () {
      // var url = "ws://sportsbet.id:3030/";
      // var ws = $websocket.$new(url);
      // ws.$emit('subscribeScore', "30258301");
      // ws.$on('InplayScoreData', function (score) {
      //   console.log(score)
      // })
      $http({
        url: "http://streamingtv.fun:3030/score_api/30270559",
        method: "GET",
        // headers: {
        //   Authorization: authtoken,
        // },
      }).then(
        function mySuccess(response) {
          console.log(response);
        },
        function myError(error) {
          $scope.pending_GetRecentGameResult = true;
          if (error.status == 401) {
            // $.removeCookie("authtoken");
            // window.location.href="index.html"
          }
        }
      );
    };

    var clock;
    $(function () {
      clock = new FlipClock($(".clock"), 99, {
        clockFace: "Counter",
      });
    });

    $scope.pending_GetRecentGameResult = true;
    $scope.GetRecentGameResult = function (gametype) {
      if ($scope.pending_GetRecentGameResult == false) {
        return false;
      }
      $scope.pending_GetRecentGameResult = false;
      $http({
        url:
          "http://www.lcexchanges247.com/Client/BetClient.svc/Reports/GetRecentGameResult?gametype=" +
          gametype,
        method: "GET",
        headers: {
          Authorization: authtoken,
        },
      }).then(
        function mySuccess(response) {
          $scope.resultsdata = response.data.data;
          $scope.pending_GetRecentGameResult = true;
        },
        function myError(error) {
          $scope.pending_GetRecentGameResult = true;
          if (error.status == 401) {
            // $.removeCookie("authtoken");
            // window.location.href="index.html"
          }
        }
      );
    };

    var Lastgammeresulttimer;
    $scope.LastgameResult = function (gametype) {
      $scope.GetRecentGameResult(gametype);

      Lastgammeresulttimer = setInterval(function () {
        $scope.GetRecentGameResult(gametype);
      }, 10000);
    };
    $scope.betDelay = null;
    $scope.marketsArr = [];
    $scope.runnersMap = {};

    $scope.getMarketDescription = function () {
      gamesService.marketDescription($scope.marketdata.id).then((data) => {
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
      });
    };

    $rootScope.MktData = function () {
      $scope.mtid = $routeParams.matchId;
      $scope.mktid = $routeParams.marketId;
      if (
        $rootScope.sportsData != undefined &&
        $rootScope.sportsData[+$routeParams.sportid]
      ) {
        $("#tabMenu li a").removeClass("select");
        if ($routeParams.sportid == "4") {
          if (!$('a[href="#!Cricket"]').hasClass("select")) {
            $('a[href="#!Cricket"]').addClass("select");
            $rootScope.TournamentList("4", "Cricket");
          }
        } else if ($routeParams.sportid == "1") {
          if (!$('a[href="#!Soccer"]').hasClass("select")) {
            $('a[href="#!Soccer"]').addClass("select");
            $rootScope.TournamentList("1", "Soccer");
          }
        } else if ($routeParams.sportid == "2") {
          if (!$('a[href="#!Tennis"]').hasClass("select")) {
            $('a[href="#!Tennis"]').addClass("select");
            $rootScope.TournamentList("2", "Tennis");
          }
        } else if (
          $routeParams.sportid == "7.1" ||
          $routeParams.sportid == "7.2"
        ) {
          if (!$('a[href="#!Horse Racing"]').hasClass("select")) {
            $('a[href="#!Horse Racing"]').addClass("select");
            $rootScope.TournamentList("2", "Horse Racing");
          }
        } else if (
          $routeParams.sportid == "4339.1" ||
          $routeParams.sportid == "4339.2"
        ) {
          if (!$('a[href="#!Greyhound Racing"]').hasClass("select")) {
            $('a[href="#!Greyhound Racing"]').addClass("select");
            $rootScope.TournamentList("2", "Greyhound Racing");
          }
        } else if ($routeParams.sportid == "20") {
          if (!$('a[href="#!Kabaddi"]').hasClass("select")) {
            $('a[href="#!Kabaddi"]').addClass("select");
            $rootScope.TournamentList("20", "Kabaddi");
          }
        }
        $scope.linemarketArray = [];
        if (Boolean($routeParams.o)) {
          $scope.marketdata = $rootScope.sportsData[
            +$routeParams.sportid
          ].tournaments[$scope.tourID].matches[$scope.matchid].markets.find(
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
                $scope.tourID
              ].matches[$scope.matchid];
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
        $rootScope.eventList(
          $rootScope.sportsData[$scope.sportId].tournaments[$scope.tourID].bfId,
          $rootScope.sportsData[$scope.sportId].tournaments[$scope.tourID].name,
          $scope.sportId
        );
        $rootScope.MarketList($scope.mtid, $scope.marketdata.name);
        // console.log($scope.mtid,$rootScope.sportsData[$scope.sportId].tournaments[$scope.tourID].matches[$scope.matchid].name)
        $scope.marketdata["matchName"] = $scope.marketdata.name;
        $scope.marketdata["matchDate"] = $scope.marketdata.startDate;
        $scope.markets = $scope.marketWiseData($scope.marketdata.markets);
        $scope.tv = $scope.marketdata.tv;
        $scope.matchBfId = $scope.marketdata.bfId;

        // if ($scope.tv) {
        $scope.tvPid = $scope.marketdata.tvPid;
        $scope.tvMapid = $scope.marketdata.tvMapid;
        // $rootScope.tvUrl = $sce.trustAsResourceUrl(
        //   "http://5.189.187.132:" +
        //     $scope.tvPid +
        //     "/" +
        //     $scope.tvMapid +
        //     "/" +
        //     $scope.tvMapid +
        //     "/"
        // );
        console.log($scope.matchBfId);
        $rootScope.tvUrl = $sce.trustAsResourceUrl(
          "https://streamingtv.fun/live_tv/index.html?eventId=" +
          $scope.matchBfId
        );
        // console.log($rootScope.tvUrl);
        // }
        // angular.forEach($scope.markets, function (item, ind) {
        //   if (item.bfId != $routeParams.bfId) {
        //     $scope.linemarketArray.push(item);
        //   } else {
        //     $scope.betDelay = item.betDelay;
        //   }
        // });
        // console.log($scope.linemarketArray)
        // $scope.dataMode = $scope.marketdata.dataMode;
        // if ($scope.dataMode == 1) {
        //     $scope.HubAddress();
        // }
        // if ($scope.sportId == "15") {
        //     // $scope.marketSessionSignalr();
        //     // $scope.MatchScoreSignalr();
        //     $scope.TeenPattiSignalr($scope.marketdata.bfId);
        // }
        $rootScope.fullMarketmatchName = $scope.marketdata.name;
        $scope.matchbookRates = $scope.marketdata.bookRates;
        $scope.commentary = $scope.marketdata.commentary;
        $scope.inPlay = $scope.marketdata.inPlay;
        $scope.hasFancy = $scope.marketdata.hasFancy;
        $scope.matchName = $scope.marketdata.name;
        $scope.settings = $scope.marketdata.settings;

        if ($scope.settings != undefined) {
          $scope.matchDate = $scope.settings.matchDate;
          $scope.minStake = $scope.settings.minStake;
          $scope.maxiStake = $scope.settings.maxStake;
        }
        if ($scope.inPlay == 1) {
          // $scope.runnerData.isInplay = 'true';
          $scope.isInplayfull = "true";
        }

        // if ($scope.settings != null && $scope.settings != 0) {
        //   $scope.volMulti = $scope.settings.volMulti;
        // } else {
        //   $scope.volMulti = 10;
        // }
        $scope.matchDate = $scope.marketdata.startDate;
        $scope.status = $scope.marketdata.status;
        $scope.tvConfig = $scope.marketdata.tvConfig;
        angular.forEach($scope.markets, function (item) {
          if ($scope.hubAddress == "" && $scope.fancyHubAddress == "") {
            angular.forEach(item.runnerData, function (item2) {
              item2.back1 = null;
              item2.back2 = null;
              item2.back3 = null;
              item2.backSize1 = null;
              item2.backSize2 = null;
              item2.backSize3 = null;
              item2.lay1 = null;
              item2.lay2 = null;
              item2.lay3 = null;
              item2.laySize1 = null;
              item2.laySize2 = null;
              item2.laySize3 = null;
            });
          }
        });
      }
      $scope.GetBets();
    };
    if ($rootScope.sportsData && $rootScope.sportsData[+$routeParams.sportid]) {
      $rootScope.MktData();
    }
    $scope.getWebSocketData();
    $scope.bfscoresocketData();

    $scope.openResult = function (result) {
      $scope.tp_result = result;
    };

    $scope.closeOverlayInfo = function (id) {
      $scope.tp_result = null;
    };
    $scope.getCardSymbolImg = function (cardName) {
      if (cardName == "1") {
        return "";
      }
      let char = "";
      let type = "";
      let className = "";
      let value = "";
      if (cardName.length == 4) {
        char = cardName.substring(0, 2);
        type = cardName.slice(2);
      } else {
        char = cardName.charAt(0);
        type = cardName.slice(1);
      }
      switch (type) {
        case "HH":
          type = "}";
          className = "card-black1";
          break;
        case "DD":
          type = "{";
          className = "card-red1";
          break;
        case "CC":
          type = "]";
          className = "card-black1";
          break;
        case "SS":
          type = "[";
          className = "card-red1";
          break;
      }

      value = char + '<span class="' + className + '">' + type + "</span>";

      return value;
    };

    // $rootScope.MktData = function () {

    //     $scope.mtid = $routeParams.matchId;
    //     $scope.mktid = $routeParams.marketId;
    //     if ($rootScope.sportsData != undefined) {
    //         $('#tabMenu li a').removeClass('select');
    //         if ($routeParams.sportid == "4") {
    //             if (!$('a[href="#!Cricket"]').hasClass('select')) {
    //                 $('a[href="#!Cricket"]').addClass('select');
    //                 $rootScope.TournamentList('4', 'Cricket')
    //             }
    //         } else if ($routeParams.sportid == "1") {
    //             if (!$('a[href="#!Soccer"]').hasClass('select')) {
    //                 $('a[href="#!Soccer"]').addClass('select');
    //                 $rootScope.TournamentList('1', 'Soccer')
    //             }
    //         } else if ($routeParams.sportid == "2") {
    //             if (!$('a[href="#!Tennis"]').hasClass('select')) {
    //                 $('a[href="#!Tennis"]').addClass('select');
    //                 $rootScope.TournamentList('2', 'Tennis')
    //             }
    //         } else if ($routeParams.sportid == "20") {
    //             if (!$('a[href="#!Kabaddi"]').hasClass('select')) {
    //                 $('a[href="#!Kabaddi"]').addClass('select');
    //                 $rootScope.TournamentList('20', 'Kabaddi')
    //             }
    //         }
    //         $scope.linemarketArray = []
    //         $scope.marketdata = $rootScope.sportsData[$scope.sportId].tournaments[$scope.tourID].matches[$scope.matchid];
    //         $rootScope.eventList($rootScope.sportsData[$scope.sportId].tournaments[$scope.tourID].bfId, $rootScope.sportsData[$scope.sportId].tournaments[$scope.tourID].name, $scope.sportId);
    //         $rootScope.MarketList($scope.mtid, $scope.marketdata.name)
    //         // console.log($scope.mtid,$rootScope.sportsData[$scope.sportId].tournaments[$scope.tourID].matches[$scope.matchid].name)
    //         $scope.marketdata['matchName'] = $scope.marketdata.name;
    //         $scope.marketdata['matchDate'] = $scope.marketdata.startDate;
    //         $scope.markets = $scope.marketWiseData($scope.marketdata.markets);
    //         $scope.tvPid = $scope.marketdata.tvPid;
    //         $scope.tvMapid = $scope.marketdata.tvMapid;
    //         $scope.tvUrl = $sce.trustAsResourceUrl('http://3.7.254.125:' + $scope.tvPid + '/'+ $scope.tvMapid + '/'+ $scope.tvMapid + '/');
    //         console.log($scope.tvUrl)
    //         angular.forEach($scope.markets, function (item, ind) {
    //             if (item.bfId != $routeParams.bfId) {
    //                 $scope.linemarketArray.push(item)
    //             }
    //         })
    //         // console.log($scope.linemarketArray)
    //         $scope.dataMode = $scope.marketdata.dataMode;
    //         if ($scope.dataMode == 1) {
    //             $scope.HubAddress();
    //         }
    //         if ($scope.sportId == "15") {
    //             // $scope.marketSessionSignalr();
    //             // $scope.MatchScoreSignalr();
    //             $scope.TeenPattiSignalr($scope.marketdata.bfId);
    //         }
    //         $scope.matchBfId = $scope.marketdata.bfId
    //         $rootScope.fullMarketmatchName = $scope.marketdata.name;
    //         $scope.matchbookRates = $scope.marketdata.bookRates
    //         $scope.commentary = $scope.marketdata.commentary
    //         $scope.inPlay = $scope.marketdata.inPlay
    //         $scope.hasFancy = $scope.marketdata.hasFancy
    //         $scope.matchName = $scope.marketdata.name
    //         $scope.settings = $scope.marketdata.settings

    //         if ($scope.settings != undefined) {
    //             $scope.matchDate = $scope.settings.matchDate;
    //             $scope.betDelay = $scope.settings.betDelay;
    //             $scope.minStake = $scope.settings.minStake;
    //             $scope.maxiStake = $scope.settings.maxStake;
    //         }
    //         if ($scope.inPlay == 1) {
    //             // $scope.runnerData.isInplay = 'true';
    //             $scope.isInplayfull = 'true';
    //         } else {
    //             // $scope.runnerData.isInplay = 'false';
    //             $scope.isInplayfull = 'false';
    //         }
    //         if ($scope.settings != null && $scope.settings != 0) {
    //             $scope.volMulti = $scope.settings.volMulti;
    //         } else {
    //             $scope.volMulti = 10;
    //         }
    //         $scope.matchDate = $scope.marketdata.startDate
    //         $scope.status = $scope.marketdata.status
    //         $scope.tvConfig = $scope.marketdata.tvConfig
    //         $scope.fancyData = $scope.marketdata.fancyData;
    //         angular.forEach($scope.markets, function (item) {
    //             if ($scope.hubAddress == "" && $scope.fancyHubAddress == "") {
    //                 angular.forEach(item.runnerData, function (item2) {
    //                     item2.back1 = null;
    //                     item2.back2 = null;
    //                     item2.back3 = null;
    //                     item2.backSize1 = null;
    //                     item2.backSize2 = null;
    //                     item2.backSize3 = null;
    //                     item2.lay1 = null;
    //                     item2.lay2 = null;
    //                     item2.lay3 = null;
    //                     item2.laySize1 = null;
    //                     item2.laySize2 = null;
    //                     item2.laySize3 = null;
    //                 })
    //             }
    //             $rootScope.ExposureBook(item.mktId);
    //         })
    //     }
    // }

    $scope.ws = null;
    $scope.matchData = {};

    $scope.fancyBookCalled = false;

    $rootScope.FancyData = function (matchfancyData) {
      //   console.log("- $scope.fancyData:", matchfancyData);
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

    $scope.fancyEposure = function () {
      if ($scope.fancyData != undefined) {
        angular.forEach($rootScope.fancyBook, function (item, index) {
          angular.forEach($scope.fancyData, function (fancy) {
            if (index == item) {
              $("#fancyBetBookBtn_" + fancy.id + "").css("display", "block");
              if (item == 0) {
                item = 0;
              } else {
                if (item > 0) {
                  $("#fexp_" + fancy.id + fancyName)
                    .text("" + item.toFixed(2) + "")
                    .css("color", "green");
                  $("#fancyBetBookBtn_" + fancy.id).css("display", "block");
                } else {
                  $("#fexp_" + fancy.id + fancyName)
                    .text("" + item.toFixed(2) + "")
                    .css("color", "red");
                  $("#fancyBetBookBtn_" + fancy.id).css("display", "block");
                }
              }
            }
          });
        });
      }
    };
    var fancyEpo = $interval(function () {
      $scope.fancyEposure();
    }, 1000);

    $rootScope.getAllFancyExposure = function (id, name) {
      $scope.mtid = $routeParams.matchId;
      $http({
        url: baseUrl + "/listBooks/" + $scope.fancyIds.join(","),
        method: "GET",
        headers: {
          Authorization: authtoken,
        },
      }).then(
        function mySuccess(response) {
          console.log(response);
          if (response.data.errorCode == 0) {
            $rootScope.fancyBook = {};
            var getFancyExposureData = response.data.result[0];
            Object.keys(getFancyExposureData).forEach((fancyId) => {
              $rootScope.fancyBook[+fancyId] = getFancyExposureData[+fancyId]
                .replace(/\{|\}/g, "")
                .split(",")
                .map((f) => {
                  return f.split(":").map((b) => (b = +b));
                });
            });
            // console.log($scope.getFancyExposureData)
            angular.forEach($rootScope.fancyBook, function (value, item) {
              // value = JSON.parse(value);
              angular.forEach($scope.fancyData[0], function (fancy) {
                if (item == fancy.sid) {
                  $("#fancyBetBookBtn_" + fancy.sid).css("display", "block");
                  // if (value[0][1] == 0) {
                  //   value[0][1] = 0;
                  // } else {
                  $("#fancyBetBookBtn_" + fancy.sid).css("display", "block");
                  if (+value[0][1] < 0) {
                    $("#fexp_" + fancy.sid)
                      .text("" + value[0][1].toFixed(2) + "")
                      .css("color", "red");
                  } else {
                    $("#fexp_" + fancy.sid)
                      .text("" + value[1][1].toFixed(2) + "")
                      .css("color", "red");
                    $("#fancyBetBookBtn_" + fancy.sid).css("display", "block");
                  }
                }
                // }
              });
            });
          }
        },
        function myError(error) {
          if (error.status == 401) {
            // $.removeCookie("authtoken");
            // window.location.href="index.html"
          }
        }
      );
    };

    $rootScope.getFancyExposure = function (eventId) {
      $http({
        url: baseUrl + "/fancyExposure/" + $routeParams.matchId,
        method: "GET",
        headers: {
          Authorization: authtoken,
        },
      }).then((response) => {
        console.log(response);
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
                  $("#fexp_" + fancy.sid)
                    .text("" + value.toFixed(2) + "")
                    .css("color", "red");
                } else {
                  $("#fexp_" + fancy.sid)
                    .text("" + (value * -1).toFixed(2) + "")
                    .css("color", "red");
                  $("#fancyBetBookBtn_" + fancy.sid).css("display", "block");
                }
              }
              // }
            });
          });
        }
      });
    };

    //     $scope.SessionData = function(response) {

    //     //console.log(response, "SessionData")
    //     $scope.Sessionfeeds = $scope.sessionIdWiseData(response);
    //     // console.log($scope.Sessionfeeds)
    //     if ($scope.markets != undefined && $scope.dataMode == 2) {
    //         angular.forEach($scope.Sessionfeeds, function(value, index) {
    //             if ($scope.markets[value.id] != undefined) {
    //                 $scope.markets[value.id].mktStatus = value.status;
    //                 // $scope.matchStatus = value.status;
    //                 $scope.noSpaceMarketid = value.id.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '_');
    //                 angular.forEach(value.runners, function(item3, index) {
    //                     angular.forEach($scope.markets[value.id].runnerData, function(item2, index2) {
    //                         if (item2.runnerName == item3.name) {
    //                             // console.log(item3.back[0])
    //                             if (item3.back[0] != undefined) {
    //                                 item3.back[0].size = parseFloat(item3.back[0].size) * parseFloat($scope.volMulti);
    //                                 if (item2.back1 != item3.back[0].price || item2.backSize1 != item3.back[0].size) {
    //                                     $('#' + $scope.noSpaceMarketid + ' #runner' + index + 'back1').addClass('blink');
    //                                 }
    //                                 item2.back1 = item3.back[0].price;
    //                                 item2.backSize1 = item3.back[0].size;
    //                             } else {
    //                                 item2.back1 = null;
    //                                 item2.backSize1 = null;
    //                             }
    //                             if (item3.back[1] != undefined) {
    //                                 item3.back[1].size = parseFloat(item3.back[1].size) * parseFloat($scope.volMulti);
    //                                 if (item2.back2 != item3.back[1].price || item2.backSize2 != item3.back[1].size) {
    //                                     $('#' + $scope.noSpaceMarketid + ' #runner' + index + 'back2').addClass('blink');
    //                                 }
    //                                 item2.back2 = item3.back[1].price;
    //                                 item2.backSize2 = item3.back[1].size;
    //                             } else {
    //                                 item2.back2 = null;
    //                                 item2.backSize2 = null;
    //                             }
    //                             if (item3.back[2] != undefined) {
    //                                 item3.back[2].size = parseFloat(item3.back[2].size) * parseFloat($scope.volMulti);
    //                                 if (item2.back3 != item3.back[2].price || item2.backSize3 != item3.back[2].size) {
    //                                     $('#' + $scope.noSpaceMarketid + ' #runner' + index + 'back3').addClass('blink');
    //                                 }
    //                                 item2.back3 = item3.back[2].price;
    //                                 item2.backSize3 = item3.back[2].size;
    //                             } else {
    //                                 item2.back3 = null;
    //                                 item2.backSize3 = null;
    //                             }
    //                             if (item3.lay[0] != undefined) {
    //                                 item3.lay[0].size = parseFloat(item3.lay[0].size) * parseFloat($scope.volMulti);
    //                                 if (item2.lay1 != item3.lay[0].price || item2.laySize1 != item3.lay[0].size) {
    //                                     $('#' + $scope.noSpaceMarketid + ' #runner' + index + 'lay1').addClass('blink');
    //                                 }
    //                                 item2.lay1 = item3.lay[0].price;
    //                                 item2.laySize1 = item3.lay[0].size;
    //                             } else {
    //                                 item2.lay1 = null;
    //                                 item2.laySize1 = null;
    //                             }
    //                             if (item3.lay[1] != undefined) {
    //                                 item3.lay[1].size = parseFloat(item3.lay[1].size) * parseFloat($scope.volMulti);
    //                                 if (item2.lay2 != item3.lay[1].price || item2.laySize2 != item3.lay[1].size) {
    //                                     $('#' + $scope.noSpaceMarketid + ' #runner' + index + 'lay2').addClass('blink');
    //                                 }
    //                                 item2.lay2 = item3.lay[1].price;
    //                                 item2.laySize2 = item3.lay[1].size;
    //                             } else {
    //                                 item2.lay2 = null;
    //                                 item2.laySize2 = null;
    //                             }
    //                             if (item3.lay[2] != undefined) {
    //                                 item3.lay[2].size = parseFloat(item3.lay[2].size) * parseFloat($scope.volMulti);
    //                                 if (item2.lay3 != item3.lay[2].price || item2.laySize3 != item3.lay[2].size) {
    //                                     $('#' + $scope.noSpaceMarketid + ' #runner' + index + 'lay3').addClass('blink');
    //                                 }
    //                                 item2.lay3 = item3.lay[2].price;
    //                                 item2.laySize3 = item3.lay[2].size;
    //                             } else {
    //                                 item2.lay3 = null;
    //                                 item2.laySize3 = null;
    //                             }
    //                         }
    //                     });
    //                 });
    //             }
    //         })
    //     }
    // }

    // $scope.SessionData = function (sportId, matchBfId) {
    //   $(".lay1").removeClass("spark");
    //   $(".lay2").removeClass("spark");
    //   $(".back2").removeClass("spark");
    //   $(".back1").removeClass("spark");
    //   if (matchBfId != null && matchBfId != undefined && sportId != undefined) {
    //     // if ($scope.pending_SessionData == true) return false
    //     // $scope.pending_SessionData = true
    //     $http({
    //       // method: "GET",
    //       // // url: "https://www.lotusbook.com/api/exchange/odds/event/" + $scope.$scope.sportId + "/" + $scope.matchBfId,
    //       // url: "https://www.lotusbook.com/api/exchange/odds/sma-event/LIOD/" + sportId + "/" + matchBfId,
    //       // headers: {
    //       //     "Content-Type": "application/json",
    //       // }
    //       method: "POST",
    //       url: "http://dak19.com/api/matchOdds.php",
    //       data: {
    //         sportId: sportId,
    //         matchBfId: matchBfId,
    //       },
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }).then(
    //       function success(response) {
    //         // $scope.pending_SessionData = false
    //         //console.log(response, "SessionData")
    //         $scope.Sessionfeeds = $scope.sessionIdWiseData(
    //           response.data.result
    //         );
    //         // console.log($scope.Sessionfeeds)
    //         if ($scope.markets != undefined) {
    //           angular.forEach($scope.Sessionfeeds, function (value, index) {
    //             if ($scope.markets[value.id] != undefined) {
    //               $scope.markets[value.id].mktStatus = value.status;
    //               $scope.matchStatus = value.status;
    //               $scope.noSpaceMarketid = value.id
    //                 .replace(/[^a-z0-9\s]/gi, "")
    //                 .replace(/[_\s]/g, "_");
    //               angular.forEach(value.runners, function (item3, index) {
    //                 angular.forEach(
    //                   $scope.markets[value.id].runnerData,
    //                   function (item2) {
    //                     if (item2.runnerName == item3.name) {
    //                       // console.log(item3.back[0])
    //                       if (item3.back[0] != undefined) {
    //                         item3.back[0].size =
    //                           parseFloat(item3.back[0].size) *
    //                           parseFloat($scope.volMulti);
    //                         if (
    //                           item2.back1 != item3.back[0].price ||
    //                           item2.backSize1 != item3.back[0].size
    //                         ) {
    //                           $(
    //                             "#" +
    //                               $scope.noSpaceMarketid +
    //                               " #runner" +
    //                               index +
    //                               "back1"
    //                           ).addClass("spark");
    //                         }
    //                         item2.back1 = item3.back[0].price;
    //                         item2.backSize1 = item3.back[0].size;
    //                       } else {
    //                         item2.back1 = null;
    //                         item2.backSize1 = null;
    //                       }
    //                       if (item3.back[1] != undefined) {
    //                         item3.back[1].size =
    //                           parseFloat(item3.back[1].size) *
    //                           parseFloat($scope.volMulti);
    //                         if (
    //                           item2.back2 != item3.back[1].price ||
    //                           item2.backSize2 != item3.back[1].size
    //                         ) {
    //                           $(
    //                             "#" +
    //                               $scope.noSpaceMarketid +
    //                               " #runner" +
    //                               index +
    //                               "back2"
    //                           ).addClass("spark");
    //                         }
    //                         item2.back2 = item3.back[1].price;
    //                         item2.backSize2 = item3.back[1].size;
    //                       } else {
    //                         item2.back2 = null;
    //                         item2.backSize2 = null;
    //                       }
    //                       if (item3.back[2] != undefined) {
    //                         item3.back[2].size =
    //                           parseFloat(item3.back[2].size) *
    //                           parseFloat($scope.volMulti);
    //                         if (
    //                           item2.back3 != item3.back[2].price ||
    //                           item2.backSize3 != item3.back[2].size
    //                         ) {
    //                           $(
    //                             "#" +
    //                               $scope.noSpaceMarketid +
    //                               " #runner" +
    //                               index +
    //                               "back3"
    //                           ).addClass("spark");
    //                         }
    //                         item2.back3 = item3.back[2].price;
    //                         item2.backSize3 = item3.back[2].size;
    //                       } else {
    //                         item2.back3 = null;
    //                         item2.backSize3 = null;
    //                       }
    //                       if (item3.lay[0] != undefined) {
    //                         item3.lay[0].size =
    //                           parseFloat(item3.lay[0].size) *
    //                           parseFloat($scope.volMulti);
    //                         if (
    //                           item2.lay1 != item3.lay[0].price ||
    //                           item2.laySize1 != item3.lay[0].size
    //                         ) {
    //                           $(
    //                             "#" +
    //                               $scope.noSpaceMarketid +
    //                               " #runner" +
    //                               index +
    //                               "lay1"
    //                           ).addClass("spark");
    //                         }
    //                         item2.lay1 = item3.lay[0].price;
    //                         item2.laySize1 = item3.lay[0].size;
    //                       } else {
    //                         item2.lay1 = null;
    //                         item2.laySize1 = null;
    //                       }
    //                       if (item3.lay[1] != undefined) {
    //                         item3.lay[1].size =
    //                           parseFloat(item3.lay[1].size) *
    //                           parseFloat($scope.volMulti);
    //                         if (
    //                           item2.lay2 != item3.lay[1].price ||
    //                           item2.laySize2 != item3.lay[1].size
    //                         ) {
    //                           $(
    //                             "#" +
    //                               $scope.noSpaceMarketid +
    //                               " #runner" +
    //                               index +
    //                               "lay2"
    //                           ).addClass("spark");
    //                         }
    //                         item2.lay2 = item3.lay[1].price;
    //                         item2.laySize2 = item3.lay[1].size;
    //                       } else {
    //                         item2.lay2 = null;
    //                         item2.laySize2 = null;
    //                       }
    //                       if (item3.lay[2] != undefined) {
    //                         item3.lay[2].size =
    //                           parseFloat(item3.lay[2].size) *
    //                           parseFloat($scope.volMulti);
    //                         if (
    //                           item2.lay3 != item3.lay[2].price ||
    //                           item2.laySize3 != item3.lay[2].size
    //                         ) {
    //                           $(
    //                             "#" +
    //                               $scope.noSpaceMarketid +
    //                               " #runner" +
    //                               index +
    //                               "lay3"
    //                           ).addClass("spark");
    //                         }
    //                         item2.lay3 = item3.lay[2].price;
    //                         item2.laySize3 = item3.lay[2].size;
    //                       } else {
    //                         item2.lay3 = null;
    //                         item2.laySize3 = null;
    //                       }
    //                     }
    //                   }
    //                 );
    //               });
    //             }
    //           });
    //         }
    //       },
    //       function error(response) {
    //         // $scope.pending_SessionData = false
    //         if (response.status == 401) {
    //           // $.removeCookie("authtoken");
    //           window.location.href = "index.html";
    //         }
    //       }
    //     );
    //   }
    // };

    // $scope.sessionIdWiseData = function(sessions) {
    //     var newMarkets = {};
    //         angular.forEach(sessions, function(item, key) {
    //             var fancyname=item.name.trim();
    //             newMarkets[fancyname] = item;
    //         })
    //     return newMarkets;
    //     // console.log($scope.markets)
    // }
    $scope.sessionIdWiseData = function (sessions, state) {
      var newMarkets = {};

      if (state == "d") {
        angular.forEach(sessions, function (item, key) {
          newMarkets[item.nation] = item;
        });
      } else {
        angular.forEach(sessions, function (item, key) {
          newMarkets[item.name] = item;
        });
      }

      return newMarkets;
      // console.log($scope.markets)
    };
    if ($rootScope.authcookie != undefined || $rootScope.authcookie != null) {
      var sessionstatus = $interval(function () {
        // $scope.SessionData();
      }, 500);
    }
    // var highlightTimer
    $scope.$on("$routeChangeStart", function () {
      $interval.cancel(sessionstatus);
      if ($rootScope.ws) {
        $rootScope.ws.$close();
      }
      $interval.cancel(fancyEpo);
      $interval.cancel($scope.marketDescInterval);
      $interval.cancel($scope.countDownInterval);
    });

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

    $scope.getScore = function () {
      // if ($scope.marketdata.method == 1 || $scope.marketdata.method == undefined) {
      //     $scope.fullScore = null;
      //     return false;
      // }
      // https://ips.betfair.com/inplayservice/v1/scores?regionCode=UK&_ak=dyMLAanpRyIsjkpJ&alt=json&locale=en_GB&eventIds=29134308
      if ($scope.matchBfId != undefined) {
        if (window.location.origin.includes("localhost")) {
          $scope.scoreUrl =
            "http://streamingtv.fun:3030/score_api/" + $scope.matchBfId;
        } else {
          $scope.scoreUrl =
            "https://streamingtv.fun:3440/score_api/" + $scope.matchBfId;
        }
        $http({
          url: $scope.scoreUrl,
          method: "GET",
        }).then(function success(data) {
          // console.log(data)
          if ($scope.sportId == 1) {
            $scope.fullScore = data.data;
          } else if ($scope.sportId == 2) {
            $scope.fullScore = data.data;
          } else {
            $scope.fullScore = data.data.score;
            $scope.matcheventId = data.data.eventId;
          }

          // console.log($scope.fullScore, "scoreboard");
        });
      }
    };

    $scope.getfancyTopCss = function (index, fancyNote) {
      if (index >= 1) {
        if (fancyNote != "") {
          $scope.top = parseInt($scope.top) + 67;
          $scope.top1 = $scope.top;
          return {
            top: $scope.top1 + "px",
          };
        } else {
          $scope.top = parseInt($scope.top) + 57;
          $scope.top1 = $scope.top;
          return {
            top: $scope.top1 + "px",
          };
        }
      } else {
        $scope.top = 0;
        return {
          top: "0px",
        };
      }
    };
    $scope.BMTopStyle = {};
    $scope.getBMTopCss = function (index) {
      $scope.BMTopStyle = {};
      if (index >= 1) {
        $scope.top = parseInt($scope.top) + 41;
        // $scope.top1 = $scope.top;
        $scope.BMTopStyle = {
          top: 41 * index + "px",
          cursor: "not-allowed",
        };
      } else {
        $scope.top = 0;
        $scope.BMTopStyle = {
          top: "0px",
          cursor: "not-allowed",
        };
      }
      return $scope.BMTopStyle;
    };

    $scope.getTeenTopCss = function (index) {
      if (index >= 1) {
        $scope.top = parseInt($scope.top) + 41;
        $scope.top1 = $scope.top;
        return {
          top: $scope.top1 + "px",
          cursor: "not-allowed",
        };
      } else {
        $scope.top = 2;
        return {
          top: "2px",
          cursor: "not-allowed",
        };
      }
    };

    $scope.getTeenTopCssTest = function (index) {
      if (index >= 1) {
        $scope.top = parseInt($scope.top) + 41;
        $scope.top1 = $scope.top;
        return {
          top: $scope.top1 + "px",
          cursor: "not-allowed",
        };
      } else {
        $scope.top = 25;
        return {
          top: "25px",
          cursor: "not-allowed",
        };
      }
    };

    // $rootScope.$on("callBMExp", function() {
    //     $rootScope.getBMExposureBook
    // });

    $scope.fancyruleopen = function () {
      $("#fancyBetRulesWrap").css("display", "block");
    };
    $scope.fancyruleclose = function () {
      $("#fancyBetRulesWrap").css("display", "none");
    };

    $scope.scoreId = 0;
    $scope.GetScoreId = function () {
      $http({
        method: "GET",
        url: "http://3.7.254.125:81",
      }).then(
        function mySuccess(data) {
          var s = data.data;
          // let d = Object.values(s).filter((f) => f.id === $scope.matchBfId);
          var events = [];
          angular.forEach(s, (v) => {
            v.fixtures.forEach((e) => {
              events.push(e);
            });
          });
          $scope.scoreId = events.filter(
            (e) => parseInt(e.idBF) === $scope.matchBfId
          )[0].id;
          if ($scope.scoreId) {
            $scope.get_event();
          }
        },
        function myError(error) {
          console.log("Error in response GetServices ", error);
        }
      );
    };

    // $scope.GetScoreId();

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
      if ($scope.marketdata) {
        let matchDate = $scope.marketdata["matchDate"];
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
      }
    };

    var fiveSecsInterval = $interval(function () {
      if ($rootScope.authcookie) {
        $scope.loadEvent();
      }
      // $scope.get_scorecard();
      // $scope.scoreDateTime();
      $scope.getScore();
    }, 5000);

    var stscoreInterval = $interval(function () {
      if (!$scope.marketdata) {
        $rootScope.MktData();
        $scope.getWebSocketData();
      }
      // $scope.get_scorecard();
      // $scope.scoreDateTime();
      //   $scope.getScore();
    }, 100);

    $scope.showTv = true;
    $scope.toggleTv = function () {
      $scope.showTv = !$scope.showTv;
    }

    $scope.$on("$destroy", function () {
      // $scope.UnsubscribeMOMarket();
      // $scope.unSubscribeFancyMarket();
      // $scope.unSubscribeMatchScore();
      $scope.GetBets();
      //   $scope.unloadEvent();
      $interval.cancel(stscoreInterval);
      $interval.cancel(fiveSecsInterval);
      $interval.cancel($scope.oddsInterval);
    });
  }
);
