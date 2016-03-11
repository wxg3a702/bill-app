'use strict';

var React = require('react-native');
var {
    WebView,
    } = React;
var LoginAction = require('../../framework/action/loginAction')
var NavBarView = require('../../framework/system/navBarView')
var Protocol = React.createClass({
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="用户协议">
                <WebView
                    url={LoginAction.getProtocol()}
                />
            </NavBarView>
        )
    }
})
module.exports = Protocol