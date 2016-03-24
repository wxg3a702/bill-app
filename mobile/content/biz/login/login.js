'use strict';

var React = require('react-native');
var {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Platform
    } = React;
var AppStore = require('../../framework/store/appStore');
var UserStore = require('../../framework/store/userStore');
var LoginAction = require("../../framework/action/loginAction");
var Register_checkPhone = require('./register_checkPhone');
var Forget_checkPhone = require('./forget_checkPhone');
var NavBarView = require('../../framework/system/navBarView');
var dismissKeyboard = require('react-native-dismiss-keyboard');
var VerifyCode = require('../../comp/utilsUi/verifyCode');
var Button = require('../../comp/utilsUi/button');
var Input = require('../../comp/utilsUi/input');
var Alert = require('../../comp/utils/alert');
var Login = React.createClass({
    getStateFromStores() {
        var user = UserStore.getUserInfoBean();
        var deviceModel = 'IOS'
        if (Platform.OS != 'ios') {
            deviceModel = 'ANDROID'
        }
        return {
            loaded: false,
            checked: true,
            userName: '',
            password: '',
            verify: '',
            active: false,
            deviceModel: deviceModel,
            APNSToken: AppStore.getAPNSToken()
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    componentDidMount() {
        AppStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        AppStore.removeChangeListener(this._onChange);
    },
    _onChange: function () {
        this.setState(this.getStateFromStores());
    },
    login: function () {
        if (this.state.userName.length == 0 || this.state.password.length == 0 || this.state.verify.length == 0) {

        } else {
            dismissKeyboard()
            LoginAction.login(
                {
                    userName: this.state.userName,
                    password: this.state.password,
                    deviceToken: this.state.APNSToken,
                    deviceModel: this.state.deviceModel,
                    captcha: this.state.verify
                },
                () => this.props.navigator.pop(),
                (msg)=> {
                    Alert(msg.msgContent);
                    this.refs['verifyCode'].changeVerify()
                }
            )
        }
    },
    toOther: function (name) {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({comp: name})
        }
    },
    textOnchange: function (text, type) {
        this.setState({[type]: text})
        if (this.state.userName.length == 0 || this.state.password.length == 0 || this.state.verify.length == 0) {
            this.setState({checked: true})
        } else {
            this.setState({checked: false})
        }
    },

    handleChanged(key, value){
        this.textOnchange(value, key);
    },

    render: function () {
        //LoginAction.registerAPNS()
        return (
            <NavBarView title="登录" navigator={this.props.navigator} showBack={true}>
                <View style={[{flexDirection: 'column',flex:1},styles.paddingLR]}>

                    <Input type='default' prompt="用户名/手机号" max={20} field="userName" isPwd={false}
                           onChanged={this.handleChanged} icon="user"/>

                    <Input type='default' prompt="密码" max={16} field="password" isPwd={true}
                           onChanged={this.handleChanged} icon="password"/>

                    <VerifyCode ref="verifyCode" onChanged={this.handleChanged}/>

                    <View style={{marginTop:24}}>
                        <Button func={this.login} content="登录" checked={this.state.checked}/>
                    </View>
                    <View style={styles.menu}>
                        <TouchableOpacity onPress={(()=>{this.toOther(Register_checkPhone)})}>
                            <Text style={styles.colorPath}>新用户注册</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={(()=>{this.toOther(Forget_checkPhone)})}>
                            <Text style={styles.colorPath}>忘记密码?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </NavBarView>
        )
    }
});
var styles = StyleSheet.create({
    menu: {
        paddingTop: 24, paddingBottom: 50,
        alignItems: 'center', flexDirection: "row", justifyContent: "space-between"
    },
    colorPath: {
        fontSize: 15, color: '#333333'
    },
    paddingLR: {
        paddingLeft: 12, paddingRight: 12,
    },
});

module.exports = Login;