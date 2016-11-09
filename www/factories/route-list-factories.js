angular.module('pvta.factories')

.factory('RouteList', function () {
  var routesList = [];

  var pushEntireList = function (list) {
    // only store the route attributes we need
    routesList = _.map(list, function (route) {
      return _.pick(route, 'RouteAbbreviation', 'GoogleDescription', 'ShortName', 'Color', 'RouteId');
    });
    // sort routes by their number
    var routeNumber = /\d{1,2}/;
    routesList = _.sortBy(routesList, function (route) {
      matches = route.ShortName.match(routeNumber);
      return Number(_.first(matches));
    });
    return routesList;
  };

  var isEmpty = function () {
    if (routesList.length === 0) {
      return true;
    }
    else {
      return false;
    }
  };

  var getEntireList = function () {
    if (!isEmpty()) {
      return routesList;
    }
    else {
      return 0;
    }
  };

  return {
    pushEntireList: pushEntireList,
    getEntireList: getEntireList,
    isEmpty: isEmpty
  };
});
