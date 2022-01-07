app.controller(
	"fullmarketController",
	function (
	  $scope,
	  $http,
	  $websocket,
	  $routeParams,
	  $rootScope,
	  $interval,
	  $sce
	) {
  
	  $scope.volMultiplier = 1;
	  $scope.loadEvent = function () {
		$http({
		  url: ApiUrl + "/loadEvent/" + $routeParams.matchId,
		  method: "GET",
		  headers: {
			Authorization: token,
		  },
		}).then(
		  function mySuccess(response) {
			  console.log(response.data);
			  if (response.data.errorCode === 0) {
				  $scope.betDelay = response.data.result[0].betDelay
				  $scope.volMultiplier = response.data.result[0].volMultiplier;
			  }
		  },
		  function myError(error) {}
		);
	  };
  
	  $scope.loadEvent();
  
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
	  $("#loading").css("display", "grid");
	  // $scope.dataMode=$routeParams.dataMode;
	  $scope.mktId = $routeParams.marketId;
	  $scope.matchid = $routeParams.matchId;
	  $scope.bfId = $routeParams.bfId;
	  $rootScope.routbfid = $routeParams.bfId;
	  var mktbfId = $routeParams.bfId;
	  $scope.sportId = $routeParams.sportid;
	  $scope.tourID = $routeParams.tourid;
	  $scope.totalMatched = 0;
  
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
  
	  $scope.resetFancyType = function () {
		$scope.fancyType = {
		  isScrap: false,
		  isStable: false,
		  isDiamond: false,
		};
	  };
  
	  $scope.resetFancyType();
  
	  $scope.skyFancyMap = {
		10: "Ball Running",
		6: "Suspended",
	  };
	  $scope.fancyData = [];
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
		var match = $scope.marketdata;
		if (match && match.port) {
		  var url =
			"ws://209.250.242.175:" +
			match.port +
			"/" +
			($rootScope.authcookie !== null && $rootScope.authcookie !== undefined
			  ? "?logged=true"
			  : "?logged=false");
		  var ws = $websocket.$new(url);
		  ws.$on("$message", function (message) {
			message = JSON.parse(message);
			// $scope.resetFancyType();
			//   console.log("-------- websocket message:", message);
			
			if (message && message.constructor !== Object && !message.matchId && message.length > 0) {
			  message = message
				.filter((m) => !!m)
				.map((m) => {
				  Object.keys(m).forEach((f) => {
					  var newKey = fieldMap[f]? fieldMap[f]: f;
					  m[newKey] = m[f];
					  fieldMap[f]? delete m[f]: '';
				  });
				  m.runners.map((runner) => {
					  Object.keys(runner).forEach((r) => {
						  var runKey = fieldMap[r]? fieldMap[r]:r;
						  runner[runKey] = runner[r];
						  fieldMap[r]? delete runner[r]: '';
					  })
					  Object.keys(runner.ex).forEach((k) =>{
						  var blKey = fieldMap[k]? fieldMap[k]:k;
						  runner.ex[blKey] = runner.ex[k];
						  fieldMap[k]? delete runner.ex[k]: '';
					  })
					  runner.ex.availableToBack.map((b) => {
						  Object.keys(b).forEach((k) =>{
							  var blKey = fieldMap[k]? fieldMap[k]:k;
							  b[blKey] = b[k];
							  fieldMap[k]? delete b[k]: '';
						  })
						  if (b.size) {
							  if (b.size > 100) {
								  b.size = Math.round(b.size) * $scope.volMultiplier
							  } else {
								  b.size = +(b.size * $scope.volMultiplier).toFixed(2)
							  }
						  }
					  })
					  runner.ex.availableToLay.map((b) => {
						  Object.keys(b).forEach((k) =>{
							  var blKey = fieldMap[k]? fieldMap[k]:k;
							  b[blKey] = b[k];
							  fieldMap[k]? delete b[k]: '';
						  })
						  if (b.size) {
							  if (b.size > 100) {
								  b.size = Math.round(b.size) * $scope.volMultiplier
							  } else {
								  b.size = +(b.size * $scope.volMultiplier).toFixed(2)
							  }
						  }
					  })
					  return m;
				  })
				  return m
				})
				.sort(function (a, b) {
				  return a.marketName < b.marketName
					? -1
					: a.marketName > b.marketName
					? 1
					: 0;
				});
			  
			  $scope.marketdata.runnerData = message.slice();
			} else if (message && message.Fancymarket) {
			  if (
				message.Fancymarket &&
				message.Fancymarket.length &&
				"eventType" in message.Fancymarket[0]
			  ) {
				message.Fancymarket = message.Fancymarket.filter((fancy) => {
				  return (
					fancy.sort > 0 &&
					fancy.status !== 1 &&
					fancy.status !== 50 &&
					fancy.status !== 18
				  );
				})
				  .map((fancy) => {
					fancy.sort = +fancy.sort;
					return fancy;
				  })
				  .sort((a, b) => {
					return a.marketType < b.marketType ? -1 : a.sort - b.sort;
				  });
				$scope.fancyType.isStable = 1;
				$scope.fancyType.isDiamond = false;
				$scope.fancyType.isScrap = false;
			  } else {
				$scope.fancyType.isDiamond = 1;
				$scope.fancyType.isStable = false;
				$scope.fancyType.isScrap = false;
			  }
			  $scope.fancyData = message.Fancymarket;
			  $rootScope.FancyData($scope.fancyData);
			  console.log($scope.fancyData);
			} else if (message && message.bookRates) {
			  $scope.fancyType.isScrap = 1;
			  $scope.fancyType.isDiamond = false;
			  $scope.fancyType.isStable = false;
			  $scope.fancyData = message;
			  $rootScope.FancyData($scope.fancyData);
			  console.log($scope.fancyData);
			}
		  });
		  $rootScope.ws = ws;
		}
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
  
	  $rootScope.MktData = function () {
		$scope.mtid = $routeParams.matchId;
		$scope.mktid = $routeParams.marketId;
		if ($rootScope.sportsData != undefined) {
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
		  } else if ($routeParams.sportid == "20") {
			if (!$('a[href="#!Kabaddi"]').hasClass("select")) {
			  $('a[href="#!Kabaddi"]').addClass("select");
			  $rootScope.TournamentList("20", "Kabaddi");
			}
		  }
		  $scope.linemarketArray = [];
		  $scope.marketdata =
			$rootScope.sportsData[$scope.sportId].tournaments[
			  $scope.tourID
			].matches[$scope.matchid];
  
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
  
		  if ($scope.tv) {
			$scope.tvPid = $scope.marketdata.tvPid;
			$scope.tvMapid = $scope.marketdata.tvMapid;
			// $scope.tvUrl = $sce.trustAsResourceUrl(
			//   "http://3.7.254.125:" +
			// 	$scope.tvPid +
			// 	"/" +
			// 	$scope.tvMapid +
			// 	"/" +
			// 	$scope.tvMapid +
			// 	"/"
			//   );
			  $rootScope.tvUrl = $sce.trustAsResourceUrl(
				"https://streamingtv.fun/live_tv/index.html?eventId=" +
				$scope.matchBfId
			);
			// console.log($rootScope.tvUrl);
		  }
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
		  $scope.matchBfId = $scope.marketdata.bfId;
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
			// $rootScope.ExposureBook(item.mktId);
		  });
		}
		$scope.getWebSocketData();
		//== $scope.GetBets();
	  };
	  $rootScope.MktData();
  
	  $scope.unloadEvent = function () {
		$http({
		  url: $rootScope.baseUrl + "/unloadEvent/" + $scope.matchBfId,
		  method: "GET",
		  headers: {
			Authorization: authtoken,
		  },
		}).then(
		  function mySuccess(response) {
			console.log(">", response.data);
		  },
		  function myError(error) {}
		);
	  };
  
	  $scope.openResult = function (result) {
		$scope.tp_result = result;
	  };
  
	  $scope.closeOverlayInfo = function (id) {
		$scope.tp_result = null;
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
	  //         $scope.matchfancyData = $scope.marketdata.fancyData;
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
  
	  $rootScope.FancyData = function (matchfancyData) {
		//   console.log("- $scope.matchfancyData:", matchfancyData);
		$scope.mtid = $routeParams.matchId;
		$scope.fancyData = matchfancyData;
		// console.log($rootScope.fancyBook)
		// $scope.getBMExposureBook();
		$scope.top = 0;
		angular.forEach($rootScope.fancyBook, function (item, index) {
		  angular.forEach($scope.fancyData, function (fancy) {
			if (index == fancy.nat) {
			  var fancyName = index
				.replace(/[^a-z0-9\s]/gi, "")
				.replace(/[_\s]/g, "_");
			  if (item == 0) {
				item = 0;
				$("#fancyBetBookBtn_" + fancy.sid + "").css("display", "block");
			  } else {
				if (item > 0) {
				  $("#fexp_" + fancy.sid + fancyName)
					.text("" + item.toFixed(2) + "")
					.css("color", "green");
				  $("#fancyBetBookBtn_" + fancy.sid).css("display", "block");
				} else {
				  $("#fexp_" + fancy.sid + fancyName)
					.text("" + item.toFixed(2) + "")
					.css("color", "red");
				  $("#fancyBetBookBtn_" + fancy.sid).css("display", "block");
				}
			  }
			}
		  });
		});
		angular.forEach($scope.bookmakingData, function (Bmdata) {
		  $rootScope.getBMExposureBook(Bmdata.id);
		});
	  };
  
	  $scope.fancyEposure = function () {
		if ($scope.matchfancyData != undefined) {
		  angular.forEach($rootScope.fancyBook, function (item, index) {
			angular.forEach($scope.matchfancyData, function (fancy) {
			  if (index == fancy.name) {
				var fancyName = index
				  .replace(/[^a-z0-9\s]/gi, "")
				  .replace(/[_\s]/g, "_");
				if (item == 0) {
				  item = 0;
				  $("#fancyBetBookBtn_" + fancy.id + "").css("display", "block");
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
  
	  $rootScope.getFancyExposure = function (id, name) {
		$scope.mtid = $routeParams.matchId;
		$http({
		  url:
			"http://www.lcexchanges247.com/Client/BetClient.svc/Bets/GetFancyExposure?mtid=" +
			$scope.mtid +
			"&fid=" +
			id,
		  method: "GET",
		  headers: {
			Authorization: authtoken,
		  },
		}).then(
		  function mySuccess(response) {
			// console.log(response);
			var getFancyExposureData = response.data.data;
			// console.log($scope.getFancyExposureData)
			var fancyName = name
			  .replace(/[^a-z0-9\s]/gi, "")
			  .replace(/[_\s]/g, "_");
			// console.log('#fexp_'+id+fancyName)
			if (getFancyExposureData == 0) {
			  getFancyExposureData = 0;
			  $("#fancyBetBookBtn_" + id + "").css("display", "block");
			} else {
			  if (response.data.data > 0) {
				$("#fexp_" + id + fancyName)
				  .text("" + getFancyExposureData.toFixed(2) + "")
				  .css("color", "green");
				$("#fancyBetBookBtn_" + id + "").css("display", "block");
			  } else {
				$("#fexp_" + id + fancyName)
				  .text("" + getFancyExposureData.toFixed(2) + "")
				  .css("color", "red");
				$("#fancyBetBookBtn_" + id + "").css("display", "block");
			  }
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

	  $scope.$on("$destory", function () {
		$rootScope.ws.$close();
	  });
  
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
  
	  $scope.SessionData = function (sportId, matchBfId) {
		$(".lay1").removeClass("spark");
		$(".lay2").removeClass("spark");
		$(".back2").removeClass("spark");
		$(".back1").removeClass("spark");
		if (matchBfId != null && matchBfId != undefined && sportId != undefined) {
		  // if ($scope.pending_SessionData == true) return false
		  // $scope.pending_SessionData = true
		  $http({
			// method: "GET",
			// // url: "https://www.lotusbook.com/api/exchange/odds/event/" + $scope.$scope.sportId + "/" + $scope.matchBfId,
			// url: "https://www.lotusbook.com/api/exchange/odds/sma-event/LIOD/" + sportId + "/" + matchBfId,
			// headers: {
			//     "Content-Type": "application/json",
			// }
			method: "POST",
			url: "http://dak19.com/api/matchOdds.php",
			data: {
			  sportId: sportId,
			  matchBfId: matchBfId,
			},
			headers: {
			  "Content-Type": "application/json",
			},
		  }).then(
			function success(response) {
			  // $scope.pending_SessionData = false
			  //console.log(response, "SessionData")
			  $scope.Sessionfeeds = $scope.sessionIdWiseData(
				response.data.result
			  );
			  // console.log($scope.Sessionfeeds)
			  if ($scope.markets != undefined) {
				angular.forEach($scope.Sessionfeeds, function (value, index) {
				  if ($scope.markets[value.id] != undefined) {
					$scope.markets[value.id].mktStatus = value.status;
					$scope.matchStatus = value.status;
					$scope.noSpaceMarketid = value.id
					  .replace(/[^a-z0-9\s]/gi, "")
					  .replace(/[_\s]/g, "_");
					angular.forEach(value.runners, function (item3, index) {
					  angular.forEach(
						$scope.markets[value.id].runnerData,
						function (item2) {
						  if (item2.runnerName == item3.name) {
							// console.log(item3.back[0])
							if (item3.back[0] != undefined) {
							  item3.back[0].size =
								parseFloat(item3.back[0].size) *
								parseFloat($scope.volMulti);
							  if (
								item2.back1 != item3.back[0].price ||
								item2.backSize1 != item3.back[0].size
							  ) {
								$(
								  "#" +
									$scope.noSpaceMarketid +
									" #runner" +
									index +
									"back1"
								).addClass("spark");
							  }
							  item2.back1 = item3.back[0].price;
							  item2.backSize1 = item3.back[0].size;
							} else {
							  item2.back1 = null;
							  item2.backSize1 = null;
							}
							if (item3.back[1] != undefined) {
							  item3.back[1].size =
								parseFloat(item3.back[1].size) *
								parseFloat($scope.volMulti);
							  if (
								item2.back2 != item3.back[1].price ||
								item2.backSize2 != item3.back[1].size
							  ) {
								$(
								  "#" +
									$scope.noSpaceMarketid +
									" #runner" +
									index +
									"back2"
								).addClass("spark");
							  }
							  item2.back2 = item3.back[1].price;
							  item2.backSize2 = item3.back[1].size;
							} else {
							  item2.back2 = null;
							  item2.backSize2 = null;
							}
							if (item3.back[2] != undefined) {
							  item3.back[2].size =
								parseFloat(item3.back[2].size) *
								parseFloat($scope.volMulti);
							  if (
								item2.back3 != item3.back[2].price ||
								item2.backSize3 != item3.back[2].size
							  ) {
								$(
								  "#" +
									$scope.noSpaceMarketid +
									" #runner" +
									index +
									"back3"
								).addClass("spark");
							  }
							  item2.back3 = item3.back[2].price;
							  item2.backSize3 = item3.back[2].size;
							} else {
							  item2.back3 = null;
							  item2.backSize3 = null;
							}
							if (item3.lay[0] != undefined) {
							  item3.lay[0].size =
								parseFloat(item3.lay[0].size) *
								parseFloat($scope.volMulti);
							  if (
								item2.lay1 != item3.lay[0].price ||
								item2.laySize1 != item3.lay[0].size
							  ) {
								$(
								  "#" +
									$scope.noSpaceMarketid +
									" #runner" +
									index +
									"lay1"
								).addClass("spark");
							  }
							  item2.lay1 = item3.lay[0].price;
							  item2.laySize1 = item3.lay[0].size;
							} else {
							  item2.lay1 = null;
							  item2.laySize1 = null;
							}
							if (item3.lay[1] != undefined) {
							  item3.lay[1].size =
								parseFloat(item3.lay[1].size) *
								parseFloat($scope.volMulti);
							  if (
								item2.lay2 != item3.lay[1].price ||
								item2.laySize2 != item3.lay[1].size
							  ) {
								$(
								  "#" +
									$scope.noSpaceMarketid +
									" #runner" +
									index +
									"lay2"
								).addClass("spark");
							  }
							  item2.lay2 = item3.lay[1].price;
							  item2.laySize2 = item3.lay[1].size;
							} else {
							  item2.lay2 = null;
							  item2.laySize2 = null;
							}
							if (item3.lay[2] != undefined) {
							  item3.lay[2].size =
								parseFloat(item3.lay[2].size) *
								parseFloat($scope.volMulti);
							  if (
								item2.lay3 != item3.lay[2].price ||
								item2.laySize3 != item3.lay[2].size
							  ) {
								$(
								  "#" +
									$scope.noSpaceMarketid +
									" #runner" +
									index +
									"lay3"
								).addClass("spark");
							  }
							  item2.lay3 = item3.lay[2].price;
							  item2.laySize3 = item3.lay[2].size;
							} else {
							  item2.lay3 = null;
							  item2.laySize3 = null;
							}
						  }
						}
					  );
					});
				  }
				});
			  }
			},
			function error(response) {
			  // $scope.pending_SessionData = false
			  if (response.status == 401) {
				// $.removeCookie("authtoken");
				window.location.href = "index.html";
			  }
			}
		  );
		}
	  };
  
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
		$scope.unSubscribeTeenPatti();
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
		// // if ($scope.marketdata.method == 1 || $scope.marketdata.method == undefined) {
		// //     $scope.fullScore = null;
		// //     return false;
		// // }
		// // https://ips.betfair.com/inplayservice/v1/scores?regionCode=UK&_ak=dyMLAanpRyIsjkpJ&alt=json&locale=en_GB&eventIds=29134308
		// if ($scope.matchBfId != undefined) {
		//   if ($scope.sportId == 1) {
		// 	$scope.scoreUrl =
		// 	  "https://ips.betfair.com/inplayservice/v1/eventTimelines?regionCode=UK&_ak=dyMLAanpRyIsjkpJ&alt=json&locale=de&eventIds=" +
		// 	  $scope.matchBfId;
		//   } else {
		// 	$scope.scoreUrl =
		// 	  "https://ips.betfair.com/inplayservice/v1/scores?regionCode=UK&_ak=dyMLAanpRyIsjkpJ&alt=json&locale=en_GB&eventIds=" +
		// 	  $scope.matchBfId;
		//   }
		//   $http({
		// 	url: $scope.scoreUrl,
		// 	method: "GET",
		//   }).then(function success(data) {
		// 	$scope.fullScore = data.data[0];
		// 	// console.log($scope.fullScore,"scoreboard")
		//   });
		// }
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
  
	  $scope.$on("$destroy", function () {
		// $scope.UnsubscribeMOMarket();
		// $scope.unSubscribeFancyMarket();
		// $scope.unSubscribeMatchScore();
		//== $scope.GetBets();
		//   $scope.unloadEvent();
		$interval.cancel(stscoreInterval);
		$interval.cancel(fiveSecsInterval);
	  });
	}
  );
  