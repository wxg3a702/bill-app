'use strict';

var React = require('react-native');
var {
  ListView,
  TouchableHighlight,
  Text,
  View,
  Image,
  StyleSheet,
  Platform,
  InteractionManager,
  Dimensions
  } = React;
var Adjust = require('../../comp/utils/adjust')
var ListBottom = require('../../comp/utilsUi/listBottom')
var _ = require('lodash');
var Login = require('../login/login')
var AppStore = require('../../framework/store/appStore');
var MessageStore = require('../../framework/store/messageStore');
var MessageAction = require('../../framework/action/messageAction');
var NavBarView = require('../../framework/system/navBarView')
var VIcon = require('../../comp/icon/vIcon')
var ToLogin = require('../../comp/utilsUi/toLogin');
var MessageDetail = require('./messageDetail')
var Detail = require('../billNew/billDetail');
var BillDetailByMsg = require('./billDetailByMsg');
var MsgCategory = require('../../constants/notification').MsgCategory;
var DateHelper = require("../../comp/utils/dateHelper");
var Alert = require('../../comp/utils/alert');
var GiftedListView = require('../../comp/listView/GiftedListView');
var ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});
var count = 0;
const PAGE_SIZE = 10;
var Message = React.createClass({
  getStateFromStores() {
    var token = AppStore.getToken();
    var messageBean = MessageStore.getMsgData();
    return {
      dataSource: messageBean,
      data: messageBean,
      token: token
    }
  },
  componentDidMount() {
    AppStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange);
  },
  _onChange: function () {
    this.setState(this.getStateFromStores());

    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        if (this.refs['MsgList']) {
          this.refs['MsgList']._refreshWithoutSpinner();
        }
      })
    }, 1000);

  },
  getInitialState: function () {
    return this.getStateFromStores();
  },
  detail(name){
    MessageStore.updateUnReadNum(name);
    var title
    if (name == MsgCategory.BILL_SENT) {
      title = '开出的票'
    } else if (name == MsgCategory.MARKET_NEWS) {
      title = '市场动态'
    } else {
      title = '系统消息'
    }
    const { navigator } = this.props;
    if (navigator) {
      navigator.push({
        comp: MessageDetail,
        param: {
          name: name,
          title: title,
        }
      })
    }
    /*MessageAction.setOtherMsgRead({category: name}, function (data) {
     //更新未读标记

     }, function (data) {
     Alert('已读标记设置失败!');
     });*/
  },
  toLogin(){
    this.props.navigator.push({comp: Login})
  },
  render: function () {
    //if (this.state.token == null) {
    //  return (
    //    <NavBarView navigator={this.props.navigator} showBack={false} title="消息">
    //      <ToLogin func={this.toLogin}/>
    //    </NavBarView>
    //  )
    //} else {
      if (!this.state.data || this.state.data.length == 0) {
        return (
          <NavBarView navigator={this.props.navigator} showBack={false} title="消息"
                      contentBackgroundColor='#f0f0f0'>
            <View style={{marginTop:65,flexDirection:'column',alignItems:'center'}}>
              <Image style={{width:Adjust.width(350),height:200}} resizeMode="stretch"
                     source={require('../../image/message/noMessage.png')}/>
              <Text style={{marginTop:20,fontSize:16,color:'#7f7f7f'}}>暂无消息</Text>
            </View>
            <View style={{height:100}}></View>
          </NavBarView>
        )
      } else {
        return (
          <NavBarView navigator={this.props.navigator} showBack={false} title="消息"
                      contentBackgroundColor='#f0f0f0'>
            <GiftedListView
              ref="MsgList"
              rowView={this.renderLists}
              onFetch={this._onFetch}
              emptyView={this._emptyView}
              firstLoader={true} // display a loader for the first fetching
              pagination={true} // enable infinite scrolling using touch to load more
              refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
              withSections={false} // enable sections
              //customStyles={{
              //    refreshableView: {
              //      //backgroundColor: '#eee',
              //    },
              //  }}
            />
            <ListBottom/>
          </NavBarView>
        );
      }
    //}
  },

  _emptyView() {
    return (
      <View style={{marginTop:65,alignItems:'center',flex:1}}>
        <Image style={{width:Adjust.width(350),height:200}} resizeMode="stretch"
               source={require('../../image/bill/noBill.png')}/>
        <Text style={{marginTop:20,fontSize:16,color:'#7f7f7f'}}>暂时没有票据信息</Text>
      </View>
    );
  },

  _onFetch(page = 1, callback, options) {
    InteractionManager.runAfterInteractions(() => {
      this._fetchData(page - 1, callback, options);
    });
  },

  _fetchData: function (page, callback, options) {
    //let sDataSource = this.state.dataSource._dataBlob.s1;
    setTimeout(() => {
      var rows = [];
      var end = (page + 1) * PAGE_SIZE;
      var length = this.state.dataSource.length;
      if (length <= end) {
        rows = this.state.dataSource.slice(page * PAGE_SIZE);
        callback(rows, {
          allLoaded: true // the end of the list is reached
        });
      } else {
        rows = this.state.dataSource.slice(page * PAGE_SIZE, end);
        callback(rows);
      }
    }, 1000); // simulating network fetching
    //var rows = [];
    //var end = (page + 1) * PAGE_SIZE;
    //var length = this.state.dataSource.length;
    //if (length <= end) {
    //  rows = this.state.dataSource.slice(page * PAGE_SIZE);
    //  callback(rows, {
    //    allLoaded: true // the end of the list is reached
    //  });
    //} else {
    //  rows = this.state.dataSource.slice(page * PAGE_SIZE, end);
    //  callback(rows);
    //}
  },

  /*_onFetch(page = 1, callback, options) {
   setTimeout(() => {
   if (page === this.state.dataSource % 10 == 0 ? this.state.dataSource / 10 : this.state.dataSource / 10 + 1) {
   callback(this._getDataSource(page), {
   allLoaded: true, // the end of the list is reached
   });
   } else {
   callback(this._getDataSource(page));
   }
   }, 1000); // simulating network fetching
   },
   _getDataSource (page) {
   var totalPage = this.state.dataSource % 10 == 0 ? this.state.dataSource / 10 : this.state.dataSource / 10 + 1;
   var data = _.at(this.state.dataSource, (page - 1) * 10, 10)
   return data;
   },*/
  unReadIcon(item){
    if (item.unReadNum > 0) {
      return (
        <View style={[{marginLeft:28,width:20,height:20,borderRadius:10,backgroundColor:'red',
                flexDirection:'row',justifyContent:'center',alignItems:'center'},item.unReadNum>=99&&{height:20,width:25,marginLeft:23}]}>
          <Text style={{color:'white',fontSize:11}}>{item.unReadNum > 99 ? "99+" : item.unReadNum}</Text>
        </View>
      )
    }
  },
  icon(item){
    if (item.category == 'BILL_SENT') {
      return (require('../../image/message/billing.png'))
    } else if (item.category == 'MARKET_NEWS') {
      return (require('../../image/message/market.png'))
    } else if (item.category == 'SYSTEM_NOTICE') {
      return (require('../../image/message/system.png'))
    }
  },
  toOther(item){
    let billId = item.billId;
    //remove unread
    //MessageStore.updateMessage(billId);
    let bill = MessageStore.getRevBillDetail(billId);
    if (_.isEmpty(bill)) {
      Alert('票据信息不存在');
    } else {
      let isRead = item.isRead
      this.props.navigator.push({
        param: {title: '详情', record: bill, isRead: isRead},
        comp: BillDetailByMsg
      });
      //MessageAction.setBillRevRead({id: item.id}, function (data) {
      //}, function (data) {
      //  Alert('已读标记设置失败!')
      //});
    }
    MessageStore.setMsgReaded(item.billId);
  },
  unReadFlag(f){
    if (!f) {
      return (
        <View style={{height:10,width:10,borderRadius:5,backgroundColor:'#ff5f58'}}/>
      );
    }
  },

  /*renderHeaderView () {
   if (Array.isArray(item) == true && !_.isEmpty(item[0])) {
   if (!_.isEmpty(item.category)) {
   return (
   <View style={[{flexDirection:'column',marginTop:5,flex:1,backgroundColor:'#f0f0f0'}]}>
   </View>
   );
   }
   }
   },*/

  renderLists: function (item) {
    var {width,height} = Dimensions.get('window');
    if (item.category != 'BILL_REV') {
      return (
        <TouchableHighlight activeOpacity={1} underlayColor='#f0f0f0' onPress={()=>this.detail(item.category)}
                            style={[{flexDirection:'column',backgroundColor:'white',height:68},styles.borderBottom]}>
          <View style={[{flexDirection:'row',paddingHorizontal:12,width:width}]}>
            <View style={{width:72}}>
              <Image style={{width:48,height:48,marginTop:12}} source={this.icon(item)}>
                {this.unReadIcon(item)}
              </Image>
            </View>
            <View style={{height:68, flex:1,flexDirection:'column',justifyContent:'space-between'}}>
              <View style={{flex: 1,flexDirection:'row',justifyContent:'space-between', marginTop: 12}}>
                <Text numberOfLines={1}
                      style={{width: width-Adjust.width(150),fontSize:16,color:'#333333'}}>{item.title}</Text>
                <Text
                  style={{fontSize:11,color:'#7f7f7f'}}>{DateHelper.descDate(item.receiveDate)}</Text>
              </View>
              <View style={{marginBottom: 12}}>
                <Text style={{fontSize:14,color:'#7f7f7f'}}
                      numberOfLines={1}>{item.content}</Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      )
    } else {
      count = count + 1;
      return (
        <TouchableHighlight style={{marginTop: 5, backgroundColor:'white'}}
                            underlayColor='#cccccc'
                            onPress={()=>this.toOther(item)}>
          <View style={[styles.borderBottom,{borderWidth:0, flexDirection: 'column'}]}>
            <View
              style={[{flexDirection:'row',justifyContent:'space-between',padding:12,marginTop:12}]}>
              <View style={{flexDirection:'row'}}>
                <Text style={{fontSize:16,color:'#333333'}}>{item.title}</Text>
                <View style={{marginLeft: 2, marginTop: 4}}>
                  {this.unReadFlag(item.isRead)}
                </View>
              </View>
              <Text
                style={{fontSize:11,color:'#7f7f7f'}}>{DateHelper.descDate(item.receiveDate)}</Text>
            </View>
            <Text numberOfLines={2}
                  style={[{fontSize:14,color:'#7f7f7f',flex:1,paddingHorizontal:12}, styles.contentMargin]}>{item.content}</Text>
            <View
              style={{marginTop:10,marginHorizontal:10,borderBottomWidth: 0.5, borderColor: '#c8c7cc'}}>
            </View>
            <View
              style={{height:40,flexDirection:'row',paddingHorizontal:12,alignItems:'center',justifyContent:'space-between'}}>
              <Text style={{fontSize:14,color:'#7f7f7f'}}>查看详情</Text>
              <VIcon/>
            </View>
          </View>
        </TouchableHighlight>
      )

    }
  },

});
var styles = StyleSheet.create({
  borderTop: {
    borderTopWidth: 1,
  },
  borderBottom: {
    borderBottomWidth: 0.5, borderColor: '#c8c7cc'
  },
  contentMargin: {
    marginLeft: (Platform.OS === 'ios') ? 0 : 12
  }
})
module.exports = Message;