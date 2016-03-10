'use strict';

var React = require('react-native');
var {
    View,
    Text
    } = React;
var dismissKeyboard = require('react-native-dismiss-keyboard');
var RightTopButton = require('../../comp/utils/rightTopButton');
var AppAction = require("../../framework/action/appAction")
var NavBarView = require('../../framework/system/navBarView')
var EditPhoneVerifySuccess = require('./editPhoneVerifySuccess');
var SMSTimer = require('../../comp/utils/smsTimer');
var NumberHelper = require('../../comp/utils/numberHelper');
var Alert = require('../../comp/utils/alert');
var EditPhoneVerify = React.createClass({
    getInitialState: function () {
        return {
            verify: '',
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
            var isVerify = this.isVerify();
        }
    },
    isVerify(){
        dismissKeyboard();
        AppAction.resetMobileNo(
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
        this.setState({[key]: value});
    },
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="修改手机号" actionButton={this.button()}>
                <View style={[{marginTop:18,marginHorizontal:12,flex:1,flexDirection: 'column'}]}>
                    <Text style={[{marginBottom:12}]}>
                        请输入{this.state.phoneNum}收到的短信验证码
                    </Text>
                    <SMSTimer ref="smsTimer" onChanged={this.handleChanged} func={'sendSMSCodeToNewMobileApi'} parameter={this.props.param.phoneNumber} isLogin={true}/>
                </View>
            </NavBarView>
        )
    }
})
module.exports = EditPhoneVerify;