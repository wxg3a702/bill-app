var _ = require('lodash');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var Persister = require('../persister/persisterFacade');
var MsgCategory = require('../../constants/notification').MsgCategory;
var AppStore = require('./appStore')
var MsgContent = require('../../constants/notification').MsgContent;
var _ = require('lodash');
var MessageStore = assign({}, EventEmitter.prototype, {
  getMessage(){
    var mainMsgBean = AppStore.getData().mainMsgBean;
    if (!mainMsgBean) {
      return []
    } else {
      return [mainMsgBean.billSentBean, mainMsgBean.marketNewsBean, mainMsgBean.systemNoticeBean, mainMsgBean.messageBeans]
    }
  },
  getMainMsgBean: ()=>AppStore.getData().mainMsgBean,

  updateUnReadNum(category){
    var categoryBean;
    switch (category) {
      case MsgCategory.BILL_SENT:
        AppStore.getData().mainMsgBean.billSentBean.unReadNum = 0;
        break;
      case MsgCategory.MARKET_NEWS:
        AppStore.getData().mainMsgBean.marketNewsBean.unReadNum = 0;
        break;
      case MsgCategory.SYSTEM_NOTICE:
        AppStore.getData().mainMsgBean.systemNoticeBean.unReadNum = 0;
        break;
    }
    Persister.saveAppData(AppStore.getData())
    AppStore.emitChange();
  },

  getMsgData () {
    var mainMsgBean = AppStore.getData().mainMsgBean;
    if (_.isEmpty(mainMsgBean)) {
      return [];
    } else {
      var messageBeans = !mainMsgBean.messageBeans ? [] : mainMsgBean.messageBeans;
      if (mainMsgBean.systemNoticeBean) {
        messageBeans = [mainMsgBean.systemNoticeBean].concat(messageBeans)
      }
      if (mainMsgBean.marketNewsBean) {
        messageBeans = [mainMsgBean.marketNewsBean].concat(messageBeans)
      }
      if (mainMsgBean.billSentBean) {
        messageBeans = [mainMsgBean.billSentBean].concat(messageBeans)
      }
      return messageBeans;
    }
  },

  setMsgReaded(id){
    var RevBillMsgs = AppStore.getData().mainMsgBean.messageBeans;
    for (let item of RevBillMsgs) {
      if (item.billId == id) {
        item.isRead = true;
        Persister.saveAppData(AppStore.getData())
        AppStore.emitChange();
        return;
      }
    }

  },

  getResult(name){
    if (name == MsgCategory.BILL_SENT) {
      return AppStore.getData().sentBillMsgBeans
    } else if (name == MsgCategory.MARKET_NEWS) {
      return AppStore.getData().marketMsgBeans
    } else {
      return AppStore.getData().systemMsgBeans
    }
  },
  updateMessage: function (billId) {
    //更新消息 isRead == 0
    //_.remove(AppStore.getData().mainMsgBean.messageBeans,function(item){
    //    return item.billId == billId
    //});
    let f = false;
    AppStore.getData().mainMsgBean.messageBeans.map((item, index)=> {
      if (item.billId == billId && !AppStore.getData().mainMsgBean.messageBeans[index]["isRead"]) {
        AppStore.getData().mainMsgBean.messageBeans[index]["isRead"] = true;
        f = true;
      }
      Persister.saveAppData(AppStore.getData());
    });
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