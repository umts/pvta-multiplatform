angular.module('pvta.controllers').controller('RouteController', function($scope, $stateParams, Route, RouteVehicles, FavoriteRoutes){
  var size = 0
  var route = Route.get({routeId: $stateParams.routeId}, function() {
    route.$save();
    groups(route.Stops.length);
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
  $scope.addToFavorites = function(){
   //console.log(JSON.stringify(route));
    FavoriteRoutes.push(route);
  }
});