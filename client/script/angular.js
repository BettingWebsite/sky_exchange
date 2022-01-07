var app = angular.module("myApp", ["ngRoute", "ngCookies"]);
// app.controller('tvController', function ($scope, $localStorage, $sessionStorage, $window) {
//     $scope.Gettv = function () {
//         $localStorage.LocalMessage = "LocalStorage: My name is Mudassar Khan.";
//         $sessionStorage.SessionMessage = "SessionStorage: My name is Mudassar Khan.";
//     }
//     $scope.Gettv = function () {
//         $window.alert($localStorage.LocalMessage + "\n" + $sessionStorage.SessionMessage);
//     }
// });

function getUrlParameter(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}
// var favoriteCookie = $cookieStore.get('Userdata');
var authtoken = $.cookie("authtoken");

app.controller(
  "tvController",
  function ($scope, $http, $cookieStore, $window, $routeParams, $rootScope) {
    $scope.mtid = getUrlParameter("mtid");
    $scope.mktid = getUrlParameter("mktid");
    $scope.Gettv = function () {
      $http({
        url:
          "http://www.lcexchanges247.com/Client/BetClient.svc/Data/MktData?mtid=" +
          $scope.mtid +
          "&mktid=" +
          $scope.mktid,

        method: "GET",

        headers: {
          Token: authtoken,
        },
      }).then(
        function mySuccess(response) {
          if (response.data.liveTvConfig.channelIp != null) {
            $scope.Setchannel(response.data.liveTvConfig);
          } else {
            var width = 370;
            var height = 250;

            var matchid = response.data.data.matchBfId;

            $("#player_preview").empty();
            $("#player_preview").css("display", "none");
            $("#loading").css("display", "block");

            setTimeout(function () {
              $("#loading").css("display", "none");
              $("#player_preview").css("display", "block");
            }, 5000);

            $("#player_preview").append(
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
        },
        function myError(response) {
          console.log(response);
        }
      );
    };

    $scope.Setchannel = function (data) {
      $scope.channelIp = data.channelIp.trim();
      $scope.channelNo = data.channelNo;
      $scope.program = data.program.trim();
      $scope.hdmi = data.hdmi.trim();

      $("#player_preview").empty();

      $("#player_preview").append(
        '<div> <u1 id="' +
          $scope.program +
          '"></u1> <script type="text/javascript"> if ( "MediaSource" in window && "WebSocket" in window ){RunPlayer( \'' +
          $scope.program +
          "', 390, 250, '" +
          $scope.channelIp +
          "', \"443\", true, '" +
          $scope.hdmi +
          '\', "", true, true, 0.01, "", false ); } else {document.getElementById(' +
          $scope.program +
          ').innerHTML = "Websockets are not supported in your browser."; } </script> </div>'
      );
    };
  }
);

app.controller(
  "FancybookController",
  function ($scope, $http, $cookieStore, $window, $routeParams) {
    $scope.mtid = getUrlParameter("mtid");
    $scope.fid = getUrlParameter("fid");
    $scope.fname = getUrlParameter("fname");
    $scope.baseUrl = getUrlParameter("baseUrl");
    var authtoken = $.cookie('authtoken')

    $scope.GetFancyBook = function () {
      $http({
        url: $scope.baseUrl + "/listBooks/df_" + $scope.mtid + "_" + $scope.fid + ",",

        method: "GET",

        headers: {
          Authorization: authtoken,
        },
      }).then(
        function mySuccess(response) {
          // console.log(response);
          console.log(response);
          if (response.data.errorCode == 0) {
            $scope.fancyDatabookList = [];
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
              $scope.fancyDatabookList.push(row);
            }
            console.log(matrix, $scope.fancyDatabookList);
          }
        },
        function myError(error) {
          if (error.status == 401) {
            //$.removeCookie("auth-token");
            window.location.href = "login.html";
          }
        }
      );
    };
  }
);
