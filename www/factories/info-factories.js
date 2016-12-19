angular.module('pvta')

.factory('Info', function ($ionicPopup) {

  // Checks to see if this browser has used the app before.
  // If not, it displays a popup giving some first-use help.
  // If it has, we check to see which version of the app
  // was most recently used, and show them update popups accordingly.
  function showPopups () {
    // @TODO enter the key that's stored for determining
    // whether your popup has been seen in this array
    var popupKeys = [
      'plan-trip-update'
    ];
    localforage.getItem('returningUser', function (err, returningUser) {
      // If the user has used PVTrack before, show them any
      // other popups that they might need to see
      if (returningUser === true) {
        // @TODO Add a function to show your popup here!
        showPlanTripUpdatePopup();
      }
      else {
        // If they're a new user
        $ionicPopup.alert({
          title: 'Welcome to PVTrAck!',
          template: '<p aria-live="assertive">This is My Buses, where your favorite routes and stops live for easy access.<br>Head to Routes and Stops to see where your bus is right now, or visit Schedule to plan your future bus trips!</p>'
        });
        localforage.setItem('returningUser', true);
        // Since this is a new user, we don't want them
        // to start seeing all of the popups for past updates.
        for (var i = 0; i < popupKeys.length; i++) {
          var key = popupKeys[i];
          localforage.setItem(key, true);
        }
      }
    });
  }
  /**
   * This function essentially checks for "pending migrations"
   * to our localforage schema, and runs them if necessary.
   * You should add to it whenever a localforage data change/update
   * would result in any negative impact on users.
   *
   * Your migration's goal is to make the schema update as
   * painless as possible for our users.
   */
  function performMigrations () {
    /* Each migration has a 'key,' and we must first check to see
     * if that key has already been saved for the current user.
     * If it exists, the user has already run the migration.
     */
    localforage.getItem('schema-11-7-2016_longname_and_stopname_cutoff_fix', function (err, schemaUpdateExists) {
      // If the key isn't found, that means we need to run the migration.
      if (schemaUpdateExists !== true) {
        // This migration simply empties the entire cache. Bye!
        localforage.clear();
        // Save the migration key.  The next time this function is run,
        // we won't ever enter this if block.
        localforage.setItem('schema-11-7-2016_longname_and_stopname_cutoff_fix', true);
      }
    });
  }

  /**
   * If the user hasn't used the app since plan-trip received
   * an overhaul, inform them about it!
   */
  function showPlanTripUpdatePopup () {
    // 'plan-trip-update' will default to a falsy until we
    // explicitly set it to true
    localforage.getItem('plan-trip-update', function (err, updatedPlanTrip) {
      // If they haven't seen the popup, show it.
      if (!updatedPlanTrip) {
        $ionicPopup.alert({
          title: 'Plan Trip is now Schedule!',
          template: 'We\'ve made it even easier to search the bus schedules.<br>Go check it out!'
        });
        // Update storage to indicate the popup has been presented
        localforage.setItem('plan-trip-update', true);
      }
    });
  }


  return {
    versionNum: '1.0.0',
    versionName: 'Initial Public Release!',
    performMigrations: performMigrations,
    showPopups: showPopups
  };
});
