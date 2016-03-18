/**
 * Created by wen on 3/9/16.
 */

'use strict'

var React = require('react-native');

var {
    View,
    Text,
    StyleSheet
    } = React;

var NavBarView = require('../../framework/system/navBarView');
var SMSTimer = require('../../comp/utilsUi/smsTimer');
var Input = require('../../comp/utilsUi/input');
var Button = require('../../comp/utilsUi/button');
var ResetTradingPWD = require('./resetTradingPWD');
var AppStore = require('../../framework/store/appStore');
var UserStore = require('../../framework/store/userStore');
var phoneNumber = require('../../comp/utils/numberHelper').phoneNumber;
var dismissKeyBoard = require('react-native-dismiss-keyboard');
var LoginAction = require('../../framework/action/loginAction');
var Alert = require('../../comp/utils/alert');

var VerifyOldTradingPWD = React.createClass({
    getStateFromStores() {
        var user = UserStore.getUserInfoBean();
        return user.mobileNo
    },

    getInitialState: function () {
        return {
            checked: true,
            verify:'',
            mobileNo:'',
            oldTransactionPassword:'',
        }
    },

    componentDidMount: function () {
        this.refs['smsTimer'].changeVerify();
        this.setState({
            mobileNo:phoneNumber(this.getStateFromStores())
        });
    },

    thisValideateOldTradingPWD: function(){
        LoginAction.validateTransPWD(
            {
                transactionPassword:this.state.oldTransactionPassword
            },
            function(){
                const { navigator } = this.props;
                if (navigator) {
                    if (!this.state.checked){
                        navigator.push({
                            comp:ResetTradingPWD
                        });
                    }
                };
            }.bind(this),
            function(msg){
                Alert(msg.msgContent);
            }
        )

    },

    thisValidateSMSCode: function(){
        dismissKeyBoard();
        LoginAction.validateSMSCode(
            {
                smsCode:this.state.verify
            },
            ()=>this.thisValideateOldTradingPWD().bind(this),
            function(msg){
                Alert(msg.msgContent);
            }
        );
    },

    handleChanged(key, value){
        this.textOnchange(value, key);
    },

    textOnchange: function (text, type) {
        this.setState({[type]: text})
        if (this.state.oldTransactionPassword.length == 0 || this.state.verify.length == 0) {
            this.setState({checked: true,})
        } else {
            this.setState({checked: false,})
        }
    },

    next:function(){
        if (this.state.verify.length == 0 ||this.state.oldTransactionPassword.length == 0)  {}
        else {
            this.thisValidateSMSCode();
        }
    },

    toResetTradingPWD:function(){
        const {navigator}=this.props;
        if(navigator){
            navigator.push({
                comp:ResetTradingPWD,
            });
        }
    },

    render:function(){
        return(
            <NavBarView navigator={this.props.navigator} title="短信和密码验证" contentBackgroundColor="#f0f0f0">

                <View style={[styles.flex,{marginLeft:10,marginRight:10}]}>

                    <View style={[styles.rowFlexDirection,{marginTop:15,height:40,alignItems:'center'}]}>
                        <Text style={[styles.flex,styles.textItem]}>已发送短信验证码至手机{this.state.mobileNo}</Text>
                    </View>

                    <View style={styles.smsTimerViewItem}>
                        <SMSTimer ref="smsTimer" func={'sendSMSCodeToOldMobile'} isNeed={true} style={styles.flex} onChanged={this.handleChanged}>
                        </SMSTimer>
                    </View>

                    <View style={styles.inputViewItem}>
                        <Input type='default' prompt='交易密码' max={6} field='oldTransactionPassword' isPwd={true}
                               onChanged={this.handleChanged}  icon='trading_PWD' style={styles.flex} />
                    </View>

                    <View style={{marginTop:40}}>
                        <Button  func={this.toResetTradingPWD} checked={this.state.checked} content='下一步' />
                    </View>
                </View>

            </NavBarView>
        );
    }
});

var styles = StyleSheet.create({
    flex:{
        flex:1
    },

    rowFlexDirection:{
        flexDirection:'row'
    },

    textItem:{
        fontSize:15,
        color:'#7f7f7f'
    },

    smsTimerViewItem:{
        marginTop:5,
        height:40,
    },

    inputViewItem:{
        marginTop:10,
        height:40,
    },
})

module.exports = VerifyOldTradingPWD;


