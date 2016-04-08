var {BFetch, PFetch, UFetch, host, token} = require('../network/fetch');
var async = require('async')
var AppDispatcher = require('../dispatcher/appDispatcher');
var Command = require('../../constants/command');
var ActionTypes = Command.ActionTypes;
var _ = require('lodash');
var AppStore = require('../store/appStore');
var pub = "/pub";
var api = "/api"
var CommonActions = {
    appInit: ()=>_appInit(),
    notificationRegister: (token)=>_notificationRegister(token),
    onNotification: (notification)=>_onNotification(notification),
    freshNotification: (notification)=>_onNotification(notification),
    startRPC: (option)=>_startRPC(option),
    endRPC: (option, handle)=>_endRPC(option, handle),
    changeSwitch: (p, c)=>_changeSwitch(p, c)
}
var _appInit = function () {
    AppDispatcher.dispatch({
        type: ActionTypes.APP_INIT,
    });
}
var _changeSwitch = function (p, c) {
    AppDispatcher.dispatch({
        type: ActionTypes.CHANGE_SWITCH,
        data: p,
        successHandle: c
    })
}
var _notificationRegister = function (token) {
    AppDispatcher.dispatch({
        type: ActionTypes.SAVE_APNS_TOKEN,
        token: token
    });

}

var _onNotification = function (notification) {
    console.log('111111Basic  ' + AppStore.getToken());
    BFetch(api + "/MessageSearch/getPushMsg", {}, function (data) {
        AppDispatcher.dispatch({
            type: ActionTypes.PUSH_NOTIFICATION,
            data: data
        });
    }, null, {custLoading: true});
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
module.exports = CommonActions