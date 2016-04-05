angular.module('pvta.controllers').controller('RouteController', function($scope, $state, $stateParams, Route, RouteVehicles, FavoriteRoutes, Messages, KML, $location, LatLong, Map){

  var size = 0;

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

  $scope.setKML = function(){
    KML.push(route.ShortName);
    _.each($scope.vehicles, function(vehicle){
      LatLong.push(vehicle.Latitude, vehicle.Longitude);
    });
    $location.path('/app/map/route');
  };

  $scope.refresh = function(){
    getVehicles();
    $scope.$broadcast('scroll.refreshComplete');
  };

  var size = 0;

  var bounds;

  function initMap () {
    bounds = new google.maps.LatLngBounds();
    var mapOptions = {
      center: bounds.getCenter(),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    Map.init($scope.map, bounds);
  }
  initMap();

  function redrawMap () {
    addKML(route.ShortName);
    mapVehicles($scope.vehicles);
  }
  var getVehicles = function(){
    $scope.vehicles = RouteVehicles.query({id: $stateParams.routeId}, function(){
      mapVehicles($scope.vehicles);
      addKML(route.ShortName);
    });
  };

  function addKML (shortName) {
    var toAdd = 'http://bustracker.pvta.com/infopoint/Resources/Traces/route' + shortName + '.kml';
    var georssLayer = new google.maps.KmlLayer({
      url: toAdd
    });
    georssLayer.setMap($scope.map);
  }


  function mapVehicles(vehicles){
    _.each(vehicles, function(vehicle){
      var loc = new google.maps.LatLng(vehicle.Latitude, vehicle.Longitude);
      Map.addMapListener(Map.placeDesiredMarker(loc, 'http://www.google.com/mapfiles/kml/paddle/go.png'), 'Here is your bus');
    });
  }

  $scope.$on('$ionicView.enter', function(){
    getHeart();
    getVehicles();
    mapVehicles();
    addKML(route.ShortName);
  });
});
