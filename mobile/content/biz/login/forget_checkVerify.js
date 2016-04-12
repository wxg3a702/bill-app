'use strict';

var React = require('react-native');
var {
    StyleSheet,
    Text,
    View,
    } = React;
var SMSTimer = require('../../comp/utilsUi/smsTimer')
var LoginAction = require("../../framework/action/loginAction")
var Forget_setPassword = require('./forget_setPassword');
var NavBarView = require('../../framework/system/navBarView');
var dismissKeyboard = require('react-native-dismiss-keyboard');
var NumberHelper = require('../../comp/utils/numberHelper')
var Button = require('../../comp/utilsUi/button')
var Forget_checkVerify = React.createClass({
    componentDidMount: function () {
        this.refs['smsTimer'].changeVerify()
        this.setState({
            phoneNum: NumberHelper.phoneNumber(this.props.param.phoneNumber)
        });
    },
    getInitialState: function () {
        return {
            verify: '',
            checked: true,
        };
    },
    textOnchange: function (text, type) {
        this.setState({[type]: text})
        if (this.state.verify.length == 0) {
            this.setState({checked: true})
        } else {
            this.setState({checked: false})
        }
    },
    handleChanged(key, value){
        this.textOnchange(value, key);
    },
    next: function () {
        if (this.state.verify.length == 0) {
        } else {
            this.isVerify();
        }
    },
    isVerify(){
        dismissKeyboard();
        LoginAction.validateSMSCode(
            {smsCode: this.state.verify},
            function () {
                const { navigator } = this.props;
                if (navigator) {
                    navigator.push({
                        comp: Forget_setPassword,
                        param: {
                            phoneNumber: this.props.param.phoneNumber
                        },
                    });
                }
            }.bind(this))
    },
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="忘记密码">
                <View style={{flexDirection: 'column',paddingLeft: 12, paddingRight: 12}}>
                    <Text style={[styles.marginTitle]}>请输入{this.state.phoneNum}收到的短信验证码</Text>
                    <SMSTimer ref="smsTimer" onChanged={this.handleChanged} func={'sendSMSCodeToOldMobile'}/>
                    <View style={{marginTop:36}}>
                        <Button func={this.next} checked={this.state.checked} content='下一步'/>
                    </View>
                </View>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
    marginTitle: {
        height: 36, paddingTop: 10
    },
})
module.exports = Forget_checkVerify;
