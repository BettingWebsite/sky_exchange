app.controller('sportsController',function($scope,$http,$cookies,$rootScope,$timeout,$window,NavigationServices){

	$rootScope.selectedTab='sports';
	$scope.selectedSports;

	$scope.sportsListCalls=true;
	$scope.getSportsList=function(){
		if ($scope.sportsListCalls==false) {
			return false;
		}
		$scope.sportsData=$rootScope.sportWise($rootScope.sportsData);
		$('#loading').css('display','none');
		
	}
	$scope.getSportsList();

	var sportsEvent = $rootScope.$on('sportsEvent',function(event,data){
		$scope.getSportsList();
		$rootScope.clientCount++;
	})
	$scope.$on('$destroy', sportsEvent);

	$scope.tournamentListCalls=true;
	$scope.getTournamentList=function(sport){
		if ($scope.tournamentListCalls==false) {
			return false;
		}
		$scope.selectedSports = sport;
		$scope.tournamentData=$rootScope.tournamentWise($rootScope.sportsData[$scope.selectedSports.id]);
	}

	$scope.matchListCalls=true;
	$scope.getMatchList=function(tournament){
		$scope.selectedTournament=tournament;
		
		$scope.matchData=$rootScope.matchtWise($rootScope.sportsData[$scope.selectedSports.id].tournaments[$scope.selectedTournament.id]);
	}
	$scope.marketListCalls=true;
	$scope.getMarketList=function(match){
		
		$scope.selectedMatch=match;
		
		$scope.marketData=$rootScope.marketWise($rootScope.sportsData[$scope.selectedSports.id].tournaments[$scope.selectedTournament.id].matches[$scope.selectedMatch.bfId]);
	}

	$scope.back=function(item){

		if (item==undefined) {
			if ($scope.selectedMatch!=undefined) {
				$scope.selectedMatch=undefined;
				$scope.marketData=[];
			}else{
				if ($scope.selectedTournament!=undefined) {
					$scope.selectedTournament=undefined;
					$scope.matchData=[];
				}
				else{
					if ($scope.selectedSports!=undefined) {
						$scope.selectedSports=undefined;
						$scope.tournamentData=[];
					}
				}
			}
		}
		else{
			if (item=='selectedMatch') {
				$scope.selectedMatch=undefined;
				$scope.marketData=[];
			}
			else if (item=='selectedTournament') {
				$scope.selectedTournament=undefined;
				$scope.matchData=[];
				$scope.selectedMatch=undefined;
				$scope.marketData=[];
			}
			else if (item=='selectedSports') {
				$scope.selectedSports=undefined;
				$scope.tournamentData=[];
				$scope.selectedTournament=undefined;
				$scope.matchData=[];
				$scope.selectedMatch=undefined;
				$scope.marketData=[];
			}
		}
		
	}
})