var React = require('react-native');
var _ = require('lodash');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;


var KeyPointFile = require('../../biz/personalCenter/keyPointFile')
var LocationJson = require('../../biz/user/locationJson')

var AppStore = require('./appStore')
var UserStore = assign({}, EventEmitter.prototype, {
    getUserId: ()=> AppStore.getData().userInfoBean.id,

    getUserInfoBean: ()=>AppStore.getData().userInfoBean,

    getArea: ()=>LocationJson,

    getKeyPoint: ()=>KeyPointFile,
})
module.exports = UserStore;