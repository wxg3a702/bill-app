'use strict';

var React = require('react-native');
var {
    View,
    StyleSheet
    }=React
var NavBarView = require('../../framework/system/navBarView');
var MessageList = React.createClass({
    render(){
        return (
            <NavBarView navigator={this.props.navigator} showBack={false} title="消息" showBar={true}>

            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({})
module.exports = MessageList