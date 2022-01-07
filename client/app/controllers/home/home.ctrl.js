var currTime;
angular
  .module("myApp")
  .controller(
    "homeController",
    function (
      $location,
      $scope,
      $http,
      $timeout,
      $routeParams,
      $interval,
      $rootScope,
      $filter,
      $window,
      $cookies,
      gamesService
    ) {
      $rootScope.clearCookies = function () {
        $cookies.remove("authtoken", { path: "/" });
        $cookies.remove("current_client", { path: "/" });
        $rootScope.authcookie = null;
        authtoken = null;
        $window.location.href = "index.html";
      };

      $rootScope.authcookie = $.cookie("authtoken");
      let authtoken = $rootScope.authcookie;
      // if ($.cookie("authtoken")) {
      // } else {
      //   $rootScope.clearCookies();
      // }

      let user = $.cookie("current_client");
      if (!!user) {
        $rootScope.currentUser = JSON.parse(user);
      }
      $("#tabMenu li a").removeClass("select");
      if (!$('a[href="#!"]').hasClass("select")) {
        $('a[href="#!"]').addClass("select");
        $rootScope.inplaydiv = false;
        $rootScope.isCasinoPage = false;
        $rootScope.mainfooter = false;
      }
      $scope.pathList = [];
      $scope.events = [];

      $scope.Inplaymenu = function () {
        $rootScope.inplaydiv = true;
        $rootScope.mainfooter = true;
      };
      $scope.Casinomenu = function () {
        $rootScope.isCasinoPage = true;
      };

      $(document).keydown(function (event) {
        if (event.keyCode == 123) {
          // Prevent F12
          return false;
        } else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) {
          // Prevent Ctrl+Shift+I
          return false;
        }
      });

      $("#loading_page").css("display", "grid");
      $rootScope.$on(
        "$routeChangeSuccess",
        function (event, current, previous) {
          $rootScope.title = current.$$route.data.title;
        }
      );
      document.onkeydown = function (e) {
        e = e || window.event;
        var key = e.which || e.keyCode;
        if (key === 13) {
          // $scope.login();
        }
      };

      $scope.CloseRulesPopUp = function () {
        $("#rules_modal").css("display", "none");
      };

      $scope.findDatafromArr = function (arr, fieldName, filterTerm) {
        return arr.filter(
          (it) => it[fieldName].toString() === filterTerm.toString()
        );
      };

      $scope.findKeysfromArr = function (arr, fieldName) {
        var keys = [];
        angular.forEach(arr, function (it, index) {
          key = it[fieldName];
          if (keys.findIndex((k) => k === key) < 0) {
            keys.push(key);
          }
        });
        return keys;
      };

      $scope.rules_state = false;
      $scope.rules = "";
      $scope.ticker = [];
      $scope.tickerLength = 15;
      $scope.captchaLog = "";
      $scope.loginCalls = true;
      $scope.showLoginDetails = true;
      getCaptchaImage = function () {
        $http({
          method: "GET",
          url: baseUrl + "/img.png",
          headers: {
            "Content-Type": "application/json",
          },
        }).then(function success(response) {
          if (response.data) {
            $("#authenticateImage").css("visibility", "visible");
            $("#authenticateImage").attr(
              "src",
              "data:image/jpeg;base64, " + response.data.img
            );
            $scope.captchaLog = response.data.log;
          }
        });
      };
      $scope.login = function () {
        if ($scope.username2 == undefined || $scope.username2 == "") {
          toastr.error("Username can not be blank!");
          return false;
        }
        if ($scope.password2 == undefined || $scope.password2 == "") {
          toastr.error("Password can not be blank!");
          return false;
        }
        if ($scope.Popcaptcha2 == "" || $scope.Popcaptcha2 == undefined) {
          toastr.error("Captcha is mandatory");
          return false;
        }

        $scope.result = "";

        $scope.loginData = {
          captcha: $scope.Popcaptcha2,
          log: $scope.captchaLog,
          userName: $scope.username2,
          password: $scope.password2,
        };

        if ($scope.Popcaptcha2 != null && $scope.Popcaptcha2 != "") {
          $http({
            url: baseUrl + "/login",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify($scope.loginData),
          }).then(
            function success(response) {
              if (response.data.errorCode === 0) {
                toastr.success("You have successfully logged in.");
                $rootScope.currentUser = response.data.result[0];
                var currentUser = $rootScope.currentUser;
                $.cookie("current_client", JSON.stringify(currentUser), {
                  path: "/",
                });
                $rootScope.userName = currentUser.userName;
                var date = new Date();
                date.setTime(date.getTime() + 60 * 60 * 1000); // Expires in an hr
                $.cookie("authtoken", response.data.result[0].token, {
                  expires: date,
                  path: "/",
                });
                authtoken = response.data.result[0].token;
                localStorage.clear();
                $scope.showLoginDetails = false;
                // Check Rules Messages
                window.location.href = "/";
                if (response.data.result[0].rules) {
                  $("#rules_modal").css("display", "block");
                  $scope.rules = atob(response.data.result[0].rules);
                } else {
                }
                $scope.getBalance();
              } else {
                toastr.error(response.data.errorDescription);
                getCaptchaImage();
                $scope.showLoginDetails = false;
              }
            },
            function error(error) {
              $scope.showLoginDetails = true;
            }
          );
        }
      };
      $scope.confirmRules = function () {
        $scope.CloseRulesPopUp();
        window.location.href = "/";
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
        getCaptchaImage();
      });

      $rootScope.getTicker = function () {
        $scope.scoreUrl = baseUrl + "/getTicker";
        $http({
          url: $scope.scoreUrl,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: authtoken,
          },
        }).then(function success(res) {
          console.log(res.data.result);
          if (res.data.errorCode === 0) {
            let tickerLength = 0;
            $scope.ticker = res.data.result;
            $scope.ticker
              .filter((tick) => {
                return tick.active;
              })
              .map((tick) => {
                tickerLength += tick.ticker.length;
                tick.ticker = atob(tick.ticker);
              });
            if (tickerLength > 100) {
              console.log(tickerLength);
              $scope.tickerLength = tickerLength / 10;
              console.log($scope.tickerLength);
            }
          }
        });
      };

      $rootScope.getTicker();

      // $rootScope.getScore = function (matchBfId) {
      //     // https://ips.betfair.com/inplayservice/v1/scores?regionCode=UK&_ak=dyMLAanpRyIsjkpJ&alt=json&locale=en_GB&eventIds=29134308
      //     if (matchBfId != undefined) {
      //         $scope.scoreUrl = 'https://ips.betfair.com/inplayservice/v1/eventTimelines?regionCode=UK&_ak=dyMLAanpRyIsjkpJ&alt=json&locale=de&eventIds=' + matchBfId;
      //         $http({
      //             url: $scope.scoreUrl,
      //             method: "GET"
      //         }).then(function success(data) {
      //             return data.data[0];
      //             // console.log($scope.fullScore,"scoreboard")
      //         });
      //     }
      // }

      $scope.showSportList = true;
      $scope.show_close = true;
      $rootScope.sportsData = {};

      var EventTypeIds = {
        cricket: {
          id: 2,
          bfId: 4,
          title: "Cricket",
        },
        soccer: {
          id: 3,
          bfId: 1,
          title: "Soccer",
        },
        tennis: {
          id: 1,
          bfId: 2,
          title: "Tennis",
        },
        horseRacingToday: {
          id: 4,
          bfId: 7.1,
          title: "Horse Racing Today's Card",
        },
        greyhoundRacingToday: {
          id: 5,
          bfId: 4339.1,
          title: "Greyhound Racing Today's Card",
        },
        horseRacing: {
          id: 6,
          bfId: 7.2,
          title: "Horse Racing",
        },
        greyhoundRacing: {
          id: 7,
          bfId: 4339.2,
          title: "Greyhound Racing",
        },
      };

      var sportIdMap = {
        7.1: {
          id: 4,
          bfId: 7.1,
          title: "Horse Racing Today's Card",
        },
        4339.1: {
          id: 5,
          bfId: 4339.1,
          title: "Greyhound Racing Today's Card",
        },
        7.2: {
          id: 6,
          bfId: 7.2,
          title: "Horse Racing",
        },
        4339.2: {
          id: 7,
          bfId: 4339.2,
          title: "Greyhound Racing",
        },
      };

      $rootScope.SportsList = function () {
        let req;
        if (authtoken != null && authtoken != undefined) {
          req = $http({
            url: baseUrl + "/listGames",
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: authtoken,
            },
          })
        } else {
          req = $http({
            url: baseUrl + "/listGames",
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })
        }
        req.then(
          function mySuccess(response) {
            if (response.data.errorCode === 0) {
              var events = response.data.result;
              events = response.data.result.filter(
                (e) => parseInt(e.eventTypeId, 10) > 0
              );
              $scope.events = events;

              var result = {
                _allinfo: null,
                _multimkt: null,
                _userAvgmatchedBets: null,
                _userMatchedBets: null,
                _userUnMatchedBets: null,
                description: {
                  result: null,
                  status: "Failed",
                },
                news: null,
              };
              var sportsData = [];
              var sportsName = $scope.findKeysfromArr(
                $scope.events,
                "sportsName"
              );
              angular.forEach(sportsName, function (sportName, index) {
                var sport = {
                  id: EventTypeIds[sportName].id,
                  img: null,
                  bfId: EventTypeIds[sportName].bfId,
                  tournaments: [],
                  name: EventTypeIds[sportName].title,
                };
                var competitionIds = [];
                angular.forEach(events, function (it, index) {
                  if (it.sportsName === sportName) {
                    key = it["competitionId"];
                    if (competitionIds.findIndex((k) => k === key) < 0) {
                      competitionIds.push(key);
                    }
                  }
                });

                angular.forEach(
                  competitionIds,
                  function (competitionId, index2) {
                    var competition = $scope.findDatafromArr(
                      events,
                      "competitionId",
                      competitionId
                    )[0];
                    var tournament = {
                      id: index2,
                      bfId: competition.competitionId,
                      name: competition.competitionName,
                      matches: [],
                    };
                    angular.forEach(events, function (event, index3) {
                      if (event.competitionId === competitionId) {
                        var match = {
                          bfId: event.eventId,
                          inPlay: event.isInPlay,
                          startDate: event.time,
                          name: event.eventName,
                          port: event.port,
                          id: event.id,
                          status: event.status === 0 ? "OPEN" : "CLOSE",
                          tv: event.tv,
                          isFancy: event.isFancy,
                          activeStatus: event.isFancy,
                          totalMatched: event.totalMatched,
                          tvPid: event.tvPid,
                          tvMapid: event.tvMapid,
                          bet: event.bet,
                          usersOnline: event.usersOnline,
                          noOfBets: event.noOfBets,
                          session: event.session,
                          unmatched: event.unmatched,
                          markets: [],
                        };
                        angular.forEach(
                          event.markets,
                          function (market, index4) {
                            match.markets.push({
                              name: market.marketName,
                              id: market.gameId,
                              bfId: market.marketId,
                              betDelay: market.betDelay,
                              runnerData: {
                                runner1Name: market.runners[0],
                                runner2Name: market.runners[1],
                              },
                              status: market.open === 1 ? "OPEN" : "",
                            });
                          }
                        );
                        tournament.matches.push(match);
                      }
                    });
                    sport.tournaments.push(tournament);
                  }
                );
                sportsData.push(sport);
              });
              result.sportsData = sportsData;
              var home = result;
              $rootScope.curTime = home.curTime;
              $scope.sport = $rootScope.sportlistwise();
              $scope.sprtdata = home.sportsData;
              $scope.homeSignalrFormat(home.sportsData);
              $scope.homesportdata = home.sportsData;
              $scope.Allmatches = $scope.Searchwisedata();
              $rootScope.fancyBook = home._fancyBook;
              $scope.highlightsData = $scope.highlightwisedata();
              console.log($rootScope.sportsData, $scope.highlightsData);
            }
          },
          function error() {
            $rootScope.matchDataHome = {};
            $scope.events = [];
            $scope.Highlightlist = [];
            setTimeout(function () {
              $rootScope.SportsList();
            }, 1000);
          }
        );
      };

      $rootScope.getOtherGames = function () {
        gamesService.horseRacingGamesToday().then((response) => {
          if (response.data && response.data.length) {
            $rootScope.formatOtherGames(response.data, 7, 1);
          }
        });

        gamesService.greyhoundGamesToday().then((response) => {
          if (response.data && response.data.length) {
            $rootScope.formatOtherGames(response.data, 4339, 1);
          }
        });

        gamesService.horseRacingGamesTomorrow().then((response) => {
          if (response.data && response.data.length) {
            $rootScope.formatOtherGames(response.data, 7, 2);
          }
        });

        gamesService.greyhoundGamesTomorrow().then((response) => {
          if (response.data && response.data.length) {
            $rootScope.formatOtherGames(response.data, 4339, 2);
          }
        });
      };

      $rootScope.formatOtherGames = function (otherGames, sportId, day) {
        let sportCountries = $rootScope.activatedRaces[sportId]? $rootScope.activatedRaces[sportId]: [];
        if (!otherGames) {
          return;
        }

        if (authtoken && sportCountries) {
          otherGames = otherGames.filter((e) => {
            return sportCountries.includes(e.countryCode)
          })
        }
        let sportIds = $scope.findKeysfromArr(otherGames, "eventTypeId");
        angular.forEach(sportIds, (sportId) => {
          let id = sportId + "." + day;
          id = +id;
          let sport = {
            id: sportIdMap[id].id,
            name: sportIdMap[id].title,
            bfId: sportIdMap[id].bfId,
            tournaments: [],
          };

          let tourIds = [];
          angular.forEach(otherGames, (race) => {
            if (race.eventTypeId === sportId) {
              let key = race.countryCode;
              if (tourIds.findIndex((k) => k === key) < 0) {
                tourIds.push(key);
              }
            }
          });

          angular.forEach(tourIds, (tourId, index) => {
            let meeting = $scope.findDatafromArr(
              otherGames,
              "countryCode",
              tourId
            )[0];
            let tournament = {
              id: index + 1,
              bfId: index + 1,
              name: meeting.countryCode,
              day,
              matches: [],
            };

            angular.forEach(otherGames, (meeting) => {
              if (meeting.countryCode === tourId) {
                let match = {
                  id: meeting.meetingId,
                  name: meeting.venue,
                  bfId: meeting.meetingId,
                  markets: [],
                };
                angular.forEach(meeting.races, (race) => {
                  let market = {
                    name: race.marketName,
                    id: race.marketId,
                    bfId: race.marketId,
                    racing: true,
                    ...race,
                  };
                  match.markets.push(market);
                });
                tournament.matches.push(match);
              }
            });
            sport.tournaments.push(tournament);
          });
          let sportList = [sport];
          $scope.homeSignalrFormat(sportList);
        });
      };

      $scope.sportsListInterval = null;
      
      $rootScope.activatedRaces = {};

      $scope.getActivatedGames = function() {
        gamesService.activatedHorseGames().then((response) => {
          if (response.data.errorCode == 0) {
            $rootScope.activatedRaces[7] = response.data.result;
          } else {
            $rootScope.activatedRaces[7] = [];
          }
        })
  
        gamesService.activatedGreyhoundGames().then((response) => {
          if (response.data.errorCode == 0) {
            $rootScope.activatedRaces[4339] = response.data.result;
          } else {
            $rootScope.activatedRaces[4339] = [];
          }
        })
      }

      if (authtoken) {
        $scope.getActivatedGames();
        $rootScope.getOtherGames();
      }
      $rootScope.SportsList();

      $scope.sportsListInterval = setInterval(function () {
        if (authtoken) {
          $rootScope.getOtherGames();
        }
        $rootScope.SportsList();
      }, 15000);

      
      $scope.iplWinner = function() {
        gamesService.iplWinner().then(function(response) {
          console.log(response);
          if (response.data.errorCode == 0) {
            console.log(response.data);
            $scope.winnerMarket = response.data.result[0];
            console.log($scope.winnerMarket, $scope.winnerMarket.markets[0].marketId);
          }
        }, function() {

        })
      }

      $scope.iplWinner();

      $rootScope.TournamentList = function (id, name) {
        $scope.isLastElement = false;
        $rootScope.inplaydiv = false;
        $rootScope.isCasinoPage = false;
        // $('#loadingTree').css('display', 'block');

        if ($rootScope.sportsData && $rootScope.sportsData[id]) {
          $scope.level = 1;
          $scope.sprtid = id;
          $scope.tourname = name;

          $scope.showSportList = false;
          $scope.showTournamentList = true;
          $scope.showEventList = false;
          $scope.showMarketList = false;

          $scope.tournament = $rootScope.tournamentlistwise(
            $rootScope.sportsData[id]
          );
          $scope.pathList.splice(0, 1);
          $scope.pathList.splice(0, 1);
          $scope.pathList.splice(0, 1);
          $scope.pathList.push({
            name: name,
            id: id,
            level: $scope.level,
          });
        }
        // console.log($rootScope.sportsData[id], $scope.tournament)
        // $('#loadingTree').css('display', 'none');
      };

      $rootScope.eventList = function (id, name, sprt) {
        // console.log('--->>', id)
        // $('#loadingTree').css('display', 'block');

        $scope.level = 2;

        $scope.ename = name;
        $scope.tourid = id;

        if (sprt != undefined) {
          $scope.sprtid = sprt;
        }

        if ($rootScope.fType == 1) {
          $http({
            url:
              "http://www.lcexchanges247.com/Client/BetClient.svc/Navigation/MatchList?id=" +
              $scope.sprtid +
              "&tourid=" +
              $scope.tourid,

            method: "GET",

            headers: {
              Token: authtoken,
            },
          }).then(
            function mySuccess(response) {
              $scope.showSportList = false;
              $scope.showTournamentList = false;
              $scope.showEventList = true;
              $scope.showMarketList = false;

              $scope.Event = response.data.data;
              // $('#loadingTree').css('display', 'none');

              $scope.pathList.splice(1, 1);
              $scope.pathList.splice(1, 1);
              $scope.pathList.push({
                name: name,
                id: id,
                level: $scope.level,
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
          if ($rootScope.sportsData != undefined) {
            $scope.showSportList = false;
            $scope.showTournamentList = false;
            $scope.showEventList = true;
            $scope.showMarketList = false;
            if ($scope.sprtid == undefined) {
              $scope.sprtid = "20";
              $scope.Event = $rootScope.matchlistwise(
                $rootScope.sportsData[$scope.sprtid].tournaments[$scope.tourid]
              );
            } else {
              $scope.Event = $rootScope.matchlistwise(
                $rootScope.sportsData[$scope.sprtid].tournaments[$scope.tourid]
              );
            }

            // $('#loadingTree').css('display', 'none');
            $scope.pathList.splice(1, 1);
            $scope.pathList.splice(1, 1);
            $scope.pathList.push({
              name: name,
              id: id,
              level: $scope.level,
            });
          }
        }
      };

      $rootScope.MarketList = function (id, name) {
        // $('#loadingTree').css('display', 'block');

        $scope.level = 3;
        $scope.matchid = id;
        $scope.mname = name;
        if ($rootScope.fType == 1) {
          $http({
            url:
              "http://www.lcexchanges247.com/Client/BetClient.svc/Navigation/MarketList?mtid=" +
              $scope.matchid,

            method: "GET",

            headers: {
              Token: authtoken,
            },
          }).then(
            function mySuccess(response) {
              $scope.showSportList = false;
              $scope.showTournamentList = false;
              $scope.showEventList = false;
              $scope.showMarketList = true;
              // console.log(response);
              // $scope.pathList.push('Sport')
              $scope.Market = response.data.data;
              // $('#loadingTree').css('display', 'none');
              // console.log($scope.Market)
              //  console.log($scope.sport);
              // $scope.marketname = event.target.text
              // $scope.pathList.push({
              //     "market": $scope.marketname,
              //     "id": $scope.marketid
              // })
              $scope.pathList.splice(2, 1);
              $scope.pathList.push({
                name: name,
                id: id,
                level: $scope.level,
              });
              // $scope.pathList.push($scope.marketname)
              // console.log($scope.pathList)

              // console.log($scope.pathList, "tourn")
              // $scope.pathList=[];
            },
            function myError(error) {
              if (error.status == 401) {
                // $.removeCookie("authtoken");
                // window.location.href="index.html"
              }
            }
          );
        } else {
          if ($rootScope.sportsData != undefined) {
            $scope.showSportList = false;
            $scope.showTournamentList = false;
            $scope.showEventList = false;
            $scope.showMarketList = true;
            $scope.Market = $rootScope.marketlistwise(
              $rootScope.sportsData[$scope.sprtid].tournaments[$scope.tourid]
                .matches[$scope.matchid],
              $scope.matchid,
              $scope.tourid,
              $scope.sprtid
            );
            console.log($scope.Market);
            // $('#loadingTree').css('display', 'none');
            $scope.pathList.splice(2, 1);
            $scope.pathList.push({
              name: name,
              id: id,
              level: $scope.level,
            });
          }
        }
      };

      $rootScope.fetchingEventsOnMainPage = true;
      $scope.isInplay = true;
      $scope.eventsList = [];
      $scope.shoNoEvents = false;
      $scope.oldHighlightlist = [];
      $scope.Highlightlist = [];
      $rootScope.s_id = "4";

      var homeTimer;

      $scope.Highlights = function (id, index) {
        if (homeTimer) {
          $interval.cancel(homeTimer);
        }
        $("#loading_page").css("display", "grid");

        $rootScope.s_id = id;
        if ($rootScope.s_id == "4") {
          $scope.s_name = "Cricket";
        } else if ($rootScope.s_id == "1") {
          $scope.s_name = "Soccer";
        } else if ($rootScope.s_id == "2") {
          $scope.s_name = "Tennis";
        } else if ($rootScope.s_id == "20") {
          $scope.s_name = "Kabaddi";
        }
        $scope.isInplay = false;
        // $('.HLTab').removeClass('select')
        // $('#highlightTab' + index).addClass('select')
        $scope.inplayListData = [];
        $scope.datacount = [];
        $scope.oldHighlightlist = [];
        $scope.Highlightlist = [];
        // console.log($scope.datacount)
        $scope.matchHighlight();
        $rootScope.getMatchDataFromWebSocket();
        // $scope.lotusHighlights(id)
        if (!$scope.Highlightlist.length) {
          homeTimer = $interval(() => {
            $scope.matchHighlight();
          }, 1000);
        }
        if ($rootScope.authcookie) {
          homeTimer = $interval(() => {
            $rootScope.getMatchDataFromWebSocket();
          }, 10000);
        } else {
          homeTimer = $interval(() => {
            $rootScope.getMatchDataFromWebSocket();
          }, 1000 * 60);
        }
      };

      $scope.matchHighlightinter = false;
      $scope.matchHighlight = function () {
        $(".btn-lay").removeClass("spark");
        $(".btn-back").removeClass("spark");
        $("#loading").css("display", "block");
        if ($rootScope.s_id == undefined) {
          return false;
        }
        if ($scope.matchHighlightinter == false) {
          $scope.matchHighlightinter = true;
        }
        $scope.Highlightlist = $rootScope.highlightwisedata($rootScope.s_id);

        // angular.forEach($scope.Highlightlist, (match) => {
        //     match.fullScore = $rootScope.getScore(match.bfId);
        // });
        // console.log($scope.Highlightlist);
        $scope.matchHighlightinter = false;
        // console.log($scope.Highlightlist);
        // if ($scope.Highlightlist.length < 1) {
        //     $scope.shoNoEvents = true;
        // } else {
        //     $scope.shoNoEvents = false;
        // }
        $("#loading").css("display", "none");

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
          if (item.bfId == $scope.oldHighlightlist[index].bfId) {
            // console.log(item.bfId)
          }
          if (item.marketId == $scope.oldHighlightlist[index].marketId) {
            // console.log(item.marketId)
          }
          if (item.mtBfId == $scope.oldHighlightlist[index].mtBfId) {
            // console.log(item.mtBfId)
          }
        });
        $scope.oldHighlightlist = $scope.Highlightlist;
      };

      $rootScope.ws = undefined;
      $rootScope.matchDataHome = {};
      $scope.fetchMatchDataInterval = null;

      $scope.loadMatchesData = () => {
        if ($scope.events.length > 0) {
          $rootScope.getMatchDataFromWebSocket();
        } else {
          $http({
            url: baseUrl + "/listGames",
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: authtoken,
            },
          }).then(function mySuccess(response) {
            if (response.data.errorCode === 0) {
              var events = response.data.result;
              $scope.events = events;
              $rootScope.getMatchDataFromWebSocket();
              // if (
              //   $rootScope.authcookie !== null &&
              //   $rootScope.authcookie !== undefined
              // ) {
              //   $scope.fetchMatchDataInterval = setInterval(function () {
              //     $rootScope.getMatchDataFromWebSocket();
              //   }, 5000);
              // } else {
              //   $scope.fetchMatchDataInterval = setInterval(function () {
              //     $rootScope.getMatchDataFromWebSocket();
              //   }, 60000);
              // }
            }
          });
        }
      };

      $rootScope.getMatchDataFromWebSocket = function () {
        var ids = "";
        angular.forEach($scope.events, function (match, index) {
          if ($rootScope.s_id.toString() === match.eventTypeId) {
            angular.forEach(match.markets, function (market, index2) {
              if (market.marketName === "Match Odds") {
                ids += market.marketId + ",";
              }
            });
          }
        });
        if (ids !== "") {
          let req;
          if (authtoken != null && authtoken != undefined) {
            req = $http({
              url:
                "http://209.250.242.175:33332/matchOdds/" +
                $rootScope.s_id +
                "/?ids=" +
                ids.slice(0, -1),
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: authtoken
              },
            })
          } else {
            req = $http({
              url:
                "http://209.250.242.175:33332/matchOdds/" +
                $rootScope.s_id +
                "/?ids=" +
                ids.slice(0, -1),
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            })
          }
          req.then(
            function mySuccess(response) {
              angular.forEach(response.data, function (market, index) {
                $rootScope.matchDataHome[market.eventId] = market;
              });
            },
            function () {
              angular.forEach($scope.events, function (match, index) {
                $rootScope.matchDataHome[match.eventId] = {};
              });
            }
          );
        } else {
          setTimeout(function () {
            $rootScope.getMatchDataFromWebSocket();
          }, 300);
        }
      };

      // $rootScope.getMatchDataFromWebSocket = function () {
      //     angular.forEach($scope.events, function(match, index) {
      //         if (match.port) {
      //             var url = 'ws://209.250.242.175:' + match.port + '/' + (($rootScope.authcookie !== null && $rootScope.authcookie !== undefined)? '?logged=true' : '?logged=false');
      //             console.log('-- url:', match);
      //             var ws = $websocket.$new(url);
      //             ws.$on('$message', function (message) {
      //                 if (message.length > 0) {
      //                     message.sort(function(a, b) { return a.marketName < b.marketName ? -1 : a.marketName > b.marketName ? 1 : 0; });
      //                     $rootScope.matchDataHome[match.eventId] = message.slice();
      //                 }
      //             });
      //             $rootScope.ws[match.eventId] = ws;
      //         }
      //     })
      // }

      var highlightTimer;
      //  = $interval(function() {
      //     // $scope.matchHighlight();
      // }, 5000);
      $scope.$on("$destroy", function () {
        //   clearInterval($scope.sportsListInterval);
        // if (next.$$route.controller != "homeController") {
        $interval.cancel(highlightTimer); // clear interval here
        clearInterval($scope.fetchMatchDataInterval);
        // }
        // if (next.$$route.controller == undefined) {
        // if ($rootScope.authcookie) {
        //   highlightTimer = $interval(function () {
        //     $scope.matchHighlight();
        //   }, 10000);
        // } else {
        //   highlightTimer = $interval(function () {
        //     $scope.matchHighlight();
        //   }, 1000 * 60);
        // }
        // }
      });

      $scope.GetUserData = function () {
        // $http({
        //         url: 'http://www.lcexchanges247.com/Read/BetClient.svc/Data/GetUserData',
        //         method: 'GET',
        //         headers: {
        //             Token: authtoken
        //         }
        //     })
        //     .then(function mySuccess(response) {
        //         $scope.clientData = response;
        //         $scope.news = response.news;
        //         $rootScope.curTime = response.curTime;
        //         $scope.sport = $rootScope.sportlistwise(response.data.sportsData);
        //         // $rootScope.sportsData=$scope.homeSignalrFormat(response.data.sportsData);
        //         $scope.homesportdata = response.data.sportsData;
        //         $rootScope.fancyBook = response.data._fancyBook;
        //     }, function myError(error) {
        //         if (error.status == 401) {
        //             $.removeCookie("authtoken");
        //             window.location.href = "index.html"
        //         }
        //     })
      };

      $rootScope.inPlayEventsCount = {};

      $scope.homeSignalrFormat = function (sportsData) {
        angular.forEach(sportsData, (val, key) => {
          $rootScope.inPlayEventsCount[val.bfId] = 0;
        })
        var sportDataFormat = {};
        angular.forEach(sportsData, function (sport, index) {
          var tourDataFormat = {};
          angular.forEach(sport.tournaments, function (tour, index2) {
            var matchesDataFormat = {};
            angular.forEach(tour.matches, function (match, index3) {
              var marketsDataFormat = {};
              if (match.inPlay === 1) {
                if ($rootScope.inPlayEventsCount[sport.bfId]) {
                  $rootScope.inPlayEventsCount[sport.bfId] += 1;
                } else {
                  $rootScope.inPlayEventsCount[sport.bfId] = 1;
                }
              }
              angular.forEach(match.markets, function (market, index4) {
                marketsDataFormat[market.id] = market;
              });
              // matchesDataFormat['bfId']=tour.bfId;
              // matchesDataFormat['id']=tour.id;
              // matchesDataFormat['name']=tour.name;
              matchesDataFormat[match.bfId] = match;
            });
            // tourDataFormat['id']=item.id;
            // tourDataFormat['name']=item.name;
            tourDataFormat[tour.bfId] = {
              bfId: tour.bfId,
              id: tour.id,
              name: tour.name,
              matches: matchesDataFormat,
            };
            // tourDataFormat[item2.bfId]['bfId']=item.bfId;
            // tourDataFormat[item2.bfId]['id']=item.id;
            // tourDataFormat[item2.bfId]['name']=item.name;
            // tourDataFormat[item2.bfId]=matchesDataFormat;
            // tourDataFormat[item2.bfId]=item2;
          });
          // tourDataFormat[item2.bfId]=item2;
          sportDataFormat[sport.bfId] = {
            bfId: sport.bfId,
            id: sport.id,
            name: sport.name,
            tournaments: tourDataFormat,
          };
          $rootScope.sportsData[sport.bfId] = {
            bfId: sport.bfId,
            id: sport.id,
            name: sport.name,
            tournaments: tourDataFormat,
          };
          // sportDataFormat[item.bfId]=tourDataFormat;
        });

        return sportDataFormat;
      };

      $scope.tabs = [
        {id: 1, name: 'Soccer', ids: 4},
        {id: 2, name: 'Tennis', ids: 3},
        {id: 4, name: 'Cricket', ids: 1},

      ]

      $rootScope.sportlistwise = function () {
        var sportslistdata = [];
        var data = {};
        data["id"] = 4;
        data["name"] = "Cricket";
        data["ids"] = 1;
        sportslistdata.push(data);

        var data = {};
        data["id"] = 2;
        data["name"] = "Tennis";
        data["ids"] = 3;
        sportslistdata.push(data);

        var data = {};
        data["id"] = "1";
        data["name"] = "Soccer";
        data["ids"] = "3";
        sportslistdata.push(data);

        var data = {};
        data["id"] = "7.1";
        data["name"] = "Horse Racing Today's Card";
        data["ids"] = 40;
        data["otherSport"] = true;
        sportslistdata.push(data);

        var data = {};
        data["id"] = 4339.1;
        data["name"] = "Greyhound Racing Today's Card";
        data["ids"] = 50;
        data["otherSport"] = true;
        sportslistdata.push(data);

        var data = {};
        data["id"] = 7.2;
        data["name"] = "Horse Racing";
        data["ids"] = 60;
        data["otherSport"] = true;
        sportslistdata.push(data);

        var data = {};
        data["id"] = 4339.2;
        data["name"] = "Greyhound Racing";
        data["ids"] = 70;
        data["otherSport"] = true;
        sportslistdata.push(data);

        sportslistdata.sort(function (a, b) {
          return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
        });
        return sportslistdata;
      };

      $rootScope.ShowSportsList = function () {
        $scope.showSportList = true;
        $scope.showTournamentList = false;
        $scope.showEventList = false;
        $scope.showMarketList = false;
        $rootScope.inplaydiv = false;
        $rootScope.mainfooter = true;
        $scope.isLastElement = true;
        $rootScope.isCasinoPage = false;
        $scope.pathList = [];
        $scope.sport = $rootScope.sportlistwise();
      };

      $rootScope.tournamentlistwise = function (tourlistdata) {
        var tournamentdata = [];
        angular.forEach(tourlistdata.tournaments, function (item, index) {
          var data = {};
          data["id"] = index;
          data["name"] = item.name;
          tournamentdata.push(data);
        });
        return tournamentdata;
      };
      $rootScope.matchlistwise = function (tourlistdata) {
        var matchdata = [];
        angular.forEach(tourlistdata.matches, function (item, index) {
          var data = {};
          data["bfId"] = item.bfId;
          data["id"] = item.bfId;
          data["name"] = item.name;
          data["startDate"] = item.startDate;
          matchdata.push(data);
        });
        return matchdata;
      };
      $rootScope.marketlistwise = function (
        matchlistdata,
        mtid,
        tourid,
        sprtId
      ) {
        var marketdata = [];
        angular.forEach(matchlistdata.markets, function (item, index) {
          var data = {};
          data["bfId"] = item.bfId;
          data["id"] = item.id;
          data["SportId"] = sprtId;
          data["name"] = item.name;
          data["isMulti"] = item.isMulti;
          data["mtId"] = mtid;
          data["isBettingAllow"] = item.isBettingAllow;
          data["TourId"] = tourid;
          data["startTime"] = item.startTime;
          data["racing"] = item.racing;
          data["inPlay"] = matchlistdata.inPlay;
          marketdata.push(data);
        });
        return marketdata;
      };

      $rootScope.highlightwisedata = function (sprtid) {
        var data = {};
        var highlightdata = [];
        var highlightdataIds = [];
        $scope.multimarket = JSON.parse(localStorage.getItem("Multimarkets"));
        angular.forEach($scope.homesportdata, function (item, index) {
          if (item.bfId == sprtid) {
            angular.forEach(item.tournaments, function (item1, index1) {
              angular.forEach(item1.matches, function (item2, index2) {
                angular.forEach(item2.markets, function (item3, index3) {
                  if (item3.name == "Match Odds") {
                    item3.runnerData["bfId"] = item3.bfId;
                    item3.runnerData["inPlay"] = item2.inPlay;
                    item3.runnerData["isBettingAllow"] = item3.isBettingAllow;
                    item3.runnerData["isMulti"] = item3.isMulti;
                    item3.runnerData["marketId"] = item3.id;
                    item3.runnerData["matchDate"] = item2.startDate;
                    item3.runnerData["matchId"] = item2.bfId;
                    item3.runnerData["matchName"] = item2.name;
                    item3.runnerData["sportName"] = item.name;
                    item3.runnerData["status"] = item2.status;
                    item3.runnerData["mtBfId"] = item2.bfId;
                    item3.runnerData["TourbfId"] = item1.bfId;
                    item3.runnerData["SportbfId"] = item.bfId;
                    item3.runnerData["isFancy"] = item2.isFancy;
                    item3.runnerData["hasBookmaker"] = item2.bookRates
                      ? item2.bookRates.length > 0
                        ? 1
                        : 0
                      : 0;
                    angular.forEach($scope.multimarket, function (item4) {
                      if (item3.id == item4) {
                        item3.runnerData["isMulti"] = 1;
                      }
                    });
                    highlightdata.push(item3.runnerData);
                    highlightdataIds.push(item3.bfId);
                  }
                });
              });
            });

            // data["name"] = item.name;
            // data["inplayData"] = highlightdata;
            // data["id"] = 0;
            // highlightdata.push(data);
            // var ids = highlightdataIds.join(",");
            // if (ids !== "") {
            //   $http({
            //     url:
            //       "http://209.250.242.175:33332/matchOdds/" +
            //       item.bfId +
            //       "/?ids=" +
            //       ids,
            //     method: "GET",
            //     headers: {
            //       "Content-Type": "application/json",
            //     },
            //   }).then(
            //     function mySuccess(response) {

            //     highlightdata.map((event) => {
            //         angular.forEach(response.data, function (market, index) {
            //             if (event.eventId === market.eventId) {
            //                 event.runners = market.runners;
            //             }
            //           });
            //       })
            //     },
            //     function () {
            //       angular.forEach($scope.events, function (match, index) {
            //         $rootScope.inplayRunnerData[match.eventId] = {};
            //       });
            //     }
            //   );
            // }
          }
        });
        return highlightdata.sort((a, b) => {
          if (a.inPlay - b.inPlay) {
            return b.inPlay - a.inPlay;
          }
          if (a.inPlay === 0 && b.inPlay == 0) {
            return Date.parse(a.matchDate) - Date.parse(b.matchDate);
          }
        });
        // return highlightdata
      };
      $scope.Searchwisedata = function () {
        var highlightdata = [];
        angular.forEach($scope.homesportdata, function (item, index) {
          angular.forEach(item.tournaments, function (item1, index1) {
            angular.forEach(item1.matches, function (item2, index2) {
              angular.forEach(item2.markets, function (item3, index3) {
                if (item3.name == "Match Odds") {
                  item3.runnerData["bfId"] = item3.bfId;
                  item3.runnerData["inPlay"] = item2.inPlay;
                  item3.runnerData["isBettingAllow"] = item3.isBettingAllow;
                  item3.runnerData["isMulti"] = item3.isMulti;
                  item3.runnerData["marketId"] = item3.id;
                  item3.runnerData["matchDate"] = item2.startDate;
                  item3.runnerData["matchId"] = item2.bfId;
                  item3.runnerData["matchName"] = item2.name;
                  item3.runnerData["sportName"] = item.name;
                  item3.runnerData["status"] = item2.status;
                  item3.runnerData["mtBfId"] = item2.bfId;
                  item3.runnerData["TourbfId"] = item1.bfId;
                  item3.runnerData["SportbfId"] = item.bfId;
                  item3.runnerData["hasFancy"] = item2.hasFancy;
                  highlightdata.push(item3.runnerData);
                }
              });
            });
          });
        });
        return highlightdata;
      };
      $rootScope.inplaylistwise = function (sportdata, inplaytype) {
        var inplaydata = [];
        $rootScope.inplayRunnerData = {};
        $scope.multimarket = JSON.parse(localStorage.getItem("Multimarkets"));
        angular.forEach(sportdata, function (item, index) {
          var data = {};
          var highlightdata = [];
          var highlightdataIds = [];
          angular.forEach(item.tournaments, function (item1, index1) {
            angular.forEach(item1.matches, function (item2, index2) {
              // if (item2.inPlay==1 && inplaytype==0) {
              angular.forEach(item2.markets, function (item3, index3) {
                if (item3.name == "Match Odds") {
                  item3.runnerData["bfId"] = item3.bfId;
                  item3.runnerData["inPlay"] = item2.inPlay;
                  item3.runnerData["isBettingAllow"] = item3.isBettingAllow;
                  item3.runnerData["isMulti"] = item3.isMulti;
                  item3.runnerData["marketId"] = item3.id;
                  item3.runnerData["matchDate"] = item2.startDate;
                  item3.runnerData["matchId"] = item2.bfId;
                  item3.runnerData["matchName"] = item2.name;
                  item3.runnerData["sportName"] = item.name;
                  item3.runnerData["status"] = item2.status;
                  item3.runnerData["mtBfId"] = item2.bfId;
                  item3.runnerData["TourbfId"] = item1.bfId;
                  item3.runnerData["Tourname"] = item1.name;
                  item3.runnerData["SportbfId"] = item.bfId;
                  item3.runnerData["hasFancy"] = item2.hasFancy;
                  item3.runnerData["hasBookmaker"] = item2.bookRates
                    ? item2.bookRates.length > 0
                      ? 1
                      : 0
                    : 0;
                  angular.forEach($scope.multimarket, function (item4) {
                    if (item3.id == item4) {
                      item3.runnerData["isMulti"] = 1;
                    }
                  });
                  if (item2.inPlay == 1 && inplaytype == 0) {
                    highlightdata.push(item3.runnerData);
                    highlightdataIds.push(item3.bfId);
                  } else if (
                    item2.inPlay != 1 &&
                    inplaytype == 1 &&
                    new Date(item2.startDate).getDate() === new Date().getDate()
                  ) {
                    highlightdata.push(item3.runnerData);
                    highlightdataIds.push(item3.bfId);
                  } else if (
                    item2.inPlay != 1 &&
                    inplaytype == 2 &&
                    new Date(item2.startDate).getDate() ===
                      new Date().getDate() + 1
                  ) {
                    highlightdata.push(item3.runnerData);
                    highlightdataIds.push(item3.bfId);
                  }
                }
              });
              // }
            });
          });
          data["name"] = item.name;
          data["inplayData"] = highlightdata;
          data["id"] = 0;
          data["bfId"] = item.bfId;
          inplaydata.push(data);
        });
        return inplaydata;
      };

      $rootScope.getAllBetsWise = function (mtid, avgOdds) {
        var data = {
          matchedData: [],
          unMatchedData: [],
        };
        if (mtid == 0 && avgOdds == 0) {
          var matchData = [];
          angular.forEach(
            $scope.clientData._userMatchedBets,
            function (item, index) {
              angular.forEach(item, function (item1, index1) {
                matchData.push(item1);
              });
            }
          );

          if ($scope.clientData._userTpBets != null) {
            angular.forEach(
              $scope.clientData._userTpBets,
              function (item, index) {
                angular.forEach(item, function (item1, index1) {
                  matchData.push(item1);
                });
              }
            );
          }
          data.matchedData = matchData;
          var unmatchData = [];
          angular.forEach(
            $scope.clientData._userUnMatchedBets,
            function (item, index) {
              angular.forEach(item, function (item1, index1) {
                unmatchData.push(item1);
              });
            }
          );
          data.unMatchedData = unmatchData;
        } else if (mtid == 0 && avgOdds == 1) {
          var matchData = [];
          angular.forEach(
            $scope.clientData._userAvgmatchedBets,
            function (item, index) {
              angular.forEach(item, function (item1, index1) {
                matchData.push(item1);
              });
            }
          );

          if ($scope.clientData._userTpBets != null) {
            angular.forEach(
              $scope.clientData._userTpBets,
              function (item, index) {
                angular.forEach(item, function (item1, index1) {
                  matchData.push(item1);
                });
              }
            );
          }
          data.matchedData = matchData;
          var unmatchData = [];
          angular.forEach(
            $scope.clientData._userUnMatchedBets,
            function (item, index) {
              angular.forEach(item, function (item1, index1) {
                unmatchData.push(item1);
              });
            }
          );
          data.unMatchedData = unmatchData;
        } else if (mtid != 0 && avgOdds == 0) {
          var matchData = [];
          if ($scope.clientData._userMatchedBets != null) {
            angular.forEach(
              $scope.clientData._userMatchedBets[mtid],
              function (item1, index1) {
                matchData.push(item1);
              }
            );
          }
          if ($scope.clientData._userTpBets != null) {
            angular.forEach(
              $scope.clientData._userTpBets[$rootScope.gameid],
              function (item, index) {
                matchData.push(item);
              }
            );
          }
          data.matchedData = matchData;
          var unmatchData = [];
          if ($scope.clientData._userUnMatchedBets != null) {
            angular.forEach(
              $scope.clientData._userUnMatchedBets[mtid],
              function (item1, index1) {
                unmatchData.push(item1);
              }
            );
          }
          data.unMatchedData = unmatchData;
        } else if (mtid != 0 && avgOdds == 1) {
          var matchData = [];
          if ($scope.clientData._userAvgmatchedBets != null) {
            angular.forEach(
              $scope.clientData._userAvgmatchedBets[mtid],
              function (item1, index1) {
                // console.log(item1)
                matchData.push(item1);
              }
            );
          }
          if ($scope.clientData._userTpBets != null) {
            angular.forEach(
              $scope.clientData._userTpBets[$rootScope.gameid],
              function (item, index) {
                matchData.push(item);
              }
            );
          }
          data.matchedData = matchData;
          var unmatchData = [];
          if ($scope.clientData._userUnMatchedBets != null) {
            angular.forEach(
              $scope.clientData._userUnMatchedBets[mtid],
              function (item1, index1) {
                unmatchData.push(item1);
              }
            );
          }
          data.unMatchedData = unmatchData;
        }
        return data;
      };

      $scope.orderByDate = function (timeg) {
        var matchDateTime;
        if (timeg.matchDate == undefined) {
          matchDateTime = new Date(
            $scope.matchDateDigit(timeg.startDate).replace(/ /g, "T")
          );
        } else {
          matchDateTime = new Date(timeg.matchDate);
        }
        return matchDateTime;
      };

      $rootScope.formatDate = function (dateStr) {
        var d = new Date(dateStr);
        var datestring =
          d.getFullYear() +
          "-" +
          (d.getMonth() + 1 < 10 ? "0" : "") +
          (d.getMonth() + 1) +
          "-" +
          (d.getDate() < 10 ? "0" : "") +
          d.getDate() +
          " " +
          (d.getHours() < 10 ? "0" : "") +
          d.getHours() +
          ":" +
          (d.getMinutes() < 10 ? "0" : "") +
          d.getMinutes();
        return datestring;
      };

      $rootScope.checkDateTime = function (matchDate, currentDate) {
        if (matchDate == undefined || currentDate == undefined) {
          return false;
        }
        var matchDateTime = new Date(
          $scope.matchDateDigit(matchDate).replace(/ /g, "T")
        );
        currentDate = currentDate.replace(/ /g, "T");
        var currentDate = new Date(currentDate);
        var dateTime = matchDateTime.getTime() - currentDate.getTime();
        var day = parseInt(dateTime / (1000 * 3600 * 24));
        var hrs = parseInt(dateTime / (1000 * 3600)) - day * 24;
        var minutes =
          parseInt(dateTime / (1000 * 60)) - (day * 24 * 60 + hrs * 60);
        if (day <= 0 && hrs <= 0 && minutes <= 15) {
          // if ((day <= 0 && hrs <= 3)) {
          return false;
        } else {
          return true;
        }
      };

      $rootScope.getDateTime = function (matchDate, currentDate, state) {
        var matchDateTime = $scope
          .matchDateDigit(matchDate)
          .split("-")[2]
          .split(" ")[0];
        var currentDateTime = currentDate.split("-")[2].split(" ")[0];
        var day = parseInt(matchDateTime) - parseInt(currentDateTime);
        if (day == 0 && state != 1) {
          return $scope
            .matchDateDigit(matchDate)
            .replace(/ /g, "T")
            .split("T")[1];
        } else if (day == 1 && state != 1) {
          return (
            "Tomorrow " +
            $scope.matchDateDigit(matchDate).replace(/ /g, "T").split("T")[1]
          );
        } else if (state != 1) {
          return $scope.matchDateDigit(matchDate);
        } else if (state == 1) {
          return day;
        }
      };

      $scope.matchDateDigit = function (date) {
        if (date) {
          var splitdate = date.split("-");
          var splitdate2 = splitdate[2].split(" ");
          if (splitdate[1] == "Jan") {
            date = splitdate2[0] + "-01-" + splitdate[0] + " " + splitdate2[1];
          } else if (splitdate[1] == "Feb") {
            date = splitdate2[0] + "-02-" + splitdate[0] + " " + splitdate2[1];
          } else if (splitdate[1] == "Mar") {
            date = splitdate2[0] + "-03-" + splitdate[0] + " " + splitdate2[1];
          } else if (splitdate[1] == "Apr") {
            date = splitdate2[0] + "-04-" + splitdate[0] + " " + splitdate2[1];
          } else if (splitdate[1] == "May") {
            date = splitdate2[0] + "-05-" + splitdate[0] + " " + splitdate2[1];
          } else if (splitdate[1] == "Jun") {
            date = splitdate2[0] + "-06-" + splitdate[0] + " " + splitdate2[1];
          } else if (splitdate[1] == "Jul") {
            date = splitdate2[0] + "-07-" + splitdate[0] + " " + splitdate2[1];
          } else if (splitdate[1] == "Aug") {
            date = splitdate2[0] + "-08-" + splitdate[0] + " " + splitdate2[1];
          } else if (splitdate[1] == "Sept") {
            date = splitdate2[0] + "-09-" + splitdate[0] + " " + splitdate2[1];
          } else if (splitdate[1] == "Oct") {
            date = splitdate2[0] + "-10-" + splitdate[0] + " " + splitdate2[1];
          } else if (splitdate[1] == "Nov") {
            date = splitdate2[0] + "-11-" + splitdate[0] + " " + splitdate2[1];
          } else if (splitdate[1] == "Dec") {
            date = splitdate2[0] + "-12-" + splitdate[0] + " " + splitdate2[1];
          } else {
            date =
              splitdate2[0] +
              "-" +
              splitdate[1] +
              "-" +
              splitdate[0] +
              " " +
              splitdate2[1];
          }
          return date;
        }
        return "";
      };

      $rootScope.currencyCode;
      $rootScope.userDescription = function () {
        $http({
          url: baseUrl + "/profile",
          method: "GET",
          headers: {
            Authorization: authtoken,
          },
        }).then(
          function mySuccess(response) {
            if (response.data.errorCode == 0) {
              // $scope.lastLogin=response.data.data.lastLogin
              $scope.name = response.data.result[0].name;
              $scope.userName = response.data.result[0].userName;
              // $scope.uName = response.data.data.uName;
              $rootScope.currencyCode = response.data.result[0].currencyCode;

              if (window.origin.indexOf('777sports') > -1) {
                $rootScope.currencyCode = 'PTE';
              }
            }
          },
          function myError(error) {
            if (error.status == 401) {
              // $.removeCookie("authtoken");
              window.location.href = "index.html";
            }
          }
        );
      };

      $rootScope.userDescription();

      $rootScope.getBalance = function () {
        if (authtoken) {
          $("#menuRefreshIcon").css("display", "block");
          $("#accountCredit").css("display", "none");
          $http({
            url: baseUrl + "/balance",
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: authtoken,
            },
          }).then(function mySuccess(response) {
            if (response.data.errorCode === 0) {
              $scope.availBal = response.data.result[0].balance;
              $scope.exposure = response.data.result[0].exposure;
            } else {
              $rootScope.logout();
              toastr.info("You have been logged out,Please Login again");
            }
            $("#menuRefreshIcon").css("display", "none");
            $("#accountCredit").css("display", "block");
          });
        }
      };

      if (authtoken) {
        $scope.getBalance();
      }

      $scope.showMultiBalancePop = function () {
        $("#multiBalancePop").css("display", "flex");
      };

      $scope.hideMultiBalancePop = function () {
        $("#multiBalancePop").css("display", "none");
      };

      var fundsinterval;
      fundsinterval = $interval(function () {
        // $scope.Fund('1');
      }, 15000);

      if ($rootScope.authcookie == undefined) {
        $interval.cancel(fundsinterval);
      }

      $scope.stakeList = [
        { id: 1, stake: 500 },
        { id: 2, stake: 1000 },
        { id: 3, stake: 5000 },
        { id: 4, stake: 10000 },
        { id: 5, stake: 20000 },
        { id: 6, stake: 25000 },
        { id: 7, stake: 50000 },
        { id: 8, stake: 100000 },
        { id: 9, stake: 200000 },
        { id: 10, stake: 500000 },
      ];
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

      $rootScope.logout = function () {
        $http({
          method: "POST",
          url: $rootScope.baseUrl + "/logout",
          headers: {
            "Content-Type": "application/json",
            Authorization: authtoken,
          },
        }).then(
          function success(response) {
            $scope.pending_logout = false;
            //console.log(response)
            if (response.data.errorCode == 0) {
              // $scope.unSubscribeHome();
              $.removeCookie("authtoken");
              localStorage.clear();
              toastr.success(response.data.errorDescription);
            }
          },
          function error(response) {
            $scope.pending_logout = false;
            if (response.status == 401) {
              $.removeCookie("authtoken");
              window.location.href = "index.html";
            }
          }
        );

        $.removeCookie("authtoken");
        $rootScope.authcookie = null;
        window.location.href = "index.html";

        // if ($scope.pending_logout == true) return false
        // $scope.pending_logout = true
        // $http({
        //     method: "POST",
        //     url: "http://www.lcexchanges247.com/Client/BetClient.svc/Logout",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Token": authtoken
        //     }
        // }).then(function success(response) {
        //     $scope.pending_logout = false
        //     //console.log(response)
        //     if (response.data.errorCode == 0) {
        //         // $scope.unSubscribeHome();
        //         $.removeCookie("authtoken");
        //         $scope.unSubscribesubscribehomesignalr();
        //         toastr.success(response.data.result)
        //         window.location.href = 'index.html';
        //         // $timeout(function() {
        //         //     window.location.href = 'index.html'
        //         // }, 500);
        //     }
        //     // $scope.balanceexpo = false
        //     // $scope.logindetail = true
        // }, function error(response) {
        //     $scope.pending_logout = false
        //     if (response.status == 401) {
        //         $.removeCookie("authtoken");
        //         window.location.href = 'index.html'
        //     }
        // })
      };

      $scope.GetSportData = function () {};

      $scope.Callfunctions = function () {};

      $scope.AllmatchSearchtinter = false;
      $scope.AllmatchSearch = function () {
        if ($scope.AllmatchSearchtinter == false) {
          $scope.AllmatchSearchtinter = true;
        }
        $scope.Allmatches = $scope.Searchwisedata();
      };
      $scope.AllmatchSearch();

      $scope.SearchItem = function (searchvalue) {
        console.log(searchvalue);
        if (searchvalue == "") {
          $("#searchList").css("display", "none");
        } else {
          $("#searchList").css("display", "block");
        }
      };
      $scope.matchclick = function () {
        $("#searchList").css("display", "none");
        $scope.Searchevent = "";
      };

      // var highlistpm = function(sid) {
      //  console.log('11111111111')
      //      return new Promise(function(res, rej) {
      //          if ($scope.pending_highlistpm == true) return false
      //          $scope.pending_highlistpm = true
      //          $http({
      //              method: "GET",
      //              url: "http://www.lcexchanges247.com/Client/BetClient.svc/Data/Highlights?sid=" + sid,
      //              headers: {
      //                  "Content-Type": "application/json",
      //                  "Token": authtoken
      //              }
      //          }).then(function success(response) {
      //              $scope.pending_highlistpm = false
      //              res(response)
      //          }, function error(response) {
      //              $scope.pending_highlistpm = false
      //              if (response.status == 401) {
      //                  $.removeCookie("authtoken");
      //                  window.location.href = 'index.html'
      //              }
      //          })
      //      })
      //  }
      // $scope.oldHighlightlist = []
      // $scope.Highlightlist = []
      // $scope.Highlights = function(id, index) {
      //     $('#loading_page').css('display','grid');

      //     $rootScope.s_id = id
      //     if ($rootScope.s_id=='4') {
      //      $scope.s_name="Cricket"
      //     }
      //     else if ($rootScope.s_id=='1') {
      //      $scope.s_name="Soccer"
      //     }
      //     else if ($rootScope.s_id=='2') {
      //      $scope.s_name="Tennis"
      //     }
      //     $scope.isInplay = false
      //     $('.HLTab').removeClass('select')
      //     $('#highlightTab' + index).addClass('select')
      //     $scope.inplayListData = []
      //     $scope.datacount = []
      //     $scope.oldHighlightlist = []
      //     $scope.Highlightlist = []
      //     // console.log($scope.datacount)
      //     $scope.matchHighlight()
      // }

      // $scope.matchHighlight = function() {
      //     $('.btn-lay').removeClass('blink')
      //     $('.btn-back').removeClass('blink')

      //     if ($rootScope.s_id == undefined) {
      //         return false
      //     }
      //     $http({
      //             url: "http://www.lcexchanges247.com/Client/BetClient.svc/Data/Highlights?sid=" + $rootScope.s_id,
      //             method: "GET",
      //             headers: {
      //                 Token: authtoken
      //             }
      //         })

      //         .then(function mySuccess(response) {

      //             // console.log(response);
      //             if (response.data.data.length < 1) {
      //                 $scope.shoNoEvents = true;
      //             } else {
      //                 $scope.shoNoEvents = false;
      //             }
      //             $scope.Highlightlist = response.data.data;
      //             $('#loading_page').css('display','none');

      //             if ($scope.oldHighlightlist.length != $scope.Highlightlist.length) {
      //                 $scope.oldHighlightlist = $scope.Highlightlist
      //             }

      //             angular.forEach($scope.Highlightlist, function(item, index) {
      //                 if (item.matchName == $scope.oldHighlightlist[index].matchName) {
      //                     if (item.runner1Back != $scope.oldHighlightlist[index].runner1Back) {
      //                         $('#hback1_' + index).addClass('blink');
      //                     }
      //                     if (item.runner1Lay != $scope.oldHighlightlist[index].runner1Lay) {
      //                         $('#hlay1_' + index).addClass('blink');
      //                     }
      //                     if (item.runner2Back != $scope.oldHighlightlist[index].runner2Back) {
      //                         $('#hback2_' + index).addClass('blink');
      //                     }
      //                     if (item.runner2Lay != $scope.oldHighlightlist[index].runner2Lay) {
      //                         $('#hlay2_' + index).addClass('blink');
      //                     }
      //                     if (item.runner3Back != $scope.oldHighlightlist[index].runner3Back) {
      //                         $('#hback3_' + index).addClass('blink');
      //                     }
      //                     if (item.runner3Lay != $scope.oldHighlightlist[index].runner3Lay) {
      //                         $('#hlay3_' + index).addClass('blink');
      //                     }
      //                 }
      //             })
      //             $scope.oldHighlightlist = $scope.Highlightlist

      //         }, function myError(error) {
      //          if (error.status==401) {
      // $.removeCookie("authtoken");
      // window.location.href="index.html"
      // }
      //         });
      // }

      var highlightTimer;
      $scope.lotusHighlights = function (ID) {
        // var bsHeight = $('.footer').offset().top - $('.rightPanelContent').offset().top;
        // $('.rightPanelContent').css('max-height', bsHeight + 'px');
        // var routesid = $routeParams.rsid;

        // if (sid != routesid) {
        //     $scope.Highlights();
        // }
        // var routesid = $routeParams.sid
        // if (routesid != null) {
        //     sid = routesid
        // }
        // if ($scope.pending_Highlights == true)
        //     return false
        // $scope.pending_Highlights = true
        // if (sid == undefined) {
        //     return false;
        // }
        // if (routesid == 4) $scope.CurentSportSelected = 'Cricket';
        // if (routesid == 1) $scope.CurentSportSelected = 'Soccer';
        // if (routesid == 2) $scope.CurentSportSelected = 'Tennis';

        $http({
          method: "GET",
          url: "https://www.lotusbook.com/api/exchange/odds/eventType/" + ID,
        }).then(
          function success(response) {
            // $('#loader').css('display', 'none');

            // $scope.pending_Highlights = false
            $scope.lhighlightData = $scope.highlightsIdWiseData(
              response.data.result
            );
            // if (oldHighlightdata.length != $scope.Highlightdata.length) {
            //     oldHighlightdata = $scope.Highlightdata;
            // }
            if ($rootScope.fType == 1) {
              $(".lay").removeClass("spark");
              $(".back").removeClass("spark");
              angular.forEach($scope.Highlightdata, function (item, index) {
                if ($scope.CurentSportSelected != item.sportName) {
                  $scope.Highlightdata = null;
                  $scope.Highlights();
                  return false;
                }
                var newdata = $scope.lhighlightData[item.bfId];
                // console.log(newdata)
                if (newdata != undefined) {
                  item.status = newdata.status;
                  if (newdata.inPlay) {
                    item.inPlay = 1;
                  } else {
                    item.inPlay = 0;
                  }
                  if (newdata.runners[0].back.length != 0) {
                    if (item.runner1Back != newdata.runners[0].back[0].price) {
                      $("#hback1_" + index).addClass("spark");
                    }
                    item.runner1Back = newdata.runners[0].back[0].price;
                  } else {
                    item.runner1Back = null;
                  }
                  if (newdata.runners[0].lay.length != 0) {
                    if (item.runner1Lay != newdata.runners[0].lay[0].price) {
                      $("#hlay1_" + index).addClass("spark");
                    }
                    item.runner1Lay = newdata.runners[0].lay[0].price;
                  } else {
                    item.runner1Lay = null;
                  }
                  if (newdata.runners[1].back.length != 0) {
                    if (item.runner2Back != newdata.runners[1].back[0].price) {
                      $("#hback2_" + index).addClass("spark");
                    }
                    item.runner2Back = newdata.runners[1].back[0].price;
                  } else {
                    item.runner2Back = null;
                  }
                  if (newdata.runners[1].lay.length != 0) {
                    if (item.runner2Lay != newdata.runners[1].lay[0].price) {
                      $("#hlay2_" + index).addClass("spark");
                    }
                    item.runner2Lay = newdata.runners[1].lay[0].price;
                  } else {
                    item.runner2Lay = null;
                  }
                  if (item.runner3Name != null) {
                    if (newdata.runners[2].back.length != 0) {
                      if (
                        item.runner3Back != newdata.runners[2].back[0].price
                      ) {
                        $("#hback3_" + index).addClass("spark");
                      }
                      item.runner3Back = newdata.runners[2].back[0].price;
                    } else {
                      item.runner3Back = null;
                    }
                    if (newdata.runners[2].lay.length != 0) {
                      if (item.runner3Lay != newdata.runners[2].lay[0].price) {
                        $("#hlay3_" + index).addClass("spark");
                      }
                      item.runner3Lay = newdata.runners[2].lay[0].price;
                    } else {
                      item.runner3Lay = null;
                    }
                  }
                }
              });
              var defaultoldHighlightdata = $scope.Highlightdata;
              oldHighlightdata = defaultoldHighlightdata;
            }
            // $scope.showLoading = false
          },
          function error(response) {
            // $scope.pending_Highlights = false
            if (response.status == 401) {
              // $.removeCookie("authtoken");
              // window.location.href = 'index.html'
            }
          }
        );
      };
      $scope.highlightsIdWiseData = function (highlights) {
        var newhighlights = {};
        angular.forEach(highlights, function (item, key) {
          newhighlights[item.id] = item;
        });
        return newhighlights;
        // console.log($scope.markets)
      };
      $scope.highlightTimer;
      $scope.lotushighlightTimer;
      $scope.highlightsInterval = function () {
        $scope.Highlights();
        if ($rootScope.fType == 1) {
          $scope.highIntervalVal = 300000;
        } else if ($rootScope.fType == 2) {
          $scope.highIntervalVal = 1000;
        }
        if ($scope.highlightTimer) {
          $interval.cancel($scope.highlightTimer);
        }
        $scope.highlightTimer = $interval(function () {
          $scope.Highlights();
        }, $scope.highIntervalVal);

        if ($scope.lotushighlightTimer) {
          $interval.cancel($scope.lotushighlightTimer);
        }
        $scope.lotushighlightTimer = $interval(function () {
          $scope.lotusHighlights();
        }, 1000);
      };

      $scope.backBetSlipDataArray = [];
      $scope.layBetSlipDataArray = [];

      $scope.backBetSlipList = [];
      $scope.layBetSlipList = [];

      $scope.backBetSlipData = [];
      $scope.layBetSlipData = [];

      $scope.yesBetSlipList = [];
      $scope.noBetSlipList = [];

      $scope.yesBetSlipData = [];
      $scope.noBetSlipData = [];

      $scope.backBookBetSlipList = [];
      $scope.layBookBetSlipList = [];

      $scope.backBookBetSlipData = [];
      $scope.layBookBetSlipData = [];

      // $scope.currRunnerIndex;
      // $scope.active = false;
      $scope.betSlip = function (
        bfId,
        betType,
        betSlipIndex,
        runnerName,
        selectionId,
        matchName,
        odds,
        mtid,
        mktid,
        isInplay,
        fancyRate,
        fancyId,
        sportId,
        matchBfId,
        marketName
      ) {
        console.log(
          bfId,
          betType,
          betSlipIndex,
          runnerName,
          selectionId,
          matchName,
          odds,
          mtid,
          mktid,
          isInplay,
          fancyRate,
          fancyId,
          sportId,
          matchBfId
        );

        console.log(betSlipIndex);
        if ($scope.oneClicked != "true") {
          $("#betslip_open").removeClass("close");
        }

        if ($scope.pending_oneClickPlaceMOBet == true) {
          return false;
        }
        if (betType == "back" || betType == "lay") {
          $scope.removeAllBetSlip("remove");
        } else {
          $scope.removeAllBetSlip();
        }

        $("#fancyBetMarketList .lay-1").removeClass("select");
        $("#fancyBetMarketList .back-1").removeClass("select");
        $(".matchOddTable .select").removeClass("select");

        // $scope.currRunnerIndex = runnerIndex;

        if (isInplay == "false") {
          isInplay = 0;
        } else if (isInplay == "true") {
          isInplay = 1;
        }

        $scope.oneClicked = localStorage.getItem("oneclick");

        if ($scope.oneClicked !== "true") {
          $(
            "#fullSelection_" +
              $filter("removeSpace")(runnerName) +
              " #" +
              betSlipIndex
          ).addClass("select");
        }

        $scope.betType = betType;
        $scope.runnerName = runnerName;
        $scope.selectionId = selectionId;
        $scope.matchName = matchName;
        $scope.odds = odds;
        $scope.mktId = mktid;
        console.log(mktid);
        $scope.mtid = mtid;
        $scope.fancyRate = fancyRate;
        $scope.fancyId = fancyId;
        if ($rootScope.default_stake == undefined) {
          $rootScope.default_stake = "";
        }
        $scope.stake = $rootScope.default_stake;
        if ($scope.stake != "" || $scope.stake != 0) {
          if ($scope.betType == "back" || $scope.betType == "lay") {
            $scope.profit = (
              (parseFloat($scope.odds) - 1) *
              parseFloat($scope.stake)
            ).toFixed();
          } else if ($scope.betType == "yes" || $scope.betType == "no") {
            $scope.profit = (
              (parseFloat($scope.fancyRate) * parseFloat($scope.stake)) /
              100
            ).toFixed(2);
          } else if (
            ($scope.betType == "backBook" || $scope.betType == "layBook")
          ) {
            $scope.profit = (
              (parseFloat($scope.odds) / 100) *
              parseFloat($scope.stake)
            ).toFixed(2);
          } else if (
            ($scope.betType == "backBook" || $scope.betType == "layBook") &&
            matchBfId == 2
          ) {
            $scope.profit = (
              (parseFloat($scope.odds) - 1) *
              parseFloat($scope.stake)
            ).toFixed(2);
          }
        } else {
          $scope.profit = "0.00";
        }

        // console.log($scope.backBetSlipList)
        // console.log($scope.layBetSlipList)

        if (betType == "back" || betType == "yes" || betType == "backBook") {
          var backMatcheData = {
            matchname: matchName,
            selectionId: selectionId,
            isInplay: isInplay,
            bfId: bfId,
            booktype: matchBfId,
            marketId: $scope.mktId,
            matchId: $scope.mtid,
            marketName,
            backBetSlipData: [],
            yesBetSlipData: [],
            backBookBetSlipData: [],
          };
          $scope.backBetSlipDataArray.push(backMatcheData);
          $scope.backBetSlipDataArray = $scope.removeDuplicates(
            $scope.backBetSlipDataArray
          );
        } else if (
          betType == "lay" ||
          betType == "no" ||
          betType == "layBook"
        ) {
          var layMatcheData = {
            matchname: matchName,
            selectionId: selectionId,
            isInplay: isInplay,
            bfId: bfId,
            booktype: matchBfId,
            marketId: $scope.mktId,
            matchId: $scope.mtid,
            marketName,
            layBetSlipData: [],
            noBetSlipData: [],
            layBookBetSlipData: [],
          };
          // console.log(layMatcheData);
          $scope.layBetSlipDataArray.push(layMatcheData);
          $scope.layBetSlipDataArray = $scope.removeDuplicates(
            $scope.layBetSlipDataArray
          );
        }

        if (
          $scope.oneClicked == "true" &&
          ($scope.betType == "back" || $scope.betType == "lay")
        ) {
          $("#betslip_open").addClass("close");
          $("#processingImg_OneClickBet").css("display", "block");

          var oneClickMOData = {
            backlay: betType,
            sportId: sportId,
            matchBfId: matchBfId,
            bfId: bfId,
            marketId: $scope.mktId,
            matchId: $scope.mtid,
            runnerName: runnerName,
            selectionId: selectionId,
            matchName: matchName,
            odds: odds,
            stake: $scope.oneClickStake[$scope.selected_Stake_btn],
            // profit: $scope.profit
          };
          // console.log(oneClickMOData);
          $scope.oneClickPlaceMOBet(oneClickMOData);
          return false;
        }

        if ($scope.betType == "back") {
          var backBetSlipExist = $scope.backBetSlipList.indexOf(betSlipIndex);

          if (backBetSlipExist == -1) {
            var betSlipData = {
              backlay: betType,
              sportId: sportId,
              matchBfId: matchBfId,
              bfId: bfId,
              marketId: $scope.mktId,
              matchId: $scope.mtid,
              runnerName: runnerName,
              selectionId: selectionId,
              matchName: matchName,
              odds: odds,
              stake: $scope.stake,
              profit: $scope.profit,
            };
            // console.log(betSlipData);
            $scope.backBetSlipList.push(betSlipIndex);
            $scope.calcExposure(mktid, betSlipData);
            $.each($scope.backBetSlipDataArray, function (index, value) {
              if (value.matchname == matchName) {
                $scope.backBetSlipDataArray[index].backBetSlipData.push(
                  betSlipData
                );
                // console.log($scope.backBetSlipDataArray)
              }
            });
          }
          // $scope.backBetSlipVisible = true;
        } else if ($scope.betType == "lay") {
          var layBetSlipExist = $scope.layBetSlipList.indexOf(betSlipIndex);

          if (layBetSlipExist == -1) {
            var betSlipData = {
              backlay: betType,
              sportId: sportId,
              matchBfId: matchBfId,
              bfId: bfId,
              marketId: $scope.mktId,
              matchId: $scope.mtid,
              runnerName: runnerName,
              selectionId: selectionId,
              matchName: matchName,
              odds: odds,
              stake: $scope.stake,
              profit: $scope.profit,
            };
            // console.log(betSlipData);
            $scope.layBetSlipList.push(betSlipIndex);
            $scope.calcExposure(mktid, betSlipData);
            $.each($scope.layBetSlipDataArray, function (index, value) {
              if (value.matchname == matchName) {
                $scope.layBetSlipDataArray[index].layBetSlipData.push(
                  betSlipData
                );
                // console.log($scope.layBetSlipDataArray)
              }
            });
          }
        } else if ($scope.betType == "yes") {
          var yesBetSlipExist = $scope.yesBetSlipList.indexOf(betSlipIndex);

          if (yesBetSlipExist == -1) {
            var betSlipData = {
              matchName: matchName,
              marketId: $scope.mktId,
              matchId: $scope.mtid,
              fancyId: fancyId,
              rate: fancyRate,
              runnerName: runnerName,
              selectionId: selectionId,
              score: odds,
              stake: $scope.stake,
              yesno: betType,
              profit: $scope.profit,
            };
            $scope.yesBetSlipList.push(betSlipIndex);

            $.each($scope.backBetSlipDataArray, function (index, value) {
              if (value.matchname == matchName) {
                $scope.backBetSlipDataArray[index].yesBetSlipData.push(
                  betSlipData
                );
                console.log($scope.backBetSlipDataArray);
              }
            });
          }
        } else if ($scope.betType == "no") {
          var noBetSlipExist = $scope.noBetSlipList.indexOf(betSlipIndex);

          if (noBetSlipExist == -1) {
            betSlipData = {
              matchName: matchName,
              marketId: $scope.mktId,
              matchId: $scope.mtid,
              fancyId: fancyId,
              rate: fancyRate,
              runnerName: runnerName,
              selectionId: selectionId,
              score: odds,
              stake: $scope.stake,
              yesno: betType,
              profit: $scope.profit,
            };
            $scope.noBetSlipList.push(betSlipIndex);
            $.each($scope.layBetSlipDataArray, function (index, value) {
              if (value.matchname == matchName) {
                $scope.layBetSlipDataArray[index].noBetSlipData.push(
                  betSlipData
                );
                // console.log($scope.layBetSlipDataArray)
              }
            });
          }
        } else if ($scope.betType == "backBook") {
          var backBookBetSlipExist = $scope.backBookBetSlipList.indexOf(
            betSlipIndex
          );

          if (backBookBetSlipExist == -1) {
            var betBookSlipData = {
              matchName: matchName,
              backlay: $scope.betType,
              marketId: $scope.mktId,
              eventId: $scope.mtid,
              mktname: bfId,
              // info:",
              odds: odds,
              runnerId: fancyId,
              runnerName: runnerName,
              selectionId: selectionId,
              // source:",
              stake: $scope.stake,
              profit: $scope.profit,
            };

            $scope.backBookBetSlipList.push(betSlipIndex);
            $scope.calcExposure(mktid, betBookSlipData);

            $.each($scope.backBetSlipDataArray, function (index, value) {
              if (value.matchname == matchName) {
                $scope.backBetSlipDataArray[index].backBookBetSlipData.push(
                  betBookSlipData
                );
                console.log($scope.backBetSlipDataArray);
              }
            });
          }
        } else if ($scope.betType == "layBook") {
          var layBookBetSlipExist = $scope.layBookBetSlipList.indexOf(
            betSlipIndex
          );

          if (layBookBetSlipExist == -1) {
            var betBookSlipData = {
              matchName: matchName,
              backlay: $scope.betType,
              marketId: $scope.mktId,
              eventId: $scope.mtid,
              mktname: bfId,
              // info:",
              odds: odds,
              runnerId: fancyId,
              runnerName: runnerName,
              selectionId: selectionId,
              // source:",
              stake: $scope.stake,
              profit: $scope.profit,
            };

            $scope.layBookBetSlipList.push(betSlipIndex);
            $scope.calcExposure(mktid, betBookSlipData);

            $.each($scope.layBetSlipDataArray, function (index, value) {
              if (value.matchname == matchName) {
                $scope.layBetSlipDataArray[index].layBookBetSlipData.push(
                  betBookSlipData
                );
                console.log($scope.layBetSlipDataArray);
              }
            });
          }
        }
        $scope.calculateLiability();
      };

      $scope.backTeenSlipDataArray = [];
      $rootScope.cards = [];
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
        if ($scope.placeTPData.stake != "" || $scope.placeTPData.stake != 0) {
          if (
            $scope.placeTPData.backlay == "back" ||
            $scope.placeTPData.backlay == "lay"
          ) {
            if ($scope.placeTPData.gameType === "-12") {
              let odds = parseFloat($scope.placeTPData.odds) / 100 + 1;
              $scope.placeTPData.profit = (
                (parseFloat(odds) - 1) *
                parseFloat($scope.placeTPData.stake)
              ).toFixed();
            } else {
              $scope.placeTPData.profit = (
                (parseFloat($scope.placeTPData.odds) - 1) *
                parseFloat($scope.placeTPData.stake)
              ).toFixed();
            }
          }
        } else {
          $scope.profit = "0.00";
        }
        $scope.backTeenSlipDataArray.push($scope.placeTPData);
        $scope.backTeenSlipDataArray = $scope.removeDuplicates(
          $scope.backTeenSlipDataArray
        );

        $(".back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3").removeClass("select");
        var element = angular.element(event.currentTarget);
        element.addClass("select");
      };

      $rootScope.fancystake = [500, 1000, 5000, 10000, 50000, 100000];
      $scope.fancybetSlip = function (
        betType,
        betSlipIndex,
        runnerName,
        selectionId,
        matchName,
        odds,
        mktid,
        mtid,
        isInplay,
        fancyRate,
        fancyId,
        sportId,
        matchBfId,
        bfId
      ) {
        console.table(
          betType,
          ",",
          betSlipIndex,
          ",",
          runnerName,
          ",",
          selectionId,
          ",",
          matchName,
          ",",
          odds,
          ",",
          mktid,
          ",",
          mtid,
          ",",
          isInplay,
          ",",
          fancyRate,
          ",",
          fancyId,
          ",",
          sportId,
          ",",
          matchBfId
        );
        $scope.Odds = parseInt(odds).toFixed(0);
        $scope.fancyRate = parseInt(fancyRate).toFixed(0);
        // console.log($scope.Odds,$scope.fancyRate);
        $scope.oneClicked = localStorage.getItem("oneclick");
        $("#fancyBetMarketList .lay-1").removeClass("select");
        $("#fancyBetMarketList .back-1").removeClass("select");
        $("#fancyBetMarketList .fancy-quick-tr").css("display", "none");
        $("#inputStake_NO_" + fancyId + "").val("");
        $("#inputStake_YES_" + fancyId + "").val("");
        $("#placeBet_YES_" + fancyId + "").addClass("disable");
        $("#placeBet_NO_" + fancyId + "").addClass("disable");
        $("#after .to-win").css("display", "inline");

        if ($scope.oneClicked == null) {
          if (betType == "no") {
            console.log("#lay_" + fancyId);
            $("#lay_" + fancyId).addClass("select");
            $("#fancyBetBoard_" + fancyId + "_lay").css("display", "table-row");
          } else {
            console.log("#back_" + fancyId);
            $("#back_" + fancyId).addClass("select");
            $("#fancyBetBoard_" + fancyId + "_back").css(
              "display",
              "table-row"
            );
          }
        } else {
          $scope.oneclickbetdata = {
            fancyId: fancyId,
            matchBfId: matchBfId,
            matchId: mtid,
            marketId: mktid,
            rate: $scope.fancyRate,
            runnerName: runnerName,
            score: $scope.Odds,
            stake: $scope.oneClickStake[$scope.selected_Stake_btn],
            yesno: betType,
            mktBfId: bfId,
          };
          $scope.OneclickFancyBet($scope.oneclickbetdata);
        }
      };

      $rootScope.removefancybetslip = function (betslipid, betstype) {
        if (betstype == "no") {
          $("#fancyBetBoard_" + betslipid + "_lay").css("display", "none");
          $("#fancyBetMarketList .lay-1").removeClass("select");
        } else {
          $("#fancyBetMarketList .back-1").removeClass("select");
          $("#fancyBetBoard_" + betslipid + "_back").css("display", "none");
        }
        if (betstype == "") {
          $("#fancyBetMessage_" + betslipid).css("display", "none");
          // $("#fancyBetMarketList .back-1").removeClass("select");
          //    $("#fancyBetBoard_"+betslipid+"_back").css("display","none");
          //    $("#fancyBetMarketList .lay-1").removeClass("select");
          //    $("#fancyBetBoard_"+betslipid+"_lay").css("display","none");
        }
      };

      $rootScope.removeRunningfancybetslip = function (betslipid) {
        if ($("#lay_" + betslipid + "").hasClass("select")) {
          $("#lay_" + betslipid + "").removeClass("select");
        }
        if ($("#back_" + betslipid + "").hasClass("select")) {
          $("#back_" + betslipid + "").removeClass("select");
        }
        $("#fancyBetBoard_" + betslipid + "_lay").css("display", "none");
        $("#fancyBetBoard_" + betslipid + "_back").css("display", "none");
        $("#fancyBetMessage_" + betslipid).css("display", "none");
      };

      $scope.selectStake = function (stake, fancyId, selectiontype) {
        if (selectiontype == "no") {
          $("#inputStake_NO_" + fancyId + "").val(stake);
          $("#placeBet_NO_" + fancyId + "").removeClass("disable");
        } else {
          $("#inputStake_YES_" + fancyId + "").val(stake);
          $("#placeBet_YES_" + fancyId + "").removeClass("disable");
        }
      };

      $scope.FancyStakechange = function (stake, fancyId) {
        // console.log(stake)
        if (stake == null || stake == undefined) {
          $("#placeBet_YES_" + fancyId + "").addClass("disable");
        } else {
          $("#placeBet_YES_" + fancyId + "").removeClass("disable");
        }
        if (stake == null || stake == undefined) {
          $("#placeBet_NO_" + fancyId + "").addClass("disable");
        } else {
          $("#placeBet_NO_" + fancyId + "").removeClass("disable");
        }
      };

      $scope.placeFancyBet = function (
        betType,
        betSlipIndex,
        runnerName,
        selectionId,
        matchName,
        fancyRate,
        mktid,
        mtid,
        isInplay,
        odds,
        fancyId,
        sportId,
        matchBfId,
        bfId
      ) {
        // console.log(betType, betSlipIndex, runnerName, matchName, odds, mktid, mtid,isInplay, fancyRate, fancyId,sportId,matchBfId,bfId);
        if (
          $rootScope.authcookie == undefined ||
          $rootScope.authcookie == null
        ) {
          // Relogin()
          toastr.info("Token was expired. Please login to continue.");
          return false;
        }
        $scope.Odds = parseInt(odds).toFixed(0);
        $scope.fancyRate = parseInt(fancyRate).toFixed(0);
        var stake;
        if (betType == "no") {
          stake = $("#inputStake_NO_" + fancyId + "").val();
          $("#placeBet_NO_" + fancyId + "").attr("disabled");
        } else {
          stake = $("#inputStake_YES_" + fancyId + "").val();
          $("#placeBet_YES_" + fancyId + "").attr("disabled");
        }

        // Odds is rate and runs is score
        let betData1 = {
          marketId: mktid,
          odds: +odds,
          runs: +fancyRate,
          stake: +stake,
          betType: betType,
          gameType: "fancy",
        };
        $scope.removefancybetslip(fancyId, betType);
        $("#fancyBetBar_" + fancyId + "").css("display", "table-row");
        $rootScope.progress();
        $rootScope.remainseconds();
        // $timeout(function () {
        $http({
          url: baseUrl + "/placeBets",
          method: "POST",
          headers: {
            Authorization: authtoken,
          },
          data: betData1,
        }).then(
          function mySuccess(response) {
            if (response.data.errorCode == 0) {
              setTimeout(() => {
                $scope.getBalance();
                $scope.GetBets();
                $rootScope.getFancyExposure();
              }, 1500);
              $("#fancyBetBar_" + fancyId + "").css("display", "none");
              $("#betslip_open").addClass("close");
              $("#header_" + fancyId).text(response.data.errorDescription);
              $(
                "#fancyBetMessage_" + fancyId + " .quick_bet-message"
              ).removeClass("error");
              $("#fancyBetMessage_" + fancyId + " .quick_bet-message").addClass(
                "success"
              );
              $("#fancyBetMessage_" + fancyId + "").css("display", "table-row");
              setTimeout(() => {
                $(
                  "#fancyBetMessage_" + fancyId + " .quick_bet-message"
                ).removeClass("success");
                $("#fancyBetMessage_" + fancyId + "").css("display", "none");
              }, 3000);
              $("#placeBet_YES_" + fancyId + "").removeAttr("disabled");
              $("#placeBet_NO_" + fancyId + "").removeAttr("disabled");
            } else {
              $("#header_" + fancyId).text(response.data.errorDescription);
              $("#fancyBetBar_" + fancyId + "").css("display", "none");
              $(
                "#fancyBetMessage_" + fancyId + " .quick_bet-message"
              ).removeClass("success");
              $("#fancyBetMessage_" + fancyId + " .quick_bet-message").addClass(
                "error"
              );
              setTimeout(() => {
                $(
                  "#fancyBetMessage_" + fancyId + " .quick_bet-message"
                ).removeClass("error");
                $("#fancyBetMessage_" + fancyId + "").css("display", "none");
              }, 3000);
              $("#fancyBetMessage_" + fancyId + "").css("display", "table-row");
              $("#placeBet_YES_" + fancyId + "").removeAttr("disabled");
              $("#placeBet_NO_" + fancyId + "").removeAttr("disabled");
            }
          },
          function myError(error) {
            if (error.status == 401) {
              // $.removeCookie("authtoken");
              // window.location.href="index.html"
            }
            if (error.status == 400) {
              toastr.error("Unable to Place Bet!");
            }
          }
        );
        // }, 3000);
      };
      $scope.showinfobet = false;
      $scope.showinfobetfunc = function (sbetinfo) {
        if (sbetinfo) {
          $("#Matchedbets .matched").css("display", "block");
        } else {
          $("#Matchedbets .matched").css("display", "none");
        }
      };
      $scope.showinfobet = false;
      $scope.consolidatefunc = function (consoli) {
        if (consoli) {
          $("#Matchedbets .consolidated").css("display", "block");
        } else {
          $("#Matchedbets .consolidated").css("display", "none");
        }
      };

      $scope.OneclickFancyBet = function (betdata) {
        $("#fancyBetBar_" + betdata.fancyId + "").css("display", "table-row");
        $scope.progress();
        $scope.remainseconds();
        let betData1 = {
          marketId: betdata.marketId,
          odds: +betdata.rate,
          runs: +betdata.score,
          stake: +betdata.stake,
          betType: betdata.yesno,
          gameType: "fancy",
        };
        $http({
          url: baseUrl + "/placeBets",
          method: "POST",
          headers: {
            Authorization: authtoken,
          },
          data: betData1,
        }).then(
          function mySuccess(response) {
            if (response.data.errorCode == 0) {
              $scope.getBalance();
              $scope.GetBets();
              setTimeout(() => {
                $scope.getBalance();
                $scope.GetBets();
                $rootScope.getFancyExposure(betdata.fancyId, betdata.runnerName);
              }, 1000);
              $("#fancyBetBar_" + betdata.fancyId + "").css("display", "none");
              $("#betslip_open").addClass("close");
              $("#header_" + betdata.fancyId).text(
                response.data.errorDescription
              );
              $(
                "#fancyBetMessage_" + betdata.fancyId + " .quick_bet-message"
              ).removeClass("error");
              $(
                "#fancyBetMessage_" + betdata.fancyId + " .quick_bet-message"
              ).addClass("success");
              $("#fancyBetMessage_" + betdata.fancyId + "").css(
                "display",
                "table-row"
              );
              setTimeout(() => {
                $(
                  "#fancyBetMessage_" + fancyId + " .quick_bet-message"
                ).removeClass("success");
                $("#fancyBetMessage_" + fancyId + "").css("display", "none");
              }, 3000);
            } else {
              $("#fancyBetBar_" + betdata.fancyId + "").css("display", "none");
              $("#header_" + betdata.fancyId).text(response.data.result);
              $(
                "#fancyBetMessage_" + betdata.fancyId + " .quick_bet-message"
              ).removeClass("success");
              $(
                "#fancyBetMessage_" + betdata.fancyId + " .quick_bet-message"
              ).addClass("error");
              $("#fancyBetMessage_" + betdata.fancyId + "").css(
                "display",
                "table-row"
              );
              setTimeout(() => {
                $(
                  "#fancyBetMessage_" + fancyId + " .quick_bet-message"
                ).removeClass("error");
                $("#fancyBetMessage_" + fancyId + "").css("display", "none");
              }, 3000);
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

      $scope.livestreaming = function () {
        if (
          $rootScope.authcookie == undefined ||
          $rootScope.authcookie == null
        ) {
          // Relogin()
          toastr.info("Token was expired. Please login to continue.");
          return false;
        } else {
          if ($location.path().split("/").indexOf("full-market") > -1) {
            window.open(
              "tv.html?mtid=" +
                $routeParams.matchId +
                "&mktid=" +
                $routeParams.marketId,
              "_blank",
              "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width=500,height=300"
            );
          }
        }
      };

      $scope.myMarkets = function () {
        $("#myMarketModal").css("display", "block");

        $http({
          url:
            "http://www.lcexchanges247.com/Client/BetClient.svc/Bets/MyMarket",
          method: "GET",
          headers: {
            Authorization: authtoken,
          },
        }).then(
          function mySuccess(response) {
            $scope.MyMarketData = response.data.data;
          },
          function myError(error) {
            if (error.status == 401) {
              // $.removeCookie("authtoken");
              // window.location.href="index.html"
            }
          }
        );
      };

      $scope.myMarketClose = function () {
        $("#myMarketModal").css("display", "none");
      };
      $scope.multimarketIds = [];
      $rootScope.addMultiMkt = function (marketid) {
        if (
          $rootScope.authcookie == undefined ||
          $rootScope.authcookie == null
        ) {
          // Relogin()
          toastr.info("Please login for adding matches in multimarket");
          return false;
        }
        if ($scope.multimarketIds.indexOf(marketid) == -1) {
          $scope.multimarketIds.push(marketid);
        }
        localStorage.setItem(
          "Multimarkets",
          JSON.stringify($scope.multimarketIds)
        );
        toastr.success("Added to Multimarkets!");
        // $http({
        //     url:'http://www.lcexchanges247.com/Client/BetClient.svc/Data/AddMultiMkt?id='+marketid,
        //     method:'POST',
        //     headers:{
        //         Token:authtoken
        //     }
        // })
        // .then(function mySuccess(response){

        //     if (response.data.status=="Success") {
        //         toastr.success(response.data.result)
        //         $rootScope.MktData()
        //         // if($location.path().split('/').indexOf('full-market') > -1){
        //         //     $rootScope.$emit("callMktData", {})
        //         // }

        //     }
        //     else{
        //         toastr.error(response.data.result)
        //     }

        // },function myError(error){
        //     if (error.status==401) {
        //         window.location.href="index.html"
        //     }
        // })
      };
      $rootScope.removeMultiMkt = function (marketid) {
        $scope.multimarketIds = JSON.parse(
          localStorage.getItem("Multimarkets")
        );
        if ($scope.multimarketIds.indexOf(marketid) > -1) {
          $scope.multimarketIds.splice(
            $scope.multimarketIds.indexOf(marketid),
            1
          );
        }

        localStorage.setItem(
          "Multimarkets",
          JSON.stringify($scope.multimarketIds)
        );

        if ($location.path().split("/").indexOf("multiMarkets") > -1) {
          $rootScope.getMultiMarkets();
        }
        toastr.success("Removed From Multimarkets!");
        // $http({
        //     url:'http://www.lcexchanges247.com/Client/BetClient.svc/Data/RemoveMultiMkt?id='+marketid,
        //     method:'POST',
        //     headers:{
        //         Token:authtoken
        //     }
        // })
        // .then(function mySuccess(response){

        //     if (response.data.status=="Success") {
        //         toastr.success(response.data.result)
        //         if($location.path().split('/').indexOf('multiMarkets') > -1){
        //             $rootScope.getMultiMarkets();
        //         }
        //         $rootScope.MktData()
        //     }
        //     else{
        //         toastr.error(response.data.result)
        //     }

        // },function myError(error){
        //     if (error.status==401) {
        //         window.location.href="index.html"
        //     }
        // })
      };
      $scope.oneClickStake = [100, 200, 300, 500];

      $scope.changeStakeVal = function (val, index) {
        // console.log(val,index)
        $scope.oneClickStake[index] = val;

        // console.log($scope.oneClickStake)
      };

      $scope.showOneClickEdit = function () {
        $("#oneClickBetStakeBox").css("display", "none");
        $("#editOneClickBetStakeBox").css("display", "block");

        // $scope.editStake=true
        // $scope.editStake=true
      };

      $scope.selected_Stake_btn = 0;

      $scope.selectStakeButton = function (index) {
        $scope.selected_Stake_btn = index;
      };

      $scope.oneClickStake = [];
      $scope.getOneClickStake = function () {
        var OneClickStakeData = $.cookie("oneClickStakes");
        if (OneClickStakeData) {
          OneClickStakeData = JSON.parse(OneClickStakeData);
          $scope.oneClickStake[0] = +OneClickStakeData.stake1;
          $scope.oneClickStake[1] = +OneClickStakeData.stake2;
          $scope.oneClickStake[2] = +OneClickStakeData.stake3;
          $scope.oneClickStake[3] = +OneClickStakeData.stake4;
        } else {
          $scope.oneClickStake[0] = 100;
          $scope.oneClickStake[1] = 200;
          $scope.oneClickStake[2] = 300;
          $scope.oneClickStake[3] = 500;
        }
      };
      $scope.saveOneClickStake = function () {
        if (
          $scope.oneClickStake[0] == "" ||
          $scope.oneClickStake[1] == "" ||
          $scope.oneClickStake[2] == "" ||
          $scope.oneClickStake[3] == ""
        ) {
          toastr.error("Please Enter stake value!");
          return false;
        }

        var OneClickStakeData = {
          stake1: $scope.oneClickStake[0],
          stake2: $scope.oneClickStake[1],
          stake3: $scope.oneClickStake[2],
          stake4: $scope.oneClickStake[3],
        };

        $.cookie("oneClickStakes", JSON.stringify(OneClickStakeData));
        $("#editOneClickBetStakeBox").css("display", "none");
        $("#oneClickBetStakeBox").css("display", "block");

        toastr.success("Saved One Click Bet Stakes.");
      };

      $scope.getOneClickStake();

      $scope.cancelSetting = function () {
        $scope.GetSettings();
      };

      $scope.defaultStakeChange = function (default_stake) {
        $rootScope.default_stake = default_stake;
      };

      $scope.SaveSetting = function () {
        // console.log($scope.odds)
        if ($scope.oddsval == true) {
          $scope.oddsvalchk = 1;
        } else {
          $scope.oddsvalchk = 0;
        }
        if ($rootScope.default_stake == "") {
          $rootScope.default_stake = 0;
        }
        $.cookie("default_stake", JSON.stringify($rootScope.default_stake));
        toastr.success("Saved Settings");
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

      $scope.oneClickPlaceMOBet = function (betData) {
        $("#loading_place_bet").css("display", "block");
        $("#betslip_open").removeClass("close");
        // betData["source"] = 'web';

        // betData["info"] = 'os:' + jscd.os + ', os_version:' + jscd.osVersion + ', browser:' + jscd.browser + ', browser_version:' + jscd.browserMajorVersion;
        $scope.removeAllBetSlip();
        // console.log(betData)

        let betData1 = {
          marketId: betData.marketId,
          selId: betData.selectionId,
          odds: betData.odds,
          stake: +betData.stake,
          betType: betData.backlay,
          gameType: "exchange",
        };

        $http({
          method: "POST",
          url: baseUrl + "/placeBets",
          headers: {
            Authorization: authtoken,
          },
          data: betData1,
        }).then(
          function mySuccess(response) {
            if (response.data.errorCode == 0) {
              $("#processingImg_OneClickBet").css("display", "none");
              $("#loading_place_bet").css("display", "none");
              $("#betslip_open").addClass("close");
              $scope.getBalance();
              $scope.GetBets();
              $rootScope.ExposureBook(betData1.marketId);
              setTimeout(() => {
                $scope.getBalance();
                $scope.GetBets();
                $rootScope.ExposureBook(betData1.marketId);
              }, 1000);
              // $rootScope.ExposureBook(betData1.marketId);
              toastr.success(response.data.errorDescription);
            } else {
              toastr.error(response.data.errorDescription);
              $("#processingImg_OneClickBet").css("display", "none");
              $("#loading_place_bet").css("display", "none");
              $("#betslip_open").addClass("close");
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
      $scope.clearStake = function (bet) {
        // console.log(bet)
        bet.stake = "";
        bet.profit = "0.00";
        $scope.calculateLiability();

        // if( type == "back"){
        // }
        // $('#backStake'+index).val("")
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

      $scope.incrementOdd = function (val, backlay, index, parentIndex) {
        $scope.currentOdds = parseFloat(val);

        $scope.diff = $scope.oddsDiffCalculate($scope.currentOdds);

        $scope.newOdds = $scope.currentOdds + $scope.diff;
        $scope.newOdds = $scope.newOdds.toFixed(2);

        if (backlay == "back" || backlay == "BACK") {
          $scope.backBetSlipDataArray[parentIndex].backBetSlipData[index].odds =
            $scope.newOdds;

          var stake =
            $scope.backBetSlipDataArray[parentIndex].backBetSlipData[index]
              .stake;
          if (stake == "") {
            stake = 0;
          }
          var pnl = (parseFloat($scope.newOdds) - 1) * parseFloat(stake);
          // if (isNaN(pnl)) {
          //  pnl='0.00';
          // }
          $scope.backBetSlipDataArray[parentIndex].backBetSlipData[
            index
          ].profit = pnl.toFixed(2);

          // console.log($scope.backBetSlipDataArray)
        } else if (backlay == "lay" || backlay == "LAY") {
          $scope.layBetSlipDataArray[parentIndex].layBetSlipData[index].odds =
            $scope.newOdds;

          var stake =
            $scope.layBetSlipDataArray[parentIndex].layBetSlipData[index].stake;
          if (stake == "") {
            stake = 0;
          }
          var pnl = (parseFloat($scope.newOdds) - 1) * parseFloat(stake);
          $scope.layBetSlipDataArray[parentIndex].layBetSlipData[
            index
          ].profit = pnl.toFixed(2);

          // console.log($scope.layBetSlipDataArray)
        }
        $scope.calcExposure($scope.ExpoMktid, $scope.bets);
      };

      $scope.incrementoddUM = function (
        odds,
        backlay,
        index,
        prestake,
        preodds
      ) {
        if (backlay == "BACK") {
          $scope.currentOdds = $("#oddsBackUM_" + index + "").val();
        } else {
          $scope.currentOdds = $("#oddsLayUM_" + index + "").val();
        }
        $scope.diff = $scope.oddsDiffCalculate($scope.currentOdds);

        $scope.newOdds = parseFloat($scope.currentOdds) + $scope.diff;
        $scope.newOdds = $scope.newOdds.toFixed(2);
        if (backlay == "BACK") {
          $("#oddsBackUM_" + index + "").val($scope.newOdds);
          var stake = $("#inputStakeBackUM_" + index + "").val();
          if (stake == "") {
            stake = 0;
          }
          var pnl = (parseFloat($scope.newOdds) - 1) * parseFloat(stake);
          $("#profitLiabilityBackUM_" + index + "").text(pnl.toFixed(2));
        }
        if (backlay == "LAY") {
          $("#oddsLayUM_" + index + "").val($scope.newOdds);
          var stake = $("#inputStakeLayUM_" + index + "").val();
          if (stake == "") {
            stake = 0;
          }
          var pnl = (parseFloat($scope.newOdds) - 1) * parseFloat(stake);
          $("#profitLiabilityLayUM_" + index + "").text(pnl.toFixed(2));
        }
      };

      $scope.decrementOdd = function (val, backlay, index, parentIndex) {
        // var currentOdds=parseFloat($(this).val())
        // console.log(val)
        // console.log(backlay)
        // console.log(index)
        // console.log(parentIndex)

        if (val <= 1.01) {
          $scope.backBet.odds = 1.01;
          $scope.layBet.odds = 1.01;
        }

        $scope.currentOdds = parseFloat(val);

        $scope.diff = $scope.oddsDiffCalculate($scope.currentOdds);

        $scope.newOdds = $scope.currentOdds - $scope.diff;
        $scope.newOdds = $scope.newOdds.toFixed(2);

        if (backlay == "back") {
          $scope.backBetSlipDataArray[parentIndex].backBetSlipData[index].odds =
            $scope.newOdds;

          var stake =
            $scope.backBetSlipDataArray[parentIndex].backBetSlipData[index]
              .stake;
          if (stake == "") {
            stake = 0;
          }
          var pnl = (parseFloat($scope.newOdds) - 1) * parseFloat(stake);
          // if (isNaN(pnl)) {
          //  pnl='0.00';
          // }
          $scope.backBetSlipDataArray[parentIndex].backBetSlipData[
            index
          ].profit = pnl.toFixed(2);

          // console.log($scope.backBetSlipDataArray)
        } else if (backlay == "lay") {
          $scope.layBetSlipDataArray[parentIndex].layBetSlipData[index].odds =
            $scope.newOdds;

          var stake =
            $scope.layBetSlipDataArray[parentIndex].layBetSlipData[index].stake;
          if (stake == "") {
            stake = 0;
          }
          var pnl = (parseFloat($scope.newOdds) - 1) * parseFloat(stake);
          // if (isNaN(pnl)) {
          //  pnl='0.00';
          // }
          $scope.layBetSlipDataArray[parentIndex].layBetSlipData[
            index
          ].profit = pnl.toFixed(2);

          // console.log($scope.layBetSlipDataArray)
        }
        $scope.calcExposure($scope.ExpoMktid, $scope.bets);
      };

      $scope.decrementOddUM = function (
        odds,
        backlay,
        index,
        prestake,
        preodds
      ) {
        if (backlay == "BACK") {
          $scope.currentOdds = $("#oddsBackUM_" + index + "").val();
        } else {
          $scope.currentOdds = $("#oddsLayUM_" + index + "").val();
        }
        $scope.diff = $scope.oddsDiffCalculate($scope.currentOdds);

        $scope.newOdds = parseFloat($scope.currentOdds) - $scope.diff;
        $scope.newOdds = $scope.newOdds.toFixed(2);
        if (backlay == "BACK") {
          if (parseFloat($scope.newOdds) <= 1.01) {
            $("#oddsBackUM_" + index + "").val(1.01);
          } else {
            $("#oddsBackUM_" + index + "").val($scope.newOdds);
          }
          var stake = $("#inputStakeBackUM_" + index + "").val();
          if (stake == "") {
            stake = 0;
          }
          var pnl = (parseFloat($scope.newOdds) - 1) * parseFloat(stake);
          $("#profitLiabilityBackUM_" + index + "").text(pnl.toFixed(2));
        }
        if (backlay == "LAY") {
          if (parseFloat($scope.newOdds) <= 1.01) {
            $("#oddsLayUM_" + index + "").val(1.01);
          } else {
            $("#oddsLayUM_" + index + "").val($scope.newOdds);
          }
          var stake = $("#inputStakeLayUM_" + index + "").val();
          if (stake == "") {
            stake = 0;
          }
          var pnl = (parseFloat($scope.newOdds) - 1) * parseFloat(stake);
          $("#profitLiabilityLayUM_" + index + "").text(pnl.toFixed(2));
        }
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

      $scope.cancelAllUnMatchbet = function () {
        $("#unMatchTicketList").css("display", "block");
        $("#unMatchFullBtn").css("display", "block");
        $("#editUnMatchedList").css("display", "none");
      };
      $scope.editAllUMBets = function () {
        angular.forEach($scope.unMatchedData, function (item) {
          $("#oddsBackUM_" + item.id + "").val(item.odds);
          $("#inputStakeBackUM_" + item.id + "").val(item.stake);
          $("#oddsLayUM_" + item.id + "").val(item.odds);
          $("#inputStakeLayUM_" + item.id + "").val(item.stake);
          var pnl = (parseFloat(item.odds) - 1) * parseFloat(item.stake);
          $("#profitLiabilityBackUM_" + item.id + "").text(pnl.toFixed(2));
          $("#profitLiabilityLayUM_" + item.id + "").text(pnl.toFixed(2));
        });
        $("#unMatchTicketList").css("display", "none");
        $("#unMatchFullBtn").css("display", "none");
        $("#editUnMatchedList").css("display", "block");
      };
      $scope.resetUMbet = function (index, id, backlay, odds, stake) {
        if (backlay == "BACK") {
          $("#oddsBackUM_" + id + "").val(odds);
          $("#inputStakeBackUM_" + id + "").val(stake);
          var pnl = (parseFloat(odds) - 1) * parseFloat(stake);
          $("#profitLiabilityBackUM_" + id + "").text(pnl.toFixed(2));
        } else {
          $("#oddsLayUM_" + id + "").val(odds);
          $("#inputStakeLayUM_" + id + "").val(stake);
          var pnl = (parseFloat(odds) - 1) * parseFloat(stake);
          $("#profitLiabilityLayUM_" + id + "").text(pnl.toFixed(2));
        }
        // $("#unMatchTicketList").css('display','block');
        // $("#unMatchFullBtn").css('display','block');
        // $("#editUnMatchedList").css('display','none');
      };
      $scope.EditMOBet = function (index, id, backlay) {
        if (backlay == "BACK") {
          $scope.OddsUM = $("#oddsBackUM_" + id + "").val();
          $scope.StakeUM = $("#inputStakeBackUM_" + id + "").val();
        } else {
          $scope.OddsUM = $("#oddsLayUM_" + id + "").val();
          $scope.StakeUM = $("#inputStakeLayUM_" + id + "").val();
        }

        $scope.source = "web";
        $scope.info =
          "os:" +
          jscd.os +
          ", os_version:" +
          jscd.osVersion +
          ", browser:" +
          jscd.browser +
          ", browser_version:" +
          jscd.browserMajorVersion;
        $scope.betData = {
          betId: id,
          info: $scope.info,
          odds: $scope.OddsUM,
          source: $scope.source,
          stake: $scope.StakeUM,
        };

        $http({
          method: "POST",
          url:
            "http://www.lcexchanges247.com/Client/BetClient.svc/Bets/EditMOBet",
          headers: {
            Authorization: authtoken,
          },
          data: $scope.betData,
        }).then(
          function mySuccess(response) {
            if (response.data.errorCode == 0) {
              $scope.getBalance();
              toastr.success(response.data.result);
              $("#processingImg_OneClickBet").css("display", "none");
              $("#unMatchTicketList").css("display", "block");
              $("#unMatchFullBtn").css("display", "block");
              $("#editUnMatchedList").css("display", "none");
            } else {
              toastr.error(response.data.result);
              $("#processingImg_OneClickBet").css("display", "none");
              $("#unMatchTicketList").css("display", "block");
              $("#unMatchFullBtn").css("display", "block");
              $("#editUnMatchedList").css("display", "none");
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

      $scope.closeBetSlip = function (index, type, parentIndex) {
        // console.log(index, type)
        if (type == "back") {
          $scope.backBetSlipList.splice(index, 1);
          $scope.backBetSlipDataArray[parentIndex].backBetSlipData.splice(
            index,
            1
          );
          if ($scope.ExpoMktid != undefined) {
            $scope.bets.stake = 0;
            $scope.bets.profit = 0;
          }
          $scope.calcExposure($scope.ExpoMktid, $scope.bets, "remove");
        } else if (type == "lay") {
          $scope.layBetSlipList.splice(index, 1);
          $scope.layBetSlipDataArray[parentIndex].layBetSlipData.splice(
            index,
            1
          );
          if ($scope.ExpoMktid != undefined) {
            $scope.bets.stake = 0;
            $scope.bets.profit = 0;
          }
          $scope.calcExposure($scope.ExpoMktid, $scope.bets, "remove");
        }
        if (type == "backBook") {
          $scope.backBookBetSlipList.splice(index, 1);
          $scope.backBetSlipDataArray[parentIndex].backBookBetSlipData.splice(
            index,
            1
            );
          $scope.calcExposure($scope.ExpoMktid, $scope.bets, "remove");
        } else if (type == "layBook") {
            $scope.layBookBetSlipList.splice(index, 1);
            $scope.layBetSlipDataArray[parentIndex].layBookBetSlipData.splice(
              index,
              1
              );
          $scope.calcExposure($scope.ExpoMktid, $scope.bets, "remove");
        }

        if (type == "yes") {
          $scope.yesBetSlipList.splice(index, 1);
          $scope.backBetSlipDataArray[parentIndex].yesBetSlipData.splice(
            index,
            1
          );
        } else if (type == "no") {
          $scope.noBetSlipList.splice(index, 1);
          $scope.layBetSlipDataArray[parentIndex].noBetSlipData.splice(
            index,
            1
          );
        }

        if (type == "back" || type == "yes" || type == "backBook") {
          if (
            $scope.backBetSlipDataArray[parentIndex].backBetSlipData.length ==
              0 &&
            $scope.backBetSlipDataArray[parentIndex].yesBetSlipData.length ==
              0 &&
            $scope.backBetSlipDataArray[parentIndex].backBookBetSlipData
              .length == 0
          ) {
            // console.log($scope.backBetSlipDataArray.length)
            $scope.backBetSlipDataArray.splice(parentIndex, 1);
          }
        } else if (type == "Teenback") {
          $scope.backTeenSlipDataArray.splice(index, 1);
          $rootScope.cards = [];
          $scope.placeTPData = null;
        } else {
          if (
            $scope.layBetSlipDataArray[parentIndex].layBetSlipData.length ==
              0 &&
            $scope.layBetSlipDataArray[parentIndex].noBetSlipData.length == 0 &&
            $scope.layBetSlipDataArray[parentIndex].layBookBetSlipData.length ==
              0
          ) {
            // console.log($scope.backBetSlipDataArray.length)
            $scope.layBetSlipDataArray.splice(parentIndex, 1);
          }
        }
        $scope.calculateLiability();
      };

      $scope.liabilities = "0.00";

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

      $scope.placedButton = false;

      $scope.placeBet = function () {
        if (
          $rootScope.authcookie == undefined ||
          $rootScope.authcookie == null
        ) {
          // Relogin()
          toastr.info("Token was expired. Please login to continue.");
          return false;
        }
        $("#loading_place_bet").css("display", "block");

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
                toastr.error("Please Select Atleast 3 Cards");
                $("#loading_place_bet").css("display", "none");
              } else {
                placeTpBet(item, key);
              }
            } else {
              placeTpBet(item, key);
            }
          });
        }
      };

      function placeBetFunc(betData, index) {
        // $('.loading').css('display','block');
        // betData["source"] = 'web';

        // betData["info"] = 'os:' + jscd.os + ', os_version:' + jscd.osVersion + ', browser:' + jscd.browser + ', browser_version:' + jscd.browserMajorVersion;

        if (betData.backlay == "back") {
          var i = $scope.backBetSlipDataArray[index].backBetSlipData.indexOf(
            betData
          );
          var slipIndex = $scope.backBetSlipList.indexOf(
            betData.runnerName + i + "back"
          );
          if (i != -1) {
            $scope.backBetSlipDataArray[index].backBetSlipData.splice(i, 1);
            $scope.backBetSlipList.splice(slipIndex, 1);
          }
          if (
            $scope.backBetSlipDataArray[index].backBetSlipData.length == 0 &&
            $scope.backBetSlipDataArray[index].backBookBetSlipData.length ==
              0 &&
            $scope.backBetSlipDataArray[index].yesBetSlipData.length == 0
          ) {
            $scope.backBetSlipDataArray.splice(index, 1);
          }
        } else {
          var i = $scope.layBetSlipDataArray[index].layBetSlipData.indexOf(
            betData
          );
          var slipIndex = $scope.layBetSlipList.indexOf(
            betData.runnerName + i + "lay"
          );
          if (i != -1) {
            $scope.layBetSlipDataArray[index].layBetSlipData.splice(i, 1);
            $scope.layBetSlipList.splice(slipIndex, 1);
          }
          if (
            $scope.layBetSlipDataArray[index].layBetSlipData.length == 0 &&
            $scope.layBetSlipDataArray[index].layBookBetSlipData.length == 0 &&
            $scope.layBetSlipDataArray[index].noBetSlipData.length == 0
          ) {
            $scope.layBetSlipDataArray.splice(index, 1);
          }
        }
        let betData1 = {
          marketId: betData.marketId,
          selId: betData.selectionId,
          odds: betData.odds,
          stake: +betData.stake,
          betType: betData.backlay,
          gameType: "exchange",
        };
        console.log(betData1);
        $("#placebet_btn").removeClass("disable");
        $("#placebet_btn").addClass("disable");
        $("#placebet_btn").prop("disabled", true);
        $http({
          method: "POST",
          url: baseUrl + "/placeBets",
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

              toastr.success(response.data.errorDescription);
              $("#loading_place_bet").css("display", "none");
              // $("#betslip_open").addClass("close");
              $rootScope.getBalance();
              $scope.GetBets();
              $rootScope.ExposureBook(betData1.marketId);
              setTimeout(() => {
                $scope.getBalance();
                $scope.GetBets();
                $rootScope.ExposureBook(betData1.marketId);
              }, 1000);
              $("#placebet_btn").removeClass("disable");
              $("#placebet_btn").prop("disabled", false);
              $(".matchOddTable .select").removeClass("select");
              $scope.removeAllBetSlip();
              // $scope.getMultiExposureBook()
            } else {
              $scope.removeAllBetSlip();
              $("#loading_place_bet").css("display", "none");
              $("#placebet_btn").removeClass("disable");
              $("#placebet_btn").prop("disabled", false);
              $(".matchOddTable .select").removeClass("select");

              toastr.error(response.data.errorDescription);
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
        console.log(betData1);
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

              toastr.success(response.data.errorDescription);
              $("#loading_place_bet").css("display", "none");
              // $("#betslip_open").addClass("close");
              $rootScope.getBalance();
              $scope.GetBets();
              $rootScope.ExposureBookTeenPatti(
                betData1.gameType,
                betData1.round,
                betData1.selId
              );

              setTimeout(() => {
                $rootScope.getBalance();
                $scope.GetBets();
                $rootScope.ExposureBookTeenPatti(
                  betData1.gameType,
                  betData1.round,
                  betData1.selId
                );
              }, 1000);
              $("#placebet_btn").removeClass("disable");
              $("#placebet_btn").prop("disabled", false);
              $scope.removeAllBetSlip();
              // $scope.getMultiExposureBook()
              // if (
              //   betData.gameType == 1 ||
              //   betData.gameType == 2 ||
              //   betData.gameType == 6
              // ) {
              //   $rootScope.ExposureBookTeenPatti(betData.gameId);
              // }
              // if (betData.gameType == 5) {
              //   $rootScope.ExposureBookLucky7(betData.gameId);
              // }
              // if (betData.gameType == 7) {
              //   $rootScope.AndarBaharExposureBook(betData.gameId);
              // }
            } else {
              $scope.removeAllBetSlip();
              $("#loading_place_bet").css("display", "none");
              $("#placebet_btn").removeClass("disable");
              $("#placebet_btn").prop("disabled", false);

              toastr.error(response.data.errorDescription);
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

      function placeBetFancy(betData, index) {
        if (
          $rootScope.authcookie == undefined ||
          $rootScope.authcookie == null
        ) {
          // Relogin()
          toastr.info("Token was expired. Please login to continue.");
          return false;
        }
        // $('.loading').css('display','block');
        // betData["source"] = 'web';
        // betData["info"] = 'os:' + jscd.os + ', os_version:' + jscd.osVersion + ', browser:' + jscd.browser + ', browser_version:' + jscd.browserMajorVersion;

        let betData1 = {
          marketId: betData.marketId,
          selId: betData.selectionId,
          odds: betData.odds,
          stake: +betData.stake,
          betType: betData.backlay,
          gameType: "fancy",
        };
        console.log(betData1);
        $http({
          method: "POST",
          url: baseUrl + "/placeBets",
          headers: {
            Authorization: authtoken,
          },
          data: betData1,
        }).then(
          function mySuccess(response) {
            $scope.placedButton = false;
            if (response.data.errorCode == 0) {
              $rootScope.$emit("callFancyExp", {});

              if (betData.yesno == "yes") {
                // console.log(betData)
                var i = $scope.backBetSlipDataArray[
                  index
                ].yesBetSlipData.indexOf(betData);
                var slipIndex = $scope.yesBetSlipList.indexOf(
                  betData.runnerName + i + "yes"
                );
                if (i != -1) {
                  $scope.backBetSlipDataArray[index].yesBetSlipData.splice(
                    i,
                    1
                  );
                  $scope.yesBetSlipList.splice(slipIndex, 1);
                }
                if (
                  $scope.backBetSlipDataArray[index].backBetSlipData.length ==
                    0 &&
                  $scope.backBetSlipDataArray[index].backBookBetSlipData
                    .length == 0 &&
                  $scope.backBetSlipDataArray[index].yesBetSlipData.length == 0
                ) {
                  $scope.backBetSlipDataArray.splice(index, 1);
                }
              } else {
                var i = $scope.layBetSlipDataArray[index].noBetSlipData.indexOf(
                  betData
                );
                var slipIndex = $scope.noBetSlipList.indexOf(
                  betData.runnerName + i + "no"
                );

                if (i != -1) {
                  $scope.layBetSlipDataArray[index].noBetSlipData.splice(i, 1);
                  $scope.noBetSlipList.splice(slipIndex, 1);
                }
                if (
                  $scope.layBetSlipDataArray[index].layBetSlipData.length ==
                    0 &&
                  $scope.layBetSlipDataArray[index].layBookBetSlipData.length ==
                    0 &&
                  $scope.layBetSlipDataArray[index].noBetSlipData.length == 0
                ) {
                  $scope.layBetSlipDataArray.splice(index, 1);
                }
              }
              toastr.success(response.data.errorDescription);
              $("#loading_place_bet").css("display", "none");
              $rootScope.getBalance();
              $scope.GetBets();
              // $("#betslip_open").addClass("close");
            } else {
              $("#loading_place_bet").css("display", "none");

              toastr.error(response.data.errorDescription);
            }
          },
          function myError(error) {
            if (error.status == 401) {
              // $.removeCookie("authtoken");
              // window.location.href="index.html"
            }
          }
        );
      }

      function placeBookBetFunc(betData, index) {
        // $('.loading').css('display','block');
        // betData["source"] = 'web';

        // betData["info"] = 'os:' + jscd.os + ', os_version:' + jscd.osVersion + ', browser:' + jscd.browser + ', browser_version:' + jscd.browserMajorVersion;
        if (betData.backlay == "backBook") {
          var i = $scope.backBetSlipDataArray[
            index
          ].backBookBetSlipData.indexOf(betData);
          var slipIndex = $scope.backBookBetSlipList.indexOf(
            betData.runnerName + i + "backBook"
          );
          if (i != -1) {
            $scope.backBetSlipDataArray[index].backBookBetSlipData.splice(i, 1);
            $scope.backBookBetSlipList.splice(slipIndex, 1);
          }
          if (
            $scope.backBetSlipDataArray[index].backBetSlipData.length == 0 &&
            $scope.backBetSlipDataArray[index].backBookBetSlipData.length ==
              0 &&
            $scope.backBetSlipDataArray[index].yesBetSlipData.length == 0
          ) {
            $scope.backBetSlipDataArray.splice(index, 1);
          }
        } else {
          var i = $scope.layBetSlipDataArray[index].layBookBetSlipData.indexOf(
            betData
          );
          var slipIndex = $scope.layBookBetSlipList.indexOf(
            betData.runnerName + i + "layBook"
          );
          if (i != -1) {
            $scope.layBetSlipDataArray[index].layBookBetSlipData.splice(i, 1);
            $scope.layBookBetSlipList.splice(slipIndex, 1);
          }
          if (
            $scope.layBetSlipDataArray[index].layBetSlipData.length == 0 &&
            $scope.layBetSlipDataArray[index].layBookBetSlipData.length == 0 &&
            $scope.layBetSlipDataArray[index].noBetSlipData.length == 0
          ) {
            $scope.layBetSlipDataArray.splice(index, 1);
          }
        }
        if (betData.backlay == "backBook") {
          betData.betType = "back";
        } else {
          betData.betType = "lay";
        }

        console.log(betData);

        let betData1 = {
          marketId: betData.marketId,
          selId: betData.selectionId,
          odds: betData.odds,
          stake: +betData.stake,
          betType: betData.betType,
          gameType: 'book'
        };
        console.log(betData1);

        // console.log(betData)
        $("#placebet_btn").removeClass("disable");
        $("#placebet_btn").addClass("disable");
        $("#placebet_btn").prop("disabled", true);
        $http({
          method: "POST",
          url: baseUrl + "/placeBets",
          headers: {
            Authorization: authtoken,
          },
          data: betData1,
        }).then(
          function mySuccess(response) {
            $scope.placedButton = false;
            if (response.data.errorCode == 0) {
              // $rootScope.$emit("callBMExp", {})
              if (betData.backlay == "back") {
                betData.backlay = "backBook";
              } else {
                betData.backlay = "layBook";
              }

              toastr.success(response.data.errorDescription);
              $("#loading_place_bet").css("display", "none");
              $("#placebet_btn").prop("disabled", false);
              $("#placebet_btn").removeClass("disable");

              setTimeout(() => {
                $rootScope.getBalance();
                $scope.GetBets();
                $rootScope.getBMExposureBook(betData.marketId);
              }, 1000);
              // $("#betslip_open").addClass("close");
            } else {
              $("#loading_place_bet").css("display", "none");
              $("#placebet_btn").prop("disabled", false);
              $("#placebet_btn").removeClass("disable");
              toastr.error(response.data.errorDescription);
            }
          },
          function myError(error) {
            if (error.status == 401) {
              // $.removeCookie("authtoken");
              // window.location.href="index.html"
            }
          }
        );
      }
      $rootScope.ExposureBook = function (mktid) {
        // $scope.BookDataList=[]
        if (
          $rootScope.authcookie == undefined ||
          $rootScope.authcookie == null
        ) {
          return false;
        }
        $scope.Value = [];

        // if ($routeParams.marketId == undefined) {
        //   $scope.mktid = mktid;
        // } else {
        //   $scope.mktid = $routeParams.bfId;
        // }

        $http({
          url: baseUrl + "/listBooks/" + mktid,

          method: "GET",

          headers: {
            Authorization: authtoken,
          },
        }).then(
          function mySuccess(response) {
            console.log(response.data);
            $scope.BookDataList = response.data.result[0];
            // console.log($scope.BookDataList)

            // localStorage.setItem('exposureData',JSON.stringify($scope.BookDataList))

            if ($scope.BookDataList) {
              angular.forEach(
                Object.keys($scope.BookDataList),
                function (item, index) {
                  var mktexposure = +$scope.BookDataList[item];
                  if (mktexposure == 0) {
                    mktexposure = "";
                  }
                  // if (item.Value > 0) {
                  //     $('#exposure_' + runName).text(mktexposure).css('color', 'green');
                  // } else {
                  //     $('#exposure_' + runName).text(mktexposure).css('color', 'red');
                  // }
                  if (mktexposure > 0) {
                    console.log(">>>>", $("#exposure_" + mktid.replace('.', '_') + '_' + item));
                    $("#exposure_" + mktid.replace('.', '_') + '_' + item).removeClass("lose");
                    $("#exposure_" + mktid.replace('.', '_') + '_' + item)
                      .text(mktexposure.toFixed(2))
                      .addClass("win");
                  } else {
                    $("#exposure_" + mktid.replace('.', '_') + '_' + item).removeClass("win");
                    $("#exposure_" + mktid.replace('.', '_') + '_' + item)
                      .text(mktexposure === 0 ? "0" : mktexposure.toFixed(2))
                      .addClass("lose");
                  }
                }
              );
              localStorage.setItem(
                "Exposure_" + mktid,
                JSON.stringify(response.data.result[0])
              );
            }
            //$scope.Value1=$scope.Value[0];
          },
          function myError(error) {
            if (error.status == 401) {
              // $.removeCookie("authtoken");
              // window.location.href="index.html"
            }
          }
        );
      };

      $rootScope.ExposureBookTeenPatti = function (
        tableName,
        roundId,
        selectionId
      ) {
        if (
          $rootScope.authcookie == undefined ||
          $rootScope.authcookie == null
        ) {
          return false;
        }

        $http({
          url:
            baseUrl +
            "/listBooks/" +
            tableName +
            "/" +
            roundId +
            "/" +
            selectionId,
          method: "GET",
          headers: {
            Authorization: authtoken,
          },
        }).then(
          function mySuccess(response) {
            // console.log(response);
            $scope.TeenDataList = response.data.result[0];
            // console.log($scope.TeenDataList);
            angular.forEach($scope.TeenDataList, function (value, item) {
              let BMExposure = parseFloat(value);
              BMExposure = BMExposure.toFixed(2);
              if (BMExposure > 0) {
                $("#Tp_" + tableName + "_" + item)
                  .text(BMExposure)
                  .css("color", "green");
              } else {
                $("#Tp_" + tableName + "_" + item)
                  .text(BMExposure)
                  .css("color", "red");
              }
            });
          },
          function myError(error) {
            if (error.status == 401) {
              // $.removeCookie("authtoken");
              // window.location.href = 'login.html'
            }
          }
        );
      };

      $rootScope.getBMExposureBook = function () {
        if (
          $rootScope.authcookie == undefined ||
          $rootScope.authcookie == null
        ) {
          return false;
        }
        if ($routeParams.bfId != undefined) {
          var bookId = 'bm_' + $routeParams.bfId;
          var mktid = $routeParams.bfId;
        } else {
          return false;
        }
        $http({
          method: "GET",
          url: baseUrl + "/listBooks/" + bookId,
          headers: {
            Authorization: authtoken,
          },
        }).then(
          function Success(response) {
            $scope.removeAllBetSlip();
            $scope.BMExposure = response.data.result[0];
            // console.log($scope.BookDataList)

            // localStorage.setItem('exposureData',JSON.stringify($scope.BookDataList))

            if ($scope.BMExposure) {
              angular.forEach(
                Object.keys($scope.BMExposure),
                function (item, index) {
                  var mktexposure = +$scope.BMExposure[item];
                  if (mktexposure == 0) {
                    mktexposure = "";
                  }
                  // if (item.Value > 0) {
                  //     $('#exposure_' + runName).text(mktexposure).css('color', 'green');
                  // } else {
                  //     $('#exposure_' + runName).text(mktexposure).css('color', 'red');
                  // }
                  if (mktexposure > 0) {
                    console.log(">>>>", $("#bm_" + item));
                    $("#bm_" + item).removeClass("lose");
                    $("#bm_" + item)
                      .text(mktexposure.toFixed(2))
                      .addClass("win");
                  } else {
                    $("#bm_" + item).removeClass("win");
                    $("#bm_" + item)
                      .text(mktexposure === 0 ? "0" : mktexposure.toFixed(2))
                      .addClass("lose");
                  }
                }
              );
              localStorage.setItem(
                "BMExpo_" + mktid,
                JSON.stringify(response.data.result[0])
              );
            }
          },
          function error(err) {
            if (err.status == 401) {
              // $.removeCookie("auth-token");
              // window.location.href = 'index.html'
            }
          }
        );
      };

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
        if (!remove && $rootScope.cards) {
          $rootScope.cards = [];
          $('.teenpattixyz .card-image').removeClass('selected');
        }
      };

      $scope.cancelBet = function (id, index) {
        // $('#fancyBook').modal();
      };

      // $scope.calcExposure = function (mktid, bets, remove) {
      //   if (mktid == undefined) {
      //     return false;
      //   }
      //   try {
      //     $scope.exposureBook = JSON.parse(
      //       localStorage.getItem("Exposure_" + mktid)
      //     );
      //   } catch (e) {}
      //   if ($scope.exposureBook == null) {
      //     return false;
      //   }
      //   $scope.ExpoMktid = mktid;
      //   $scope.bets = bets;
      //   if (remove == "remove") {
      //     Object.keys($scope.exposureBook).forEach(function (item) {
      //       //console.log("value - ",value,"item -",item)

      //       value = $scope.exposureBook[item];
      //       $("#exposureAfter_" + mktid.replace('.', '_') + '_' + item).css("display", "none");
      //       $("#exposureAfter_" + mktid.replace('.', '_') + '_' + item).text(parseFloat(value).toFixed(2));
      //       if ($("#exposureAfter_" + mktid.replace('.', '_') + '_' + item).hasClass("to-lose"))
      //         $("#exposureAfter_" + mktid.replace('.', '_') + '_' + item).removeClass("to-lose");
      //       if ($("#exposureAfter_" + mktid.replace('.', '_') + '_' + item).hasClass("to-win"))
      //         $("#exposureAfter_" + mktid.replace('.', '_') + '_' + item).removeClass("to-win");
      //       if (value >= 0) $("#exposureAfter_" + mktid.replace('.', '_') + '_' + item).addClass("to-win");
      //       else $("#exposureAfter_" + mktid.replace('.', '_') + '_' + item).addClass("to-lose");
      //     });
      //   } else {
      //     Object.keys($scope.exposureBook).forEach(function (item, index) {
      //       let value = $scope.exposureBook[item];
      //       $scope.newValue = 0;
      //       if ($scope.bets.backlay == "back") {
      //         if (item == $scope.bets.selectionId) {
      //           $scope.newValue =
      //             parseFloat(value) + parseFloat($scope.bets.profit);
      //           $scope.exposureBook[item] = $scope.newValue;
      //         } else {
      //           if ($scope.bets.stake == "") {
      //             var betStake = 0;
      //           } else {
      //             betStake = $scope.bets.stake;
      //           }
      //           $scope.newValue = parseFloat(value) - parseFloat(betStake);
      //           $scope.exposureBook[item] = $scope.newValue;
      //         }
      //       } else {
      //         if (item == $scope.bets.selectionId) {
      //           $scope.newValue =
      //             parseFloat(value) - parseFloat($scope.bets.profit);
      //           $scope.exposureBook[item] = $scope.newValue;
      //         } else {
      //           if ($scope.bets.stake == "") {
      //             var betStake = 0;
      //           } else {
      //             betStake = $scope.bets.stake;
      //           }
      //           $scope.newValue = parseFloat(value) + parseFloat(betStake);
      //           $scope.exposureBook[item] = $scope.newValue;
      //         }
      //       }
      //     });
      //     // localStorage.setItem('NewExposure_'+mktid,JSON.stringify($scope.exposureBook))
      //     Object.keys($scope.exposureBook).forEach(function (item) {
      //       //console.log("value - ",value,"item -",item)

      //       let value = $scope.exposureBook[item];
      //       $("#exposureAfter_" + mktid.replace('.', '_') + '_' + item).css("display", "inline");
      //       $("#exposureAfter_" + mktid.replace('.', '_') + '_' + item).text(parseFloat(value).toFixed(2));
      //       if ($("#exposureAfter_" + mktid.replace('.', '_') + '_' + item).hasClass("to-lose"))
      //         $("#exposureAfter_" + mktid.replace('.', '_') + '_' + item).removeClass("to-lose");
      //       if ($("#exposureAfter_" + mktid.replace('.', '_') + '_' + item).hasClass("to-win"))
      //         $("#exposureAfter_" + mktid.replace('.', '_') + '_' + item).removeClass("to-win");
      //       if (value >= 0) $("#exposureAfter_" + mktid.replace('.', '_') + '_' + item).addClass("to-win");
      //       else $("#exposureAfter_" + mktid.replace('.', '_') + '_' + item).addClass("to-lose");
      //     });
      //   }

      //   // $timeout.cancel(myBetSlipTimeout);
      //   // myBetSlipTimeout = $timeout(function() {
      //   //     $scope.removeAllBetSlip()
      //   // }, 10000);
      // };

      $scope.calcExposure = function (mktid, placeData, remove) {
        if (mktid == undefined) {
          return false;
        }
        // try {
        //   $scope.exposureBook = JSON.parse(
        //     localStorage.getItem("Exposure_" + mktid)
        //   );
        // } catch (e) {}
        // if ($scope.exposureBook == null) {
        //   return false;
        // }
        $scope.ExpoMktid = mktid;
        $scope.bets = placeData;
        if (placeData.backlay == "back" || placeData.backlay == "lay") {
          $scope.mktExpoBook = JSON.parse(
            localStorage.getItem("Exposure_" + mktid)
          );
          if ($scope.mktExpoBook == null) {
            return false;
          }
  
          if (remove == "remove") {
            angular.forEach($scope.mktExpoBook, function (value, item) {
              // if (item.Value > 0) {
              $("#exposureAfter_" + mktid.replace('.', '_') + '_' + item)
                .text("")
                .removeClass("to-win");
              // } else {
              $("#exposureAfter_" + mktid.replace('.', '_') + '_' + item)
                .text("")
                .removeClass("to-lose");
              // }
            });
          } else {
            angular.forEach($scope.mktExpoBook, function (value, item) {
              $scope.newValue = 0;
  
              if (placeData.backlay == "back") {
                if (item == placeData.selectionId) {
                  $scope.newValue =
                    parseFloat(value) + parseFloat(placeData.profit);
                  $scope.mktExpoBook[item] = $scope.newValue.toFixed(2);
                } else {
                  if (placeData.stake == "") {
                    var betStake = 0;
                  } else {
                    betStake = placeData.stake;
                  }
                  $scope.newValue = parseFloat(value) - parseFloat(betStake);
                  $scope.mktExpoBook[item] = $scope.newValue.toFixed(2);
                }
              } else {
                if (+item == placeData.selectionId) {
                  $scope.newValue =
                    parseFloat(value) - parseFloat(placeData.profit);
                  $scope.mktExpoBook[item] = $scope.newValue.toFixed(2);
                } else {
                  if (placeData.stake == "") {
                    var betStake = 0;
                  } else {
                    betStake = placeData.stake;
                  }
                  $scope.newValue = parseFloat(value) + parseFloat(betStake);
                  $scope.mktExpoBook[item] = $scope.newValue.toFixed(2);
                }
              }
            });
  
            angular.forEach($scope.mktExpoBook, function (value, item) {
              $("#exposureAfter_" + placeData.marketId.replace('.', '_') + '_' + item).removeClass("to-win");
              $("#exposureAfter_" + placeData.marketId.replace('.', '_') + '_' + item).removeClass("to-lose");
  
              if (+value > 0) {
                $("#exposureAfter_" + placeData.marketId.replace('.', '_') + '_' + item)
                  .css('display', 'inline')
                  .text(value)
                  .addClass("to-win");
              } else {
                $("#exposureAfter_" + placeData.marketId.replace('.', '_') + '_' + item)
                  .css('display', 'inline')
                  .text("(" + value + ")")
                  .addClass("to-lose");
              }
            });
          }
        }
        if (placeData.backlay == "backBook" || placeData.backlay == "layBook") {
          $scope.BMExpoBook = JSON.parse(
            localStorage.getItem("BMExpo_" + placeData.marketId.split("_")[1])
          );
          if ($scope.BMExpoBook == null) {
            return false;
          }
  
          if (remove == "remove") {
            angular.forEach($scope.BMExpoBook, function (value, item) {
              // var runnerName = item.Key.replace(/[^a-z0-9\s]/gi, "").replace(
              //   /[_\s]/g,
              //   "_"
              // );
  
              // if (item.Value > 0) {
              $("#bmAfter_" + item)
                .text("")
                .removeClass("to-win");
              // } else {
              $("#bmAfter_" + item)
                .text("")
                .removeClass("to-lose");
              // }
            });
          } else {
            angular.forEach($scope.BMExpoBook, function (value, item) {
              let newValue = 0;
  
              if (placeData.backlay == "backBook") {
                if (item == placeData.selectionId) {
                  newValue =
                    parseFloat(value) + parseFloat(placeData.profit);
                  $scope.BMExpoBook[item] = newValue.toFixed(2);
                } else {
                  if (placeData.stake == "") {
                    var betStake = 0;
                  } else {
                    betStake = placeData.stake;
                  }
                  newValue = parseFloat(value) - parseFloat(betStake);
                  $scope.BMExpoBook[item] = newValue.toFixed(2);
                }
              } else {
                if (item == placeData.selectionId) {
                  newValue =
                    parseFloat(value) - parseFloat(placeData.profit);
                  $scope.BMExpoBook[item] = newValue.toFixed(2);
                } else {
                  if (placeData.stake == "") {
                    var betStake = 0;
                  } else {
                    betStake = placeData.stake;
                  }
                  newValue = parseFloat(value) + parseFloat(betStake);
                  $scope.BMExpoBook[item] = newValue.toFixed(2);
                }
              }
            });
  
            angular.forEach($scope.BMExpoBook, function (value, item) {
              // var runnerName = item.Key.replace(/[^a-z0-9\s]/gi, "").replace(
              //   /[_\s]/g,
              //   "_"
              // );
              $("#bmAfter_" + item)
                .text("")
                .removeClass("to-win");
              $("#bmAfter_" + item)
                .text("")
                .removeClass("to-lose");
  
              if (value > 0) {
                $("#bmAfter_" + item)
                  .text(value)
                  .addClass("to-win");
              } else {
                $("#bmAfter_" + item)
                  .text("(" + value + ")")
                  .addClass("to-lose");
              }
            });
          }
        } else if (placeData.yesno == "Yes" || placeData.yesno == "No") {
          // $scope.fancyExpoBook = JSON.parse(localStorage.getItem('FancyExpo_' + placeData.fancyId));
          // // console.log($scope.fancyExpoBook)
          //    if ($scope.fancyExpoBook == null) {
          //        return false;
          //    }
          //    if (remove=='remove') {
          //    	// if ($scope.fancyExpoBook > 0) {
          //      	$('#afterFancyExpo_'+ placeData.fancyId).removeClass('to-win');
          //         $('#afterFancyExpo_'+ placeData.fancyId+' span').text("").removeClass('green');
          //     // } else if($scope.fancyExpoBook<0) {
          //      	$('#afterFancyExpo_'+ placeData.fancyId).removeClass('to-lose');
          //         $('#afterFancyExpo_'+ placeData.fancyId+' span').text("").removeClass('red');
          //     // }
          //    }
          //    else{
          //    	var fancyExpoCalcYes=0;
          //    	var fancyExpoCalcNo=0;
          //    	if (placeData.yesno=="Yes") {
          //    		angular.forEach($scope.matchedData.sessionBets.yes,function(item){
          //    			if (item.marketName==placeData.runnerName) {
          //    				// fancyExpoCalcYes=(fancyExpoCalcYes+(parseFloat(item.stake)));
          //    				fancyExpoCalcYes=(fancyExpoCalcYes+((parseFloat(item.odds)*parseFloat(item.stake))/100));
          //    			}
          //    		})
          //    		console.log(fancyExpoCalcYes)
          //    		angular.forEach($scope.matchedData.sessionBets.no,function(item){
          //    			if (item.marketName==placeData.runnerName) {
          //    				fancyExpoCalcNo=(fancyExpoCalcNo+((parseFloat(item.odds)*parseFloat(item.stake))/100));
          //    			}
          //    		})
          //    		console.log(fancyExpoCalcNo)
          //    		// $scope.fancyExpoBook=((parseFloat(fancyExpoCalcYes)-parseFloat(fancyExpoCalcNo))).toFixed(2);
          //    		// console.log($scope.fancyExpoBook)
          //      // $scope.fancyExpoBook=parseFloat($scope.fancyExpoBook)+(parseFloat(placeData.stake)*(1));
          //    	}
          //    	else{
          //    		angular.forEach($scope.matchedData.sessionBets.yes,function(item){
          //    			if (item.marketName==placeData.runnerName) {
          //    				// fancyExpoCalcYes=(fancyExpoCalcYes+(parseFloat(item.stake)));
          //    				fancyExpoCalcYes=(fancyExpoCalcYes+((parseFloat(item.odds)*parseFloat(item.stake))/100));
          //    			}
          //    		})
          //    		console.log(fancyExpoCalcYes)
          //    		angular.forEach($scope.matchedData.sessionBets.no,function(item){
          //    			if (item.marketName==placeData.runnerName) {
          //    				fancyExpoCalcNo=(fancyExpoCalcNo+((parseFloat(item.odds)*parseFloat(item.stake))/100));
          //    			}
          //    		})
          //    		console.log(fancyExpoCalcNo)
          //    		// console.log($scope.fancyExpoBook)
          //    		// $scope.fancyExpoBook=((parseFloat(fancyExpoCalcYes)-parseFloat(fancyExpoCalcNo))).toFixed(2);
          //    		// $scope.fancyExpoBook=parseFloat($scope.fancyExpoBook)+(parseFloat(placeData.profit)*(1));
          //    	}
          //    	$scope.fancyExpoBook=((parseFloat(fancyExpoCalcYes)-parseFloat(fancyExpoCalcNo))).toFixed(2);
          //    	console.log($scope.fancyExpoBook)
          //    	if ($scope.fancyExpoBook > 0) {
          //      	$('#afterFancyExpo_'+ placeData.fancyId).addClass('to-win');
          //         $('#afterFancyExpo_'+ placeData.fancyId+' span').text($scope.fancyExpoBook).addClass('green');
          //     } else if($scope.fancyExpoBook<0) {
          //      	$('#afterFancyExpo_'+ placeData.fancyId).addClass('to-lose');
          //         $('#afterFancyExpo_'+ placeData.fancyId+' span').text('('+$scope.fancyExpoBook+')').addClass('red');
          //     }
          //    }
        }
      };

      $scope.onCancel = function () {
        $scope.active = true;
      };

      // $scope.stakeListdata = [
      //         5000, 10000, 25000, 50000, 100000, 500000 , 100000 ,700000,600000,400000
      //     ]
      $scope.stakeListdata = {
        stake1: 5,
        stake2: 10,
        stake3: 20,
        stake4: 50,
        stake5: 100,
        stake6: 200,
      };

      $scope.getStakeSettings = function () {
        $scope.active = false;
        var stakeList = $.cookie("stakeSetting");
        if (stakeList) {
          $scope.stakeList = JSON.parse(stakeList);
        }
      };

      $scope.getStakeSettings();

      $scope.showEditDiv = function () {
        $scope.show_close = false;
      };

      $scope.editStakeSettings = function () {
        // console.log('edit stake function called')
        var newStakeList = [];
        for (let i = 0; i < 10; i++) {
          const element = { id: i, stake: $("#stake" + i).val() };
          newStakeList.push(element);
        }
        $scope.stakeList = newStakeList;
        var finalData = JSON.stringify(newStakeList);
        $.cookie("stakeSetting", finalData);

        $scope.show_close = true;
        toastr.success("Saved Stakes");
        // console.log(newStakeList)
      };

      $scope.stakeValue = function (stake, bet, booktype) {
        // console.log(stake)

        var getStake = bet.stake;
        if (getStake == "") {
          getStake = 0;
        }
        var totalStake = parseInt(getStake) + parseInt(stake);
        bet.stake = totalStake;
        if (bet.backlay == "back" || bet.backlay == "lay") {
          var odds = bet.odds;
          if (bet.gameType === "-12") {
            odds = parseFloat(odds) / 100 + 1;
          }
          var pnl = (parseFloat(odds) - 1) * parseFloat(totalStake);
          bet.profit = pnl.toFixed(2);
          $scope.calculateLiability();
          $scope.calcExposure($scope.ExpoMktid, $scope.bets);
        }

        if (bet.backlay == "backBook" || bet.backlay == "layBook") {
          var odds = bet.odds;
          var pnl = (parseFloat(odds) / 100) * parseFloat(bet.stake);
          bet.profit = pnl.toFixed(2);
          $scope.calcExposure($scope.ExpoMktid, $scope.bets);
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

      $scope.stakeValueUM = function (
        stake,
        index,
        backLay,
        prestake,
        preodds
      ) {
        if (backLay == "BACK") {
          var getStake = $("#inputStakeBackUM_" + index + "").val();
          if (getStake == "") {
            getStake = 0;
          }
          var totalStake = parseInt(getStake) + parseInt(stake);
          $("#inputStakeBackUM_" + index + "").val(totalStake);
          var pnl =
            (parseFloat($("#oddsBackUM_" + index + "").val()) - 1) *
            parseFloat(totalStake);
          $("#profitLiabilityBackUM_" + index + "").text(pnl.toFixed(2));
        }
        if (backLay == "LAY") {
          var getStake = $("#inputStakeLayUM_" + index + "").val();
          if (getStake == "") {
            getStake = 0;
          }
          var totalStake = parseInt(getStake) + parseInt(stake);
          $("#inputStakeLayUM_" + index + "").val(totalStake);
          var pnl =
            (parseFloat($("#oddsLayUM_" + index + "").val()) - 1) *
            parseFloat(totalStake);
          $("#profitLiabilityLayUM_" + index + "").text(pnl.toFixed(2));
        }
      };

      $scope.updateStake = function (bet, booktype) {
        if (bet.stake == "") {
          bet.stake = 0.0;
        }
        if (bet.backlay == "back" || bet.backlay == "lay") {
          var odds = bet.odds;
          console.log(bet);
          if (bet.gameType === "-12") {
            odds = parseFloat(odds) / 100 + 1;
          }
          var pnl = ((parseFloat(odds) - 1) * parseFloat(bet.stake)).toFixed(2);
          bet.profit = pnl;
          console.log(bet.profit, bet);
          $scope.calcExposure($scope.ExpoMktid, $scope.bets);
        }
        if (bet.backLay == "BACK" || bet.backLay == "LAY") {
          var odds = bet.odds;
          if (bet.gameType === "-12") {
            odds = parseFloat(odds) / 100 + 1;
          }
          var pnl = (parseFloat(odds) - 1) * parseFloat(bet.stake);
          bet.profit = pnl.toFixed(2);
          $("#profitLiabilityBackUM_" + bet.id + "").text(pnl.toFixed(2));
          $("#profitLiabilityLayUM_" + bet.id + "").text(pnl.toFixed(2));
        }

        if (bet.backlay == "backBook" || bet.backlay == "layBook") {
          var odds = bet.odds;
          var pnl = (parseFloat(odds) / 100) * parseFloat(bet.stake);
          bet.profit = pnl.toFixed(2);
          $scope.calcExposure($scope.ExpoMktid, $scope.bets);
        }
        //   if (booktype === 1) {
        // } else {
        //     var odds = bet.odds;
        //     var pnl = (parseFloat(odds) - 1) * parseFloat(bet.stake);
        //     bet.profit = pnl.toFixed(2);
        //   }

        if (bet.yesno == "yes" || bet.yesno == "no") {
          var rate = bet.rate;
          var pnl = (parseFloat(rate) * parseFloat(bet.stake)) / 100;
          bet.profit = pnl.toFixed(2);
        }
        console.log(bet);
        $scope.calculateLiability();
      };

      $scope.stakeFocus = function (bet, index) {
        // $('.col-stake_list').css("display", "none");
        if (bet.matchId != undefined) {
          var betmatchId = bet.matchId;
        } else {
          betmatchId = bet.eventId;
        }
        if (bet.backlay != undefined) {
          var betbacklay = bet.backlay;
        } else {
          betbacklay = bet.yesno;
        }
        $("#stake_" + betbacklay + "_" + betmatchId + "_" + index).css(
          "display",
          "block"
        );
      };
      // $scope.stakeBlur = function(bet,index) {
      //     $('#stake_'+bet.backlay+'_'+bet.matchId+'_'+index).css("display","none");
      // }

      $scope.Settv = function (marketId, matchId) {
        var data = {
          marketId: marketId,
          matchId: matchId,
        };
        var tvlist = JSON.stringify(data);

        localStorage.setItem("tvlist", tvlist);
      };

      $scope.selectMenuMatch = "0";
      $scope.StoreMatches = [];
      $scope.StoreMatchesIDs = [];
      $scope.matchedData = [];
      $scope.unMatchedData = [];
      // $scope.backMatchedData = []
      // $scope.backUnMatchedData = []
      // $scope.layMatchedData = []
      // $scope.layUnMatchedData = []
      $scope.backMatchedBet = true;
      $scope.backUnmatchedBet = true;
      $scope.layMatchedBet = true;
      $scope.layUnmatchedBet = true;

      $scope.avgBets = 0;

      $scope.OldunMatchedData = [];

      $scope.numberOfBets = 0;
      $scope.GetBets = function () {
        $scope.foundMatchId = "0";

        if ($routeParams.matchId != undefined) {
          $scope.foundMatchId = $routeParams.matchId;
        } else {
          $scope.foundMatchId = "0";
        }
        if ($location.path().includes("teenpatti")) {
          $scope.foundMatchId = $routeParams.tableId;
        }
        if (
          $routeParams.matchId != undefined ||
          $location.path().includes("teenpatti")
        ) {
          $scope.foundMatchId = $location.path().includes("teenpatti")
            ? +$routeParams.tableId
            : parseInt($routeParams.matchId);
          $scope.mtid = $scope.foundMatchId;

          var foundIndex = $scope.StoreMatchesIDs.indexOf($scope.foundMatchId);
          if (
            $location.path().includes("fullmarket") &&
            foundIndex == -1 &&
            !!$scope.fullMarketmatchName
          ) {
            var match = {
              eventId: $scope.foundMatchId,
              matchName: $rootScope.fullMarketmatchName,
            };
            $scope.StoreMatchesIDs.push($scope.foundMatchId);
            $scope.StoreMatches.push(match);
          } else if (
            $location.path().includes("teenpatti") &&
            foundIndex == -1 &&
            !!$scope.matchName
          ) {
            var match = {
              eventId: $scope.foundMatchId,
              matchName: $scope.matchName,
            };
            $scope.StoreMatchesIDs.push($scope.foundMatchId);
            $scope.StoreMatches.push(match);
          }
        }
        $scope.mtid = $scope.foundMatchId;
        if ($("#average").prop("checked") == true) {
          $scope.avgBets = 1;
        } else {
          $scope.avgBets = 0;
        }
        // if ($rootScope.fType == 1) {
        $http({
          method: "GET",
          url: baseUrl + "/listBets",
          headers: {
            Authorization: authtoken,
          },
        }).then(
          function mySuccess(response) {
            // console.log(response)
            if (response.data.errorCode === 0) {

              if ($scope.numberOfBets !== response.data.result.length) {
                $rootScope.getBalance();
              }
              if (!+$scope.mtid) {
                $scope.matchedData = response.data.result;
              } else {
                $scope.matchedData = response.data.result.filter(
                  (e) => parseInt(e.eventId) === parseInt($scope.mtid)
                );
              }
              $scope.numberOfBets = response.data.result.length;
              $scope.matchedData = $scope.matchedData
                .filter((c) => !!c.selId)
                .sort((a, b) => Date.parse(b.betTime) - Date.parse(a.betTime));

              avgProfitMap = {};
              avgOddsMap = {};
              if ($scope.avgBets) {
                // $scope.matchedData.forEach((c) => {
                //     if (c.selId in avgMap) {
                //         c.odds += avgOddsMap[c.selId];
                //         c.PL += avgProfitMap[c.selId];
                //     } else {
                //         avgOddsMap[c.selId] = +c.odds;
                //         avgProfitMap[c.selId] = +c.PL;
                //     }
                // })

                let countMap = {};
                $scope.matchedData = $scope.matchedData
                  .map((b) => {
                    b.odds = +b.odds;
                    return b;
                  })
                  .reduce((acc, c) => {
                    let betIndex = acc.findIndex(
                      (e) => +e.selId === +c.selId && e.betType === c.betType
                    );
                    let bet = acc[betIndex];
                    if (bet) {
                      if (countMap[bet.selId]) {
                        countMap[bet.selId] += 1;
                      } else {
                        countMap[bet.selId] = 2;
                      }
                      bet.odds += +c.odds;
                      bet.odds = Math.round((bet.odds / 2) * 100) / 100;
                      bet.PL += c.PL;
                      bet.stake += c.stake;
                      acc.splice(betIndex, 1);
                      acc.push(bet);
                      return acc;
                    } else {
                      acc.push(c);
                      return acc;
                    }
                  }, []);
              }
              setTimeout(() => {
                $scope.$apply(() => {
                  $scope.matchedData = $scope.matchedData;
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
        // console.log($scope.StoreMatches)
        // } else {
        //     if ($rootScope.sportsData != undefined) {
        //         $scope.allbetdata = $rootScope.getAllBetsWise($scope.mtid, $scope.avgBets);
        //         $scope.unMatchedData = $scope.allbetdata.unMatchedData;
        //         if ($scope.unMatchedData.length != $scope.OldunMatchedData.length) {
        //             if ($routeParams.marketId != undefined) {
        //                 $rootScope.ExposureBook($routeParams.marketId);
        //             }
        //         }
        //         $scope.OldunMatchedData = $scope.unMatchedData;
        //         $scope.matchedData = $scope.allbetdata.matchedData;
        //     }
        // }
      };

      var allbetsTimer = $interval(function () {
        $scope.GetBets();
      }, 5000);

      $scope.GetBets();

      $scope.GetBetsdropdown = function (mtid) {
        $scope.mtid = +mtid;
        if ($scope.averageOdds == true) {
          $scope.avgBets = 1;
        } else {
          $scope.avgBets = 0;
        }
        let url = $scope.mtid
          ? baseUrl + "/listBets?eventId=" + mtid
          : baseUrl + "/listBets";
        $http({
          method: "GET",
          url: url,
          headers: {
            Authorization: authtoken,
          },
        }).then(
          function mySuccess(response) {
            // console.log(response)
            if (!+$scope.mtid) {
              $scope.matchedData = response.data.result;
            } else {
              $scope.matchedData = response.data.result.filter(
                (e) => parseInt(e.eventId) === parseInt($scope.mtid)
              );
            }
            // $scope.unMatchedData = response.data.unMatchedData;
          },
          function myError(error) {
            if (error.status == 401) {
              // $.removeCookie("authtoken");
              // window.location.href="index.html"
            }
          }
        );
      };

      $scope.GetFancyBook = function (fancyName, fancyId, marketId) {
        window.open(
          "fancybooktable.html?mtid=" +
            marketId +
            "&fid=" +
            fancyId +
            "&fname=" +
            fancyName +
            "&baseUrl=" +
            baseUrl,
          "_blank",
          "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width=700,height=500"
        );
      };
      $scope.ModalClose = function () {
        $("#fancyBook").css("display", "none");
      };

      $scope.$on("$routeChangeStart", () => {
        $interval.cancel(homeTimer);
      });

      $rootScope.ping = function () {
        $http({
          url: baseUrl + "/ping",
          method: "GET",
          headers: {
            Authorization: authtoken,
          },
        }).then(
          (response) => {
            if(response.data.errorCode == 0) {
              $scope.availBal = response.data.result[0].balance;
              $scope.exposure = response.data.result[0].exposure;
            }
          },
          (error) => {}
        );
      };

      var pingInterval;
      if (authtoken) {
        $rootScope.ping();
        pingInterval = $interval(() => {
          $rootScope.ping();
        }, 5000);
      }

      $scope.$on("$destroy", () => {
        $interval.cancel(pingInterval);
      });
    }
  );
