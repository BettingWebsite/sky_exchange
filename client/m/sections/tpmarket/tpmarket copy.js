app.controller('tpmarketController', function ($scope, $http, $cookies, $rootScope, $timeout, $window, NavigationServices, $routeParams, $interval) {

	$rootScope.selectedTab = 'sports';

	$scope.sportId = $routeParams.sportId;
	$scope.mtBfId = $routeParams.mtBfId;
	$scope.matchId = $routeParams.matchId;
	$scope.marketId = $routeParams.marketId;
	$scope.bfId = $routeParams.bfId;
	$scope.tourId = $routeParams.tourId;

	var clock;
	$(function () {
		clock = new FlipClock($('.clock'), 99, {
			clockFace: 'Counter'
		});
	});

$scope.pending_GetRecentGameResult = true;
    $scope.GetRecentGameResult = function() {
        if ($scope.pending_GetRecentGameResult == false) {
            return false;
        }
        $scope.pending_GetRecentGameResult = false;
        NavigationServices.GetRecentGameResult($scope.subscriptionId).then(
            function success(data) {
                // console.log(data,'resultsdata');
                $scope.resultsdata = data.data.data;
                $scope.pending_GetRecentGameResult = true;
            },
            function error(err) {
                $scope.pending_GetRecentGameResult = true;
                if (err.status == 401) {
                    $rootScope.clearCookies();
                }
            }
        );
    };

    var Lastgammeresulttimer;
    $scope.LastgameResult = function(gametype) {
    	$scope.GetRecentGameResult(gametype);
        Lastgammeresulttimer = setInterval(function() {
            $scope.GetRecentGameResult(gametype);
        }, 10000);
    }

	$scope.marketCalls = true;
	$scope.getMarket = function () {
		if ($scope.marketCalls == false) {
			return false;
		}
		$scope.marketCalls = false;
		// $('#loading').css('display','flex');
		if ($rootScope.fType == 1) {
			NavigationServices.marketData($scope.matchId, $scope.marketId).then(function success(data) {
				$scope.marketCalls = true;

				$rootScope.curTime = data.data.curTime;
				if (!$scope.hubAddCall) {
					$scope.getMarketData = data.data.data;
				}
				$scope.getMarketData.marketId = $scope.marketId;
				$rootScope.matchName = $scope.getMarketData.matchName;



			}, function error(err) {
				$scope.marketCalls = true;
				// $('#loading').css('display','none');
				if (err.status == 401) {
					$rootScope.clearCookies();
				}
			})
		}
		else {
			$scope.marketCalls = true;
			if ($rootScope.SportsDatas != undefined) {
				$scope.getMarketDatas = $rootScope.SportsDatas[$scope.sportId].tournaments[$scope.tourId].matches[$scope.matchId];
				if (!$scope.hubAddCall) {
					$scope.getMarketData = $rootScope.mktWise($scope.getMarketDatas, $scope.bfId);
				}

				$rootScope.matchName = $scope.getMarketData.matchName;

				if ($rootScope.token != undefined && $rootScope.token != "") {
					if ($scope.getMarketDatas.bfId == "10000") {

						$scope.connectTPSignalr("http://45.76.155.250:11001/");
						$scope.subscriptionId = 1;
						 $scope.LastgameResult($scope.subscriptionId)
					}
					if ($scope.getMarketDatas.bfId == "5001") {

						$scope.connectTPSignalr("http://45.76.155.250:11002/");
						$scope.subscriptionId = 2;
						 $scope.LastgameResult($scope.subscriptionId)
					}
					if ($scope.getMarketDatas.bfId == "5002") {

						$scope.connectTPSignalr("http://45.76.155.250:11003/");
						$scope.subscriptionId = 3;
						 $scope.LastgameResult($scope.subscriptionId)
					}
					if ($scope.getMarketDatas.bfId == "5003") {

						$scope.connectTPSignalr("http://45.76.155.250:11004/");
						$scope.subscriptionId = 4;
						 $scope.LastgameResult($scope.subscriptionId)
					}
				}
			}
		}
	}
	// $scope.getMarket();

	$scope.TPHubAddress = null;
	$scope.connectTPSignalr = function (hubAddress) {
		$scope.TPHubAddress = hubAddress;
		$scope.TPConnection = $.hubConnection($scope.TPHubAddress);
		$scope.TPProxy = $scope.TPConnection.createHubProxy('FancyHub');

		$scope.TPConnection.start().done(function (TPConnection) {
			console.log('TP Connected ' + TPConnection.state);
		}).fail(function (TPConnection) {
			console.log('TP not connected ' + TPConnection.message);
		})

		$scope.TPConnection.stateChanged(function (TPState) {
			console.log(TPState)
			if (TPState.newState != 1 && $scope.TPHubAddress != null) {
				$scope.TPConnection.start().done(function (TPConnection) {
					console.log('TP Reconnected ' + TPConnection.state);
				}).fail(function (TPConnection) {
					console.log('TP not Reconnected ' + TPConnection.message);
				})
			}
			if (TPState.newState == 1 && $scope.TPHubAddress != null) {
				$scope.TPSubscribe();
			}
		})

		$scope.TPProxy.on('BroadcastSubscribedData', function (data) {
			// console.log(data);

			$scope.$apply(function () {

				if ($scope.subscriptionId == 1) {
					$scope.tpData = data.data.t1[0];
					clock.setValue($scope.tpData.autotime);
					$scope.tpMarket = data.data.t2;
					$rootScope.getTPExposureBook($scope.tpData.mid);
				}
				if ($scope.subscriptionId == 2) {
					$scope.tpMarket = data.data.bf;
					if ($scope.tpMarket[0].lastime) {
						clock.setValue($scope.tpMarket[0].lastime);
					}
				}
				if ($scope.subscriptionId == 3) {
					$scope.tpData = data.data.t1[0];
					clock.setValue($scope.tpData.autotime);
					$scope.tpMarket = data.data.t2;
				}
				if ($scope.subscriptionId == 4) {
					$scope.tpData = data.data.t1[0];
					$scope.openCards = $scope.tpData.cards.split(',');
					// console.log($scope.openCards);
					clock.setValue($scope.tpData.autotime);
					$scope.tpMarket = data.data.t2;
				}

			})
		})

	}

	$scope.TPSubscribe = function () {
		$scope.TPProxy.invoke('SubscribeFancy', $scope.subscriptionId);
	}
	$scope.TPUnsubscribe = function () {
		if ($scope.TPHubAddress) {
			$scope.TPProxy.invoke('UnsubscribeFancy', $scope.subscriptionId);
			$scope.TPHubAddress = null;
			$scope.TPConnection.stop();
		}

	}


	$scope.getCardSymbolImg = function (cardName) {
		if (cardName == "1") {
			return "";
		}
		let char = ""
		let type = ""
		let className = ""
		let value = ""
		if (cardName.length == 4) {
			char = cardName.substring(0, 2)
			type = cardName.slice(2)
		} else {
			char = cardName.charAt(0)
			type = cardName.slice(1)
		}
		switch (type) {
			case "HH":
				type = "}"
				className = "card-black1"
				break;
			case "DD":
				type = "{"
				className = "card-red1"
				break;
			case "CC":
				type = "]"
				className = "card-black1"
				break;
			case "SS":
				type = "["
				className = "card-red1"
				break;
		}


		value = char + '<span class="' + className + '">' + type + '</span>';

		return value;
	}



	$scope.$on('$destroy', function () {

		if ($rootScope.token != undefined && $rootScope.token != "") {

			$scope.TPUnsubscribe();
		}
	})


	$scope.allMarketCalls = true;
	$scope.getAllMarket = function () {
		if ($scope.allMarketCalls == false) {
			return false;
		}
		$scope.allMarketCalls = false;
		$('#loading').css('display', 'flex');

		if ($rootScope.fType == 1) {
			NavigationServices.allMarket($scope.matchId).then(function success(data) {
				$scope.allMarketCalls = true;

				$scope.allMarketData = data.data.data;
				$('#loading').css('display', 'none');
				$scope.getMarket();

			}, function error(err) {
				$scope.allMarketCalls = true;
				$('#loading').css('display', 'none');
				if (err.status == 401) {
					$rootScope.clearCookies();
				}
			})
		}
		else {
			// $('#loading').css('display','none');
			$scope.allMarketCalls = true;
			if ($rootScope.SportsDatas != undefined) {
				$scope.allMarketData = $rootScope.allMarketWise($rootScope.SportsDatas[$scope.sportId].tournaments[$scope.tourId].matches[$scope.matchId]);
				$scope.getMarket();
				$('#loading').css('display', 'none');
			}
		}

	}
	$scope.getAllMarket();

	var callAllMktEvent = $rootScope.$on('allMktEvent', function (event, data) {
		$scope.getAllMarket();
		$rootScope.clientCount++;
	})
	$scope.$on('$destroy', callAllMktEvent);

})