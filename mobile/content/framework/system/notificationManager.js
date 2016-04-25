/**
 * Created by amarsoft on 16/4/11.
 */
"use strict";
var React = require('react-native');
var {
  PushNotificationIOS,
  Platform,
  AppStateIOS,
  DeviceEventEmitter,
  } = React;
var CommonAction = require('../action/commonAction');
var AppStore = require('../store/appStore');
var Alert = require('../../comp/utils/alert');
var subscription;
let _handleAppStateChange = function (currentAppState) {
  if (AppStore.getRevBillMessage()) {
    switch (currentAppState) {
      case "active":
        CommonAction.freshNotification();
        break;
      case "background":
        console.log('aaaaa');
        if (AppStore.getToken() && !_.isEmpty(AppStore.getToken())) {
          PushNotificationIOS.getApplicationIconBadgeNumber((num) => {
            CommonAction.updatePushMsgBadge({
              messageBadge: num
            }, ()=>{console.log('yes')}, ()=>{console.log('no')});
          });
        } else {
          PushNotificationIOS.setApplicationIconBadgeNumber(0);
        }
        break;

    }
  }
}

module.exports = {

  openNotification:function(c) {

      if (Platform.OS === 'ios') {
        if (!AppStore.getAPNSToken()) {
          PushNotificationIOS.requestPermissions();
        }
        PushNotificationIOS.removeEventListener('register', CommonAction.notificationRegister);
        PushNotificationIOS.removeEventListener('notification', CommonAction.onNotification);
        AppStateIOS.removeEventListener('change', _handleAppStateChange);


        PushNotificationIOS.addEventListener('register', CommonAction.notificationRegister);
        PushNotificationIOS.addEventListener('notification', CommonAction.onNotification);

        AppStateIOS.addEventListener('change', _handleAppStateChange);
      } else {
        DeviceEventEmitter.addListener('Msg', (e:Event)=>CommonAction.onNotification());
        DeviceEventEmitter.addListener('MsgByNotification', (e:Event)=> {
          c();
          CommonAction.onNotification();
        });

      }

  },
  closeNotification:function(){
      if (Platform.OS === 'ios') {
        PushNotificationIOS.removeEventListener('register', CommonAction.notificationRegister);
        PushNotificationIOS.removeEventListener('notification', CommonAction.onNotification);
        AppStateIOS.removeEventListener('change', _handleAppStateChange);
        PushNotificationIOS.setApplicationIconBadgeNumber(0);
      } else {
        //DeviceEventEmitter.removeListener('Msg');
        //DeviceEventEmitter.removeListener('MsgByNotification');
      }
  }


}
