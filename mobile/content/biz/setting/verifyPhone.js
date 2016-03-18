/**
 * Created by wen on 3/9/16.
 */

'use strict'

var React = require('react-native');

var{
    StyleSheet,
    View,
    Text
    } = React;

var NavBarView = require('../../framework/system/navBarView');
var SMSTimer = require('../../comp/utils/smsTimer');
var Button = require('../../comp/utils/button');
var VerifyLoginPWDandPID = require('./verifyLoginPWDandPID');
var UserStore = require('../../framework/store/userStore');
var phoneNumber = require('../../comp/utils/numberHelper').phoneNumber;
var LoginAction = require('../../framework/action/loginAction');
var Alert = require('../../comp/utils/alert');
var dismissKeyBoard = require('react-native-dismiss-keyboard')

var VerifyPhone = React.createClass({

    getStateFromStores(){
        var userInfo = UserStore.getUserInfoBean();
        return userInfo.mobileNo;
    },

    getInitialState: function () {
        return {
            checked: true,
            mobileNo:'',
            verify:'',
        }
    },

    componentDidMount:function(){
        this.refs['smsTimer'].changeVerify();
        this.setState({
            mobileNo:phoneNumber(this.getStateFromStores())
        });
    },

    handleChanged(key,value){
        this.textOnchange(value, key);
    },

    textOnchange:function(text,type) {
        this.setState({[type]: text})
        if (this.state.verify.length == 0) {
            this.setState({checked: true,})
        } else {
            this.setState({checked: false,})
        }
    },

    next:function(){
        if (this.state.verify.length == 0)  {}
        else {
            this.thisValidateSMSCode();
        }
    },

    thisValidateSMSCode: function(){
        dismissKeyBoard();
        LoginAction.validateSMSCode(
            {
                smsCode:this.state.verify
            },
            function(){
                const {navigator}=this.props;
                    if(navigator){
                        if(!this.state.checked) {
                            navigator.push({
                                comp: VerifyLoginPWDandPID,
                            });
                        }
                    }
            }.bind(this),
            function(msg){
                Alert(msg.msgContent);
            }
        );
    },


    toVerifyLoginPWDandPID:function(){
        const {navigator}=this.props;
        if(navigator){
            navigator.push({
                comp:VerifyLoginPWDandPID,
            });
        }
    },

    render: function(){
        return(
          <NavBarView navigator={this.props.navigator} title="短信验证" contentBackgroundColor="#f0f0f0">

              <View style={[styles.flex,{marginLeft:10,marginRight:10}]}>

                <View style={[styles.rowFlexDirection,styles.textViewItem]}>
                    <Text style={[styles.textItem,styles.flex]}>已发送短信验证码至手机{this.state.mobileNo}</Text>
                </View>

                <View style={{marginTop:5,height:40}}>
                    <SMSTimer  ref="smsTimer" func={'sendSMSCodeToOldMobile'} isNeed={true} onChanged={this.handleChanged} style={styles.flex}>
                    </SMSTimer>
                </View>

                <View style={{marginTop:40,height:40}}>
                    <Button func={this.toVerifyLoginPWDandPID} checked={this.state.checked} content='下一步'>
                    </Button>
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
        color:'#7f7f7f',
    },

    textViewItem:{
        marginTop:15,
        height:40,
        alignItems:'center',
    },


});

module.exports = VerifyPhone;
