'use strict';

var React = require('react-native');
var {
    TouchableHighlight,
    Text,
    View,
    Image,
    StyleSheet,
    Dimensions,
    ScrollView,
    Platform,
    DeviceEventEmitter,
    NativeModules
    } = React;

var NavBarView = require('../../framework/system/navBarView')
var UserStore = require('../../framework/store/userStore');
var CompStore = require('../../framework/store/compStore');
var AppStore = require('../../framework/store/appStore');
var UserAction = require("../../framework/action/userAction")
var LoginAction = require("../../framework/action/loginAction")
var TextEdit = require('./textEdit')
var Position = require('./position')
var phoneNumber = require('../../comp/utils/numberHelper').phoneNumber
var EditPhone = require('./../setting/editPhone')
var EditComp = require('./editComp')
var Validation = require('../../comp/utils/validation')
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var window = Dimensions.get('window');
var Item = require('../../comp/utils/item');
var RightTopButton = require('../../comp/utilsUi/rightTopButton')
var Space = require('../../comp/utilsUi/space')
var PhotoPic = require('NativeModules').UserPhotoPicModule;
var Alert = require('../../comp/utils/alert');

var UserInfo = React.createClass({
    getStateFromStores() {
        var user = UserStore.getUserInfoBean();
        return {
            imageSource: '',
            userName: Validation.isNull(user.userName) ? '未设置' : user.userName,
            mobileNo: Validation.isNull(user.mobileNo) ? '' : user.mobileNo,
            newMobileNo: Validation.isNull(user.newMobileNo) ? '未设置' : user.newMobileNo,
            realName: Validation.isNull(user.realName) ? '未设置' : user.realName,
            telephoneNo: Validation.isNull(user.telephoneNo) ? '未设置' : user.telephoneNo,
            qqNo: (Validation.isNull(user.qqNo) || user.qqNo == 0) ? '未设置' : user.qqNo,
            wechatNo: Validation.isNull(user.wechatNo) ? '未设置' : user.wechatNo,
            email: Validation.isNull(user.email) ? '未设置' : user.email,
            jobTitle: Validation.isNull(user.jobTitle) ? '未设置' : user.jobTitle,
            location: Validation.isNull(user.location) ? '未设置' : user.location,
            comp: Validation.isNull(user.comp) ? '未设置' : user.comp,
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
        UserAction.updateUser(
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
            aspectX: 1, // aspectX:aspectY, the cropping image's ratio of width to height
            aspectY: 1, // aspectX:aspectY, the cropping image's ratio of width to height
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
                UserAction.updateUserHead(
                    {[name]: source}
                )
            }
        });
    },

    selectAndroid(desc, name){
        console.log(desc + name);
        PhotoPic.showImagePic(true, (response)=> {
            console.log('Response = ', response);
            this.setState({
                imageSource: response.uri
            });
            UserAction.updateUserHead(
                {['photoStoreId']: this.state.imageSource},
                ()=>Alert("上传成功"),
                ()=> Alert("上传失败")
            )
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
        Alert(
            '确定退出当前帐号?',
            () => LoginAction.logOut(),
            function () {
            })
    },
    button(){
        return (
            <RightTopButton func={this.logout} content="退出登录" color="#ff5b58"
                            source={require('../../image/user/exit.png')}/>
        )
    },
    toOther(nav){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                comp: nav,
                param: {location: this.state.location},
            });
        }
    },

    returnImg(){
        var url = require('../../image/user/head.png');
        if (!_.isEmpty(this.state.photoStoreId)) {
            url = {uri: UserAction.getFile(this.state.photoStoreId)}
        }
        return url;
    },

    selectPhoto(){
        if (Platform.OS === 'ios') {
            this.select('用户头像', 'photoStoreId')
        } else {
            this.selectAndroid('用户头像', 'photoStoreId')
        }
    },
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="个人信息" actionButton={this.button()}>
                <ScrollView automaticallyAdjustContentInsets={false} horizontal={false}>
                    <View style={styles.head}>
                        <TouchableHighlight onPress={this.selectPhoto}
                                            activeOpacity={0.6} underlayColor="#ebf1f2">
                            <Image style={styles.img} resizeMode="cover" source={this.returnImg()}/>
                        </TouchableHighlight>
                        <Text style={styles.name}>{this.state.userName}</Text>
                    </View>
                    <View style={{backgroundColor:'white'}}>

                        <Item desc="姓名:" imgPath={require('../../image/user/realName.png')} value={this.state.realName}
                              func={() => this.toEdit("姓名", 'realName', this.state.realName, 'name', 20, Validation.realName)}/>

                        <Item func={()=>this.toOther(EditPhone)}
                              desc="手机号:" imgPath={require('../../image/user/mobileNo.png')}
                              value={phoneNumber(this.state.mobileNo)}/>

                        <Item desc="座机号:" imgPath={require('../../image/user/telephoneNo.png')}
                              value={this.state.telephoneNo}
                              func={() => this.toEdit("座机号", 'telephoneNo', this.state.telephoneNo, 'telephone', 13, Validation.isTelephone)}/>

                        <Item desc="QQ:" imgPath={require('../../image/user/qqNo.png')} value={this.state.qqNo}
                              func={() => this.toEdit("QQ", 'qqNo', this.state.qqNo, 'number', 20, Validation.isQQ)}/>

                        <Item desc="微信:" imgPath={require('../../image/user/wechatNo.png')}
                              value={this.state.wechatNo}
                              func={() => this.toEdit("微信", 'wechatNo', this.state.wechatNo, '', 40, '')}/>

                        <Item desc="电子邮箱:" imgPath={require('../../image/user/email.png')}
                              value={this.state.email}
                              func={() => this.toEdit("电子邮箱", 'email', this.state.email, '', 60, Validation.isEmail)}/>

                        <Space top={false}/>

                        <Item desc="公司:" imgPath={require('../../image/user/comp.png')} value={this.state.comp}
                              func={()=>this.toOther(EditComp)}/>

                        <Item desc="职务:" imgPath={require('../../image/user/jobTitle.png')}
                              value={this.state.jobTitle}
                              func={() => this.toEdit("职务", 'jobTitle', this.state.jobTitle, 'name', 20, '')}/>

                        <Item desc="所在地:" imgPath={require('../../image/user/location.png')} value={this.state.location}
                              func={()=>this.toOther(Position)}/>

                    </View>
                </ScrollView>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
    img: {
        width: 63,
        height: 63,
        borderRadius: 5,
        marginTop: 18,
        borderColor: '#7f7f7f',
        borderWidth: 1
    },
    head: {
        height: 122,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        borderColor: '#cccccc',
        borderBottomWidth: 1
    },
    name: {
        fontSize: 15,
        color: '#333333',
        marginTop: 8
    }
})
module.exports = UserInfo;