var React = require('react-native');
var {
  NetInfo,
  Platform
  } = React;
var info = {
  initLoadingState: true,
  CHANGE_EVENT: 'change',
  netWorkState: false,
  requestHandle: null,
  isLogout: false,
  isForce_Logout: false
}

var DateHelper = require('../../comp/utils/dateHelper');
var {BFetch, PFetch, UFetch, host, token} = require('../network/fetch');
var _data = {};
var _mainMsgBean = {};
var _ = require('lodash');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('../dispatcher/appDispatcher');
var Persister = require('../persister/persisterFacade');
var AppConstants = require('../../constants/command');
var ActionTypes = AppConstants.ActionTypes;
var Notification = require('../../constants/notification');
var MsgTypes = Notification.MsgTypes;
var RequestState = require('../../constants/requestState');
var requestLoadingState = RequestState.IDEL;
var CommonAction = require('../action/commonAction');
var SP = require('NativeModules').SPModule;
var ServiceModule = require('NativeModules').ServiceModule;
var dateFormat = require('dateformat');

var AppStore = assign({}, EventEmitter.prototype, {

  addChangeListener: function (callback, event) {
    if (!event)event = info.CHANGE_EVENT
    this.on(event, callback);
  },

  removeChangeListener: function (callback, event) {
    if (!event)event = info.CHANGE_EVENT
    this.removeListener(event, callback);
  },

  emitChange: function (event) {
    if (!event)event = info.CHANGE_EVENT
    this.emit(event);
  },
  getRevBillMessage: ()=>_data.revBillMessage,

  getNewsMessage: ()=>_data.newsMessage,

  getNetWorkState: ()=> info.netWorkState,

  getInitLoadingState: ()=>info.initLoadingState,

  requestLoadingState: ()=>requestLoadingState,

  requestHandle: ()=>info.requestHandle,

  isLogout: ()=>info.isLogout,

  isForceLogout: ()=>info.isForce_Logout,

  getAPNSToken: ()=>_data.APNSToken,

  getToken: ()=>_data.token,

  getData: ()=>_data,

  getUserName: () => _data.userInfoBean.userName,

  init: function (data) {
    info.initLoadingState = false;
    _data = data;
  },
});

var _handleConnectivityChange = function (isConnected) {
  info.netWorkState = isConnected;
}
//
var _appInit = function (data) {
  NetInfo.isConnected.addEventListener(
    'change',
    _handleConnectivityChange
  );
  NetInfo.isConnected.fetch().done(
    (isConnected) => {
      info.netWorkState = isConnected;
    }
  );
  Persister.getAppData(
    function (data) {
      // data.demoFlag = {id: data.userInfoBean.id, flag: false};
      info.initLoadingState = false;
      _data = data;
      if (!data.demoFlag) {
        _data.revBillMessage = true;
        _data.newsMessage = true;
      }
      if (_data.token == '' && _.isEmpty(_data.token)) {
        _data.token = null;
        if (Platform.OS === 'android') SP.setTokenToSP(' ');
      } else {
        if (Platform.OS === 'android' && _data.token) {
          SP.setTokenToSP(_data.token);
          ServiceModule.setIsLoginToSP(true);
          ServiceModule.startAppService();
        }

      }
      info.isLogout = false;
      AppStore.emitChange();
    })
}
//
var _login = function (data) {
  var id = data.userInfoBean.id;
  // modify isLogOutFlag
  info.isLogout = false;
  info.isForce_Logout = false;

  Persister.getAppData((d) => {
    data.demoFlag = d.demoFlag;
    if (!d.demoFlag) {
      data.demoFlag = {id: data.userInfoBean.id, flag: false};
      data.revBillMessage = true;
      data.newsMessage = true;
      Persister.saveAppData(data);
    } else {
      Persister.saveLoginData(data, d);
    }
    Persister.getAppData((datas) => {
      _data = datas;
      if (Platform.OS === 'android') {
        SP.setTokenToSP(_data.token);
        ServiceModule.setIsLoginToSP(true);
        ServiceModule.startAppService();
      }
      initNewOrg();
      AppStore.emitChange();
    }, id)
  }, id);
}
var orgToJson = function (data) {
  var json = {};
  data.map((item)=> {
    if (!item.certResultBeans) {
    } else {
      item.certResultBeans.map((items)=> {
        json[_.camelCase(items.columnName)] = items
      })
      item.certResultBeans = json
    }
  })
  return data;
}
//
var initNewOrg = function () {
  _data.newOrg = {
    licenseCopyFileId: '',
    authFileId: '',
    corpIdentityFileId: '',
    authIdentityFileId: '',
    accountName: '',
    accountNo: '',
    openBank: '',
    picEnough: false,
  }
}

