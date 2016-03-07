var React = require('react-native');
var {
    NetInfo
    } = React;
var _data = {};
var _ = require('lodash');
var CHANGE_EVENT = 'change';
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var initLoadingState = false;
var AppStore = assign({}, EventEmitter.prototype, {

    getInitLoadingState: ()=>initLoadingState,

    addChangeListener: function (callback, event) {
        if (!event)event = CHANGE_EVENT
        this.on(event, callback);
    },

    removeChangeListener: function (callback, event) {
        if (!event)event = CHANGE_EVENT
        this.removeListener(event, callback);
    },

    getToken: ()=>_data.token,
});
module.exports = AppStore;