var {BFetch,PFetch,UFetch,host,token} = require('../network/fetch');
var async = require('async')
var AppDispatcher = require('../dispatcher/appDispatcher');
var Command = require('../../constants/command');
var ActionTypes = Command.ActionTypes;
var _ = require('lodash');
var pub = "/pub";
var api = "/api"
var BillActions = {
    cancleBillDiscount: (p, c)=>_cancleBillDiscount(api + "/BillDiscountAdmin/cancleBillDiscount", p, c),
    createBillDiscount: (p, c)=>_createBillDiscount(api + "/BillDiscountAdmin/createBillDiscount", p, c),
    giveUpBillDiscount: (p, c)=>_giveUpBillDiscount(api + "/BillDiscountAdmin/giveUpBillDiscount", p, c),
    sendSMSCodeForDiscount: (p, c, f)=>BFetch(api + "/User/sendSMSCodeToOldMobile", p, c, f),
    validateMobileForDiscount: (p, c, f)=>PFetch(api + "/User/validateSMSCodeAfterLogin", p, c, f),
    setDemoFlag: ()=> {
        AppDispatcher.dispatch({type: ActionTypes.DEMO_FLAG});
    },
}

var _cancleBillDiscount = function (url, p, c) {
    PFetch(url, p,
        function (msg) {
            AppDispatcher.dispatch({
                type: ActionTypes.CANCLE_BILL_DISCOUNT,
                data: p
            });
            c();
        }
    );
}

var _createBillDiscount = function (url, p, c) {
    BFetch(url, p,
        function (msg) {
            AppDispatcher.dispatch({
                type: ActionTypes.CREATE_BILL_DISCOUNT,
                data: p
            });
            c();
        }
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