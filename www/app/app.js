"use strict";

var app = angular.module("CueApp", ["ngRoute"])

app.config(function ($routeProvider) {
    $routeProvider.
        when("/", {
            templateUrl: "partials/cuepoint-login.html",
            controller: "CueLoginCtrl"
        }).
        when("/discogs-login", {
            templateUrl: "partials/discogs-login.html",
            controller: "DiscogsLoginCtrl"
        }).
        when("/cuepoint-login", {
            templateUrl: "partials/cuepoint-login.html",
            controller: "CueLoginCtrl"
        }).
        when("/main", {
            templateUrl: "partials/main.html",
            controller: "MainMenuCtrl"
        }).
        when("/bag", {
            templateUrl: "partials/bag.html",
            controller: "BagCtrl"
        }).
        otherwise('/')
})

app.run( ($location, FBCreds) => {
    let creds = FBCreds
    let authConfig = {
        apiKey: creds.key,
        authDomain: creds.authDomain
    }
    firebase.initializeApp(authConfig)
})