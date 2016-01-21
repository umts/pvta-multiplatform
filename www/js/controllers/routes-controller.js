angular.module('starter.controllers').controller('RoutesController', function($scope, $resource){
  $scope.routes = $resource('http://bustracker.pvta.com/infopoint/rest/routes/getvisibleroutes').query(function(){
    $scope.routes.sort(function(a, b){return a.ShortName - b.ShortName})
  });  
});
