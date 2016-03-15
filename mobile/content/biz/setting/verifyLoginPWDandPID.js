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

var VerifyLoginPWDandPID = React.createClass({
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

    render: function() {
        return(
            <NavBarView navigator={this.props.navigator} title='密码和身份验证' contentBackgroundColor="#f0f0f0">

                <View style={[styles.flex,{marginLeft:10,marginRight:10}]}>

                    <View style={styles.inputViewItem}>

                        <Input type='default' prompt='已认证的身份证号' max={6} field='tradingPWD' isPwd={true}
                               icon='trading_PWD' />

                        <Input type='default' prompt='登录密码' max={6} field='password' isPwd={true}
                               icon='password' />

                    </View>

                    <View style={{marginTop:36}}>
                        <Button func={this.toResetTradingPWD} checked={this.state.checked} content='下一步'>
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
