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
  getPushMsg: (p, c, f) => _getPushMsg(api + "/MessageSearch/getPushMsg", p, c, f),
  clearMessageDetail: (p)=>_clearMessageDetail(p),
}
var _clearMessageDetail = function (p) {
  AppDispatcher.dispatch({
    type: ActionTypes.CLEAR_MESSAGEDETAIL,
    data: p,
  })
}

var _getPushMsg = function (url, p, c, f) {
  PFetch(url, p,
    function (msg) {
      AppDispatcher.dispatch({
        type: ActionTypes.GET_PUSH_MSG,
        data: msg
      });
      c();
    }, f);
}
module.exports = MessageActions