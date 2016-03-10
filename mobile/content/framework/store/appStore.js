var React = require('react-native');
var {
    NetInfo
    } = React;

var _ = require('lodash');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var _data = {};
var _compInfoLevel = {}
var initLoadingState = false;
var CHANGE_EVENT = 'change';
var netWorkState = false;
var requestHandle;
var isLogout = false;
var isForce_Logout = false;

var KeyPointFile = require('../../biz/personalCenter/keyPointFile')
var LocationJson = require('../../biz/user/locationJson')
var AppDispatcher = require('../dispatcher/appDispatcher');
var Persister = require('../persister/persisterFacade');

var AppConstants = require('../../constants/command');
var ActionTypes = AppConstants.ActionTypes;
var MsgTypes = require('../../constants/notification').MsgTypes;
var MsgCategory = require('../../constants/notification').MsgCategory;
var RequestState = require('../../constants/requestState');
var requestLoadingState = RequestState.IDEL;

var AppStore = assign({}, EventEmitter.prototype, {

    addChangeListener: function (callback, event) {
        if (!event)event = CHANGE_EVENT
        this.on(event, callback);
    },

    removeChangeListener: function (callback, event) {
        if (!event)event = CHANGE_EVENT
        this.removeListener(event, callback);
    },

    emitChange: function (event) {
        if (!event)event = CHANGE_EVENT
        this.emit(event);
    },


    init: function (data) {
        initLoadingState = false;
        _data = data;
    },

    getNetWorkState: ()=> netWorkState,

    getInitLoadingState: ()=>initLoadingState,

    requestLoadingState: ()=>requestLoadingState,

    requestHandle: ()=>requestHandle,

    getCompInfoLevel: ()=>_compInfoLevel,

    isLogout: ()=>isLogout,

    isForceLogout: ()=>isForce_Logout,

    getAPNSToken: ()=>_data.APNSToken,

    getToken: ()=>_data.token,

    getUserId: ()=> _data.userInfoBean.id,

    getUserInfoBean: ()=>_data.userInfoBean,

    getMainMsgBean: ()=>_data.mainMsgBean,

    getOrgBeans: ()=> _data.orgBeans,

    getArea: ()=>LocationJson,

    getKeyPoint: ()=>KeyPointFile,

    getMessage(){
        var mainMsgBean = _data.mainMsgBean;
        return [mainMsgBean.billSentBean, mainMsgBean.marketNewsBean, mainMsgBean.systemNoticeBean, mainMsgBean.messageBeans]
    },

    updateUnReadNum(category){
        switch (category) {
            case MsgCategory.BILL_SENT:
                _data.mainMsgBean.billSentBean.unReadNum = 0;
                break;
            case MsgCategory.MARKET_NEWS:
                _data.mainMsgBean.marketNewsBean.unReadNum = 0;
                break;
            case MsgCategory.SYSTEM_NOTICE:
                _data.mainMsgBean.systemNoticeBean.unReadNum = 0;
                break;
        }
        this.emitChange();
    },

    getResult(name){
        if (name == MsgCategory.BILL_SENT) {
            return _data.sentBillMsgBeans
        } else if (name == MsgCategory.MARKET_NEWS) {
            return _data.marketMsgBeans
        } else {
            return _data.systemMsgBeans
        }
    },

    getBillRevViewItems(status){
        if (status == "" || status === null || status === undefined) {
            return _data.revBillBean == null ? null : _data.revBillBean.contentList;
        }
        else {
            var ret = new Array();
            _data.revBillBean.contentList.map((item, index)=> {
                if (item.status == status) {
                    ret.push(item);
                }
            });
            return ret;
        }
    },

    getRevBillDetail(id){
        var ret;
        _data.revBillBean.contentList.map((item, index)=> {
            if (item.billId == id) {
                ret = item;
            }
        });
        return ret;
    },

    getSentBillDetail(id){
        var ret;
        _data.sentBillBean.contentList.map((item, index)=> {
            if (item.billId == id) {
                ret = item;
            }
        });
        return ret;
    },

    getBillRevUnreadNum(){
        return _.isEmpty(_data.mainMsgBean) ? null : _data.mainMsgBean.billRevUnreadNum;
    },

    getNotificationMsg(){
        return _.isEmpty(_data.mainMsgBean) ? null : _data.mainMsgBean.billRevUnreadNum;
    },

    getBillSentViewItems(status){
        if (status == "" || status === null || status === undefined)
            return _data.sentBillBean.contentList
        else if (status == 'WAT') {
            var ret = new Array();
            _data.sentBillBean.contentList.map((item, index)=> {
                if (item.status == 'NEW' || item.status == 'REQ' || item.status == 'HAN') {
                    ret.push(item);
                }
            });
            return ret;
        } else {
            var ret = new Array();
            _data.sentBillBean.contentList.map((item, index)=> {
                if (item.status == status) {
                    ret.push(item);
                }
            });
            return ret;
        }
    },

    updateMessage: function (billId) {
        //更新消息 isRead == 0
        //_.remove(_data.mainMsgBean.messageBeans,function(item){
        //    return item.billId == billId
        //});
        let f = false;
        _data.mainMsgBean.messageBeans.map((item, index)=> {
            if (item.billId == billId && !_data.mainMsgBean.messageBeans[index]["isRead"]) {
                _data.mainMsgBean.messageBeans[index]["isRead"] = true;
                f = true;
            }
        });
        Persister.saveMainMsgBean(_data.mainMsgBean);
        if (f)
            this.emitChange();
    },

    getDemoFlag: function () {
        return _data.demoFlag;
    }
});

