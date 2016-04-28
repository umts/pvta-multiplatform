angular.module('pvta.factories')

.factory('StopList', function () {
  var stopsList = [];

  var pushEntireList = function (list) {
    stopsList = stopsList.concat(_.uniq(list, true, 'Name'));
    return stopsList;
  };

  var getEntireList = function () {
    if ( stopsList !== undefined) {
      return stopsList;
    }
    else {
      return 0;
    }
  };

  var isEmpty = function () {
    if (stopsList.length === 0) {
      return true;
    }
    else {
      return false;
    }
  };

  return {
    pushEntireList: pushEntireList,
    getEntireList: getEntireList,
    isEmpty: isEmpty,
  };
});
