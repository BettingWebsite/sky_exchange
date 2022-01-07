// var authtoken = $.cookie('authtoken');
var app = angular.module("accountApp", ["ngRoute", "ngCookies"]);
app.config([
  "$routeProvider",
  function ($routeProvider) {
    $routeProvider

      .when("/", {
        // controller: 'homeAccountController',
        templateUrl: "homeAccount.html",
        data: {
          title: "AccountInfo",
        },
      })
      .when("/homeAccount", {
        controller: "homeAccountController",
        templateUrl: "homeAccount.html",
        data: {
          title: "AccountInfo",
        },
      })
      .when("/balance_Overview", {
        controller: "balance_OverviewController",
        templateUrl: "balance_Overview.html",
        data: {
          title: "Balance_Overview",
        },
      })

      .when("/accountStatement", {
        controller: "accountStatementController",
        templateUrl: "accountStatement.html",
        data: {
          title: "AccountStatement",
        },
      })

      .when("/casinoreport", {
        controller: "casinoreport",
        templateUrl: "casinoreport.html",
        data: {
          title: "casinoreport",
        },
      })

      .when("/mybets", {
        controller: "myBetsController",
        templateUrl: "mybets.html",
        data: {
          title: "Mybets",
        },
      })
      .when("/betsHistory", {
        controller: "betsHistoryController",
        templateUrl: "betsHistory.html",
        data: {
          title: "BetsHistory",
        },
      })
      .when("/profitLoss", {
        controller: "profitLossController",
        templateUrl: "profitLoss.html",
        data: {
          title: "ProfitLoss",
        },
      })

      .when("/loghistory", {
        controller: "loginHistoryController",
        templateUrl: "activitylog.html",
        data: {
          title: "Activitylog",
        },
      });
    // .when('/changePassword',{
    //     controller:'changePasswordController',
    //     templateUrl:'changePassword.html'
    // })
  },
]);

var authtoken = $.cookie("authtoken");
var baseUrl = "http://136.244.79.114:82";

function authInterceptor() {
  return {
    response: function (res) {
      if (res.config.url.includes(baseUrl)) {
        if (
          res.data.errorDescription &&
          (res.data.errorDescription.toLowerCase().includes("no session") ||
            res.data.errorDescription.toLowerCase().includes("session expired"))
            ) {
          console.log(res);
          alert(res.data.errorDescription)
          if (authtoken) {
            alert(res.data.errorDescription);
            window.location.href = 'index.html';
          }
        }
      }
      return res;
    },
  };
}

app
  .factory("authInterceptor", authInterceptor)
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push("authInterceptor");
  });


