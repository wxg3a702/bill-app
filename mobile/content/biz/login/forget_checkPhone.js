'use strict';

var React = require('react-native');
var {
    View
    } = React;
var Validation = require('../../comp/utils/validation');
var VerifyCode = require('../../comp/utilsUi/verifyCode');
var NavBarView = require('../../framework/system/navBarView');
var Forget_checkVerify = require('./forget_checkVerify');
var LoginAction = require("../../framework/action/loginAction");
var Button = require('../../comp/utilsUi/button');
var Input = require('../../comp/utilsUi/input');
var Alert = require('../../comp/utils/alert');
var Forget_checkPhone = React.createClass({
    getInitialState: function () {
        return {
            phoneNumber: '',
            verify: '',
            active: true,
            checked: true,
        }
    },
    textOnchange: function (text, type) {
        this.setState({[type]: text})
        if (this.state.phoneNumber.length == 0 || this.state.verify.length == 0) {
            this.setState({checked: true})
        } else {
            this.setState({checked: false})
        }
    },
    handleChanged(key, value){
        this.textOnchange(value, key);
    },
    next: function () {
        if (this.state.phoneNumber.length == 0 || this.state.verify.length == 0) {
        } else {
            if (!Validation.isPhone(this.state.phoneNumber)) {
                return false;
            } else {
                var isCheckPhone = this.checkPhone();
            }
        }
    },
    checkPhone(){
        LoginAction.validateMobileForForgetPwd({
                mobileNo: this.state.phoneNumber,
                captcha: this.state.verify
            },
            function () {
                const { navigator } = this.props;
                if (navigator) {
                    navigator.push({
                        comp: Forget_checkVerify,
                        param: {
                            phoneNumber: this.state.phoneNumber
                        }
                    });
                }
            }.bind(this),
            function (msg) {
                Alert(msg.msgContent);
                this.refs['verifyCode'].changeVerify()
            }.bind(this)
        )
    },
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="忘记密码">
                <View style={{flex: 1,paddingLeft: 12, paddingRight: 12}}>
                    <Input type='default' prompt="手机号" max={11} field="phoneNumber" isPwd={false} isPhone={true}
                           onChanged={this.handleChanged} icon="phone"/>
                    <VerifyCode ref="verifyCode" onChanged={this.handleChanged}/>
                    <View style={{marginTop:36}}>
                        <Button func={this.next} checked={this.state.checked} content='下一步'/>
                    </View>
                </View>
            </NavBarView>
        )
    },
})
module.exports = Forget_checkPhone;