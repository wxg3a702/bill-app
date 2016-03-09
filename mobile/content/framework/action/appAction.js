var {XFetch,PFetch,upload,host,token} = require('../network/fetch');
var async = require('async')
var Push = require('../network/push');
var AppDispatcher = require('../dispatcher/appDispatcher');
var Command = require('../../constants/command');
var ActionTypes = Command.ActionTypes;
var _ = require('lodash');
var pub = "/pub";
var api = "/api"
var Actions = {
    notificationRegister: (token)=>_notificationRegister(token),
    onNotification: (notification)=>_onNotification(notification),
    freshNotification: (notification)=>_onNotification(notification),
    registerAPNS: ()=>Push.init(),
    sendSMSCodeToNewMobile: (p, c, f)=>PFetch(pub + "/sendSMSCodeToNewMobile", p, c, f),
    sendSMSCodeToOldMobile: (p, c, f)=>PFetch(pub + "/sendSMSCodeToOldMobile", p, c, f),
    sendSMSCodeToNewMobileApi: (p, c, f)=>XFetch(api + "/User/sendSMSCodeToNewMobile", p, c, f),
    validateSMSCode: (p, c, f)=>PFetch(pub + "/validateSMSCode", p, c, f),
    register: (p, c, f)=>_register(pub + "/register", p, c, f),
    appInit: ()=>_appInit(),
    login: (p, c, f)=>_login(pub + "/login", p, c, f),
    logOut: ()=>_logout(api + "/User/logout"),
    validateMobileForReg: (p, c, f)=>XFetch(pub + "/validateMobileForReg", p, c, f),
    validateMobileForForgetPwd: (p, c, f)=>XFetch(pub + "/validateMobileForForgetPwd", p, c, f),
    resetPasswordForForgetPwd: (p, c, f)=>XFetch(pub + "/resetPasswordForForgetPwd", p, c, f),
    updateUser: (p, c, f)=>_updateUser(api + "/User/updateUser", p, c, f),
    validatePassword: (p, c, f)=>XFetch(api + "/User/validatePassword", p, c, f),
    validateMobileForResetMobile: (p, c, f)=>XFetch(api + "/User/validateMobileForResetMobile", p, c, f),
    resetMobileNo: (p, c, f)=>_resetMobileNo(api + "/User/resetMobileNo", p, c, f),
    resetPasswordForChangePwd: (p, c, f)=>XFetch(api + "/User/resetPasswordForChangePwd", p, c, f),
    updateUserHead: (p, c, f)=> _updateUserHead(p, c, f),
    updateCompBaseInfo: (p, c, f)=> _updateCompBaseInfo(p, c, f),
    submitOrg: (p, c, f)=> _submitOrg(p, c, f),
    clear: ()=> {
        AppDispatcher.dispatch({
            type: ActionTypes.LOGOUT,
        });
    },
    forceLogOut: ()=> {
        AppDispatcher.dispatch({
            type: ActionTypes.FORCE_LOGOUT
        });
    },
    cancleBillDiscount: (p, c)=>_cancleBillDiscount(api + "/BillDiscountAdmin/cancleBillDiscount", p, c),
    createBillDiscount: (p, c)=>_createBillDiscount(api + "/BillDiscountAdmin/createBillDiscount", p, c),
    giveUpBillDiscount: (p, c)=>_giveUpBillDiscount(api + "/BillDiscountAdmin/giveUpBillDiscount", p, c),
    getStdOrg: (p, c, f)=>PFetch(api + '/Organization/getStdOrg', p, c, f, {custLoading: true}),
    sendSMSCodeForDiscount: (p, c, f)=>XFetch(api + "/User/sendSMSCodeToOldMobile", p, c, f),
    validateMobileForDiscount: (p, c, f)=>PFetch(api + "/User/validateSMSCodeAfterLogin", p, c, f),
    clearMessageDetail: (p)=>_clearMessageDetail(p),
    setOtherMsgRead: (p, c, f) => PFetch(api + "/MessageSearch/setOtherMsgRead", p, c, f),
    setBillRevRead: (p, c, f) => PFetch(api + "/MessageSearch/setBillRevRead", p, c, f),
    feedbackOpinion: (p, c, f)=>XFetch(api + "/User/feedbackOpinion", p, c, f),
    downloadCertificate: ()=>_downloadCertificate(),
    getFile: (fid)=>host + api + '/File/downLoad/' + fid + '?token=' + token(),
    getProtocol: ()=>host + '/protocol.html',
    getRegion: (f, e)=>_getRegion(f, e),
    startRPC: (option)=>_startRPC(option),
    endRPC: (option, handle)=>_endRPC(option, handle),
    setDemoFlag: ()=> {
        AppDispatcher.dispatch({
            type: ActionTypes.DEMO_FLAG
        });
    }
}
var _clearMessageDetail = function (p) {
    AppDispatcher.dispatch({
        type: ActionTypes.CLEAR_MESSAGEDETAIL,
        data: p,
    })
}
var _updateCompBaseInfo = function (p, c, f) {

    AppDispatcher.dispatch({
        type: ActionTypes.UPDATE_COMPBASEINFO,
        data: p,
        successHandle: c
    });
}
var _updateUserHead = function (p, c, f) {
    var uploadURL = api + '/File/uploadFile'
    var uploadFileHandle = function (name) {
        return function (callback) {
            if (p[name].length == 24) {
                callback(null, name);
            } else {
                upload(uploadURL, p[name],
                    function (data) {
                        PFetch(api + '/User/updateUserPhoto', {photoStoreId: data.fileId},
                            function () {
                                AppDispatcher.dispatch({
                                    type: ActionTypes.UPDATE_USERINFO,
                                    data: p,
                                    successHandle: c
                                });
                            });
                    },
                    function (err) {
                        callback(err, name);
                    });
            }
        }
    }
    async.series([uploadFileHandle('photoStoreId')],
        function (err, res) {
            if (err) {
                f();
            } else {
                c();
            }
        }
    );
}
var _updateUser = function (u, p, c, f) {
    var key = _.keys(p)[0];
    var value = p[key]
    XFetch(u, {column: key, value: value},
        function (msg) {
            AppDispatcher.dispatch({
                type: ActionTypes.UPDATE_USERINFO,
                data: p
            });
            c(msg);
        }
    )
}
var _resetMobileNo = function (u, p, c, f) {
    var key = _.keys(p)[0];
    var value = p[key]
    XFetch(u, p,
        function (msg) {
            AppDispatcher.dispatch({
                type: ActionTypes.UPDATE_USERINFO,
                data: {mobileNo: value}
            });
            c(msg)
        }
    )
}
var _logout = function (url, c) {
    XFetch(url, {},
        function () {
            AppDispatcher.dispatch({
                type: ActionTypes.LOGOUT,
            });
        }, null, {isLogout: true}
    )
}

