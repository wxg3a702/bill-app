'use strict';

var React = require('react-native');
var {
    StyleSheet,
    TouchableHighlight,
    CameraRoll,
    Text,
    Image,
    View,
    } = React;
var VIcon = require('../../comp/icon/vIcon')
var AppStore = require('../../framework/store/appStore');
var CompStore = require('../../framework/store/compStore');
var CompAction = require("../../framework/action/compAction")
var NavBarView = require('../../framework/system/navBarView')
var compInfoLevel;
var certificateState = require('../../constants/certificateState');
var Alert = require('../../comp/utils/alert');
var Button = require('../../comp/utils/button')
var CompCertification = React.createClass({
    getStateFromStores(){
        var orgBean = CompStore.getOrgBeans()[0];
        return orgBean
    },

    getInitialState: function () {
        return this.getStateFromStores();
    },

    componentDidMount() {
        AppStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        AppStore.removeChangeListener(this._onChange);
    },

    _onChange: function () {
        this.setState(this.getStateFromStores());
    },
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="企业认证" contentBackgroundColor='#f0f0f0'>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({})
module.exports = CompCertification;