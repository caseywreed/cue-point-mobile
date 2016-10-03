"use strict";

app.controller("BagCtrl", function ($scope, $location, $q, DiscogsFactory, AuthFactory, $cordovaToast, YelpFactory, $ionicTabsDelegate) {

    $scope.bag = []
    $scope.bagDisplay = []
    $scope.storeDisplay = null
    $scope.transferedUserTokens = {}

    $scope.bagCtrlInit = () => {
        $scope.getBagFromDiscogsFactory()
        $scope.loadBagToBagDisplay()
        $scope.transferedUserTokens = AuthFactory.getTransferableUserTokens()
        $scope.storeDisplay = YelpFactory.getUserLocation()
        if ($scope.storeDisplay == null) {
            YelpFactory.getCoordsFromPhone()
            .then(function (data) {
                console.log("data in bag display", data)
                $scope.storeDisplay = [data.data.businesses[0]]
                YelpFactory.setUserLocation($scope.storeDisplay)
                console.log("$scope.storeDisplay", $scope.storeDisplay)
            })
        } else {
            console.log("Already found your store!")
        }
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
            $ionicTabsDelegate.select(0)
            $location.url("/main")
            $cordovaToast.showShortCenter('Bag pushed to Discogs').then(function(success) {
            // success
            }, function (error) {
            // error
            });
        })
    }

    $scope.clearBag = () => {
        console.log("clearing bag")
        $scope.bag = []
        $scope.displayBag = []
        DiscogsFactory.setBag($scope.bag)
        $cordovaToast.showShortCenter('Bag cleared').then(function(success) {
            $ionicTabsDelegate.select(0)
            $location.url("/main")
            }, function (error) {
            // error
            });
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
            "purchasedItems": $scope.bagDisplay,
            "store": $scope.storeDisplay
        }
        console.log("trip object", tripObj)
        return DiscogsFactory.addTripToFirebase(tripObj)
    }

})