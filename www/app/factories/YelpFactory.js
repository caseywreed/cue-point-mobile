"use strict";

app.factory("YelpFactory", function ($q, $http, $cordovaGeolocation) {

    let accessToken = "nxi283U5UURZhx5T3qjUiCQ0ZulAz2dLh_tK6a6spHdZWFZ2it4ljNafmBAqy-BQAZW3c-lBRsE-MGGLSbs8lOx5pOH1ekXL4eLgLO9gTha6wQbF52fGuSayws7iV3Yx"

    let lat = null
    let long = null

    let getCoordsFromPhone = () => {
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
            console.log("phone position", position)
            lat  = position.coords.latitude
            long = position.coords.longitude
        }, function(err) {
            console.log(err)
        })
        }

    let searchYelpWithCoords = () => {
        console.log("Searching yelp with Coords")
        return $q((resolve,reject) => {
            $http.get(`https://api.yelp.com/v3/businesses/search?term=delis&latitude=37.786882&longitude=-122.399972`,
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

