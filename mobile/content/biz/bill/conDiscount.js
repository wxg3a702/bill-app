/**
 * Created by cui on 16/3/10.
 */
'use strict'

var React = require('react-native');
var {
    AppRegistry,
    Image,
    ListView,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    Text,
    View,
    TextInput
    } = React;

var NavBarView = require('../../framework/system/navBarView');
var ComResult = require('./comResult');
var dismissKeyboard = require('react-native-dismiss-keyboard');
var Button = require('../../comp/utils/button');
var Input = require('../../comp/utils/input');
var SMSTimer = require('../../comp/utils/smsTimer');

var ConDiscount = React.createClass({
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator}
                        title="确认贴现">
                <View style={{flexDirection:'column',paddingLeft: 12, paddingRight: 12,}}>
                    <Text style={{fontSize:15,color:'#7f7f7f',marginTop:10}}>{'已发送短信验证码至手机138****1234'}</Text>
                    <View style={{flexDirection:'row',marginTop:10}}>
                        <SMSTimer ref="smsTimer" onChanged={this.handleChanged} func={'sendSMSCodeToNewMobile'}/>
                    </View>
                    <Text style={{fontSize:15,color:'#7f7f7f',marginTop:10}}>{'请输入注册时设置的交易密码'}</Text>
                    <Input type='default' prompt="交易密码" max={20} field="userName" isPwd={false}
                           onChanged={this.handleChanged} icon="user"/>
                    <View style={{marginTop:36}}>
                        <Button func={this.next}  content='完成'/>
                    </View>
                </View>

            </NavBarView>
        );
    },
    handleChanged: function(){

    },
    next: function(){
        this.props.navigator.push({
            param: {title: '提交结果'},
            comp: ComResult
        });
    },
});

var styles = StyleSheet.create({});

module.exports = ConDiscount;