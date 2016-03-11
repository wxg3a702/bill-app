var {BFetch,PFetch,UFetch,host,token} = require('../network/fetch');
var async = require('async')
var AppDispatcher = require('../dispatcher/appDispatcher');
var Command = require('../../constants/command');
var ActionTypes = Command.ActionTypes;
var _ = require('lodash');
var pub = "/pub";
var api = "/api"
var MessageActions = {
    setOtherMsgRead: (p, c, f) => PFetch(api + "/MessageSearch/setOtherMsgRead", p, c, f),
    setBillRevRead: (p, c, f) => PFetch(api + "/MessageSearch/setBillRevRead", p, c, f),
    clearMessageDetail: (p)=>_clearMessageDetail(p),
}
var _clearMessageDetail = function (p) {
    AppDispatcher.dispatch({
        type: ActionTypes.CLEAR_MESSAGEDETAIL,
        data: p,
    })
}
module.exports = MessageActions