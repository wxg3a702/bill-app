'use strict';

var React = require('react-native');
var {
    View,
    } = React;
var RightTopButton = require('../../comp/utilsUi/rightTopButton')
var EditPhoneNewPhone = require('./editPhoneNewPhone')
var LoginAction = require("../../framework/action/loginAction")
var NavBarView = require('../../framework/system/navBarView')
var Input = require('../../comp/utilsUi/input');
var Alert = require('../../comp/utils/alert');
var EditPhone = React.createClass({
    getInitialState: function () {
        return {
            password: ''
        };
    },
    button(){
        return (
            <RightTopButton func={this.next} content="下一步"/>
        )
    },
    next: function () {
        if (this.state.password.length == 0) {
            Alert("请输入密码")
        } else {
            var validPassword = this._validPassword();
        }
    },
    _validPassword(){
        LoginAction.validatePassword(
            {
                password: this.state.password
            },
            function () {
                const { navigator } = this.props;
                if (navigator) {
                    navigator.push({comp: EditPhoneNewPhone});
                }
            }.bind(this)
        )
    },
    handleChanged(key, value){
        this.setState({[key]: value});
    },
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="修改手机号" actionButton={this.button()}>
                <View style={{flexDirection: 'column',paddingHorizontal:12}} scrollEnabled={false}>
                    <Input type='default' prompt="请输入登录密码" max={16} field="password" isPwd={true}
                           onChanged={this.handleChanged} icon="password"/>
                </View>
            </NavBarView>
        )
    }
})
module.exports = EditPhone;