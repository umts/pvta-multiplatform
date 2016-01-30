angular.module('pvta.controllers').controller('RouteController', function($scope, $stateParams, Route, RouteVehicles, FavoriteRoutes){
  var size = 0;
  var route = Route.get({routeId: $stateParams.routeId}, function() {
    route.$save();
    groups(route.Stops.length);
    getHeart();
  });
  $scope.route = route;
  $scope.groups = [];
  $scope.vehicles = RouteVehicles.query({routeId: $stateParams.routeId});
  $scope.groups.push(route);
    $scope.groups[0] = {
    //  name: 'stops',
      items: []
    };
  var j = $scope.size
  var groups = function(length){
    for (var j=0; j < length; j++) {
      $scope.groups[0].items.push(route.Stops[j]);
    }
  };
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };
  $scope.toggleHeart = function(liked){
  //  console.log(liked);
    var name = 'Route ' + route.ShortName + ' favorite';
    console.log(name);
      localforage.setItem(name, liked, function(err, value){
        if(value) {
          FavoriteRoutes.push(route);
          console.log('pushing a new fav route');
        }
        else {
          FavoriteRoutes.remove(route);
          console.log('removing ' + route.ShortName + " " + route.RouteId);
        }
    });
  };
  var getHeart = function(){
    var name = 'Route ' + route.ShortName + " favorite";
    localforage.getItem(name, function(err, value){
      $scope.liked = value;
    });
  };
});