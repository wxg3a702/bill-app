'use strict';

var React = require('react-native');
var {
    View
    } = React;
var RightTopButton = require('../../comp/utilsUi/rightTopButton')
var LoginAction = require("../../framework/action/loginAction");
var NavBarView = require('../../framework/system/navBarView')
var Input = require('../../comp/utilsUi/input')
var Validation = require('../../comp/utils/validation')
var Alert = require('../../comp/utils/alert');
var EditPassword = React.createClass({
    getInitialState: function () {
        return {
            password: '',
            newPassword: '',
            confirmNewPassword: ''
        };
    },
    next: function () {
        if (this.state.password.length == 0 || this.state.newPassword.length == 0 || this.state.confirmNewPassword.length == 0) {
            Alert("请完整输入密码");
            return false;
        }
        if (this.state.newPassword.length < 6) {
            Alert("新密码最少为6位");
            return false;
        }
        if ((this.state.newPassword).indexOf(" ") != -1) {
            Alert("新密码不能有空格");
            return false;
        }
        if (!Validation.isComp(this.state.newPassword, '新密码')) {
            return false;
        }
        if (this.state.newPassword == this.state.password) {
            Alert("新密码不能和旧密码一样");
            return false;
        }
        if (this.state.newPassword != this.state.confirmNewPassword) {
            Alert("两次新密码不一致")
        } else {
            var confirmPassword = this._confirmPassword();
        }
    },
    _confirmPassword(){
        LoginAction.resetPasswordForChangePwd(
            {
                password: this.state.password,
                newPassword: this.state.newPassword
            },
            function () {
                Alert("密码修改成功", this.back)
            }.bind(this)
        )
    },
    button(){
        return (
            <RightTopButton func={this.next} content="确定"/>
        )
    },
    back: function () {
        this.props.navigator.popToTop();
    },
    handleChanged(key, value){
        this.setState({[key]: value});
    },
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="修改密码" actionButton={this.button()}>
                <View style={{flexDirection: 'column',paddingHorizontal:12}}>
                    <Input type='default' prompt="请输入旧密码" max={16} field="password" isPwd={true}
                           onChanged={this.handleChanged} icon="password"/>
                    <Input type='default' prompt="请输入新密码" max={16} field="newPassword" isPwd={true}
                           onChanged={this.handleChanged} icon="password"/>
                    <Input type='default' prompt="确认新密码" max={16} field="confirmNewPassword" isPwd={true}
                           onChanged={this.handleChanged} icon="password"/>
                </View>
            </NavBarView>
        )
    }
})
module.exports = EditPassword;