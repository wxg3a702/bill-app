/**
 * Created by wen on 3/8/16.
 */

'use strict'

var React = require('react-native');

var {
    View,
    Text,
    TouchableHighlight,
    StyleSheet
    } = React;

var NavBarView = require('../../framework/system/navBarView');
var VerifyOldTradingPWD = require('./verifyOldTradingPWD');
var VerifyPhone = require('./verifyPhone');
var VIcon = require('../../comp/icon/vIcon');

var EditTradingPWD = React.createClass({

    toVerifyOldtradingPWD:function(){
        const {navigator}=this.props;
        if (navigator){
            navigator.push({
                comp:VerifyOldTradingPWD,
            });
        }
    },

    toVerifyPhone:function(){
        const {navigator}=this.props;
        if(navigator){
            navigator.push({
                comp:VerifyPhone,
            });
        }
    },

    render:function(){
        return(
            <NavBarView navigator={this.props.navigator} title="修改交易密码">

                <View style={styles.flex}>

                    <TouchableHighlight activeOpacity={0.8} underlayColor='#cccccc' onPress={this.toVerifyOldtradingPWD} style={[styles.rowFlexDirection,styles.touchableItem,{marginTop:18,borderTopWidth:1}]}>
                        <View style={[styles.flex,styles.rowFlexDirection, styles.cellItem]}>
                            <Text style={{fontSize:16}}>我记得交易密码</Text>
                            <VIcon/>
                        </View>
                    </TouchableHighlight>



                </View>

            </NavBarView>
        );
    }
});

var styles=StyleSheet.create({

    flex:{
        flex:1
    },

    rowFlexDirection:{
        flexDirection:'row'
    },

    touchableItem:{
        backgroundColor:'#fff',
        borderBottomWidth:1,
        borderColor:'#C8C7CC',
        height:50,
        alignItems:'center',
    },

    cellItem:{
        marginLeft:10,
        marginRight:10,
        height:48,
        alignItems:'center',
        justifyContent:'space-between'

    },
})

module.exports = EditTradingPWD;
