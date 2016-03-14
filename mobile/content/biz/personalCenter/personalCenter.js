'use strict';

var React = require('react-native');
var {
    View,
    StyleSheet,
    TouchableHighlight,
    Image,
    Text
    }=React
var Login = require('../login/login')
var Advice = require('./advice')
var UserInfo = require('../user/userInfo')
var Setting = require('../setting/setting')
var ToolHome = require('./toolHome')
var HelpCenter = require('./helpCenter')
var AboutUs = require('./aboutUs')
var CompCertification = require('../company/compCertification')
var AppStore = require('../../framework/store/appStore');
var UserStore = require('../../framework/store/userStore');
var UserAction = require('../../framework/action/userAction');
var NavBarView = require('../../framework/system/navBarView');
var VIcon = require('../../comp/icon/vIcon')
var Item = require('../../comp/utils/item')
var Space = require('../../comp/utils/space')
var PersonalCenter = React.createClass({
    getStateFromStores() {
        var token = AppStore.getToken();
        var user = UserStore.getUserInfoBean();
        if (token == null) {
            return {
                userName: '未登录',
                token: token
            }
        } else {
            return {
                token: token,
                userName: user.userName,
                userType: user.userType,
                userTypeValue: (user.userType == "REGISTERED") ? "注册用户" : "认证用户",
                photoStoreId: user.photoStoreId
            };
        }
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
    toOther(name){
        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                comp: name,
            })
        }
    },
    toPage(call){
        if (this.state.token == null) {
            this.props.navigator.push({comp: Login})
        } else {
            call();
        }
    },
    returnImg(){
        var url;
        if (!_.isEmpty(this.state.photoStoreId)) {
            if (this.state.photoStoreId.length == 24) {
                url = {uri: UserAction.getFile(this.state.photoStoreId)}
            } else {
                url = {uri: this.state.photoStoreId, isStatic: true};
            }
        } else {
            url = require('../../image/user/head.png')
        }
        return url;
    },
    returnPic(){
        var source
        if (this.state.userType == 'REGISTERED') {
            source = require('../../image/personalCenter/register.png');
        } else {
            source = require('../../image/personalCenter/certify.png');
        }
        return source;
    },
    render(){
        return (
            <NavBarView navigator={this.props.navigator} title="个人中心" showBack={false} showBar={true}>
                <Space top={false}/>
                <View style={{backgroundColor:'white'}}>
                    <TouchableHighlight activeOpacity={0.8} underlayColor='#f0f0f0'
                                        onPress={()=>this.toPage(()=>this.toOther(UserInfo))}>
                        <View style={styles.layout}>
                            <View style={{flexDirection:'row'}}>
                                <Image style={styles.head} resizeMode="stretch" source={this.returnImg()}/>
                                <View style={{marginLeft:13,marginTop:10}}>
                                    <Text style={{fontSize: 18,color: '#323232'}}>{this.state.userName}</Text>
                                    <View style={{flexDirection:'row',alignItems:'flex-end'}}>
                                        <Image style={styles.circle} resizeMode="stretch" source={this.returnPic()}/>
                                        <Text style={{marginTop:16,marginLeft:8, fontSize: 15,color: '#7f7f7f'}}>
                                            {this.state.userTypeValue}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <VIcon/>
                        </View>
                    </TouchableHighlight>
                    <Space/>
                    <Item func={()=>this.toOther(Setting)} desc="设置"
                          imgPath={require('../../image/personalCenter/securityCenter.png')}/>
                    <Item func={()=>this.toOther(CompCertification)} desc="企业认证"
                          imgPath={require('../../image/personalCenter/compCertificate.png')}/>
                    <Item func={()=>this.toOther(ToolHome)} desc="工具"
                          imgPath={require('../../image/personalCenter/tool.png')}/>
                    <Item func={()=>this.toOther(HelpCenter)} desc="帮助中心"
                          imgPath={require('../../image/personalCenter/helpCenter.png')}/>
                    <Item func={()=>this.toOther(Advice)} desc="意见反馈"
                          imgPath={require('../../image/personalCenter/advice.png')}/>
                    <Item func={()=>this.toOther(AboutUs)} desc="关于我们"
                          imgPath={require('../../image/personalCenter/aboutUs.png')}/>
                </View>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
    layout: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        height: 84
    },
    head: {
        width: 63,
        height: 63,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        borderColor: '#cccccc',
        borderWidth: 1,
        marginLeft: 10
    },
    circle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginTop: 14,
    },
});
module.exports = PersonalCenter