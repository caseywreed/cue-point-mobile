"use strict";

app.factory("AuthFactory", function ($q, $http, DiscogsCreds, $window, $location) {

    let _uid = null
    let _userName = null
    let user_agent = "CuePoint/0.01 +https://github.com/caseywreed/cue-point"
    let userTokens = {}
    let url = "https://api.discogs.com/oauth/request_token"
    let transferableUserTokens = {}

    let setUid = function (uid) {
        _uid = uid
        $window.localStorage.clear()
        $window.localStorage.setItem("uid", _uid)
        console.log("_uid", _uid)
    }

    let getUid = function () {
        return _uid
    }

    let getUidFromLocalStorage = () => {
        _uid = $window.localStorage.getItem("uid")
        console.log("localStorageUid", _uid)
        return _uid
    }

    let setUsername = function (string) {
        _userName = string
        console.log("_username", _userName)
    }

    let getUsername = function () {
        return _userName
    }

    let setTransferableUserTokens = (userTokens) => {
        transferableUserTokens = userTokens
    }

    let getTransferableUserTokens = () => {
        return transferableUserTokens
    }

    let createUser = function (userObj) {
        return firebase.auth().createUserWithEmailAndPassword(userObj.email, userObj.password)
        .catch(function (error) {
            let errorCode = error.code
            let errorMessage = error.message
            // ..... more later
        })
    }

    let loginUser = function (userObj) {
        return firebase.auth().signInWithEmailAndPassword(userObj.email, userObj.password)
        .catch( function (error) {
            let errorCode = error.code
            let errorMessage = error.message
            console.log("errorCode", errorCode)
            console.log("errorMessage", errorMessage)
            // ..... more error handling later
        })
    }

    let discogsAuthCall = () => {
        console.log("discogsAuthCall running")
        let timestamp = Date.now()
        return $q((resolve, reject) => {
            $http({
                method: "GET",
                url: "https://api.discogs.com/oauth/request_token?oauth_consumer_key="
                + DiscogsCreds.key +
                "&oauth_signature_method=PLAINTEXT&oauth_timestamp="
                + timestamp +
                "&oauth_nonce=33u0UT&oauth_version=1.0&oauth_signature="
                + DiscogsCreds.oauth_signature +
                "%26&oauth_callback=http://localhost:8080/#/redirect", //This is the ampersand at the end of the secret!
            })
            .success((data) => {
                console.log(data)
                setInitialUserTokens(data)
                $window.location.href = `https://discogs.com/oauth/authorize?oauth_token=${userTokens.oauth_token}`;
                resolve(data)
            })
            .error((error) => {
                reject(error)
            })
        })
    }

    let discogsVerifyCall = (oauthToken, userVerifyKey) => {
        console.log("discogsVerify running")
        _uid = oauthToken.uid
        let timestamp = Date.now()
        return $q((resolve, reject) => {
            $http({
                method: "GET",
                url: "https://api.discogs.com/oauth/access_token?oauth_verifier="
                + userVerifyKey +
                "&oauth_consumer_key=RLNRPrabhetprjFlZgUt&oauth_token="
                + oauthToken.oauth_token +
                "&oauth_signature_method=PLAINTEXT&oauth_timestamp="
                + timestamp +
                "&oauth_nonce=vRvMJk&oauth_version=1.0&oauth_signature=kuwUTbYZgyBKdsqfpdIRTfvxIFwAWbMw%26" + oauthToken.oauth_token_secret
            })
            .success((data) => {
                console.log(data)
                sendUsersAuthTokensToFirebase(data)
                .then(() => resolve(data))
            })
            .error((error) => {
                reject(error)
            })
        })
    }

    let setInitialUserTokens = (tokens) => {
        console.log("setInitialUserTokens running")
        let splitTokens = tokens.split("&")
        let tempTokenArray = []
        splitTokens.forEach( function (token) {
            let tokenValue = token.split("=")
            tempTokenArray.push(tokenValue[1])
        })
        userTokens.oauth_token_secret = tempTokenArray[0]
        userTokens.oauth_token = tempTokenArray[1]
        userTokens.uid = _uid
        sendTokensToFirebase(userTokens)
        console.log("userTokens", userTokens)
    }

    let sendTokensToFirebase = () => {
        console.log("sending tokens to Firebase")
        return $q((resolve,reject) => {
            $http.post('https://cue-point.firebaseio.com/token.json', userTokens)
            .then((data) => {
                resolve(data)
            }),(error) => {
                console.error(error)
                reject(error)
            }
        })
    }

    let deleteTokensFromFirebase = () => {
        console.log("deleting tokens from Firebase")
        return $q((resolve,reject) => {
            $http.delete('https://cue-point.firebaseio.com/token.json')
            .then((data) => {
                resolve(data)
            }),(error) => {
                console.error(error)
                reject(error)
            }
        })
    }

    let getTokensFromFirebase = () => {
        console.log("getting tokens from Firebase")
        return $q((resolve,reject) => {
            $http.get('https://cue-point.firebaseio.com/token.json')
            .then((data) => {
                console.log("getTokensFromFirebase success", data)
                resolve(data)
            }),(error) => {
                console.error(error)
                reject(error)
            }
        })
    }

    let sendUsersAuthTokensToFirebase = (data) => {
        console.log("sendUsersAuthTokensToFirebase running")
        let tokenString = data
        let splitTokenString = tokenString.split("&")
        let oauth_token_secret_split = splitTokenString[0].split("=")[1]
        let oauth_token_split = splitTokenString[1].split("=")[1]
        let userAuthTokens = {
            "oauth_token": oauth_token_split,
            "oauth_token_secret": oauth_token_secret_split,
            "uid": _uid
        }
        return $q((resolve,reject) => {
            $http.post('https://cue-point.firebaseio.com/userTokens.json', userAuthTokens)
            .then((data) => {
                resolve(data)
            }),(error) => {
                console.error(error)
                reject(error)
            }
        })
    }

    let getUserAuthToken = () => {
        return $q((resolve,reject) => {
            $http.get(`https://cue-point.firebaseio.com/userTokens.json?orderBy="uid"&equalTo="${_uid}"`)
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

    let findIdentity = (userAuthToken) => {
        let timestamp = Date.now()
        return $q((resolve,reject) => {
            $http.get(`https://api.discogs.com/oauth/identity?oauth_consumer_key=RLNRPrabhetprjFlZgUt&oauth_token=${userAuthToken.oauth_token}&oauth_signature_method=PLAINTEXT&oauth_timestamp=${timestamp}&oauth_nonce=yqg53e&oauth_version=1.0&oauth_signature=kuwUTbYZgyBKdsqfpdIRTfvxIFwAWbMw%26${userAuthToken.oauth_token_secret}`)
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

    return {setUid, getUid, getUidFromLocalStorage, setTransferableUserTokens,
        getTransferableUserTokens, setUsername, getUsername, createUser, loginUser,
        discogsAuthCall, discogsVerifyCall, deleteTokensFromFirebase, getTokensFromFirebase,
        getUserAuthToken, findIdentity}

})