var React = require('react-native');
var {
  NetInfo
  } = React;
var info = {
  initLoadingState: true,
  CHANGE_EVENT: 'change',
  netWorkState: false,
  requestHandle: null,
  isLogout: false,
  isForce_Logout: false
}
var {BFetch,PFetch,UFetch,host,token} = require('../network/fetch');
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
var MsgContent = Notification.MsgContent;
var RequestState = require('../../constants/requestState');
var requestLoadingState = RequestState.IDEL;

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

  getNetWorkState: ()=> info.netWorkState,

  getInitLoadingState: ()=>info.initLoadingState,

  requestLoadingState: ()=>requestLoadingState,

  requestHandle: ()=>info.requestHandle,

  isLogout: ()=>info.isLogout,

  isForceLogout: ()=>info.isForce_Logout,

  getAPNSToken: ()=>_data.APNSToken,

  getToken: ()=>_data.token,

  getData: ()=>_data,

  getMainMsgBean: () => _mainMsgBean,

  getUserName: () => _data.userInfoBean.userName,

  init: function (data) {
    info.initLoadingState = false;
    _data = data;
  },
});

var _initOrgBean = function () {
  if (_data.orgBeans == null || typeof (_data.orgBeans) == 'undefined' || typeof(_data.orgBeans[0]) == 'undefined') {
    var defaultAdd = '../../image/user/defaultAdd.png';
    var orgBean = ({
      orgCode: '',
      orgName: '',
      email: '',
      address: '',
      orgType: '',
      bizLicenseRegNo: '',
      bizLicenseRegLoc: '',
      foundationDate: '',
      businessTerm: '',
      businessScope: '',
      registeredCapital: '',
      accountName: '',
      accountNo: '',
      reservedMobileNo: '',
      licenseCopyFileId: '',
      orgCodeCopyFileId: '',
      taxFileId: '',
      corpFileId: '',
      authFileId: '',
      corpIdentityFileId: '',
      authIdentityFileId: '',
      biStatus: 'UNAUDITING',
      cmStatus: '',
      raStatus: '',
    })
    _data.orgBeans = [orgBean]
  }
};
//
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
      info.initLoadingState = false;
      _data = data;
      Notification.setMsgContent(_data.userInfoBean.userName)
      Persister.getMsgData(
        (data) => {
          _mainMsgBean = data;
        }
      )
      _initOrgBean();
      info.isLogout = false;
      AppStore.emitChange();
    })
}
//
var _login = function (data) {
  _data = data;
  Notification.setMsgContent(_data.userInfoBean.userName)
  _initOrgBean();
  Persister.getMsgData(
    function (mainMsgData) {
      if (!mainMsgData[MsgContent.MAIN_MSG] && !mainMsgData[MsgContent.SENT_MSG] && !mainMsgData[MsgContent.MARKET_MSG] && !mainMsgData[MsgContent.SYSTEM_MSG]) {
        //TODO: 构建基本的mainMsgBean对象
        var emptyData = {
          'mainMsgBean': {
            'pageIndex': 1,
            'billSentBean': null,
            'messageBeans': [],
            'marketNewsBean': null,
            'systemNoticeBean': null,
            'billRevUnreadNum': 0
          },
          'sentBillMsgBeans': [],
          'marketMsgBeans': [],
          'systemMsgBeans': []
        };
        console.log('kong');
        Persister.saveMsgData(emptyData);
        _mainMsgBean = emptyData;
      } else {
        console.log('NoKong');
        _mainMsgBean = mainMsgData;
      }
    }
  )
  AppStore.emitChange()
  //_getPushMsg("/api/MessageSearch/getPushMsg");
  Persister.getAppData((d) => {
    data.demoFlag = d.demoFlag;
    if (!d.demoFlag) {
      data.demoFlag = {flag: false};
    }
    Persister.saveAppData(data);
  });
}
//
var _cancleBillDiscount = function (data) {
  _data.revBillBean.contentList.map((item, index)=> {
    if (item.billId == data.billId) {
      _data.revBillBean.contentList[index].status = "NEW";
    }
  });
  AppStore.emitChange();
}
//
var _giveupBillDiscount = function (data) {
  _data.revBillBean.contentList.map((item, index)=> {
    if (item.billId == data.billId) {
      _data.revBillBean.contentList[index].status = "IGN";
    }
  });
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
  AppStore.emitChange();
}
//
var _rejectBillDiscount = function (data) {
  _data.sentBillBean.contentList.map((item, index)=> {
    if (item.billId == data.billId) {
      _data.sentBillBean.contentList[index].status = "IGN";
    }
  });
  AppStore.emitChange();
}

var _getUserName = () => {

}

var _createBillDiscount = function (data) {
  _data.revBillBean.contentList.map((item, index)=> {
    if (item.billId == data.billId) {
      _data.revBillBean.contentList[index].status = "REQ";
    }
  });
  AppStore.emitChange();
}

var _getMsgType = function (msg) {
  return msg.msgType;
}

var _getMsgBody = function (msg) {
  return msg.msgBody;
}

var _pushMsg = function (data, key) {
  _.isEmpty(_mainMsgBean[key]) ? _mainMsgBean[key] = new Array(data) : _mainMsgBean[key] = [data].concat(_mainMsgBean[key]);
}
//
var _getBillBody = function (msg) {
  return msg.billBody;
}