var _initCompStatus = function () {
    var orgBeans = _data.orgBeans[0];
    if (!_.isEmpty(orgBeans.orgCode)
        && !_.isEmpty(orgBeans.orgName)
        && !_.isEmpty(orgBeans.email)
        && !_.isEmpty(orgBeans.address)
        && !_.isEmpty(orgBeans.orgType)
        && !_.isEmpty(orgBeans.bizLicenseRegNo)
        && !_.isEmpty(orgBeans.bizLicenseRegLoc)
        && _.isInteger(orgBeans.foundationDate)
        && _.isInteger(orgBeans.businessTerm)
        && !_.isEmpty(orgBeans.businessScope)
        && _.isInteger(orgBeans.registeredCapital)) {
        _compInfoLevel.compCertificateOne = true;
    } else {
        _compInfoLevel.compCertificateOne = false;
    }
    if (!_.isEmpty(orgBeans.licenseCopyFileId)
        && !_.isEmpty(orgBeans.licenseCopyFileId)
        && !_.isEmpty(orgBeans.orgCodeCopyFileId)
        && !_.isEmpty(orgBeans.taxFileId)
        && !_.isEmpty(orgBeans.corpIdentityFileId)
        && !_.isEmpty(orgBeans.authFileId)
        && !_.isEmpty(orgBeans.authIdentityFileId)) {
        _compInfoLevel.compCertificateTwo = true;
    } else {
        _compInfoLevel.compCertificateTwo = false;
    }
    if (!_.isEmpty(orgBeans.accountName)
        && !_.isEmpty(orgBeans.accountNo)
        && !_.isEmpty(orgBeans.reservedMobileNo)) {
        _compInfoLevel.compCertificateThree = true;
    } else {
        _compInfoLevel.compCertificateThree = false;
    }
    if (_compInfoLevel.compCertificateThree && _compInfoLevel.compCertificateTwo && _compInfoLevel.compCertificateOne) {
        _compInfoLevel.submitable = true
    } else {
        _compInfoLevel.submitable = false
    }
    return orgBeans;
}

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

var _handleConnectivityChange = function (isConnected) {
    netWorkState = isConnected;
}

var _appInit = function (data) {
    NetInfo.isConnected.addEventListener(
        'change',
        _handleConnectivityChange
    );
    NetInfo.isConnected.fetch().done(
        (isConnected) => {
            netWorkState = isConnected;
        }
    );
    Persister.getAppData(
        function (data) {
            initLoadingState = false;
            _data = data;
            _initOrgBean();
            isLogout = false;
            _data.orgBeans[0] = _initCompStatus();
            AppStore.emitChange();
        })
}

