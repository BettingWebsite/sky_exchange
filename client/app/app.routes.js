angular.module("myApp").config([
  "$routeProvider",
  function ($routeProvider) {
    $routeProvider
      .when("/", {
        // controller: 'homeController',
        templateUrl: "app/controllers/home/home.html",
        data: {
          title: "Home",
        },
      })
      .when("/termsconditions", {
        controller: "rules_condition_Controller",
        templateUrl: "termsconditions.html",
        data: {
          title: "Rulesconditions",
        },
      })
      .when("/inplay", {
        controller: "inplayController",
        templateUrl: "app/controllers/inplay/inplay.html",
        data: {
          title: "Inplay",
        },
      })
      .when("/today", {
        controller: "todayController",
        templateUrl: "app/controllers/today/today.html",
        data: {
          title: "Today",
        },
      })
      .when("/tomorrow", {
        controller: "tomorrowController",
        templateUrl: "app/controllers/tomorrow/tomorrow.html",
        data: {
          title: "Tomorrow",
        },
      })
      .when("/multiMarkets", {
        controller: "multiMarketController",
        templateUrl: "app/controllers/multimarket/multiMarkets.html",
        data: {
          title: "MultiMarkets",
        },
      })
      .when("/Cricket", {
        controller: "cricketController",
        templateUrl: "app/controllers/cricket/cricket.html",
        data: {
          title: "Cricket",
        },
      })
      .when("/Soccer", {
        controller: "soccerController",
        templateUrl: "app/controllers/soccer/soccer.html",
        data: {
          title: "Soccer",
        },
      })
      .when("/Tennis", {
        controller: "tennisController",
        templateUrl: "app/controllers/tennis/tennis.html",
        data: {
          title: "Tennis",
        },
      })
      .when("/Casino", {
        controller: "casinoControllers",
        templateUrl: "app/controllers/casino/casino.html",
        data: {
          title: "Casino",
        },
      })
      .when("/Basketball", {
        controller: "BasketballController",
        templateUrl: "app/controllers/basket/basketball.html",
        data: {
          title: "Basketball",
        },
      })
      .when("/Rugby Union", {
        controller: "rugbyunionController",
        templateUrl: "app/controllers/rugby/rugbyUnion.html",
        data: {
          title: "Rugby Union",
        },
      })
      .when("/Horse Racing", {
        controller: "horseracingController",
        templateUrl: "app/controllers/horseracing/horseracing.html",
        data: {
          title: "Horse Racing",
        },
      })
      .when("/Greyhound Racing", {
        controller: "greyhoundracingController",
        templateUrl: "app/controllers/greyhoundracing/greyhoundracing.html",
        data: {
          title: "Greyhound Racing",
        },
      })
      .when("/Kabaddi", {
        controller: "kabaddiController",
        templateUrl: "app/controllers/kabaddi/kabaddi.html",
        data: {
          title: "Kabaddi",
        },
      })
      .when("/Live Teenpatti", {
        controller: "teenpattiController",
        templateUrl: "app/controllers/teenpatti/teenpatti.html",
        data: {
          title: "teenpatti",
        },
      })
      .when(
        "/teenpatti-video/:tableName/:tableId/:streamServer/:streamUrl/:oddServer1/:oddServer2/:oddsUrl",
        {
          controller: "teenpattiVideoController",
          templateUrl: "app/controllers/teenpatti-video/teenpatti-video.html",
          data: {
            title: "Fullmarket",
          },
        }
      )
      .when("/full-market/:marketId/:matchId/:bfId", {
        controller: "fullmarketController",
        templateUrl: "app/controllers/fullmarket/full-market.html",
        data: {
          title: "Fullmarket",
        },
      })
      .when("/full-market/:sportid/:tourid/:matchId/:marketId/:bfId", {
        controller: "fullmarketController",
        templateUrl: "app/controllers/fullmarket/full-market.html",
        data: {
          title: "Fullmarket",
        },
      })
      // .when("/full-market/:marketId/:matchId/:bfId/:dataMode", {
      //   controller: "fullmarketController",
      //   templateUrl: "app/controllers/fullmarket/full-market.html",
      //   data: {
      //     title: "Fullmarket",
      //   },
      // })
      .when("/full-market/:marketId/:matchId/:bfId/:sportName/:dataMode", {
        controller: "fullmarketController",
        templateUrl: "app/controllers/fullmarket/full-market.html",
        data: {
          title: "Fullmarket",
        },
      })
      .when(
        "/full-market/:marketId/:matchId/:bfId/:sportName/:mbfId/:dataMode",
        {
          controller: "fullmarketController",
          templateUrl: "app/controllers/fullmarket/full-market.html",
          data: {
            title: "Fullmarket",
          },
        }
      )
      .when("/full-market/:sportid/:tourid/:matchId/:bfId", {
        controller: "fullmarketController",
        templateUrl: "app/controllers/fullmarket/full-market.html",
        data: {
          title: "Fullmarket",
        },
      });

    // .otherwise({
    //  redirectTo: '/'
    // });
  },
]);
