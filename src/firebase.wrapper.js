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

let __Firebase = new function () {
    let fb = firebase.initializeApp(config);
    let auth = fb.auth();
    this.user = undefined;
    let isSetReferences = false;


    this.EventName = {
        ChildAdded: 'child_added',
        ChildRemoved: 'child_removed',
        ChildChange: 'child_changed'
    }
    const that = this;
    this.authChange = [];

    this.addAuthChangeFunction = function (evt) {
        that.authChange.push(evt);
    };

    this.storage = firebase.storage();
    this.testDataUrl = 'https://firebasestorage.googleapis.com/v0/b/dradvis.appspot.com/o/credos_testing.csv?alt=media&token=27152d59-bf4a-41cf-8658-1c3581c08c5e';
    let providerGoogle = new firebase.auth.GoogleAuthProvider();

    fb.auth().onAuthStateChanged(function (user) {
        that.user = user;
        if (user) {
            console.log('auth changed');
            console.log(user);
            $('.userName').html(user.displayName);
            initDBReferences();
            isSetReferences = true;
        } else {
        }
        _.forEach(that.authChange, function (d) {
            d(user);
        });
        // __UIStatic.onAuthChange(user);
    });


    let DBRefDataList;
    let callbackEvents = {};


    function initDBReferences() {
        if (isSetReferences) return;
        isSetReferences = true;

        DBRefDataList = fb.database().ref(that.user.uid + '/list');
        var events = ['child_added', 'child_changed', 'child_removed'];
        _.forEach(events, function (evt) {
            DBRefDataList.on(evt, function (snapshot) {
                console.log(evt, snapshot.val())
                _.forEach(callbackEvents[evt], function (callback) {
                    callback(snapshot.val());
                })
            });
        });

    }

    this.on = function (evt, callback) {
        if (_.isNil(callbackEvents[evt])) callbackEvents[evt] = [];
        callbackEvents[evt].push(callback);
        return callback;
    };

    this.unbind = function (evt, callback) {
        if (_.isNil(callbackEvents[evt])) {
            console.error('event not binded');
            return;
        }
        if (_.isNil(callback)) callbackEvents[evt] = [];
        else if (!_.isNil(callback)) callbackEvents[evt] = _.remove(callbackEvents[evt], callback);
    };


    function clearDBReferences() {

    }

    this.getDataList = function () {

    };

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

    this.signInWithEmail = function () {

    };

    this.signOut = function () {
        if (_.isNil(that.user)) {
            __UIStatic.Toast.open("Auth Failed");
            return;
        }

        auth.signOut().then(function () {
            that.user = undefined;
            window.location = '/';
        }, function (error) {
            __UIStatic.Toast.open("SignOut Failed");
        });

    };

    this.getDataList = function () {
        if (_.isNil(that.user)) {
            __UIStatic.Toast.open("Auth Failed");
            return;
        }
    };

    this.getDataContent = function (key) {
        if (_.isNil(that.user)) {
            __UIStatic.Toast.open("Auth Failed");
            return;
        }
    };

    this.deleteData = function (d) {
        console.log('deleteData:', d);
        var ref = fb.database().ref(that.user.uid + '/list/' + d._id);
        ref.set(null);
    };


    this.uploadData = function (f) {
        console.log('uploadFile!?');
        if (_.isNil(that.user)) {
            __UIStatic.Toast.open("Auth Failed");
            return;
        }
        const refList = fb.database().ref(that.user.uid + '/list');
        const refRaw = fb.database().ref(that.user.uid + '/raw');
        const key = refList.push().key;

        console.log(f);
        var updates = {};
        console.log(that.user.uid + '/list/' + key);
        updates[that.user.uid + '/list/' + key] = {
            name: f.name,
            size: f.size,
            type: f.type,
            lastModified: f.lastModified,
            _id: key,
            overview: 'Not Yet Set Overview',
        };

        updates[that.user.uid + '/raw/' + key] = f.contents;
        fb.database().ref().update(updates);
    };
};

$(function () {
    __Firebase.getDataList()
});




