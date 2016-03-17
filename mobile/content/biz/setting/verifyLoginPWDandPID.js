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
var Input = require('../../comp/utils/input');
var Button = require('../../comp/utils/button');
var ResetTradingPWD = require('./resetTradingPWD');
var UserStore = require('../../framework/store/userStore');
var dismissKeyBoard = require('react-native-dismiss-keyboard');
var LoginAction = require('../../framework/action/loginAction');
var Alert = require('../../comp/utils/alert');

var VerifyLoginPWDandPID = React.createClass({
    getInitialState: function () {
        return {
            checked: true,
            personId:'',
            password:'',
        }
    },

    toResetTradingPWD: function(){
        const {navigator}=this.props;
        if(navigator){
            navigator.push({
                comp:ResetTradingPWD,
            });
        }
    },

    handleChanged(key,value){
        this.textOnchange(value, key);
    },

    textOnchange:function(text,type) {
        this.setState({[type]: text})
        if (this.state.personId.length == 0 || this.state.password.length == 0) {
            this.setState({checked: true,})
        } else {
            this.setState({checked: false,})
        }
    },

    next:function(){
        if (this.state.personId.length == 0 ||this.state.password.length == 0)  {}
        else {
            this.thisValidateLoginPWDandPID();
        }
    },
    thisValidateLoginPWDandPID:function(){
        dismissKeyBoard();
        LoginAction.validatePWDandPersonID(
            {
                personId:this.state.personId,
                password:this.state.password,
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

    render: function() {
        return(
            <NavBarView navigator={this.props.navigator} title='密码和身份验证' contentBackgroundColor="#f0f0f0">

                <View style={[styles.flex,{marginLeft:10,marginRight:10}]}>

                    <View style={styles.inputViewItem}>

                        <Input type='default' prompt='已认证的身份证号' max={22} field='personId' isPwd={true}
                               onChanged={this.handleChanged}  icon='personId' />

                        <Input type='default' prompt='登录密码' max={16} field='password' isPwd={true}
                               onChanged={this.handleChanged} icon='password' />

                    </View>

                    <View style={{marginTop:36}}>
                        <Button func={this.next} checked={this.state.checked} content='下一步'>
                        </Button>
                    </View>

                </View>

            </NavBarView>
        );
    }
});

var styles = StyleSheet.create({
   flex:{
       flex:1,
   },

    rowFlexDirection:{
        flexDirection:'row',
    },

    inputViewItem:{
        marginTop:10,
        height:120,
        justifyContent:'space-around'
    },

});

module.exports = VerifyLoginPWDandPID;
