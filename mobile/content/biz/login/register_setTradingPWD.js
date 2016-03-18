/**
 * Created by wen on 3/8/16.
 */

'use strict'

var React = require('react-native');

var {
    View,
    Text
    } = React;

var NavBarView = require('../../framework/system/navBarView');
var Input = require('../../comp/utilsUi/input');
var Button = require('../../comp/utilsUi/button');
var LoginAction = require("../../framework/action/loginAction");
var dismissKeyboard = require('react-native-dismiss-keyboard');
var GotoReister = require("./gotoRegister");
var Alert = require('../../comp/utils/alert');

//数据访问parameter
//{
//    "mobileNo": "15893647732",
//    "smsCode": "723456",
//    "captcha": "abcd",
//    "userName": "test0330",
//    "password": "11111111",
//    "transactionPassword": "111111",
//    "deviceToken": "deviceToken",
//    "deviceModel": "deviceModel"
//}

var Register_setTradingPWD = React.createClass({
    getInitialState:function(){
        return{
            mobileNo:'',
            userName:'',
            password:'',
            transactionPassword:'',
            transactionPassword_again:'',
            checked:true,
        }
    },

    componentDidMount:function() {
        this.setState({
            mobileNo:this.props.param.mobileNo,
            userName:this.props.param.userName,
            password:this.props.param.password,
        });
        console.log(this.state.mobileNo);
        console.log(this.state.userName);
        console.log(this.state.password);
    },

    textOnchange: function (text, type) {
        this.setState({[type]: text})
        if (this.state.transactionPassword.length > 0 && this.state.transactionPassword_again.length > 0) {
            this.setState({checked: false})
        } else {
            this.setState({checked: true})
        }
    },

    handleChanged(key, value){
        this.textOnchange(value, key);
    },


    next: function () {
        if (this.state.transactionPassword.length > 0 && this.state.transactionPassword_again.length > 0) {

            var reg = /^\d{6}$/g;
            if (this.state.transactionPassword.length < 6 || (this.state.transactionPassword).indexOf(" ") != -1 ||!reg.test(this.state.transactionPassword)) {
                Alert("交易密码为6位数字");
                return false;
            }

            if (this.state.transactionPassword == this.state.transactionPassword_again) {
                var setInfo = this.setInfo();
            } else {
                Alert("密码输入不一致，请重新输入")
            }

        }
    },

    setInfo(){
        dismissKeyboard();
        LoginAction.register(
            {
                userName: this.state.userName,
                password: this.state.password,
                transactionPassword:this.state.transactionPassword,
            },
            function () {
                const { navigator } = this.props;
                if (navigator) {
                    navigator.replace({
                        comp: GotoReister
                    });
                }
            }.bind(this)
        )
    },

    render:function(){
        return(
            <NavBarView navigator={this.props.navigator} title='设置交易密码'>

                <View style={{flexDirection:'column',paddingLeft:12,paddingRight:12}}>

                    <View style={{flex:1,flexDirection:'row',alignItems:'flex-end',marginTop:20,height:20}}>
                        <Text style={{fontSize:15,color:'#7f7f7f'}}>此密码用于票据贴现,请妥善保存</Text>
                    </View>

                    <Input type='default' prompt='交易密码' max={6} field='transactionPassword' isPwd={true}
                           onChanged={this.handleChanged}  icon='trading_PWD'/>

                    <Input type='default' prompt='再输一次交易密码' max={6} field='transactionPassword_again' isPwd={true}
                           onChanged={this.handleChanged} icon='trading_PWD'/>

                    <View style={{marginTop:36}}>
                        <Button func={this.next} checked={this.state.checked} content='完成'/>
                    </View>
                </View>
            </NavBarView>
        );
    }

})


module.exports = Register_setTradingPWD;
