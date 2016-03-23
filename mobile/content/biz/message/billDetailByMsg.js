'use strict';

var React = require('react-native');
var {
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  ListView,
  ScrollView
  } = React;
var Circle = require('../../comp/utilsUi/circle')
var _ = require('lodash');
var cssVar = require('cssVar');
var VIcon = require('../../comp/icon/vIcon')
var JumpLoading = require('../../comp/utils/jumpLoading');
var NavBarView = require('../../framework/system/navBarView');
var Detail = require('../bill/billDetail');
var numeral = require('numeral');
var dateFormat = require('dateformat');
var mock = [
  {
    content: '2015年02月10日贴现',
    date: '15.12.12',
    isNow: true
  }, {
    content: '银行批准贴现,请等待银行汇款',
    date: '15.12.12'
  }, {
    content: '申请贴现,请等待银行受理',
    date: '15.12.12'
  }, {
    content: '创建票据信息',
    date: '15.12.12'
  }
]
var ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});
var styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff'
  },
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
      dataSource: mock
    };
  },

  renderBillInfo(){
    return (
      <TouchableHighlight
        underlayColor='#cdcdcd'
        style={{borderBottomColor:'#f6f6f6',borderBottomWidth:1,}}
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

  returnFlow(){
      return (
        <View style={{backgroundColor:'white',paddingVertical:8,paddingHorizontal:12,borderTopColor:'#f6f6f6',borderTopWidth:1,marginTop: 10}}>
          <View style={{borderBottomColor:'#f0f0f0',borderBottomWidth:1,paddingBottom:12}}>
            <Text>票据状态追踪</Text>
          </View>
          <View style={{height:12}}/>
          <ListView dataSource={ds.cloneWithRows(this.state.dataSource)} renderRow={this.renderRow}/>
        </View>
      )
  },
  renderRow(data){
    return (
      <Circle now={!data.isNow?false:true} content={data.content} date={data.date}/>
    )
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
          {this.returnFlow()}
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
