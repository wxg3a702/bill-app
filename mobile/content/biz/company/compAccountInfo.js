/**
 * Created by vison on 16/3/14.
 */
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
var Space = require('../../comp/utils/space')
var BottomButton = require('../../comp/utils/bottomButton')
var VIcon = require('../../comp/icon/vIcon')
var AppStore = require('../../framework/store/appStore');
var CompStore = require('../../framework/store/compStore');
var CompAction = require("../../framework/action/compAction")
var NavBarView = require('../../framework/system/navBarView')
var certificateState = require('../../constants/certificateState');
var Alert = require('../../comp/utils/alert');
var Button = require('../../comp/utils/button')
var CompAccountInfo = React.createClass({
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
    addComp(){
       
    },
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="2.关联账户信息">
                <View style={{flex:1}}></View>
                <BottomButton func={this.addComp} content="提交"/>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
    bottom: {
        padding: 7, backgroundColor: '#f7f7f7', borderTopWidth: 1, borderTopColor: '#cccccc', opacity: 0.9
    },
    borderBottom: {
        borderBottomWidth: 1, borderColor: '#c8c7cc'
    },
    radius: {
        borderRadius: 6
    },
    button: {
        backgroundColor: '#44bcbc',
        height: 47,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
})
module.exports = CompAccountInfo;