app.controller(
  "homeAccountController",
  function ($scope, $http, $cookieStore, $window, $routeParams, $rootScope) {
    $rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
      $rootScope.title = current.$$route.data.title;
    });

    var currentUser = $.cookie("current_client");
    if (!!currentUser) {
      $rootScope.currentUser = JSON.parse(currentUser);
    }

    $rootScope.currentDate = new Date();
    $scope.userDescription = function () {
      if (authtoken == undefined) {
        window.location.href = "index.html";
        return false;
      }
      $http({
        url: baseUrl + "/profile",
        method: "GET",
        headers: {
          Authorization: authtoken,
        },
      }).then(
        function mySuccess(response) {
          if (response.data.errorCode == 0) {
            // $scope.lastLogin=response.data.data.lastLogin
            $scope.name = response.data.result[0].name;
            $scope.userName = response.data.result[0].userName;
            // $scope.uName = response.data.data.uName;
            $scope.currencyCode = response.data.result[0].currencyCode;
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
    $scope.userDescription();

    $scope.getBalance = function () {
      if (authtoken == undefined) {
        window.location.href = "index.html";
        return false;
      }

      $("#accountCredit").css("display", "none");
      $("#menuRefreshIcon").css("display", "block");
      $http({
        url: baseUrl + "/balance",
        method: "GET",
        headers: {
          Authorization: authtoken,
        },
      }).then(
        function mySuccess(response) {
          // console.log(response);
          // $scope.getBalancesdataList = response.data.data;
          $scope.availBal = response.data.result[0].balance;
          $scope.exposure = response.data.result[0].exposure;

          //   $scope.exposure = response.data.data.exposure;
          $("#menuRefreshIcon").css("display", "none");
          $("#accountCredit").css("display", "block");
        },
        function myError(error) {
          if (error.status == 401) {
            // $.removeCookie("auth-token");
            window.location.href = "index.html";
          }
        }
      );
    };

    $scope.getBalance();
    $scope.Openpopup = function () {
      $("#changePasswordModal").css("display", "block");
    };
    $scope.Closepopup = function () {
      $("#changePasswordModal").css("display", "none");
    };

    $scope.ChangePwd = function () {
      if (
        $scope.NewPassword == "" ||
        $scope.NewPassword == null ||
        $scope.NewPassword == undefined
      ) {
        $.toast({
          heading: "Error",
          text: "NewPassword can not be blank!",
          position: "bottom-right",
          showHideTransition: "slide",
          icon: "error",
        });
        return false;
      }
      if (
        $scope.ConfirmPassword == "" ||
        $scope.ConfirmPassword == null ||
        $scope.ConfirmPassword == undefined
      ) {
        $.toast({
          heading: "Error",
          text: "ConfirmPassword can not be blank!",
          position: "bottom-right",
          showHideTransition: "slide",
          icon: "error",
        });
        return false;
      }
      if ($scope.NewPassword != $scope.ConfirmPassword) {
        $.toast({
          heading: "Error",
          text: "Password Dosn't match",
          position: "bottom-right",
          showHideTransition: "slide",
          icon: "error",
        });
        return false;
      }
      if (
        $scope.YourPassword == "" ||
        $scope.YourPassword == null ||
        $scope.YourPassword == undefined
      ) {
        $.toast({
          heading: "Error",
          text: "Old Password can not be blank!",
          position: "bottom-right",
          showHideTransition: "slide",
          icon: "error",
        });
        return false;
      }
      $scope.data = {
        newpwd: $scope.NewPassword,
        pwd: $scope.YourPassword,
      };

      $http({
        url: baseUrl + "/updateUser",

        method: "POST",
        data: $scope.data,
        headers: {
          "Content-Type": "application/json",
          Authorization: authtoken,
        },
      }).then(
        function mySuccess(response) {
          // console.log(response);
          if (response.data.errorCode === 0) {
            $.toast({
              heading: "Success",
              text: response.data.errorDescription,
              position: "bottom-right",
              showHideTransition: "slide",
              icon: "success",
            });
            $.removeCookie("authtoken");
            window.location.href = "index.html";
            $("#changePasswordModal").css("display", "none");
          } else {
            $.toast({
              heading: "Error",
              text: response.data.errorDescription,
              position: "bottom-right",
              showHideTransition: "slide",
              icon: "error",
            });
            $("#changePasswordModal").css("display", "block");
          }
        },
        function myError(error) {
          if (error.status == 401) {
            // $.removeCookie("auth-token");
            window.location.href = "index.html";
          }
        }
      );
    };
  }
);
app.controller(
  "accountStatementController",
  function ($scope, $http, $cookieStore, $window, $routeParams) {
    var days = 7; // Days you want to subtract
    var date = new Date();
    var last = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
    $scope.date = last;
    $scope.fromdate =
      $scope.date.getFullYear() +
      "-" +
      ($scope.date.getMonth() + 1) +
      "-" +
      $scope.date.getDate() +
      " 00:00:00";
    $scope.todate =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getDate() +
      " 23:59:00";
    $("#startDate").val($scope.fromdate);
    $("#endDate").val($scope.todate);

    // $scope.loading=true

    $scope.statementType = "0";

    $scope.AccountStatement = function () {
      if (authtoken == undefined) {
        window.location.href = "index.html";
        return false;
      }
      $("#loading").css("display", "inline-grid");
      // $scope.loading=true

      $scope.From_date = $("#startDate").val();
      $scope.To_date = $("#endDate").val();

      $http({
        url:
          baseUrl +
          "/accountStatement?from=" +
          $scope.From_date +
          "&to=" +
          $scope.To_date +
          "&type=" +
          $scope.statementType,

        method: "GET",

        headers: {
          Authorization: authtoken,
        },
      }).then(
        function mySuccess(response) {
          // console.log(response);
          if (response.data.errorCode === 0) {
            $scope.accountdataList = response.data.result;
            $scope.loading = false;
            $("#loading").css("display", "none");
          } else {
            $scope.accountdataList = response.data.result;
            $("#loading").css("display", "none");
          }
        },
        function myError(response) {
          // console.log(response);
          // if (response.status==401) {
          //              $window.location.href = 'index.html';
          //          }
        }
      );
    };
    $scope.AccountStatement();
  }
);

app.controller(
  "casinoreport",
  function ($scope, $http, $location, $timeout, $routeParams, $rootScope) {
    var days = 1;
    var date = new Date();
    var last = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
    $scope.date = last;
    $scope.fromdate =
      $scope.date.getFullYear() +
      "-" +
      ($scope.date.getMonth() + 1) +
      "-" +
      $scope.date.getDate() +
      " 00:00:00";
    $scope.todate =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getDate() +
      " 23:59:00";
    $scope.pnlPeriod = "1";
    $("#startDate").val($scope.fromdate);
    $("#endDate").val($scope.todate);
    $scope.pending_GetCaisnoResults = false;
    $scope.GetCaisnoResults = function () {
      $scope.AccountStatementdata = null;
      if (Date.parse($scope.fromdate) >= Date.parse($scope.todate)) {
        toastr.error("'To' date must be greater than 'From' date.");
        return false;
      }
      $scope.From_date = $("#startDate").val();
      $scope.To_date = $("#endDate").val();
      if ($scope.pending_GetCaisnoResults == true) return false;
      $scope.pending_GetCaisnoResults = true;
      $("#loading").css("display", "inline-grid");
      $http({
        method: "GET",
        url:
          "http://www.lcexchanges247.com/Client/BetClient.svc/Reports/GetCaisnoResults?from=" +
          $scope.fromdate +
          "&to=" +
          $scope.todate +
          "&gtype=" +
          $scope.pnlPeriod,
        headers: {
          "Content-Type": "application/json",
          Token: authtoken,
        },
      }).then(
        function success(response) {
          $scope.pending_GetCaisnoResults = false;
          $scope.Teenpattidata = response.data.data;
          $("#loading").css("display", "none");
        },
        function error(response) {
          $("#loading").css("display", "none");
          $scope.pending_GetCaisnoResults = false;
          if (response.status == 401) {
            $cookieStore.remove("authtoken");
            window.location.href = "login.html";
          }
        }
      );
    };
    $scope.GetCaisnoResults();
  }
);
app.controller(
  "balance_OverviewController",
  function ($scope, $http, $cookieStore) {
    $scope.getBalance = function () {
      if (authtoken == undefined) {
        window.location.href = "index.html";
        return false;
      }
      $http({
        url: baseUrl + "/balance",
        method: "GET",
        headers: {
          Authorization: authtoken,
        },
      }).then(
        function mySuccess(response) {
          // console.log(response);
          // $scope.getBalancesdataList = response.data.data;
          $scope.availBal = response.data.result[0].balance;
          //   $scope.exposure = response.data.data.exposure;
        },
        function myError(error) {
          if (error.status == 401) {
            // $.removeCookie("auth-token");
            window.location.href = "index.html";
          }
        }
      );
    };

    $scope.getBalance();

    $scope.logTransaction = function () {
      if (authtoken == undefined) {
        window.location.href = "index.html";
        return false;
      }

      $("#loading").css("display", "inline-grid");
      $http({
        url: baseUrl + "/logTransaction",
        method: "GET",
        headers: {
          Authorization: authtoken,
        },
      }).then(
        function mySuccess(response) {
          if (response.data.errorCode === 0) {
            $scope.getBalancesdataList = response.data.result;
          } else {
            $scope.getBalancesdataList = response.data.result;
          }
          $("#loading").css("display", "none");
          // console.log(response);
        },
        function myError(error) {
          if (error.status == 401) {
            // $.removeCookie("auth-token");
            window.location.href = "index.html";
          }
        }
      );
    };

    $scope.logTransaction();
  }
);

app.controller("myBetsController", function ($scope, $http, $cookieStore) {
  // var favoriteCookie = $cookieStore.get('Userdata');
  // $scope.loading=true
  
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.matchedbetsList = [];
  $scope.numberOfPages = function () {
    return Math.ceil($scope.matchedbetsList.length / $scope.pageSize);
  };
  
  $scope.prev = function () {
    $scope.currentPage = $scope.currentPage - 1;
  };

  $scope.next = function () {
    $scope.currentPage = $scope.currentPage + 1;
  };

  $scope.betStatus = "ALL";

  $scope.matchedbetsListHolder = [];
  $scope.getCurrentBets = function () {
    if (authtoken == undefined) {
      window.location.href = "index.html";
      return false;
    }
    $("#loading").css("display", "inline-grid");
    // $scope.loading=true
    $http({
      url: baseUrl + "/currentBets",
      method: "GET",
      headers: {
        Authorization: authtoken,
      },
    }).then(
      function mySuccess(response) {
        // console.log(response);
        if (response.data.errorCode === 0) {
          $scope.matchedbetsListHolder = response.data.result;
          $scope.matchedbetsList = Object.assign([], response.data.result)
          .map((bet) => {
            bet.odds = bet.odds.replace(/:/, '/');
            return bet;
          })
          .sort((a, b) => {
            return Date.parse(b.betTime) - Date.parse(a.betTime);
          });
          $scope.selectTab(0);
        }

        // $scope.loading=false
        $("#loading").css("display", "none");
      },
      function myError(response) {
        // console.log(response);
        // if (response.status==401) {
        //              $window.location.href = 'index.html';
        //          }
      }
    );
  };
  $scope.getCurrentBets();

  $scope.betDetails = function (betId) {
    if ($("#bet_" + betId).css("display") == "none") {
      $("#bet_" + betId).css("display", "table-row");
      $("#" + betId).removeAttr("class", "expand-close");
      $("#" + betId).attr("class", "expand-open");
    } else {
      $("#bet_" + betId).css("display", "none");
      $("#" + betId).removeAttr("class", "expand-open");
      $("#" + betId).attr("class", "expand-close");
    }
  };

  $scope.orderByModel = "1";
  $scope.orderBy = function (value) {
    if (+value === 1) {
      $scope.matchedbetsList = $scope.matchedbetsList.sort((a, b) => {
        return Date.parse(b.betTime) - Date.parse(a.betTime);
      });
    } else {
      $scope.matchedbetsList = $scope.matchedbetsList.sort((a, b) => {
        return a.marketName.localeCompare(b.marketName);
      });
    }

    setTimeout(() => {
      $scope.$apply(() => {
        $scope.matchedbetsList = $scope.matchedbetsList;
      });
    });
  };

  $scope.selectedTab = 0;
  $scope.selectTab = function(tabIndex) {
    $scope.currentPage = 0;
    $scope.selectedTab = tabIndex;
    if ($scope.selectedTab === 0) {
      $scope.matchedbetsList = $scope.matchedbetsListHolder.filter((bet) => {
        return !!!bet.round
      })
      .sort((a, b) => {
        return Date.parse(b.betTime) - Date.parse(a.betTime);
      });
    } else {
      $scope.matchedbetsList = $scope.matchedbetsListHolder.filter((bet) => {
        return !!bet.round
      })
      .sort((a, b) => {
        return Date.parse(b.betTime) - Date.parse(a.betTime);
      });
    }
    $scope.total = $scope.matchedbetsList.reduce((acc, c) => {
      return (acc += +c.PL);
    }, 0);

    setTimeout(() => {
      $scope.$apply(() => {
        $scope.matchedbetsList = $scope.matchedbetsList;
      });
    });
  }
});
app.controller("betsHistoryController", function ($scope, $http, $cookieStore) {
  
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.getBetHistoryList = [];
  $scope.numberOfPages = function () {
    return Math.ceil($scope.getBetHistoryList.length / $scope.pageSize);
  };
  
  $scope.prev = function () {
    $scope.currentPage = $scope.currentPage - 1;
  };

  $scope.next = function () {
    $scope.currentPage = $scope.currentPage + 1;
  };

  $("#startDate").datetimepicker({
    format: "Y-m-d H:i:s",
  });
  $("#endDate").datetimepicker({
    format: "Y-m-d H:i:s",
  });

  $scope.betStatus = "1";
  var days = 7; // Days you want to subtract
  var date = new Date();
  var last = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
  $scope.date = last;
  $scope.fromdate =
    $scope.date.getFullYear() +
    "-" +
    ($scope.date.getMonth() + 1) +
    "-" +
    $scope.date.getDate() +
    " 00:00:00";
  $scope.todate =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate() +
    " 23:59:00";
  $("#startDate").val($scope.fromdate);
  $("#endDate").val($scope.todate);

  //  $scope.date = new Date();
  //  $scope.fromdate=$scope.date.getFullYear()+"-"+($scope.date.getMonth()+1)+"-"+$scope.date.getDate();
  //  $scope.todate=$scope.date.getFullYear()+"-"+($scope.date.getMonth()+1)+"-"+$scope.date.getDate();

  //  $scope.startTime="00:00:00";
  //  $scope.endTime=$scope.date.getHours()+":"+$scope.date.getMinutes()+":"+$scope.date.getSeconds();

  // $('#startDate').val($scope.fromdate);
  // $('#endDate').val($scope.todate);
  // $('#startTime').val($scope.startTime)
  // $('#endTime').val($scope.endTime)

  $scope.getBetHistoryDate = function (value) {
    if (value == "today") {
      $scope.date = new Date();
      $scope.fromdate =
        $scope.date.getFullYear() +
        "-" +
        ($scope.date.getMonth() + 1) +
        "-" +
        $scope.date.getDate() +
        " 00:00:00";
      $scope.todate =
        $scope.date.getFullYear() +
        "-" +
        ($scope.date.getMonth() + 1) +
        "-" +
        $scope.date.getDate() +
        " 23:59:00";

      // $scope.startTime="00:00:00";
      // $scope.endTime=$scope.date.getHours()+":"+$scope.date.getMinutes()+":"+$scope.date.getSeconds();

      $("#startDate").val($scope.fromdate);
      $("#endDate").val($scope.todate);
      // $('#startTime').val($scope.startTime)
      // $('#endTime').val($scope.endTime)
    } else if (value == "yesterday") {
      var days = 1; // Days you want to subtract
      var date = new Date();
      var last = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);

      $scope.date = last;
      $scope.fromdate =
        $scope.date.getFullYear() +
        "-" +
        ($scope.date.getMonth() + 1) +
        "-" +
        $scope.date.getDate() +
        " 00:00:00";
      $scope.todate =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " 23:59:00";

      // $scope.startTime="00:00:00";
      // $scope.endTime=$scope.date.getHours()+":"+$scope.date.getMinutes()+":"+$scope.date.getSeconds();

      $("#startDate").val($scope.fromdate);
      $("#endDate").val($scope.todate);
      // $('#startTime').val($scope.startTime)
      // $('#endTime').val($scope.endTime)
    }

    $scope.getBetHistory();
  };

  $scope.getBetHistory = function () {
    if (authtoken == undefined) {
      window.location.href = "index.html";
      return false;
    }
    $scope.fromdate = $("#startDate").val();
    $scope.todate = $("#endDate").val();

    $("#loading").css("display", "inline-grid");
    $http({
      url:
        baseUrl +
        "/betsHistory?from=" +
        $scope.fromdate +
        "&to=" +
        $scope.todate +
        "&type=" +
        $scope.betStatus,
      method: "GET",
      headers: {
        Authorization: authtoken,
      },
    }).then(
      function mySuccess(response) {
        if (response.data.errorCode === 0) {
          $scope.getBetHistoryList = response.data.result.map((bet) => {
            bet.liab =
              bet.betType === "lay" ? (+bet.odds - 1) * +bet.stake : bet.stake;
            bet.prof =
              bet.betType === "back" ? (+bet.odds - 1) * +bet.stake : bet.stake;

            return bet;
          });
          $scope.getBetHistoryListHolder = response.data.result;
          $scope.selectTab(0);
        } else {
          $scope.getBetHistoryList = [];
          $scope.getBetHistoryListHolder = [];
        }
        $("#loading").css("display", "none");
      },
      function myError(response) {
        if (response.status == 401) {
          $window.location.href = "index.html";
        }
      }
    );
  };
  $scope.getBetHistory();

  $scope.betDetails = function (betId) {
    if ($("#bet_" + betId).css("display") == "none") {
      $("#bet_" + betId).css("display", "table-row");
      $("#" + betId).removeAttr("class", "expand-close");
      $("#" + betId).attr("class", "expand-open");
    } else {
      $("#bet_" + betId).css("display", "none");
      $("#" + betId).removeAttr("class", "expand-open");
      $("#" + betId).attr("class", "expand-close");
    }
  };

  $scope.selectedTab = 0;
  $scope.selectTab = function(tabIndex) {
    $scope.currentPage = 0;
    $scope.selectedTab = tabIndex;
    if ($scope.selectedTab === 0) {
      $scope.getBetHistoryList = $scope.getBetHistoryListHolder.filter((bet) => {
        return !!!bet.round
      })
    } else {
      $scope.getBetHistoryList = $scope.getBetHistoryListHolder.filter((bet) => {
        return !!bet.round
      })
    }
    $scope.total = $scope.getBetHistoryList.reduce((acc, c) => {
      return (acc += +c.PL);
    }, 0);
  }
});
app.controller("profitLossController", function ($scope, $http, $cookieStore) {

  
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.getProfitLossList = [];
  $scope.numberOfPages = function () {
    return Math.ceil($scope.getProfitLossList.length / $scope.pageSize);
  };
  
  $scope.prev = function () {
    $scope.currentPage = $scope.currentPage - 1;
  };

  $scope.next = function () {
    $scope.currentPage = $scope.currentPage + 1;
  };
  var days = 7; // Days you want to subtract
  var date = new Date();
  var last = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
  $scope.date = last;
  $scope.fromdate =
    $scope.date.getFullYear() +
    "-" +
    ($scope.date.getMonth() + 1) +
    "-" +
    $scope.date.getDate() +
    " 00:00:00";
  $scope.todate =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    date.getDate() +
    " 23:59:00";
  $("#startDate").val($scope.fromdate);
  $("#endDate").val($scope.todate);

  //  $scope.date = new Date();
  //  $scope.fromdate=$scope.date.getFullYear()+"-"+($scope.date.getMonth()+1)+"-"+$scope.date.getDate();
  //  $scope.todate=$scope.date.getFullYear()+"-"+($scope.date.getMonth()+1)+"-"+$scope.date.getDate();

  //  $scope.currentDate=$scope.date.getFullYear()+"-"+($scope.date.getMonth()+1)+"-"+$scope.date.getDate()+" "+$scope.date.getHours()+":"+$scope.date.getMinutes();

  //  $scope.startTime="00:00:00";
  //  $scope.endTime=$scope.date.getHours()+":"+$scope.date.getMinutes();

  // $('#startDate').val($scope.fromdate);
  // $('#endDate').val($scope.todate);
  // $('#startTime').val($scope.startTime)
  // $('#endTime').val($scope.endTime)

  $scope.getProfitLossDate = function (value) {
    if (value == "today") {
      $scope.date = new Date();
      $scope.fromdate =
        $scope.date.getFullYear() +
        "-" +
        ($scope.date.getMonth() + 1) +
        "-" +
        $scope.date.getDate() +
        " 00:00:00";
      $scope.todate =
        $scope.date.getFullYear() +
        "-" +
        ($scope.date.getMonth() + 1) +
        "-" +
        $scope.date.getDate() +
        " 23:59:00";

      // $scope.startTime="00:00:00";
      // $scope.endTime=$scope.date.getHours()+":"+$scope.date.getMinutes()+":"+$scope.date.getSeconds();

      $("#startDate").val($scope.fromdate);
      $("#endDate").val($scope.todate);
      // $('#startTime').val($scope.startTime)
      // $('#endTime').val($scope.endTime)
    } else if (value == "yesterday") {
      var days = 1; // Days you want to subtract
      var date = new Date();
      var last = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);

      $scope.date = last;
      $scope.fromdate =
        $scope.date.getFullYear() +
        "-" +
        ($scope.date.getMonth() + 1) +
        "-" +
        $scope.date.getDate() +
        " 00:00:00";
      $scope.todate =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " 23:59:00";

      // $scope.startTime="00:00:00";
      // $scope.endTime=$scope.date.getHours()+":"+$scope.date.getMinutes()+":"+$scope.date.getSeconds();

      $("#startDate").val($scope.fromdate);
      $("#endDate").val($scope.todate);
      // $('#startTime').val($scope.startTime)
      // $('#endTime').val($scope.endTime)
    }

    $scope.getProfitLoss();
  };

  $scope.getProfitLossListHolder = [];
  $scope.getProfitLoss = function () {
    if (authtoken == undefined) {
      window.location.href = "index.html";
      return false;
    }
    $scope.fromdate = $("#startDate").val();
    $scope.todate = $("#endDate").val();

    $("#loading").css("display", "inline-grid");
    $http({
      url:
        baseUrl +
        "/profitLoss?from=" +
        $scope.fromdate +
        "&to=" +
        $scope.todate,
      method: "GET",
      headers: {
        Authorization: authtoken,
      },
    }).then(
      function mySuccess(response) {
        if (response.data.errorCode === 0) {
          $scope.getProfitLossListHolder = response.data.result.map((pnl) => {
            var totalStakes = 0;
            var backTotal = 0;
            var layTotal = 0;
            var mktTotal = 0;

            pnl.bets.forEach((bet) => {
              totalStakes += +bet.stake;
              if (bet.betType === 'back' || bet.betType === 'yes') {
                backTotal += +bet.pl;
              } else if (bet.betType === 'lay' || bet.betType === 'no') {
                layTotal += +bet.pl;
              }
              mktTotal += +bet.pl;
            })
            pnl.totalStakes = totalStakes;
            pnl.backTotal = backTotal;
            pnl.layTotal = layTotal;
            pnl.mktTotal = mktTotal;
            // pnl.comm = comm;
            return pnl;
          }).sort(
            (a, b) => Date.parse(b.startTime) - Date.parse(a.startTime)
          );
          $scope.getProfitLossList = Object.assign([], $scope.getProfitLossListHolder);
          $scope.selectTab(0);
        } else {
          $scope.getProfitLossList = [];
        }
        $("#loading").css("display", "none");
      },
      function myError(response) {
        if (response.status == 401) {
          $window.location.href = "index.html";
        }
      }
    );
  };
  $scope.getProfitLoss();

  $scope.betDetails = function (index) {
    if ($("#pnl_" + index).css("display") == "none") {
      $("#pnl_" + index).css("display", "table-row");
      $("#pl_" + index).removeAttr("class", "expand-close");
      $("#pl_" + index).attr("class", "expand-open");
    } else {
      $("#pnl_" + index).css("display", "none");
      $("#pl_" + index).removeAttr("class", "expand-open");
      $("#pl_" + index).attr("class", "expand-close");
    }
  };

  $scope.selectedTab = 0;
  $scope.selectTab = function(tabIndex) {
    $scope.currentPage = 0;
    $scope.selectedTab = tabIndex;
    if ($scope.selectedTab === 0) {
      $scope.getProfitLossList = $scope.getProfitLossListHolder.filter((bet) => {
        return !!!bet.round
      })
    } else {
      $scope.getProfitLossList = $scope.getProfitLossListHolder.filter((bet) => {
        return !!bet.round
      })
    }
    $scope.total = $scope.getProfitLossList.reduce((acc, c) => {
      return (acc += +c.netPL);
    }, 0);
  }
});
app.controller(
  "loginHistoryController",
  function ($scope, $http, $cookieStore) {
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.ActivityDataList = [];
    $scope.numberOfPages = function () {
      return Math.ceil($scope.ActivityDataList.length / $scope.pageSize);
    };
    $scope.prev = function () {
      $scope.currentPage = $scope.currentPage - 1;
    };

    $scope.next = function () {
      $scope.currentPage = $scope.currentPage + 1;
    };

    $scope.loginStatusMap = {
      1: "Login Successful",
      2: "Logout",
      0: "Login Faled"
    };
    $scope.loading = true;
    $scope.getActivityLog = function () {
      if (authtoken == undefined) {
        window.location.href = "index.html";
        return false;
      }
      $("#loading").css("display", "inline-grid");
      $scope.loading = true;
      $http({
        url: baseUrl + "/logActivity",
        method: "GET",
        headers: {
          Authorization: authtoken,
        },
      }).then(
        function mySuccess(response) {
          // console.log(response);
          if (response.data.errorCode === 0) {
            $scope.ActivityDataList = response.data.result.sort(
              (a, b) => Date.parse(b.loginTime) - Date.parse(a.loginTime)
            );
            $scope.loading = false;
            $("#loading").css("display", "none");
          } else {
            $scope.ActivityDataList = [];
            $scope.loading = false;
            $("#loading").css("display", "none");
          }
        },
        function myError(response) {
          // console.log(response);
          // if (response.status==401) {
          //              $window.location.href = 'index.html';
          //          }
        }
      );
    };
    $scope.getActivityLog();
  }
);


// var checkStatus;

// var element = new Image();
// Object.defineProperty(element, 'id', {
//   get: function() {
//     checkStatus='on';
//     if (checkStatus === 'on') {
//       window.location.href = "https://google.com";
//     }
//     throw new Error("Dev tools checker");
//   }
// });

// requestAnimationFrame(function check() {
//   checkStatus = 'off';
//   console.dir(element);
//   requestAnimationFrame(check);
// });