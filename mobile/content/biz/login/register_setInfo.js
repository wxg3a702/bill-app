'use strict';

var React = require('react-native');
var {
    View
    } = React;
var LoginAction = require("../../framework/action/loginAction");
var NavBarView = require('../../framework/system/navBarView');
var GotoReister = require("./gotoRegister");
var dismissKeyboard = require('react-native-dismiss-keyboard');
var Button = require('../../comp/utilsUi/button');
var Input = require('../../comp/utilsUi/input');
var Validation = require('../../comp/utils/validation');
var Alert = require('../../comp/utils/alert');
var Register_setTradingPWD = require('./register_setTradingPWD');

var Register_setInfo = React.createClass({
    getInitialState: function () {
        return {
            userName: '',
            password: '',
            passwordAgain: '',
            checked: true,
        }
    },

    textOnchange: function (text, type) {
        this.setState({[type]: text})
        if (this.state.userName.length > 0 && this.state.password.length > 0 && this.state.passwordAgain.length > 0) {
            this.setState({checked: false})
        } else {
            this.setState({checked: true})
        }
    },

    handleChanged(key, value){
        this.textOnchange(value, key);
    },

    next: function () {
        if (this.state.userName.length > 0 && this.state.password.length > 0 && this.state.passwordAgain.length > 0) {
            if (this.state.userName.length < 5) {
                Alert("用户名最少为5位");
                return false;
            }
            var reg = /^[A-Za-z0-9_]*$/g;
            if (!reg.test(this.state.userName)) {
                Alert("用户名只可包含字母、数字和下划线")
                return false;
            }

            if(this.state.userName === this.state.password){
                Alert("密码不能和用户名一致")
                return false;
            }

            if (this.state.password.length < 6) {
                Alert("密码最少为6位");
                return false;
            }
            if ((this.state.password).indexOf(" ") != -1) {
                Alert("密码不能有空格");
                return false;
            }
            if (!Validation.isComp(this.state.password, '密码')) {
                return false;
            }
            if (this.state.password == this.state.passwordAgain) {
                this.setInfo();
            } else {
                Alert("密码输入不一致，请重新输入")
            }
            if (this.state.userName == this.state.password) {
                Alert("密码不能和用户名一致");
                return false;
            }
        }
    },
    setInfo(){
        dismissKeyboard();
        LoginAction.validaterRegisterUserInfo(
            {
                userName: this.state.userName,
                password: this.state.password
            },
            function () {
                const { navigator } = this.props;
                if (navigator) {
                    navigator.push({
                        comp: Register_setTradingPWD,
                        param:{
                            mobileNo: this.props.param.mobileNo,
                            userName:this.state.userName,
                            password:this.state.password,
                        }
                    });
                }
            }.bind(this),
            function (msg){
                Alert(msg.msgContent);
            }
        )
    },

    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="注册账号">
                <View style={[{flexDirection: 'column',paddingLeft: 12, paddingRight: 12}]}>
                    <Input type='default' prompt="用户名" max={20} field="userName" isPwd={false}
                           onChanged={this.handleChanged} icon="user"/>
                    <Input type='default' prompt="密码" max={16} field="password" isPwd={true}
                           onChanged={this.handleChanged} icon="password"/>
                    <Input type='default' prompt="再输一次密码" max={16} field="passwordAgain" isPwd={true}
                           onChanged={this.handleChanged} icon="password"/>
                    <View style={{marginTop:36}}>
                        <Button func={this.next} checked={this.state.checked} content='下一步'/>
                    </View>
                </View>
            </NavBarView>
        )
    }
})
module.exports = Register_setInfo;