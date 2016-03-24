var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var AppStore = require('./appStore')
var BillStore = assign({}, EventEmitter.prototype, {
    getDemoFlag: ()=>AppStore.getData().demoFlag,
    getSentBill: ()=>AppStore.getData().sentBillBean,

    getAcceptanceBankBeans: ()=>
        AppStore.getData().acceptanceBankBeans,

    getRevBill: ()=>AppStore.getData().revBillBean,
    getBill: (id)=> {
        let bill = AppStore.getData();
        let res;
        if (!bill.revBillBean) {
        } else {
            bill.revBillBean.contentList.map((item, index)=> {
                if (item.billId == id) {
                    res = item
                }
            })
        }
        if (!bill.sentBillBean) {
        } else {
            bill.sentBillBean.map((item, index)=> {
                if (item.billId == id) {
                    res = item
                }
            })
        }
        return res;
    },
    getBillSentViewItems(status){
        if (status == "" || status === null || status === undefined)
            return AppStore.getData().sentBillBean.contentList
        else if (status == 'WAT') {
            var ret = new Array();
            AppStore.getData().sentBillBean.contentList.map((item, index)=> {
                if (item.status == 'NEW' || item.status == 'REQ' || item.status == 'HAN') {
                    ret.push(item);
                }
            });
            return ret;
        } else {
            var ret = new Array();
            AppStore.getData().sentBillBean.contentList.map((item, index)=> {
                if (item.status == status) {
                    ret.push(item);
                }
            });
            return ret;
        }
    },
    getBillRevViewItems(status){
        if (status == "" || status === null || status === undefined) {
            return AppStore.getData().revBillBean == null ? null : AppStore.getData().revBillBean.contentList;
        }
        else {
            var ret = new Array();
            AppStore.getData().revBillBean.contentList.map((item, index)=> {
                if (item.status == status) {
                    ret.push(item);
                }
            });
            return ret;
        }
    },
})
module.exports = BillStore;