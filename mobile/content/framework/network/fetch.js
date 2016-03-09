//var host="http://192.168.64.205:8383";
var host = "http://192.168.64.205:9101";
//var host="http://192.168.64.252:9081";
var Qs = require('qs');
var Alert = require('../../comp/utils/alert');
var FileUpload = require('NativeModules').FileUpload;
//var RNFS = require('react-native-fs');
var AppStore = require('../store/appStore');
var AppDispatcher = require('../dispatcher/appDispatcher');
var ChatConstants = require('../../constants/command');
var ActionTypes = ChatConstants.ActionTypes;

var XFetch = function (url, param, callback, failure, custLoading) {
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic  ' + AppStore.getToken()
    };

    rawFetch(host + url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(param)
    }, callback, failure, custLoading);

};
var PFetch = function (url, param, callback, failure, custLoading) {

    var headers = {
        'Accept': 'application/json',
        'Authorization': 'Basic  ' + AppStore.getToken()
    };

    rawFetch(host + url + "?" + Qs.stringify(param), {
        method: 'POST',
        headers: headers,
    }, callback, failure, custLoading);
};

var upload = function (url, fileURL, c, f) {
    var obj = {
        uploadUrl: host + url,
        method: 'POST', // default 'POST',support 'POST' and 'PUT'
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Basic  ' + AppStore.getToken()
        },
        files: [
            {

                name: 'file',
                filename: 'fas.jpg', // require, file name
                filepath: fileURL, // require, file absoluete path
            },
        ]
    };
    FileUpload.upload(obj, function (err, res) {
        if (err) {
            f(err)
        } else {
            if (res.data && !_.isEmpty(res.data)) {
                c(JSON.parse(res.data))
            } else {
                f({msgContent: "系统异常"})
            }

        }
    })
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

var processStatus = function (response) {// process status
    if (response.status === 200 || response.status === 0) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error('Error loading: ' + url))
    }
};

var parseBlob = function (response) {
    return response.blob();
};


// download/upload
var downloadFile = function (url) {
    var headers = {
        'Authorization': 'Basic  ' + AppStore.getToken()
    };


    return fetch(host + url, {headers: headers})
        .then(processStatus)
        .then(parseBlob)
        .then(function (blob) {
            var objectURL = URL.createObjectURL(blob);
        })
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
    XFetch: XFetch,
    PFetch: PFetch,
    upload: upload,
    downloadFile: downloadFile,
    host,
    token: AppStore.getToken
};