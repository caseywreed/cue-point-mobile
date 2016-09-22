"use strict";

app.factory("YelpFactory", function ($q, $http, $cordovaGeolocation) {

    let accessToken = "nxi283U5UURZhx5T3qjUiCQ0ZulAz2dLh_tK6a6spHdZWFZ2it4ljNafmBAqy-BQAZW3c-lBRsE-MGGLSbs8lOx5pOH1ekXL4eLgLO9gTha6wQbF52fGuSayws7iV3Yx"

    let lat = null
    let long = null
    let userLocation = null


    // THIS NEEDS TO BE WRAPPED IN A PROMISE.... MAYBE
    let getCoordsFromPhone = () => {
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
            console.log("phone position", position)
            lat  = position.coords.latitude
            long = position.coords.longitude
            return searchYelpWithCoords(lat, long)
            .then(function (data) {
                console.log("data from yelp", data)
            })
        })
    }


    let searchYelpWithCoords = (lat, long) => {
        console.log("Searching yelp with Coords")
        console.log("user coords", lat, long)
        return $q((resolve,reject) => {
            $http.get(`https://api.yelp.com/v3/businesses/search?categories=musicvideo&latitude=${lat}&longitude=${long}&radius=40000&sort_by=distance`,
                {
                headers:
                    {"Authorization": "Bearer nxi283U5UURZhx5T3qjUiCQ0ZulAz2dLh_tK6a6spHdZWFZ2it4ljNafmBAqy-BQAZW3c-lBRsE-MGGLSbs8lOx5pOH1ekXL4eLgLO9gTha6wQbF52fGuSayws7iV3Yx"}
                })
            .then((data) => {
                console.log(data)
                resolve(data)
            }),(error) => {
                console.error(error)
                reject(error)
            }
        })
    }

    return {searchYelpWithCoords, getCoordsFromPhone}

})

