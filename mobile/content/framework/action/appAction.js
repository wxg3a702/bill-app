var {BFetch,PFetch,UFetch,host,token} = require('../network/fetch');
var async = require('async')
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
    sendSMSCodeToNewMobile: (p, c, f)=>PFetch(pub + "/sendSMSCodeToNewMobile", p, c, f),
    sendSMSCodeToOldMobile: (p, c, f)=>PFetch(pub + "/sendSMSCodeToOldMobile", p, c, f),
    sendSMSCodeToNewMobileApi: (p, c, f)=>BFetch(api + "/User/sendSMSCodeToNewMobile", p, c, f),
    validateSMSCode: (p, c, f)=>PFetch(pub + "/validateSMSCode", p, c, f),
    register: (p, c, f)=>_register(pub + "/register", p, c, f),
    appInit: ()=>_appInit(),
    login: (p, c, f)=>_login(pub + "/login", p, c, f),
    logOut: ()=>_logout(api + "/User/logout"),
    validateMobileForReg: (p, c, f)=>BFetch(pub + "/validateMobileForReg", p, c, f),
    validateMobileForForgetPwd: (p, c, f)=>BFetch(pub + "/validateMobileForForgetPwd", p, c, f),
    resetPasswordForForgetPwd: (p, c, f)=>BFetch(pub + "/resetPasswordForForgetPwd", p, c, f),
    updateUser: (p, c, f)=>_updateUser(api + "/User/updateUser", p, c, f),
    validatePassword: (p, c, f)=>BFetch(api + "/User/validatePassword", p, c, f),
    validateMobileForResetMobile: (p, c, f)=>BFetch(api + "/User/validateMobileForResetMobile", p, c, f),
    resetMobileNo: (p, c, f)=>_resetMobileNo(api + "/User/resetMobileNo", p, c, f),
    resetPasswordForChangePwd: (p, c, f)=>BFetch(api + "/User/resetPasswordForChangePwd", p, c, f),
    updateUserHead: (p, c, f)=> _updateUserHead(p, c, f),
    updateCompBaseInfo: (p, c, f)=> _updateCompBaseInfo(p, c, f),
    submitOrg: (p, c, f)=> _submitOrg(p, c, f),
    cancleBillDiscount: (p, c)=>_cancleBillDiscount(api + "/BillDiscountAdmin/cancleBillDiscount", p, c),
    createBillDiscount: (p, c)=>_createBillDiscount(api + "/BillDiscountAdmin/createBillDiscount", p, c),
    giveUpBillDiscount: (p, c)=>_giveUpBillDiscount(api + "/BillDiscountAdmin/giveUpBillDiscount", p, c),
    getStdOrg: (p, c, f)=>PFetch(api + '/Organization/getStdOrg', p, c, f, {custLoading: true}),
    sendSMSCodeForDiscount: (p, c, f)=>BFetch(api + "/User/sendSMSCodeToOldMobile", p, c, f),
    validateMobileForDiscount: (p, c, f)=>PFetch(api + "/User/validateSMSCodeAfterLogin", p, c, f),
    clearMessageDetail: (p)=>_clearMessageDetail(p),
    setOtherMsgRead: (p, c, f) => PFetch(api + "/MessageSearch/setOtherMsgRead", p, c, f),
    setBillRevRead: (p, c, f) => PFetch(api + "/MessageSearch/setBillRevRead", p, c, f),
    feedbackOpinion: (p, c, f)=>BFetch(api + "/User/feedbackOpinion", p, c, f),
    downloadCertificate: ()=>_downloadCertificate(),
    getFile: (fid)=>host + api + '/File/downLoad/' + fid + '?token=' + token(),
    getProtocol: ()=>host + '/protocol.html',
    getRegion: (f, e)=>_getRegion(f, e),
    startRPC: (option)=>_startRPC(option),
    endRPC: (option, handle)=>_endRPC(option, handle),
    setDemoFlag: ()=> {AppDispatcher.dispatch({type: ActionTypes.DEMO_FLAG});},
    clear: ()=> {AppDispatcher.dispatch({type: ActionTypes.LOGOUT,});},
    forceLogOut: ()=> {AppDispatcher.dispatch({type: ActionTypes.FORCE_LOGOUT});}
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

var uploadFileHandle = function (params, fileFieldName) {
    return function (callback) {
        UFetch(api + '/File/uploadFile',
            {
                uri: params[name],
                type: 'image/jpeg',
                name: name,
            },
            function (data) {
                callback(null, name);
            },
            function (err) {
                callback(err, name);
            });
    }
}

var _updateUserHead = function (p, c, f) {
    async.series([uploadFileHandle(p,'photoStoreId')],
        function (err, res) {
            if (err) {
                f();
            } else {
                Actions.updateUser(
                    {photoStoreId: data.fileId},
                    function(data){
                        
                    },
                    function(err){
                        
                    }
                )
            }
        }
    );
}
var _updateUser = function (u, p, c, f) {
    var key = _.keys(p)[0];
    var value = p[key]
    BFetch(u, {column: key, value: value},
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
    BFetch(u, p,
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
    BFetch(url, {},
        function () {
            AppDispatcher.dispatch({
                type: ActionTypes.LOGOUT,
            });
        }, null, {isLogout: true}
    )
}

var _login = function (url, p, c, f) {

    BFetch(url, p,
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

    BFetch(url, p,
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
    BFetch(url, p,
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
    async.series([
            uploadFileHandle(p,'licenseCopyFileId'),
            uploadFileHandle(p,'orgCodeCopyFileId'),
            uploadFileHandle(p,'taxFileId'),
            uploadFileHandle(p,'corpIdentityFileId'),
            uploadFileHandle(p,'authFileId'),
            uploadFileHandle(p,'authIdentityFileId'),
        ],
        function (err, res) {
            if (err) {
                f();
            } else {
                BFetch(api + "/Organization/updateOrg", p,
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

var _notificationRegister = function (token) {
    AppDispatcher.dispatch({
        type: ActionTypes.SAVE_APNS_TOKEN,
        token: token
    });

}

var _onNotification = function (notification) {
    
    BFetch(api + "/MessageSearch/getPushMsg", {}, function (data) {
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