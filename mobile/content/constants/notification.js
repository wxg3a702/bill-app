
var AppStore = require('../framework/store/appStore');
module.exports = {

    MsgTypes: {
        BILL_DRAW: 'BILL_DRAW',
        OPP_IGNORED: 'OPP_IGNORED',
        REV_NEW_BILL: 'REV_NEW_BILL',
        APPROVE_DISCOUNT: 'APPROVE_DISCOUNT',
        MARKET_NEWS: 'MARKET_NEWS',
        ORG_AUTH_FAIL: 'ORG_AUTH_FAIL',
        ORG_AUTH_OK: 'ORG_AUTH_OK',
        SYSTEM_NOTICE: 'SYSTEM_NOTICE',
        LOGIN_OUT: 'LOGIN_OUT'
    },
    MsgCategory:{
        BILL_SENT:'BILL_SENT',
        MARKET_NEWS:'MARKET_NEWS',
        SYSTEM_NOTICE:'SYSTEM_NOTICE',
        BILL_REV:'BILL_REV'


    },
    MsgContent: {
        MAIN_MSG: AppStore.getUserName + 'mainMsgBean',
        SENT_MSG: AppStore.getUserName + 'sentMsgBean',
        MARKET_MSG: AppStore.getUserName + 'marketMsgBean',
        SYSTEM_MSG: AppStore.getUserName + 'systemMsgBean',
    },
    setMsgContent (userName) {
        this.MsgContent.MAIN_MSG = userName + 'mainMsgBean';
        this.MsgContent.SENT_MSG = userName + 'sentMsgBean';
        this.MsgContent.MARKET_MSG = userName + 'marketMsgBean';
        this.MsgContent.SYSTEM_MSG = userName + 'systemMsgBean';
    }
};
