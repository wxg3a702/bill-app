var React = require('react-native');
var {
    AsyncStorage,
    } = React;
var Notification = require('../../constants/notification');
var MsgContent = Notification.MsgContent;
var Actions = {
    getAppData: (cb)=> {
        _getAppData(cb)
    },
    saveAppData: (data)=> {
        _saveAppData(data)
    },

    getMsgData: (cb) => {
        _getMsgData(cb)
    },
    saveMsgData: (data)=> {
        _saveMsgData(data)
    },

    clearToken: ()=>_clearToken(),
    setItem: (k, v, c)=>_setItem(k, v, c),
    saveUser: (p, c)=>_saveUser(p, c),
    saveOrg: (p, c)=>_saveOrg(p, c),
    saveNewOrg: (p, c)=>_saveNewOrg(p, c),
    saveAPNSToken: (p)=>_saveAPNSToken(p),
    saveMsgDetail: (p)=>_saveMsgDetail(p),
    saveDemoFlag: (p)=>_saveDemoFlag(p),
    saveMainMsgBean: (p)=>_saveMainMsgBean(p)
    //getUnReadnum:
}
//?


var _saveUser = function (user, cb) {
    _setItem('userInfoBean', user, cb);
}

var _saveNewOrg = function (user, cb) {
    _setItem('newOrg', user, cb);
}

var _saveOrg = function (user, cb) {
    _setItem('certifiedOrgBean', user, cb);
}

var _saveAPNSToken = function (data, cb) {
    _setItem('APNSToken', data, cb);
}
var _saveMsgDetail = function (data, cb) {
    _setItem('mainMsgBean', data, cb);
}
var _saveMainMsgBean = function (data, cb) {
    _setItem('mainMsgBean', data, cb);
}
var _clearToken = function () {
    AsyncStorage.removeItem("token", function (err) {
    })
}

var _saveDemoFlag = function (flag, cb) {
    _setItem('demoFlag', flag, cb);
}

var _setItem = function (key, value, cb) {
    AsyncStorage.setItem(key, JSON.stringify(value), function (err) {
        if (cb)cb();

    })
}


var _getAppData = function (cb) {
    AsyncStorage.multiGet(['token', 'APNSToken', 'revBillBean', 'sentBillBean', 'filterBeans', 'userInfoBean', 'certifiedOrgBean'
        , 'demoFlag', 'newOrg']).then(
        (data) => {
            var dataJson = {};
            data.map((item, index)=> {
                dataJson[item[0]] = JSON.parse(item[1])
            })
            if (cb)cb(dataJson);
        });
}

var _saveAppData = function (data) {
    AsyncStorage.multiSet([
        ["revBillBean", JSON.stringify(data.revBillBean)],
        ["sentBillBean", JSON.stringify(data.sentBillBean)],
        ["filterBeans", JSON.stringify(data.filterBeans)],
        ["userInfoBean", JSON.stringify(data.userInfoBean)],
        ["token", JSON.stringify(data.token)],
        ["orgBeans", JSON.stringify(data.orgBeans)]
        ["certifiedOrgBean", JSON.stringify(!data.certifiedOrgBean ? '' : data.certifiedOrgBean)],
        ["demoFlag", JSON.stringify(data.demoFlag)],
        ["newOrg", JSON.stringify(!data.newOrg ? '' : data.newOrg)]
    ])
}
var _getMsgData = function (cb) {
    //获得本地的数据
    AsyncStorage.multiGet([MsgContent.MAIN_MSG, MsgContent.SENT_MSG,MsgContent.MARKET_MSG,MsgContent.SYSTEM_MSG]).then(
      (data) => {
          var dataJson = {};
          data.map((item, index)=> {
              dataJson[item[0]] = JSON.parse(item[1])
          })
          if (cb)cb(dataJson);
      }
    );

}

var _saveMsgData = function (data) {
    AsyncStorage.multiSet([
        [MsgContent.MAIN_MSG, JSON.stringify(data.mainMsgBean)],
        [MsgContent.SENT_MSG, JSON.stringify(data.sentBillMsgBeans)],
        [MsgContent.MARKET_MSG, JSON.stringify(data.marketMsgBeans)],
        [MsgContent.SYSTEM_MSG, JSON.stringify(data.systemMsgBeans)]
    ])
}

module.exports = Actions;