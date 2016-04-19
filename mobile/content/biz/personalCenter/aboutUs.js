'use strict';

var React = require('react-native');
var {
    StyleSheet,
    Image,
    ActionSheetIOS,
    Text,
    View,
    ScrollView,
    } = React;
var Item = require('../../comp/utils/item');
var Advantage = require('./advantage')
var NavBarView = require('../../framework/system/navBarView')
var Communications = require('./communication');
var AboutUs = React.createClass({
    getInitialState(){
        return {
            phone: '021-35885888-2627',
            email: 'contacts@izirong.com',
            web: 'www.izirong.com',
            chat: 'bill',
            content: '       票易贴是安硕织信旗下的金融新产品，以“服务”为本，创新“互联网+票据”，坚定打造真正服务于中小微企业用户的票据贴现互联网平台，为企业票据融资提供渠道，切实帮助中小微企业解决资金短缺问题，助力企业发展。'
        }
    },
    send(){
        let phone = this.state.phone;
        ActionSheetIOS.showActionSheetWithOptions({
            options: [
                '拨打电话',
                '取消'
            ],
            cancelButtonIndex: 1,
            destructiveButtonIndex: 0,
        }, function (index) {
            if (index == 0) {
                Communications.phonecall(phone, false);
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
            <NavBarView navigator={this.props.navigator} title="关于我们">
                <ScrollView>
                    <View style={{paddingBottom:24,backgroundColor:'white'}}>
                        <View style={{marginTop:20,flexDirection:'column',alignItems:'center',paddingHorizontal:16}}>
                            <Image style={styles.circle} source={require('../../image/user/icon.png')}/>
                            <Text style={styles.title}>版本号: 1.23.0</Text>
                            <Text style={styles.title}>票易贴•票据贴现新境界</Text>
                        </View>
                        <Text style={styles.content}>
                            {this.state.content}
                        </Text>
                    </View>
                    <View style={[{backgroundColor:'white'}]}>
                        <Item desc="客服热线:" img={false} icon={false} top={true} value={this.state.phone}
                              func={this.send}/>
                        <Item desc="网站邮箱:" img={false} icon={false} value={this.state.email}/>
                        <Item desc="官方网站:" img={false} icon={false} value={this.state.web}/>
                        <Item desc="官方微信:" img={false} icon={false} value={this.state.chat}/>
                        <Item desc="平台优势:" img={false} func={this.toAdvantage}/>
                    </View>
                    <View style={{paddingTop:32,alignItems:'center'}}>
                        <Text style={styles.font}>隐私政策</Text>
                        <Text style={styles.font}>© 2015,all rights reserved.</Text>
                    </View>
                    <View style={[styles.borderBottom,{marginTop:6,marginHorizontal:12}]}></View>
                </ScrollView>
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
    font: {
        color: '#cccccc',
        fontSize: 12
    },
    title: {
        fontSize: 14,
        color: '#333333',
        marginTop: 18
    },
    circle: {
        width: 72,
        height: 72,
        borderRadius: 10
    },
    content: {
        fontSize: 13,
        color: '#7f7f7f',
        lineHeight: 23,
        paddingHorizontal: 16
    }
})
module.exports = AboutUs;