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

var ConDiscount = React.createClass({
    //getStateFromStores() {
    //},
    getInitialState(){
        return {
            checked: true,
            smsCode: "",
            transPwd: "",
            mobileNo: UserStore.getUserInfoBean().mobileNo
        };
    },
    componentWillMount(){
        var responseData = this.props.param.billBean;
        this.setState(responseData);
    },
    //componentDidMount(){
    //
    //},
    //componentWillUnmount(){
    //
    //},
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator}
                        title="确认贴现">
                <View style={{flexDirection:'column',paddingLeft: 12, paddingRight: 12,}}>
                    <Text style={{fontSize:15,color:'#7f7f7f',marginTop:10}}>{'已发送短信验证码至手机138****1234'}</Text>
                    <View style={{flexDirection:'row',marginTop:10}}>
                        <SMSTimer ref="smsTimer" onChanged={this.handleChanged} func={'sendSMSCodeToNewMobile'}/>
                    </View>
                    <Text style={{fontSize:15,color:'#7f7f7f',marginTop:10}}>{'请输入注册时设置的交易密码'}</Text>
                    <Input type='default' prompt="交易密码" max={20} field="userName" isPwd={false}
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
        if (this.state.smsCode.length == 0 || this.state.transPwd.length == 0) {
            this.setState({checked: true})
        } else {
            this.setState({checked: false})
        }
    },

    handleChanged(key, value){
        this.textOnchange(value, key);
    },
    next: function () {
        this.props.navigator.push({
            param: {title: '提交结果'},
            comp: ComResult
        });
    },
    validateSmsCode: function (data) {
        dismissKeyboard()
        BillAction.validateMobileForDiscount({
            mobileNo: this.state.mobileNo,
            smsCode: this.state.smsCode
        },this.validateSmsCodeSuccess,this.validataSmsCodeFail)

    },
    validateSmsCodeSuccess: function (data) {
        dismissKeyboard()
        BillAction.validateTransPWD({
            transactionPassword:this.state.transPwd
        },this.validateTransPwdSuccess,this.validataTransPwdFail)

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

        dismissKeyboard()
        BillAction.createBillDiscount(
            {
                billId: this.state.billId,
                discountRate: this.state.discountRate,
                discountAmount: this.state.discountAmount,
                discountBankName: this.state.discountBankName,
                payeeBankAccountNo: this.state.payeeBankAccountNo
            },
            function () {
                Alert("贴现申请提交成功!", ()=>this.next);
            }.bind(this)
        );

    },
});

var styles = StyleSheet.create({});

module.exports = ConDiscount;