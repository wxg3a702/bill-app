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
var SMSTimer = require('../../comp/utils/smsTimer');
var Input = require('../../comp/utils/input');
var Button = require('../../comp/utils/button');
var ResetTradingPWD = require('./resetTradingPWD');

var VerifyOldTradingPWD = React.createClass({
    getInitialState: function () {
        return {
            checked: true,
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

    render:function(){
        return(
            <NavBarView navigator={this.props.navigator} title="短信和密码验证" contentBackgroundColor="#f0f0f0">

                <View style={[styles.flex,{marginLeft:10,marginRight:10}]}>

                    <View style={[styles.rowFlexDirection,{marginTop:15,height:40,alignItems:'center'}]}>
                        <Text style={[styles.flex,styles.textItem]}>已发送短信验证码至手机138****1234</Text>
                    </View>

                    <View style={styles.smsTimerViewItem}>
                        <SMSTimer ref="smsTimer" func={'sendSMSCodeToOldMobile'} style={styles.flex}>
                        </SMSTimer>
                    </View>

                    <View style={styles.inputViewItem}>
                        <Input type='default' prompt='交易密码' max={6} field='tradingPWD' isPwd={true}
                               icon='trading_PWD' style={styles.flex} />
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


