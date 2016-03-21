var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var AppStore = require('./appStore')
var CompStore = assign({}, EventEmitter.prototype, {
    getCertifiedOrgBean: ()=> AppStore.getData().certifiedOrgBean,
    getNewOrg: ()=>AppStore.getData().newOrg,

})
module.exports = CompStore;