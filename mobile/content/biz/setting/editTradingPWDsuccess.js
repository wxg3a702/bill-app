/**
 * Created by wen on 3/10/16.
 */

'use strict'
var React = require('react-native');

var {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableHighlight
    } = React;

var NavBarView = require('../../framework/system/navBarView');

var EditTradingPWDsuccess = React.createClass({

    backOnPress: function () {
        const { navigator } = this.props;
        if (navigator) {
            navigator.popToTop()
        }
    },

    returnResetResult:function(){

        var icon;
        var resultText;
        var textPrompt;

        if(this.props.param.resetSuccess){
            icon = require('../../image/user/apply_success.png');
            resultText = '修改成功';
            textPrompt = '请妥善保管您的新密码';
        }else {
            icon = require('../../image/user/apply_fail.png');
            resultText = '修改失败';
            textPrompt = '';
        }

        return({
            icon:icon,
            resultText:resultText,
            textPrompt:textPrompt,
        });

    },

    render:function(){
        return(
            <NavBarView navigator={this.props.navigator} title={this.returnResetResult().resultText} showBack={false}>
                <View style={[styles.flex,{justifyContent:'space-between'}]}>

                    <View style={styles.imageViewItem}>
                        <Image resizeMode="stretch" source={this.returnResetResult().icon} style={styles.imageItem}>
                        </Image>
                        <Text numberOfLines={1} style={[styles.textItem,{marginTop:10}]}>{'交易密码'+this.returnResetResult().resultText+'!'}</Text>
                        <Text numberOfLines={1} style={[styles.textItem,{marginTop:5}]}>{this.returnResetResult().textPrompt}</Text>
                    </View>

                    <View style={styles.touchableViewItem}>
                        <TouchableHighlight onPress={this.backOnPress} activeOpacity={0.8} underlayColor="#44ffff" style={[styles.touchableItem]}>
                            <View style={[styles.flex,styles.touchablechildItem]}>
                                <Text style={styles.touchableTextItem}>返回个人中心</Text>
                            </View>
                        </TouchableHighlight>
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
    imageViewItem:{
        marginTop:100,
        alignItems:'center',
        height:180,
    },

    imageItem:{
        height:100,
        width:100,
    },

    textItem:{
        marginTop:10,
        fontSize:18,
        color:'#7f7f7f',
    },

    touchableViewItem:{
        marginBottom:0,
        height:60,
        backgroundColor:'#fff',
        borderTopWidth:1,
        borderTopColor:'#C8C7CC',
    },

    touchableItem:{
        marginTop:10,
        marginLeft:10,
        marginRight:10,
        borderRadius:5,
        height:40,
    },

    touchablechildItem:{
        backgroundColor:'#44bcb2',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
    },

    touchableTextItem:{
        fontSize:18,
        color:'#fff',
        lineHeight:20,
        alignSelf:'stretch',
        textAlign:'center',
    }

});

module.exports = EditTradingPWDsuccess;
