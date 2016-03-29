'use strict';

var React = require('react-native');
var {
    StyleSheet,
    TouchableHighlight,
    Text,
    Image,
    View,
    ScrollView,
    Dimensions,
    Platform
    } = React;
var ListBottom = require('../../comp/utilsUi/listBottom')
var Adjust = require('../../comp/utils/adjust')
var UserAction = require('../../framework/action/userAction')
var CompAccountInfo = require('./compAccountInfo')
var BottomButton = require('../../comp/utilsUi/bottomButton')
var AppStore = require('../../framework/store/appStore');
var CompStore = require('../../framework/store/compStore');
var CompAction = require("../../framework/action/compAction")
var NavBarView = require('../../framework/system/navBarView')
var certificateState = require('../../constants/certificateState');
var NumberHelper = require('../../comp/utils/numberHelper')
var Alert = require('../../comp/utils/alert');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var PhotoPic = require('NativeModules').UserPhotoPicModule;
var CompCertifyCopies = React.createClass({
    getStateFromStores(){
        var newOrg = !this.props.param.item ? CompStore.getNewOrg() : this.props.param.item
        return {
            licenseCopyFileId: newOrg.licenseCopyFileId,
            authFileId: newOrg.authFileId,
            corpIdentityFileId: newOrg.corpIdentityFileId,
            authIdentityFileId: newOrg.authIdentityFileId,
            picEnough: newOrg.picEnough,
            data: !this.props.param.item ? {status: 'UNAUDITING'} : this.props.param.item,
            status: newOrg.status,
            newOrg: newOrg
        }
    },

    getInitialState: function () {
        return this.getStateFromStores()
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

    next: function () {
        const { navigator } = this.props;
        if (this.state.picEnough) {
            const { navigator } = this.props;
            if (navigator) {
                navigator.push({
                    comp: CompAccountInfo,
                    param: {
                        item: this.props.param.item
                    }
                })
            }
        } else {
            Alert("请完整认证资料副本")
        }
    },
    back: function () {
        this.props.navigator.pop();
    },
    selectPhoto(desc, name){
        if (Platform.OS === 'ios') {
            this.selectIOS(desc, name)
        } else {
            this.selectAndroid(desc, name)
        }
    },
    selectIOS(desc, name){
        var options = {
            title: desc, // specify null or empty string to remove the title
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照', // specify null or empty string to remove this button
            chooseFromLibraryButtonTitle: '图库', // specify null or empty string to remove this button
            cameraType: 'back', // 'front' or 'back'
            mediaType: 'photo', // 'photo' or 'video'
            videoQuality: 'high', // 'low', 'medium', or 'high'
            maxWidth: 100, // photos only
            maxHeight: 100, // photos only
            quality: 1, // photos only
            allowsEditing: true, // Built in iOS functionality to resize/reposition the image
            noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
            storageOptions: { // if this key is provided, the image will get saved in the documents directory (rather than a temporary directory)
                skipBackup: true, // image will NOT be backed up to icloud
                path: 'images' // will save image at /Documents/images rather than the root
            }
        };

        UIImagePickerManager.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('UIImagePickerManager Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                var source = response.uri.replace('file://', '')
                this.setState({
                    [name]: source
                });
                if (!this.props.param.item) {
                    CompAction.updateNewOrgInfo(
                        {[name]: source}
                    )
                } else {
                    CompAction.updateExist(
                        {
                            [name]: source,
                            id: this.state.newOrg.id
                        }
                    )
                }
            }
        });
    },
    selectAndroid(desc, name){
        console.log(desc + name);
        PhotoPic.showImagePic(false, name, (response)=> {
            console.log('Response = ', response);
            var source = response.uri;
            this.setState({
                [name]: source
            });
            if (!this.props.param.item) {
                CompAction.updateNewOrgInfo(
                    {[name]: source}
                )
            } else {
                CompAction.updateExist(
                    {
                        [name]: source,
                        id: this.state.newOrg.id
                    }
                )
            }
        });
    },
    returnItem(desc, name){
        let data = this.state.data;
        var url = require('../../image/user/head.png');
        if (!_.isEmpty(this.state[name])) {
            if (this.state[name].indexOf("@userId") > -1) {
                url = {uri: UserAction.getFile(this.state[name])}
            } else {
                url = {uri: this.state[name], isStatic: true};
            }
            if (data.status == 'AUDITING') {
                return (
                    <View>
                        <Image style={[styles.image,styles.radius,styles.error]} resizeMode="cover" source={url}>
                            <Text style={{fontSize:11,color:'white'}}>等待验证</Text>
                        </Image>
                    </View>
                )
            } else {
                let certResultBeans = this.state.newOrg.certResultBeans
                if (!certResultBeans) {
                    return (
                        <TouchableHighlight onPress={()=>{this.selectPhoto(desc, name)}}
                                            activeOpacity={0.6} underlayColor="#ebf1f2">
                            <Image style={[styles.image,styles.radius]} resizeMode="cover" source={url}/>
                        </TouchableHighlight>
                    )
                } else {
                    let flag, value, key;
                    for (key in certResultBeans) {
                        if (_.camelCase(certResultBeans[key].columnName) == name) {
                            flag = true;
                            value = certResultBeans[key].resultValue;
                            break;
                        } else {
                            flag = false;
                        }
                    }
                    if (flag) {
                        return (
                            <TouchableHighlight onPress={()=>{this.selectPhoto(desc, name)}}
                                                activeOpacity={0.6} underlayColor="#ebf1f2">
                                <Image style={[styles.image,styles.radius,styles.error]} resizeMode="cover"
                                       source={url}>
                                    <Text style={{fontSize:11,color:'white'}}>{value}</Text>
                                </Image>
                            </TouchableHighlight>
                        )
                    } else {
                        return (
                            <TouchableHighlight onPress={()=>{this.selectPhoto(desc, name)}} activeOpacity={0.6}
                                                underlayColor="#ebf1f2">
                                <Image style={[styles.image,styles.radius]} resizeMode="cover" source={url}/>
                            </TouchableHighlight>
                        )
                    }
                }
            }
        } else {
            return (
                <TouchableHighlight onPress={()=>{this.selectPhoto(desc, name)}}
                                    activeOpacity={0.6} underlayColor="#ebf1f2">
                    <Image style={[styles.image,styles.radius]}
                           resizeMode="cover" source={require('../../image/company/licence_copy.png')}/>
                </TouchableHighlight>
            )
        }
    },
    returnAccount(){
        let data = this.state.data;
        if (data.status == 'CERTIFIED' || data.status == 'AUDITING')
            return (
                <View>
                    <Text style={{paddingTop:32,height:55,fontSize:15}}>关联账户信息</Text>
                    <View
                        style={{flexDirection:'row',height:95,paddingLeft:Adjust.width(20),backgroundColor:'white',borderRadius:5,alignItems:'center',borderWidth:1,borderColor:'#c8c8c8'}}>
                        <Image style={{width:30,height:30,borderRadius:15,backgroundColor:'red'}}/>
                        <View style={{marginLeft:Adjust.width(20),flexDirection:'row',alignItems:'center'}}>
                            <Text style={{fontSize:18,color:'#333333'}}>账号：</Text>
                            <Text style={{fontSize:15,color:'#7f7f7f'}}>
                                {NumberHelper.formatNum(data.accountNo, 0, 6)}
                            </Text>
                        </View>
                    </View>
                </View>
            )
    },
    returnWarn(){
        let status = this.state.data.status;
        return (
            <View style={{marginTop:18, marginLeft:12}}>
                { (()=> {
                    if (status == 'REJECTED') {
                        return (
                            <Text style={{fontSize: 15, color: certificateState[status].colorA,paddingBottom:6}}>未通过，请点击修改错误材料</Text>
                        )
                    }
                })()}
                <View style={{flexDirection:"row"}}>
                    <Text style={{fontSize: 15, color: certificateState[status].colorA}}>
                        {certificateState[status].alter}
                    </Text>
                    <Text style={{fontSize: 15, color: certificateState[status].colorA}}>
                        如遇问题,请
                    </Text>
                    <Text style={{color: certificateState[status].colorA,fontSize: 15, textDecorationLine:"underline"}}>
                        联系客服
                    </Text>
                </View>
            </View>
        )
    },
    returnImg(){
        let status = this.state.data.status;
        if (status != 'CERTIFIED') {
            return (
                <View>
                    <View style={{flexDirection:"row"}}>
                        <View style={{flex:1,flexDirection:"column"}}>
                            <Text style={styles.copyName}>营业执照副本</Text>
                            {this.returnItem('营业执照副本', 'licenseCopyFileId')}
                        </View>
                        <View style={{flex:1,flexDirection:"column"}}>
                            <Text style={styles.copyName}>法定代表人身份证</Text>
                            {this.returnItem('法定代表人身份证', 'corpIdentityFileId')}
                        </View>
                    </View>
                    <View style={{flexDirection:"row",marginTop:10}}>
                        <View style={{flex:1,flexDirection:"column"}}>
                            <Text style={[styles.copyName,{height:46,marginRight:5}]}>法人授权委托证明书(需盖公章)</Text>
                            {this.returnItem('法人授权委托证明书', 'authFileId')}
                        </View>
                        <View style={{flex:1,flexDirection:"column"}}>
                            <Text style={[styles.copyName,{height:46}]}>授权经办人身份证</Text>
                            {this.returnItem('授权经办人身份证', 'authIdentityFileId')}
                        </View>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={{marginTop:32}}>
                    <Text style={{marginLeft:14,fontSize:15,color:"#333333"}}>营业执照信息</Text>
                    <View style={{height:150,marginTop:11,marginHorizontal:14,borderRadius:10,borderWidth:1,borderColor:"#CCCCCC"}}>
                        <View style={[styles.licenseItem,styles.borderBottom]}>
                            <Text style={{fontSize:18,color:"#333333"}}>注册号</Text>
                            <Text style={{fontSize:15,color:"#7F7F7F"}}>  </Text>
                        </View>
                        <View style={[styles.licenseItem,styles.borderBottom]}>
                            <Text style={{fontSize:18,color:"#333333"}}>名称</Text>
                            <Text style={{fontSize:15,color:"#7F7F7F"}}></Text>
                        </View>
                        <View style={styles.licenseItem}>
                            <Text style={{fontSize:18,color:"#333333"}}>法定代表人</Text>
                            <Text style={{fontSize:15,color:"#7F7F7F"}}>  </Text>
                        </View>
                    </View>
                    <Text style={{marginLeft:14,marginTop:30,fontSize:15,color:"#333333"}}>关联账户信息</Text>
                    <View style={styles.accountInfo}>
                        <Image style={{marginLeft:12,height:40,width:40}}
                               source={require('../../image/user/head.png')}/>
                        <Text style={{marginHorizontal:12,fontSize:18,color:"#333333"}}>账号</Text>
                        <Text style={{marginHorizontal:12,fontSize:15,color:"#7f7f7f"}}>  </Text>
                    </View>
                </View>
            )
        }
    },
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="1.认证资料副本">
                <ScrollView>
                    <View style={{flex:1,marginTop:32,marginHorizontal:Adjust.width(12)}}>
                        {this.returnImg()}
                        {this.returnAccount()}
                        {this.returnWarn()}
                        <ListBottom/>
                    </View>
                </ScrollView>
                <BottomButton func={this[certificateState[this.state.data.status].button]}
                              content={certificateState[this.state.data.status].content}/>

            </NavBarView>
        )
    }
});
var styles = StyleSheet.create({
    bottom: {
        padding: 7,
        backgroundColor: '#f7f7f7',
        borderTopWidth: 1,
        borderTopColor: '#cccccc',
        opacity: 0.9
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderColor: '#c8c7cc'
    },
    radius: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#C8C8C8"
    },
    button: {
        backgroundColor: '#44bcbc',
        height: 47,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        height: 113,
        width: Dimensions.get("window").width / 2 - 18,
        backgroundColor: "#f0f0f0",
        marginTop: 5
    },
    copyName: {
        alignItems: "center",
        fontSize: 15,
        color: "#333333"
    },
    communicate: {
        fontSize: 15, color: "#ff5b58",
    },
    error: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
        opacity: 0.5
    },
    licenseItem:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        height:50,
        marginHorizontal:12
    },
    accountInfo:{
        flexDirection:"row",
        alignItems:"center",
        height:80,
        marginTop:11,
        marginHorizontal:14,
        borderRadius:10,
        borderWidth:1,
        borderColor:"#CCCCCC"
    }
});
module.exports = CompCertifyCopies;