'use strict';

var React = require('react-native');
var {
    StyleSheet,
    WebView,
    } = React;
var AppAction = require('../../framework/action/appAction')
var NavBarView = require('../../framework/system/navBarView')
var Protocol = React.createClass({
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="用户协议">
                <WebView
                    url={AppAction.getProtocol()}
                />
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({})
module.exports = Protocol