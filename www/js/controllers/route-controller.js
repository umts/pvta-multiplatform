angular.module('pvta.controllers').controller('RouteController', function($scope, $stateParams, Route, RouteVehicles, FavoriteRoutes){
  var size = 0;
  var route = Route.get({routeId: $stateParams.routeId}, function() {
    route.$save();
    getHeart();
    $scope.stops = route.Stops;
    $scope.vehicles = route.Vehicles
  });
  $scope.route = route;
  $scope.stops = [];
  var j = $scope.size;
  
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
    var name = 'Route ' + route.ShortName + ' favorite';
      localforage.setItem(name, liked, function(err, value){
        if(value) {
          FavoriteRoutes.push(route);
        }
        else {
          FavoriteRoutes.remove(route);
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