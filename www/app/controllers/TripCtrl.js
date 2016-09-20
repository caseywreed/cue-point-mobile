"use strict";

app.controller("TripCtrl", function ($scope, DiscogsFactory) {

    $scope.displayTrips = []

    $scope.tripCtrlInit = () => {
        console.log("TripCtrl running")
        DiscogsFactory.getTripsFromFirebase()
        .then(function (data) {
            $scope.displayTrips = data.data
            $scope.setDeleteKeys()
        })
    }

    $scope.deleteTripFromFirebase = (tripDeleteId) => {
        DiscogsFactory.deleteTripFromFirebaseByTripDeleteId(tripDeleteId)
        .then(function () {
            $scope.tripCtrlInit()
        })
    }

    $scope.setDeleteKeys = () => {
        console.log("$scope.displayTrips", $scope.displayTrips)
        for (let trip in $scope.displayTrips) {
            // let key = Object.keys(trip)[0]
            $scope.displayTrips[trip].tripDeleteId = trip
        }
        console.log("$scope.displayTrips", $scope.displayTrips)
    }

})