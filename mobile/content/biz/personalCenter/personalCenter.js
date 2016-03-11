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
var UserInfo = require('./../user/userInfo')
var SecurityCenter = require('./../securityCenter/securityCenter')
var ToolHome = require('./toolHome')
var HelpCenter = require('./helpCenter')
var AboutUs = require('./aboutUs')
var certificateState = require('../../constants/certificateState')
var CompCertification=require('../company/compCertification')
var AppStore = require('../../framework/store/appStore');
var AppAction = require('../../framework/action/appAction');
var NavBarView = require('../../framework/system/navBarView');
var VIcon = require('../../comp/icon/vIcon')
var PersonalCenter = React.createClass({
    getStateFromStores() {
        var token = AppStore.getToken();
        var user = AppStore.getUserInfoBean();
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
                orgState: AppStore.getOrgBeans()[0].biStatus,
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
    returnItem(path, desc, imgPath){
        return (
            <TouchableHighlight activeOpacity={0.8} underlayColor='#cccccc' onPress={()=>this.toOther(path)}>
                <View
                    style={[styles.listLayout,styles.borderBottom,{alignItems:'center',justifyContent:'space-between',flexDirection:'row'}]}>
                    <View style={[styles.flexRow,styles.flexOne]}>
                        <Image style={styles.circle} source={imgPath}/>
                        <View style={{marginLeft:16}}>
                            <Text style={styles.title}>{desc}</Text>
                        </View>
                    </View>
                    <VIcon/>
                </View>
            </TouchableHighlight>
        )
    },
    returnImg(){
        var url;
        if (!_.isEmpty(this.state.photoStoreId)) {
            if (this.state.photoStoreId.length == 24) {
                url = {uri: AppAction.getFile(this.state.photoStoreId)}
            } else {
                url = {uri: this.state.photoStoreId, isStatic: true};
            }
        } else {
            url = require('../../image/user/head.png')
        }
        return url;
    },
    render(){
        return (
            <NavBarView navigator={this.props.navigator} title="个人中心" showBack={false} showBar={true}>
                <View
                    style={[styles.flexColumn,{backgroundColor:'white',marginTop:18},styles.borderTop,styles.borderBottom]}>
                    <TouchableHighlight activeOpacity={0.8} underlayColor='#f0f0f0'
                                        onPress={()=>this.toPage(()=>this.toOther(UserInfo))}>
                        <View
                            style={[styles.flexRow,styles.between,{paddingTop:10,paddingBottom:10,height:84,alignItems:'center'}]}>
                            <View style={[styles.flexOne,styles.flexRow]}>
                                <Image style={styles.head} resizeMode="stretch"
                                       source={this.returnImg()}/>
                                <View style={{marginLeft:13,marginTop:10}}>
                                    <Text style={[styles.title]}>{this.state.userName}</Text>
                                    <View style={[styles.flexRow]}>
                                        <Image
                                            style={[styles.circle,{marginTop:14,borderColor: '#cccccc', borderBottomWidth: 1}]}
                                            resizeMode="stretch"
                                            source={this.state.userType=='REGISTERED'?require('../../image/personalCenter/register.png'):
                                               require('../../image/personalCenter/certify.png')}/>
                                        <Text
                                            style={[styles.date,{marginTop:16,marginLeft:8}]}>{this.state.userTypeValue}</Text>
                                    </View>
                                </View>
                            </View>
                            <VIcon/>
                        </View>
                    </TouchableHighlight>
                    <View style={[{height:23,backgroundColor:'#f7f7f7'}]}></View>
                    <TouchableHighlight activeOpacity={0.8} underlayColor='#cccccc'
                                        onPress={()=>this.toPage(()=>this.toOther(SecurityCenter))}>
                        <View
                            style={[styles.listLayout,styles.borderBottom,styles.borderTop,{alignItems:'center',justifyContent:'space-between',flexDirection:'row'}]}>
                            <View style={[styles.flexRow,styles.flexOne]}>
                                <Image style={styles.circle}
                                       source={require('../../image/personalCenter/securityCenter.png')}/>
                                <View style={{marginLeft:16}}>
                                    <Text style={styles.title}>设置</Text>
                                </View>
                            </View>
                            <View style={[styles.flexRow,{alignItems:'center'}]}>
                                <VIcon/>
                            </View>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight activeOpacity={0.8} underlayColor='#cccccc'
                                        onPress={()=>this.toPage(()=>this.toOther(CompCertification))}>
                        <View
                            style={[styles.listLayout,styles.borderBottom,{alignItems:'center',justifyContent:'space-between',flexDirection:'row'}]}>
                            <View style={[styles.flexRow,styles.flexOne]}>
                                <Image style={styles.circle}
                                       source={require('../../image/personalCenter/compCertificate.png')}/>
                                <View style={{marginLeft:16}}>
                                    <Text style={styles.title}>企业认证</Text>
                                </View>
                            </View>
                            <View style={[styles.flexRow,{alignItems:'center'}]}>
                                <VIcon/>
                            </View>
                        </View>
                    </TouchableHighlight>
                    {this.returnItem(ToolHome, '工具', require('../../image/personalCenter/tool.png'))}
                    {this.returnItem(HelpCenter, '帮助中心', require('../../image/personalCenter/helpCenter.png'))}
                    <TouchableHighlight activeOpacity={0.8} underlayColor='#cccccc'
                                        onPress={()=>this.toPage(()=>this.toOther(Advice))}>
                        <View
                            style={[styles.listLayout,styles.borderBottom,{alignItems:'center',justifyContent:'space-between',flexDirection:'row'}]}>
                            <View style={[styles.flexRow,styles.flexOne]}>
                                <Image style={styles.circle} source={require('../../image/personalCenter/advice.png')}/>
                                <View style={{marginLeft:16}}>
                                    <Text style={styles.title}>意见反馈</Text>
                                </View>
                            </View>
                            <VIcon/>
                        </View>
                    </TouchableHighlight>
                    {this.returnItem(AboutUs, '关于我们', require('../../image/personalCenter/aboutUs.png'))}
                </View>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
    flexOne: {
        flex: 1
    },
    flexColumn: {
        flexDirection: 'column'
    },
    flexRow: {
        flexDirection: 'row'
    },
    title: {
        fontSize: 18,
        color: '#323232'
    },
    date: {
        fontSize: 15,
        color: '#7f7f7f',
    },
    persent: {
        fontSize: 15,
        color: '#43bb80',
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
    borderTop: {
        borderTopWidth: 1,
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderColor: '#c8c7cc'
    },
    circle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginTop: 1
    },
    listLayout: {
        height: 51, paddingLeft: 16, backgroundColor: 'white'
    },
    icon: {
        width: 35, height: 35,
    },
    between: {
        justifyContent: 'space-between'
    },

});
module.exports = PersonalCenter