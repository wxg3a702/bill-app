'use strict';

var React = require('react-native');
var {
    TouchableHighlight,
    Text,
    View,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ScrollView
    } = React;
var NavBarView = require('../../framework/system/navBarView')
var AppStore = require('../../framework/store/appStore');
var AppAction = require("../../framework/action/appAction")
var {Icon,} = require('react-native-icons');
var TextEdit = require('./textEdit')
var Position = require('./position')
var phoneNumber = require('../../comp/utils/numberHelper').phoneNumber
var EditPhone = require('./editPhone')
var Validation = require('../../comp/utils/validation')
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var window = Dimensions.get('window');
var UserInfo = React.createClass({
    getStateFromStores() {
        var user = AppStore.getUserInfoBean();
        var orgBean = AppStore.getOrgBeans()[0];
        return {
            userName: Validation.isNull(user.userName) ? '未设置' : user.userName,
            mobileNo: Validation.isNull(user.mobileNo)?'':user.mobileNo,
            newMobileNo: Validation.isNull(user.newMobileNo) ? '未设置' : user.newMobileNo,
            realName: Validation.isNull(user.realName) ? '未设置' : user.realName,
            telephoneNo: Validation.isNull(user.telephoneNo) ? '未设置' : user.telephoneNo,
            qqNo: (Validation.isNull(user.qqNo) || user.qqNo == 0) ? '未设置' : user.qqNo,
            wechatNo: Validation.isNull(user.wechatNo) ? '未设置' : user.wechatNo,
            email: Validation.isNull(user.email) ? '未设置' : user.email,
            jobTitle: Validation.isNull(user.jobTitle) ? '未设置' : user.jobTitle,
            location: Validation.isNull(user.location) ? '未设置' : user.location,
            comp: (orgBean.biStatus == 'CERTIFIED' && orgBean.cmStatus == 'CERTIFIED' && orgBean.raStatus == 'CERTIFIED') ? orgBean.orgName : '未设置',
            photoStoreId: user.photoStoreId
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
    callBack(data, cb){
        AppAction.updateUser(
            data,
            cb)
    },
    select(desc, name){
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
                AppAction.updateUserHead(
                    {[name]: source}
                )
            }
        });
    },
    toEdit: function (title, name, value, type, maxLength, valid) {
        if (value == '未设置') {
            value = ''
        }
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                comp: TextEdit,
                param: {
                    title: title,
                    name: name,
                    value: value,
                    type: type,
                    maxLength: maxLength,
                    valid: valid
                },
                callBack: this.callBack
            })
        }
    },
    logout: function () {
        AppAction.logOut()
    },
    button(){
        return (
            <View>
                <TouchableOpacity onPress={this.logout} style={{padding:10}} activeOpacity={0.5}>
                    <View style={{flexDirection:'row',alignItems:'center',height:20}}>
                        <Image resizeMode="stretch" style={{width:20,height:20}}
                               source={require('../../image/user/exit.png')}/>
                        <Text style={{color:'#ff5b58',textAlign:'right',marginRight:5,fontSize:15}}>退出</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    },
    changePhone(){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({comp: EditPhone});
        }
    },
    toPosition(){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                comp: Position,
                param: {
                    location: this.state.location
                }
            });
        }
    },
    returnItem(desc, key, value, img, type, length, valid){
        var {height, width} = Dimensions.get('window');
        if (_.isEmpty(value) || value.length <= 23) {
            return (
                <TouchableHighlight underlayColor={'#cccccc'}
                                    onPress={() => this.toEdit(desc,key,value,type,length,valid)}>
                    <View
                        style={{height:50,flexDirection:'row',justifyContent: 'space-between',alignItems:'center',paddingLeft:16,borderBottomColor: '#cccccc', borderBottomWidth: 1}}>
                        <View style={{flexDirection:'row'}}>
                            <Image style={{width: 16,height: 16,borderRadius: 8,marginTop: 1}} resizeMode="stretch"
                                   source={img}/>
                            <Text style={{marginLeft:16,fontSize: 18, color: '#323232', width: 90}}>{desc}：</Text>
                        </View>
                        <View style={{alignItems:'center',flexDirection:'row'}}>
                            <Text style={{fontSize: 15, color: '#7f7f7f', textAlign: 'right'}}
                                  numberOfLines={1}>{value}</Text>
                            <Icon name='ion|ios-arrow-forward' size={26} color='C7C7CC'
                                  style={{width: 35, height: 35}}/>
                        </View>
                    </View>
                </TouchableHighlight>
            )
        } else {
            return (
                <TouchableHighlight underlayColor={'#cccccc'}
                                    onPress={() => this.toEdit(desc,key,value,type,length,valid)}>
                    <View
                        style={[{flex:1,paddingHorizontal:16,alignItems:'center',flexDirection:'row',borderColor: '#cccccc', borderBottomWidth: 1},styles.paddingOne,value.length>23 && styles.paddingTwo]}>
                        <View style={{flexDirection:'row',width:132}}>
                            <Image style={{width: 16,height: 16,borderRadius: 8,marginTop: 1}} resizeMode="stretch"
                                   source={img}/>
                            <Text style={{marginLeft:16,fontSize: 18, color: '#323232', width: 90}}>{desc}：</Text>
                        </View>
                        <View style={{alignItems:'center',flexDirection:'row',width:width-138}}>
                            <View >
                                <Text style={[{fontSize: 15,width:width-184,color: '#7f7f7f'}]}>{value}</Text>
                            </View>
                            <Icon name='ion|ios-arrow-forward' size={26} color='C7C7CC'
                                  style={{width: 35, height: 35}}/>
                        </View>
                    </View>
                </TouchableHighlight>
            )
        }
    },
    returnImg(){
        var url = require('../../image/user/head.png');
        if (!_.isEmpty(this.state.photoStoreId)) {
            if (this.state.photoStoreId.length == 24) {
                url = {uri: AppAction.getFile(this.state.photoStoreId)}
            } else {
                url = {uri: this.state.photoStoreId, isStatic: true};
            }
        }
        return url;
    },
    render: function () {
        var {height, width} = Dimensions.get('window');
        return (
            <NavBarView navigator={this.props.navigator} title="个人信息" actionButton={this.button()}>
                <ScrollView automaticallyAdjustContentInsets={false} horizontal={false}>
                    <View style={[{height:122,backgroundColor:'#f0f0f0',alignItems:'center',flexDirection:'column',}]}>
                        <TouchableHighlight onPress={()=>{this.select('用户头像','photoStoreId')}} activeOpacity={0.6}
                                            underlayColor="#ebf1f2">
                            <Image
                                style={{width: 63,height: 63,borderRadius: 5, marginTop: 18,borderColor: '#7f7f7f', borderBottomWidth: 1}}
                                resizeMode="stretch" source={this.returnImg()}/>
                        </TouchableHighlight>
                        <Text style={{fontSize: 15, color: '#333333', marginTop: 8}}>{this.state.userName}</Text>
                    </View>
                    <View style={{backgroundColor:'white',flexDirection:'column'}}>
                        {this.returnItem("姓名", 'realName', this.state.realName, require('../../image/user/realName.png'), 'name', 20, Validation.realName)}
                        <TouchableHighlight underlayColor={'#cccccc'} onPress={this.changePhone}>
                            <View
                                style={{height:50,flexDirection:'row',justifyContent: 'space-between',alignItems:'center',paddingLeft:16,borderBottomColor: '#cccccc', borderBottomWidth: 1}}>
                                <View style={{flex:1,flexDirection:'row'}}>
                                    <Image style={{width: 16,height: 16,borderRadius: 8,marginTop: 1}}
                                           resizeMode="stretch"
                                           source={require('../../image/user/mobileNo.png')}/>
                                    <View style={{marginLeft:16}}>
                                        <Text style={{fontSize: 18, color: '#323232', width: 80}}>手机号：</Text>
                                    </View>
                                </View>
                                <View style={{alignItems:'center',flexDirection:'row'}}>
                                    <View>
                                        <Text
                                            style={{fontSize: 15, color: '#7f7f7f', textAlign: 'right'}}>{phoneNumber(this.state.mobileNo)}</Text>
                                    </View>
                                    <Icon name='ion|ios-arrow-forward' size={26} color='C7C7CC'
                                          style={{width: 35, height: 35}}/>
                                </View>
                            </View>
                        </TouchableHighlight>
                        {this.returnItem("座机号", 'telephoneNo', this.state.telephoneNo, require('../../image/user/telephoneNo.png'), 'telephone', 13, Validation.isTelephone)}
                        {this.returnItem("QQ", 'qqNo', this.state.qqNo, require('../../image/user/qqNo.png'), 'number', 20, Validation.isQQ)}
                        {this.returnItem("微信", 'wechatNo', this.state.wechatNo, require('../../image/user/wechatNo.png'), '', 40, '')}
                        {this.returnItem("电子邮箱", 'email', this.state.email, require('../../image/user/email.png'), '', 60, Validation.isEmail)}
                    </View>
                    <View style={[{backgroundColor:'white',marginTop:16,flexDirection: 'column',}]}>
                        <View
                            style={[{flex:1,paddingHorizontal:16,alignItems:'center',flexDirection:'row',borderColor: '#cccccc', borderBottomWidth: 1,borderTopWidth:1},styles.paddingOne,this.state.comp.length>14 && styles.paddingTwo]}>
                            <Image style={{width: 16,height: 16,borderRadius: 8,marginTop: 1}}
                                   resizeMode="stretch" source={require('../../image/user/comp.png')}/>
                            <Text style={{marginLeft:16,fontSize: 18, color: '#323232', width: 80}}>公司：</Text>
                            <Text
                                style={[{fontSize: 15, width:width-144,color: '#7f7f7f', marginRight: 32},styles.textRight,this.state.comp.length>14 && styles.textLeft]}>
                                {this.state.comp}
                            </Text>
                        </View>
                        {this.returnItem("职务", 'jobTitle', this.state.jobTitle, require('../../image/user/jobTitle.png'), 'name', 20, '')}
                        <TouchableHighlight underlayColor={'#cccccc'} onPress={this.toPosition}>
                            <View
                                style={{height:50,flexDirection:'row',justifyContent: 'space-between',alignItems:'center',paddingLeft:16,borderBottomColor: '#cccccc', borderBottomWidth: 1}}>
                                <View style={{flex:1,flexDirection:'row'}}>
                                    <Image style={{width: 16,height: 16,borderRadius: 8,marginTop: 1}}
                                           resizeMode="stretch"
                                           source={require('../../image/user/location.png')}/>
                                    <View style={{marginLeft:16}}>
                                        <Text style={{fontSize: 18, color: '#323232', width: 80}}>所在地：</Text>
                                    </View>
                                </View>
                                <View style={{alignItems:'center',flexDirection:'row'}}>
                                    <View>
                                        <Text
                                            style={{fontSize: 15, color: '#7f7f7f', textAlign: 'right'}}>{this.state.location}</Text>
                                    </View>
                                    <Icon name='ion|ios-arrow-forward' size={26} color='C7C7CC'
                                          style={{width: 35, height: 35}}/>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                </ScrollView>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
    textLeft: {
        textAlign: 'left'
    },
    textRight: {
        textAlign: 'right'
    },
    paddingOne: {
        paddingVertical: 16
    },
    paddingTwo: {
        paddingVertical: 10
    }
})
module.exports = UserInfo;