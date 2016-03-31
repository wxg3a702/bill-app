/**
 * Created by cui on 16/3/10.
 */
'use strict'

var React = require('react-native');
var {
    StyleSheet,
    TouchableHighlight,
    Text,
    View,
    } = React;

var NavBarView = require('../../framework/system/navBarView');
var ComResult = require('./comResult');
var dismissKeyboard = require('react-native-dismiss-keyboard');
var Button = require('../../comp/utilsUi/button');
var Input = require('../../comp/utilsUi/input');
var SMSTimer = require('../../comp/utilsUi/smsTimer');
var BillAction = require('../../framework/action/billAction');
var UserStore = require('../../framework/store/userStore');
var NumberHelper = require('../../comp/utils/numberHelper');
var Alert = require('../../comp/utils/alert');

var ConDiscount = React.createClass({
    //getStateFromStores() {
    //},
    getInitialState(){
        return {
            checked: true,
            verify: '',
            smsCode: '',
            transPwd: '',
            trading_PWD: '',
            mobileNo: UserStore.getUserInfoBean().mobileNo,
        };
    },
    componentWillMount(){
        var responseData = this.props.param.billBean;
        this.setState(responseData);

    },
    componentDidMount(){
        this.refs['smsTimer'].changeVerify();
        this.sendSMSCode();
    },
    //componentWillUnmount(){
    //
    //},
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator}
                        title="确认贴现">
                <View style={{flexDirection:'column',paddingLeft: 12, paddingRight: 12,}}>
                    <Text
                        style={{fontSize:15,color:'#7f7f7f',marginTop:10}}>{'已发送短信验证码至手机' + NumberHelper.phoneNumber(this.state.mobileNo)}</Text>
                    <View style={{flexDirection:'row',marginTop:10}}>
                        <SMSTimer ref="smsTimer" onChanged={this.handleChanged} func={'sendSMSCodeToNewMobile'}/>
                    </View>
                    <Text style={{fontSize:15,color:'#7f7f7f',marginTop:10}}>{'请输入注册时设置的交易密码'}</Text>
                    <Input type='default' prompt="交易密码" max={6} field="trading_PWD" isPwd={false}
                           onChanged={this.handleChanged} icon="user"/>
                    <View style={{marginTop:36}}>
                        <Button func={this.validateSmsCode} content="完成" checked={this.state.checked}/>
                    </View>
                </View>

            </NavBarView>
        );
    },
    textOnchange: function (text, type) {
        this.setState({[type]: text})
        if (this.state.verify.length == 0 || this.state.trading_PWD.length == 0) {
            this.setState({checked: true})
        } else {
            this.setState({checked: false})
        }
    },

    handleChanged(key, value){
        this.textOnchange(value, key);
    },
    //当result为true时返回了错误信息,代表失败结果
    next: function (data) {
        if(data){
            this.props.navigator.push({
                param: {title: '提交结果'},
                comp: ComResult,
                result:true,
            });
        }else {
            this.props.navigator.push({
                param: {title: '提交结果'},
                comp: ComResult,
                result:false,
            });
        }

    },
    sendSMSCode: function () {
        BillAction.sendSMSCodeForDiscount('',
            function () {
            }.bind(this), ''
        );
    },
    validateSmsCode: function (data) {
        if (this.state.verify.length == 0) {
            //Alert('请填写手机验证码');
        }
        else {
            dismissKeyboard()
            BillAction.validateMobileForDiscount({
                    mobileNo: this.state.mobileNo,
                    smsCode: this.state.verify
                },
                this.validateSmsCodeSuccess,
                this.validataSmsCodeFail)
        }


    },
    validateSmsCodeSuccess: function (data) {
        if (this.state.trading_PWD.length == 0) {
            //Alert('请填写交易密码');
        }
        else {
            dismissKeyboard()
            BillAction.validateTransPWD({
                    transactionPassword: this.state.trading_PWD
                },
                this.validateTransPwdSuccess,
                this.validataTransPwdFail)
        }
    },
    validataSmsCodeFail: function (data) {
        Alert(data.msgContent);
    },

    validateTransPwdSuccess: function (data) {
        this.applyDiscountAction();
    },
    validataTransPwdFail: function (data) {
        Alert(data.msgContent);
    },

    applyDiscountAction: function () {
        if (this.state.verify.length == 0 || this.state.trading_PWD.length == 0) {

        } else {
            dismissKeyboard()
            BillAction.createBillDiscount(
                {
                    billId: this.state.billId,
                    discountRate: this.state.discountRate,
                    discountAmount: this.state.discountAmount,
                    discountBankName: this.state.discountBankName,
                    payeeBankAccountNo: this.state.payeeBankAccountNo
                },
                (data)=>this.next(data)

            );
        }

    },
});

var styles = StyleSheet.create({});

module.exports = ConDiscount;