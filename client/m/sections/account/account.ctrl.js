app.controller('accountController',function($scope,$http,$cookies,$rootScope,$timeout,$window,NavigationServices,$routeParams,$interval){
	$rootScope.selectedTab='account';

	console.log($rootScope.currentUser);

	$scope.logoutCalls=true;
	$scope.logout=function(){
		if ($scope.logoutCalls==false) {
			return false;
		}
		$scope.logoutCalls=false;

		$('#loading').css('display','flex');
		NavigationServices.logout().then(function success(data){
			console.log(data);
			$rootScope.clearCookies();
			$('#loading').css('display','none');
		},function error(err){
			$scope.logoutCalls=true;
			$rootScope.clearCookies();
			$('#loading').css('display','none');
		})
	}
})