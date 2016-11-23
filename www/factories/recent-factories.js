angular.module('pvta.factories')

.factory('Recent', function (moment) {
  function recent (timestamp) {
    var now = moment();
    var diff = now.diff(timestamp, 'days');
    if (diff <= 1) {
      return true;
    }
    else {
      return false;
    }
  }

  return {
    recent: recent
  };
});