var _cancleBillDiscount = function (data) {
  _data.revBillBean.contentList.map((item, index)=> {
    if (item.billId == data.billId) {
      _data.revBillBean.contentList[index].status = "NEW";
    }
  });
  Persister.saveAppData(_data);
  AppStore.emitChange();
}
//
var _giveupBillDiscount = function (data) {
  _data.revBillBean.contentList.map((item, index)=> {
    if (item.billId == data.billId) {
      _data.revBillBean.contentList[index].status = "IGN";
    }
  });
  Persister.saveAppData(_data);
  AppStore.emitChange();
}
//
var _allowBillDiscount = function (data) {
  _data.revBillBean.contentList.map((item, index)=> {
    if (item.billId == data.billId) {
      _data.revBillBean.contentList[index] = data;
      //_data.revBillBean.contentList[index].status = "DIS";
    }
  });
  Persister.saveAppData(_data);
  AppStore.emitChange();
}
//
var _rejectBillDiscount = function (data) {
  _data.sentBillBean.contentList.map((item, index)=> {
    if (item.billId == data.billId) {
      _data.sentBillBean.contentList[index] = data;
    }
  });
  Persister.saveAppData(_data);
}

var _createBillDiscount = function (data) {
  _data.revBillBean.contentList.map((item, index)=> {
    if (item.billId == data.billId) {
      _data.revBillBean.contentList[index].status = "REQ";
      _data.revBillBean.contentList[index].discountBankName = data.discountBankName;
      _data.revBillBean.contentList[index].discountRate = data.discountRate;
      _data.revBillBean.contentList[index].applyDiscountDate = _.now();
    }
  });
  Persister.saveAppData(_data);
  AppStore.emitChange();
};

var _getMsgType = function (msg) {
  return msg.msgType;
};

var _getMsgBody = function (msg) {
  return msg.msgBody;
};

var _changeCompStatus = function (data) {
  _data.certifiedOrgBean = data;
  Persister.saveAppData(_data);
};

var _pushMsg = function (data, key) {
  if (_.isEmpty(_data[key])) _data[key] = [];
  let isRecur = false;
  for (let item of _data[key]) {
    if (item.id == data.id) {
      isRecur = true;
      break;
    }
  }
  if (!isRecur) {
    _data[key] = [data].concat(_data[key])
  }
  Persister.saveAppData(_data)
}
//
var _getBillBody = function (msg) {
  return msg.billBody;
}

var _updateMainMsgBeanByNotify = function (arrayKeyName, beanKeyName, data) {
  _.isEmpty(_data.mainMsgBean) ? _data.mainMsgBean = {} : "";
  let unReadNum = _.isEmpty(_data.mainMsgBean[beanKeyName]) ? 0 : _data.mainMsgBean[beanKeyName].unReadNum;
  let isRecur = false;
  if (_.isEmpty(_data[arrayKeyName])) {
    _data[arrayKeyName] = [];
  } else {
    if (_data[arrayKeyName].length > 0) {
      _data[arrayKeyName].map((item, index)=>{
        if (data.id == item.id) {
          isRecur = true;
        }
      });

      //for (let [index, item] of _data[arrayKeyName].entries()) {
      //  if (index > 4) {
      //    break;
      //  }
      //  if (data.id == item.id) {
      //    isRecur = true;
      //    break;
      //  }
      //}
    }
  }
  if (!isRecur) data.unReadNum = ++unReadNum;
  _data.mainMsgBean[beanKeyName] = data;
  _pushMsg(data, arrayKeyName);
}

