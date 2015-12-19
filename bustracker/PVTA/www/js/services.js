angular.module('starter.services', ['ngResource'])

.service('detailsService', function(){
  var detail = {};
  var add = function(item){
    detail = item;
  };
  var get = function(){
    return detail;
  };
  return{
    add: add,
    get: get
  };
});
/*
.factory('Playlist', function ($resource) {
  return $resource('http://localhost:5000/Playlists/:playlistId');
});*/
