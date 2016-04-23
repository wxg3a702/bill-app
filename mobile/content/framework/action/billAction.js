var {BFetch, PFetch, UFetch, host, token} = require('../network/fetch');
var async = require('async')
var AppDispatcher = require('../dispatcher/appDispatcher');
var Command = require('../../constants/command');
var ActionTypes = Command.ActionTypes;
var _ = require('lodash');
var pub = "/pub";
var api = "/api"
var BillActions = {
    cancleBillDiscount: (p, c, f)=>_cancleBillDiscount(api + "/BillDiscountAdmin/cancleBillDiscount", p, c, f),
    createBillDiscount: (p, c, f)=>_createBillDiscount(api + "/BillDiscountAdmin/createBillDiscount", p, c, f),
    giveUpBillDiscount: (p, c)=>_giveUpBillDiscount(api + "/BillDiscountAdmin/giveUpBillDiscount", p, c),
    sendSMSCodeForDiscount: (p, c, f)=>BFetch(api + "/User/sendSMSCodeToOldMobile", p, c, f),
    validateMobileForDiscount: (p, c, f)=>PFetch(api + "/User/validateSMSCodeAfterLogin", p, c, f),
    validateTransPWD: (p, c, f)=>PFetch(api + "/User/validateTransPWD", p, c, f),
    setDemoFlag: ()=> _setDemoFlag(),
}
var _setDemoFlag = function () {
    AppDispatcher.dispatch({
        type: ActionTypes.DEMO_FLAG
    });
}
var _cancleBillDiscount = function (url, p, c, f) {
    PFetch(url, p,
        function (msg) {
            AppDispatcher.dispatch({
                type: ActionTypes.CANCLE_BILL_DISCOUNT,
                data: p
            });
            BFetch(api + "/MessageSearch/getPushMsg", {}, function (data) {
                AppDispatcher.dispatch({
                    type: ActionTypes.PUSH_NOTIFICATION,
                    data: data,
                });
            }, null, {custLoading: true});
           c();
        },
        f
    );
}

var _createBillDiscount = function (url, p, c, f) {
    BFetch(url, p,
        function (msg) {
            AppDispatcher.dispatch({
                type: ActionTypes.CREATE_BILL_DISCOUNT,
                data: p
            });
            BFetch(api + "/MessageSearch/getPushMsg", {}, function (data) {
                AppDispatcher.dispatch({
                    type: ActionTypes.PUSH_NOTIFICATION,
                    data: data,
                });
            }, null, {custLoading: true});
            c();
        },
        f
    );
}

var _giveUpBillDiscount = function (url, p, c) {
    PFetch(url, p,
        function (msg) {
            AppDispatcher.dispatch({
                type: ActionTypes.GIVEUP_BILL_DISCOUNT,
                data: p
            });
            c();
        }
    );
}
module.exports = BillActions