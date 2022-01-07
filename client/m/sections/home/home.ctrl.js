app.controller(
  "homeController",
  function (
    $scope,
    $http,
    $cookies,
    $rootScope,
    $timeout,
    $window,
    NavigationServices,
    $routeParams,
    $location,
    $interval,
    $filter,
    $route,
    $location
  ) {
    $rootScope.matchDataHome = {};
    $rootScope.isCasinoPage = false;

    $rootScope.clearCookies = function () {
      // $cookies.remove('rememberMe');
      $cookies.remove("authtokenmobile", { path: "/" });
      $cookies.remove("current_client", { path: "/" });
      $rootScope.token = null;
      token = null;
      $window.location.href = "index.html";
    };

    $rootScope.token = $.cookie("authtokenmobile");
    token = $rootScope.token;
    // if ($.cookie("authtokenmobile")) {
    // } else {
    //   $rootScope.clearCookies();
    // }

    let currentUser = $.cookie("current_client_mobile");
    if (!!currentUser) {
      $rootScope.currentUser = JSON.parse(currentUser);
    }

    // if ($rootScope.token==undefined || $rootScope.token=="") {
    // 	// $scope.connectClientSignalr("http://173.212.223.243:9440","1937-789-123");
    // 	// $rootScope.clearCookies();
    // }
    // else{
    // 	$rootScope.token=JSON.parse($rootScope.token);
    // 	token=$rootScope.token;
    // 	// $scope.getUserDescription();
    // }
    // $rootScope.ApiUrl = 'http://www.lcexchanges247.com/Client/BetClient.svc/';
    $rootScope.ApiUrl = "http://136.244.79.114:82/";
    raceUrl = "http://209.250.242.175:33333";
    ApiUrl = $rootScope.ApiUrl;

    $rootScope.info =
      "os:" +
      jscd.os +
      ", os_version:" +
      jscd.osVersion +
      ", browser:" +
      jscd.browser +
      ", browser_version:" +
      jscd.browserMajorVersion;

    $scope.userDescriptionCalls = true;
    // $scope.getUserDescription=function(){
    // 	if ($scope.userDescriptionCalls==false) {
    // 		return false;
    // 	}
    // 	$scope.userDescriptionCalls=false;

    // 	$('#loading').css('display','flex');
    // 	NavigationServices.userDescription().then(function success(data){
    // 		console.log("1.getUserDescription", data);
    // 		$scope.userData=data.data.data;
    // 		$rootScope.fType=$scope.userData.fType;
    // 		 $rootScope.isTennpatti = $scope.userData.isTennpatti;
    // 		if ($scope.userData.add!=null && $rootScope.fType==2) {
    // 			$scope.connectClientSignalr($scope.userData.add,$rootScope.token);
    // 			$scope.GetUserData();
    // 			$('#loading').css('display','flex');
    // 		}
    // 		else if ($rootScope.fType==1) {

    // 		}
    // 		// $('#loading').css('display','none');

    // 	},function error(err){
    // 		$scope.userDescriptionCalls=true;
    // 		// $('#loading').css('display','none');
    // 		if (err.status==401) {
    // 			$rootScope.clearCookies();
    // 		}
    // 	})
    // }

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

    $rootScope.currencyCode = 'INR';
    $rootScope.userDescription = function () {
      $http({
        url: ApiUrl + "/profile",
        method: "GET",
        headers: {
          Authorization: token,
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

    $scope.sportsListCalls = true;
    $rootScope.sportsData = {};
    $scope.getSportsList = function () {
      if ($scope.sportsListCalls == false) {
        return false;
      }
      $scope.sportsListCalls = false;
      // $('#loading').css('display','flex');

      // if ($rootScope.fType==1) {
      NavigationServices.sportsList().then(
        function success(data) {
          $scope.sportsListCalls = true;

          $scope.sportsData = data.data.result;

          angular.forEach($scope.sportsData, function (item, index) {
            if (index == 0 && $scope.selectedSport == undefined) {
              $scope.getHighlights(item);
            }
          });
        },
        function error(err) {
          $scope.sportsListCalls = true;
          if (err.status == 401) {
            $rootScope.clearCookies();
          }
        }
      );
      // }
      // else{
      // 	$scope.sportsListCalls=true;
      // 	if ($rootScope.sportsData!=undefined) {
      // 		$scope.sportsData=$rootScope.sportWise($rootScope.sportsData);

      // 		angular.forEach($scope.sportsData,function(item,index){
      // 			if (index==0 && $scope.selectedSport==undefined) {
      // 				$scope.getHighlights(item);
      // 			}
      // 		});
      // 	}
      // }
    };

    $scope.getSportNameId = function (sportIdName) {
      if (sportIdName == "Cricket") {
        return 4;
      } else if (sportIdName == "Soccer") {
        return 1;
      } else if (sportIdName == "Tennis") {
        return 2;
      } else if (sportIdName == "Kabaddi") {
        return 20;
      } else if (sportIdName == "Live Casino") {
        return 15;
      } else if (sportIdName == "4") {
        return "Cricket";
      } else if (sportIdName == "1") {
        return "Soccer";
      } else if (sportIdName == "2") {
        return "Tennis";
      } else if (sportIdName == "20") {
        return "Kabaddi";
      } else if (sportIdName == "15") {
        return "Live Casino";
      } else if (sportIdName == "7.1") {
        return "Horse Racing Today's Card";
      } else if (sportIdName == "7.2") {
        return "Horse Racing";
      } else if (sportIdName == "4339.1") {
        return "Greyhound Racing Today's Card";
      } else if (sportIdName == "4339.2") {
        return "Greyhound Racing";
      }
    };

    $scope.highlightsCalls = true;
    // $scope.getHighlights = function (item) {
    // 	console.log("call highlight")
    // 	if (item == 'Basketball') {
    // 		item = {
    // 			id: "100",
    // 			name: "Basketball",
    // 			ids: 10
    // 		}
    // 	}
    // 	if (item == 'Rugby') {
    // 		item = {
    // 			id: "300",
    // 			name: "Rugby",
    // 			ids: 1145
    // 		}
    // 	}
    // 	if (item == 'Horse Racing') {
    // 		item = {
    // 			id: "400",
    // 			name: "Horse Racing",
    // 			ids: 1150
    // 		}
    // 	}
    // 	if (item == 'Casino') {
    // 		item = {
    // 			id: "500",
    // 			name: "Casino",
    // 			ids: 1160
    // 		}
    // 	}
    // 	if ($scope.highlightsCalls == false) {
    // 		return false;
    // 	}
    // 	$scope.highlightsCalls = false;

    // 	$('#loading').css('display', 'flex');
    // 	$scope.selectedSport = item;
    // 	if ($rootScope.fType == 1) {
    // 		NavigationServices.highlights($scope.selectedSport.id).then(function success(data) {
    // 			$scope.highlightsCalls = true;
    // 			$rootScope.curTime = data.data.curTime;
    // 			$scope.highlightsData = data.data.data;
    // 			$('#loading').css('display', 'none');

    // 		}, function error(err) {
    // 			$scope.highlightsCalls = true;
    // 			$('#loading').css('display', 'none');
    // 			if (err.status == 401) {
    // 				$rootScope.clearCookies();
    // 			}
    // 		})
    // 	}
    // 	else {
    // 		$('#loading').css('display', 'none');
    // 		$scope.highlightsCalls = true;
    // 		if ($rootScope.sportsData != undefined) {
    // 			if ($scope.selectedSport.id != "100" || $scope.selectedSport.id != "300" || $scope.selectedSport.id != "400" || $scope.selectedSport.id != "500") {
    // 				$scope.highlightsData = $rootScope.highlightsWise($rootScope.sportsData[$scope.selectedSport.id]);
    // 			}
    // 		}
    // 	}

    // }

    var highlightInterval;
    $scope.$on("$routeChangeStart", function (scope, next, current) {
      console.log(next.$$route.controller);

      if (
        next.$$route.controller != undefined ||
        (next.$$route.controller && next.$$route.controller.includes("fullmarket"))
      ) {
        $interval.cancel(highlightInterval);
        $scope.listGamesOn = false;
      } else {
        $interval.cancel(highlightInterval);
        highlightInterval = $interval(function () {
          if ($scope.selectedSport != undefined) {
            // $scope.getHighlights($scope.selectedSport);
            $scope.getSportsList();
            // console.log($scope.selectedSport)
          }
        }, 2000);
        $scope.listGamesOn = true;
      }

      $scope.isFullmarket = false;
      if (
        next.$$route.controller &&
        next.$$route.controller.includes("fullmarket")
      ) {
        $scope.isFullmarket = true;
      } else {
        $scope.isFullmarket = false;
      }
    });

    $scope.orderByDate = function (timeg) {
      var matchDateTime;
      if (timeg.matchDate == undefined) {
        return (matchDateTime = new Date(
          $scope.matchDateDigit(timeg.startDate).replace(/ /g, "T")
        ));
      } else {
        return (matchDateTime = new Date(
          $scope.matchDateDigit(timeg.matchDate).replace(/ /g, "T")
        ));
      }
    };

    $scope.checkDateTime = function (matchDate, currentDate) {
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
        // if ((day<=0 && hrs<=3)) {
        return false;
      } else {
        return true;
      }
    };

    // $rootScope.getDateTime = function (matchDate, currentDate, state) {
    //   var matchDateTime = $scope
    //     .matchDateDigit(matchDate)
    //     .split("-")[2]
    //     .split(" ")[0];
    //   var currentDateTime = currentDate.split("-")[2].split(" ")[0];
    //   var day = parseInt(matchDateTime) - parseInt(currentDateTime);
    //   if (day == 0 && state != 1) {
    //     return $scope
    //       .matchDateDigit(matchDate)
    //       .replace(/ /g, "T")
    //       .split("T")[1];
    //   } else if (day == 1 && state != 1) {
    //     return (
    //       "Tomorrow " +
    //       $scope.matchDateDigit(matchDate).replace(/ /g, "T").split("T")[1]
    //     );
    //   } else if (state != 1) {
    //     return $scope.matchDateDigit(matchDate);
    //   } else if (state == 1) {
    //     return day;
    //   }
    // };

    $scope.matchDateDigit = function (date) {
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
    };

    // $rootScope.multiMarketsArray=[];

    $scope.addMultiMarketCalls = true;
    $scope.addMultiMarket = function (marketId) {
      if ($rootScope.token == undefined || $rootScope.token == "") {
        $window.location.href = "login.html";
        return false;
      }

      if (marketId == undefined) {
        return;
      } else {
        $scope.addMarketId = marketId;
      }
      $rootScope.multiMarketsArray = localStorage.getItem("multiMarketArray");
      if ($rootScope.multiMarketsArray == null) {
        $rootScope.multiMarketsArray = [];
      } else {
        $rootScope.multiMarketsArray = JSON.parse($rootScope.multiMarketsArray);
      }
      // console.log($rootScope.multiMarketsArray)
      var checkMulti = $rootScope.multiMarketsArray.indexOf($scope.addMarketId);
      if (checkMulti == -1) {
        $rootScope.multiMarketsArray.push($scope.addMarketId);
      }
      localStorage.setItem(
        "multiMarketArray",
        JSON.stringify($rootScope.multiMarketsArray)
      );
    };
    $scope.removeMultiMarketCalls = true;
    $scope.removeMultiMarket = function (marketId, index, isFancy) {
      if (marketId === undefined) {
        return;
      }
      $scope.addMarketId = marketId;

      $rootScope.multiMarketsArray = localStorage.getItem("multiMarketArray");
      if ($rootScope.multiMarketsArray == null) {
        $rootScope.multiMarketsArray = [];
      } else {
        $rootScope.multiMarketsArray = JSON.parse($rootScope.multiMarketsArray);
      }
      // console.log($rootScope.multiMarketsArray)
      var checkMulti = $rootScope.multiMarketsArray.indexOf($scope.addMarketId);
      if (checkMulti > -1) {
        $rootScope.multiMarketsArray.splice(checkMulti, 1);
        if (index != undefined) {
          // if (isFancy == 1) {
          //   $rootScope.multiFancyData.splice(index, 1);
          //   $rootScope.fancyBfIdArray.splice(index, 1);
          // } else {
          //   $rootScope.multiMarketData.splice(index, 1);
          //   $rootScope.marketBfIdArray.splice(index, 1);
          // }
        }
      }
      localStorage.setItem(
        "multiMarketArray",
        JSON.stringify($rootScope.multiMarketsArray)
      );
      if ($location.path().toLowerCase().includes("multimarket")) {
        $rootScope.getMultiMarkets();
      }
    };

    $scope.isMultiAdded = function (marketId) {
      if (marketId == undefined) {
        return false;
      }
      $scope.addMarketId = marketId;
      $rootScope.multiMarketsArray = localStorage.getItem("multiMarketArray");
      if ($rootScope.multiMarketsArray == null) {
        $rootScope.multiMarketsArray = [];
      } else {
        $rootScope.multiMarketsArray = JSON.parse($rootScope.multiMarketsArray);
      }
      // console.log($rootScope.multiMarketsArray)
      var checkMulti = $rootScope.multiMarketsArray.indexOf($scope.addMarketId);
      if (checkMulti > -1) {
        return false;
      } else {
        return true;
      }
    };

    $scope.getAllEventsCalls = true;
    $scope.getAllEvents = function () {
      if ($scope.getAllEventsCalls == false) {
        return false;
      }
      $scope.getAllEventsCalls = false;

      if ($rootScope.fType == 1) {
        NavigationServices.allSportsEvents().then(
          function success(data) {
            $scope.getAllEventsCalls = true;
            $scope.allEventsData = data.data.data;
            $scope.searchClear();
          },
          function error(err) {
            $scope.getAllEventsCalls = true;
            if (err.status == 401) {
              $rootScope.clearCookies();
            }
          }
        );
      } else {
        $scope.getAllEventsCalls = true;
        if ($rootScope.sportsData != undefined) {
          // console.log($rootScope.sportsData)
          $scope.allEventsData = $rootScope.searchWiseMatch(
            $rootScope.sportsData
          );
          // console.log($scope.allEventsData)
          // $scope.searchClear();
        }
      }
    };

    $scope.searchEvent = function () {
      $scope.searchEventList = [];
      $scope.searchInput = $scope.searchInput.toLowerCase();

      angular.forEach($scope.allEventsData, function (item) {
        // console.log(item)
        if (
          item.matchName.toLowerCase().indexOf($scope.searchInput) != -1 &&
          $scope.searchInput.length >= 3
        ) {
          // console.log($scope.allEventsData)
          $scope.searchEventList.push(item);
          // console.log($scope.searchEventList)
        }
      });
    };

    $scope.openSearchWrap = function () {
      $("#searchWrap").css("display", "block");
      $(".search-input").focus();
      $scope.searchInput = "";
      $scope.getAllEvents();
    };

    $scope.searchClear = function () {
      $scope.searchInput = "";
      $scope.searchEvent();
    };
    $scope.addExpand = function () {
      $("#searchWrap #searchPop").addClass("expand");
    };
    $scope.removeExpand = function () {
      $("#searchWrap #searchPop").removeClass("expand");
    };

    $scope.refreshFundsCalls = true;
    $scope.refreshFunds = function () {
      if ($scope.refreshFundsCalls == false) {
        return false;
      }
      $scope.refreshFundsCalls = false;

      $http({
        // url:$rootScope.ApiUrl+'Data/Fund4',
        url: ApiUrl + "/balance",
        method: "GET",
        headers: {
          Authorization: $rootScope.token,
        },
      }).then(
        function success(data) {
          $scope.refreshFundsCalls = true;
          if (data.data.errorCode === 0) {
            $scope.fundsData = data.data.result[0];
          }
        },
        function error(err) {
          $scope.refreshFundsCalls = true;
          if (err.status == 401) {
            $rootScope.clearCookies();
          }
        }
      );
    };

    $scope.refreshFunds();

    $rootScope.default_stake = 0;

    $scope.defaultStake = function (stake) {
      $rootScope.default_stake = stake;
    };

    $rootScope.stakeList = [
      { id: 1, stake: 500 },
      { id: 2, stake: 1000 },
      { id: 3, stake: 5000 },
      { id: 4, stake: 10000 },
      { id: 5, stake: 20000 },
      { id: 6, stake: 25000 },
    ];
    $scope.getSettingsCalls = true;
    $scope.getSettings = function () {
      var default_stake = $.cookie("settingsMobile");
      if (default_stake) {
        $rootScope.default_stake = +JSON.parse(default_stake);
      } else {
        $rootScope.default_stake = 0;
      }

      var stakeList = $.cookie("stakeSettingMobile");
      if (stakeList) {
        $rootScope.stakeList = JSON.parse(stakeList);
      }

      if ($rootScope.default_stake == 0) {
        $rootScope.default_stake = "";
      }
    };

    setTimeout(() => {
      $scope.getSettings();
    }, 1000);

    $scope.saveBetStakeSetting = function () {
      var newStakeList = [];
      for (let i = 0; i < 6; i++) {
        const element = { id: i, stake: +$("#stake" + i).val() };
        newStakeList.push(element);
      }
      $rootScope.stakeList = newStakeList;
      var finalData = JSON.stringify(newStakeList);
      $.cookie("stakeSettingMobile", finalData);
    };

    $scope.saveSetting = function () {
      if (!$scope.editSaveStake) {
        return false;
      }

      if ($scope.oddsval == true) {
        $scope.oddsvalchk = 1;
      } else {
        $scope.oddsvalchk = 0;
      }
      if ($rootScope.default_stake == "") {
        $rootScope.default_stake = 0;
      }
      $.cookie("settingsMobile", JSON.stringify($rootScope.default_stake));
    };

    $scope.editSaveStake = true;
    $scope.editStake = function () {
      $scope.editSaveStake = !$scope.editSaveStake;
    };
    $scope.saveStake = function () {
      $scope.editSaveStake = !$scope.editSaveStake;
      $scope.saveBetStakeSetting();
    };

    $scope.toggleSwitch = function () {
      if ($rootScope.settingsData.isOddsHighlights == 0) {
        $rootScope.settingsData.isOddsHighlights = 1;
      } else {
        $rootScope.settingsData.isOddsHighlights = 0;
      }
    };

    $rootScope.tvUrl = "";
    $scope.openCloseTv = true;
    $scope.openTv = function () {
      if ($scope.openCloseTv) {
        // if ($rootScope.liveTvConfig.channelIp==null) {
        //  return false;
        // }
        // $scope.openCloseTv=!$scope.openCloseTv;
        // var channelIp = $rootScope.liveTvConfig.channelIp.trim()
        //       var channelNo = $rootScope.liveTvConfig.channelNo
        //       var hdmi = $rootScope.liveTvConfig.hdmi.trim()
        //       var program = "p1"
        //       $('#liveTvContent').html('<div id="hasTv" style="padding-left:0px;padding-top:4px;text-align:center"> <u1 id="' + program + '"></u1> <script type="text/javascript"> if ( "MediaSource" in window && "WebSocket" in window ){RunPlayer( \'' + program + '\', "100%", 200, \'' + channelIp + '\', "443", true, \'' + hdmi + '\', "", true, true, 0.01, "", false ); } else {document.getElementById(' + program + ').innerHTML = "Websockets are not supported in your browser."; } </script> </div>');

        var width = window.innerWidth;
        var height = Math.ceil(width / 1.778);

        $rootScope.loader = true;

        setTimeout(function () {
          $rootScope.loader = false;
        }, 1000);

        // var matchid = $routeParams.mtBfId;

        $scope.openCloseTv = !$scope.openCloseTv;

        $("#liveTvContent").append(
          '<iframe id="mobilePlayer" allowfullscreen="true" frameborder="0" scrolling="no" style="overflow: hidden; width: ' +
            width +
            "px; height: " +
            height +
            'px;" src="' +
            $rootScope.tvUrl +
            '"></iframe>'
        );
      } else if (
        $scope.openCloseTv &&
        $rootScope.liveTvConfig == undefined &&
        $routeParams.mtBfId != null
      ) {
        var width = window.innerWidth;
        var height = Math.ceil(width / 1.778);

        // if($routeParams.sportId==2){
        //  height=200;
        // }
        $rootScope.loader = true;

        setTimeout(function () {
          $rootScope.loader = false;
        }, 5000);

        var matchid = $routeParams.mtBfId;
        console.log(matchid);

        $scope.openCloseTv = !$scope.openCloseTv;

        $("#liveTvContent").append(
          '<iframe id="mobilePlayer" allowfullscreen="true" frameborder="0" scrolling="no" style="overflow: hidden; width: ' +
            width +
            "px; height: " +
            height +
            'px;" src="https://videoplayer.betfair.com/GetPlayer.do?tr=266&eID=' +
            matchid +
            "&contentType=viz&contentOnly=true&statsToggle=show&width=" +
            width +
            "&height=" +
            height +
            '" height="' +
            height +
            '"></iframe>'
        );
      }
      // else if (!$scope.openCloseTv && $rootScope.liveTvConfig!=undefined) {
      //  $('#liveTvContent').html("");

      //  $scope.openCloseTv=!$scope.openCloseTv;
      // }
      else if (!$scope.openCloseTv) {
        $("#liveTvContent").html("");

        $scope.openCloseTv = !$scope.openCloseTv;
      }
    };

    $scope.openBetsLeftSide = function () {
      $("#openBetsLeftSide").css("display", "block");
      $("#openBetsLeftSide #openBetSlide").addClass("left-in");
      $timeout(function () {
        $("#openBetsLeftSide #openBetSlide").removeClass("left-in");
      }, 200);
    };
    $scope.openSettingRightSide = function () {
      $("#settingDiv").css("display", "flex");
      $("#settingDiv #settingSlide").addClass("right-in");
      $timeout(function () {
        $("#settingDiv #settingSlide").removeClass("right-in");
      }, 200);
    };
    $scope.showOverlayInfo = function (id) {
      $("#" + id).css("display", "flex");
    };
    $scope.closeOverlayInfo = function (id) {
      if (id == "settingDiv") {
        if (!$scope.editSaveStake) {
          return false;
        }
      }
      $("#" + id).css("display", "none");
      $scope.fancyBookData = null;
    };

    $scope.openCloseFancyInfo = function (fancy) {
      $scope.fancyInfo = fancy;
    };

    // $rootScope.$on("$routeChangeStart", function (event, next, current) {
    // 	console.log(current)
    //     // if (next && next.$$route && next.$$route.secure) {

    //     // }
    // });
    $rootScope.selectedTab = "home";
    $scope.selectTab = function (select) {
      $rootScope.selectedTab = select;
    };

    $scope.showBetInfo = false;
    $scope.betInfo = function () {
      $scope.showBetInfo = !$scope.showBetInfo;
    };

    $scope.isAvg = false;
    $scope.betAvg = function () {
      $scope.isAvg = !$scope.isAvg;
      $scope.getAllBets($scope.selectedMatchBets);
    };

    $scope.getAllBetsCalls = true;

    $scope.getAllBets = function (match) {
      $scope.selectedMatchBets = match;

      if (match == undefined) {
        $scope.matchedDataLength = 0;
        $scope.matchedData = [];
        $scope.unMatchedDataLength = 0;
        $scope.unMatchedData = [];
        if ($routeParams.matchId == undefined) {
          $scope.getMatchId = 0;
        } else {
          $scope.getMatchId = $routeParams.matchId;
          angular.forEach($scope.matchArrayData, function (item) {
            if ($scope.getMatchId == item.matchId) {
              $scope.selectedMatchBets = item;
            }
          });
        }
      } else if (match == 0) {
        $scope.getMatchId = match;
        $scope.matchedDataLength = 0;
        $scope.matchedData = [];
        $scope.unMatchedDataLength = 0;
        $scope.unMatchedData = [];
        $scope.selectedMatchBets = undefined;
      } else {
        $scope.getMatchId = match.matchId;
      }
      if ($scope.isAvg) {
        $scope.avg = 1;
      } else {
        $scope.avg = 0;
      }
      NavigationServices.getAllBets().then(
        function success(response) {
          if ($scope.getMatchId != 0) {
            $scope.matchedData = $scope.getMatchBetArray(
              response.data.result,
              $scope.getMatchId
            );
            $scope.matchedDataLength = $scope.matchedData.length;
            // console.log($scope.matchedData);
            // console.log($scope.unMatchedData);
            if ($scope.matchedData.length >= 1) {
              if ($scope.selectedMatchBets == undefined) {
                $scope.selectedMatchBets = {
                  matchName: response.data.result[0].eventName,
                  matchId: response.data.result[0].eventId,
                };
              }
            }
          }

          if ($scope.getMatchId == 0) {
            $scope.matchedDataLength = 0;
            $scope.matchedData = [];
            $scope.unMatchedDataLength = 0;
            $scope.unMatchedData = [];
            $scope.matchArrayData = $scope.getMatchArray(response.data.result);
            // console.log($scope.matchArrayData);
          }

          if ($scope.avg === 1) {
            let countMap = {};
            Object.keys($scope.matchedData).forEach((market) => {
              Object.keys($scope.matchedData[market]).forEach((betType) => {
                $scope.matchedData[market][betType] = $scope.matchedData[
                  market
                ][betType]
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
              });
            });

            setTimeout(() => {
              $scope.$apply(() => {
                $scope.matchedData = $scope.matchedData;
              });
            });
          }
        },
        function error(err) {
          $scope.getAllBetsCalls = true;
          if (err.status == 401) {
            $rootScope.clearCookies();
          }
        }
      );
    };

    $scope.getMatchArray = function (matchedData, matchId) {
      var matchArray = [];
      var matchArrayCheck = [];

      if (matchId) {
        angular.forEach(matchedData, function (item) {
          if (
            matchArrayCheck.indexOf(item.eventId) == -1 &&
            +item.eventId === +matchId
          ) {
            matchArray.push({
              matchName: item.eventName,
              matchId: item.eventId,
            });
            matchArrayCheck.push(item.eventId);
          }
        });
      } else {
        angular.forEach(matchedData, function (item) {
          if (matchArrayCheck.indexOf(item.eventId) == -1) {
            matchArray.push({
              matchName: item.eventName,
              matchId: item.eventId,
            });
            matchArrayCheck.push(item.eventId);
          }
        });
      }

      return matchArray;
    };

    $scope.getMatchBetArray = function (matchedData, matchId) {
      var back = [];
      var lay = [];
      var yes = [];
      var no = [];
      var marketBets = {
        back: back,
        lay: lay,
      };
      var sessionBets = {
        yes: yes,
        no: no,
      };

      var matchBetWiseArray = {
        marketBet: marketBets,
        sessionBets: sessionBets,
      };

      if (matchId) {
        matchedData = matchedData.filter((m) => +m.eventId === +matchId);

        angular.forEach(matchedData, function (item) {
          if (item.isFancy != 1) {
            if (item.betType == "back") {
              matchBetWiseArray.marketBet.back.push(item);
            } else {
              matchBetWiseArray.marketBet.lay.push(item);
            }
          } else {
            if (item.betType == "yes") {
              matchBetWiseArray.sessionBets.yes.push(item);
            } else {
              matchBetWiseArray.sessionBets.no.push(item);
            }
          }
        });
      } else {
        angular.forEach(matchedData, function (item) {
          if (item.isFancy != 1) {
            if (item.betType == "back") {
              matchBetWiseArray.marketBet.back.push(item);
            } else {
              matchBetWiseArray.marketBet.lay.push(item);
            }
          } else {
            if (item.betType == "yes") {
              matchBetWiseArray.sessionBets.yes.push(item);
            } else {
              matchBetWiseArray.sessionBets.no.push(item);
            }
          }
        });
      }

      return matchBetWiseArray;
    };

    $scope.editBtn = function (bet) {
      $scope.selectedBet = angular.copy(bet);
    };

    $scope.editMOBetCalls = true;
    $scope.editMOBet = function (eMOData) {
      $("#loading").css("display", "flex");

      if ($scope.editMOBetCalls == false) {
        return false;
      }
      $scope.editMOBetCalls = false;

      $scope.eMoBet = {
        betId: eMOData.id,
        odds: eMOData.odds,
        stake: eMOData.stake,
      };
      $scope.eMoBet["source"] = context;
      $scope.eMoBet["info"] =
        "os:" +
        jscd.os +
        ", os_version:" +
        jscd.osVersion +
        ", browser:" +
        jscd.browser +
        ", browser_version:" +
        jscd.browserMajorVersion;
      $scope.selectedBet = null;
      // console.log($scope.eMoBe)
      NavigationServices.editMOBet($scope.eMoBet).then(
        function success(data) {
          // console.log(data);
          $scope.displayMsg(data.data, 1);
          $scope.refreshFunds();
          $scope.placeMarketData = null;
          $("#loading").css("display", "none");
          $scope.editMOBetCalls = true;
          // $('.back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3').removeClass('select');

          if (data.data.status == "Success") {
            $rootScope.getExposureBook(eMOData.marketId, "1");
          }
          // else{
          // 	$rootScope.getExposureBook(MOData.marketId);
          // }
        },
        function error(err) {
          $scope.editMOBetCalls = true;
          $("#loading").css("display", "none");

          if (err.status == 401) {
            $rootScope.clearCookies();
          }
        }
      );
    };

    $scope.cancelAll = function () {
      angular.forEach($scope.unMatchedData.marketBet.back, function (item) {
        $scope.cancelBet(item.id);
      });
      angular.forEach($scope.unMatchedData.marketBet.lay, function (item) {
        $scope.cancelBet(item.id);
      });
    };

    // $scope.cancelBetCalls=true;
    $scope.cancelBet = function (betId) {
      // if ($scope.cancelBetCalls==false) {
      // 	return false;
      // }
      // $scope.cancelBetCalls=false;
      $("#loading").css("display", "flex");

      NavigationServices.cancelBet(betId).then(
        function success(data) {
          // console.log(data);

          $scope.betMsgResult = data.data;
          $scope.removeMsg();
          // $scope.displayMsg(data.data);
          $("#loading").css("display", "none");
          // $scope.cancelBetCalls=true;

          if (data.data.status == "Success") {
            $scope.getAllBets();
            $scope.refreshFunds();
            // $rootScope.getExposureBook(MOData.marketId);
          } else {
            // $rootScope.getExposureBook(MOData.marketId);
          }
        },
        function error(err) {
          // $scope.cancelBetCalls=true;
          $("#loading").css("display", "none");

          if (err.status == 401) {
            $rootScope.clearCookies();
          }
        }
      );
    };

    $scope.placeMOBetCalls = true;
    $scope.placeMOBet = function (MOData) {
      $scope.confirmPlaceMarketData = null;
      $("#loading").css("display", "flex");

      if ($scope.placeMOBetCalls == false) {
        return false;
      }
      $scope.placeMOBetCalls = false;
      let betData1 = {
        marketId: MOData.marketId,
        selId: MOData.selectionId,
        odds: MOData.odds,
        stake: +MOData.stake,
        betType: MOData.backlay,
        gameType: "exchange",
      };
      NavigationServices.placeBets(betData1).then(
        function success(response) {
          // console.log(response);
          $scope.cancelBetslip();
          console.log(response.data.errorDescription);
          $scope.displayMsg(response.data);
          $scope.placeMarketData = null;
          $("#loading").css("display", "none");
          $scope.placeMOBetCalls = true;
          $(".back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3").removeClass(
            "select"
          );

          if (response.data.errorCode == 0) {
            setTimeout(() => {
              $rootScope.getExposureBook(betData1.marketId, "1");
              $scope.refreshFunds();
            }, 1000);
          } else {
            $rootScope.getExposureBook(betData1.marketId, "1");
            $scope.refreshFunds();
          }
        },
        function error(err) {
          $scope.placeMOBetCalls = true;
          $("#loading").css("display", "none");

          if (err.status == 401) {
            $rootScope.clearCookies();
          }
        }
      );
    };

    $scope.placeBMBetCalls = true;
    $scope.placeBMBet = function (BMData) {
      if ($rootScope.token == undefined || $rootScope.token == "") {
        $window.location.href = "login.html";
        return false;
      }
      $("#loading").css("display", "flex");

      if ($scope.placeBMBetCalls == false) {
        return false;
      }
      $scope.placeBMBetCalls = false;
      let betData1 = {
        marketId: BMData.marketId,
        selId: BMData.selectionId,
        odds: BMData.odds,
        stake: +BMData.stake,
        betType: BMData.backlay == "backBook"? 'back': 'lay',
        gameType: "book",
      };
      NavigationServices.placeBets(betData1).then(
        function success(data) {
          // console.log(data);
          $scope.cancelBetslip();
          $scope.displayMsg(data.data);
          $scope.placeBookData = null;
          $("#loading").css("display", "none");
          $scope.placeBMBetCalls = true;
          $(".back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3").removeClass(
            "select"
          );

          $scope.calcExposure(BMData, "remove");
          if (data.data.errorCode == 0) {
            setTimeout(() => {
              $rootScope.getBMExposureBook(BMData.marketId);
              $scope.refreshFunds();
            }, 1000);
          } else {
            // $rootScope.getBMExposureBook(BMData.marketId,BMData.bookId);
          }
        },
        function error(err) {
          $scope.placeBMBetCalls = true;
          $("#loading").css("display", "none");

          if (err.status == 401) {
            $rootScope.clearCookies();
          }
        }
      );
    };

    $scope.placeFancyBetCalls = true;
    $scope.placeFancyBet = function (fancyData) {
      if ($rootScope.token == undefined || $rootScope.token == "") {
        $window.location.href = "login.html";
        return false;
      }

      $("#loading").css("display", "flex");
      if ($scope.placeFancyBetCalls == false) {
        return false;
      }
      $scope.placeFancyBetCalls = false;
      fancyData.rate = parseInt(fancyData.rate);
      fancyData.score = parseInt(fancyData.score);

      let betData1 = {
        marketId: fancyData.marketId,
        odds: +fancyData.rate,
        runs: +fancyData.score,
        stake: +fancyData.stake,
        betType: fancyData.yesno,
        gameType: "fancy",
      };
      NavigationServices.placeBets(betData1).then(
        function success(data) {
          // console.log(data);
          $scope.cancelBetslip();
          $scope.displayMsg(data.data);
          $scope.placeFancyData = null;
          $("#loading").css("display", "none");
          $scope.placeFancyBetCalls = true;
          $(".back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3").removeClass(
            "select"
          );

          if (data.data.errorCode == 0) {
            setTimeout(() => {
              $rootScope.getFancyExposure(fancyData.matchId, fancyData.fancyId);
              $scope.refreshFunds();
            }, 1000);
          } else {
            // $rootScope.getFancyExposure(fancyData.matchId,fancyData.fancyId);
          }
        },
        function error(err) {
          $scope.placeFancyBetCalls = true;
          $("#loading").css("display", "none");

          $scope.errorMsg = {
            status: "Error",
            result: "Unable to place bet..",
          };
          $scope.displayMsg($scope.errorMsg);

          if (err.status == 401) {
            $rootScope.clearCookies();
          }
        }
      );
    };

    $scope.placeTPBetCalls = true;
    $scope.placeTPBet = function (TPData) {
      if (TPData.cards) {
        if (TPData.cards.length < 3) {
          $scope.errorMsg = {
            status: "Error",
            result: "Please Select Atleast 3 Cards..",
          };
          $scope.displayMsg($scope.errorMsg);
          return false;
        }
      }

      if ($rootScope.token == undefined || $rootScope.token == "") {
        $window.location.href = "login.html";
        return false;
      }

      $("#loading").css("display", "flex");
      if ($scope.placeTPBetCalls == false) {
        return false;
      }
      $scope.placeTPBetCalls = false;
      var TPData1 = {
        betType: TPData.backlay,
        gameType: TPData.matchname,
        selId: TPData.runnerId,
        round: +TPData.gameId.split(".")[1],
        odds: +TPData.odds,
        stake: +TPData.stake,
        cards: $rootScope.cards
      };
      console.log(TPData1);
      NavigationServices.PlaceTpBet(TPData1).then(
        function success(data) {
          console.log(data);
          $scope.cancelBetslip(false);
          $scope.cancelTPBetslip(TPData.gameId);
          $scope.displayMsg(data.data);
          $scope.placeTPData = null;
          $("#loading").css("display", "none");
          $scope.placeTPBetCalls = true;
          $(".back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3").removeClass(
            "select"
          );

          if (data.data.errorCode == 0) {
            $rootScope.getTPExposureBook(
              TPData1.gameType,
              TPData1.round,
              TPData1.selId,
              "1"
            );
            $scope.refreshFunds();
            $scope.getAllBets();

            setTimeout(() => {
              $rootScope.getTPExposureBook(
                TPData1.gameType,
                TPData1.round,
                TPData1.selId,
                "1"
              );
              $scope.refreshFunds();
              $scope.getAllBets();
            }, 1000);
          } else {
            $rootScope.getTPExposureBook(
              TPData1.gameType,
              TPData1.round,
              TPData1.selId,
              "1"
            );
          }
        },
        function error(err) {
          $scope.placeTPBetCalls = true;
          $("#loading").css("display", "none");

          $scope.errorMsg = {
            status: "Error",
            result: "Unable to place bet..",
          };
          $scope.displayMsg($scope.errorMsg);

          if (err.status == 401) {
            $rootScope.clearCookies();
          }
        }
      );
    };

    $rootScope.getExposureBook = function (marketId, state) {
      if (state != undefined) {
        NavigationServices.exposureBook(marketId).then(
          function success(response) {
            // console.log(data)
            if (response.data.errorCode == 0) {
              $scope.mktExposureBook = response.data.result[0];
              if ($scope.mktExposureBook) {
                angular.forEach($scope.mktExposureBook, function (value, item) {
                  $("#noBetMktExp_" + marketId.replace('.', '_') + '_' + item).removeClass("win");
                  $("#noBetMktExp_" + marketId.replace('.', '_') + '_' + item).removeClass("lose");
                  if (value >= 0) {
                    $("#noBetMktExp_" + marketId.replace('.', '_') + '_' + item)
                      .text(value)
                      .addClass("win");
                  } else if (value <= 0) {
                    $("#noBetMktExp_" + marketId.replace('.', '_') + '_' + item)
                      .text("(" + value + ")")
                      .addClass("lose");
                  }
                });
                localStorage.setItem(
                  "MktExpo_" + marketId,
                  JSON.stringify(response.data.result[0])
                );
              }
            }
          },
          function error(err) {
            if (err.status == 401) {
              $rootScope.clearCookies();
            }
          }
        );
      } else {
        try {
          $scope.mktExpoBook = JSON.parse(
            localStorage.getItem("MktExpo_" + marketId)
          );
        } catch (e) {}

        if ($scope.mktExpoBook == null) {
          $rootScope.getExposureBook(marketId, "1");
        }

        angular.forEach($scope.mktExpoBook, function (value, item) {
          var runnerName = item;
          $("#noBetMktExp_" + runnerName).removeClass("win");
          $("#noBetMktExp_" + runnerName).removeClass("lose");
          if (value >= 0) {
            $("#noBetMktExp_" + runnerName)
              .text(value)
              .addClass("win");
          } else if (value <= 0) {
            $("#noBetMktExp_" + runnerName)
              .text("(" + value + ")")
              .addClass("lose");
          }
        });
      }
    };

    $rootScope.getBMExposureBook = function (marketId) {
      NavigationServices.BMExposureBook(marketId).then(
        function success(response) {
          if (response.data.errorCode === 0) {
            $scope.BMExposure = response.data.result[0];
            angular.forEach($scope.BMExposure, function (value, item) {
              $("#withoutBetBMExp_" + item).removeClass("win");
              $("#withoutBetBMExp_" + item).removeClass("lose");
              if (value >= 0) {
                $("#withoutBetBMExp_" + item)
                  .text(value)
                  .addClass("win");
              } else if (value <= 0) {
                $("#withoutBetBMExp_" + item)
                  .text("(" + value + ")")
                  .addClass("lose");
              }
            });
            localStorage.setItem(
              "BMExpo_" + marketId.split('_')[1],
              JSON.stringify($scope.BMExposure)
            );
          }
        },
        function error(err) {
          if (err.status == 401) {
            $rootScope.clearCookies();
          }
        }
      );
    };

    $rootScope.getTPExposureBook = function (
      tableName,
      roundId,
      selectionId,
      state
    ) {
      if (roundId == 0) {
        return false;
      }
      if (state != undefined) {
        NavigationServices.getTPExposureBook(
          tableName,
          roundId,
          selectionId
        ).then(
          function success(data) {
            // console.log(data)
            $scope.tpExposure = data.data.result[0];
            angular.forEach($scope.tpExposure, function (value, item) {
              var runnerName = item;
              value = +value;
              $("#withBetMktExp_" + tableName + "_" + runnerName).removeClass(
                "win"
              );
              $("#withBetMktExp_" + tableName + "_" + runnerName).removeClass(
                "lose"
              );
              if (value >= 0) {
                $("#withBetMktExp_" + tableName + "_" + runnerName)
                  .text(value)
                  .addClass("win");
              } else if (value <= 0) {
                $("#withBetMktExp_" + tableName + "_" + runnerName)
                  .text("(" + value + ")")
                  .addClass("lose");
              }
            });

            // $scope.TeenDataList = response.data.result[0];
            // // console.log($scope.TeenDataList);
            // angular.forEach($scope.TeenDataList, function (value, item) {
            //   let BMExposure = parseFloat(value);
            //   BMExposure = BMExposure.toFixed(2);
            //   if (BMExposure > 0) {
            //     $("#Tp_" + tableName + "_" + item)
            //       .text(BMExposure)
            //       .css("color", "green");
            //   } else {
            //     $("#Tp_" + tableName + "_" + item)
            //       .text(BMExposure)
            //       .css("color", "red");
            //   }
            // });
            localStorage.setItem(
              "TPExpo_" + tableName,
              JSON.stringify($scope.tpExposure)
            );
          },
          function error(err) {
            if (err.status == 401) {
              $rootScope.clearCookies();
            }
          }
        );
      } else {
        $scope.tpExposure = JSON.parse(
          localStorage.getItem("TPExpo_" + tableName)
        );

        if ($scope.tpExposure == null) {
          $rootScope.getTPExposureBook(tableName, "1");
        }

        angular.forEach($scope.tpExposure, function (value, item) {
          var runnerName = item;
          value = +value;
          $("#withBetMktExp_" + tableName + "_" + runnerName).removeClass(
            "win"
          );
          $("#withBetMktExp_" + tableName + "_" + runnerName).removeClass(
            "lose"
          );
          if (value >= 0) {
            $("#withBetMktExp_" + tableName + "_" + runnerName)
              .text(value)
              .addClass("win");
          } else if (value <= 0) {
            $("#withBetMktExp_" + tableName + "_" + runnerName)
              .text("(" + value + ")")
              .addClass("lose");
          }
        });
      }
    };

    $scope.fancyBookData = null;
    $scope.getFancyBookCalls = true;
    $rootScope.getFancyBook = function (marketId, fancyId, fancyName) {
      $scope.fancyName = fancyName;
      if ($scope.getFancyBookCalls == false) {
        return false;
      }
      $scope.getFancyBookCalls = false;
      NavigationServices.fancyBook(marketId, fancyId).then(
        function success(response) {
          $("#fancyBetBookLeftSide #sideWrap").addClass("left-in");

          $timeout(function () {
            $("#fancyBetBookLeftSide #sideWrap").removeClass("left-in");
          }, 200);

          $scope.fancyBookData = [];
          let matrix = Object.values(response.data.result[0])[0].replace(/\{|\}/g, "").split(',').map((f) => {
            return f.split(':').map((b) => b = +b)
          })
          for (let i = 0; i < matrix.length; i++) {
            let run = matrix[i][0];
            let row = [];
            if (i===0) {
              row[0] = run + ' and below';
            } else if(i === matrix.length - 1) {
              row[0] = matrix[i-1][0]+1 + ' and above';
            } else if(matrix[i-1][0]+1 === matrix[i][0]) {
              row[0] = matrix[i][0];
            } else {
              row[0] = matrix[i-1][0]+1 + "-" +matrix[i][0];
            }
            row[1] = matrix[i][1];
            $scope.fancyBookData.push(row);
          }
          console.log($scope.fancyBookData);
          $scope.getFancyBookCalls = true;
        },
        function error(err) {
          $scope.getFancyBookCalls = true;
          if (err.status == 401) {
            $rootScope.clearCookies();
          }
        }
      );
    };

    $scope.msgResult = null;
    $scope.displayMsg = function (dataMsg, state) {
      if (state == 1) {
        $scope.betMsgResult = dataMsg;
      } else {
        $scope.msgResult = dataMsg;
      }

      // if ($scope.msgResult.result.indexOf('unmatched')!=-1) {

      // }
      // else{
      // }

      $scope.removeMsg();
    };

    $scope.removeMsg = function (state) {
      if (state == 1) {
        $scope.msgResult = null;
        $scope.betMsgResult = null;
      } else {
        $timeout(function () {
          $scope.msgResult = null;
          $scope.betMsgResult = null;
        }, 5000);
      }
    };

    $scope.openMarketBetslip = function (
      event,
      backLay,
      odds,
      runnerName,
      selectionId,
      sportId,
      mtBfId,
      matchId,
      marketId,
      bfId,
      market
    ) {
      console.log(
        backLay,
        odds,
        runnerName,
        selectionId,
        sportId,
        mtBfId,
        matchId,
        marketId,
        bfId
      );
      $scope.cancelBetslip();
      $(".back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3").removeClass("select");
      var element = angular.element(event.currentTarget);
      element.addClass("select");

      $scope.placeMarketData = {
        backlay: backLay,
        selectionId: selectionId,
        marketId: marketId,
        matchId: matchId,
        odds: odds,
        runnerName: runnerName,
        stake: $rootScope.default_stake,
        profit: 0,
        bfId: bfId,
        matchBfId: mtBfId,
        sportId: sportId,
      };
      $scope.placeMarketData.profit = $scope.calcAllProfit(
        $scope.placeMarketData
      );

      $("#betBoard_" + selectionId).css("display", "block");
      console.log($scope.placeMarketData);
      $scope.calcExposure($scope.placeMarketData);
    };

    $scope.openFancyBetSlip = function (
      event,
      yesNo,
      score,
      rate,
      fancyName,
      fancyId,
      matchId,
      bfId,
      marketId
    ) {
      console.log(yesNo, score, rate, fancyName, fancyId, matchId, marketId);
      $scope.cancelBetslip();
      $(".back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3").removeClass("select");
      var element = angular.element(event.currentTarget);
      element.addClass("select");

      $scope.placeFancyData = {
        fancyId: fancyId,
        info: $rootScope.info,
        matchId: matchId,
        mktBfId: bfId,
        rate: rate,
        runnerName: fancyName,
        score: score,
        source: context,
        stake: $rootScope.default_stake,
        profit: 0,
        yesno: yesNo,
        marketId: marketId,
      };

      $scope.placeFancyData.profit = $scope.calcAllProfit(
        $scope.placeFancyData
      );
      // console.log($scope.placeFancyData);

      $scope.calcExposure($scope.placeFancyData);
    };

    $scope.openBookBetSlip = function (
      event,
      backLay,
      odds,
      runnerName,
      selectionId,
      bookId,
      bookName,
      bookType,
      matchId,
      marketId
    ) {
      console.log(
        backLay,
        odds,
        runnerName,
        selectionId,
        bookId,
        bookName,
        matchId,
        marketId
      );
      $scope.cancelBetslip();
      $(".back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3").removeClass("select");
      var element = angular.element(event.currentTarget);
      element.addClass("select");

      $scope.placeBookData = {
        backlay: backLay,
        bookId: bookId,
        bookType: bookType,
        eventId: matchId,
        marketId: marketId,
        odds: odds,
        selectionId: selectionId,
        runnerName: runnerName,
        stake: $rootScope.default_stake,
        mktname: bookName,
        profit: 0
      };

      $scope.placeBookData.profit = $scope.calcAllProfit($scope.placeBookData);
      // console.log($scope.placeBookData);

      $scope.calcExposure($scope.placeBookData);
    };

    $rootScope.cards = [];
    $scope.openTpBetSlip = function (
      event,
      backlay,
      odds,
      runnerName,
      runnerId,
      gameId,
      gameType,
      runnerIndex,
      card
    ) {
      console.log(
        event,
        backlay,
        odds,
        runnerName,
        runnerId,
        gameId,
        gameType,
        runnerIndex,
        card
      );
      $scope.cancelBetslip();
      $scope.cancelTPBetslip(gameId);
      $(".back-1,.back-2,.back-3,.lay-1,.lay-2,.lay-3").removeClass("select");
      var element = angular.element(event.currentTarget);
      element.addClass("select");

      $scope.placeTPData = {
        backlay: backlay,
        gameType: gameType,
        info: $rootScope.info,
        odds: odds,
        runnerName: runnerName,
        runnerId: runnerId,
        source: context,
        stake: $rootScope.default_stake,
        profit: 0,
        gameId: gameId,
      };

      $scope.placeTPData.profit = $scope.calcAllProfit($scope.placeTPData);
      if (card) {
        if ($rootScope.cards.length < 3) {
          let indexcheck = $rootScope.cards.indexOf(card);
          if (indexcheck == -1) {
            $rootScope.cards.push(card);
          }
        }
      }

      if ($rootScope.cards.length != 0) {
        $scope.placeTPData["cards"] = $rootScope.cards;
        $scope.placeTPData.runnerName =
          $scope.placeTPData.runnerName +
          " " +
          $scope.placeTPData.cards.toString().replace(/,/g, "");
      }
      // console.log($scope.placeTPData);

      $scope.calcExposure($scope.placeTPData);
      $("#betBoard_" + gameId + "_" + runnerIndex).css("display", "block");
      $("#betBoard_" + gameId + "_" + $filter($scope.placeTPBet.runnerName)).css("display", "block");
    };

    $scope.confirmPlaceMarketData = null;
    $scope.confirmBetPop = function (placeMarketData) {
      if ($rootScope.token == undefined || $rootScope.token == "") {
        $window.location.href = "login.html";
        return false;
      }
      $scope.confirmPlaceMarketData = placeMarketData;
      // console.log($scope.confirmPlaceMarketData)
    };
    $scope.cancelBetPop = function () {
      $scope.confirmPlaceMarketData = null;
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
      $("[id^=betBoard_]").css("display", "none");
      // $("#betBoard_" + gameId + "_0").css("display", "none");
      if (remove == false) {
        $rootScope.cards = [];
      }
      $scope.placeTPData = null;
    };

    $scope.calcAllProfit = function (placeData) {
      var pnl;
      if (
        (placeData.backlay == "back" || placeData.backlay == "lay")
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
        (placeData.backlay == "backBook" || placeData.backlay == "layBook")
      ) {
        // if (!placeData.bookType) {
        //   if (placeData.stake != "" && placeData.odds != "") {
        //     return (pnl = (
        //       (parseFloat(placeData.odds) * parseFloat(placeData.stake)) /
        //       100
        //     ).toFixed(2));
        //   } else {
        //     return (pnl = 0);
        //   }
        // } else {
          if (placeData.stake != "" && placeData.odds != "") {
            return (pnl = (
              (parseFloat(placeData.odds)/100) *
              parseFloat(placeData.stake)
            ).toFixed(2));
          } else {
            return (pnl = 0);
          }
        // }
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

    $scope.oddsTyping = false;
    $scope.stakeTyping = true;

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

    $scope.buttonInput = function (input, placeData) {
      if ($scope.stakeTyping) {
        if (input == ".") {
          return false;
        }
        if (parseInt(placeData.stake) >= 100000000) {
          placeData.stake = 100000000;
        } else {
          placeData.stake = placeData.stake + input;
        }
      } else if ($scope.oddsTyping) {
        // placeData.odds=placeData.odds+input;
        var odds = parseFloat(placeData.odds);
        if (odds >= 1000) {
          placeData.odds = 1000;
        } else {
          if (placeData.odds.indexOf(".") != -1 && input == ".") {
            return false;
          } else if (placeData.odds.indexOf(".") != -1) {
            var number = placeData.odds.split(".");
            if (number[1].length > 1) {
              return false;
            }
          }
          placeData.odds = placeData.odds + input;
        }
      }

      placeData.profit = $scope.calcAllProfit(placeData);
      $scope.calcExposure(placeData);
    };

    $scope.buttonDelete = function (placeData) {
      if ($scope.stakeTyping) {
        if (placeData.stake != "") {
          placeData.stake = placeData.stake.toString().slice(0, -1);
        }
      } else if ($scope.oddsTyping) {
        placeData.odds = placeData.odds.toString().slice(0, -1);
      }

      placeData.profit = $scope.calcAllProfit(placeData);
      $scope.calcExposure(placeData);
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

    $scope.stakeDiffCal = function (currentStake) {
      var diff;
      if (currentStake < 25) {
        diff = 1;
      } else if (currentStake < 100) {
        diff = 10;
      } else if (currentStake < 200) {
        diff = 20;
      } else if (currentStake < 500) {
        diff = 50;
      } else if (currentStake < 1000) {
        diff = 100;
      } else if (currentStake < 2000) {
        diff = 250;
      } else if (currentStake < 5000) {
        diff = 500;
      } else if (currentStake < 10000) {
        diff = 1000;
      } else {
        diff = 1500;
      }
      return diff;
    };

    $scope.calcExposure = function (placeData, remove) {
      if (placeData.backlay == "back" || placeData.backlay == "lay") {
        $scope.mktExpoBook = JSON.parse(
          localStorage.getItem("MktExpo_" + placeData.marketId)
        );
        if ($scope.mktExpoBook == null) {
          return false;
        }

        if (remove == "remove") {
          angular.forEach($scope.mktExpoBook, function (value, item) {
            // if (item.Value > 0) {
            $("#betMktExp_" + placeData.marketId.replace('.', '_') + '_' + item)
              .text("")
              .removeClass("to-win");
            // } else {
            $("#betMktExp_" + placeData.marketId.replace('.', '_') + '_' + item)
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
            $("#betMktExp_" + placeData.marketId.replace('.', '_') + '_' + item).removeClass("to-win");
            $("#betMktExp_" + placeData.marketId.replace('.', '_') + '_' + item).removeClass("to-lose");

            if (+value > 0) {
              $("#betMktExp_" + placeData.marketId.replace('.', '_') + '_' + item)
                .text(value)
                .addClass("to-win");
            } else {
              $("#betMktExp_" + placeData.marketId.replace('.', '_') + '_' + item)
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
            $("#withBetBMExp_" + item)
              .text("")
              .removeClass("to-win");
            // } else {
            $("#withBetBMExp_" + item)
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
            $("#withBetBMExp_" + item)
              .text("")
              .removeClass("to-win");
            $("#withBetBMExp_" + item)
              .text("")
              .removeClass("to-lose");

            if (value > 0) {
              $("#withBetBMExp_" + item)
                .text(value)
                .addClass("to-win");
            } else {
              $("#withBetBMExp_" + item)
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

    $scope.GetUserData = function () {
      NavigationServices.getUserData().then(
        function success(clientData) {
          $rootScope.clientData = clientData.data;
          $rootScope.curTime = clientData.data.curTime;
          $rootScope.newsTicker = clientData.data.news;
          $rootScope.sportsData = $scope.clientDataFormat(
            clientData.data.sportsData
          );
          // console.log($rootScope.sportsData)
          // $rootScope._fancyBook=clientData._fancyBook;
          $scope.getSportsList();
          $scope.getAllBets(0);
          // if ($location.path().split('/').indexOf('multiMarket')>-1) {
          // 	$rootScope.$emit('multiMktEvent',{});
          // }
          if ($location.path().split("/").indexOf("fullmarket") > -1) {
            $rootScope.$emit("allMktEvent", {});
          }
          if ($location.path().split("/").indexOf("inplay") > -1) {
            $rootScope.$emit("inplayEvent", {});
          }
          if ($location.path().split("/").indexOf("sports") > -1) {
            $rootScope.$emit("sportsEvent", {});
          }
          $("#loading").css("display", "none");
        },
        function error(err) {
          if (err.status == 401) {
            $rootScope.clearCookies();
          }
        }
      );
    };

    $rootScope.clientCount = 0;

    $scope._userTpBetsWise = function (clientData) {
      angular.forEach(clientData._userTpBets, function (item, index) {
        angular.forEach(item, function (item1, index1) {
          if (item1.gameType == 1) {
            item1.matchName = "20-20 teenpatti";
            item1.matchId = 7;
            item1.isFancy = 0;
          }
          if (item1.gameType == 2) {
            item1.matchName = "1 Day teenpatti";
            item1.matchId = 8;
            item1.isFancy = 0;
          }
          if (item1.gameType == 5) {
            item1.matchName = "Lucky 7";
            item1.matchId = 9;
            item1.isFancy = 0;
          }
          if (item1.gameType == 6) {
            item1.matchName = "3 Card Judgement";
            item1.matchId = 10;
            item1.isFancy = 0;
          }
          if (item1.gameType == 7) {
            item1.matchName = "Andar Bahar Casino";
            item1.matchId = 11;
            item1.isFancy = 0;
          }
          item1.backLay = item1.backLay.toUpperCase();
        });

        if (!clientData._userTpBets[item[0].matchId]) {
          clientData._userTpBets[item[0].matchId] =
            clientData._userTpBets[index];
        } else {
          clientData._userTpBets[item[0].matchId] = clientData._userTpBets[
            item[0].matchId
          ].concat(clientData._userTpBets[index]);
        }
        delete clientData._userTpBets[index];
      });

      return clientData;
    };

    $rootScope.inPlayEventsCount = {};

    $scope.clientDataFormat = function (sportsData) {
      angular.forEach(sportsData, (val, key) => {
        $rootScope.inPlayEventsCount[val.bfId] = 0;
      });
      $rootScope.inPlayEventsCount = {};
      var sportDataFormat = {};
      angular.forEach(sportsData, function (item, index) {
        var tourDataFormat = {};
        angular.forEach(item.tournaments, function (item2, index2) {
          var matchesDataFormat = {};
          angular.forEach(item2.matches, function (item3, index3) {
            var marketsDataFormat = {};
            if (item3.inPlay === 1) {
              if ($rootScope.inPlayEventsCount[item.bfId]) {
                $rootScope.inPlayEventsCount[item.bfId] += 1;
              } else {
                $rootScope.inPlayEventsCount[item.bfId] = 1;
              }
            }
            angular.forEach(item3.markets, function (item4, index4) {
              marketsDataFormat[item4.id] = item4;
            });
            if (!item3.method) {
              item3["method"] = 0;
            }
            matchesDataFormat[item3.id] = item3;
          });
          tourDataFormat[item2.bfId] = {
            bfId: item2.bfId,
            id: item2.id,
            name: item2.name,
            matches: matchesDataFormat,
          };
        });
        sportDataFormat[item.bfId] = {
          bfId: item.bfId,
          id: item.id,
          name: item.name,
          tournaments: tourDataFormat,
        };
      });
      return sportDataFormat;
    };

    $rootScope.searchWiseMatch = function (sportsData) {
      var matchesData = [];
      if (sportsData == undefined) {
        return matchesData;
      }
      angular.forEach(sportsData, function (item, index) {
        angular.forEach(item.tournaments, function (item2, index2) {
          // console.log(item2)
          angular.forEach(item2.matches, function (item3, index3) {
            angular.forEach(item3.markets, function (item4, index4) {
              if (item4.name == "Match Odds") {
                item4.runnerData["bfId"] = item4.bfId;
                item4.runnerData["inPlay"] = item3.inPlay;
                item4.runnerData["dataMode"] = item3.dataMode;
                item4.runnerData["isBettingAllow"] = item4.isBettingAllow;
                item4.runnerData["isMulti"] = item4.isMulti;
                item4.runnerData["marketId"] = item4.id;
                item4.runnerData["matchDate"] = item3.startDate;
                item4.runnerData["matchId"] = item3.id;
                item4.runnerData["matchName"] = item3.name;
                item4.runnerData["sportName"] = item.name;
                item4.runnerData["sportId"] = item.bfId;
                item4.runnerData["status"] = item3.status;
                item4.runnerData["tourId"] = item2.bfId;
                item4.runnerData["mtBfId"] = item3.bfId;
                item4.runnerData["sportID"] = item.bfId;
                item4.runnerData["sptId"] = item.bfId;
                matchesData.push(item4.runnerData);
              }
            });
          });
        });
      });
      // console.log(matchesData)

      return matchesData;
    };

    $rootScope.highlightsWise = function (sportsList) {
      var highlightData = [];
      if (sportsList == undefined) {
        return highlightData;
      }
      angular.forEach(sportsList.tournaments, function (item, index) {
        angular.forEach(item.matches, function (item2, index2) {
          angular.forEach(item2.markets, function (item3, index3) {
            if (item3.name == "Match Odds") {
              item3.runnerData["bfId"] = item3.bfId;
              item3.runnerData["hasFancy"] = item2.hasFancy;
              //   item3.runnerData["hasBookmaker"] = item2.bookRates
              //     ? item2.bookRates.length > 0
              //       ? 1
              //       : 0
              //     : 0;
              item3.runnerData["inPlay"] = item2.inPlay;
              item3.runnerData["isBettingAllow"] = item3.isBettingAllow;
              item3.runnerData["isMulti"] = item3.isMulti;
              item3.runnerData["marketId"] = item3.id;
              item3.runnerData["matchDate"] = item2.startDate;
              item3.runnerData["matchId"] = item2.id;
              item3.runnerData["matchName"] = item2.name;
              item3.runnerData["sportName"] = item.name;
              item3.runnerData["sportId"] = item.bfId;
              item3.runnerData["status"] = item2.status;
              item3.runnerData["tourId"] = item.bfId;
              item3.runnerData["mtBfId"] = item2.bfId;
              item3.runnerData["sportID"] = item.bfId;
              item3.runnerData["sport"] = item.name;

              highlightData.push(item3.runnerData);
            }
          });
        });
      });
      return highlightData;
    };

    $rootScope.inplayWiseMatch = function (sportsList, state) {
      var sportWiseData = [];
      var currentDate = new Date();

      angular.forEach(sportsList, function (item, index) {
        if ($rootScope.isTennpatti != 1 && item.bfId == "15") {
          return;
        }
        var inplayData = [];
        var matchesData = {
          inplayData: [],
          name: item.name,
        };
        angular.forEach(item.tournaments, function (item2, index2) {
          angular.forEach(item2.matches, function (item3, index3) {
            angular.forEach(item3.markets, function (item4, index4) {
              if (item4.name == "Match Odds") {
                item4.runnerData["bfId"] = item4.bfId;
                item4.runnerData["hasFancy"] = item3.hasFancy;
                // item3.runnerData["hasBookmaker"] = item2.bookRates
                //   ? item2.bookRates.length > 0
                //     ? 1
                //     : 0
                //   : 0;
                item4.runnerData["inPlay"] = item3.inPlay;
                item4.runnerData["isBettingAllow"] = item4.isBettingAllow;
                item4.runnerData["isMulti"] = item4.isMulti;
                item4.runnerData["marketId"] = item4.id;
                item4.runnerData["matchDate"] = item3.startDate;
                item4.runnerData["matchId"] = item3.id;
                item4.runnerData["matchName"] = item3.name;
                item4.runnerData["sportName"] = item.name;
                item4.runnerData["sportId"] = item.bfId;
                item4.runnerData["status"] = item3.status;
                item4.runnerData["tourId"] = item2.bfId;
                item4.runnerData["mtBfId"] = item3.bfId;
                item4.runnerData["sportID"] = item.bfId;
                item4.runnerData["sport"] = item.name;

                if (item3.inPlay == 1 && state == 0) {
                  inplayData.push(item4.runnerData);
                } else {
                  if (
                    item3.inPlay != 1 &&
                    new Date(item3.startDate).getDate() ===
                      currentDate.getDate() + 1 &&
                    state == 1
                  ) {
                    inplayData.push(item4.runnerData);
                  } else if (
                    item3.inPlay != 1 &&
                    new Date(item3.startDate).getDate() ===
                      currentDate.getDate() + 2 &&
                    state == 2
                  ) {
                    inplayData.push(item4.runnerData);
                  }
                }
              }
            });
          });
        });
        if (inplayData.length != 0) {
          matchesData.inplayData = inplayData;
          sportWiseData.push(matchesData);
        }
      });
      return sportWiseData;
    };

    $rootScope.sportWise = function (sportsList) {
      var sportData = [];
      angular.forEach(sportsList, function (item, index) {
        var data = {};
        data["id"] = item.bfId;
        data["name"] = item.name;
        data["ids"] = item.id;
        sportData.push(data);
      });

      let indexCricket = sportData.findIndex((sport) => {
        return sport.name == "Cricket";
      });
      if (indexCricket == -1) {
        var data = {};
        data["id"] = "4";
        data["name"] = "Cricket";
        data["ids"] = "1";
        sportData.push(data);
      }
      let indexTennis = sportData.findIndex((sport) => {
        return sport.name == "Tennis";
      });
      if (indexTennis == -1) {
        var data = {};
        data["id"] = "2";
        data["name"] = "Tennis";
        data["ids"] = "2";
        sportData.push(data);
      }
      let indexSoccer = sportData.findIndex((sport) => {
        return sport.name == "Soccer";
      });
      if (indexSoccer == -1) {
        var data = {};
        data["id"] = "1";
        data["name"] = "Soccer";
        data["ids"] = "3";
        sportData.push(data);
      }
      sportData.sort(function (a, b) {
        return a.ids - b.ids;
      });
      if (sportData.length == 4) {
        [sportData[0], sportData[1], sportData[2], sportData[3]] = [
          sportData[1],
          sportData[2],
          sportData[0],
          sportData[3],
        ];
      }
      return sportData;
    };

    $rootScope.tournamentWise = function (sportsTourList) {
      var tourData = [];
      if (sportsTourList == undefined) {
        return tourData;
      }
      angular.forEach(sportsTourList.tournaments, function (item, index) {
        var data = {};
        data["id"] = item.bfId;
        data["name"] = item.name;
        tourData.push(data);
      });
      return tourData;
    };

    $rootScope.matchtWise = function (tourMatchList) {
      var matchData = [];
      if (tourMatchList == undefined) {
        return matchData;
      }
      angular.forEach(tourMatchList.matches, function (item, index) {
        var data = {};
        data["bfId"] = item.bfId;
        data["id"] = item.id;
        data["startDate"] = item.startDate;
        data["name"] = item.name;
        matchData.push(data);
      });
      return matchData;
    };

    $rootScope.marketWise = function (matchMarketList) {
      var marketData = [];
      if (matchMarketList == undefined) {
        return marketData;
      }
      angular.forEach(matchMarketList.markets, function (item, index) {
        var data = {};
        data["bfId"] = item.bfId;
        data["id"] = item.id;
        data["name"] = item.name;
        marketData.push(data);
      });
      return marketData;
    };

    $rootScope.allMarketWise = function (matchAllMarketList) {
      var allMarketData = [];
      if (matchAllMarketList == undefined) {
        return allMarketData;
      }
      angular.forEach(matchAllMarketList.markets, function (item, index) {
        var data = {};
        data["bfId"] = item.bfId;
        data["marketId"] = item.id;
        data["marketName"] = item.name;
        allMarketData.push(data);
      });
      return allMarketData;
    };

    $rootScope.mktWise = function (matchMarket, bfId) {
      var mktData = {};
      if (matchMarket == undefined) {
        return mktData;
      }
      angular.forEach(matchMarket.markets, function (item, index) {
        if (item.bfId == bfId) {
          mktData["bfId"] = item.bfId;
          mktData["dataMode"] = matchMarket.dataMode;
          mktData["isInplay"] = matchMarket.inPlay == 0 ? "false" : "true";
          mktData["isMulti"] = item.isMulti;
          mktData["matchBfId"] = matchMarket.bfId;
          mktData["matchDate"] = matchMarket.startDate;
          mktData["matchId"] = matchMarket.id;
          mktData["matchName"] = matchMarket.name;
          mktData["matchStatus"] = matchMarket.status;
          mktData["mktId"] = item.id;
          mktData["mktName"] = item.name;
          item.runnerData1 = $rootScope.runnerWise(item.runnerData1);
          mktData["runnerData"] = item.runnerData1;
        }
      });
      return mktData;
    };

    $rootScope.runnerWise = function (runnerData1) {
      var runnerarray = [];
      angular.forEach(runnerData1, function (item, key) {
        if (item.Key != undefined) {
          runnerarray.push(item.Value);
        } else {
          runnerarray.push(item);
        }
      });
      return runnerarray;
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
        angular.forEach($scope.clientData._userTpBets, function (item, index) {
          angular.forEach(item, function (item1, index1) {
            matchData.push(item1);
          });
        });
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
            $scope.clientData._userTpBets[mtid],
            function (item1, index1) {
              matchData.push(item1);
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

    $rootScope.multiMarketsWise = function (sportsData) {
      var multiMarketData = {
        marketData: [],
        fancyData: [],
      };
      var fancyData = [];
      var marketData = [];

      angular.forEach(sportsData, function (item, index) {
        angular.forEach(item.tournaments, function (item2, index2) {
          // console.log(item2)
          angular.forEach(item2.matches, function (item3, index3) {
            // console.log($scope.isMultiAdded(item3.bfId))

            angular.forEach(item3.markets, function (item4, index4) {
              item4["mktId"] = item4.id;
              var mktData = {};
              var fData = {};

              if (
                $scope.isMultiAdded(item3.bfId) == false &&
                item4.name == "Match Odds"
              ) {
                fData["bfId"] = item4.bfId;
                fData["dataMode"] = item3.dataMode;
                fData["isInplay"] = item3.inPlay == 0 ? "false" : "true";
                fData["isMulti"] = item4.isMulti;
                fData["matchBfId"] = item3.bfId;
                fData["matchDate"] = item3.startDate;
                fData["matchId"] = item3.id;
                fData["matchName"] = item3.name;
                fData["tourId"] = item2.bfId;
                fData["matchStatus"] = item3.status;
                fData["mktId"] = item4.id;
                fData["mktName"] = item4.name;
                fData["sportName"] = item.name;
                fData["sportId"] = item.bfId;
                fData["hasFancy"] = item3.hasFancy;
                fData["fancyData"] = item3.fancyData;
                fancyData.push(fData);
              }

              if ($scope.isMultiAdded(item4) == false) {
                mktData["bfId"] = item4.bfId;
                mktData["dataMode"] = item3.dataMode;
                mktData["isInplay"] = item3.inPlay == 0 ? "false" : "true";
                mktData["isMulti"] = item4.isMulti;
                mktData["matchBfId"] = item3.bfId;
                mktData["matchDate"] = item3.startDate;
                mktData["matchId"] = item3.id;
                mktData["matchName"] = item3.name;
                mktData["tourId"] = item2.bfId;
                mktData["matchStatus"] = item3.status;
                mktData["mktId"] = item4.id;
                mktData["mktName"] = item4.name;
                mktData["sportName"] = item.name;
                mktData["sportId"] = item.bfId;
                item4.runnerData1 = $rootScope.runnerWise(item4.runnerData1);
                mktData["runnerData"] = item4.runnerData1;
                marketData.push(mktData);
              }
            });
          });
        });
      });
      multiMarketData.fancyData = fancyData;
      multiMarketData.marketData = marketData;

      return multiMarketData;
    };

    $scope.openMarketDepth = function (getMarketData) {
      // console.log(getMarketData)

      $scope.getMarketDataDepth = getMarketData;
      $scope.MktDepthCount = 0;
      angular.forEach(
        $scope.getMarketDataDepth.runnerData,
        function (item, index) {
          if ($scope.MktDepthCount == 0) {
            // $scope.selectedRunner=item;
            $scope.queryMarketDepth(item);
            $scope.MktDepthCount++;
          }
        }
      );
    };

    $scope.showHideMenuList = false;
    $scope.showMenuList = function () {
      $scope.showHideMenuList = !$scope.showHideMenuList;
    };

    $scope.selectedChart = 1;
    $scope.queryMarketDepth = function (item) {
      // console.log(item)
      $scope.selectedRunner = item;
      $scope.showHideMenuList = false;
      $scope.inverseAxis($scope.selectedChart);

      $scope.marketDepthUrl = "http://dak19.com/api/queryMarketDepth.php";

      $http({
        url: $scope.marketDepthUrl,
        dataType: "json",
        method: "POST",
        data: {
          marketId: $scope.getMarketDataDepth.bfId,
          selectionId: $scope.selectedRunner.selectionId,
        },
        // data: ({marketId: "1.155172463",selectionId:"448"}),
      }).then(function success(data) {
        // console.log(data.data)
        $scope.marketDepthData = data.data;
        // console.log($scope.marketDepthData)

        angular.forEach(
          $scope.marketDepthData.ex.availableToBack,
          function (item) {
            item.backLay = "back";
          }
        );
        angular.forEach(
          $scope.marketDepthData.ex.availableToLay,
          function (item) {
            item.backLay = "lay";
          }
        );
        $scope.backlayReport = $scope.marketDepthData.ex.availableToBack
          .concat($scope.marketDepthData.ex.availableToLay)
          .concat($scope.marketDepthData.ex.tradedVolume);

        $scope.backlayReport.sort(function (a, b) {
          return a.price - b.price;
        });
        // console.log($scope.backlayReport)

        $("#marketDepth").css("display", "flex");

        $timeout(function () {
          $(document).ready(function () {
            var outerContent = $("#reportArticle");
            var innerContent = $("#reportArticle .trade");

            outerContent.scrollLeft(
              (innerContent.width() - outerContent.width()) / 2
            );
          });
        }, 200);
      });
    };

    $scope.inverseAxis = function (axis) {
      $scope.selectedChart = axis;

      var bfId = $scope.getMarketDataDepth.bfId.split(".")[1];
      if (axis == 1) {
        $scope.chartImg =
          "https://sportsiteexweb.betfair.com/betting/LoadRunnerInfoChartAction.do?marketId=" +
          bfId +
          "&selectionId=" +
          $scope.selectedRunner.selectionId;
      } else {
        $scope.chartImg =
          "https://sportsiteexweb.betfair.com/betting/LoadRunnerInfoChartAction.do?marketId=" +
          bfId +
          "&selectionId=" +
          $scope.selectedRunner.selectionId +
          "&logarithmic=true";
      }
    };

    // $scope.GetSportData = function(){
    // 	if($rootScope.token ==undefined || $rootScope.token ==""){
    // 		$http({
    // 			method: "GET",
    // 			url: "http://www.lcexchanges247.com/Client/BetClient.svc/Data/GetSportData",

    // 		}).then(function success(response) {
    // 			console.log("getSport", response);
    // 			var clientData=response.data;
    // 			$rootScope.clientData=clientData;
    // 			$rootScope.curTime=clientData.curTime;
    // 			$rootScope.newsTicker=clientData.news;
    // 			$rootScope.sportsData=$scope.clientDataFormat(clientData.sportsData);
    // 			// console.log($rootScope.sportsData)
    // 			$rootScope._fancyBook=clientData._fancyBook;
    // 			$scope.getSportsList();
    // 			$scope.getAllBets(0);
    // 		}, function error(response) {
    // 		console.log(response);
    // 		})
    // 	}
    // }
    if ($rootScope.token == undefined || $rootScope.token == "") {
      // $scope.GetSportData();
      // $scope.connectClientSignalr("http://207.180.220.254:12475","1937-789-123");
      // $('#loading').css('display','flex');
      // $rootScope.clearCookies();
    } else {
      // $scope.getUserDescription();
      // $scope.getAllBets();
      // $scope.getSettings();
      // $scope.refreshFunds();
      // $scope.getSportsList();
      // $scope.GetSportData();
      // if ($location.path().split('/').indexOf('multiMarket')>-1) {
      // 	$rootScope.$emit('multiMktEvent',{});
      // }
      // if ($location.path().split('/').indexOf('fullmarket')>-1) {
      // 	$rootScope.$emit('allMktEvent',{});
      // }
      // if ($location.path().split('/').indexOf('inplay')>-1) {
      // 	$rootScope.$emit('inplayEvent',{});
      // }
      // if ($location.path().split('/').indexOf('sports')>-1) {
      // 	$rootScope.$emit('sportsEvent',{});
      // }
    }

    /* ----- new controller------ */
    /*  set initial values */
    $rootScope.matchDataHome = {};
    $rootScope.ShowSportsList = function () {
      $scope.showSportList = true;
      $scope.showTournamentList = false;
      $scope.showEventList = false;
      $scope.showMarketList = false;
      $rootScope.inplaydiv = false;
      $rootScope.mainfooter = true;
      $scope.isLastElement = true;
      $rootScope.inplaydiv = false;
      $scope.pathList = [];
      $scope.sportsTab = $rootScope.sportlistwise();
    };
    $rootScope.s_id = 4;
    $rootScope.sportlistwise = function () {
      var sportslistdata = [];
      var data = {};
      data["id"] = 4;
      data["name"] = "Cricket";
      data["ids"] = 10;
      sportslistdata.push(data);

      var data = {};
      data["id"] = 2;
      data["name"] = "Tennis";
      data["ids"] = 20;
      sportslistdata.push(data);

      var data = {};
      data["id"] = 1;
      data["name"] = "Soccer";
      data["ids"] = 30;
      sportslistdata.push(data);

      // var data = {};
      // data["id"] = 7.1;
      // data["name"] = "Horse Racing Today's Card";
      // data["ids"] = 40;
      // data["otherSport"] = true;
      // sportslistdata.push(data);

      // var data = {};
      // data["id"] = 4339.1;
      // data["name"] = "Greyhound Racing Today's Card";
      // data["ids"] = 50;
      // data["otherSport"] = true;
      // sportslistdata.push(data);

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

      // sportslistdata.sort(function (a, b) {
      //   return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
      // });
      return sportslistdata;
    };
    /* initial values  end */

    /* --functional basic methods-- */
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

    $scope.homeSignalrFormat = function (sportsData) {
      angular.forEach(sportsData, (val, key) => {
        $rootScope.inPlayEventsCount[val.bfId] = 0;
      });
      var sportDataFormat = {};
      angular.forEach(sportsData, function (item, index) {
        var tourDataFormat = {};
        angular.forEach(item.tournaments, function (item2, index2) {
          var matchesDataFormat = {};
          angular.forEach(item2.matches, function (item3, index3) {
            var marketsDataFormat = {};
            if (item3.inPlay === 1) {
              if ($rootScope.inPlayEventsCount[item.bfId]) {
                $rootScope.inPlayEventsCount[item.bfId] += 1;
              } else {
                $rootScope.inPlayEventsCount[item.bfId] = 1;
              }
            }
            angular.forEach(item3.markets, function (item4, index4) {
              marketsDataFormat[item4.id] = item4;
            });
            // matchesDataFormat['bfId']=item2.bfId;
            // matchesDataFormat['id']=item2.id;
            // matchesDataFormat['name']=item2.name;
            matchesDataFormat[item3.bfId] = item3;
          });
          // tourDataFormat['id']=item.id;
          // tourDataFormat['name']=item.name;
          tourDataFormat[item2.bfId] = {
            bfId: item2.bfId,
            id: item2.id,
            name: item2.name,
            matches: matchesDataFormat,
          };
          // tourDataFormat[item2.bfId]['bfId']=item.bfId;
          // tourDataFormat[item2.bfId]['id']=item.id;
          // tourDataFormat[item2.bfId]['name']=item.name;
          // tourDataFormat[item2.bfId]=matchesDataFormat;
          // tourDataFormat[item2.bfId]=item2;
        });
        // tourDataFormat[item2.bfId]=item2;
        $rootScope.sportsData[item.bfId] = {
          bfId: item.bfId,
          id: item.id,
          name: item.name,
          tournaments: tourDataFormat,
        };
        // sportDataFormat[item.bfId]=tourDataFormat;
      });
      return $rootScope.sportsData;
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

    
    $rootScope.highlightwisedata = function (sprtid, marketName) {
      var highlightdata = [];
      var highlightdataIds = [];
      $scope.multimarket = JSON.parse(localStorage.getItem("Multimarkets"));
      angular.forEach($scope.homesportdata, function (item, index) {
        if (item.bfId == sprtid) {
          angular.forEach(item.tournaments, function (item1, index1) {
            angular.forEach(item1.matches, function (item2, index2) {
              angular.forEach(item2.markets, function (item3, index3) {
                if (item3.name.toLowerCase().includes(marketName || 'match odds')) {
                  item3.runnerData["bfId"] = item3.bfId;
                  item3.runnerData["inPlay"] = item2.inPlay;
                  item3.runnerData["isBettingAllow"] = item3.isBettingAllow;
                  item3.runnerData["isMulti"] = item3.isMulti;
                  item3.runnerData["marketId"] = item3.id;
                  item3.runnerData["matchId"] = item2.bfId;
                  item3.runnerData["matchDate"] = item2.startDate;
                  item3.runnerData["matchName"] = item2.name;
                  item3.runnerData["sportName"] = item.name;
                  item3.runnerData["status"] = item2.status;
                  item3.runnerData["mtBfId"] = item2.bfId;
                  item3.runnerData["TourbfId"] = item1.bfId;
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
    $scope.findDatafromArr = function (arr, fieldName, filterTerm) {
      return arr.filter(
        (it) => it[fieldName].toString() === filterTerm.toString()
      );
    };
    /* end */

    $rootScope.SportsList = function () {
      if ($rootScope.s_id != 10) {
        NavigationServices.SportsList().then(
          function mySuccess(response) {
            if (response.data.errorCode === 0) {
              var events = response.data.result;
              events = response.data.result.filter(
                (e) => parseInt(e.eventTypeId, 10) > 0
              );
              $scope.events = events;
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
              };
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
                          status: event.status === 1 ? "OPEN" : "CLOSE",
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
                          _avgmatchedBets: null,
                          _fancyBets: null,
                          _matchedBets: null,
                          _unMatchedBets: null,
                          bookRates: null,
                          commentary: null,
                          data: null,
                          dataMode: 1,
                          displayApplication: 1,
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
              $scope.clientData = home;
              $scope.news = home.news;
              $rootScope.curTime = home.curTime;
              $scope.sportsTab = $rootScope.sportlistwise();
              $scope.sprtdata = home.sportsData;
              $scope.homeSignalrFormat(home.sportsData);
              $rootScope.$broadcast("event:sportsData", $rootScope.sportsData);
              // NavigationServices.sportsData = $rootScope.sportsData;
              $scope.homesportdata = home.sportsData;
              $scope.Allmatches = $scope.Searchwisedata();
              $rootScope.fancyBook = home._fancyBook;
              $scope.Highlightlist = $scope.highlightwisedata($rootScope.s_id);
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
      }
    };

    $rootScope.activatedRaces = {};
    $scope.getActivatedGames = function() {
      NavigationServices.activatedHorseGames().then((response) => {
        if (response.data.errorCode == 0) {
          $rootScope.activatedRaces[7] = response.data.result;
        } else {
          $rootScope.activatedRaces[7] = [];
        }
      })

      NavigationServices.activatedGreyhoundGames().then((response) => {
        if (response.data.errorCode == 0) {
          $rootScope.activatedRaces[4339] = response.data.result;
        } else {
          $rootScope.activatedRaces[4339] = [];
        }
      })
    }

    $rootScope.getOtherGames = function () {
      NavigationServices.horseRacingGamesToday().then((response) => {
        if (response.data && response.data.length) {
          $rootScope.formatOtherGames(response.data, 7, 1);
        }
      });

      NavigationServices.greyhoundGamesToday().then((response) => {
        if (response.data && response.data.length) {
          $rootScope.formatOtherGames(response.data, 4339, 1);
        }
      });

      NavigationServices.horseRacingGamesTomorrow().then((response) => {
        if (response.data && response.data.length) {
          $rootScope.formatOtherGames(response.data, 7, 2);
        }
      });

      NavigationServices.greyhoundGamesTomorrow().then((response) => {
        if (response.data && response.data.length) {
          $rootScope.formatOtherGames(response.data, 4339, 2);
        }
      });
    };

    let sportIdMap = {
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

    $rootScope.formatOtherGames = function (otherGames, sportId, day) {
      let sportCountries = $rootScope.activatedRaces[sportId]? $rootScope.activatedRaces[sportId]: [];
      if (!otherGames) {
        return;
      }

      if(token && sportCountries){
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
        $rootScope.$broadcast("event:sportsData", $rootScope.sportsData);
      });
    };

    $scope.getListWise = function (obj, field) {
      let list = [];
      angular.forEach(obj[field], (value) => {
        list.push(value);
      });
      return list;
    };

    $scope.getRaceData = function() {
      if ($rootScope.selectedRace == 7) {
        $scope.todaysCard = $rootScope.sportsData[7.1]
        ? $rootScope.sportsData[7.1]
        : {};
        $scope.tomorrow = $rootScope.sportsData[7.2]
        ? $rootScope.sportsData[7.2]
        : {};
        $scope.todaysList = $scope.getListWise($scope.todaysCard, "tournaments");
        $scope.tomorrowList = $scope.getListWise($scope.tomorrow, "tournaments");
      } else if ($rootScope.selectedRace == 4339) {
        $scope.todaysCard = $rootScope.sportsData[4339.1]
        ? $rootScope.sportsData[4339.1]
        : {};
        $scope.tomorrow = $rootScope.sportsData[4339.2]
        ? $rootScope.sportsData[4339.2]
        : {};
        $scope.todaysList = $scope.getListWise($scope.todaysCard, "tournaments");
        $scope.tomorrowList = $scope.getListWise($scope.tomorrow, "tournaments");
      }
    }

    $scope.iplWinner = function() {
      NavigationServices.iplWinner().then(function(response) {
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

    $rootScope.selectedRace = 7;
    $scope.showHorseRacing = function () {
      $rootScope.selectedRace = 7;
      $scope.getRaceData();
    };
    $scope.showGreyhoundRacing = function () {
      $rootScope.selectedRace = 4339;
      $scope.getRaceData();
    };

    $scope.getMatches = function (tour, day) {
      tour.day = day;
      $scope.selectedTournament = tour ? tour : null;
      $scope.matchesList = $scope.getListWise(
        $scope.selectedTournament,
        "matches"
      );
      $scope.selectedMatch = null;
    };

    $scope.getMarkets = function (match, day) {
      match.day = day;
      $scope.selectedMatch = match ? match : null;
      var sportid = Math.trunc($rootScope.s_id) + "." + day;
      sportid = parseFloat(sportid);
      $scope.marketsList = $rootScope.marketlistwise(
        $scope.selectedMatch,
        $scope.selectedMatch.id,
        $scope.selectedTournament.id,
        sportid
      );
    };

    /* ---click the tab (hightlights)--- */
    $scope.Highlights = function (id) {
      $("#loading").css("display", "grid");

      $rootScope.s_id = id;
      $scope.matchesList = [];
      $scope.marketsList = [];
      if ($rootScope.s_id == 4) {
        $scope.s_name = "Cricket";
      } else if ($rootScope.s_id == 1) {
        $scope.s_name = "Soccer";
      } else if ($rootScope.s_id == 2) {
        $scope.s_name = "Tennis";
      } else if ($rootScope.s_id == "20") {
        $scope.s_name = "Kabaddi";
      } else if ($rootScope.s_id == "10") {
        $scope.s_name = "Teenpatti";
      } else if ($rootScope.s_id == 7.2) {
        $scope.s_name = "Horse Racing";
      } else if ($rootScope.s_id == 4339.2) {
        $scope.s_name = "Greyhound Racing";
      }
      $scope.isInplay = false;
      // $('.HLTab').removeClass('select')
      // $('#highlightTab' + index).addClass('select')
      $scope.inplayListData = [];
      $scope.datacount = [];
      $scope.oldHighlightlist = [];
      $scope.Highlightlist = [];
      if (id == 10) {
        $scope.getTeenpatti();
      } else if (id == 7.2) {
        $scope.showHorseRacing();
        $("#loading").css("display", "none");
      } else if (id == 4339.2) {
        $scope.showGreyhoundRacing();
        $("#loading").css("display", "none");
      } else {
        $scope.matchHighlight();
        // $scope.lotusHighlights(id)
        // $rootScope.getMatchDataFromWebSocket();
        if (!$scope.Highlightlist.length) {
          homeTimer = $interval(() => {
            $scope.matchHighlight();
          }, 1000);
        }
        // if ($rootScope.authcookie) {
        //   homeTimer = $interval(() => {
        //     $rootScope.getMatchDataFromWebSocket();
        //   }, 5000);
        // } else {
        //   homeTimer = $interval(() => {
        //     $rootScope.getMatchDataFromWebSocket();
        //   }, 1000 * 60);
        // }
      }

      console.log("Highlightlist", $rootScope.s_id, $scope.Highlightlist);
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
      $scope.matchHighlightinter = false;
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
          if (item.runner1Back != $scope.oldHighlightlist[index].runner1Back) {
            $("#hback1_" + index).addClass("spark");
          }
          if (item.runner1Lay != $scope.oldHighlightlist[index].runner1Lay) {
            $("#hlay1_" + index).addClass("spark");
          }
          if (item.runner2Back != $scope.oldHighlightlist[index].runner2Back) {
            $("#hback2_" + index).addClass("spark");
          }
          if (item.runner2Lay != $scope.oldHighlightlist[index].runner2Lay) {
            $("#hlay2_" + index).addClass("spark");
          }
          if (item.runner3Back != $scope.oldHighlightlist[index].runner3Back) {
            $("#hback3_" + index).addClass("spark");
          }
          if (item.runner3Lay != $scope.oldHighlightlist[index].runner3Lay) {
            $("#hlay3_" + index).addClass("spark");
          }
        }
        if (item.bfId == $scope.oldHighlightlist[index].bfId) {
        }
        if (item.marketId == $scope.oldHighlightlist[index].marketId) {
        }
        if (item.mtBfId == $scope.oldHighlightlist[index].mtBfId) {
        }
      });
      $scope.oldHighlightlist = $scope.Highlightlist;
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
        $http({
          url:
            "http://209.250.242.175:33332/matchOdds/" +
            $rootScope.s_id +
            "/?ids=" +
            ids.slice(0, -1),
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).then(
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
    /* highlights end */
    $rootScope.TournamentList = function (id, name) {
      $scope.isLastElement = false;
      $rootScope.inplaydiv = false;
      $scope.pathList = [];
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

    $rootScope.eventList = function (id, name, sprt) {
      // console.log('--->>', id)
      // $('#loadingTree').css('display', 'block');

      $scope.level = 2;

      $scope.ename = name;
      $scope.tourid = id;

      if (sprt != undefined) {
        $scope.sprtid = sprt;
      }

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

    $rootScope.MarketList = function (id, name) {
      // $('#loadingTree').css('display', 'block');

      $scope.level = 3;
      $scope.matchid = id;
      $scope.mname = name;
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
        // $('#loadingTree').css('display', 'none');
        $scope.pathList.splice(2, 1);
        $scope.pathList.push({
          name: name,
          id: id,
          level: $scope.level,
        });
      }
    };
    $rootScope.marketlistwise = function (matchlistdata, mtid, tourid, sprtId) {
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
    $scope.setCurrentHighlistTime = function (time) {
      $rootScope.matchTime = time;
    };

    $scope.getTeenpatti = function () {
      $http({
        url: "http://136.244.79.114:82/listCasinoTable",
        method: "GET",
        headers: {
          Authorization: token,
        },
      }).then(
        function mySuccess(response) {
          console.log("teen", response);
          if (
            response.data.result == null ||
            response.data.result[0].tables.length < 1
          ) {
            $scope.Highlightlist = [];
          } else {
            $scope.StreamServer = response.data.result[0].streamServer;
            $scope.OddServer1 = response.data.result[0].oddServer1;
            $scope.OddServer2 = response.data.result[0].oddServer2;
            $scope.Highlightlist = response.data.result[0].tables;
          }
          $("#loading").css("display", "none");
        },
        function myError(error) {
          if (error.status == 401) {
            $.removeCookie("authtoken");
            window.location.href = "index.html";
          }
        }
      );
    };

    $scope.sportsListInterval = null;
    $scope.listGamesOn = true;
    if (token) {
      $scope.getActivatedGames();
      $rootScope.getOtherGames();
    }
    $rootScope.SportsList();
    $scope.sportsListInterval = setInterval(function () {
      if ($scope.listGamesOn) {
        $rootScope.getOtherGames();
        $rootScope.SportsList();
      }
    }, 15000);

    // var balanceInterval = $interval(() => {
    //   $scope.refreshFunds();
    // }, 5000)

    var pingInterval;
    if (token) {
      NavigationServices.ping();
      pingInterval = $interval(() => {
        NavigationServices.ping();
      }, 5000);
    }

    $scope.$on("$destroy", () => {
      $interval.cancel(pingInterval);
    });
  }
);
