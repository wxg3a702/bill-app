var React = require('react-native');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var AppStore = require('./appStore')
var CompStore = assign({}, EventEmitter.prototype, {
    getOrgBeans: ()=> AppStore.getData().orgBeans,
    getNewOrg: ()=>AppStore.getData().newOrg,

})
module.exports = CompStore;