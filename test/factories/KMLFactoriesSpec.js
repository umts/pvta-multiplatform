describe('KMLFactories', function () {
  var KML;
  beforeEach(function () {
    module('pvta');
    inject(function (_KML_) {
      KML = _KML_;
    });
  });
  it('exists', function () {
    expect(KML).toBeDefined();
  });
  describe('KML.push()', function () {
    it('adds to kml array when push is called', function () {
      KML.push('30');
      expect(KML.kml.length).toEqual(1);
      expect(KML.kml).toEqual(['30']);
    });
  });
  describe('KML.pop()', function () {
    beforeEach(function() {
      KML.push('30');
    });
    it('returns null when the holding array has more than one entry', function () {
      KML.push('31');
      var kml = KML.pop();
      expect(kml).toEqual(null);
    });
    it('removes the 0th index of the array when called', function() {
      var oneLess = KML.pop();
      expect(oneLess).toEqual('30');
    });
  });
});
