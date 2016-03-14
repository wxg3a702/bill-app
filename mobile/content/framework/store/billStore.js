var React = require('react-native');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var AppStore = require('./appStore')
var BillStore = assign({}, EventEmitter.prototype, {
    getDemoFlag: function () {
        return _data.demoFlag;
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