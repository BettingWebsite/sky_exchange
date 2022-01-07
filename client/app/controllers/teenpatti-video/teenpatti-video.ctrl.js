app.controller(
  "teenpattiVideoController",
  function (
    $scope,
    $http,
    $websocket,
    $routeParams,
    $rootScope,
    $interval,
    $timeout,
    $sce,
    $mdDialog,
    $resource
  ) {
    $scope.andar_bahar = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
    $scope.worli_mataka = [1, 2, 3, 4, 5];
    $scope.worli_matakaa = [6, 7, 8, 9, 0];
    $scope.result_string = ["0", "A", "B", "C", "D", "E", "F"];
    $scope.min_max_info0 = false;
    $scope.min_max_info1 = false;
    $scope.min_max_info2 = false;
    $scope.min_max_info3 = false;
    $scope.min_max_info4 = false;
    $scope.min_max_info5 = false;
    $scope.min_max_info6 = false;
    $scope.min_max_info7 = false;
    $scope.min_max_info8 = false;
    $scope.min_max_info9 = false;
    $scope.min_max_info10 = false;
    $scope.min_max_info11 = false;
    $scope.min_max_info12 = false;
    $scope.min_max_info13 = false;
    $scope.min_max_info14 = false;
    $scope.min_max_info15 = false;
    $scope.min_max_info16 = false;
    $scope.min_max_info17 = false;
    $scope.min_max_info18 = false;

    /* pie chart start */
    $scope.pieChartObject = {};
    //set chart type
    $scope.pieChartObject.type = "PieChart";

    //set title
    $scope.pieChartObject.options = {
      title: "Statistics",
      is3D: true,
      backgroundColor: "#eee",
      chartArea: { left: 10, top: 0, width: "100%", height: "100%" },
      colors: ["#086cb8", "#ae2130", "#279532"],
      height: "160",
    };

    //set data
    $scope.pieChartObject.data = {
      cols: [
        { id: "t", label: "Status", type: "string" },
        { id: "s", label: "Value", type: "number" },
      ],
      rows: [
        { c: [{ v: "Player" }, { v: 55 }] },
        { c: [{ v: "Banker" }, { v: 41 }] },
        { c: [{ v: "Tie" }, { v: 4 }] },
      ],
    };
    /* pie chart end */

    $scope.tableName = $routeParams.tableName;
    $scope.matchName = $scope.tableName;
    $scope.tableId = $routeParams.tableId;
    $scope.streamServer = $routeParams.streamServer;
    $scope.streamUrl = $routeParams.streamUrl;
    $scope.oddServer1 = $routeParams.oddServer1;
    $scope.oddServer2 = $routeParams.oddServer2;
    $scope.oddsPort = $routeParams.oddsUrl;
    $scope.realVideo = $sce.trustAsResourceUrl(
      "http://vrnl.xyz:89/" + $scope.streamUrl.substr(1)
    );
    $scope.GetBets();
    // $scope.oddsDataUrl = $sce.trustAsResourceUrl(
    //   "http://" + $scope.oddServer + "/?d=" + $scope.oddsPort
    // );
    $scope.oddsDataUrl1 =
      "http://" + $scope.oddServer1 + "/?d=" + $scope.oddsPort;

    $scope.oddsResultUrl1 =
      "http://" + $scope.oddServer1 + "/?r=" + $scope.oddsPort;

    $scope.oddsDataUrl2 =
      "http://" + $scope.oddServer2 + "/?d=" + $scope.oddsPort;

    $scope.oddsResultUrl2 =
      "http://" + $scope.oddServer2 + "/?r=" + $scope.oddsPort;

    $scope.loadEvent = function () {
      $http({
        url: baseUrl + "/loadTable/" + $scope.tableName,
        method: "GET",
        headers: {
          Authorization: authtoken,
        },
      }).then(
        function mySuccess(response) {
          if (response.data.errorCode === 0) {
            $scope.min = response.data.result[0].min;
            $scope.max = response.data.result[0].max;
            $scope.marketMinMax = response.data.result[0].markets;
          }
        },
        function myError(error) {}
      );
    };

    $scope.loadEvent();
    var loadEventInterval = $interval(() => {
      if ($scope.tableName) {
        $scope.loadEvent();
      }
    }, 5000);
    /* clock part */
    var clock;
    $(function () {
      clock = new FlipClock($(".clock"), 99, {
        clockFace: "Counter",
      });
    });

    /* remove decimal function */
    $scope.removeDecimal = function (i) {
      return parseFloat(i);
    };

    /* get Symbol image from string*/
    $scope.getCardSymbolImg = function (cardName) {
      if (!cardName || cardName == "1") {
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
          className = "card-black";
          break;
        case "DD":
          type = "{";
          className = "card-red";
          break;
        case "CC":
          type = "]";
          className = "card-black";
          break;
        case "SS":
          type = "[";
          className = "card-red";
          break;
      }

      value = char + '<span class="' + className + '">' + type + "</span>";

      return value;
    };

    /* call odd server */
    $scope.callOddsData = function (server) {
      var odd1res = $resource(
        $scope.oddsDataUrl1,
        {},
        {
          'get': {
            method: "GET",
            cancellable: true,
          },
        }
      )
      
      // .then(
      //   function mySuccess(response1) {
      //     if (response1.data) {
      //       $scope.setOddsData(response1);
      //     }
      //   },
      //   function myError(error) {
      //     console.log("error", error);
      //     $http({
      //       url: $scope.oddsDataUrl2,
      //       method: "GET",
      //     }).then(function mySuccess(response2) {
      //       $scope.setOddsData(response2);
      //     });
      //     if (error.status == 401) {
      //       $.removeCookie("authtoken");
      //       window.location.href = "index.html";
      //     }
      //   }
      // );

      var oddsRes = odd1res.get();
      var oddsTimeoutPromise = $timeout(function() {
        oddsRes.$cancelRequest();
        $http({
          url: $scope.oddsDataUrl2,
          method: "GET",
        }).then(function mySuccess(response2) {
          if (response2.data) {
            $scope.setOddsData(response2);
          }
        }, function myError(error) {
          if (error.status == 401) {
            $.removeCookie("authtoken");
            window.location.href = "index.html";
          }
        });
        
      }, 3000);

      oddsRes.$promise.then(
        (response1) => {
          $timeout.cancel(oddsTimeoutPromise);
          if (response1.data) {
            $scope.setOddsData(response1);
          }
        },
        (error) => {
          if (error.status == 401) {
            $.removeCookie("authtoken");
            window.location.href = "index.html";
          }
        }
      );
    };

    $scope.resultCount = 0;

    $scope.setOddsData = function (response) {
      if ($scope.tableId == -12) {
        $scope.tpData = response.data.data? (response.data.data && response.data.data.bf[0]): (response.data.bf && response.data.bf[0]);
        $scope.tpMarket = response.data.data? response.data.data.bf: response.data.bf;
        if ($scope.tpMarket[0].lasttime) {
          clock.setValue($scope.tpMarket[0].lasttime);
        }
      } else if ($scope.tableId == -5) {
        // console.log(data.data);
        $scope.AndarValues = [];
        $scope.BaharValues = [];
        $scope.Aallcards = [];
        $scope.Ballcards = [];
        $scope.Aresults = [];
        $scope.Bresults = [];

        if (response.data) {
          $scope.tpData = response.data.data? response.data.data.t1[0]: response.data.t1[0];
          $scope.tpMarket = response.data.data? response.data.data.t2: response.data.t2;
          console.log(response.data.data);
        }
        let cardsData = response.data.data? response.data.data.t3: response.data.t3;
        if (cardsData[0].aall != "") {
          $scope.Aallcards = cardsData[0].aall.split(",");
        }
        if (cardsData[0].ball != "") {
          $scope.Ballcards = cardsData[0].ball.split(",");
        }
        if (cardsData[0].ar != "") {
          $scope.Aresults = cardsData[0].ar.split(",");
        }
        if (cardsData[0].br != "") {
          $scope.Bresults = cardsData[0].br.split(",");
        }
        angular.forEach($scope.tpMarket, function (item, index) {
          var andarbaharnat = item.nation.split(" ");

          if (andarbaharnat[0] == "Ander") {
            $scope.AndarValues.push(item);
          }
          if (andarbaharnat[0] == "Bahar") {
            $scope.BaharValues.push(item);
          }
        });
        clock.setValue($scope.tpData.autotime);
      } else if ($scope.tableId == -14) {
        $scope.CardValues = [];

        // $scope.tpData = response.data.data.t1[0];
        // $scope.tpMarket = response.data.data.t2;
        // if ($scope.tpData.cards != "") {
        //   $scope.CardValues = $scope.tpData.cards.split(",");
        // }
        // clock.setValue($scope.tpData.autotime);

        if (response.data) {
          $scope.tpData = response.data.t1[0];
          $scope.tpMarket = response.data.t2;
          if ($scope.tpData.cards != "") {
            $scope.CardValues = $scope.tpData.cards.split(",");
          }
          clock.setValue($scope.tpData.autotime);
        }
      } else if (
        $scope.tableId == -24 ||
        $scope.tableId == -25 ||
        $scope.tableId == -4
      ) {
        $scope.DescValues = [];

        $scope.tpData = response.data.data? response.data.data.t1[0]: response.data.t1[0];
        $scope.tpMarket = response.data.data? response.data.data.t2: response.data.t2;
        if ($scope.tpData.desc != "") {
          $scope.DescValues = $scope.tpData.desc.split(",");
        }
        clock.setValue($scope.tpData.autotime);
      } else if ($scope.tableId == -20) {
        $scope.DescValues = [];

        $scope.tpData = response.data.data? response.data.data.t1[0]: response.data.t1[0];
        $scope.tpMarket = response.data.data? response.data.data.t2: response.data.t2;
        if ($scope.tpData.desc != "") {
          $scope.DescValues = $scope.tpData.desc.split("##");
        }
        clock.setValue($scope.tpData.autotime);
      } else if ($scope.tableId == -19) {
        $scope.DescValues = [];

        $scope.tpData = response.data.data? response.data.data.t1[0]: response.data.t1[0];
        $scope.tpMarket = response.data.data? response.data.data.t2: response.data.t2;
        $scope.t3Data = response.data.data? response.data.data.t3: response.data.t3;
        if ($scope.tpData.desc != "") {
          $scope.DescValues = $scope.tpData.desc.split("##");
        }
        clock.setValue($scope.tpData.autotime);
      } else if ($scope.tableId == -3) {
        $scope.DescValues = [];

        $scope.tpData = response.data.data? response.data.data.t1[0]: response.data.t1[0];
        $scope.tpMarket = response.data.data? response.data.data.t2: response.data.t2;
        $scope.t3Data = response.data.data? response.data.data.t3: response.data.t3;
        clock.setValue($scope.tpData.autotime);
      } else if ($scope.tableId == -16) {
        $scope.CardValues = [];
        $scope.lowValues = [];
        $scope.highValues = [];

        $scope.tpData = response.data.data? response.data.data.t1[0]: response.data.t1[0];
        $scope.tpMarket = response.data.data? response.data.data.t2: response.data.t2;
        if ($scope.tpData.cards != "") {
          $scope.CardValues = $scope.tpData.cards.split(",");
        }

        $scope.CardValues.forEach(function (item) {
          if (item != 1) {
            let firstChr = item.substr(0, 1);
            if (item.length == 4) {
              firstChr = item.substr(0, 2);
            }
            if (
              firstChr == "10" ||
              firstChr == "J" ||
              firstChr == "Q" ||
              firstChr == "K"
            ) {
              $scope.highValues.push(item);
            } else {
              $scope.lowValues.push(item);
            }
          }
        });
        clock.setValue($scope.tpData.autotime);
      } else {
        $scope.tpData = response.data.data? response.data.data.t1[0]: response.data.t1[0];
        $scope.tpMarket = response.data.data? response.data.data.t2: response.data.t2;
        clock.setValue($scope.tpData.autotime);
      }

      if ($scope.roundId) {
        $scope.previousRoundId = $scope.roundId;
        $scope.resultCount = 0;
      } else {
        $scope.resultCount += 1;
      }
      $scope.roundId = +($scope.tableId == -12? $scope.tpData.marketId.split('.')[1]: $scope.tpData.mid.split('.')[1]);

      if ($scope.resultCount == 1 && $scope.roundId != $scope.previousRoundId) {
        if ($("[id^=Tp_]").length) $("[id^=Tp_]").text("");
        $scope.GetBets();
        $scope.callOddsResult();
      }
    };

    $scope.callOddsResult = function () {
      let res1res = $resource($scope.oddsResultUrl1,{}, {
        'get': {
          method: "GET",
          cancellable: true
        },
      })
      
      // .then(
      //   function mySuccess(response1) {
      //     if (response1.data) {
      //       $scope.setOddsResult(response1);
      //     }
      //   },
      //   function myError(error) {
      //     $http({
      //       url: $scope.oddsResultUrl2,
      //       method: "GET",
      //     }).then(function mySuccess(response2) {
      //       $scope.setOddsResult(response2);
      //     });
      //     if (error.status == 401) {
      //       $.removeCookie("authtoken");
      //       window.location.href = "index.html";
      //     }
      //   }
      // );

      var response = res1res.get();
      var resTimeoutPromise = $timeout(() => {
        response.$cancelRequest();
        $http({
          url: $scope.oddsResultUrl2,
          method: "GET",
        }).then(function mySuccess(response2) {
          $scope.setOddsResult(response2);
        }, function myError(error) {
          if (error.status == 401) {
            $.removeCookie("authtoken");
            window.location.href = "index.html";
          }
        });
        
      }, 3000);

      response.$promise.then(
        (response1) => {
          $timeout.cancel(resTimeoutPromise);
          if (response1.data) {
            $scope.setOddsResult(response1);
          }
        },
        (error) => {
          if (error.status == 401) {
            $.removeCookie("authtoken");
            window.location.href = "index.html";
          }
        }
      );
    };

    $scope.setOddsResult = function (response) {
      // console.log("setOddsResult",response);
      $scope.resultsdata = response.data.data? response.data.data: response.data;
      if ($scope.tableId == -9) {
        if (response.data && response.data.graphdata) {
          $scope.pieChartObject.data.rows[0].c[1].v = response.data.graphdata.P;
          $scope.pieChartObject.data.rows[1].c[1].v = response.data.graphdata.B;
          $scope.pieChartObject.data.rows[2].c[1].v = response.data.graphdata.T;
        }
      }
    };

    /* call result server */
    $scope.callResult = function (roundId) {
      // console.log("roundId", roundId);
      // $scope.roundId = roundId;
      $http({
        url: baseUrl + "/casinoResults/" + $scope.tableName + "," + roundId,
        method: "GET",
        headers: {
          Authorization: authtoken,
        },
      }).then(
        function mySuccess(res) {
          // $scope.result = res;

          $mdDialog
            .show({
              controller: DialogController,
              templateUrl: "result.modal.html",
              parent: angular.element(document.body),
              targetEvent: event,
              clickOutsideToClose: true,
              fullscreen: false, // Only for -xs, -sm breakpoints.
              locals: {
                result: res,
                roundId: roundId,
                tableName: $scope.tableName,
                tableId: $scope.tableId,
              },
            })
            .then(
              function () {
                // $scope.placeBet();
              },
              function () {
                // $scope.removeAllBetSlip();
              }
            );
        },
        function myError(error) {
          console.log("error", error);
          if (error.status == 401) {
            $.removeCookie("authtoken");
            window.location.href = "index.html";
          }
        }
      );
    };

    function DialogController(
      $scope,
      $rootScope,
      $mdDialog,
      result,
      roundId,
      tableName,
      tableId
    ) {
      $scope.cancel = function () {
        $mdDialog.cancel();
      };
      console.log("result", result);
      $scope.result = result;
      $scope.roundId = roundId;
      $scope.tableName = tableName;
      $scope.tableId = tableId;
      if (result.data.result.length) {
        $scope.cards = result.data.result[0].data[0].cards.split(",");
        // if (tableId == -14) {
        $scope.sid = result.data.result[0].data[0].sid.split("|")[0].split(",");
        console.log("sid", $scope.sid);
        // }
      }
    }

    /*TP2020 tableId -10*/
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
    /* TP1Day tableId -12 */
    $scope.bMTopCss = {};
    $scope.getBMTopCss = function (index) {
      if (index == 0) {
        $scope.top = 0;
        $scope.top1 = $scope.top;
        setTimeout(() => {
          $scope.bMTopCss = {
            top: '0px',
            cursor: "not-allowed",
          };
        });
        console.log(index, $scope.top, $scope.bMTopCss);
        return $scope.bMTopCss;
      }
      if (index > 0) {
        $scope.top = index * 41;
        $scope.top1 = $scope.top;
        setTimeout(() => {
          $scope.bMTopCss = {
            top: $scope.top1 + "px",
            cursor: "not-allowed",
          };
        });
        console.log(index, $scope.top, $scope.bMTopCss);
        return $scope.bMTopCss;
      }
    };
    /* 3CardsJud tableId -23 */
    $scope.selected3cardj = function (card, backlay) {
      let selected = false;
      if (!$scope.placeTPData) {
        return selected;
      }
      if (!$scope.placeTPData.cards) {
        return selected;
      }

      if ($scope.placeTPData.backlay === backlay) {
        // card = card.toString();
        let indexcheck = $scope.placeTPData.cards.indexOf(card);
        if (indexcheck > -1) {
          return (selected = true);
        }
      }
    };

    var oddsTimer = $interval(function () {
      $scope.callOddsData();
    }, 1000);

    var eventTimer = $interval(function () {
      $scope.loadEvent();
    }, 5000);

    $scope.$on("$destroy", function () {
      $interval.cancel(oddsTimer);
      $interval.cancel(eventTimer);
      $interval.cancel(loadEventInterval);
      $mdDialog.hide();
    });

    // $scope.openTeenbetSlip = function(event, backlay, odds, runnerName, selectionId, runnerId, gameId, gameType, matchName, sportId, runnerindex, card) {
    //   console.log(backlay, odds, runnerName, selectionId, runnerId, gameId, gameType, matchName, sportId, runnerindex, card);
    //   if ($scope.oneClicked != "true") {
    //       $("#betslip_open").removeClass("close");
    //   }

    //   if (backlay == "back" || backlay == "lay") {
    //       $scope.removeAllBetSlip('remove')
    //   } else {
    //       $scope.removeAllBetSlip()
    //   }

    //   if ($scope.placeTPData) {
    //       if ($scope.placeTPData.backlay != backlay) {
    //           $scope.removeAllBetSlip()
    //       }
    //   }

    //   // console.log(backlay, odds, runnerName, runnerId, gameId, gameType);
    //   $scope.placeTPData = {
    //     "backlay": backlay,
    //     "gameType": gameType,
    //     "odds": odds,
    //     "runnerName": runnerName,
    //     "runnerId": runnerId,
    //     "stake": 0,
    //     "profit": 0,
    //     "gameId": gameId,
    //     "matchname": matchName
    //   }
    //   if (card) {
    //       if ($rootScope.cards.length < 3) {
    //           let indexcheck = $rootScope.cards.indexOf(card);
    //           if (indexcheck == -1) {
    //               $rootScope.cards.push(card);
    //           }
    //       }
    //   }

    //   if ($rootScope.cards.length != 0) {
    //       $scope.placeTPData['cards'] = $rootScope.cards;
    //       $scope.placeTPData.runnerName = $scope.placeTPData.runnerName + ' ' + $scope.placeTPData.cards.toString().replace(/,/g, '');
    //   }
    //   $scope.backTeenSlipDataArray.push($scope.placeTPData);
    //   $scope.backTeenSlipDataArray = $scope.removeDuplicates(
    //       $scope.backTeenSlipDataArray
    //   );
    //   // console.log($scope.placeTPData,'Teenpatti placeBet Data');
    //   // console.log($scope.backTeenSlipDataArray,'backTeenSlipDataArra ');
    // }
  }
);
