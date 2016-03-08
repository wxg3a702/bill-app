'use strict';

var React = require('react-native');
var {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Image
    } = React;
var VerifyCode = require('../../comp/utils/verifyCode')
var NavBarView = require('../../framework/system/navBarView')
var Register_checkVerify = require('./register_checkVerify');
var AppAction = require("../../framework/action/appAction");
var dismissKeyboard = require('react-native-dismiss-keyboard');
var Protocol = require('./protocol')
var Validation = require('../../comp/utils/validation')
var Button = require('../../comp/utils/button');
var Input = require('../../comp/utils/input');
var Alert = require('../../comp/utils/alert');
var Register_checkPhone = React.createClass({
    getInitialState: function () {
        return {
            phoneNumber: '',
            verify: '',
            checked: true,
            agree: true,
            active: false,
        }
    },
    textOnchange: function (text, type) {
        this.setState({[type]: text})
        if (this.state.phoneNumber.length == 0 || this.state.verify.length == 0) {
            this.setState({checked: true,})
        } else {
            this.setState({checked: false,})
        }
    },
    handleChanged(key, value){
        this.textOnchange(value, key);
    },
    isRead(){
        if (this.state.agree) {
            return (require('../../resource/login/radioChecked.png'))
        } else {
            return (require('../../resource/login/radioUncheck.png'))
        }
    },
    changeAgree(){
        var agree = this.state.agree;
        this.setState({agree: !agree})
    },
    next: function () {
        if (this.state.phoneNumber.length == 0 || this.state.verify.length == 0) {
        } else {
            if (!this.state.agree) {
                return;
            }
            if (!Validation.isPhone(this.state.phoneNumber)) {
                return false;
            } else {
                var isCheckPhone = this.checkPhone();
            }

        }
    },
    checkPhone(){
        dismissKeyboard()
        AppAction.validateMobileForReg(
            {
                mobileNo: this.state.phoneNumber,
                captcha: this.state.verify
            },
            function (msg) {
                const { navigator } = this.props;
                if (navigator) {
                    if (!this.state.checked) {
                        navigator.push({
                            comp: Register_checkVerify,
                            param: {
                                phoneNumber: this.state.phoneNumber
                            }
                        });
                    }
                }
            }.bind(this),
            function (msg) {
                Alert(msg.msgContent);
                this.refs['verifyCode'].changeVerify()
            }.bind(this)
        )
    },
    toProtocol(){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({comp: Protocol});
        }
    },
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="注册">
                <View style={[styles.container,styles.paddingLR]}>
                    <Input type='default' prompt="手机号" max={11} field="phoneNumber" isPwd={false} isPhone={true}
                           onChanged={this.handleChanged} icon="phone"/>

                    <VerifyCode ref="verifyCode" onChanged={this.handleChanged}/>
                    <View style={[styles.rememberMe,{marginTop:20}]} underlayColor={'D4D4D4'}>
                        <TouchableOpacity style={styles.rememberMe} activeOpacity={1} onPress={this.changeAgree}>
                            <Image style={{width:12,height:12}} source={this.isRead()}/>
                        </TouchableOpacity>
                        <Text style={[{fontSize:15,color:'#7f7f7f'},!this.state.agree && styles.red]}>已阅读并同意</Text>
                        <TouchableOpacity activeOpacity={0.5} onPress={this.toProtocol}>
                            <Text style={[styles.protocol,!this.state.agree && styles.red]}>《用户注册协议》</Text>
                        </TouchableOpacity>
                    </View>

                    <Button func={this.next} checked={(this.state.checked || !this.state.agree)} content='下一步'/>
                </View>
            </NavBarView>
        )
    },
})
var styles = StyleSheet.create({
    rememberMe: {
        flexDirection: 'row', alignItems: 'center', height: 60, width: 21
    },
    container: {
        flex: 1, flexDirection: 'column',
    },
    paddingLR: {
        paddingLeft: 12, paddingRight: 12,
    },
    protocol: {
        fontSize: 15, textDecorationLine: 'underline', color: '#7f7f7f'
    },
    red: {
        color: 'red'
    }
})
module.exports = Register_checkPhone;