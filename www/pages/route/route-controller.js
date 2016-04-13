angular.module('pvta.controllers').controller('RouteController', function($scope, $state, $stateParams, Route, RouteVehicles, FavoriteRoutes, Messages, KML){

  var getVehicles = function(){
    $scope.vehicles = RouteVehicles.query({id: $stateParams.routeId});
  };

  var route = Route.get({routeId: $stateParams.routeId}, function() {
    route.$save();
    getHeart();
    $scope.stops = route.Stops;
    $scope.vehicles = route.Vehicles;

    // Need route to be defined before we can filter messages
    var messages = Messages.query(function(){
      var filteredMessages = [];
      for(var message of messages){
        if(message.Routes.indexOf($scope.route.RouteId) === -1) { continue; }
        filteredMessages.push(message);
      }
      $scope.messages = filteredMessages;
    });
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
    FavoriteRoutes.contains(route, function(bool){
      if(bool) {
        FavoriteRoutes.remove(route);
      }
      else {
        FavoriteRoutes.push(route);
      }
    });
  };
  $scope.liked = false;
  var getHeart = function(){
    FavoriteRoutes.contains(route, function(bool){
      $scope.liked = bool;
    });
  };

  $scope.refresh = function(){
    getVehicles();
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.setKML = function(){
   KML.push(route.RouteTraceFilename);
   $state.go('app.route-map', {routeId: $stateParams.routeId});
  };

  $scope.$on('$ionicView.enter', function(){
    getHeart();
    getVehicles();
  });
});
