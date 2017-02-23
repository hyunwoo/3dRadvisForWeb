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
            if (!isSetReferences) {
                console.log('initReferences');
            }
            isSetReferences = true;

        } else {
        }

        // __UIStatic.onAuthChange(user);
    });

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
        auth.signOut().then(function () {
            window.location = '/';
        }, function (error) {

        });
        that.user = undefined;
    };

    this.uploadData = function (f) {

    };
};
$('#signinButton').click(__Firebase.signInWithGoogle);
$('#signoutButton').click(__Firebase.signOut);

// __Firebase.addAuthChangeFunction(__UIStatic.onAuthChange);
__FileReader.InputReadFile($('#uploadTest'), function (body) {
    console.log(body);
});



