app.factory("NavigationServices", function ($http, $q) {
  var sportsData = {};

  return {
    getUserData: function () {
      return $http({
        url:
          "http://www.lcexchanges247.com/Read/BetClient.svc/Data/GetUserData",
        method: "GET",
        headers: {
          Authorization: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );  
    },
    iplWinner: function () {
      return $http({
        url: ApiUrl + "/iplWinner",
        method: "GET",
        headers: {
          Authorization: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );  
    },
    SportsList: function () {
      let req;
      if (token != null && token != undefined) {
        req = $http({
          url: ApiUrl + "/listGames",
          method: "GET",
          headers: {
            Authorization: token,
          },
        })
      } else {
        req = $http({
          url: ApiUrl + "/listGames",
          method: "GET",
        })
      }
      return req.then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },

    activatedHorseGames: function() {
      // return this.httpClient.get(`${this.baseUrl}/listHorseRaces`);
      return $http({
        url: ApiUrl + "/listHorseRaces",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
  
    activatedGreyhoundGames: function() {
      // return this.httpClient.get(`${this.baseUrl}/listGreyhoundRaces`);
      return $http({
        url: ApiUrl + "/listGreyhoundRaces",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },

    horseRacingGamesToday: function () {
      let req;
      if (token != null && token != undefined) {
        req = $http({
          url: raceUrl + "/listMeetings/today/7",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          },
        })
      } else {
        req = $http({
          url: raceUrl + "/listMeetings/today/7",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      }
      return req.then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },

    greyhoundGamesToday: function () {
      let req;
      if (token != null && token != undefined) {
        req =  $http({
          url: raceUrl + "/listMeetings/today/4339",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          },
        })
      } else {
        req = $http({
          url: raceUrl + "/listMeetings/today/4339",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      }
      return req.then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },

    horseRacingGamesTomorrow: function () {
      let req;
      if (token != null && token != undefined) {
        req = $http({
          url: raceUrl + "/listMeetings/tomorrow/7",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          },
        })
      } else {
        req = $http({
          url: raceUrl + "/listMeetings/tomorrow/7",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      }
      return req.then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },

    greyhoundGamesTomorrow: function () {
      let req;
      if (token != null && token != undefined) {
        req = $http({
          url: raceUrl + "/listMeetings/tomorrow/4339",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          },
        })
      } else {
        req = $http({
          url: raceUrl + "/listMeetings/tomorrow/4339",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      }
      return req.then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },

    marketDescription: function (marketId) {
      return $http({
        url: raceUrl + "/marketDescription/" + marketId,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    tournamentList: function (tourId) {
      return $http({
        url: ApiUrl + "Navigation/TournamentList?id=" + tourId,
        method: "GET",
        headers: {
          Token: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    matchList: function (sportId, tourId) {
      return $http({
        url:
          ApiUrl + "Navigation/MatchList?id=" + sportId + "&tourid=" + tourId,
        method: "GET",
        headers: {
          Token: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    marketList: function (matchId) {
      return $http({
        url: ApiUrl + "Navigation/MarketList?mtid=" + matchId,
        method: "GET",
        headers: {
          Token: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    highlights: function (sportId) {
      return $http({
        url: ApiUrl + "Data/Highlights?sid=" + sportId,
        method: "GET",
        headers: {
          Token: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    allSportsEvents: function () {
      return $http({
        url: ApiUrl + "Data/Highlights",
        method: "GET",
        headers: {
          Token: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    inplay: function () {
      return $http({
        url: ApiUrl + "Data/Inplay",
        method: "GET",
        headers: {
          Token: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    upComingEvents: function (t) {
      return $http({
        url: ApiUrl + "Data/UpcomingEvents?t=" + t,
        method: "GET",
        headers: {
          Token: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    addMultiMkt: function (marketId) {
      return $http({
        url: ApiUrl + "Data/AddMultiMkt?id=" + marketId,
        method: "POST",
        headers: {
          Token: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    removeMultiMkt: function (marketId) {
      return $http({
        url: ApiUrl + "Data/RemoveMultiMkt?id=" + marketId,
        method: "POST",
        headers: {
          Token: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    multiMarkets: function () {
      return $http({
        url: ApiUrl + "Data/MultiMarkets",
        method: "GET",
        headers: {
          Token: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    allMarket: function (matchId) {
      return $http({
        url: ApiUrl + "Data/AllMarket?id=" + matchId,
        method: "GET",
        headers: {
          Token: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    marketData: function (matchId, mktId) {
      return $http({
        url: ApiUrl + "Data/MktData?mtid=" + matchId + "&mktid=" + mktId,
        method: "GET",
        headers: {
          Token: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    fancyData: function (matchId) {
      return $http({
        url: ApiUrl + "Data/FancyData?mtid=" + matchId,
        method: "GET",
        headers: {
          Token: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    hubAddress: function (marketId) {
      return $http({
        url: ApiUrl + "Data/HubAddress?id=" + marketId,
        method: "GET",
        headers: {
          Token: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    placeMOBet: function (MOData) {
      return $http({
        url: betUrl + "Bets/PlaceMOBet3",
        method: "POST",
        data: MOData,
        headers: {
          Token: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    placeBets: function (MOData) {
      return $http({
        url: ApiUrl + "/placeBets",
        method: "POST",
        data: MOData,
        headers: {
          Authorization: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    placeBMBet: function (BMData) {
      return $http({
        url: ApiUrl + "/placeBets",
        method: "POST",
        data: BMData,
        headers: {
          Authorization: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    placeFancyBet: function (fancyData) {
      return $http({
        url: betUrl + "Bets/PlaceFancyBet2",
        method: "POST",
        data: fancyData,
        headers: {
          Token: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    PlaceTpBet: function (TPData) {
      return $http({
        url: ApiUrl + "/TPplaceBets",
        method: "POST",
        data: TPData,
        headers: {
          Authorization: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    exposureBook: function (marketId) {
      return $http({
        url: ApiUrl + "listBooks/" + marketId,
        method: "GET",
        headers: {
          Authorization: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    BMExposureBook: function (marketId) {
      return $http({
        url:
          ApiUrl + "/listBooks/" + marketId,
        method: "GET",
        headers: {
          Authorization: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    fancyExposure: function (matchId, fancyId) {
      return $http({
        url:
          ApiUrl + "/fancyExposure/" + matchId,
        method: "GET",
        headers: {
          Authorization: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    fancyBook: function (matchId, fancyId) {
      return $http({
        url: ApiUrl + "/listBooks/df_" + matchId + "_" + fancyId + ",",
        method: "GET",
        headers: {
          Authorization: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    getTPExposureBook: function(tableName, roundId, selectionId) {
      return $http({
        url: ApiUrl + "/listBooks/" + tableName + "/" + roundId + "/" + selectionId,
        method: "GET",
        headers: {
          Authorization: token,
        }
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      )
    },
    T20ExposureBook: function (gameid) {
      return $http({
        url: ApiUrl + "Bets/T20ExposureBook?gameid=" + gameid,
        method: "GET",
        headers: {
          Token: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    GetRecentGameResult: function (gametype) {
      return $http({
        url: ApiUrl + "Reports/GetRecentGameResult?gametype=" + gametype,
        method: "GET",
        headers: {
          Token: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    getAllBets: function () {
      return $http({
        url: ApiUrl + "/listBets",
        method: "GET",
        headers: {
          Authorization: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    editMOBet: function (eMOBet) {
      return $http({
        url: ApiUrl + "Bets/EditMOBet",
        method: "POST",
        data: eMOBet,
        headers: {
          Token: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    cancelBet: function (betId) {
      return $http({
        url: ApiUrl + "Bets/CancelBet?id=" + betId,
        method: "POST",
        headers: {
          Token: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    userDescription: function () {
      return $http({
        url: ApiUrl + "Data/UserDescription",
        method: "GET",
        headers: {
          Token: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    logout: function () {
      return $http({
        url: ApiUrl + "/logout",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
    ping: function () {
      $http({
        url: ApiUrl + "/ping",
        method: "GET",
        headers: {
          Authorization: token,
        },
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      );
    },
  };
});
