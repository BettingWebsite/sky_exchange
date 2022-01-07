app.controller(
  "inplayController",
  function (
    $scope,
    $http,
    $cookies,
    $rootScope,
    $timeout,
    $window,
    NavigationServices,
    $interval
  ) {
    $rootScope.selectedTab = "inplay";
	$scope.sportsData = $rootScope.sportsData;

    $rootScope.$on("event:sportsData", (event, sportsData) => {
	  $scope.sportsData = sportsData;
	  if ($scope.inplayTab == "inplay") {
        $scope.getInplayList();
      } else if ($scope.inplayTab == "today") {
        $scope.getupComingEvents(1);
      } else if ($scope.inplayTab == "tomorrow") {
        $scope.getupComingEvents(2);
      }
    });

    $("#loading").css("display", "flex");
    $scope.inplayListCalls = true;
    $scope.getInplayList = function () {
    //   if ($scope.inplayListCalls == false) {
    //     return false;
    //   }
      // $scope.inplayListCalls=false;
      // // $('#loading').css('display','flex');
      // $scope.inplayUpComData = NavigationServices.inplay($rootScope.SportsData);
      // $scope.inplayListCalls=true;

      // angular.forEach($scope.inplayUpComData,function(item,index){
      // 	angular.forEach(item.inplayData,function(item,index){
      // 		item.inPlay=1;
      // 	})
      // })
      // $('#loading').css('display','none');

      // $('#loading').css('display','none');
    //   $scope.inplayListCalls = true;
      $scope.inplayUpComData = $rootScope
        .inplaylistwise($scope.sportsData, 0)
        .reverse();
      $("#loading").css("display", "none");
    };
    $scope.getInplayList();

    var inplayEvent = $rootScope.$on("inplayEvent", function (event, data) {
      $scope.getInplayList();
      $rootScope.clientCount++;
    });
    $scope.$on("$destroy", inplayEvent);

    $scope.upComingEventsCalls = true;
    $scope.getupComingEvents = function (type) {
    //   if ($scope.upComingEventsCalls == false) {
    //     return false;
    //   }
    //   $scope.upComingEventsCalls = false;
      // $('#loading').css('display','flex');

      $scope.inplayUpComData = $rootScope
        .inplaylistwise($scope.sportsData, type)
        .reverse();
      $('#loading').css('display','none');

      // console.log($scope.inplayUpComData)
    };

    $scope.inplayDataWise = function (upData) {
      var inplayDatas = [];

      var inplaySportArray = [];
      angular.forEach(upData, function (item, index) {
        if (inplayDatas.length == 0) {
          var inplayData = [];

          item.matchDate = item.date;
          item.matchId = item.eventId;
          item.matchName = item.eventName;
          item.inPlay = 0;

          var data = {
            id: item.id,
            name: item.sportName,
            inplayData: inplayData,
          };
          data.inplayData.push(item);

          inplayDatas.push(data);
          inplaySportArray.push(item.sportName);
        } else {
          if (inplaySportArray.indexOf(item.sportName) != -1) {
            item.matchDate = item.date;
            item.matchId = item.eventId;
            item.matchName = item.eventName;
            item.inPlay = 0;
            angular.forEach(inplayDatas, function (item2, index2) {
              if (item2.name == item.sportName) {
                item2.inplayData.push(item);
              }
            });
          } else {
            var inplayData = [];

            item.matchDate = item.date;
            item.matchId = item.eventId;
            item.matchName = item.eventName;
            item.inPlay = 0;

            var data = {
              id: item.id,
              name: item.sportName,
              inplayData: inplayData,
            };
            data.inplayData.push(item);
            inplayDatas.push(data);
            inplaySportArray.push(item.sportName);
          }
        }
        // console.log(inplayDatas)
      });
      return inplayDatas;
    };

    $scope.inplayTab = "inplay";
    $scope.changeTab = function (tab) {
      $scope.inplayTab = tab;
      if ($scope.inplayTab == "inplay") {
        $scope.getInplayList();
      } else if ($scope.inplayTab == "today") {
        $scope.getupComingEvents(1);
      } else if ($scope.inplayTab == "tomorrow") {
        $scope.getupComingEvents(2);
      }
    };

    var inplayInterval = $interval(function () {
      if ($rootScope.fType == 2 && $scope.inplayTab == "inplay") {
        $scope.getInplayList();
        // console.log($scope.inplayTab)
        // $scope.getupComingEvents();
      }
    }, 2000);

    $scope.$on("$destroy", function () {
      $interval.cancel(inplayInterval);
    });
  }
);
