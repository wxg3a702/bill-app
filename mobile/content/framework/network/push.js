//var host="http://192.168.108.106:9081";
//var host="http://192.168.108.113:8080";
//var Qs = require('qs');
var React = require('react-native');
var {
    PushNotificationIOS
    } = React;
var AppStore = require('../store/appStore');
var AppDispatcher = require('../dispatcher/appDispatcher');
var ChatConstants = require('../../constants/command');
var ActionTypes = ChatConstants.ActionTypes;


var init=function(url,param,callback,failure){
    //PushNotificationIOS.removeEventListener('notification', _onNotification);
    //PushNotificationIOS.removeEventListener('register', _register);
    //if(!AppStore.getAPNSToken()){
    //    PushNotificationIOS.requestPermissions();
    //
    //}
    //PushNotificationIOS.addEventListener('register', _register);
    //PushNotificationIOS.addEventListener('notification', _onNotification);

};


var _register=function(token){
    //AppDispatcher.dispatch({
    //    type: ActionTypes.SAVE_APNS_TOKEN,
    //    token:token
    //});

}


var _onNotification=function(notification) {

    //var msg = JSON.parse(notification.getMessage());
    //AppDispatcher.dispatch({
    //    type: ActionTypes.PUSH_NOTIFICATION,
    //    data:msg
    //});

}



module.exports={init};