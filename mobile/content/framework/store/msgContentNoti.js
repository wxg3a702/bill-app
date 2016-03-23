/**
 * Created by amarsoft on 16/3/23.
 */
module.exports = {
  MsgContent: {
    MAIN_MSG: this.getUserName + 'mainMsgBean',
    SENT_MSG: this.getUserName + 'sentMsgBean',
    MARKET_MSG: this.getUserName + 'marketMsgBean',
    SYSTEM_MSG: this.getUserName + 'systemMsgBean',
  },

  setMsgContent (userName) {
    this.MsgContent.MAIN_MSG = userName + 'mainMsgBean';
    this.MsgContent.SENT_MSG = userName + 'sentMsgBean';
    this.MsgContent.MARKET_MSG = userName + 'marketMsgBean';
    this.MsgContent.SYSTEM_MSG = userName + 'systemMsgBean';
  }

};