var _updateMainMsgBeanByNotify = function (arrayKeyName, beanKeyName, data) {
  _pushMsg(data, arrayKeyName);
  _.isEmpty(_mainMsgBean[MsgContent.MAIN_MSG]) ? _mainMsgBean[MsgContent.MAIN_MSG] = new Object() : "";
  let unReadNum = _.isEmpty(_mainMsgBean[MsgContent.MAIN_MSG][beanKeyName]) ? 0 : _mainMsgBean[MsgContent.MAIN_MSG][beanKeyName].unReadNum;
  data.unReadNum = ++unReadNum;
  _mainMsgBean[MsgContent.MAIN_MSG][beanKeyName] = data;
}

var _addBillPackByNotify = function (keyName, data) {
  if (_.isEmpty(_data[keyName]) || _.isEmpty(_data[keyName].contentList)) {
    _data[keyName] = {contentList: new Array()};
  }
  _data[keyName].contentList = [data].concat(_data[keyName].contentList);
}

var _analysisMessageData = function (data) {
  //数据插入到对应的bean中 并替换main里的
  let d = _getMsgBody(data);
  switch (_getMsgType(data)) {
    case MsgTypes.BILL_DRAW:
    {
      //billPack
      _addBillPackByNotify('sentBillBean', _getBillBody(data));
      _updateMainMsgBeanByNotify('sentBillMsgBeans', 'billSentBean', d);
    }
      break;
    case MsgTypes.OPP_IGNORED:
    {
      //对方放弃贴现
      _rejectBillDiscount(_getBillBody(data));
      _updateMainMsgBeanByNotify('sentBillMsgBeans', 'billSentBean', d);
    }
      break;//
    case MsgTypes.MARKET_NEWS:
    {
      _updateMainMsgBeanByNotify('marketMsgBeans', 'marketNewsBean', d);
    }
      break;
    case MsgTypes.ORG_AUTH_FAIL:
    case MsgTypes.ORG_AUTH_OK:
    {

      _updateMainMsgBeanByNotify('systemMsgBeans', 'systemNoticeBean', d);
    }
      break;//
    case MsgTypes.REV_NEW_BILL://区分
    {
      //messageBeans
      _.isEmpty(_mainMsgBean[MsgContent.MAIN_MSG]['messageBeans']) ? _mainMsgBean[MsgContent.MAIN_MSG]['messageBeans'] = new Array(d) : _mainMsgBean[MsgContent.MAIN_MSG]['messageBeans'] = [d].concat(_mainMsgBean[MsgContent.MAIN_MSG]['messageBeans']);
      _addBillPackByNotify('revBillBean', _getBillBody(data));
    }
      break;
    case MsgTypes.APPROVE_DISCOUNT:
    {
      //messageBeans
      _.isEmpty(_mainMsgBean[MsgContent.MAIN_MSG]['messageBeans']) ? _mainMsgBean[MsgContent.MAIN_MSG]['messageBeans'] = new Array(d) : _mainMsgBean[MsgContent.MAIN_MSG]['messageBeans'] = [d].concat(_mainMsgBean[MsgContent.MAIN_MSG]['messageBeans']);
      //批准贴现
      _allowBillDiscount(_getBillBody(data));
    }
      break;//
    case MsgTypes.LOGIN_OUT:
      _force_logout();
      break;
  }
}
//
var _freshMessageData = function (data) {
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
  _data.token = null;
  Persister.clearToken();
  info.isLogout = true;
  info.isForce_Logout = true;
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
      Persister.clearToken();
      info.isLogout = true;
      AppStore.emitChange();
      break;
    case ActionTypes.FORCE_LOGOUT:
      _force_logout();
      AppStore.emitChange();
      break;
    case ActionTypes.UPDATE_USERINFO:
      _data.userInfoBean = _.assign(_data.userInfoBean, action.data);
      Persister.saveUser(_data.userInfoBean);
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
    case ActionTypes.UPDATE_COMPBASEINFO:
      _data.orgBeans[0] = _.assign(_data.orgBeans[0], action.data);
      _data.userInfoBean = _.assign(_data.userInfoBean, action.data);
      Persister.saveOrg(_data.orgBeans);
      AppStore.emitChange();
      if (action.successHandle)action.successHandle();
      break;
    case ActionTypes.SAVE_APNS_TOKEN:
      _data.APNSToken = action.token;
      Persister.saveAPNSToken(action.token);
      console.log(action.token);
      break;
    case ActionTypes.PUSH_NOTIFICATION:
      //console.log('data:' + action.data);
      _freshMessageData(action.data);
      break;
    case ActionTypes.CLEAR_MESSAGEDETAIL:
      var message = _mainMsgBean[MsgContent.MAIN_MSG][action.data];
      message.unReadNum = 0;
      Persister.saveMsgDetail(_mainMsgBean[MsgContent.MAIN_MSG]);
      break;
    case ActionTypes.DEMO_FLAG:
      _data.demoFlag = {flag: true};
      Persister.saveDemoFlag({flag: true, id: AppStore.getUserId()});
    case ActionTypes.GET_PUSH_MSG:
      _savePushMsg(action.data);
    default:
  }
});

module.exports = AppStore;