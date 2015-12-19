angular.module('starter.services', ['ngResource'])

.factory('Session', function ($resource, $http) {
    return $resource('http://localhost:5000/sessions/:sessionId');
});