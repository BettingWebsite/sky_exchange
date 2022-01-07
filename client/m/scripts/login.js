var loginApp = angular.module("loginApp", ["ngCookies"]);
var baseUrl = "http://136.244.79.114:82";

if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  context = "mobile";
} else {
  context = "web";
}

loginApp.directive("disableRightClick", function () {
  return {
    restrict: "A",

    link: function (scope, element, attr) {
      element.bind("contextmenu", function (e) {
        e.preventDefault();
      });
    },
  };
});

loginApp.directive("myEnter", function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if (event.which === 13) {
        scope.$apply(function () {
          scope.$eval(attrs.myEnter);
        });

        event.preventDefault();
      }
    });
  };
});

loginApp.controller(
  "loginController",
  function ($scope, $http, $rootScope, $cookies, $window, $location) {
    // $scope.username='';

    // $scope.password='';

    // $('#authenticateImage').on('click', function() {

    //     $('#authenticateImage').attr('src','captcha.php');

    // })
    // let user = $.cookie('current_client');
    // if (!!user) {
    //     $rootScope.currentUser = JSON.parse(user);
    // }

    $(document).ready(function () {
      getCaptchaImage();
    });

    $scope.loginCalls = true;
    $scope.captchaLog = "";
    getCaptchaImage = function () {
      $http({
        method: "GET",
        url: baseUrl + "/img.png",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(function success(response) {
        if (response.data) {
          $("#authenticateImage").css("visibility", "visible");
          $("#authenticateImage").attr(
            "src",
            "data:image/jpeg;base64, " + response.data.img
          );
          $scope.captchaLog = response.data.log;
        }
      });
    };
    $scope.login = function () {
      if ($scope.username == undefined || $scope.username == "") {
        $scope.result = "Username is empty";
        return false;
      }

      if ($scope.password == undefined || $scope.password == "") {
        $scope.result = "Password is empty";
        return false;
      }

      // to disable captcha

      if ($scope.captcha == "" || $scope.captcha == undefined) {
        $scope.result = "Captcha is mandatory";
        return false;
      }
      $scope.result = "";

      $scope.loginData = {
        captcha: $scope.captcha,
        log: $scope.captchaLog,
        userName: $scope.username,
        password: $scope.password,
      };
      if ($scope.captcha != null && $scope.captcha != "") {
        $http({
          url: baseUrl + "/login",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify($scope.loginData),
        }).then(
          function success(response) {
            if (response.data.errorCode === 0) {
              $scope.result = "You have successfully logged in.";
              $rootScope.currentUser = response.data.result[0];
              var currentUser = $rootScope.currentUser;
              $rootScope.userName = currentUser.userName;
              var date = new Date();
              date.setTime(date.getTime() + 60 * 60 * 1000); // Expires in an hr
              $.cookie("authtokenmobile", response.data.result[0].token, {
                expires: date,
                path: "/",
              });
              authtoken = response.data.result[0].token;
              localStorage.clear();
              $.cookie("current_client", JSON.stringify(currentUser), {
                path: "/",
              });
              $scope.showLoginDetails = false;
              // Check Rules Messages
              if (response.data.result[0].rules) {
                $("#rules_modal").css("display", "block");
                $scope.rules = atob(response.data.result[0].rules);
              }
              window.location.href = "/m";
              // $scope.Fund();
            } else {
              $scope.result = response.data.errorDescription;
              getCaptchaImage();
              $scope.showLoginDetails = false;
            }
          },
          function error(error) {
            $scope.showLoginDetails = true;
          }
        );
      }
      // to disable captcha

      // $scope.result = "";

      // $scope.loginData = {
      //   context: context,

      //   username: $scope.username,

      //   pwd: $scope.password,
      // };

      // console.log(JSON.stringify($scope.loginData));

      // to disable captcha

      // if ($scope.captcha != null && $scope.captcha != "") {
      //   $.ajax({
      //     url: "captchaValidate.php",

      //     method: "POST",

      //     data: {
      //       vercode: $scope.captcha,
      //     },

      //     success: function (response) {
      //       if (response != "Successful") {
      //         $scope.$apply(function () {
      //           $scope.result = "Invalid validation code !";
      //         });

      //         $("#authenticateImage").attr("src", "captcha.php");

      //         return false;
      //       } else {

      // // to disable captcha

      // if ($scope.loginCalls == false) {
      //   return false;
      // }

      // $scope.loginCalls = false;

      // $http({
      //   url: "http://www.lcexchanges247.com/Client/BetClient.svc/Login",

      //   method: "POST",

      //   data: JSON.stringify($scope.loginData),
      // }).then(
      //   function success(response) {
      //     if (response.data.description.status == "Success") {
      //       $scope.result = response.data.description.result;

      //       $cookies.put(
      //         "cramp",
      //         JSON.stringify(response.data.response.AuthToken)
      //       );
      //       $cookies.put("username", $scope.username);

      //       window.location.href = "index.html";

      //       localStorage.clear();
      //     } else {
      //       $scope.result = response.data.description.result;

      //       $("#authenticateImage").attr("src", "captcha.php");
      //     }

      //     $scope.loginCalls = true;
      //   },

      //   function error(error) {
      //     $scope.loginCalls = true;
      //   }
      // );
      // // to disable captcha

      //       }
      //     },
      //   });
      // }

      // to disable captcha
    };

    $scope.showOverlayInfo = function (id) {
      $("#" + id).css("display", "flex");
    };

    $scope.closeOverlayInfo = function (id) {
      $("#" + id).css("display", "none");
    };
  }
);