var _login = function (url, p, c, f) {

    XFetch(url, p,
        function (msg) {
            AppDispatcher.dispatch({
                type: ActionTypes.LOGIN,
                data: msg
            });
            c();
        },
        f
    )
}

var _register = function (url, p, c, f) {

    XFetch(url, p,
        function (msg) {
            AppDispatcher.dispatch({
                type: ActionTypes.LOGIN,
                data: msg
            });
            c();
        },
        f
    )
}

var _cancleBillDiscount = function (url, p, c) {
    PFetch(url, p,
        function (msg) {
            AppDispatcher.dispatch({
                type: ActionTypes.CANCLE_BILL_DISCOUNT,
                data: p
            });
            c();
        }
    );

}

var _createBillDiscount = function (url, p, c) {
    XFetch(url, p,
        function (msg) {
            AppDispatcher.dispatch({
                type: ActionTypes.CREATE_BILL_DISCOUNT,
                data: p
            });
            c();
        }
    );
}

var _giveUpBillDiscount = function (url, p, c) {
    PFetch(url, p,
        function (msg) {
            AppDispatcher.dispatch({
                type: ActionTypes.GIVEUP_BILL_DISCOUNT,
                data: p
            });
            c();
        }
    );
}
var _submitOrg = function (p, c, f) {

    var uploadURL = api + '/File/uploadFile'
    var uploadFileHandle = function (name) {
        return function (callback) {
            if (p[name].length == 24) {
                callback(null, name);
            } else {
                upload(uploadURL, p[name],
                    function (data) {
                        _updateCompBaseInfo({[name]: data.fileId})
                        callback(null, name);
                    },
                    function (err) {
                        callback(err, name);
                    })
            }
        }
    }
    async.series([
            uploadFileHandle('licenseCopyFileId'),
            uploadFileHandle('orgCodeCopyFileId'),
            uploadFileHandle('taxFileId'),
            uploadFileHandle('corpIdentityFileId'),
            uploadFileHandle('authFileId'),
            uploadFileHandle('authIdentityFileId'),
        ],
        function (err, res) {
            if (err) {
                f();
            } else {
                XFetch(api + "/Organization/updateOrg", p,
                    function (data) {
                        _updateCompBaseInfo({
                            biStatus: 'CERTIFIED',
                            userType: 'CERTIFIED'
                        })
                        c()
                    },
                    function (err) {
                        f()
                    }, {custLoading: true}
                )
            }

        })

}

var _downloadCertificate = function (p) {


}

var _notificationRegister = function (token) {
    AppDispatcher.dispatch({
        type: ActionTypes.SAVE_APNS_TOKEN,
        token: token
    });

}

var _onNotification = function (notification) {

    //if(notification==undefined){
    //    console.log("app state is change");
    //    return;
    //}
    //  var msg = JSON.parse(notification.getMessage());
    XFetch(api + "/MessageSearch/getPushMsg", {}, function (data) {
        AppDispatcher.dispatch({
            type: ActionTypes.PUSH_NOTIFICATION,
            data: data
        });

    }, null, {custLoading: true});


}

var _appInit = function () {

    AppDispatcher.dispatch({
        type: ActionTypes.APP_INIT,
    });

}

var _getRegion = function (cb, e) {

    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        var crd = pos.coords;
        fetch('http://api.map.baidu.com/geocoder/v2/?ak=ks20zOgRmsf5rdSM9n0i9FPK&location=' + crd.latitude + ',' + crd.longitude + '&output=json')
            .then((response) =>
                response.json())
            .then(((json) => {
                console.log(json);
                cb(json.result.addressComponent.province.substr(0, 2) + ' ' + json.result.addressComponent.city.substr(0, 2))
            }).bind(this))
            .catch((error) => {
                console.warn(error);
                e('定位失败');
            });

    };

    function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
        e('定位失败');
    };

    navigator.geolocation.getCurrentPosition(success.bind(this), error, options);
}
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

module.exports = Actions;