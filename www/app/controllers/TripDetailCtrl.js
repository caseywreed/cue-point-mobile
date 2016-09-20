"use strict";

app.controller("TripDetailCtrl", function ($scope, $routeParams, DiscogsFactory) {

    $scope.tripDisplay = []

    $scope.tripDetailInit = () => {
        DiscogsFactory.getTripFromFirebaseByTripId($routeParams.tripId)
        .then(function (data) {
           $scope.setTripsForDisplay(data)
        })
    }

    $scope.setTripsForDisplay = (data) => {
        let key = Object.keys(data.data)
        console.log("key", key)
        $scope.tripDisplay.push(data.data[key])
        console.log("tripDisplay", $scope.tripDisplay)
    }

})