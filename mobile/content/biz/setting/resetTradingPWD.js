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

var ResetTradingPWD = React.createClass({

    getInitialState: function () {
        return {
            checked: true,
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

    render: function(){
        return(
            <NavBarView navigator={this.props.navigator} title='设置新密码' contentBackgroundColor="#f0f0f0">

                <View  style={[styles.flex,{marginLeft:10,marginRight:10}]}>

                    <View style={styles.inputViewItem}>
                        <Input type='default' prompt='交易密码' max={6} field='tradingPWD' isPwd={true}
                               icon='trading_PWD'/>

                        <Input type='default' prompt='再输一次交易密码' max={6} field='tradingPWD' isPwd={true}
                               icon='trading_PWD'/>
                    </View>

                    <View style={{marginTop:36}}>
                        <Button func={this.toEditTradingPWDsuccess} checked={this.state.checked} content='完成'>
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

