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
var EditTradingPWDsuccess = require('./editTradingPWDsuccess');
var LoginAction = require('../../framework/action/loginAction');
var Alert = require('../../comp/utils/alert');
var dismissKeyBoard = require('react-native-dismiss-keyboard')

var ResetTradingPWD = React.createClass({

    getInitialState: function () {
        return {
            checked: true,
            transPWD:'',
            transPWD_Again:'',
        }
    },

    toEditTradingPWDsuccess:function(){
        const {navigator} = this.props;
        if(navigator){
            navigator.push({
                comp:EditTradingPWDsuccess
            });
        }
    },

    handleChanged(key,value){
        this.textOnchange(value,key);
    },

    textOnchange: function (text, type) {
        this.setState({[type]: text})
        if (this.state.transPWD.length == 0 || this.state.transPWD_Again.length == 0) {
            this.setState({checked: true,})
        } else {
            this.setState({checked: false,})
        }
    },

    next:function(){
        if (this.state.transPWD.length > 0 && this.state.transPWD_Again.length > 0) {

            var reg = /^\d{6}$/g;
            if (this.state.transPWD.length < 6 || (this.state.transPWD).indexOf(" ") != -1 ||!reg.test(this.state.transPWD)) {
                Alert("交易密码为6位数字");
                return false;
            }

            if (this.state.transPWD == this.state.transPWD_Again) {
                this.thisResetTradingPWD();
            } else {
                Alert("密码输入不一致，请重新输入")
            }

        }
    },

    thisResetTradingPWD:function(){
        dismissKeyBoard();
        LoginAction.resetTransactionPassword(
            {
                transPWD:this.state.transPWD
            },
            function(){
                const {navigator} = this.props;
                if(navigator){
                    navigator.push({
                        comp:EditTradingPWDsuccess,
                        param:{
                            resetSuccess:true,
                        }
                    });
                }
            }.bind(this),
            function(msg){
                const {navigator} = this.props;
                console.log(msg.msgContent);
                if(navigator){
                    navigator.push({
                        comp:EditTradingPWDsuccess,
                        param:{
                            resetSuccess:false,
                        }
                    });
                }
            }.bind(this)
        );
    },

    render: function(){
        return(
            <NavBarView navigator={this.props.navigator} title='设置新密码' contentBackgroundColor="#f0f0f0">

                <View  style={[styles.flex,{marginLeft:10,marginRight:10}]}>

                    <View style={styles.inputViewItem}>
                        <Input type='default' prompt='交易密码' max={6} field='transPWD' isPwd={true}
                               onChanged={this.handleChanged} icon='trading_PWD'/>

                        <Input type='default' prompt='再输一次交易密码' max={6} field='transPWD_Again' isPwd={true}
                               onChanged={this.handleChanged} icon='trading_PWD'/>
                    </View>

                    <View style={{marginTop:36}}>
                        <Button func={this.next} checked={this.state.checked} content='完成'>
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
        flexDirection:'row',
    },

    inputViewItem:{
        marginTop:15,
        height:120,
        justifyContent:'space-around',
    },

});

module.exports = ResetTradingPWD;

