if (
  /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
    navigator.userAgent
  ) ||
  /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
    navigator.userAgent.substr(0, 4)
  )
) {
  var context = "Mobile";
} else {
  context = "Web";
}
var authtoken = $.cookie("authtokenmobile");
var token;
var baseUrl = "http://136.244.79.114:82";

var app = angular.module("accountApp", ["ngCookies", "ngRoute"]);

app.config([
  "$routeProvider",
  function ($routeProvider) {
    $routeProvider

      .when("/", {
        controller: "profileController",

        templateUrl: "accnt_view/profile.html",
        data: {
          title: "AccountInfo",
        },
      })

      .when("/profile", {
        controller: "profileController",

        templateUrl: "accnt_view/profile.html",
        data: {
          title: "AccountInfo",
        },
      })

      .when("/bal_overview", {
        controller: "bal_overviewController",

        templateUrl: "accnt_view/bal_overview.html",
        data: {
          title: "AccountInfo",
        },
      })

      .when("/statement", {
        controller: "statementController",

        templateUrl: "accnt_view/statement.html",
        data: {
          title: "AccountStatement",
        },
      })

      .when("/casinoreport", {
        controller: "casinoreport",
        templateUrl: "accnt_view/casinoreport.html",
        data: {
          title: "casinoreport",
        },
      })

      .when("/current_bets", {
        controller: "current_betsController",

        templateUrl: "accnt_view/current_bets.html",
        data: {
          title: "Mybets",
        },
      })

      .when("/bet_history", {
        controller: "bet_historyController",

        templateUrl: "accnt_view/bet_history.html",
        data: {
          title: "BetsHistory",
        },
      })

      .when("/pnl", {
        controller: "profitLossController",

        templateUrl: "accnt_view/pnl.html",
        data: {
          title: "ProfitLoss",
        },
      })

      .when("/activity_log", {
        controller: "activity_logController",

        templateUrl: "accnt_view/activity_log.html",
        data: {
          title: "Activitylog",
        },
      });
  },
]);

app.directive("disableRightClick", function () {
  return {
    restrict: "A",

    link: function (scope, element, attr) {
      element.bind("contextmenu", function (e) {
        e.preventDefault();
      });
    },
  };
});

app.filter("oddDecimal", function () {
  return function (value) {
    if (value == "" || value == null) {
      return "";
    } else {
      return parseFloat(value) > 19.5
        ? parseFloat(value).toFixed(0)
        : parseFloat(value) > 9.5
        ? parseFloat(value).toFixed(1)
        : parseFloat(value).toFixed(2);
    }
  };
});

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
          alert(res.data.errorDescription);
          if (token) {
            alert(res.data.errorDescription);
            window.location.href = "index.html";
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

app.controller("profileController", function ($scope, $http, $rootScope) {
  $rootScope.$on("$routeChangeSuccess", function (event, current, previous) {
    $rootScope.title = current.$$route.data.title;
  });

  $rootScope.isMenuOpen = false;
  $rootScope.toggleDropdown = function (state) {
    $rootScope.isMenuOpen = state;
  };

  $rootScope.opencloseMenu = function () {
    $rootScope.openClose = !$rootScope.openClose;
  };

  var currentUser = $.cookie("current_client_mobile");
  if (currentUser) {
    $rootScope.currentUser = JSON.parse(currentUser);
  }

  $rootScope.currentDate = new Date();
  $rootScope.currencyCode = 'INR';
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
});

app.controller("statementController", function ($scope, $http) {
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.accountdataList = [];
  $scope.numberOfPages = function () {
    return Math.ceil($scope.accountdataList.length / $scope.pageSize);
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
});

app.controller("casinoreport", function ($scope, $http) {
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
});

app.controller("bal_overviewController", function ($scope, $http) {
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.getBalancesdataList = [];
  $scope.numberOfPages = function () {
    return Math.ceil($scope.getBalancesdataList.length / $scope.pageSize);
  };

  $scope.prev = function () {
    $scope.currentPage = $scope.currentPage - 1;
  };

  $scope.next = function () {
    $scope.currentPage = $scope.currentPage + 1;
  };
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
        $scope.availBal = response.data.result[0].balance;
      },
      function myError(error) {
        if (error.status == 401) {
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
});

app.controller("current_betsController", function ($scope, $http) {
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
          $scope.matchedbetsList = response.data.result.map((bet) => {
            bet.odds = bet.odds.replace(/:/, "/");
            return bet;
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
    } else {
      $scope.matchedbetsList = $scope.matchedbetsListHolder.filter((bet) => {
        return !!bet.round
      })
    }
    $scope.total = $scope.matchedbetsList.reduce((acc, c) => {
      return (acc += +c.PL);
    }, 0);
  }
});

app.controller("bet_historyController", function ($scope, $http) {
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
          $scope.getBetHistoryListHolder = response.data.result;
          $scope.getBetHistoryList = response.data.result.map((bet) => {
            bet.liab =
              bet.betType === "lay" ? (+bet.odds - 1) * +bet.stake : bet.stake;
            bet.prof =
              bet.betType === "back" ? (+bet.odds - 1) * +bet.stake : bet.stake;

            return bet;
          });
        }
        $scope.getBetHistoryList = response.data.result;
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

app.controller("profitLossController", function ($scope, $http) {
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
            var comm = 0;
            var mktTotal = 0;

            pnl.bets.forEach((bet) => {
              totalStakes += +bet.stake;
              if (bet.betType === "back") {
                backTotal += +bet.pl;
              } else if (bet.betType === "lay") {
                layTotal += +bet.pl;
              }
              // comm += +bet.pl > 0 ? +bet.pl * (+pnl.commission / 100) : 0;
              mktTotal += +bet.pl;
            });
            pnl.totalStakes = totalStakes;
            pnl.backTotal = backTotal;
            pnl.layTotal = layTotal;
            pnl.mktTotal = mktTotal;
            pnl.comm = comm;
            return pnl;
          });
          
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

app.controller("activity_logController", function ($scope, $http) {
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
    0: "Login Failed"
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
});

// var checkStatus;

// var element = new Image();
// Object.defineProperty(element, "id", {
//   get: function () {
//     checkStatus = "on";
//     if (checkStatus === "on") {
//       window.location.href = "https://google.com";
//     }
//     throw new Error("Dev tools checker");
//   },
// });

// requestAnimationFrame(function check() {
//   checkStatus = "off";
//   console.dir(element);
//   requestAnimationFrame(check);
// });
