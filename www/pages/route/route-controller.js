angular.module('pvta.controllers').controller('RouteController', function($scope, $state, $stateParams, $ionicLoading, Route, RouteVehicles, FavoriteRoutes, Messages){
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
      $ionicLoading.hide();
      $scope.messages = filteredMessages;
    });
  });
  $scope.route = route;
  $scope.stops = [];

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
  };

  $scope.$on('$ionicView.enter', function(){
    getHeart();
  });
  $scope.timeline = [{
    date: new Date(),
    title: "I am here",
    author: "Ludo Anderson",
    profilePicture: "https://upload.wikimedia.org/wikipedia/en/7/70/Shawn_Tok_Profile.jpg",
    text: "Lorem ipsum dolor sit amet",
    type: "location"

  }, {
    date: new Date(),
    title: "For my friends",
    author: "Sara Orwell",
    profilePicture: "https://lh5.googleusercontent.com/-ZadaXoUTBfs/AAAAAAAAAAI/AAAAAAAAAGA/19US52OmBqc/photo.jpg",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    type: "text"

  }, {
    date: new Date(),
    title: "Look at my video!",
    author: "Miranda Smith",
    profilePicture: "https://static.licdn.com/scds/common/u/images/apps/plato/home/photo_profile_headshot_200x200_v2.jpg",
    text: "Lorem ipsum dolor sit amet",
    type: "video"

  }, {
    date: new Date(),
    title: "Awesome picture",
    author: "John Mybeweeg",
    profilePicture: "http://www.lawyersweekly.com.au/images/LW_Media_Library/LW-602-p24-partner-profile.jpg",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    type: "picture"
  }]
})

.controller('IconsCtrl', function($scope) {
  $scope.timeline = [{
    date: new Date(),
    title: "Awesome picture",
    author: "John Mybeweeg",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    type: "picture"
  }, {
    date: new Date(),
    title: "Look at my video!",
    author: "Miranda Smith",
    text: "Lorem ipsum dolor sit amet",
    type: "video"

  }, {
    date: new Date(),
    title: "I am here",
    author: "Ludo Anderson",
    text: "Lorem ipsum dolor sit amet",
    type: "location"

  }, {
    date: new Date(),
    title: "For my friends",
    author: "Sara Orwell",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    type: "text"

  }]
});
