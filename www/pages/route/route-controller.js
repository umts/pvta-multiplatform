angular.module('pvta.controllers').controller('RouteController', function($scope, $state, $stateParams, $ionicLoading, Route, RouteVehicles, FavoriteRoutes, Messages, $location, $ionicScrollDelegate){
  ga('set', 'page', '/route.html');
  ga('send', 'pageview');

  /*
  * Called when the user performs a pull-to-refresh.  Only downloads
  * vehicle data instead of all route data.
  */
  function getVehicles (){
    $scope.vehicles = RouteVehicles.query({id: $stateParams.routeId}, function () {
    $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $ionicLoading.show();
  Route.get({routeId: $stateParams.routeId}, function(route) {
    $scope.route = route
    getHeart();
    $scope.stops = $scope.route.Stops;
    $scope.vehicles = $scope.route.Vehicles;

    // Need route to be defined before we can filter messages
    var messages = Messages.query(function(){
      var filteredMessages = [];
      for(var message of messages){
        if(message.Routes.indexOf($scope.route.RouteId) === -1) { continue; }
        filteredMessages.push(message);
      }
      $ionicLoading.hide();
      $scope.messages = filteredMessages;
    });
  });
  $scope.stops = [];

  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
      $location.hash('like');
      $ionicScrollDelegate.anchorScroll(true);
    } else {
      $scope.shownGroup = group;
      console.log(group);
      $location.hash($scope.dropdownId);
      $ionicScrollDelegate.anchorScroll(true);
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
    FavoriteRoutes.contains($scope.route, function(bool){
      $scope.liked = bool;
    });
  };

  $scope.refresh = function(){
    getVehicles();
  };

  $scope.$on('$ionicView.enter', function(){
    getHeart();
    $scope.dropdownId = Math.random()
  });
});
