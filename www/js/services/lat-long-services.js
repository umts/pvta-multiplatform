angular.module('pvta.services')

.factory('LatLong', function(){
  var latlong = [];
  return {
    push: function(lat, long){
            var p = {lat, long};
            latlong.push(p);
          },
    getAll: function(){
              if(latlong.length > 0){
                var toReturn = latlong;
                latlong = [];
                return toReturn;
              }
              else {
                return null;
              }
            }
  };
})