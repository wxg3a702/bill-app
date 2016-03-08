'use strict';

var React = require('react-native');
var {
    StyleSheet,
    Image,
    ActionSheetIOS,
    Text,
    View,
    TouchableHighlight,
    } = React;
var VIcon = require('../../comp/icon/vIcon')
var Advantage = require('./advantage')
var NavBarView = require('../../framework/system/navBarView')
var Communications = require('react-native-communications');
var AboutUs = React.createClass({
    send(){
        ActionSheetIOS.showActionSheetWithOptions({
            options:[
                '拨打电话',
                '取消'
            ],
            cancelButtonIndex:1,
            destructiveButtonIndex:0,
        },function(index){
            if(index==0){
                Communications.phonecall('021358858882627', false);
            }
        })
    },
    toAdvantage(){
        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                comp: Advantage
            })
        }
    },
    render(){
        return (
            <NavBarView navigator={this.props.navigator} title="关于我们" contentBackgroundColor='#f0f0f0'>
                <View style={{paddingBottom:24,backgroundColor:'white'}}>
                    <View style={{marginTop:20,flexDirection:'column',alignItems:'center',paddingHorizontal:16}}>
                        <Image style={{width:72,height:72,borderRadius:10}}
                               source={require('../../image/user/icon.png')}/>

                        <Text style={{fontSize:14,color:'#333333',marginTop:18}}>版本号: 1.23.0</Text>
                        <Text style={{fontSize:14,color:'#333333',marginTop:21}}>票易贴•票据贴现新境界</Text>
                    </View>
                    <View style={{paddingHorizontal:16}}>
                        <Text
                            style={{fontSize:13,color:'#7f7f7f',lineHeight:23}}>{'       票易贴是安硕织信旗下的金融新产品，以“服务”为本，创新“互联网+票据”，坚定打造真正服务于中小微企业用户的票据贴现互联网平台，为企业票据融资提供渠道，切实帮助中小微企业解决资金短缺问题，助力企业发展。'}
                        </Text>
                    </View>
                </View>
                <View style={[{backgroundColor:'white'}]}>
                    <TouchableHighlight underlayColor='#cccccc' onPress={this.send}>
                        <View
                            style={[styles.style,styles.borderBottom,styles.borderTop]}>
                            <Text style={{fontSize:16,color:'#333333'}}>客服热线：</Text>
                            <Text style={{fontSize:16,color:'#7f7f7f'}}>021-35885888-2627</Text>
                        </View>
                    </TouchableHighlight>
                    <View
                        style={[styles.style,styles.borderBottom]}>
                        <Text style={{fontSize:16,color:'#333333'}}>网站邮箱：</Text>
                        <Text style={{fontSize:16,color:'#7f7f7f'}}>contacts@izirong.com</Text>
                    </View>
                    <View style={[styles.style,styles.borderBottom]}>
                        <Text style={{fontSize:16,color:'#333333'}}>官方网站：</Text>
                        <Text style={{fontSize:16,color:'#7f7f7f'}}>www.izirong.com</Text>
                    </View>
                    <TouchableHighlight underlayColor='#cccccc' onPress={this.toAdvantage}>
                        <View style={[styles.style,styles.borderBottom,{paddingRight:0}]}>
                            <Text style={{fontSize:16,color:'#333333'}}>平台优势：</Text>
                            <VIcon/>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={{paddingTop:32,flexDirection:'column',alignItems:'center'}}>
                    <Text style={styles.font}>隐私政策</Text>
                    <Text style={styles.font}>© 2015,all rights reserved.</Text>
                </View>
                <View style={[styles.borderBottom,{marginTop:6,marginHorizontal:12}]}></View>
            </NavBarView>
        )
    },
})
var styles = StyleSheet.create({
    borderTop: {
        borderTopWidth: 1,
    },
    borderBottom: {
        borderBottomWidth: 0.5,
        borderColor: '#c8c7cc'
    },
    icon: {
        width: 35, height: 35,
    },
    style: {
        flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, alignItems: 'center', height: 50
    },
    font: {
        color: '#cccccc',
        fontSize: 12
    }

})
module.exports = AboutUs;