app.config(function ($routeProvider, $locationProvider) {
  // $locationProvider.html5Mode(true);
  $routeProvider
    .when("/", {
      controller: "homeController",
      templateUrl: "sections/home/home.html",
    })
    .when("/inplay", {
      controller: "inplayController",
      templateUrl: "sections/inplay/inplay.html",
    })
    .when("/sports", {
      controller: "sportsController",
      templateUrl: "sections/sports/sports.html",
    })
    .when("/multiMarket", {
      controller: "multiMarketController",
      templateUrl: "sections/multimarket/multimarket.html",
    })
    .when("/fullmarket/:sportid/:tourid/:matchId/:marketId/:bfId", {
      controller: "fullmarketController",
      templateUrl: "sections/fullmarket/fullmarket.html",
    })
    .when("/fullmarket/:sportid/:tourid/:matchId/:marketId/:bfId/:tourId", {
      controller: "fullmarketController",
      templateUrl: "sections/fullmarket/fullmarket.html",
    })
    .when("/account", {
      controller: "accountController",
      templateUrl: "sections/account/account.html",
    })
    .when(
      "/tp_market/:tableName/:tableId/:streamServer/:streamUrl/:oddServer1/:oddServer2/:oddsUrl",
      {
        controller: "tpmarketController",
        templateUrl: "sections/tpmarket/tp_market.html",
      }
    )
    .when("/fullmarket/:sportid/:tourid/:matchId/:bfId", {
      controller: "fullmarketController",
      templateUrl: "sections/fullmarket/fullmarket.html",
      data: {
        title: "Fullmarket",
      },
    });
  // .when('/tp_market/:sportId/:mtBfId/:matchId/:marketId/:bfId/:tourId', {
  // 		controller: 'tpmarketController',
  // 		templateUrl: 'sections/tpmarket/tp_market.html'
  //  })

  // $locationProvider.html5Mode(true)
  //check browser support
  if (window.history && window.history.pushState) {
    //$locationProvider.html5Mode(true); will cause an error $location in HTML5 mode requires a  tag to be present! Unless you set baseUrl tag after head tag like so: <head> <base href="/">
    // to know more about setting base URL visit: https://docs.angularjs.org/error/$location/nobase
    // if you don't wish to set base URL then use this
    // $locationProvider.html5Mode({
    // 	enabled:true,
    // 	requireBase:false
    // })
  }
});
