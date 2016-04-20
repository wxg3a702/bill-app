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
  Platform,
  ActionSheetIOS
  } = React;
var ListBottom = require('../../comp/utilsUi/listBottom');
var Adjust = require('../../comp/utils/adjust');
var UserAction = require('../../framework/action/userAction');
var CompAccountInfo = require('./compAccountInfo');
var BottomButton = require('../../comp/utilsUi/bottomButton');
var AppStore = require('../../framework/store/appStore');
var CompStore = require('../../framework/store/compStore');
var CompAction = require("../../framework/action/compAction");
var NavBarView = require('../../framework/system/navBarView');
var certificateState = require('../../constants/certificateState');
var NumberHelper = require('../../comp/utils/numberHelper');
var CustomImage = require('../../comp/utilsUi/CustomImage');
var Alert = require('../../comp/utils/alert');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var PhotoPic = require('NativeModules').UserPhotoPicModule;
var Communications = require('../personalCenter/communication');
var _ = require('lodash');
var CallModule = require('NativeModules').CallModule;
var CompCertifyCopies = React.createClass({
  getStateFromStores(){
    var newOrg = !this.props.param.item ? CompStore.getNewOrg() : this.props.param.item;
    let title;
    if (this.props.param.item) {
      if (newOrg.status == 'CERTIFIED') {
        title = newOrg.stdOrgBean.orgName;
      } else {
        title = newOrg.orgName;
      }
    } else {
      title = '1.认证资料副本';
    }
    return {
      licenseCopyFileId: newOrg.licenseCopyFileId,
      authFileId: newOrg.authFileId,
      corpIdentityFileId: newOrg.corpIdentityFileId,
      authIdentityFileId: newOrg.authIdentityFileId,
      picEnough: newOrg.picEnough,
      accountName: newOrg.accountName,
      accountNo: newOrg.accountNo,
      openBank: newOrg.openBank,
      data: !this.props.param.item ? {status: 'UNAUDITING'} : this.props.param.item,
      status: newOrg.status,
      newOrg: newOrg,
      phone: '021-35885888-2627',
      licenseCopyFileIdClick: false,
      corpIdentityFileIdClick: false,
      authFileIdClick: false,
      authIdentityFileIdClick: false,
      checked: !(newOrg.licenseCopyFileId && (newOrg.corpIdentityFileId || (newOrg.authFileId && newOrg.authIdentityFileId))),
      title: title,
      firstIsUpload: newOrg.licenseCopyFileId ? true : false,
      secondIsUpload: newOrg.corpIdentityFileId ? true : false,
      thirdIsUpload: newOrg.authFileId ? true : false,
      FourthIsUpload: newOrg.authIdentityFileId ? true : false
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
    const {navigator} = this.props;
    if (this.props.param.item || !this.state.checked) {
      const {navigator} = this.props;
      if (navigator) {
        navigator.push({
          comp: CompAccountInfo,
          param: {
            item: this.props.param.item,
            isFirst: this.props.param.isFirst
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
  callPhone: function () {
    let phone = this.state.phone;
    if (Platform.OS === 'ios') {
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
    } else {
      Alert("拨打电话", () => {
        CallModule.call(phone)
      }, () => {
      })
    }
  },

  selectPhoto(desc, name){
    if (Platform.OS === 'ios') {
      this.selectIOS(desc, name)
    } else {
      this.selectAndroid(desc, name)
    }
  },

  updateState (name) {
    if (name == 'licenseCopyFileId' && this.state.checked) {
      this.setState({firstIsUpload: true});
      if (this.state.secondIsUpload) {
        this.setState({checked: false});
      } else if (this.state.thirdIsUpload && this.state.FourthIsUpload) {
        this.setState({checked: false});
      }
      return;
    }
    if (name == 'corpIdentityFileId' && this.state.checked) {
      this.setState({secondIsUpload: true});
      if (this.state.firstIsUpload) {
        this.setState({checked: false});
      }
      return;
    }
    if (name == 'authFileId' && this.state.checked) {
      this.setState({thirdIsUpload: true});
      if (this.state.firstIsUpload && this.state.FourthIsUpload) {
        this.setState({checked: false});
      }
      return;
    }
    if (name == 'authIdentityFileId' && this.state.checked) {
      this.setState({FourthIsUpload: true});
      if (this.state.firstIsUpload && this.state.thirdIsUpload) {
        this.setState({checked: false});
      }
      return;
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
          this.updateState(name);
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
        this.updateState(name);
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
  _errorView(){
    return (
      <View style={[styles.radius,{height: 117,
        width: Dimensions.get("window").width / 2 - 18,
        marginTop: 5,justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'}]}>
        <Text style={{fontSize:11,color:'#000000'}}>重新加载</Text>
      </View>
    );
  },
  _errorPress (name) {
    this.setState({
      [name]: this.state[name]
    });
  },

  returnItem(desc, name){
    let data = this.state.data;
    let url;
    if (!_.isEmpty(this.state[name])) {
      if (this.state[name].indexOf("_userId") > -1) {
        url = {uri: UserAction.getFile(this.state[name])}
      } else {
        url = {uri: this.state[name]};
      }
      if (data.status == 'AUDITING') {
        return (
          <CustomImage
            desc={name}
            //errorPress={this._errorPress}
            //errorView={this._errorView}
            imageStyle={styles.image}
            centerText='等待认证'
            source={url.uri}
          />

        )
      } else {
        let certResultBeans = this.state.newOrg.certResultBeans;
        if (!certResultBeans) {
          return (
            <TouchableHighlight
              onPress={()=>{this.selectPhoto(desc, name)}} underlayColor="#ebf1f2">
              <Image style={[styles.image,styles.radius]} resizeMode="cover" source={url}/>
            </TouchableHighlight>
          )
        } else {
          var isError = false;
          var bean;
          for (let item of certResultBeans) {
            console.log(item);
            if (item.columnName == name) {
              isError = true;
              bean = item
              //return (
              //  <CustomImage
              //    ref="reloadImage"
              //    imageStyle={styles.image}
              //    onPress={()=>{this.selectPhoto(desc, name)}}
              //    source={url.uri}
              //    centerText={item.resultValue}
              //  />
              //);
            }
          }
          if (!isError) {
            return (
              <CustomImage
                imageStyle={styles.addImage}
                onPress={()=>{this.selectPhoto(desc, name)}}
                centerText=' '
                source={url.uri}
              />
            )
          } else {
            return (
              <CustomImage
                imageStyle={styles.addImage}
                onPress={()=>{this.selectPhoto(desc, name)}}
                centerText={bean.resultValue}
                source={url.uri}
              />
            )
          }
        }
      }
    } else {
      if (data.status == 'AUDITING') {
        return (
          <View style={[styles.image]}>
              <Text style={{fontSize:11,color:'white'}}>未上传副本文件</Text>
          </View>
        )
      } else {
        return (
          <TouchableHighlight onPress={()=>{this.selectPhoto(desc, name)}} activeOpacity={0.6}
                              underlayColor="#ebf1f2"
                              onShowUnderlay={()=>{this.setState({[name+'Click']:true})}}
                              onHideUnderlay={()=>{this.setState({[name+'Click']:false})}}>
            <View style={styles.addImage}>
              <Image style={{width:44,height:44,borderRadius:22}} resizeMode="cover"
                     source={this.state[name+'Click']?certificateState[name].urlClick:certificateState[name].url}/>
              <Text style={{fontSize:11,color:'#cccccc',marginTop:14}}>点击添加</Text>
            </View>
          </TouchableHighlight>
        )
      }
    }
    /*<TouchableHighlight onPress={()=>{this.selectPhoto(desc, name)}} activeOpacity={0.6}
     underlayColor="#ebf1f2"
     onShowUnderlay={()=>{this.setState({[name+'Click']:true})}}
     onHideUnderlay={()=>{this.setState({[name+'Click']:false})}}>
     <View style={[styles.image,styles.radius,{alignItems:'center'}]}>
     <Image style={{width:44,height:44,borderRadius:22,marginTop:24}} resizeMode="cover"
     source={this.state[name+'Click']?certificateState[name].urlClick:certificateState[name].url}/>
     <Text style={{fontSize:11,color:'#cccccc',marginTop:14}}>点击添加</Text>
     </View>
     </TouchableHighlight>*/
  },
  returnAccount(){
    let data = this.state.data;
    if (data.status == 'CERTIFIED' || data.status == 'AUDITING')
      return (
        <View>
          <Text style={{paddingTop:32,height:55,fontSize:15}}>关联账户信息</Text>
          <View
            style={{flexDirection:'row',height:95,paddingLeft:Adjust.width(20),backgroundColor:'white',borderRadius:5,alignItems:'center',borderWidth:1,borderColor:'#c8c8c8'}}>
            <Image style={{width:30,height:30,borderRadius:15}}
                   source={require('../../image/company/bank.png')}/>
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
  returnWorkNo(){
    let data = this.state.data;
    if (data.status == 'AUDITING') {
      return (
        <View style={{flexDirection:'row', borderTopWidth:1, borderBottomWidth: 1,
               borderColor: '#c8c7cc', padding: 16, marginTop: 20, backgroundColor: 'white'}}>
          <Text style={{fontSize:14}}>事务号：</Text>
          <Text style={{color: '#808080'}}>{data.serialNo}</Text>
        </View>
      )
    }
  },
  getWorkNo(date){
    var date = new Date(date);
    return 'RZ ' + date.getFullYear() + ' ' + ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) +
      (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) + ' ' + (date.getHours() > 9 ? date.getHours() : '0' +
      date.getHours()) + (date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes());
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
            如遇问题，请
          </Text>
          <TouchableHighlight onPress={()=>{this.callPhone()}}
                              activeOpacity={0.6} underlayColor="#ebf1f2">
            <Text
              style={{color: certificateState[status].colorA,fontSize: 15, textDecorationLine:"underline"}}>
              联系客服
            </Text>
          </TouchableHighlight>
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
            <View style={{flex:1}}>
              <Text style={styles.copyName}>营业执照副本</Text>
              {this.returnItem('营业执照副本', 'licenseCopyFileId')}
            </View>
            <View style={{flex:1,marginLeft:12}}>
              <Text style={styles.copyName}>法定代表人身份证</Text>
              {this.returnItem('法定代表人身份证', 'corpIdentityFileId')}
            </View>
          </View>
          <View style={{flexDirection:"row",marginTop:32}}>
            <View style={{flex:1}}>
              <Text style={[styles.copyName,{height:50,lineHeight:23}]}>法人授权委托证明书(需盖公章)</Text>
              {this.returnItem('法人授权委托证明书', 'authFileId')}
            </View>
            <View style={{flex:1,marginLeft:12}}>
              <Text style={[styles.copyName,{height:50,lineHeight:23}]}>授权经办人身份证</Text>
              {this.returnItem('授权经办人身份证', 'authIdentityFileId')}
            </View>
          </View>
        </View>
      )
    } else {
      return (
        <View>
          <Text style={{fontSize:15,color:"#333333"}}>营业执照信息</Text>
          <View style={styles.licenseInfo}>
            <View style={[styles.licenseItem,styles.borderBottom]}>
              <Text style={{fontSize:18,color:"#333333"}}>注册号</Text>
              <Text
                style={{fontSize:15,color:"#7F7F7F",width:Adjust.width(192),textAlign:"right"}}>
                {this.state.data.stdOrgBean.bizLicenseRegNo}
              </Text>
            </View>
            <View style={[styles.licenseItem,styles.borderBottom]}>
              <Text style={{fontSize:18,color:"#333333"}}>名称</Text>
              <Text
                style={{fontSize:15,color:"#7F7F7F",width:Adjust.width(192),textAlign:"right"}}>
                {this.state.data.stdOrgBean.orgName}
              </Text>
            </View>
            <View style={styles.licenseItem}>
              <Text style={{fontSize:18,color:"#333333"}}>法定代表人</Text>
              <Text
                style={{fontSize:15,color:"#7F7F7F",width:Adjust.width(192),textAlign:"right"}}>{this.state.data.stdOrgBean.legalPersonName}</Text>
            </View>
          </View>
        </View>
      )
    }
  },

  backPress(){
    Alert("退出后将不保存已添加的信息,确定退出吗?",
      ()=> {
        CompAction.clearNewOrg(
          ()=> {
            this.props.navigator.pop();
          }
        )
      },
      function () {
      });
  },

  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} title={this.state.title}
                  backPress={this.props.param.item || (!this.state.firstIsUpload && !this.state.secondIsUpload
                  && !this.state.thirdIsUpload && !this.state.FourthIsUpload) ? null : this.backPress}>
        <ScrollView>
          {this.returnWorkNo()}
          <View style={{flex:1,marginTop:32,marginHorizontal:Adjust.width(12)}}>
            {this.returnImg()}
            {this.returnAccount()}
            {this.returnWarn()}
            <ListBottom/>
          </View>
        </ScrollView>
        <BottomButton checked={this.state.checked} func={this[certificateState[this.state.data.status].button]}
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
    marginTop: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#C8C8C8",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    opacity: 0.8
  },
  addImage: {
    height: 113,
    width: Dimensions.get("window").width / 2 - 18,
    marginTop: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#C8C8C8",
    justifyContent: 'center',
    alignItems: 'center'
  },
  copyName: {
    alignItems: "center",
    fontSize: 15,
    color: "#333333",
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
  licenseItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    marginHorizontal: 12
  },
  licenseInfo: {
    height: 150,
    marginTop: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#C8C8C8",
    backgroundColor: 'white'
  }
});
module.exports = CompCertifyCopies;