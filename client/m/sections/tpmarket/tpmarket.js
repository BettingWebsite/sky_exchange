app.controller(
  "tpmarketController",
  function (
    $scope,
    $http,
    $websocket,
    $routeParams,
    $rootScope,
    $interval,
    $sce,
    $mdDialog,
    $resource,
    $timeout,
    $filter
  ) {
    var authtoken = $rootScope.token;
    var baseUrl = "http://136.244.79.114:82";
    $scope.andar_bahar = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
    $scope.result_string = ["0", "A", "B", "C", "D", "E", "F"];

    $scope.minMaxKey = [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ];

    $scope.toggleMinMax = function (index) {
      $scope.minMaxKey[index] = !$scope.minMaxKey[index];
    };

    /* pie chart start */
    $scope.pieChartObject = {};
    //set chart type
    $scope.pieChartObject.type = "PieChart";

    //set title
    $scope.pieChartObject.options = {
      title: "Statistics",
      is3D: true,
      backgroundColor: "#eee",
      chartArea: { left: 0, top: 10, width: "100%", height: "100%" },
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
        {
          c: [{ v: "Player" }, { v: 55 }],
        },
        {
          c: [{ v: "Banker" }, { v: 41 }],
        },
        {
          c: [{ v: "Tie" }, { v: 4 }],
        },
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
        url: ApiUrl + "loadTable/" + $scope.tableName,
        method: "GET",
        headers: {
          Authorization: token,
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
          className = "color-red";
          break;
        case "CC":
          type = "]";
          className = "card-black";
          break;
        case "SS":
          type = "[";
          className = "color-red";
          break;
      }

      value = char + '<span class="' + className + '">' + type + "</span>";

      return value;
    };

    /* toggle collapse */
    $scope.isOpenToggle = true;
    $scope.toggleTab = function () {
      $scope.isOpenToggle = !$scope.isOpenToggle;
    };

    /* owlCarousel part */
    $scope.owlCarousel = function () {
      $("#andar_div,#bahar_div").owlCarousel({
        loop: false,
        margin: 10,
        responsiveClass: false,
        slideBy: 5,
        dots: false,
        responsive: {
          0: {
            items: 5,
            nav: true,
          },
          600: {
            items: 5,
            nav: true,
          },
          1000: {
            items: 14,
            nav: true,
            loop: false,
          },
        },
      });
    };

    /* call odd server */
    $scope.callOddsData = function (server) {
      var odd1res = $resource(
        $scope.oddsDataUrl1,
        {},
        {
          get: {
            method: "GET",
            cancellable: true,
          },
        }
      );

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
      var oddsTimeoutPromise = $timeout(function () {
        oddsRes.$cancelRequest();
        $http({
          url: $scope.oddsDataUrl2,
          method: "GET",
        }).then(
          function mySuccess(response2) {
            if (response2.data) {
              $scope.setOddsData(response2);
            }
          },
          function myError(error) {
            if (error.status == 401) {
              $.removeCookie("authtoken");
              window.location.href = "index.html";
            }
          }
        );
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
        $scope.tpData = response.data.data? response.data.data.bf[0]: response.data.bf[0];
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
        $scope.tpMarket = response.data.data?response.data.data.t2: response.data.t2;
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
        $('[id^=withoutBetMktExp_]').val("");
        $('[id^=withBetMktExp_]').val("");
        $scope.getAllBets();
        console.log($scope.roundId, $scope.previousRoundId);
        $scope.callOddsResult();
      }
    };
    $scope.callOddsResult = function () {
      let res1res = $resource(
        $scope.oddsResultUrl1,
        {},
        {
          get: {
            method: "GET",
            cancellable: true,
          },
        }
      );

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
        }).then(
          function mySuccess(response2) {
            $scope.setOddsResult(response2);
          },
          function myError(error) {
            if (error.status == 401) {
              $.removeCookie("authtoken");
              window.location.href = "index.html";
            }
          }
        );
      }, 3000);

      response.$promise.then(
        (response1) => {
          if (response1.data) {
            $scope.setOddsResult(response1);
          }
          $timeout.cancel(resTimeoutPromise);
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
        $scope.pieChartObject.data.rows[0].c[1].v = response.data.graphdata.P;
        $scope.pieChartObject.data.rows[1].c[1].v = response.data.graphdata.B;
        $scope.pieChartObject.data.rows[2].c[1].v = response.data.graphdata.T;
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
              controller: DialogController1,
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

    function DialogController1(
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
    $scope.getBMTopCss = function (index) {
      if (index >= 1) {
        $scope.top = parseInt($scope.top) + 41;
        $scope.top1 = $scope.top;
        return {
          top: $scope.top1 + "px",
          cursor: "not-allowed",
        };
      } else {
        $scope.top = 0;
        return {
          top: "0px",
          cursor: "not-allowed",
        };
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
    });

    /* For bet js */
    $scope.stakeList = [
      { id: 1, stake: 1000 },
      { id: 2, stake: 2000 },
      { id: 3, stake: 5000 },
      { id: 4, stake: 10000 },
      { id: 5, stake: 25000 },
      { id: 6, stake: 50000 },
    ];

    $scope.backTeenSlipDataArray = [];
    $scope.GetSettings = function () {
      var default_stake = $.cookie("default_stake");
      if (default_stake) {
        default_stake = JSON.parse(default_stake);
        $rootScope.default_stake = default_stake;
      } else {
        $scope.stakeList = $scope.stakeList;
        $rootScope.default_stake = 0;
        $rootScope.isOddsHighlights = 0;
      }

      if ($rootScope.default_stake == 0) {
        $rootScope.default_stake = "";
      }
      if ($rootScope.isOddsHighlights == 1) {
        $scope.oddsval = true;
      } else {
        $scope.oddsval = false;
      }
    };

    $scope.GetSettings();
    // $scope.showAdvanced = function (ev) {
    //   $mdDialog.show({
    //     controller: DialogController,
    //     templateUrl: 'bet.modal.html',
    //     // Appending dialog to document.body to cover sidenav in docs app
    //     // Modal dialogs should fully cover application to prevent interaction outside of dialog
    //     parent: angular.element(document.body),
    //     targetEvent: ev,
    //     clickOutsideToClose: true,
    //     fullscreen: false // Only for -xs, -sm breakpoints.
    //   }).then(function () {
    //     $scope.placeBet();

    //   }, function () {
    //     $scope.removeAllBetSlip();
    //   });
    // };

    $rootScope.openTeenbetSlip = function (
      event,
      backlay,
      odds,
      runnerName,
      runnerId,
      gameId,
      gameType,
      matchName,
      sportId,
      runnerindex,
      card
    ) {
      console.log(
        backlay,
        odds,
        runnerName,
        runnerId,
        gameId,
        gameType,
        matchName,
        sportId,
        runnerindex,
        card
      );
      if ($scope.oneClicked != "true") {
        $("#betslip_open").removeClass("close");
      }

      if (backlay == "back" || backlay == "lay") {
        $scope.removeAllBetSlip("remove");
      } else {
        $scope.removeAllBetSlip();
      }

      if ($scope.placeTPData) {
        if ($scope.placeTPData.backlay != backlay) {
          $scope.removeAllBetSlip();
        }
      }

      // console.log(backlay, odds, runnerName, runnerId, gameId, gameType);
      $scope.placeTPData = {
        backlay: backlay,
        gameType: gameType,
        odds: +odds,
        runnerName: runnerName,
        runnerId: runnerId,
        stake: $rootScope.default_stake,
        profit: 0,
        gameId: gameId,
        matchname: matchName,
      };
      if ($scope.placeTPData.gameType === "-12") {
        $scope.placeTPData.odds = parseFloat($scope.placeTPData.odds) / 100 + 1;
      }
      if (card) {
        if ($rootScope.cards.length < 3) {
          let indexcheck = $rootScope.cards.indexOf(card);
          if (indexcheck == -1) {
            $rootScope.cards.push(card);
            $rootScope.cards = $rootScope.cards.sort((a, b) => a > b);
          }
        }
      }

      if ($rootScope.cards.length != 0) {
        $scope.placeTPData["cards"] = $rootScope.cards;
        $scope.placeTPData.runnerName =
          $scope.placeTPData.runnerName +
          " " +
          $scope.placeTPData.cards.join("");
      }
      $scope.backTeenSlipDataArray.push($scope.placeTPData);
      $scope.backTeenSlipDataArray = $scope.removeDuplicates(
        $scope.backTeenSlipDataArray
      );

      $(".back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3").removeClass("select");
      var element = angular.element(event.currentTarget);
      element.addClass("select");
    };

    $rootScope.openTeenbetSlipModal = function (
      event,
      backlay,
      odds,
      runnerName,
      runnerId,
      gameId,
      gameType,
      matchName,
      sportId,
      runnerindex,
      card
    ) {
      console.log(
        backlay,
        odds,
        runnerName,
        runnerId,
        gameId,
        gameType,
        matchName,
        sportId,
        runnerindex,
        card
      );
      if ($scope.oneClicked != "true") {
        $("#betslip_open").removeClass("close");
      }

      if (backlay == "back" || backlay == "lay") {
        $scope.removeAllBetSlip("remove");
      } else {
        $scope.removeAllBetSlip();
      }

      if ($scope.placeTPData) {
        if ($scope.placeTPData.backlay != backlay) {
          $scope.removeAllBetSlip();
        }
      }

      // console.log(backlay, odds, runnerName, runnerId, gameId, gameType);
      $scope.placeTPData = {
        backlay: backlay,
        gameType: gameType,
        odds: odds,
        runnerName: runnerName,
        runnerId: runnerId,
        stake: $rootScope.default_stake,
        profit: 0,
        gameId: gameId,
        matchname: matchName,
      };
      if ($scope.placeTPData.gameType === "-12") {
        $scope.placeTPData.odds = parseFloat($scope.placeTPData.odds) / 100 + 1;
      }
      if (card) {
        if ($rootScope.cards.length < 3) {
          let indexcheck = $rootScope.cards.indexOf(card);
          if (indexcheck == -1) {
            $rootScope.cards.push(card);
            $rootScope.cards = $rootScope.cards.sort((a, b) => a > b);
          }
        }
      }

      if ($rootScope.cards.length != 0) {
        $scope.placeTPData["cards"] = $rootScope.cards;
        $scope.placeTPData.runnerName =
          $scope.placeTPData.runnerName +
          " " +
          $scope.placeTPData.cards.join("");
      }
      $scope.backTeenSlipDataArray.push($scope.placeTPData);
      $scope.backTeenSlipDataArray = $scope.removeDuplicates(
        $scope.backTeenSlipDataArray
      );

      $(".back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3").removeClass("select");
      var element = angular.element(event.currentTarget);
      element.addClass("select");

      // $rootScope.placeTPData_modal = $scope.placeTPData;
      // $rootScope.backTeenSlipDataArray_modal = $scope.backTeenSlipDataArray;

      // console.log($rootScope.placeTPData_modal, "placeBet");
      // console.log($rootScope.backTeenSlipDataArray_modal, "backTeenSlipDataArray");

      /* bet modal show */
      $mdDialog
        .show({
          controller: DialogController,
          templateUrl: "bet.modal.html",
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true,
          fullscreen: false, // Only for -xs, -sm breakpoints.
          locals: {
            placeTPData_modal: $scope.placeTPData,
            backTeenSlipDataArray_modal: $scope.backTeenSlipDataArray,
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
    };
    /* bet modal controller */
    function DialogController(
      $scope,
      $rootScope,
      $mdDialog,
      placeTPData_modal,
      backTeenSlipDataArray_modal
    ) {
      $scope.placeTPData = placeTPData_modal;
      $scope.backTeenSlipDataArray = backTeenSlipDataArray_modal;
      $scope.cancel = function () {
        $scope.removeAllBetSlip();
        $mdDialog.cancel();
      };
      $scope.stakeList = [
        { id: 1, stake: 1000 },
        { id: 2, stake: 5000 },
        { id: 3, stake: 10000 },
        { id: 4, stake: 25000 },
        { id: 5, stake: 50000 },
        { id: 6, stake: 100000 },
        { id: 7, stake: 200000 },
        { id: 8, stake: 500000 },
        { id: 9, stake: 1000000 },
        { id: 10, stake: 2500000 },
      ];

      $scope.submitBet = function () {
        $scope.placeBet();
        $mdDialog.hide();
      };
      $scope.oddsDown = function (placeMarketData) {
        if (placeMarketData.odds == "") {
          return false;
        }
        var odds = parseFloat(placeMarketData.odds);
        if (odds <= 1.01) {
          placeMarketData.odds = 1.01;
        } else {
          placeMarketData.odds = $scope.oddsInput(
            odds - $scope.oddsDiffCalculate(odds)
          );
        }

        placeMarketData.profit = $scope.calcAllProfit(placeMarketData);
        $scope.calcExposure(placeMarketData);
      };
      $scope.oddsUp = function (placeMarketData) {
        if (placeMarketData.odds == "") {
          placeMarketData.odds = 1.01;
        }
        var odds = parseFloat(placeMarketData.odds);
        if (odds >= 1000) {
          placeMarketData.odds = 1000;
        } else {
          placeMarketData.odds = $scope.oddsInput(
            odds + $scope.oddsDiffCalculate(odds)
          );
        }

        placeMarketData.profit = $scope.calcAllProfit(placeMarketData);
        $scope.calcExposure(placeMarketData);
      };
      $scope.oddsDiffCalculate = function (currentOdds) {
        var diff;
        if (currentOdds < 2) {
          diff = 0.01;
        } else if (currentOdds < 3) {
          diff = 0.02;
        } else if (currentOdds < 4) {
          diff = 0.05;
        } else if (currentOdds < 6) {
          diff = 0.1;
        } else if (currentOdds < 10) {
          diff = 0.2;
        } else if (currentOdds < 20) {
          diff = 0.5;
        } else if (currentOdds < 30) {
          diff = 1.0;
        } else {
          diff = 2.0;
        }
        return diff;
      };
      $scope.oddsInput = function (value) {
        return parseFloat(value) > 19.5
          ? parseFloat(value).toFixed(0)
          : parseFloat(value) > 9.5
          ? parseFloat(value).toFixed(1)
          : parseFloat(value).toFixed(2);
      };
      $scope.calcAllProfit = function (placeData) {
        var pnl;
        if (
          (placeData.backlay == "Back" || placeData.backlay == "Lay") &&
          placeData.bookId == undefined
        ) {
          if (placeData.stake != "" && placeData.odds != "") {
            return (pnl = (
              (parseFloat(placeData.odds) - 1) *
              parseFloat(placeData.stake)
            ).toFixed(2));
          } else {
            return (pnl = 0);
          }
        }
        if (
          (placeData.backlay == "Back" || placeData.backlay == "Lay") &&
          placeData.bookId != undefined
        ) {
          if (placeData.bookType == 1) {
            if (placeData.stake != "" && placeData.odds != "") {
              return (pnl = (
                (parseFloat(placeData.odds) * parseFloat(placeData.stake)) /
                100
              ).toFixed(2));
            } else {
              return (pnl = 0);
            }
          } else {
            if (placeData.stake != "" && placeData.odds != "") {
              return (pnl = (
                (parseFloat(placeData.odds) - 1) *
                parseFloat(placeData.stake)
              ).toFixed(2));
            } else {
              return (pnl = 0);
            }
          }
        } else if (placeData.yesno == "Yes" || placeData.yesno == "No") {
          if (
            placeData.stake != "" &&
            placeData.rate != "" &&
            placeData.yesno == "Yes"
          ) {
            return (pnl = (
              (parseFloat(placeData.rate) * parseFloat(placeData.stake)) /
              100
            ).toFixed(2));
            // return pnl=placeData.stake;
          } else if (
            placeData.stake != "" &&
            placeData.rate != "" &&
            placeData.yesno == "No"
          ) {
            return (pnl = (
              (parseFloat(placeData.rate) * parseFloat(placeData.stake)) /
              100
            ).toFixed(2));
          } else {
            return (pnl = 0);
          }
        }
      };
      $scope.calcExposure = function (mktid, bets, remove) {
        if (mktid == undefined) {
          return false;
        }
        try {
          $scope.exposureBook = JSON.parse(
            localStorage.getItem("Exposure_" + mktid)
          );
        } catch (e) {}
        if ($scope.exposureBook == null) {
          return false;
        }
        $scope.ExpoMktid = mktid;
        $scope.bets = bets;
        if (remove == "remove") {
          Object.keys($scope.exposureBook).forEach(function (item) {
            //console.log("value - ",value,"item -",item)

            value = $scope.exposureBook[item];
            $("#exposureAfter_" + item + "").css("display", "none");
            $("#exposureAfter_" + item + "").text(parseFloat(value).toFixed(2));
            if ($("#exposureAfter_" + item + "").hasClass("to-lose"))
              $("#exposureAfter_" + item + "").removeClass("to-lose");
            if ($("#exposureAfter_" + item + "").hasClass("to-win"))
              $("#exposureAfter_" + item + "").removeClass("to-win");
            if (value >= 0) $("#exposureAfter_" + item + "").addClass("to-win");
            else $("#exposureAfter_" + item + "").addClass("to-lose");
          });
        } else {
          Object.keys($scope.exposureBook).forEach(function (item, index) {
            let value = $scope.exposureBook[item];
            $scope.newValue = 0;
            if ($scope.bets.backlay == "back") {
              if (item == $scope.bets.selectionId) {
                $scope.newValue =
                  parseFloat(value) + parseFloat($scope.bets.profit);
                $scope.exposureBook[item] = $scope.newValue;
              } else {
                if ($scope.bets.stake == "") {
                  var betStake = 0;
                } else {
                  betStake = $scope.bets.stake;
                }
                $scope.newValue = parseFloat(value) - parseFloat(betStake);
                $scope.exposureBook[item] = $scope.newValue;
              }
            } else {
              if (item == $scope.bets.selectionId) {
                $scope.newValue =
                  parseFloat(value) - parseFloat($scope.bets.profit);
                $scope.exposureBook[item] = $scope.newValue;
              } else {
                if ($scope.bets.stake == "") {
                  var betStake = 0;
                } else {
                  betStake = $scope.bets.stake;
                }
                $scope.newValue = parseFloat(value) + parseFloat(betStake);
                $scope.exposureBook[item] = $scope.newValue;
              }
            }
          });
          // localStorage.setItem('NewExposure_'+mktid,JSON.stringify($scope.exposureBook))
          Object.keys($scope.exposureBook).forEach(function (item) {
            //console.log("value - ",value,"item -",item)

            let value = $scope.exposureBook[item];
            $("#exposureAfter_" + item + "").css("display", "inline");
            $("#exposureAfter_" + item + "").text(parseFloat(value).toFixed(2));
            if ($("#exposureAfter_" + item + "").hasClass("to-lose"))
              $("#exposureAfter_" + item + "").removeClass("to-lose");
            if ($("#exposureAfter_" + item + "").hasClass("to-win"))
              $("#exposureAfter_" + item + "").removeClass("to-win");
            if (value >= 0) $("#exposureAfter_" + item + "").addClass("to-win");
            else $("#exposureAfter_" + item + "").addClass("to-lose");
          });
        }
        // $timeout.cancel(myBetSlipTimeout);
        // myBetSlipTimeout = $timeout(function() {
        //     $scope.removeAllBetSlip()
        // }, 10000);
      };
      $scope.stakeValue = function (stake, bet, booktype) {
        // console.log(stake)
        if (bet.backlay == "back" || bet.backlay == "lay") {
          var getStake = bet.stake;
          if (getStake == "") {
            getStake = 0;
          }
          var totalStake = parseInt(getStake) + parseInt(stake);
          bet.stake = totalStake;
          var pnl = (parseFloat(bet.odds) - 1) * parseFloat(totalStake);
          bet.profit = pnl.toFixed(2);
          $scope.calculateLiability();
          $scope.calcExposure($scope.ExpoMktid, $scope.bets);
        }

        if (
          (bet.backlay == "backBook" || bet.backlay == "layBook") &&
          booktype == 1
        ) {
          var getStake = bet.stake;
          if (getStake == "") {
            getStake = 0;
          }
          var totalStake = parseInt(getStake) + parseInt(stake);
          bet.stake = totalStake;
          var pnl = (parseFloat(bet.odds) / 100) * parseFloat(totalStake);
          bet.profit = pnl.toFixed(2);
          $scope.calculateLiability();
        } else if (
          (bet.backlay == "backBook" || bet.backlay == "layBook") &&
          booktype == 2
        ) {
          var getStake = bet.stake;
          if (getStake == "") {
            getStake = 0;
          }
          var totalStake = parseInt(getStake) + parseInt(stake);
          bet.stake = totalStake;
          var pnl = (parseFloat(bet.odds) - 1) * parseFloat(totalStake);
          bet.profit = pnl.toFixed(2);
          $scope.calculateLiability();
        }

        if (bet.yesno == "yes" || bet.yesno == "no") {
          var getStake = bet.stake;
          if (getStake == "") {
            getStake = 0;
          }
          var totalStake = parseInt(getStake) + parseInt(stake);
          bet.stake = totalStake;
          var pnl = (parseFloat(bet.rate) * parseFloat(totalStake)) / 100;
          bet.profit = pnl.toFixed(2);
          $scope.calculateLiability();
        }
      };
      $scope.calculateLiability = function () {
        $scope.liabilities = 0.0;
        $scope.liabilityBack = 0.0;
        $scope.liabilityBackBook = 0.0;

        $scope.liabilityYes = 0.0;
        $scope.liabilityLay = 0.0;
        $scope.liabilityLayBook = 0.0;

        $scope.liabilityNo = 0.0;
        $scope.stake = 0;

        angular.forEach($scope.backBetSlipDataArray, function (item) {
          angular.forEach(item.backBetSlipData, function (item) {
            $scope.stake = item.stake;
            if ($scope.stake == "") {
              $scope.stake = 0;
            }
            $scope.liabilityBack = (
              parseFloat($scope.liabilityBack) + parseFloat($scope.stake)
            ).toFixed(2);
          });
          angular.forEach(item.yesBetSlipData, function (item) {
            $scope.stake = item.stake;
            if ($scope.stake == "") {
              $scope.stake = 0;
            }
            $scope.liabilityYes = (
              parseFloat($scope.liabilityYes) + parseFloat($scope.stake)
            ).toFixed(2);
          });
          angular.forEach(item.backBookBetSlipData, function (item) {
            $scope.stake = item.stake;
            if ($scope.stake == "") {
              $scope.stake = 0;
            }
            $scope.liabilityBackBook = (
              parseFloat($scope.liabilityBackBook) + parseFloat($scope.stake)
            ).toFixed(2);
          });
        });
        angular.forEach($scope.layBetSlipDataArray, function (item) {
          angular.forEach(item.layBetSlipData, function (item) {
            $scope.stake = item.stake;
            if ($scope.stake == "") {
              $scope.stake = 0;
            }
            $scope.liabilityLay = (
              parseFloat($scope.liabilityLay) + parseFloat($scope.stake)
            ).toFixed(2);
          });
          angular.forEach(item.noBetSlipData, function (item) {
            $scope.stake = item.stake;
            if ($scope.stake == "") {
              $scope.stake = 0;
            }
            $scope.liabilityNo = (
              parseFloat($scope.liabilityNo) + parseFloat($scope.stake)
            ).toFixed(2);
          });
          angular.forEach(item.layBookBetSlipData, function (item) {
            $scope.stake = item.stake;
            if ($scope.stake == "") {
              $scope.stake = 0;
            }
            $scope.liabilityLayBook = (
              parseFloat($scope.liabilityLayBook) + parseFloat($scope.stake)
            ).toFixed(2);
          });
        });

        if ($scope.liabilityBack == "") {
          $scope.liabilityBack = 0.0;
        }
        if ($scope.liabilityYes == "") {
          $scope.liabilityYes = 0.0;
        }
        if ($scope.liabilityLay == "") {
          $scope.liabilityLay = 0.0;
        }
        if ($scope.liabilityNo == "") {
          $scope.liabilityNo = 0.0;
        }
        if ($scope.liabilityBackBook == "") {
          $scope.liabilityBackBook = 0.0;
        }
        if ($scope.liabilityLayBook == "") {
          $scope.liabilityLayBook = 0.0;
        }
        $scope.liabilities = (
          parseFloat($scope.liabilities) +
          (parseFloat($scope.liabilityBack) +
            parseFloat($scope.liabilityYes) +
            parseFloat($scope.liabilityBackBook) +
            parseFloat($scope.liabilityLay) +
            parseFloat($scope.liabilityNo) +
            parseFloat($scope.liabilityLayBook))
        ).toFixed(2);
        // console.log('$scope.liabilities '+$scope.liabilities)
      };
      $scope.removeDuplicates = function (json_all) {
        var arr = [],
          collection = [];

        $.each(json_all, function (index, value) {
          if ($.inArray(value.matchname, arr) == -1) {
            arr.push(value.matchname);
            collection.push(value);
          }
        });
        return collection;
      };
      $scope.placeBet = function () {
        if ($rootScope.token == undefined || $rootScope.token == null) {
          // Relogin()
          //   toastr.info("Token was expired. Please login to continue.");
          return false;
        }
        // $("#loading_place_bet").css("display", "block");

        $scope.placedButton = true;

        if (
          $scope.backBetSlipDataArray &&
          $scope.backBetSlipDataArray.length >= 1
        ) {
          angular.forEach($scope.backBetSlipDataArray, function (item, key) {
            if (item.backBetSlipData.length >= 1) {
              // $('#loading_place_bet').css('display','block');

              angular.forEach(item.backBetSlipData, function (item2) {
                placeBetFunc(item2, key);
              });
            }
            if (item.yesBetSlipData.length >= 1) {
              // $('.spinner-text').html('Placing bet please wait...');
              angular.forEach(item.yesBetSlipData, function (item2) {
                placeBetFancy(item2, key);
              });
            }
            if (item.backBookBetSlipData.length >= 1) {
              // $('#loading_place_bet').css('display','block');

              angular.forEach(item.backBookBetSlipData, function (item2) {
                placeBookBetFunc(item2, key);
              });
            }
          });
        }

        if (
          $scope.layBetSlipDataArray &&
          $scope.layBetSlipDataArray.length >= 1
        ) {
          angular.forEach($scope.layBetSlipDataArray, function (item, key) {
            if (item.layBetSlipData.length >= 1) {
              // $('#loading_place_bet').css('display','block');

              angular.forEach(item.layBetSlipData, function (item2) {
                placeBetFunc(item2, key);
              });
            }
            if (item.noBetSlipData.length >= 1) {
              // $('.spinner-text').html('Placing bet please wait...');
              angular.forEach(item.noBetSlipData, function (item2) {
                // console.log(item2)
                if (parseInt(item2.rate) == 0 || parseInt(item2.score) == 0) {
                  // $interval.cancel($scope.stopTime);
                  return false;
                }
                placeBetFancy(item2, key);
              });
            }
            if (item.layBookBetSlipData.length >= 1) {
              // $('#loading_place_bet').css('display','block');

              angular.forEach(item.layBookBetSlipData, function (item2) {
                placeBookBetFunc(item2, key);
              });
            }
          });
        }

        if (
          $scope.backTeenSlipDataArray &&
          $scope.backTeenSlipDataArray.length >= 1
        ) {
          angular.forEach($scope.backTeenSlipDataArray, function (item, key) {
            if (item.cards) {
              if (item.cards.length < 3) {
                // toastr.error("Please Select Atleast 3 Cards");
                // $("#loading_place_bet").css("display", "none");
              } else {
                placeTpBet(item, key);
              }
            } else {
              placeTpBet(item, key);
            }
          });
        }
      };
      // function placeTpBet(betData, index) {
      //   var betData1 = {
      //     betType: betData.backlay,
      //     gameType: betData.matchname,
      //     selId: betData.runnerId,
      //     round: +betData.gameId.split(".")[1],
      //     odds: +betData.odds,
      //     stake: +betData.stake,
      //   };
      //   $scope.removeAllBetSlip();
      //   $http({
      //     method: "POST",
      //     url: baseUrl + "/TPplaceBets",
      //     headers: {
      //       Authorization: authtoken,
      //     },
      //     data: betData1,
      //   }).then(
      //     function mySuccess(response) {
      //       debugger;
      //       $scope.placedButton = false;
      //       if (response.data.errorCode == 0) {
      //         // $rootScope.$emit("callExp", {})

      //         // if($location.path()=== "/multi-market"){
      //         //     $rootScope.$emit("callMultiMarketExp", {})
      //         // }
      //         // $scope.displayMsg(response.data);
      //         //   $("#loading_place_bet").css("display", "none");
      //         $("[id^=betslip_open]").addClass("close");
      //         $rootScope.getBalance();
      //         $scope.getAllBets();

      //         setTimeout(() => {
      //           $rootScope.getBalance();
      //           $scope.getAllBets();
      //         }, 1000);
      //         $("#placebet_btn").removeClass("disable");
      //         $("#placebet_btn").prop("disabled", false);
      //         $scope.removeAllBetSlip();
      //         // $scope.getMultiExposureBook()
      //         if (
      //           betData.gameType == 1 ||
      //           betData.gameType == 2 ||
      //           betData.gameType == 6
      //         ) {
      //           $rootScope.ExposureBookTeenPatti(betData.gameId);
      //         }
      //         if (betData.gameType == 5) {
      //           $rootScope.ExposureBookLucky7(betData.gameId);
      //         }
      //         if (betData.gameType == 7) {
      //           $rootScope.AndarBaharExposureBook(betData.gameId);
      //         }
      //       } else {
      //         $scope.removeAllBetSlip();
      //         // $scope.displayMsg(response.data);
      //         //   $("#loading_place_bet").css("display", "none");
      //         $("#placebet_btn").removeClass("disable");
      //         $("#placebet_btn").prop("disabled", false);

      //         //   toastr.error(response.data.errorDescription);
      //       }
      //     },
      //     function myError(error) {
      //       $("#placebet_btn").removeClass("disable");
      //       if (error.status == 401) {
      //         // $.removeCookie("authtoken");
      //         // window.location.href="index.html"
      //       }
      //     }
      //   );
      // }
      $scope.updateStake = function (bet, booktype) {
        if (bet.stake == "") {
          bet.stake = 0.0;
        }
        if (bet.backlay == "back" || bet.backlay == "lay") {
          var odds = bet.odds;
          var pnl = (parseFloat(odds) - 1) * parseFloat(bet.stake);
          bet.profit = pnl.toFixed(2);
          $scope.calcExposure($scope.ExpoMktid, $scope.bets);
        }
        if (bet.backLay == "BACK" || bet.backLay == "LAY") {
          var odds = bet.odds;
          var pnl = (parseFloat(odds) - 1) * parseFloat(bet.stake);
          bet.profit = pnl.toFixed(2);
          $("#profitLiabilityBackUM_" + bet.id + "").text(pnl.toFixed(2));
          $("#profitLiabilityLayUM_" + bet.id + "").text(pnl.toFixed(2));
        }

        if (
          (bet.backlay == "backBook" || bet.backlay == "layBook") &&
          booktype == 1
        ) {
          var odds = bet.odds;
          var pnl = (parseFloat(odds) / 100) * parseFloat(bet.stake);
          bet.profit = pnl.toFixed(2);
        } else {
          var odds = bet.odds;
          var pnl = (parseFloat(odds) - 1) * parseFloat(bet.stake);
          bet.profit = pnl.toFixed(2);
        }

        if (bet.yesno == "yes" || bet.yesno == "no") {
          var rate = bet.rate;
          var pnl = (parseFloat(rate) * parseFloat(bet.stake)) / 100;
          bet.profit = pnl.toFixed(2);
        }

        $scope.calculateLiability();
      };
      $scope.onKeyUp = function (value, backlay, index, parentIndex, id) {
        if (backlay == "back") {
          $scope.backBetSlipDataArray[parentIndex].backBetSlipData[
            index
          ].odds = value;

          var stake =
            $scope.backBetSlipDataArray[parentIndex].backBetSlipData[index]
              .stake;
          if (stake == "") {
            stake = 0;
          }
          var pnl = (parseFloat(value) - 1) * parseFloat(stake);
          $scope.backBetSlipDataArray[parentIndex].backBetSlipData[
            index
          ].profit = pnl.toFixed(2);
        } else if (backlay == "lay") {
          $scope.layBetSlipDataArray[parentIndex].layBetSlipData[
            index
          ].odds = value;

          var stake =
            $scope.layBetSlipDataArray[parentIndex].layBetSlipData[index].stake;
          if (stake == "") {
            stake = 0;
          }
          var pnl = (parseFloat(value) - 1) * parseFloat(stake);
          $scope.layBetSlipDataArray[parentIndex].layBetSlipData[
            index
          ].profit = pnl.toFixed(2);
        }

        if (backlay == "BACK") {
          // $("#oddsBackUM_"+id+"").val(value);
          var stake = $("#inputStakeBackUM_" + id + "").val();
          if (stake == "") {
            stake = 0;
          }
          if (parseFloat($("#oddsBackUM_" + id + "").val()) <= 1.01) {
            $("#oddsBackUM_" + id + "").val(1.01);
          }
          var pnl =
            (parseFloat($("#oddsBackUM_" + id + "").val()) - 1) *
            parseFloat(stake);
          $("#profitLiabilityBackUM_" + id + "").text(pnl.toFixed(2));
        } else if (backlay == "LAY") {
          // $("#oddsLayUM_"+id+"").val(value);
          var stake = $("#inputStakeLayUM_" + id + "").val();
          if (stake == "") {
            stake = 0;
          }
          if (parseFloat($("#oddsLayUM_" + id + "").val()) <= 1.01) {
            $("#oddsLayUM_" + id + "").val(1.01);
          }
          var pnl =
            (parseFloat($("#oddsLayUM_" + id + "").val(value)) - 1) *
            parseFloat(stake);
          $("#profitLiabilityLayUM_" + id + "").text(pnl.toFixed(2));
        }
      };
    }

    $scope.removeAllBetSlip = function (remove) {
      $scope.backBetSlipDataArray = [];
      $scope.layBetSlipDataArray = [];

      $scope.backTeenSlipDataArray = [];

      $scope.backBetSlipList = [];
      $scope.layBetSlipList = [];

      $scope.yesBetSlipList = [];
      $scope.noBetSlipList = [];

      $scope.backBookBetSlipList = [];
      $scope.layBookBetSlipList = [];

      $scope.finalStakeValue = null;
      $scope.calculateLiability();
      $scope.liabilities = "0.00";

      $("#fancyBetMarketList .lay-1").removeClass("select");
      $("#fancyBetMarketList .back-1").removeClass("select");
      $(".matchOddTable .select").removeClass("select");
      $(".back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3").removeClass("select");

      if ($scope.ExpoMktid != undefined) {
        $scope.bets.stake = 0;
        $scope.bets.profit = 0;
        $scope.calcExposure($scope.ExpoMktid, $scope.bets, "remove");
      }
      if (remove == undefined) {
        // console.log($scope.ExpoMktid)
        if ($scope.ExpoMktid != undefined) {
          $scope.bets.stake = 0;
          $scope.bets.profit = 0;
        }
        $scope.calcExposure($scope.ExpoMktid, $scope.bets, "remove");
      }
      $scope.placeTPData = {};
      if (!remove && $rootScope.cards) {
        $rootScope.cards = [];
        $('.tpjudgement img').removeClass('selected');
      }
    };

    $scope.calculateLiability = function () {
      $scope.liabilities = 0.0;
      $scope.liabilityBack = 0.0;
      $scope.liabilityBackBook = 0.0;

      $scope.liabilityYes = 0.0;
      $scope.liabilityLay = 0.0;
      $scope.liabilityLayBook = 0.0;

      $scope.liabilityNo = 0.0;
      $scope.stake = 0;

      angular.forEach($scope.backBetSlipDataArray, function (item) {
        angular.forEach(item.backBetSlipData, function (item) {
          $scope.stake = item.stake;
          if ($scope.stake == "") {
            $scope.stake = 0;
          }
          $scope.liabilityBack = (
            parseFloat($scope.liabilityBack) + parseFloat($scope.stake)
          ).toFixed(2);
        });
        angular.forEach(item.yesBetSlipData, function (item) {
          $scope.stake = item.stake;
          if ($scope.stake == "") {
            $scope.stake = 0;
          }
          $scope.liabilityYes = (
            parseFloat($scope.liabilityYes) + parseFloat($scope.stake)
          ).toFixed(2);
        });
        angular.forEach(item.backBookBetSlipData, function (item) {
          $scope.stake = item.stake;
          if ($scope.stake == "") {
            $scope.stake = 0;
          }
          $scope.liabilityBackBook = (
            parseFloat($scope.liabilityBackBook) + parseFloat($scope.stake)
          ).toFixed(2);
        });
      });
      angular.forEach($scope.layBetSlipDataArray, function (item) {
        angular.forEach(item.layBetSlipData, function (item) {
          $scope.stake = item.stake;
          if ($scope.stake == "") {
            $scope.stake = 0;
          }
          $scope.liabilityLay = (
            parseFloat($scope.liabilityLay) + parseFloat($scope.stake)
          ).toFixed(2);
        });
        angular.forEach(item.noBetSlipData, function (item) {
          $scope.stake = item.stake;
          if ($scope.stake == "") {
            $scope.stake = 0;
          }
          $scope.liabilityNo = (
            parseFloat($scope.liabilityNo) + parseFloat($scope.stake)
          ).toFixed(2);
        });
        angular.forEach(item.layBookBetSlipData, function (item) {
          $scope.stake = item.stake;
          if ($scope.stake == "") {
            $scope.stake = 0;
          }
          $scope.liabilityLayBook = (
            parseFloat($scope.liabilityLayBook) + parseFloat($scope.stake)
          ).toFixed(2);
        });
      });

      if ($scope.liabilityBack == "") {
        $scope.liabilityBack = 0.0;
      }
      if ($scope.liabilityYes == "") {
        $scope.liabilityYes = 0.0;
      }
      if ($scope.liabilityLay == "") {
        $scope.liabilityLay = 0.0;
      }
      if ($scope.liabilityNo == "") {
        $scope.liabilityNo = 0.0;
      }
      if ($scope.liabilityBackBook == "") {
        $scope.liabilityBackBook = 0.0;
      }
      if ($scope.liabilityLayBook == "") {
        $scope.liabilityLayBook = 0.0;
      }
      $scope.liabilities = (
        parseFloat($scope.liabilities) +
        (parseFloat($scope.liabilityBack) +
          parseFloat($scope.liabilityYes) +
          parseFloat($scope.liabilityBackBook) +
          parseFloat($scope.liabilityLay) +
          parseFloat($scope.liabilityNo) +
          parseFloat($scope.liabilityLayBook))
      ).toFixed(2);
      // console.log('$scope.liabilities '+$scope.liabilities)
    };
    $scope.removeDuplicates = function (json_all) {
      var arr = [],
        collection = [];

      $.each(json_all, function (index, value) {
        if ($.inArray(value.matchname, arr) == -1) {
          arr.push(value.matchname);
          collection.push(value);
        }
      });
      return collection;
    };
    $scope.stakeValue = function (stake, bet, booktype) {
      // console.log(stake)
      if (bet.backlay == "back" || bet.backlay == "lay") {
        var getStake = bet.stake;
        if (getStake == "") {
          getStake = 0;
        }
        var totalStake = parseInt(getStake) + parseInt(stake);
        bet.stake = totalStake;
        var pnl = (parseFloat(bet.odds) - 1) * parseFloat(totalStake);
        bet.profit = pnl.toFixed(2);
        $scope.calculateLiability();
        $scope.calcExposure($scope.ExpoMktid, $scope.bets);
      }

      if (
        (bet.backlay == "backBook" || bet.backlay == "layBook") &&
        booktype == 1
      ) {
        var getStake = bet.stake;
        if (getStake == "") {
          getStake = 0;
        }
        var totalStake = parseInt(getStake) + parseInt(stake);
        bet.stake = totalStake;
        var pnl = (parseFloat(bet.odds) / 100) * parseFloat(totalStake);
        bet.profit = pnl.toFixed(2);
        $scope.calculateLiability();
      } else if (
        (bet.backlay == "backBook" || bet.backlay == "layBook") &&
        booktype == 2
      ) {
        var getStake = bet.stake;
        if (getStake == "") {
          getStake = 0;
        }
        var totalStake = parseInt(getStake) + parseInt(stake);
        bet.stake = totalStake;
        var pnl = (parseFloat(bet.odds) - 1) * parseFloat(totalStake);
        bet.profit = pnl.toFixed(2);
        $scope.calculateLiability();
      }

      if (bet.yesno == "yes" || bet.yesno == "no") {
        var getStake = bet.stake;
        if (getStake == "") {
          getStake = 0;
        }
        var totalStake = parseInt(getStake) + parseInt(stake);
        bet.stake = totalStake;
        var pnl = (parseFloat(bet.rate) * parseFloat(totalStake)) / 100;
        bet.profit = pnl.toFixed(2);
        $scope.calculateLiability();
      }
    };
    $scope.placeBet = function () {
      if ($rootScope.token == undefined || $rootScope.token == null) {
        // Relogin()
        //   toastr.info("Token was expired. Please login to continue.");
        return false;
      }
      // $("#loading_place_bet").css("display", "block");

      $scope.placedButton = true;

      if ($scope.backBetSlipDataArray.length >= 1) {
        angular.forEach($scope.backBetSlipDataArray, function (item, key) {
          if (item.backBetSlipData.length >= 1) {
            // $('#loading_place_bet').css('display','block');

            angular.forEach(item.backBetSlipData, function (item2) {
              placeBetFunc(item2, key);
            });
          }
          if (item.yesBetSlipData.length >= 1) {
            // $('.spinner-text').html('Placing bet please wait...');
            angular.forEach(item.yesBetSlipData, function (item2) {
              placeBetFancy(item2, key);
            });
          }
          if (item.backBookBetSlipData.length >= 1) {
            // $('#loading_place_bet').css('display','block');

            angular.forEach(item.backBookBetSlipData, function (item2) {
              placeBookBetFunc(item2, key);
            });
          }
        });
      }

      if ($scope.layBetSlipDataArray.length >= 1) {
        angular.forEach($scope.layBetSlipDataArray, function (item, key) {
          if (item.layBetSlipData.length >= 1) {
            // $('#loading_place_bet').css('display','block');

            angular.forEach(item.layBetSlipData, function (item2) {
              placeBetFunc(item2, key);
            });
          }
          if (item.noBetSlipData.length >= 1) {
            // $('.spinner-text').html('Placing bet please wait...');
            angular.forEach(item.noBetSlipData, function (item2) {
              // console.log(item2)
              if (parseInt(item2.rate) == 0 || parseInt(item2.score) == 0) {
                // $interval.cancel($scope.stopTime);
                return false;
              }
              placeBetFancy(item2, key);
            });
          }
          if (item.layBookBetSlipData.length >= 1) {
            // $('#loading_place_bet').css('display','block');

            angular.forEach(item.layBookBetSlipData, function (item2) {
              placeBookBetFunc(item2, key);
            });
          }
        });
      }

      if ($scope.backTeenSlipDataArray.length >= 1) {
        angular.forEach($scope.backTeenSlipDataArray, function (item, key) {
          if (item.cards) {
            if (item.cards.length < 3) {
              // toastr.error("Please Select Atleast 3 Cards");
              // $("#loading_place_bet").css("display", "none");
            } else {
              placeTpBet(item, key);
            }
          } else {
            placeTpBet(item, key);
          }
        });
      }
    };
    $scope.calcExposure = function (mktid, bets, remove) {
      if (mktid == undefined) {
        return false;
      }
      try {
        $scope.exposureBook = JSON.parse(
          localStorage.getItem("Exposure_" + mktid)
        );
      } catch (e) {}
      if ($scope.exposureBook == null) {
        return false;
      }
      $scope.ExpoMktid = mktid;
      $scope.bets = bets;
      if (remove == "remove") {
        Object.keys($scope.exposureBook).forEach(function (item) {
          //console.log("value - ",value,"item -",item)

          value = $scope.exposureBook[item];
          $("#exposureAfter_" + item + "").css("display", "none");
          $("#exposureAfter_" + item + "").text(parseFloat(value).toFixed(2));
          if ($("#exposureAfter_" + item + "").hasClass("to-lose"))
            $("#exposureAfter_" + item + "").removeClass("to-lose");
          if ($("#exposureAfter_" + item + "").hasClass("to-win"))
            $("#exposureAfter_" + item + "").removeClass("to-win");
          if (value >= 0) $("#exposureAfter_" + item + "").addClass("to-win");
          else $("#exposureAfter_" + item + "").addClass("to-lose");
        });
      } else {
        Object.keys($scope.exposureBook).forEach(function (item, index) {
          let value = $scope.exposureBook[item];
          $scope.newValue = 0;
          if ($scope.bets.backlay == "back") {
            if (item == $scope.bets.selectionId) {
              $scope.newValue =
                parseFloat(value) + parseFloat($scope.bets.profit);
              $scope.exposureBook[item] = $scope.newValue;
            } else {
              if ($scope.bets.stake == "") {
                var betStake = 0;
              } else {
                betStake = $scope.bets.stake;
              }
              $scope.newValue = parseFloat(value) - parseFloat(betStake);
              $scope.exposureBook[item] = $scope.newValue;
            }
          } else {
            if (item == $scope.bets.selectionId) {
              $scope.newValue =
                parseFloat(value) - parseFloat($scope.bets.profit);
              $scope.exposureBook[item] = $scope.newValue;
            } else {
              if ($scope.bets.stake == "") {
                var betStake = 0;
              } else {
                betStake = $scope.bets.stake;
              }
              $scope.newValue = parseFloat(value) + parseFloat(betStake);
              $scope.exposureBook[item] = $scope.newValue;
            }
          }
        });
        // localStorage.setItem('NewExposure_'+mktid,JSON.stringify($scope.exposureBook))
        Object.keys($scope.exposureBook).forEach(function (item) {
          //console.log("value - ",value,"item -",item)

          let value = $scope.exposureBook[item];
          $("#exposureAfter_" + item + "").css("display", "inline");
          $("#exposureAfter_" + item + "").text(parseFloat(value).toFixed(2));
          if ($("#exposureAfter_" + item + "").hasClass("to-lose"))
            $("#exposureAfter_" + item + "").removeClass("to-lose");
          if ($("#exposureAfter_" + item + "").hasClass("to-win"))
            $("#exposureAfter_" + item + "").removeClass("to-win");
          if (value >= 0) $("#exposureAfter_" + item + "").addClass("to-win");
          else $("#exposureAfter_" + item + "").addClass("to-lose");
        });
      }
      // $timeout.cancel(myBetSlipTimeout);
      // myBetSlipTimeout = $timeout(function() {
      //     $scope.removeAllBetSlip()
      // }, 10000);
    };
    function placeTpBet(betData, index) {
      var betData1 = {
        betType: betData.backlay,
        gameType: betData.matchname,
        selId: betData.runnerId,
        round: +betData.gameId.split(".")[1],
        odds: +betData.odds,
        stake: +betData.stake,
        cards: $rootScope.cards
      };
      $scope.removeAllBetSlip();
      $http({
        method: "POST",
        url: baseUrl + "/TPplaceBets",
        headers: {
          Authorization: authtoken,
        },
        data: betData1,
      }).then(
        function mySuccess(response) {
          $scope.placedButton = false;
          if (response.data.errorCode == 0) {
            // $rootScope.$emit("callExp", {})

            // if($location.path()=== "/multi-market"){
            //     $rootScope.$emit("callMultiMarketExp", {})
            // }
            $scope.displayMsg(response.data);
            //   $("#loading_place_bet").css("display", "none");
            // $("#betslip_open").addClass("close");
            $scope.refreshFunds();
            $scope.getAllBets();

            setTimeout(() => {
              $scope.refreshFunds();
              $scope.getAllBets();
            }, 1000);
            $("#placebet_btn").removeClass("disable");
            $("#placebet_btn").prop("disabled", false);
            $scope.removeAllBetSlip();
            // $scope.getMultiExposureBook()
            if (
              betData.gameType == 1 ||
              betData.gameType == 2 ||
              betData.gameType == 6
            ) {
              $rootScope.ExposureBookTeenPatti(betData.gameId);
            }
            if (betData.gameType == 5) {
              $rootScope.ExposureBookLucky7(betData.gameId);
            }
            if (betData.gameType == 7) {
              $rootScope.AndarBaharExposureBook(betData.gameId);
            }
          } else {
            $scope.removeAllBetSlip();
            $scope.displayMsg(response.data);
            //   $("#loading_place_bet").css("display", "none");
            $("#placebet_btn").removeClass("disable");
            $("#placebet_btn").prop("disabled", false);

            //   toastr.error(response.data.errorDescription);
          }
        },
        function myError(error) {
          $("#placebet_btn").removeClass("disable");
          if (error.status == 401) {
            // $.removeCookie("authtoken");
            // window.location.href="index.html"
          }
        }
      );
    }

    $scope.oddsDown = function (placeMarketData) {
      if (placeMarketData.odds == "") {
        return false;
      }
      var odds = parseFloat(placeMarketData.odds);
      if (odds <= 1.01) {
        placeMarketData.odds = 1.01;
      } else {
        placeMarketData.odds = $scope.oddsInput(
          odds - $scope.oddsDiffCalculate(odds)
        );
      }

      placeMarketData.profit = $scope.calcAllProfit(placeMarketData);
      $scope.calcExposure(placeMarketData);
    };
    $scope.oddsUp = function (placeMarketData) {
      if (placeMarketData.odds == "") {
        placeMarketData.odds = 1.01;
      }
      var odds = parseFloat(placeMarketData.odds);
      if (odds >= 1000) {
        placeMarketData.odds = 1000;
      } else {
        placeMarketData.odds = $scope.oddsInput(
          odds + $scope.oddsDiffCalculate(odds)
        );
      }

      placeMarketData.profit = $scope.calcAllProfit(placeMarketData);
      $scope.calcExposure(placeMarketData);
    };
    $scope.oddsInput = function (value) {
      return parseFloat(value) > 19.5
        ? parseFloat(value).toFixed(0)
        : parseFloat(value) > 9.5
        ? parseFloat(value).toFixed(1)
        : parseFloat(value).toFixed(2);
    };

    $scope.stakeDown = function (placeData) {
      if (placeData.stake == "") {
        return false;
      }
      var stake = parseInt(placeData.stake);
      if (stake < 1) {
        placeData.stake = "";
      } else {
        placeData.stake = stake - $scope.stakeDiffCal(stake);
      }

      placeData.profit = $scope.calcAllProfit(placeData);
      $scope.calcExposure(placeData);
    };
    $scope.stakeUp = function (placeData) {
      if (placeData.stake == "") {
        placeData.stake = 1;
      }
      var stake = parseInt(placeData.stake);
      if (stake >= 100000000) {
        placeData.stake = 100000000;
      } else {
        placeData.stake = stake + $scope.stakeDiffCal(stake);
      }

      placeData.profit = $scope.calcAllProfit(placeData);
      $scope.calcExposure(placeData);
    };
    $scope.calcAllProfit = function (placeData) {
      var pnl;
      if (
        (placeData.backlay == "Back" || placeData.backlay == "Lay") &&
        placeData.bookId == undefined
      ) {
        if (placeData.stake != "" && placeData.odds != "") {
          return (pnl = (
            (parseFloat(placeData.odds) - 1) *
            parseFloat(placeData.stake)
          ).toFixed(2));
        } else {
          return (pnl = 0);
        }
      }
      if (
        (placeData.backlay == "Back" || placeData.backlay == "Lay") &&
        placeData.bookId != undefined
      ) {
        if (placeData.bookType == 1) {
          if (placeData.stake != "" && placeData.odds != "") {
            return (pnl = (
              (parseFloat(placeData.odds) * parseFloat(placeData.stake)) /
              100
            ).toFixed(2));
          } else {
            return (pnl = 0);
          }
        } else {
          if (placeData.stake != "" && placeData.odds != "") {
            return (pnl = (
              (parseFloat(placeData.odds) - 1) *
              parseFloat(placeData.stake)
            ).toFixed(2));
          } else {
            return (pnl = 0);
          }
        }
      } else if (placeData.yesno == "Yes" || placeData.yesno == "No") {
        if (
          placeData.stake != "" &&
          placeData.rate != "" &&
          placeData.yesno == "Yes"
        ) {
          return (pnl = (
            (parseFloat(placeData.rate) * parseFloat(placeData.stake)) /
            100
          ).toFixed(2));
          // return pnl=placeData.stake;
        } else if (
          placeData.stake != "" &&
          placeData.rate != "" &&
          placeData.yesno == "No"
        ) {
          return (pnl = (
            (parseFloat(placeData.rate) * parseFloat(placeData.stake)) /
            100
          ).toFixed(2));
        } else {
          return (pnl = 0);
        }
      }
    };
    $scope.typingSign = function (type, placeData) {
      if (type == "odds") {
        // $scope.oddsTyping=!$scope.oddsTyping;
        $scope.oddsTyping = true;
        $scope.stakeTyping = !$scope.oddsTyping;
        placeData.odds = "";
      } else {
        // $scope.stakeTyping=!$scope.stakeTyping;
        $scope.oddsTyping = false;
        $scope.stakeTyping = !$scope.oddsTyping;
        placeData.stake = "";
      }
      placeData.profit = $scope.calcAllProfit(placeData);
      $scope.calcExposure(placeData);
    };

    /* current un-using part */
    $rootScope.settingsData = {
      betStake: {
        stake1: 1000,
        // "stake10":1000000,
        stake2: 2000,
        stake3: 5000,
        stake4: 10000,
        stake5: 25000,
        stake6: 50000,
        // "stake7":50000,
        // "stake8":100000,
        // "stake9":500000
      },
      defaultStake: 100,
      isOddsHighlights: 1,
    };
    $scope.cancelBetslip = function (remove) {
      $(".back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3").removeClass("select");
      if ($scope.placeMarketData != null) {
        $scope.calcExposure($scope.placeMarketData, "remove");
      }
      if ($scope.placeFancyData != null) {
        $scope.calcExposure($scope.placeFancyData, "remove");
      }
      if ($scope.placeBookData != null) {
        $scope.calcExposure($scope.placeBookData, "remove");
      }
      if ($scope.placeTPData != null) {
        $scope.calcExposure($scope.placeTPData, "remove");
      }
      if (remove == false) {
        $rootScope.cards = [];
      }
      $scope.placeMarketData = null;
      $scope.placeFancyData = null;
      $scope.placeBookData = null;
      $scope.placeTPData = null;
      $scope.selectedBet = null;
    };
    $scope.cancelTPBetslip = function (gameId, remove) {
      if ($scope.placeTPData != null) {
        $scope.calcExposure($scope.placeTPData, "remove");
      }
      $("#betBoard_" + gameId + "_1").css("display", "none");
      $("#betBoard_" + gameId + "_0").css("display", "none");
      if (remove == false) {
        $rootScope.cards = [];
      }
      $scope.placeTPData = null;
    };
    $scope.stakeChange = function (buttonStake, placeData) {
      if (placeData.stake == "") {
        placeData.stake = 0;
      }
      var stake = parseInt(placeData.stake);
      if (stake >= 100000000) {
        placeData.stake = 100000000;
      } else {
        placeData.stake = stake + buttonStake;
      }

      placeData.profit = $scope.calcAllProfit(placeData);
      $scope.calcExposure(placeData);
    };

    // $scope.openTpBetSlip = function(event, backlay, odds, runnerName, runnerId, gameId, gameType, runnerIndex, card) {
    // 	console.log(event, backlay, odds, runnerName, runnerId, gameId, gameType, runnerIndex, card);
    // 	$scope.cancelBetslip();
    // 	$scope.cancelTPBetslip(gameId)
    // 	$(".back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3").removeClass("select");
    // 	var element = angular.element(event.currentTarget);
    // 	element.addClass("select");

    // 	$scope.placeTPData = {
    // 		backlay: backlay,
    // 		gameType: gameType,
    // 		info: $rootScope.info,
    // 		odds: odds,
    // 		runnerName: runnerName,
    // 		runnerId: runnerId,
    // 		source: context,
    // 		stake: $rootScope.settingsData.defaultStake,
    // 		profit: 0,
    // 		gameId: gameId,
    // 	};

    // 	$scope.placeTPData.profit = $scope.calcAllProfit($scope.placeTPData);
    // 	if (card) {
    // 		if ($rootScope.cards.length < 3) {
    // 			let indexcheck = $rootScope.cards.indexOf(card);
    // 			if (indexcheck == -1) {
    // 				$rootScope.cards.push(card);
    // 			}
    // 		}
    // 	}

    // 	if ($rootScope.cards.length != 0) {
    // 		$scope.placeTPData['cards'] = $rootScope.cards;
    // 		$scope.placeTPData.runnerName = $scope.placeTPData.runnerName + ' ' + $scope.placeTPData.cards.toString().replace(/,/g, '');
    // 	}
    // 	// console.log($scope.placeTPData);

    // 	$scope.calcExposure($scope.placeTPData);
    // 	$("#betBoard_" + gameId + "_" + runnerIndex).css("display", "block");

    // };
  }
);