var _addBillPackByNotify = function (keyName, data) {
  if (_.isEmpty(_data[keyName]) || _.isEmpty(_data[keyName].contentList)) {
    _data[keyName] = {contentList: []};
  }
  let isRecur = false;
  _data[keyName].contentList.map((item, index)=>{
    if (item.billId == data.billId) {
      isRecur = true;
    }
  })
  //for (let [index, item] of _data[keyName].contentList.entries()) {
  //  if (index > 4) {
  //    break;
  //  }
  //  if (item.billId == data.billId) {
  //    isRecur = true;
  //    break;
  //  }
  //}
  if (!isRecur) {
    _data[keyName].contentList = [data].concat(_data[keyName].contentList);
  }
  Persister.saveAppData(_data)
}

var _updateUserInfo = (data) => {
  _data.userInfoBean = data;
  Persister.saveAppData(_data);
}
var _updateBillList = function (role, data) {
  let type = role == 'payee' ? 'revBillBean' : 'sentBillBean';
  _data[type].contentList.map((item, index)=>{
    if (item.billId == data.billId) {
      _data[type].contentList[index] = data;
      Persister.saveAppData(_data);
    }
  })
  //for (let [index, item] of _data[type].contentList.entries()) {
  //  if (item.billId == data.billId) {
  //    _data[type].contentList[index] = data;
  //    Persister.saveAppData(_data);
  //    break;
  //  }
  //}
};

var addRevBillMsg = function (d) {
  if (_.isEmpty(_data.mainMsgBean['messageBeans'])) {
    _data.mainMsgBean['messageBeans'] = new Array(d);
  } else {
    let isRecur = false;
    if (_data.mainMsgBean['messageBeans'].length > 0) {
      _data.mainMsgBean['messageBeans'].map((item, index)=>{
        if (item.billId == d.billId) {
          isRecur = true;
        }
      });
      //for(let [index, item] of _data.mainMsgBean['messageBeans'].entries()) {
      //  if (index > 4) {
      //    break;
      //  }
      //  if (item.billId == d.billId) {
      //    isRecur = true;
      //    break;
      //  }
      //}
      if (!isRecur) {
        _data.mainMsgBean['messageBeans'] = [d].concat(_data.mainMsgBean['messageBeans']);
      }
    }
  }
}

var _analysisMessageData = function (data) {
  //数据插入到对应的bean中 并替换main里的
  let d = _getMsgBody(data);
  switch (_getMsgType(data)) {
    case MsgTypes.BILL_DRAW:
    {
      //billPack
      _updateMainMsgBeanByNotify('sentBillMsgBeans', 'billSentBean', d);
      _addBillPackByNotify('sentBillBean', _getBillBody(data));
    }
      break;
    case MsgTypes.OPP_IGNORED:
    {
      _updateMainMsgBeanByNotify('sentBillMsgBeans', 'billSentBean', d);
      //对方放弃贴现
      _rejectBillDiscount(_getBillBody(data));
    }
      break;//
    case MsgTypes.MARKET_NEWS:
    {
      if (_data.newsMessage){
        _updateMainMsgBeanByNotify('marketMsgBeans', 'marketNewsBean', d);
        Persister.saveAppData(_data);
      }
    }
      break;
    case MsgTypes.ORG_AUTH_FAIL:
    {
      _updateMainMsgBeanByNotify('systemMsgBeans', 'systemNoticeBean', d);
      _changeCompStatus(data.certifiedOrgBody);
      break;
    }
    case MsgTypes.ORG_AUTH_OK:
    {
      _updateMainMsgBeanByNotify('systemMsgBeans', 'systemNoticeBean', d);
      if (!_.isEmpty(data.userBody) && data.userBody) {
        _updateUserInfo(data.userBody);
      }
      if (data.revBillList && _.isEmpty(data.revBillList) && data.revBillList.length > 0) {
        _addBillPackByNotify('revBillBean', data.revBillList);
      }
      if (data.sentBillList&& _.isEmpty(data.sentBillList) && data.sentBillList.length > 0) {
        _addBillPackByNotify('sentBillBean', data.sentBillList);
      }
      _changeCompStatus(data.certifiedOrgBody);
    }
      break;//
    case MsgTypes.REV_NEW_BILL://区分
    {
      if (_data.revBillMessage){
        //messageBeans
        //_.isEmpty(_data.mainMsgBean['messageBeans']) ? _data.mainMsgBean['messageBeans'] = new Array(d) : _data.mainMsgBean['messageBeans'] = [d].concat(_data.mainMsgBean['messageBeans']);
        addRevBillMsg(d);
      }
      _addBillPackByNotify('revBillBean', _getBillBody(data));
    }
      break;
    case MsgTypes.APPROVE_DISCOUNT:
    {
      if (_data.revBillMessage){
        //messageBeans
        //_.isEmpty(_data.mainMsgBean['messageBeans']) ? _data.mainMsgBean['messageBeans'] = new Array(d) : _data.mainMsgBean['messageBeans'] = [d].concat(_data.mainMsgBean['messageBeans']);
        addRevBillMsg(d);
      }
      //批准贴现
      _allowBillDiscount(_getBillBody(data));
    }
      break;//
    case MsgTypes.LOGIN_OUT:
      _force_logout();
      break;
    default:
      if (data.certifiedOrgBody && !_.isEmpty(data.certifiedOrgBody) && data.certifiedOrgBody.length > 0) {
        _changeCompStatus(data.certifiedOrgBody);
      }
      if (data.billBody && !_.isEmpty(data.billBody)) {
        _updateBillList(data.billBody.role, data.billBody);
      }
      if (data.userBody && !_.isEmpty(data.userBody)) {
        _updateUserInfo(data.userBody);
      }
      break;
  }
}
//
var _freshMessageData = function (data) {
  console.log('*** message data *** ' + data);
  if (!data || !data.nodeMsgBean || !data.nodeMsgBean.length)
    return;
  else {
    data.nodeMsgBean.map((item, index)=> {
      _analysisMessageData(item);
    });
    AppStore.emitChange();
  }
}

