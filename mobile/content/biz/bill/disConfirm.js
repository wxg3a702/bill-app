/**
 * Created by yhbao on 2015/12/31.
 */


'use strict'

var React = require('react-native');
var {
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    Text,
    View,
    TextInput
    } = React;
var TimerMixin = require('react-timer-mixin');
var NavBarView = require('../../framework/system/navBarView');
var dismissKeyboard = require('react-native-dismiss-keyboard');
var AppAction = require("../../framework/action/appAction");
var AppStore = require('../../framework/store/appStore');
var NumberHelper = require('../../comp/utils/numberHelper');
var Alert = require('../../comp/utils/alert');
var containerHolder;


var DisConfirm = React.createClass({
    mixins: [TimerMixin],
    onAction(){
        containerHolder.showLoading()
    },

    changeVerify: function () {
        if (!this.state.tim) {
            this.clearInterval(this.state.tim);
        }
        if (this.state.time == "重新获取") {
            AppAction.sendSMSCodeForDiscount('',
                function () {
                    this.setState({
                        deadline: 60,
                        tim: this.setInterval(this.updateText, 1000)
                    })
                }.bind(this), ''
            );
        } else {
            this.setState({
                deadline: 60,
                tim: this.setInterval(this.updateText, 1000)
            })
        }


    },
    textOnchange: function (text, type) {
        this.setState({[type]: text})
        if (this.state.smsCode.length == 0) {
            this.setState({
                underColor: '#69c9c1',
                checked: true,
            })
        } else {
            this.setState({
                underColor: 'daf2f0',
                checked: false,
            })
        }
    },
    updateText: function () {
        var t = --this.state.deadline;
        this.setState({
            deadline: t,
            time: t
        });
        if (t == 0) {
            this.setState({time: "重新获取"});
            this.clearInterval(this.state.tim);
        }
    },

    getInitialState: function () {
        return {time: 60, mobileNo: AppStore.getUserInfoBean().mobileNo, smsCode: ""};
    },

    validateSuccess: function (data) {
        dismissKeyboard();
        AppAction.createBillDiscount(
            {
                billId: this.state.billId,
                discountRate: this.state.discountRate,
                discountAmount: this.state.discountAmount,
                discountBankName: this.state.discountBankName,
                payeeBankAccountNo: this.state.payeeBankAccountNo
            },
            function () {
                Alert("贴现申请提交成功!", ()=>this.goBack());
            }.bind(this)
        );
    },

    validateFailure: function (data) {
        Alert(data.msgContent);
    },

    submitF: function () {
        // 贴现
        if (this.state.smsCode.length < 6) {
            Alert("验证码格式不正确");
        } else {
            dismissKeyboard();
            AppAction.validateMobileForDiscount({
                mobileNo: this.state.mobileNo,
                smsCode: this.state.smsCode
            }, this.validateSuccess, this.validateFailure);
        }

    },

    goBack: function () {
        var routes = this.props.navigator.getCurrentRoutes();
        this.props.navigator.popToRoute(routes[routes.length - 3]);
    },

    renderMain: function () {
        return (
            <View style={{ flex: 1,backgroundColor: '#f0f0f0'}}>
                <Text
                    style={{padding:15,fontSize:17,color:'#4e4e4e',marginTop:10}}>{'        提交后，银行将受理您的申请，或您可在银行受理前撤销该申请。'}</Text>
                <View style={{margin:15,borderBottomWidth:1,borderBottomColor:'#d9d9d9'}}></View>
                <Text
                    style={{padding:15,fontSize:17,color:'#4e4e4e',marginTop:10}}>{'请输入' + NumberHelper.phoneNumber(this.state.mobileNo) + '收到的短信验证码'}</Text>


                <View style={{flexDirection: 'row',margin:10}}>
                    <View style={{flex:1}}>
                        <TextInput style={[styles.input,styles.radius]} placeholder="短信验证码"
                                   onChangeText={(text) => this.textOnchange(text,"smsCode")}
                                   autoCorrect={false} maxLength={6} keyboardType="numeric"
                                   value={this.state.smsCode}
                                   placeholderTextColor="#4e4e4e" clearButtonMode="while-editing"/>
                    </View>
                    <View style={{width:75,marginLeft:12}}>
                        <TouchableOpacity style={[{width:75,height:36},styles.radius,styles.button]}
                                          onPress={this.state.time == "重新获取"?this.changeVerify:null}>
                            <Text
                                style={{color:'ffffff'}}>{this.state.time == '重新获取' ? '重新获取' : this.state.time + '秒'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                <View
                    style={{height:35,margin: 10,borderRadius:5,backgroundColor: '#44bcb2',paddingLeft:10,paddingRight:10}}>
                    <TouchableHighlight onPress={() => this.submitF()} style={{height:35}}>
                        <Text style={{padding: 10, height:35,color:'#ffffff',textAlign:'center'}}>{'提交'}</Text>
                    </TouchableHighlight>
                </View>


            </View>
        );
    },

    render: function () {

        var content = this.renderMain();
        return (
            <NavBarView navigator={this.props.navigator} ref={c=>{if(c)containerHolder=c.getContainerHandle()}}
                        title="确认贴现">
                {content}
            </NavBarView>
        );

    },

    componentDidMount: function () {
        var billBean = this.props.param.billBean;
        this.setState(billBean);
        AppAction.sendSMSCodeForDiscount('',
            function () {
                this.setState({
                    deadline: 60,
                    tim: this.setInterval(this.updateText, 1000)
                })
            }.bind(this), ''
        );
    }


});

var styles = StyleSheet.create({
    button: {
        backgroundColor: '#69c9c1',
        paddingTop: 10,
        paddingBottom: 10,
        height: 36,
        alignItems: 'center'
    },
    textUseful: {
        color: '#44bcbc'
    },
    buttonUseful: {
        backgroundColor: 'white'
    },
    input: {
        fontSize: 14,
        height: 36,
        paddingLeft: 12,
        borderColor: 'white',
        borderWidth: 0.5,
        backgroundColor: '#ffffff',
        color: '#4e4e4e'
    },
    marginTitle: {
        height: 36,
        paddingTop: 10
    },
    radius: {
        borderRadius: 4
    },
    flexContainer: {
        flexDirection: 'row',
    },
    container: {
        flex: 1,
        backgroundColor: '#44bcbc',
        flexDirection: 'column',
    },
    flexOne: {
        flex: 1
    },
    text: {
        width: 240,
        textAlign: 'center',
        color: 'white',
        fontSize: 14,
    },
    paddingLR: {
        paddingLeft: 20,
        paddingRight: 20,
    },
})


module.exports = DisConfirm;