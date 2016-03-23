var React = require('react-native');
var _ = require('lodash');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var Persister = require('../persister/persisterFacade');
var MsgCategory = require('../../constants/notification').MsgCategory;
var AppStore = require('./appStore')
var MsgContent = require('../../constants/notification').MsgContent;
var MessageStore = assign({}, EventEmitter.prototype, {
    getMessage(){
        var mainMsgBean = AppStore.getMainMsgBean()[MsgContent.MAIN_MSG];
        if (!mainMsgBean) {
            return []
        } else {
            return [mainMsgBean.billSentBean, mainMsgBean.marketNewsBean, mainMsgBean.systemNoticeBean, mainMsgBean.messageBeans]
        }
    },
    getMainMsgBean: ()=>AppStore.getMainMsgBean().mainMsgBean,

    updateUnReadNum(category){
        switch (category) {
            case MsgCategory.BILL_SENT:
                AppStore.getMainMsgBean()[MsgContent.MAIN_MSG].billSentBean.unReadNum = 0;
                break;
            case MsgCategory.MARKET_NEWS:
                AppStore.getMainMsgBean()[MsgContent.MAIN_MSG].marketNewsBean.unReadNum = 0;
                break;
            case MsgCategory.SYSTEM_NOTICE:
                AppStore.getMainMsgBean()[MsgContent.MAIN_MSG].systemNoticeBean.unReadNum = 0;
                break;
        }
        AppStore.emitChange();
    },

    setMsgReaded(id){
        var RevBillMsgs = AppStore.getMainMsgBean()[MsgContent.MAIN_MSG].messageBeans;
      for(let item of RevBillMsgs) {
        if (item.id == id) {
          item.isRead = true;
          AppStore.emitChange();
          return;
        }
      }
    },

    getResult(name){
        if (name == MsgCategory.BILL_SENT) {
            return AppStore.getMainMsgBean()[MsgContent.SENT_MSG]
        } else if (name == MsgCategory.MARKET_NEWS) {
            return AppStore.getMainMsgBean()[MsgContent.MARKET_MSG]
        } else {
            return AppStore.getMainMsgBean()[MsgContent.SYSTEM_MSG]
        }
    },
    updateMessage: function (billId) {
        //更新消息 isRead == 0
        //_.remove(AppStore.getData().mainMsgBean.messageBeans,function(item){
        //    return item.billId == billId
        //});
        let f = false;
        AppStore.getMainMsgBean()[MsgContent.MAIN_MSG].messageBeans.map((item, index)=> {
            if (item.billId == billId && !AppStore.getMainMsgBean()[MsgContent.MAIN_MSG].messageBeans[index]["isRead"]) {
                AppStore.getMainMsgBean()[MsgContent.MAIN_MSG].messageBeans[index]["isRead"] = true;
                f = true;
            }
        });
        Persister.saveMainMsgBean(AppStore.getMainMsgBean()[MsgContent.MAIN_MSG]);
        if (f) {
            AppStore.emitChange();
        }
    },
    getSentBillDetail(id){
        var ret;
        AppStore.getData().sentBillBean.contentList.map((item, index)=> {
            if (item.billId == id) {
                ret = item;
            }
        });
        return ret;
    },
    getRevBillDetail(id){
        var ret;
        AppStore.getData().revBillBean.contentList.map((item, index)=> {
            if (item.billId == id) {
                ret = item;
            }
        });
        return ret;
    },
})
module.exports = MessageStore;