'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  ScrollView
  } = React;

var _ = require('lodash');
var DisConfirm = require('../bill/disConfirm');
var cssVar = require('cssVar');
var VIcon = require('../../comp/icon/vIcon')
var BillAction = require("../../framework/action/billAction");
var JumpLoading = require('../../comp/utils/jumpLoading');
var NavBarView = require('../../framework/system/navBarView');
var dismissKeyboard = require('react-native-dismiss-keyboard');
var Detail = require('../bill/billDetail');
var numeral = require('numeral');
var dateFormat = require('dateformat');
var Alert = require('../../comp/utils/alert');
var styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff'
  },
  lefttext: {},
  rowF: {
    paddingLeft: 10,
    marginTop: 90,
    flexDirection: 'row'
  },
  flexOne: {
    flex: 1
  },
  widthOneH: {
    width: 100
  },
  rowS: {
    paddingLeft: 10,
    flexDirection: 'row',
    marginTop: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 5,
    justifyContent: 'center',
    width: 350,
    marginLeft: 10
  },
  leftContainerButton: {
    width: 90,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5
  },
  leftContainerButtonText: {
    color: '#ffffff',
    textAlign: 'center'
  },
  rightContainerButton: {
    width: 210,
    marginLeft: 5,
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5
  },
  rightContainerButtonText: {
    color: '#ffffff',
    textAlign: 'center'
  }
});

var containerHolder;

