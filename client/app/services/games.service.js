app.factory("gamesService", [
  "$http",
  "$q",
  function ($http, $q) {
    let gamesService = {};

    gamesService.activatedHorseGames = function() {
      // return this.httpClient.get(`${this.baseUrl}/listHorseRaces`);
      return $http({
        url: baseUrl + "/listHorseRaces",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authtoken
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
  
    gamesService.activatedGreyhoundGames = function() {
      // return this.httpClient.get(`${this.baseUrl}/listGreyhoundRaces`);
      return $http({
        url: baseUrl + "/listGreyhoundRaces",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authtoken
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

    gamesService.horseRacingGamesToday = function () {
      let req;
      if (authtoken != null && authtoken != undefined) {
        req = $http({
          url: raceUrl + "/listMeetings/today/7",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: authtoken
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
    };

    gamesService.greyhoundGamesToday = function () {
      let req;
      if (authtoken != null && authtoken != undefined) {
        req = $http({
          url: raceUrl + "/listMeetings/today/4339",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: authtoken
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
    };

    gamesService.horseRacingGamesTomorrow = function () {
      let req;
      if (authtoken != null && authtoken != undefined) {
        req = $http({
          url: raceUrl + "/listMeetings/tomorrow/7",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: authtoken
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
    };

    gamesService.greyhoundGamesTomorrow = function () {
      let req;
      if (authtoken != null && authtoken != undefined) {
        req = $http({
          url: raceUrl + "/listMeetings/tomorrow/4339",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: authtoken
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
    };

    gamesService.greyhoundGamesTomorrow = function () {
      let req;
      if (authtoken != null && authtoken != undefined) {
        req = $http({
          url: raceUrl + "/listMeetings/tomorrow/4339",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: authtoken
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
    };

    gamesService.marketDescription = function (marketId) {
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
    };

    gamesService.iplWinner = function() {
      return $http({
        url: baseUrl + "/iplWinner",
        method: 'GET'
      }).then(
        function success(data) {
          return data;
        },
        function error(err) {
          return $q.reject(err);
        }
      )
    }

    return gamesService;
  },
]);
