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
var Button = require('../../comp/utilsUi/button');

var EditPhone = React.createClass({
    getInitialState: function () {
        return {
            password: '',
            checked:true
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
            this._validPassword();
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
        this.textOnchange(value, key);
    },

    textOnchange: function (text, type) {
        this.setState({[type]: text})
        if (this.state.password.length == 0) {
            this.setState({checked: true,})
        } else {
            this.setState({checked: false,})
        }
    },

    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="登录密码验证" >
                <View style={{flexDirection: 'column',paddingHorizontal:12}} scrollEnabled={false}>
                    <Input type='default' prompt="请输入登录密码" max={16} field="password" isPwd={true}
                           onChanged={this.handleChanged} icon="password"/>
                </View>

                <View style={{marginTop:20,marginLeft:10,marginRight:10}}>
                    <Button  func={this.next} checked={this.state.checked} content='下一步' />
                </View>

            </NavBarView>
        )
    }
})
module.exports = EditPhone;