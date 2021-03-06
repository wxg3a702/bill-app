var keyMirror = require('keymirror');

module.exports = {

    ActionTypes: keyMirror({
        SAVE_APNS_TOKEN: null,
        APP_INIT: null,
        LOGIN: null,
        LOGOUT: null,
        FORCE_LOGOUT: null,
        REQUEST_START: null,
        REQUEST_END: null,
        CANCLE_BILL_DISCOUNT: null,
        CREATE_BILL_DISCOUNT: null,
        GIVEUP_BILL_DISCOUNT: null,
        CLEAR_MESSAGEDETAIL: null,
        PUSH_NOTIFICATION: null,
        DEMO_FLAG: null,
        GET_PUSH_MSG: null,
        UPDATE_USERINFO: null,
        UPDATE_NEWORG: null,
        UPDATE_ORGBEANS: null,
        DELETE_ORGBEANS: null,
        UPDATE_EXISTORG: null,
        UPDATE_UNAUDITING:null,
        CLEAR_NEWORG: null,
        CHANGE_SWITCH:null,
    })

};
