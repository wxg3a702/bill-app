var {BFetch,PFetch,UFetch,host,token} = require('../network/fetch');
var async = require('async')
var AppDispatcher = require('../dispatcher/appDispatcher');
var Command = require('../../constants/command');
var ActionTypes = Command.ActionTypes;
var _ = require('lodash');
var pub = "/pub";
var api = "/api"
var LoginActions = {
    getProtocol: ()=>host + '/protocol.html',
    login: (p, c, f)=>_login(pub + "/login", p, c, f),
    logOut: ()=>_logout(api + "/User/logout"),
    register: (p, c, f)=>_register(pub + "/register", p, c, f),
    validatePassword: (p, c, f)=>BFetch(api + "/User/validatePassword", p, c, f),
    validateMobileForResetMobile: (p, c, f)=>BFetch(api + "/User/validateMobileForResetMobile", p, c, f),
    sendSMSCodeToNewMobile: (p, c, f)=>PFetch(pub + "/sendSMSCodeToNewMobile", p, c, f),
    sendSMSCodeToNewMobileApi: (p, c, f)=>BFetch(api + "/User/sendSMSCodeToNewMobile", p, c, f),
    validateSMSCode: (p, c, f)=>PFetch(pub + "/validateSMSCode", p, c, f),
    validateMobileForReg: (p, c, f)=>BFetch(pub + "/validateMobileForReg", p, c, f),
    validateMobileForForgetPwd: (p, c, f)=>BFetch(pub + "/validateMobileForForgetPwd", p, c, f),
    resetPasswordForForgetPwd: (p, c, f)=>BFetch(pub + "/resetPasswordForForgetPwd", p, c, f),
    sendSMSCodeToOldMobile: (p, c, f)=>PFetch(pub + "/sendSMSCodeToOldMobile", p, c, f),
    resetMobileNo: (p, c, f)=>_resetMobileNo(api + "/User/resetMobileNo", p, c, f),
    resetPasswordForChangePwd: (p, c, f)=>BFetch(api + "/User/resetPasswordForChangePwd", p, c, f),
    forceLogOut: ()=> {
        AppDispatcher.dispatch({type: ActionTypes.FORCE_LOGOUT});
    },
    clear: ()=> {
        AppDispatcher.dispatch({type: ActionTypes.LOGOUT,});
    },
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
module.exports = LoginActions;