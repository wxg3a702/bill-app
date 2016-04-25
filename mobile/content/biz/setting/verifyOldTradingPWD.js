'use strict'

var React = require('react-native');

var {
    View,
    Text,
    StyleSheet,
    Platform,
    } = React;

var NavBarView = require('../../framework/system/navBarView');
var SMSTimer = require('../../comp/utilsUi/smsTimer');
var Input = require('../../comp/utilsUi/input');
var Button = require('../../comp/utilsUi/button');
var ResetTradingPWD = require('./resetTradingPWD');
var UserStore = require('../../framework/store/userStore');
var phoneNumber = require('../../comp/utils/numberHelper').phoneNumber;
var dismissKeyBoard = require('react-native-dismiss-keyboard');
var LoginAction = require('../../framework/action/loginAction');
var BillAction = require('../../framework/action/billAction');
var Alert = require('../../comp/utils/alert');
var Persister = require('../../framework/persister/persisterFacade');
var AppStore = require('../../framework/store/appStore');
var ServiceModule = require('NativeModules').ServiceModule;

var VerifyOldTradingPWD = React.createClass({
    getStateFromStores() {
        var user = UserStore.getUserInfoBean();
        return user.mobileNo
    },

    getInitialState: function () {
        return {
            checked: true,
            verify: '',
            mobileNo: '',
            oldTransactionPassword: '',
        }
    },

    componentDidMount: function () {
        this.refs['smsTimer'].afterLoginChangeVerify();
        this.setState({
            mobileNo: phoneNumber(this.getStateFromStores())
        });
    },

    thisValideateOldTradingPWD: function () {
        LoginAction.validateTransPWD(
            {
                transactionPassword: this.state.oldTransactionPassword
            },
            function () {
                const { navigator } = this.props;
                if (navigator) {
                    if (!this.state.checked) {
                        navigator.push({
                            comp: ResetTradingPWD
                        });
                    }
                }
                ;
            }.bind(this),
            function (msg) {
                if (msg.msgCode == 'USER_TRANSACTION_PASSWORD_VALIDATION_WRONG_TIMES_ILLEGAL') {
                    //Alert(msg.msgContent, ()=>LoginAction.forceLogOut());
                    Alert(
                        msg.msgContent,
                        ()=> {
                            //if (Platform.OS === 'android') {
                            //    ServiceModule.setIsLoginToSP(false);
                            //    ServiceModule.stopAppService();
                            //}
                            //AppStore._data.token = null;
                            //Persister.clearToken(_data);
                            //AppStore.info.isLogout = true;
                            //const {navigator}=this.props;
                            //if (navigator) {
                            //    navigator.resetTo({comp:'tabView'});
                            //}
                            LoginAction.clear();
                        }
                    );
                } else {
                    Alert(msg.msgContent);
                }
            }.bind(this)
        )

    },

    thisValidateSMSCode: function () {
        dismissKeyBoard();
        BillAction.validateMobileForDiscount(
            {
                mobileNo: this.getStateFromStores(),
                smsCode: this.state.verify
            },
            ()=>this.thisValideateOldTradingPWD(),
            function (msg) {
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

    next: function () {
        if (this.state.verify.length == 0 || this.state.oldTransactionPassword.length == 0) {
            Alert('请输入验证码和交易密码')
        }
        else {
            this.thisValidateSMSCode();
        }
    },

    toResetTradingPWD: function () {
        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                comp: ResetTradingPWD,
            });
        }
    },

    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="短信和密码验证" contentBackgroundColor="#f0f0f0">

                <View style={[styles.flex,{marginLeft:10,marginRight:10}]}>

                    <View style={[styles.rowFlexDirection,{marginTop:15,height:40,alignItems:'center'}]}>
                        <Text style={[styles.flex,styles.textItem]}>已发送短信验证码至手机{this.state.mobileNo}</Text>
                    </View>

                    <View style={styles.smsTimerViewItem}>
                        <SMSTimer ref="smsTimer"
                                  func={'afterLoginSendSMSCodeToOldMobile'}
                                  isNeed={true}
                                  style={styles.flex}
                                  onChanged={this.handleChanged}
                                  isLogin={true}>
                        </SMSTimer>
                    </View>

                    <View style={styles.inputViewItem}>
                        <Input type='default'
                               prompt='旧交易密码'
                               max={6}
                               field='oldTransactionPassword'
                               isPwd={true}
                               onChanged={this.handleChanged}
                               icon='trading_PWD'
                               isPhone="numeric"
                               style={styles.flex}
                        />
                    </View>

                    <View style={{marginTop:40}}>
                        <Button func={this.next} checked={this.state.checked} content='下一步'/>
                    </View>
                </View>

            </NavBarView>
        );
    }
});

var styles = StyleSheet.create({
    flex: {
        flex: 1
    },

    rowFlexDirection: {
        flexDirection: 'row'
    },

    textItem: {
        fontSize: 15,
        color: '#7f7f7f'
    },

    smsTimerViewItem: {
        marginTop: 5,
        height: 40,
    },

    inputViewItem: {
        marginTop: 10,
        height: 40,
    },
})

module.exports = VerifyOldTradingPWD;


