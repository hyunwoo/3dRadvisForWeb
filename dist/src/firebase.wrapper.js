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

var __Firebase = new function () {
    this.firebase = firebase.initializeApp(config);
    this.storage = firebase.storage();
    this.testDataUrl = 'https://firebasestorage.googleapis.com/v0/b/dradvis.appspot.com/o/credos_testing.csv?alt=media&token=27152d59-bf4a-41cf-8658-1c3581c08c5e';

    this.signOut = function () {};

    this.signOut = function () {};
}();
//# sourceMappingURL=firebase.wrapper.js.map