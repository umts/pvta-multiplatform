angular.module('pvta.factories')

.factory('Helper', function ($state) {

  function redirectToStop (stopId) {
    $state.go('app.stop', {stopId: stopId});
  }

  function redirectToRoute (routeId) {
    $state.go('app.route', {routeId: routeId});
  }
  /**
   * Given a Departure object,
   * calculates the human-readable departure times
   * that will be displayed in the UI.
   * Returns an object with 5 properties,
   * each a different way of displaying
   * either a scheduled time ('s') or an estimated time ('e').
   */
  function calculateTimes (departure) {
    return {
      // ex: '8:12 PM'
      sExact: moment(departure.SDT).format('LT'),
      eExact: moment(departure.EDT).format('LT'),
      // ex: 'in 6 minutes'
      sRelative: moment(departure.SDT).fromNow(),
      eRelative: moment(departure.EDT).fromNow(),
      // ex: '6 minutes'
      eRelativeNoPrefix: moment(departure.EDT).fromNow(true)
    };
  }
/**
  * Given all the RouteDirections and their upcoming departures
  * at this stop, this function organizes and manipulates
  * all departures so they can be clearly and simply displayed in the UI.
  * It sorts departures in two ways:
  *   1) By Route Direction
  *   2) By Time
  *
  * @param directions: Array - An array of RouteDirections that contain
  *           all the StopDepartures available for some Stop.
  * @return Object - An object containing 2 properties: the RouteDirections
  *           sorted by RouteId (1), and the same RouteDirections sorted
  *           by estimated departure time (2).
  */

  function sortStopDepartures (directions) {
    var departuresByDirection = [];
    var departuresByTime = [];
    // Avail returns an array of RouteDirections. We must deal
    // with the Departures for each Direction.
    _.each(directions, function (direction) {
      if (direction.Departures && direction.Departures.length != 0 && !direction.IsDone) {
        // Sorting Departures by Direction requires us to
        // maintain a tmp array of valid departures for a
        // given direction.
        var futureDepartures = [];
        // For each Departure for a given RouteDirection...
        _.each(direction.Departures, function (departure) {
          // A departure is invalid if it was in the past
          if (!moment(departure.EDT).isAfter(Date.now())) {
            return;
          }
          /* Manipuate the departure object.
           * When sorting by Direction, we only need to
           * obtain the stringified departure times
           * and save the departure to futureDepartures.

           * When sorting by Time, pull out only the
           * necessary details from the Departures
           * and hold onto them.
           */
          else {
            // Departures by time: we can use a stripped down
            // version of the RouteDirection, because each
            // departure will be its own entry in the list.
            var lightweightDirection = {RouteId: direction.RouteId};
            var times = calculateTimes(departure);
            departure.Times = times;
            lightweightDirection.Times = times;
            // Departures by time: marry this departure with its RouteId;
            // that's all it needs.
            lightweightDirection.Departures = departure;
            // Departures by RouteDirection: this is a valid departure,
            // so add it to the array.
            futureDepartures.push(departure);
            departuresByTime.push(lightweightDirection);
          }
        });
        /* Departures by RouteDirection: now that we
         * have all the valid departures for a given direction,
         * overwrite the RouteDirection's old departures array.
         */
        direction.Departures = futureDepartures;
        if (direction.Departures.length > 0) {
          departuresByDirection.push(direction);
        }
      }
    });
    // Departures by time: Sort the list of all
    // departures by Estimated Departure Time.
    departuresByTime = _.sortBy(departuresByTime, function (direction) {
      return direction.Departures.EDT;
    });
    return {
      ByRouteDirection: departuresByDirection,
      ByTime: departuresByTime
    };
  }

  return {
    redirectToStop: redirectToStop,
    redirectToRoute: redirectToRoute,
    sortStopDepartures: sortStopDepartures
  };
});

angular.module('pvta.factories')

.factory('Toast', function ($cordovaToast, $ionicLoading, $interval) {
  // Shows a toast.
  // @param: duration - int. Can be 900, 2000, 3000, or 4000 due to a restriction in the
  // Cordova plugin.  Values are in milliseconds.
  function show (msg, duration) {
    if ((duration !== 900) && (duration !== 2000) && (duration !== 3000) && (duration !== 4000)) {
      console.error('Toast.show() received an invalid parameter of ' + duration);
      duration = 3000;
    }
    if (!ionic.Platform.is('browser')) {
      $interval(function () {
        $cordovaToast.show(msg, duration, 'bottom');
      }, 500, 1);
    }
    else {
      $ionicLoading.hide();
      $interval(function () {
        $ionicLoading.show({
          template: msg,
          noBackdrop: true,
          duration: duration
        });
      }, 500, 1);
    }
  }
  function showStorageError () {
    show('Can\'t access device storage. Ensure you\'re not in private browsing and that you allow us to store data.', 4000);
  }

  return {
    show: show,
    showStorageError: showStorageError
  };
});
