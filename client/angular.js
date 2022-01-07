app.controller('tvController',function($scope,$http,$cookieStore,$window,$routeParams){

// var favoriteCookie = $cookieStore.get('Userdata');

 $scope.Gettv = function(){
  var gettvlist = JSON.parse(localStorage.getItem("tvlist"));
  console.log(gettvlist)
//http://185.136.156.254/Dream11Client/BetClient.svc/Data/MktData?mtid={MTID}&mktid={MKTID}
$scope.mtid = gettvlist.matchId
$scope.mktid = gettvlist.marketId;


       $http({
             url: "http://185.136.156.254/Dream11Client/BetClient.svc/Data/MktData?mtid="+$scope.mtid+"&mktid="+$scope.mktid,
             
             method: "GET",
             
             headers: {
             Token  : authtoken
             }
         })

       .then(function mySuccess(response) {
          console.log(response);

          console.log(response.data.liveTvConfig)
          $scope.channelIp=response.data.liveTvConfig.channelIp
           $scope.channelNo=response.data.liveTvConfig.channelNo
          $scope.program=response.data.liveTvConfig.program
            $scope.hdmi=response.data.liveTvConfig.hdmi
          $scope.Setchannel();
           // $scope.runeerdataList = response.data.data.runnerData;
           // console.log( $scope.runeerdataList,"------")

         }, function myError(response) {
              console.log(response);
               
     });
}

$scope.Setchannel = function() {

        console.log($scope.channelIp, $scope.channelNo, $scope.program, $scope.hdmi)

        $scope.channelIp=$scope.channelIp.trim();
        $scope.channelNo=$scope.channelNo;
        $scope.program=$scope.program.trim();
        $scope.hdmi=$scope.hdmi.trim();
        console.log($scope.channelIp,$scope.channelNo, $scope.program,$scope.hdmi, "---")

        // $scope.channelIp = channelIp.trim()
        // $scope.program = program.trim()
        // $scope.hdmi = hdmi.trim()
        // console.log($scope.channelIp, $scope.program, $scope.hdmi, channelNo, "price display")

        $('#player_preview').empty();
        // $('.spanchannel').removeClass('activechannel');
        // $('input[name="channelIp"]').val(channelIp)
        // $('input[name="hdmi"]').val(hdmi)
        // $('input[name="program"]').val(program)
        // $('#channel_'+channelNo).addClass('activechannel');

        $('#player_preview').append('<div style="padding-left:0px;padding-top:4px;" align=center> <u1 id="' + $scope.program + '"></u1> <script type="text/javascript"> if ( "MediaSource" in window && "WebSocket" in window ){RunPlayer( \'' + $scope.program + '\', 390, 250, \'' + $scope.channelIp + '\', "5119", false, \'' + $scope.hdmi + '\', "", true, true, 0.01, "", false ); } else {document.getElementById(' + $scope.program + ').innerHTML = "Websockets are not supported in your browser."; } </script> </div>');
    }

})

