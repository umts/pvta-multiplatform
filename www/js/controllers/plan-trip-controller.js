angular.module('pvta.controllers').controller('PlanTripController', function($scope, $cordovaGeolocation, $cordovaDatePicker){

        $scope.currentDate = new Date();
        document.getElementById("plan-trip-time").value
        console.log($scope.currentDate);
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


                var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
                var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);

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
                $scope.steps = [];
                $scope.step_links = [];
                if (!originPlaceId || !destinationPlaceId)
                        return;
                transitOptions = {
                        modes: [google.maps.TransitMode.BUS]
                };
                var thetime = document.getElementById("plan-trip-time").innerHTML;
                directionsService.route({
                        origin: {"placeId": originPlaceId},
                        destination: {"placeId": destinationPlaceId},
                        travelMode: google.maps.TravelMode.TRANSIT,
                        transitOptions: transitOptions
                }, function(response, status){
                        if (status === google.maps.DirectionsStatus.OK){
                                directionsDisplay.setDirections(response);
                                console.log(response);
                                route = response.routes[0].legs[0];
                                createStepList(response);
                                $scope.arrival_time = route['arrival_time']['text'];
                                $scope.departure_time = route['departure_time']['text'];
                                $scope.origin = route['start_address'];
                                $scope.destination = route['end_address'];
                                $scope.$apply();
                        }
                        else
                        console.log("Directions request failed due to " + status);
                });
        }

        function createStepList(response) {
                for (var i=0; i<response.routes[0].legs[0].steps.length; i++) {
                        var step = response.routes[0].legs[0].steps[i];

                        if (step['travel_mode'] === 'TRANSIT') {
                                var line_name;
                                if (step['transit']['line']['short_name'])
                                        line_name = step['transit']['line']['short_name'];
                                else
                                        line_name = step['transit']['line']['name'];
                                var depart_instruction = "Take "+step['transit']['line']['vehicle']['name']+" "+line_name+ " at " + step['transit']['departure_time']['text'] + ". " + step['instructions'];
                                var arrive_instruction = "Arrive at "+step['transit']['arrival_stop']['name'] + " " + step['transit']['arrival_time']['text'];
                                $scope.steps.push(depart_instruction);
                                $scope.steps.push(arrive_instruction);
                                if (step['transit']['line']['agencies'][0]['name'] === 'PVTA') {
                                        linkToStop(step['transit']['departure_stop']['name']);
                                        linkToStop(step['transit']['arrival_stop']['name']);
                                }
                                else {
                                        $scope.step_links.concat(['','']);
                                }


                        }
                        else {
                                $scope.steps.push(step['instructions']); 
                                $scope.step_links.push('');
                        }
                }
        }

        function linkToStop(stop) {
                stop = stop.split(" ");
                stop = stop[stop.length-1];
                stop = stop.substring(1, stop.length-1);
                $scope.step_links.push('#/app/stops/' + stop);

        }


})