var _getPushMsg = function (url) {
  //将取到的增量数据存到本地
  BFetch(url, {}, function (data) {
    AppDispatcher.dispatch({
      type: ActionTypes.PUSH_NOTIFICATION,
      data: data
    });
  }, null, {custLoading: true});
}

var _savePushMsg = function (data) {
  _freshMessageData(data)
}

var _force_logout = function () {
  if (Platform.OS === 'android') {
    ServiceModule.setIsLoginToSP(false);
    ServiceModule.stopAppService();
  }
  _data.token = null;
  Persister.clearToken(_data);
  info.isLogout = true;
  info.isForce_Logout = true;
}

var _deleteBill = function (orgCode) {
  let revCon = [];
  _data.revBillBean.contentList.map((item, index)=>{
    if (item.payeeOrgCode != orgCode) {
      revCon.push(item);
    }
  });
  _data.revBillBean.contentList = revCon;
  let sentCon = [];
  _data.sentBillBean.contentList.map((item, index)=>{
    if (item.drawerOrgCode != orgCode) {
      sentCon.push(item);
    }
  });
  _data.sentBillBean.contentList = sentCon;
}

AppStore.dispatchToken = AppDispatcher.register(function (action) {
  switch (action.type) {
    case ActionTypes.APP_INIT:
      _appInit()
      break;
    case ActionTypes.LOGIN:
      info.isLogout = false;
      _login(action.data)
      break;
    case ActionTypes.CANCLE_BILL_DISCOUNT:
      _cancleBillDiscount(action.data)
      break;
    case ActionTypes.CREATE_BILL_DISCOUNT:
      _createBillDiscount(action.data)
      break;
    case ActionTypes.GIVEUP_BILL_DISCOUNT:
      _giveupBillDiscount(action.data)
      break;
    case ActionTypes.LOGOUT:
      _data.token = null;
      Persister.clearToken(_data);
      info.isLogout = true;
      info.isForce_Logout = false;
      AppStore.emitChange();

      if (Platform.OS === 'android') {
        ServiceModule.setIsLoginToSP(false);
        ServiceModule.stopAppService();
      }

      break;
    case ActionTypes.FORCE_LOGOUT:
      _force_logout();
      AppStore.emitChange();
      break;
    case ActionTypes.UPDATE_USERINFO:
      _data.userInfoBean = _.assign(_data.userInfoBean, action.data);
      Persister.saveAppData(_data);
      AppStore.emitChange();
      if (action.successHandle)action.successHandle();
      break;
    case ActionTypes.REQUEST_START:
      requestLoadingState = RequestState.START
      AppStore.emitChange('rpc');
      break;
    case ActionTypes.REQUEST_END:
      requestLoadingState = RequestState.END
      info.requestHandle = action.handle;
      AppStore.emitChange('rpc');
      break;
    case ActionTypes.DELETE_ORGBEANS:
      let con = [];
      let orgCode;
      _data.certifiedOrgBean.map((item, index)=> {
        if (action.data.orgId != item.id) {
          con.push(item)
        } else {
          if (item.status == 'REJECTED') {

          } else {
            orgCode = item.stdOrgBean.orgCode;
            _deleteBill(orgCode);
          }
        }
      });
      _data.certifiedOrgBean = con;
      Persister.saveAppData(_data);
      AppStore.emitChange();
      if (action.successHandle)action.successHandle();
      break;
    case ActionTypes.UPDATE_ORGBEANS:
      _data.newOrg = _.assign(_data.newOrg, action.data);
      if (_data.newOrg.licenseCopyFileId != '' && _data.newOrg.authFileId != ''
        && _data.newOrg.corpIdentityFileId != '' && _data.newOrg.authIdentityFileId != '') {
        _data.newOrg.picEnough = true;
      }
      if (!_data.newOrg.transactionNumber) {
        _data.newOrg.transactionNumber = DateHelper.returnDate()
        _data.certifiedOrgBean.push(_data.newOrg)
      } else {
        _data.certifiedOrgBean[_.findIndex(_data.certifiedOrgBean, 'transactionNumber', action.data.transactionNumber)] = _data.newOrg
      }
      initNewOrg();
      Persister.saveAppData(_data);
      AppStore.emitChange();
      if (action.successHandle)action.successHandle();
      break;
    case ActionTypes.UPDATE_NEWORG:
      _data.newOrg = _.assign(_data.newOrg, action.data);
      if (_data.newOrg.licenseCopyFileId != '' && _data.newOrg.authFileId != ''
        && _data.newOrg.corpIdentityFileId != '' && _data.newOrg.authIdentityFileId != '') {
        _data.newOrg.picEnough = true;
      }
      Persister.saveAppData(_data);
      AppStore.emitChange();
      if (action.successHandle)action.successHandle();
      break;
    case ActionTypes.UPDATE_UNAUDITING:
      //_data.certifiedOrgBean = _.assign(_data.certifiedOrgBean, action.data);
      //Persister.saveAppData(_data);
      //AppStore.emitChange();
      //if (action.successHandle)action.successHandle();
      initNewOrg();
      Persister.saveAppData(_data);
      break;
    case ActionTypes.UPDATE_EXISTORG:
      _data.certifiedOrgBean.map((item, index)=> {
        if (item.id == action.data.id) {
          item = _.assign(item, action.data);
          let key = _.keys(action.data)[0];
          if (key == action.data.id) {
            key = _.keys(action.data)[1];
          }
          if (!item.cercertResultBeans) {
          } else {
            delete(item.cercertResultBeans[key])
          }
        }
      })
      Persister.saveAppData(_data);
      AppStore.emitChange();
      if (action.successHandle)action.successHandle();
      break;
    case ActionTypes.CHANGE_SWITCH:
      if (action.data.type == 'revBillMessage') {
        _data.revBillMessage = action.data.value
      } else if (action.data.type == 'newsMessage') {
        _data.newsMessage = action.data.value
      }
      Persister.saveAppData(_data);
      AppStore.emitChange();
      if (action.successHandle)action.successHandle();
      break;
    case ActionTypes.CLEAR_NEWORG:
      initNewOrg();
      Persister.saveAppData(_data);
      if (action.successHandle)action.successHandle();
      break;
    case ActionTypes.SAVE_APNS_TOKEN:
      _data.APNSToken = action.token;
      Persister.saveAPNSToken(action.token);
      console.log(action.token);
      break;
    case ActionTypes.PUSH_NOTIFICATION:
      _freshMessageData(action.data);
      break;
    case ActionTypes.CLEAR_MESSAGEDETAIL:
      var message = _data.mainMsgBean[action.data];
      message.unReadNum = 0;
      Persister.saveAppData(_data);
      break;
    case ActionTypes.DEMO_FLAG:
      _data.demoFlag = {id: _data.userInfoBean.id, flag: true};
      Persister.saveAppData(_data);
      break;
    //Persister.saveDemoFlag({flag: true, id: AppStore.getUserId()});
    case ActionTypes.GET_PUSH_MSG:
      _getPushMsg(action.data);
      break;
    default:
  }
});

module.exports = AppStore;