var _login = function (data) {
    _data = data;
    _initOrgBean();
    _data.orgBeans[0] = _initCompStatus();
    AppStore.emitChange();
    Persister.getAppData((d) => {
        data.demoFlag = d.demoFlag;
        if (!d.demoFlag) {
            data.demoFlag = {flag: false};
        }
        Persister.saveAppData(data);
    });
}

var _cancleBillDiscount = function (data) {
    _data.revBillBean.contentList.map((item, index)=> {
        if (item.billId == data.billId) {
            _data.revBillBean.contentList[index].status = "NEW";
        }
    });
    AppStore.emitChange();
}

var _giveupBillDiscount = function (data) {
    _data.revBillBean.contentList.map((item, index)=> {
        if (item.billId == data.billId) {
            _data.revBillBean.contentList[index].status = "IGN";
        }
    });
    AppStore.emitChange();
}

var _allowBillDiscount = function (data) {
    _data.revBillBean.contentList.map((item, index)=> {
        if (item.billId == data.billId) {
            _data.revBillBean.contentList[index] = data;
            //_data.revBillBean.contentList[index].status = "DIS";
        }
    });
    AppStore.emitChange();
}

var _rejectBillDiscount = function (data) {
    _data.sentBillBean.contentList.map((item, index)=> {
        if (item.billId == data.billId) {
            _data.sentBillBean.contentList[index].status = "IGN";
        }
    });
    AppStore.emitChange();
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
    _.isEmpty(_data[key]) ? _data[key] = new Array(data) : _data[key] = [data].concat(_data[key]);
}

var _getBillBody = function (msg) {
    return msg.billBody;
}

var _updateMainMsgBeanByNotify = function (arrayKeyName, beanKeyName, data) {
    _pushMsg(data, arrayKeyName);
    _.isEmpty(_data.mainMsgBean) ? _data.mainMsgBean = new Object() : "";
    let unReadNum = _.isEmpty(_data.mainMsgBean[beanKeyName]) ? 0 : _data.mainMsgBean[beanKeyName].unReadNum;
    data.unReadNum = ++unReadNum;
    _data.mainMsgBean[beanKeyName] = data;
}

var _addBillPackByNotify = function (keyName, data) {
    if (_.isEmpty(_data[keyName]) || _.isEmpty(_data[keyName].contentList)) {
        _data[keyName] = {contentList: new Array()};
    }
    _data[keyName].contentList = [data].concat(_data[keyName].contentList);
}

var _analysisMessageData = function (data) {
    //数据插入到对饮的bean中 并替换main里的
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
            _.isEmpty(_data.mainMsgBean['messageBeans']) ? _data.mainMsgBean['messageBeans'] = new Array(d) : _data.mainMsgBean['messageBeans'] = [d].concat(_data.mainMsgBean['messageBeans']);
            _addBillPackByNotify('revBillBean', _getBillBody(data));
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
}

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

var _force_logout = function () {
    _data.token = null;
    Persister.clearToken();
    isLogout = true;
    isForce_Logout = true;
}

AppStore.dispatchToken = AppDispatcher.register(function (action) {
    switch (action.type) {
        case ActionTypes.APP_INIT:
            _appInit()
            break;
        case ActionTypes.LOGIN:
            isLogout = false;
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
            isLogout = true;
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
            requestHandle = action.handle;
            AppStore.emitChange('rpc');
            break;
        case ActionTypes.UPDATE_COMPBASEINFO:
            _data.orgBeans[0] = _.assign(_data.orgBeans[0], action.data);
            _data.userInfoBean = _.assign(_data.userInfoBean, action.data);
            _initCompStatus();
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
            _freshMessageData(action.data);
            break;
        case ActionTypes.CLEAR_MESSAGEDETAIL:
            var message = _data.mainMsgBean[action.data];
            message.unReadNum = 0;
            Persister.saveMsgDetail(_data.mainMsgBean);
            break;
        case ActionTypes.DEMO_FLAG:
            _data.demoFlag = {flag: true};
            Persister.saveDemoFlag({flag: true, id: AppStore.getUserId()});
        default:
    }
});

module.exports = AppStore;