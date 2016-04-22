angular.module('pvta.factories')

.factory('KML', function () {
  var kml = [];
  function push (shortName) {
    kml.push(shortName);
  }

  function pop () {
    if (kml.length === 1) {
      return kml.pop();
    }
    else {
      // Empty the array,
      // because anything else
      // will produce undesired
      // activity in MapController
      kml = [];
      return null;
    }
  }

  return {
    push: push,
    pop: pop,
    kml: kml
  };
});
