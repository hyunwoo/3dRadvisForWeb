"use strict";

/**
 * Created by hyunwoo on 2017-02-16.
 */
var config = {
    apiKey: "AIzaSyBmWUxSYfDdIig4b_Nk_8zGW5VdDr1qY-M",
    authDomain: "dradvis.firebaseapp.com",
    databaseURL: "https://dradvis.firebaseio.com",
    storageBucket: "dradvis.appspot.com",
    messagingSenderId: "20687471588"
};

var __Firebase = void 0;
$(function () {
    __Firebase = new function () {
        var fb = firebase.initializeApp(config);
        var auth = fb.auth();
        var that = this;

        this.authChange = [];

        this.addAuthChangeFunction = function (evt) {
            that.authChange.push(evt);
        };

        this.storage = firebase.storage();
        this.testDataUrl = 'https://firebasestorage.googleapis.com/v0/b/dradvis.appspot.com/o/credos_testing.csv?alt=media&token=27152d59-bf4a-41cf-8658-1c3581c08c5e';
        var providerGoogle = new firebase.auth.GoogleAuthProvider();

        fb.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log('auth changed');
                console.log(user);
            } else {}

            __UIStatic.onAuthChange(user);
        });

        this.signInWithGoogle = function () {
            console.log('?');
            fb.auth().signInWithPopup(providerGoogle).then(function (result) {
                var token = result.credential.accessToken;
                var user = result.user;
                console.log('??');
                // ...
            }).catch(function (error) {
                console.log(error);
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
            });
        };

        this.signInWithEmail = function () {};

        this.signOut = function () {
            auth.signOut().then(function () {
                window.location = '/';
            }, function (error) {});
        };
    }();
    $('#signinButton').click(__Firebase.signInWithGoogle);
    $('#signoutButton').click(__Firebase.signOut);

    __Firebase.addAuthChangeFunction(__UIStatic.onAuthChange);

    $('#uploadTest').click(function () {
        __UIStatic.Dialog.open({});
    });
});
//# sourceMappingURL=firebase.wrapper.js.map