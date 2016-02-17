angular.module('pvta.controllers').controller('PlanTripController', function($scope, $cordovaGeolocation, $cordovaDatePicker){
        var options = {timeout: 10000, enableHighAccuracy: true};

        $scope.map = null;

        $cordovaGeolocation.getCurrentPosition(options).then(function(position) {

                var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                constructMap(latLng);
        }, function(error) {
                console.log("Error reading current position");
                var latLng = new google.maps.LatLng(42.3918143,-72.5291417);//Coords for UMass Campus Center
                constructMap(latLng);
        });

        function constructMap(latLng) {
                var mapOptions = {
                        center: latLng,
                        zoom: 15,
                        mapTypeControl: false,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                }

                $scope.map = new google.maps.Map(document.getElementById("directions-map"), mapOptions);

                var originPlaceId = null;
                var destinationPlaceId = null;

                var directionsService = new google.maps.DirectionsService;
                var directionsDisplay = new google.maps.DirectionsRenderer;


                directionsDisplay.setMap($scope.map);

                var origin_input = document.getElementById("origin-input");
                var destination_input = document.getElementById("destination-input");

                //$scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
                //$scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);

                var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
                //origin_autocomplete.bindTo("bounds", $scope.map);
                var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
                //destination_autocomplete.bindTo("bounds", $scope.map);

                origin_autocomplete.addListener('place_changed', function() {
                        var place = origin_autocomplete.getPlace();
                        if (!place.geometry) {
                                console.log("Place has no geometry.");
                                return;
                        }

                        expandViewportToFitPlace($scope.map, place);
                        originPlaceId = place.place_id;
                        route(originPlaceId, destinationPlaceId, directionsService, directionsDisplay);
                });

                destination_autocomplete.addListener('place_changed', function() {
                        var place = destination_autocomplete.getPlace();
                        if (!place.geometry) {
                                console.log("Place has no geometry.");
                                return;
                        }

                        expandViewportToFitPlace($scope.map, place);
                        destinationPlaceId = place.place_id;
                        route(originPlaceId, destinationPlaceId, directionsService, directionsDisplay);
                });
        }


        function expandViewportToFitPlace(map, place) {
                if (place.geometry.viewpoint) {
                        map.fitBounds(place.geometry.viewpoint);
                } else {
                        map.setCenter(place.geometry.location);
                        map.setZoom(17);
                }
        }


        function route(originPlaceId, destinationPlaceId, directionsService, directionsDisplay) {
                if (!originPlaceId || !destinationPlaceId)
                        return;
                directionsService.route({
                        origin: {"placeId": originPlaceId},
                        destination: {"placeId": destinationPlaceId},
                        travelMode: google.maps.TravelMode.TRANSIT,
                        //transitMode: google.maps.TransitMode.BUS
                }, function(response, status){
                        if (status === google.maps.DirectionsStatus.OK){
                                directionsDisplay.setDirections(response);
                                console.log(response);
                                for (var step=0; step<response.routes[0].legs[0].steps.length; step++) {
                                    console.log(response.routes[0].legs[0].steps[step]['instructions']);
                                }
                        }
                        else
                        console.log("Directions request failed due to " + status);
                });
        }


})
