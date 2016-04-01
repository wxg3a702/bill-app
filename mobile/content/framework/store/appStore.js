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
            if (_data.token == '') {
                _data.token = null;
                SP.setTokenToSP(' ');
            } else {
            SP.setTokenToSP(_data.token);
            }
            info.isLogout = false;
            AppStore.emitChange();
        })
}
//
var _login = function (data) {
    var id = data.userInfoBean.id;
    Persister.getAppData((d) => {
        data.demoFlag = d.demoFlag;
        if (!d.demoFlag) {
            data.demoFlag = {id: data.userInfoBean.id, flag: false};
        }
        if (_.isEmpty(d)) {
            data.certifiedOrgBean = !data.certifiedOrgBean ? '' : orgToJson(data.certifiedOrgBean)
            Persister.saveAppData(data);
        } else {
            data.certifiedOrgBean = !data.certifiedOrgBean ? '' : orgToJson(data.certifiedOrgBean)
            Persister.saveLoginData(data, d);
        }
        Persister.getAppData((datas) => {
            _data = datas;
            SP.setTokenToSP(_data.token);
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

    AppStore.emitChange();
}

var _createBillDiscount = function (data) {
    _data.revBillBean.contentList.map((item, index)=> {
        if (item.billId == data.billId) {
            _data.revBillBean.contentList[index].status = "REQ";
        }
    });
    Persister.saveAppData(_data);
    AppStore.emitChange();
}

var _getMsgType = function (msg) {
    return msg.msgType;
}

var _getMsgBody = function (msg) {
    return msg.msgBody;
}

var _changeCompStatus = function (data) {
    _data.certifiedOrgBean.map((item, index)=> {
        if (item.id == data.id) {
            _data.certifiedOrgBean[index] = data
        }
    })
    Persister.saveAppData(_data)
    AppStore.emitChange();
}

var _pushMsg = function (data, key) {
    _.isEmpty(_data[key]) ? _data[key] = new Array(data) : _data[key] = [data].concat(_data[key]);
    Persister.saveAppData(_data)
}
//
var _getBillBody = function (msg) {
    return msg.billBody;
}

var _updateMainMsgBeanByNotify = function (arrayKeyName, beanKeyName, data) {
    _pushMsg(data, arrayKeyName);
    _.isEmpty(_data.mainMsgBean) ? _data.mainMsgBean = new Object() : "";
    let unReadNum = _.isEmpty(_data.mainMsgBean[beanKeyName]) ? 0 : _data.mainMsgBean[beanKeyName].unReadNum;
    data.unReadNum = ++unReadNum;
    _data.mainMsgBean[beanKeyName] = data;
    Persister.saveAppData(_data)
}

var _addBillPackByNotify = function (keyName, data) {
    if (_.isEmpty(_data[keyName]) || _.isEmpty(_data[keyName].contentList)) {
        _data[keyName] = {contentList: new Array()};
    }
    _data[keyName].contentList = [data].concat(_data[keyName].contentList);
    Persister.saveAppData(_data)
}

var _analysisMessageData = function (data) {
    //数据插入到对应的bean中 并替换main里的
    let d = _getMsgBody(data);
    switch (_getMsgType(data)) {
        case MsgTypes.COMP_CERTIFICATION:
        {
            //compCertification
            _changeCompStatus(data.comp)
        }
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
        {
            _updateMainMsgBeanByNotify('systemMsgBeans', 'systemNoticeBean', d);
            break;
        }
        case MsgTypes.ORG_AUTH_OK:
        {
            _updateMainMsgBeanByNotify('systemMsgBeans', 'systemNoticeBean', d);
            if (data.revBillList) {
                _addBillPackByNotify('revBillBean', data.revBillList);
            }
            if (data.sentBillList) {
                _addBillPackByNotify('sentBillBean', data.sentBillList);
            }
        }
            break;//
        case MsgTypes.REV_NEW_BILL://区分
        {
            //messageBeans
            _.isEmpty(_data.mainMsgBean['messageBeans']) ? _data.mainMsgBean['messageBeans'] = new Array(d) : _data.mainMsgBean['messageBeans'] = [d].concat(_data.mainMsgBean['messageBeans']);
            Persister.saveAppData(_data)
            _addBillPackByNotify('revBillBean', _getBillBody(data));
            AppStore.emitChange();
        }
            break;
        case MsgTypes.APPROVE_DISCOUNT:
        {
            //messageBeans
            _.isEmpty(_data.mainMsgBean['messageBeans']) ? _data.mainMsgBean['messageBeans'] = new Array(d) : _data.mainMsgBean['messageBeans'] = [d].concat(_data.mainMsgBean['messageBeans']);
            //批准贴现
            _allowBillDiscount(_getBillBody(data));
        }
            break;//
        case MsgTypes.LOGIN_OUT:
            _force_logout();
            break;
    }
    AppStore.emitChange();
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
    Persister.clearToken(_data);
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
            Persister.clearToken(_data);
            info.isLogout = true;
            Persister.getAppData((datas) => {
                var a = datas;
            }, _data.userInfoBean.id)
            AppStore.emitChange();
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
            let con = new Array();
            _data.certifiedOrgBean.map((item, index)=> {
                if (action.data.orgId != item.id) {
                    con.push(item)
                }
            })
            _data.certifiedOrgBean = con
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
            _data.certifiedOrgBean = _.assign(_data.certifiedOrgBean, action.data);
            Persister.saveAppData(_data);
            AppStore.emitChange();
            if (action.successHandle)action.successHandle();
            break;
        case ActionTypes.UPDATE_EXISTORG:
            _data.certifiedOrgBean.map((item, index)=> {
                if (item.id == action.data.id) {
                    item = _.assign(item, action.data)
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
        //Persister.saveDemoFlag({flag: true, id: AppStore.getUserId()});
        case ActionTypes.GET_PUSH_MSG:
            _getPushMsg(action.data);
        default:
    }
});

module.exports = AppStore;