var BillDetailByMsg = React.createClass({

  dataDiff: function (sDate1, sDate2) {
    var startTime = new Date(Date.parse(sDate1.replace(/-/g, "/"))).getTime();
    var endTime = new Date(Date.parse(sDate2.replace(/-/g, "/"))).getTime();
    var days = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
    return days;
  },

  //贴现金额=票面金额*[1-贴现利率*（到期日-贴现日期）/30]
  calDis: function (amount, discountRate, dueDate) {
    var days = this.dataDiff(dateFormat(new Date(this.state.dueDate), 'yyyy-mm-dd'), dateFormat(_.now(), 'yyyy-mm-dd'));
    return amount * (1 - discountRate * days / 30);

  },

  getInitialState: function () {
    return {
      loaded: false,
    };
  },


  renderBillDisInfo(){
    if (this.state.role == "payee" && this.state.status == "IGN") {
      return (
        <View></View>
      );
    } else {
      return (
        <View style={{flexDirection: 'column',borderStyle:'solid',backgroundColor:'#ffffff',marginTop:10}}>
          <View
            style={{borderBottomColor:'#f6f6f6',borderBottomWidth:2,margin:20,flexDirection: 'row',justifyContent: 'center',flex:1}}>
            <Text style={{paddingBottom:10,fontSize:17,flex:4,color:'#4e4e4e'}}>{'贴 现 行：' }</Text>
            <Text
              style={{paddingBottom:10,fontSize:17,flex:6,color:'#7f7f7f'}}>{this.state.discountBankName}</Text>
          </View>
          <View
            style={{borderBottomColor:'#f6f6f6',borderBottomWidth:2,marginLeft:20,marginRight:20,marginTop:-10,flexDirection: 'row',justifyContent: 'center',flex:1}}>
            <Text style={{paddingBottom:5,fontSize:17,flex:4,color:'#4e4e4e'}}>{'贴现利率：' }</Text>
            <Text
              style={{paddingBottom:5,fontSize:17,flex:6,color:'#7f7f7f'}}>{numeral(this.state.discountRate * 1000).format("0,0.00") + "‰"}</Text>
          </View>
          <View
            style={{marginLeft:20,marginRight:20,marginTop:10,flexDirection: 'row',justifyContent: 'center',flex:1}}>
            <Text style={{paddingBottom:5,fontSize:17,flex:4,color:'#4e4e4e'}}>{'收款账号：' }</Text>
            <Text
              style={{paddingBottom:5,fontSize:17,flex:6,color:'#7f7f7f'}}>{this.state.payeeBankAccountNo}</Text>
          </View>

        </View>
      )
    }
  },

  renderBillInfo(){
    return (
      <TouchableHighlight
        underlayColor='#cdcdcd'
        onPress={()=>this.toDetail(this.props.param.record)}>
        <View style={{flexDirection: 'column',borderStyle:'solid',backgroundColor:'#ffffff'}}>
          <View
            style={{marginLeft:20,marginRight:20,marginBottom:20,marginTop:10,flexDirection: 'row',justifyContent: 'center',flex:1}}>
            <Text style={{paddingBottom:5,fontSize:17,flex:4,color:'#4e4e4e'}}>{'票面金额：'}</Text>
            <Text
              style={{paddingBottom:5,fontSize:17,flex:6,color:'#7f7f7f'}}>{numeral(this.state.amount / 10000).format("0,0.00") + "万元"}</Text>
          </View>
          <View
            style={{marginLeft:20,marginRight:20,marginTop:-10,flexDirection: 'row',justifyContent: 'center',flex:1}}>
            <Text style={{paddingBottom:5,fontSize:17,flex:4,color:'#4e4e4e'}}>{'开票日期：'}</Text>
            <Text
              style={{paddingBottom:5,fontSize:17,flex:6,color:'#7f7f7f'}}>{dateFormat(new Date(this.state.estimatedIssueDate), 'yyyy年mm月dd日')}</Text>
          </View>
          <View
            style={{marginLeft:20,marginRight:20,marginTop:10,flexDirection: 'row',justifyContent: 'center',flex:1}}>
            <Text style={{paddingBottom:5,fontSize:17,flex:4, color:'#4e4e4e'}}>{'开  票  人：'}</Text>
            <Text style={{paddingBottom:5,fontSize:17,flex:6, color:'#7f7f7f'}}>{this.state.drawerName}</Text>
          </View>
          {this.discountInfo}
          <View
            style={{marginLeft:20,marginRight:20,marginTop:10,borderTopColor:'#f6f6f6',borderTopWidth:1,height:40,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
            <Text style={{fontSize:14,color:'#ccc'}}>去处理</Text>
            <VIcon
              direction='right'
              size={20}
              color='#7f7f7f'
              style={{width:20,height:20}}
            />
          </View>
        </View>
      </TouchableHighlight>
    )
  },
  toDetail(bill){
    this.props.navigator.push({
      param: {title: '详情', record: bill},
      comp: Detail
    });
  },

  discountInfo() {
    if (this.state.status == "IGN" || this.state.status == "NEW") {
      return (
        <View>
        </View>
      );
    } else {
      return (
        <View>
          <View
            style={{marginLeft:20,marginRight:20,marginTop:10,flexDirection: 'row',justifyContent: 'center',flex:1}}>
            <Text style={{paddingBottom:5,fontSize:17,flex:4,color:'#4e4e4e'}}>{'贴现银行：'}</Text>
            <Text
              style={{paddingBottom:5,fontSize:17,flex:6,color:'#7f7f7f'}}>{this.state.acceptBankName }</Text>
          </View>

          <View
            style={{marginLeft:20,marginRight:20,marginTop:10,flexDirection: 'row',justifyContent: 'center',flex:1}}>
            <Text style={{paddingBottom:5,fontSize:17,flex:4,color:'#4e4e4e'}}>{'贴现利率：'}</Text>
            <Text style={{paddingBottom:5,fontSize:17,flex:6,color:'#7f7f7f'}}>{this.state.payeeName}</Text>
          </View>
        </View>
      );
    }
  },

  ignAction: function () {
    //不贴现
    dismissKeyboard();
    BillAction.giveUpBillDiscount(
      {
        billId: this.state.billId
      },
      function () {
        Alert("操作成功!", ()=>this.goBack());
      }.bind(this)
    )

  },

  reqAction: function () {
    //撤销
    dismissKeyboard();
    BillAction.cancleBillDiscount(
      {
        billId: this.state.billId
      },
      function () {
        Alert("撤销成功!", ()=>this.goBack());
      }.bind(this)
    )
  },

  disAction: function () {
    Alert("你确定要贴现?", () => this.confirmDis({
        billId: this.state.billId,
        discountRate: this.state.discountRate,
        discountAmount: this.state.discountAmount,
        discountBankName: this.state.discountBankName,
        payeeBankAccountNo: this.state.payeeBankAccountNo
      }), {text: '取消', onPress: null}
    );

  },

  confirmDis: function (item:Object) {

    this.props.navigator.push({
      param: {title: '详情', billBean: item},
      comp: DisConfirm
    });


  },

  renderAction(){
    if (this.state.role == "payee") {
      switch (this.state.status) {
        case "NEW":
          return (
            <View
              style={{padding:20,flexDirection: 'row',justifyContent:'center',borderStyle:'solid',backgroundColor:'transparent'}}>

              <View
                style={{ flex:4,height:35,borderRadius:5,backgroundColor: '#ffffff',paddingLeft:10,paddingRight:10,borderWidth:1,borderColor:'#ff5b58'}}>
                <TouchableHighlight activeOpacity={0.8} underlayColor='#ffffff'
                                    onPress={() => Alert("确认不在平台内将此票据贴现吗？此操作将不可逆。",()=>this.ignAction(),function(){})}
                                    style={{flex:1}}>
                  <Text style={{paddingTop: 10,color:'#ff5b58',textAlign:'center'}}>{'不贴现'}</Text>
                </TouchableHighlight>
              </View>

              <View style={{flex:1}}>
              </View>

              <View
                style={{flex:12,height:35,borderRadius:5,backgroundColor: '#44bcb2',paddingLeft:10,paddingRight:10}}>
                <TouchableHighlight activeOpacity={0.8} underlayColor='#44bcbc'
                                    onPress={() => this.disAction()} style={{flex:1}}>
                  <Text style={{paddingTop: 10,color:'#ffffff',textAlign:'center'}}>{'我要贴现'}</Text>
                </TouchableHighlight>
              </View>


            </View>);
          break;
        case "REQ":
          return (
            <View
              style={{padding:20,flexDirection: 'row',justifyContent:'center',borderStyle:'solid',backgroundColor:'transparent'}}>

              <View
                style={{flex:1,height:35,borderRadius:5,backgroundColor: '#ffffff',paddingLeft:10,paddingRight:10,borderWidth:1,borderColor:'#ff5b58'}}>
                <TouchableHighlight activeOpacity={0.8} underlayColor='#ffffff'
                                    onPress={() => Alert("确认撤销贴现申请吗？",()=>this.reqAction(),function(){})}
                                    style={{flex:1}}>
                  <Text style={{paddingTop: 10,color:'#ff5b58',textAlign:'center'}}>{'撤销申请'}</Text>
                </TouchableHighlight>
              </View>

            </View>);
          break;
        case "HAN":
        case "DIS":
        case "IGN":
          return (
            <View
              style={{padding:20,flexDirection: 'row',justifyContent:'center',borderStyle:'solid',backgroundColor:'transparent'}}>

              <View
                style={{ flex:1,height:35,borderRadius:5,backgroundColor: '#44bcb2',paddingLeft:10,paddingRight:10}}>
                <TouchableHighlight activeOpacity={0.8} underlayColor='#44bcbc'
                                    onPress={() => this.goBack()}
                                    style={{flex:1}}>
                  <Text style={{paddingTop: 10,color:'#ffffff',textAlign:'center'}}>{'返回'}</Text>
                </TouchableHighlight>
              </View>


            </View>);
          break;
      }
    } else {
      return (
        <View
          style={{padding:20,flexDirection: 'row',justifyContent:'center',borderStyle:'solid',backgroundColor:'transparent'}}>

          <View
            style={{ flex:1,height:35,borderRadius:5,backgroundColor: '#44bcb2',paddingLeft:10,paddingRight:10}}>
            <TouchableHighlight activeOpacity={0.8} underlayColor='#44bcbc' onPress={() => this.goBack()}
                                style={{flex:1}}>
              <Text style={{paddingTop: 10,color:'#ffffff',textAlign:'center'}}>{'返回'}</Text>
            </TouchableHighlight>
          </View>
        </View>);

    }

  },

  onAction(){
    console.log("aa")
    containerHolder.showLoading()
  },

  renderPayeeDetail: function () {
    return (
      <View style={{backgroundColor: '#f0f0f0',flex:1,justifyContent:"flex-start"}}>
        <ScrollView>
          {this.renderBillInfo()}
        </ScrollView>
      </View>

    );
  },

  goBack: function () {
    this.props.navigator.pop();
    //this.props.callback(); //更新
  },
  render: function () {
    if (!this.state.loaded) {
      return (<JumpLoading />);
    }

    var record = this.props.param.record;
    var content = this.renderPayeeDetail();
    return (
      <NavBarView navigator={this.props.navigator} ref={c=>{if(c)containerHolder=c.getContainerHandle()}}
                  title={'票号:'+record.billNo}>
        {content}
      </NavBarView>
    );

  },

  componentDidMount: function () {
    var responseData = this.props.param.record;

    this.setState({loaded: true});
    this.setState(responseData);
  }

});


module.exports = BillDetailByMsg;
