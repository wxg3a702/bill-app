'use strict';

var React = require('react-native');
var {
  StyleSheet,
  View,
  ActionSheetIOS,
  Text,
  TouchableHighlight,
  Image
  } = React;
var AppStore = require('../../framework/store/appStore');
var CompStore = require('../../framework/store/compStore');
var CompAction = require("../../framework/action/compAction");
var CommonAction = require("../../framework/action/commonAction");
var NavBarView = require('../../framework/system/navBarView');
var certificateState = require('../../constants/certificateState');
var CertifySuccess = require('./certifySuccess');
var Input = require('../../comp/utilsUi/input');
var Alert = require('../../comp/utils/alert');
var Button = require('../../comp/utilsUi/button');
var Communications = require('../personalCenter/communication');
var CompAccountInfo = React.createClass({
  getStateFromStores(){
    let check
    var newOrg = !this.props.param.item ? CompStore.getNewOrg() : this.props.param.item
    if (!newOrg.accountName || !newOrg.accountNo || !newOrg.openBank) {
      check = true
    } else {
      check = false
    }
    return {
      newOrg: newOrg,
      accountName: newOrg.accountName,
      accountNo: newOrg.accountNo,
      openBank: newOrg.openBank,
      checked: check,
    }
  },

  getInitialState: function () {
    return this.getStateFromStores();
  },

  //componentDidMount() {
  //  AppStore.addChangeListener(this._onChange);
  //},
  //
  //componentWillUnmount: function () {
  //  AppStore.removeChangeListener(this._onChange);
  //},
  //
  //_onChange: function () {
  //  this.setState(this.getStateFromStores());
  //},

  callPhone: function () {
    let phone = this.state.phone;
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

  },
  submit: function () {
    let newOrg = this.state.newOrg;
    newOrg.accountName = this.state.accountName;
    newOrg.accountNo = this.state.accountNo;
    newOrg.openBank = this.state.openBank;
    if (!this.props.param.item) {
      newOrg.status = 'UNAUDITING';
    }
    var reg = new RegExp("^[0-9]{1,50}$");
    var reg1 = /^[a-zA-Z0-9_\u4e00-\u9fa5]{1,50}$/g;
    this.setState({newOrg: newOrg});
    if (!reg1.test(newOrg.accountName)) {
      Alert("请输入正确的账户名称")
      return;
    }
    var reg2 = /^[a-zA-Z0-9_\u4e00-\u9fa5]{1,50}$/g;
    if (!reg1.test(newOrg.openBank)) {
      Alert("请输入正确的开户行")
      return;
    }
    if (reg.test(newOrg.accountNo)) {
      if (!this.props.param) {
        CompAction.deleteOrg(
          {orgId: this.props.param.item.id}
        )
      }
      CompAction.submitOrg(
        this.state.newOrg,
        ()=> {
          //this.props.navigator.push({comp: CertifySuccess})
          Alert("资料提交成功，请耐心等待认证结果", () => {
            var routes = this.props.navigator.getCurrentRoutes();
            if(this.props.param.isFirst){
              this.props.navigator.resetTo({comp: 'tabView',tabName:'personCenter'});
            }else{
              this.props.navigator.popToRoute(routes[routes.length - 4]);
            }

          })
        },
        ()=>Alert("认证失败")
      )
    } else {
      Alert("请输入正确的银行账号")
    }

  },
  textOnchange: function (text, type) {
    this.setState({[type]: text})
    if (_.isEmpty(this.state.accountName) || _.isEmpty(this.state.accountNo) || _.isEmpty(this.state.openBank)) {
      this.setState({checked: true})
    } else {
      this.setState({checked: false})
    }
  },

  handleChanged(key, value){
    this.textOnchange(value, key);
  },
  returnInfo(){
    let orgBean = this.state.newOrg.certResultBeans
    if (!orgBean) {
    } else {
      for (let item of orgBean) {
        if (item.columnName == 'bankAccountNo') {
          return (
            <Text style={{fontSize: 15, color: '#ff5b58',marginBottom:5}}>
              未通过，{item.resultValue}，请修改
            </Text>
          )
        }
      }
      /*if (orgBean.bankAccountNo) {
       return (
       <Text style={{fontSize: 15, color: '#ff5b58',marginBottom:5}}>
       未通过，{orgBean.bankAccountNo.resultValue},请修改
       </Text>
       )
       }*/
    }
  },
  render: function () {
    return (
      <NavBarView navigator={this.props.navigator} title="2.关联账户信息">
        <View style={{flex:1,marginHorizontal:10}}>
          <Input type='name' prompt="账户名称" max={50} field="accountName" isPwd={false}
                 defaultValue={this.state.accountName}
                 onChanged={this.handleChanged} icon="user"/>
          <Input type='default' prompt="账号" max={50} field="accountNo" isPwd={false}
                 defaultValue={this.state.accountNo}
                 onChanged={this.handleChanged} icon="user"
                 isPhone={true}/>
          <Input type='name' prompt="开户行" max={50} field="openBank" isPwd={false}
                 defaultValue={this.state.openBank}
                 onChanged={this.handleChanged} icon="user"/>
          <View style={{marginTop:18}}>
            {this.returnInfo()}
            <View style={{flexDirection:"row"}}>
              <Text style={{fontSize:15,color:'#ff5b58'}}>
                如遇问题，请
              </Text>
              <TouchableHighlight onPress={()=>{this.callPhone()}} activeOpacity={0.6}
                                  underlayColor="#ebf1f2">
                <Text style={{color:'#ff5b58',fontSize:15,textDecorationLine:"underline"}}>
                  联系客服
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
        <View style={{margin:10}}>

          <Button func={this.submit} content="提交" checked={this.state.checked}/>
        </View>
      </NavBarView>
    )
  }
})
var styles = StyleSheet.create({
  bottom: {
    padding: 7, backgroundColor: '#f7f7f7', borderTopWidth: 1, borderTopColor: '#cccccc', opacity: 0.9
  },
  borderBottom: {
    borderBottomWidth: 1, borderColor: '#c8c7cc'
  },
  radius: {
    borderRadius: 6
  },
  button: {
    backgroundColor: '#44bcbc',
    height: 47,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  img: {
    width: 63,
    height: 63,
    borderRadius: 5,
    marginTop: 18,
    borderColor: '#7f7f7f',
    borderWidth: 1
  }
})
module.exports = CompAccountInfo;