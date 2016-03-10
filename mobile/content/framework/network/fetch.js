
var Qs = require('qs');
var Alert = require('../../comp/utils/alert');
var FileUpload = require('NativeModules').FileUpload;
//var RNFS = require('react-native-fs');
var AppStore = require('../store/appStore');
var AppDispatcher = require('../dispatcher/appDispatcher');
var ChatConstants = require('../../constants/command');
var ActionTypes = ChatConstants.ActionTypes;

var host = require('./host');;

var BFetch = function (url, param, callback, failure, options) {
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic  ' + AppStore.getToken()
    };

    rawFetch(host + url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(param)
    }, callback, failure, options);

};
var PFetch = function (url, param, callback, failure, options) {

    var headers = {
        'Accept': 'application/json',
        'Authorization': 'Basic  ' + AppStore.getToken()
    };

    rawFetch(host + url + "?" + Qs.stringify(param), {
        method: 'POST',
        headers: headers,
    }, callback, failure, options);
};

var UFetch = function (url, param, callback, failure, options) {

    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d',
        'Authorization': 'Basic  ' + AppStore.getToken()
    };

    var formdata = new FormData();
    formdata.append('file', param);
    rawFetch(host + url , {
        method: 'POST',
        headers: headers,
        body:formdata,
    }, callback, failure, {custLoading:true});
};


var rawFetch = function (url, param, callback, failure, option) {
    if (!option)option = {}
    var p = Promise.race([fetch(url, param), new Promise(function (resolve, reject) {
        setTimeout(()=> reject(new Error("链接超时")), 5000);
    })]);
    //process(fetch(url, param) ,callback,failure,option);
    process(p, callback, failure, option);
}

var process = function (promoise, callback, failure, option) {


    _startRPC(option)
    if (!AppStore.getNetWorkState()) {

        _endRPC(option, ()=>Alert('网络异常'));
        return;
    }

    promoise.then(
        (response) => response.text()
    ).then((response) => {

            var handle;

            if (response == "") {
                handle = ()=> callback({})
            }
            else {
                var json = JSON.parse(response)
                if (json.msgContent) {
                    if (json.msgCode == 'SYS_TOKEN_INVALID') {
                        option.custLoading = true;
                        handle = ()=> {
                            var action;
                            if (option.isLogout) {
                                action = ActionTypes.LOGOUT
                            } else {
                                action = ActionTypes.FORCE_LOGOUT
                            }
                            AppDispatcher.dispatch({
                                type: action
                            });
                        }
                    } else {
                        if (failure) {
                            handle = ()=>failure(json);
                        } else {
                            handle = ()=>Alert(json.msgContent)
                        }
                    }


                } else {
                    handle = ()=>callback(json)
                }

            }

            _endRPC(option, handle);
        })
        .catch((error) => {

            var handle;
            console.log(error);
            if (failure) {
                handle = ()=>failure({msgContent: "系统异常"});
            } else {
                handle = ()=>Alert('系统异常' + error)
            }
            _endRPC(option, handle);

        });

};



var _startRPC = function (option) {
    if (!option.custLoading) {
        AppDispatcher.dispatch({
            type: ActionTypes.REQUEST_START,
        });
    }

}

var _endRPC = function (option, handle) {
    if (!option.custLoading) {
        AppDispatcher.dispatch({
            type: ActionTypes.REQUEST_END,
            handle: handle
        });
    } else {
        handle()
    }
}

module.exports = {
    BFetch: BFetch,
    PFetch: PFetch,
    UFetch: UFetch,
    host,
    token: AppStore.getToken
};