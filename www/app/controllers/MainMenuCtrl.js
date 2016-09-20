"use strict";

app.controller("MainMenuCtrl", function ($scope, AuthFactory, DiscogsFactory, $cordovaBarcodeScanner) {

    $scope.userAuthToken = {}
    $scope.searchTerm = ""
    $scope.searchResultsArray = []
    $scope.bag = []

    $scope.mainMenuInit = () => {
        console.log("mainMenuInit running")
        $scope.getUserAccessTokens()
        $scope.bag = DiscogsFactory.getBag()
        console.log("mainMenuInit bag", $scope.bag)
    }

    $scope.getUserAccessTokens = () => {
        console.log("getting user access tokens")
        AuthFactory.getUidFromLocalStorage()
        AuthFactory.getUserAuthToken(AuthFactory.getUid())
        .then( function (data) {
            let key = Object.keys(data)
            $scope.userAuthToken = data[key]
            console.log("$scope.userAuthToken from getUserAccessTokens", $scope.userAuthToken)
            AuthFactory.setTransferableUserTokens($scope.userAuthToken)
            $scope.findUserIdentity()
        })
    }

    $scope.findUserIdentity = () => {
        AuthFactory.findIdentity($scope.userAuthToken)
        .then( function (data) {
            console.log(data)
            AuthFactory.setUsername(data.username)
        })
    }

    $scope.addRickAstley = () => {
        DiscogsFactory.addReleaseByNumber(249504, $scope.userAuthToken)
    }

    $scope.searchByCatNumber = () => {
        DiscogsFactory.searchByCatNumber($scope.searchTerm, $scope.userAuthToken)
        .then(function (searchResults) {
            // PLACE BLANK IMAGE CHECKER IN HERE
            $scope.searchResultsArray = searchResults.results
            $scope.searchResultsArray.forEach(function (release) {
                if (release.thumb === "") {
                    console.log("setting blank image")
                    release.thumb = "img/vector-vinyl-record.jpg"
                }
            })
            console.log("searchResultsArray", $scope.searchResultsArray)
        })
    }

    $scope.addReleaseToBag = (resource_url, thumb) => {
        console.log("resource_url", resource_url)
        console.log("thumb", thumb)
        let releaseObj = {
            resource_url: resource_url,
            thumb: thumb
        }
        $scope.bag.push(releaseObj)
        console.log("bag", $scope.bag)
        DiscogsFactory.setBag($scope.bag)
    }

    $scope.scanBarcode = () => {
        console.log("scanBarcode running")
        $cordovaBarcodeScanner
        .scan()
        .then(function(barcodeData) {
            console.log(barcodeData)
            // SEND BARCODE DATA TO DiscogsFactory.searchDiscogsByBarcode or whatever
        // Success! Barcode data is here
        }, function(error) {
        // An error occurred
        });
    }


})