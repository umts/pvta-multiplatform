angular.module('pvta.factories')

.factory('LatLong', function () {
  var latlong = [];
  return {
    push: function (lat, long) {
            var p = {lat: lat, long: long};
            latlong.push(p);
          },
    getAll: function () {
              if (latlong.length > 0) {
                var toReturn = latlong;
                latlong = [];
                return toReturn;
              }
              else {
                return null;
              }
            }
  };
});
