'use strict';

var React = require('react-native');
var {
    View,
    Text
    } = React;
var dismissKeyboard = require('react-native-dismiss-keyboard');
var RightTopButton = require('../../comp/utilsUi/rightTopButton');
var LoginAction = require("../../framework/action/loginAction");
var NavBarView = require('../../framework/system/navBarView');
var EditPhoneVerifySuccess = require('./editPhoneVerifySuccess');
var SMSTimer = require('../../comp/utilsUi/smsTimer');
var NumberHelper = require('../../comp/utils/numberHelper');
var Alert = require('../../comp/utils/alert');
var Button = require('../../comp/utilsUi/button');

var EditPhoneVerify = React.createClass({
    getInitialState: function () {
        return {
            verify: '',
            checked:true
        };
    },
    componentDidMount: function () {
        this.refs['smsTimer'].changeVerify()
        this.setState({
            phoneNum: NumberHelper.phoneNumber(this.props.param.phoneNumber)
        });

    },
    button(){
        return (
            <RightTopButton func={this.next} content="完成"/>
        )
    },
    next: function () {
        if (this.state.verify.length == 0) {
            Alert("请输入验证码")
        } else {
            this.isVerify();
        }
    },
    isVerify(){
        dismissKeyboard();
        LoginAction.resetMobileNo(
            {
                newMobileNo: this.props.param.phoneNumber,
                smsCode: this.state.verify
            },
            function (msg) {
                const { navigator } = this.props;
                if (navigator) {
                    navigator.push({
                        comp: EditPhoneVerifySuccess,
                    });
                }
            }.bind(this))
    },
    handleChanged(key, value){
        this.textOnchange(value, key);
    },

    textOnchange: function (text, type) {
        this.setState({[type]: text})
        if (this.state.verify.length == 0) {
            this.setState({checked: true,})
        } else {
            this.setState({checked: false,})
        }
    },

    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="短信验证">
                <View style={[{marginTop:18,marginHorizontal:12,flexDirection: 'column'}]}>

                    <Text style={[{marginBottom:12}]}>
                        请输入{this.state.phoneNum}收到的短信验证码
                    </Text>

                    <SMSTimer ref="smsTimer" onChanged={this.handleChanged} func={'sendSMSCodeToNewMobileApi'} parameter={this.props.param.phoneNumber} isLogin={true}/>

                    <View style={{marginTop:20}}>
                        <Button  func={this.next} checked={this.state.checked} content='完成' />
                    </View>

                </View>
            </NavBarView>
        )
    }
})
module.exports = EditPhoneVerify;