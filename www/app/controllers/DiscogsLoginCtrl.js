"use strict";

app.controller("DiscogsLoginCtrl", function ($scope, $location, AuthFactory, $window, $q) {

    $scope.userVerifier = {
        key: ""
    }

    $scope.loginToDiscogs = function () {
        console.log("loginToDiscogs running")
        AuthFactory.discogsAuthCall()
    }

    $scope.checkForLogin = function () {
        AuthFactory.getUserAuthToken()
        .then( function (data) {
            console.log("data in checkForLogin", data)
            if (Object.keys(data).length !== 0) {
            AuthFactory.deleteTokensFromFirebase()
            $window.location.href = `/#/main`
            } else {
                return $q.reject(data)
            }
        })
        .catch( function (error) {
            console.error(error)
            console.log("user is not authorized with Discogs")
        })
    }

})