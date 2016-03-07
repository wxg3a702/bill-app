'use strict';

var React = require('react-native');
var {
    View,
    StyleSheet,
    TouchableHighlight,
    Image,
    Text
    }=React
var Advice = require('./advice')
var UserInfo = require('./userInfo')
var SecurityCenter = require('./securityCenter')
var ToolHome = require('./toolHome')
var HelpCenter = require('./helpCenter')
var AboutUs = require('./aboutUs')
var certificateState = require('../../constants/certificateState')
var {Icon,} = require('react-native-icons');
var AppStore=require('../../framework/store/appStore');
var AppAction=require('../../framework/action/appAction');
var NavBarView = require('../../framework/system/navBarView');
var phoneNumber = require('../../comp/utils/numberHelper').phoneNumber
var PersonalCenter = React.createClass({
    getStateFromStores() {
        var user = AppStore.getUserInfoBean();
        return {
            //userName: user.userName,
            //phoneNum: user.mobileNo,
            phoneNum:'15312631211'
            //userType: user.userType,
            //userTypeValue: (user.userType == "REGISTERED") ? "注册用户" : "认证用户",
            //orgState: AppStore.getOrgBeans()[0].biStatus,
            //photoStoreId:user.photoStoreId
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
    toOther(name){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                comp: name,
            })
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
                    <Icon name='ion|ios-arrow-forward' size={26} color='C7C7CC' style={styles.icon}/>
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
                <View style={[styles.flexColumn,{backgroundColor:'white',marginTop:18,height:90},styles.borderTop,styles.borderBottom]}>
                    <TouchableHighlight activeOpacity={0.8} underlayColor='#f0f0f0' onPress={()=>this.toOther(UserInfo)}>
                        <View style={[styles.flexRow,styles.between,{paddingTop:10,paddingBottom:10}]}>
                            <View style={[styles.flexOne,styles.flexRow]}>
                                <Image style={styles.head} resizeMode="stretch"
                                       source={this.returnImg()}/>
                                <View style={{marginLeft:13,marginTop:10}}>
                                    <Text style={[styles.title]}>{this.state.userName}</Text>
                                    <View style={[styles.flexRow]}>
                                        <Image style={[styles.circle,{marginTop:14,borderColor: '#cccccc', borderBottomWidth: 1}]} resizeMode="stretch"
                                               source={this.state.userType=='REGISTERED'?require('../../image/user/register.png'):
                                               require('../../image/user/certify.png')}/>
                                        <View>
                                            <Text
                                                style={[styles.date,{marginTop:16,marginLeft:8}]}>{this.state.userTypeValue}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View>
                                <Icon name='ion|ios-arrow-forward' size={26} color='C7C7CC'
                                      style={[styles.icon,{marginTop:15}]}/>
                            </View>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight activeOpacity={0.8} underlayColor='#cccccc' style={{marginTop:23}}
                                        onPress={()=>this.toOther(SecurityCenter)}>
                        <View
                            style={[styles.listLayout,styles.borderBottom,styles.borderTop,{alignItems:'center',justifyContent:'space-between',flexDirection:'row'}]}>
                            <View style={[styles.flexRow,styles.flexOne]}>
                                <Image style={styles.circle}
                                       source={require('../../image/user/securityCenter.png')}/>
                                <View style={{marginLeft:16}}>
                                    <Text style={styles.title}>安全设置</Text>
                                </View>
                            </View>
                            <View style={[styles.flexRow,{alignItems:'center'}]}>
                                <View>
                                    <Text style={styles.date}>{phoneNumber(this.state.phoneNum)}</Text>
                                </View>
                                <Icon name='ion|ios-arrow-forward' size={26} color='C7C7CC' style={styles.icon}/>
                            </View>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight activeOpacity={0.8} underlayColor='#cccccc'
                                        onPress={()=>this.toOther(CompCertification)}>
                        <View
                            style={[styles.listLayout,styles.borderBottom,{alignItems:'center',justifyContent:'space-between',flexDirection:'row'}]}>
                            <View style={[styles.flexRow,styles.flexOne]}>
                                <Image style={styles.circle}
                                       source={require('../../image/user/compCertificate.png')}/>
                                <View style={{marginLeft:16}}>
                                    <Text style={styles.title}>企业认证</Text>
                                </View>
                            </View>
                            <View style={[styles.flexRow,{alignItems:'center'}]}>
                                <Icon name='ion|ios-arrow-forward' size={26} color='C7C7CC' style={styles.icon}/>
                            </View>
                        </View>
                    </TouchableHighlight>
                    {this.returnItem(ToolHome, '工具', require('../../image/user/tool.png'))}
                    {this.returnItem(HelpCenter, '帮助中心', require('../../image/user/helpCenter.png'))}
                    {this.returnItem(Advice, '意见反馈', require('../../image/user/advice.png'))}
                    {this.returnItem(AboutUs, '关于我们', require('../../image/user/aboutUs.png'))}
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