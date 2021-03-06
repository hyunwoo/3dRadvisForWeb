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
    const that = this;

    let fb = firebase.initializeApp(config);
    let auth = fb.auth();
    this.user = undefined;
    let isSetReferences = false;

    this.EventName = {
        ChildAdded: 'child_added',
        ChildRemoved: 'child_removed',
        ChildChange: 'child_changed'
    };


    this.authChange = [];
    this.addAuthChangeFunction = function (evt) {
        that.authChange.push(evt);
    };

    let usageData;
    let DBRefDimensionList;

    let DBRefDataList;
    let callbackEvents = {};
    let callbackDimensions = {};
    let DataList = this.DataList = {};
    this.CurrentData = {};
    this.CurrentDataKey = '';
    this.CurrentSetting = {};
    this.DimensionFieldList = {};


    this.setUsageData = async function (d, callback) {
        usageData = d;
        console.log(" Data & Dimension Event Injected");
        DBRefDimensionList = fb.database().ref(that.user.uid + '/list/' + d._id + '/dimension');

        var rawDataReceiver = await fb.database().ref(that.user.uid + '/raw/' + d._id).once('value');
        that.CurrentData = new DataSet(rawDataReceiver.val());
        that.CurrentDataKey = d._id;
        var settingDataReceiver = await fb.database().ref(that.user.uid + '/setting/' + d._id).once('value');
        that.CurrentSetting = settingDataReceiver.val();
        callback(rawDataReceiver.val());
        // fb.database().ref(that.user.uid + '/raw/' + d._id).once('value').then(function (snapshot) {
        //     that.CurrentData = new DataSet(snapshot.val());
        //     callback(snapshot.val());
        // });

        DBRefDimensionList.once('value').then(function (snapshot) {
            if (_.isNil(snapshot.val())) return;
            that.DimensionFieldList[snapshot.val()._id] = snapshot.val();
            const val = snapshot.val();
            _.forEach(callbackDimensions[that.EventName.ChildAdded], function (callback) {
                _.forEach(val, function (v) {
                    callback(v);
                })
            })
        });

        _.forEach(that.EventName, function (event) {
            console.log('Alloc Dimension Event : ' + event);
            DBRefDimensionList.on(event, function (snapshot) {
                console.log(event, snapshot.val());
                switch (event) {
                    case that.EventName.ChildAdded:
                    case that.EventName.ChildChange:
                        that.DimensionFieldList[snapshot.val()._id] = snapshot.val();
                        break;
                    case that.EventName.ChildRemoved:
                        delete that.DimensionFieldList[snapshot.val()._id];
                        break;
                }

                _.forEach(callbackDimensions[event], function (callback) {
                    callback(snapshot.val());
                });
            });
        });
    };

    this.getUsageDataSetting = async function () {
        console.log('asdfasdf');
        var a = await fb.database().ref(that.user.uid + '/setting/' + usageData._id).once('value');
        return a.val();


    };

    /**
     * @param field : object
     *      @name : string
     *      @dimensionList : list //TODO will Change
     */
    this.addDimensionField = function (field) {
        const key = DBRefDimensionList.push().key;
        let data = {};
        field['_id'] = key;
        data[key] = field;
        DBRefDimensionList.update(data);
    };

    this.deleteDimensionField = function (field) {
        console.log('delete field : ', that.user.uid + '/list/' + field._id + '/dimension/' + field._id);
        let data = {};
        data[field._id] = null;
        DBRefDimensionList.update(data);
    };

    this.releaseUsageData = function () {
        usageData = null;
        console.log("Data & Dimension Event Released");
        if (!_.isNil(DBRefDimensionList)) DBRefDimensionList.off();
        callbackDimensions = {};
        that.DimensionFieldList = {};
    };
    this.storage = firebase.storage();
    this.testDataUrl = 'https://firebasestorage.googleapis.com/v0/b/dradvis.appspot.com/o/credos_testing.csv?alt=media&token=27152d59-bf4a-41cf-8658-1c3581c08c5e';
    let providerGoogle = new firebase.auth.GoogleAuthProvider();
    fb.auth().onAuthStateChanged(function (user) {
        console.log('auth change input');
        setTimeout(function () {
            that.user = user;
            if (user) {
                console.log('auth changed', user);
                $('.userName').html(user.displayName);
                initDBReferences();
                isSetReferences = true;
            } else {
            }
            _.forEach(that.authChange, function (d) {
                d(user);
            });
        }, 100);
        // __UIStatic.onAuthChange(user);
    });

    function initDBReferences() {
        if (isSetReferences) return;
        isSetReferences = true;

        DBRefDataList = fb.database().ref(that.user.uid + '/list');

        _.forEach(that.EventName, function (evt) {
            DBRefDataList.on(evt, function (snapshot) {
                switch (evt) {
                    case 'child_added' :
                    case 'child_changed' :
                        DataList[snapshot.val()._id] = snapshot.val();
                        break;
                    case 'child_removed':
                        delete DataList[snapshot.val()._id];
                        break;
                }
                _.forEach(callbackEvents[evt], function (callback) {
                    callback(snapshot.val());
                });
            });
        });
    }

    this.on = function (evt, callback) {
        if (_.isNil(callbackEvents[evt])) callbackEvents[evt] = [];
        callbackEvents[evt].push(callback);
        return callback;
    };

    this.onDimension = function (evt, callback) {
        if (_.isNil(callbackDimensions[evt])) callbackDimensions[evt] = [];
        callbackDimensions[evt].push(callback);
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
        fb.auth().signInWithPopup(providerGoogle).then(function (result) {
            var token = result.credential.accessToken;
            var user = result.user;
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


    this.getRawData = async function (key, callback) {
        console.log('ref', that.user.uid + '/raw/' + key);
        let a = await fb.database().ref(that.user.uid + '/raw/' + key).once('value');
        return a.val();
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
            return null;
        }

        const refList = fb.database().ref(that.user.uid + '/list');
        const refRaw = fb.database().ref(that.user.uid + '/raw');
        const key = refList.push().key;

        // TODO Convert Worker
        // var worker = new Worker('/radvis.data.js');
        // worker.postMessage('hello!!');
        // worker.addEventListener('message', (d) => {
        //     console.log('receive', d);
        // });

        // __UIStatic.Loader.open();
        const dSet = new DataSet(f.contents);
        console.log('dset length : ', JSON.stringify(dSet).length);
        $.post('/api/correlation', dSet, function (body) {
            let updates = {};
            const dataInfo = {
                name: f.name,
                size: f.size,
                type: f.type,
                lastModified: f.lastModified,
                _id: key,
                overview: 'Not Yet Set Overview',
            };

            updates[that.user.uid + '/list/' + key] = dataInfo;
            updates[that.user.uid + '/raw/' + key] = f.contents;
            updates[that.user.uid + '/setting/' + key] = body;
            updates[that.user.uid + '/dataset/' + key] = dSet;
            fb.database().ref().update(updates);
        }).fail(() => {
            console.error('error');
        }).always(() => {
        });

    };

};

$(function () {
    //__Firebase.getDataList()
});




