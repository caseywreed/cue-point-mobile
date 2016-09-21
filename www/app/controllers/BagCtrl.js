"use strict";

app.controller("BagCtrl", function ($scope, $location, $q, DiscogsFactory, AuthFactory, $cordovaToast, YelpFactory) {

    $scope.bag = []
    $scope.bagDisplay = []
    $scope.transferedUserTokens = {}

    $scope.bagCtrlInit = () => {
        $scope.getBagFromDiscogsFactory()
        $scope.loadBagToBagDisplay()
        $scope.transferedUserTokens = AuthFactory.getTransferableUserTokens()
        YelpFactory.getCoordsFromPhone()
    }

    $scope.getBagFromDiscogsFactory = () => {
        $scope.bag = DiscogsFactory.getBag()
        console.log("$scope.bag", $scope.bag)
    }

    $scope.loadBagToBagDisplay = () => {
        $scope.bag.forEach(function (release) {
            DiscogsFactory.searchByReleaseUrl(release.resource_url)
            .then( function (data) {
                data.thumb = release.thumb
                $scope.bagDisplay.push(data)
            })
        })
        console.log("$scope.bagDisplay", $scope.bagDisplay)
    }

    $scope.pushBagToDiscogs = () => {
        $scope.pushNewTripsToDiscogs()
        .then( function () {
            return DiscogsFactory.addReleaseByNumberPromiseAll($scope.bagDisplay, $scope.transferedUserTokens)
        })
        .then(function () {
            $scope.bag = []
            DiscogsFactory.setBag($scope.bag)
            $location.url("/main")
            $cordovaToast.showShortCenter('Bag pushed to Discogs').then(function(success) {
            // success
            }, function (error) {
            // error
            });
        })
    }

    $scope.deleteReleaseFromBag = (release) => {
        let spliceIndex = $scope.bagDisplay.indexOf(release)
        $scope.bagDisplay.splice(spliceIndex, 1)
        $scope.bag = []
        $scope.bagDisplay.forEach(function (release) {
            let tempReleaseObj = {
                resource_url: release.resource_url,
                thumb: release.thumb
            }
            $scope.bag.push(tempReleaseObj)
        })
        console.log("$scope.bag in BagCtrl", $scope.bag)
        DiscogsFactory.setBag($scope.bag)
    }

    $scope.pushNewTripsToDiscogs = () => {
        let calDate = new Date()
        let timestamp = Date.now()
        let tripId = AuthFactory.getUid() + timestamp
        let tripObj = {
            "uid": AuthFactory.getUid(),
            "tripId": tripId,
            "timestamp": timestamp,
            "date": calDate.toString(),
            "purchasedItems": $scope.bagDisplay
        }
        console.log("trip object", tripObj)
        return DiscogsFactory.addTripToFirebase(tripObj)
    }

})