'use strict';

var React = require('react-native');
var {
    StyleSheet,
    View
    } = React;
var AppAction = require("../../framework/action/appAction");
var Alert = require('../../comp/utils/alert');
var NavBarView = require('../../framework/system/navBarView');
var dismissKeyboard = require('react-native-dismiss-keyboard');
var Button = require('../../comp/utils/button');
var Validation = require('../../comp/utils/validation');
var Input = require('../../comp/utils/input');
var Alert = require('../../comp/utils/alert');
var Forget_setPassword = React.createClass({
    getInitialState: function () {
        return {
            password: '',
            passwordAgain: '',
            checked: true,
        }
    },
    textOnchange: function (text, type) {
        this.setState({[type]: text})
        if (this.state.password.length > 0 && this.state.passwordAgain.length > 0) {
            this.setState({checked: false})
        } else {
            this.setState({checked: true})
        }
    },
    handleChanged(key, value){
        this.textOnchange(value, key);
    },
    next: function () {
        if (this.state.password.length == 0 && this.state.passwordAgain.length == 0) {

        } else {
            if (this.state.password.length < 6) {
                Alert("密码最少为6位");
                return false;
            }
            if ((this.state.password).indexOf(" ") != -1) {
                Alert("新密码不能有空格");
                return false;
            }
            if (!Validation.isComp(this.state.password, '新密码')) {
                return false;
            }
            if (this.state.password == this.state.passwordAgain) {
                var setInfo = this.setInfo();
            } else {
                Alert("密码输入不一致，请重新输入")
            }
        }
    },
    setInfo(){
        dismissKeyboard();
        AppAction.resetPasswordForForgetPwd({
                newPassword: this.state.passwordAgain,
            },
            function () {
                Alert('新密码设置成功，请重新登录', function () {
                    const { navigator } = this.props;
                    if (navigator) {
                        navigator.popToTop();
                    }
                }.bind(this));
            }.bind(this))
    },
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="忘记密码">
                <View style={[{flexDirection: 'column'},styles.paddingLR]}>
                    <Input type='default' prompt="新密码" max={16} field="password" isPwd={true}
                           onChanged={this.handleChanged} icon="password"/>
                    <Input type='default' prompt="再输一次密码" max={16} field="passwordAgain" isPwd={true}
                           onChanged={this.handleChanged} icon="password"/>
                    <View style={{marginTop:36}}>
                        <Button func={this.next} checked={this.state.checked} content='完成'/>
                    </View>
                </View>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
    paddingLR: {
        paddingLeft: 12, paddingRight: 12,
    },
})
module.exports = Forget_setPassword;