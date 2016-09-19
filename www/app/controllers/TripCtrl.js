"use strict";

app.controller("TripCtrl", function ($scope, DiscogsFactory) {

    $scope.displayTrips = []

    $scope.tripCtrlInit = () => {
        console.log("TripCtrl running")
        DiscogsFactory.getTripsFromFirebase()
        .then(function (data) {
            console.log(data)
            $scope.displayTrips = data.data
        })
    }

    $scope.checkDate = (trip) => {
        console.log("trip formatted", trip.date.toDateString() )
    }

})