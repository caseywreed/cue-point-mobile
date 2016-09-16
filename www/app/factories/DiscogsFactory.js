"use strict";

app.factory("DiscogsFactory", function ($q, $http, AuthFactory) {

    let _bag = []

    let setBag = (bag) => {
        _bag = bag
    }

    let getBag = () => {
        return _bag
    }

    let authString = "oauth_consumer_key=RLNRPrabhetprjFlZgUt&oauth_token=${userAuthToken.oauth_token}&oauth_signature_method=PLAINTEXT&oauth_timestamp=${timestamp}&oauth_nonce=yqg53e&oauth_version=1.0&oauth_signature=kuwUTbYZgyBKdsqfpdIRTfvxIFwAWbMw%26${userAuthToken.oauth_token_secret}"

    let addReleaseByNumber = (releaseNumber, userAuthToken) => {
        console.log("releaseNumber", releaseNumber)
        let timestamp = Date.now()
        return $q((resolve,reject) => {
            $http.post(`https://api.discogs.com/users/${AuthFactory.getUsername()}/collection/folders/1/releases/${releaseNumber}?oauth_consumer_key=RLNRPrabhetprjFlZgUt&oauth_token=${userAuthToken.oauth_token}&oauth_signature_method=PLAINTEXT&oauth_timestamp=${timestamp}&oauth_nonce=yqg53e&oauth_version=1.0&oauth_signature=kuwUTbYZgyBKdsqfpdIRTfvxIFwAWbMw%26${userAuthToken.oauth_token_secret}`)
            .success((data) => {
                console.log(data)
                resolve(data)
            })
            .error( (error) => {
                console.error(error)
                reject(error)
            })
        })
    }

    let addReleaseByNumberPromiseAll = (bagDisplay, userToken) => {
        return $q.all(bagDisplay.map(function (release) {
            return addReleaseByNumber(release.id, userToken)
        }))
    }

    let searchByReleaseUrl = (release_url) => {
        let timestamp = Date.now()
        console.log("userAuthTokens in searchByReleaseUrl")
        return $q((resolve,reject) => {
            $http.get(`${release_url}`)
            .success((data) => {
                console.log(data)
                resolve(data)
            })
            .error( (error) => {
                console.error(error)
                reject(error)
            })
        })
    }

    let searchByCatNumber = (catNumber, userAuthToken) => {
        let timestamp = Date.now()
        return $q((resolve,reject) => {
            $http.get(`https://api.discogs.com/database/search?catno=${catNumber}&per_page=25&page=1&oauth_consumer_key=RLNRPrabhetprjFlZgUt&oauth_token=${userAuthToken.oauth_token}&oauth_signature_method=PLAINTEXT&oauth_timestamp=${timestamp}&oauth_nonce=yqg53e&oauth_version=1.0&oauth_signature=kuwUTbYZgyBKdsqfpdIRTfvxIFwAWbMw%26${userAuthToken.oauth_token_secret}`)
            .success((data) => {
                console.log(data)
                resolve(data)
            })
            .error( (error) => {
                console.error(error)
                reject(error)
            })
        })
    }

    return {addReleaseByNumber, addReleaseByNumberPromiseAll, searchByReleaseUrl, searchByCatNumber, setBag, getBag}

})