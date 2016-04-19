'use strict';

var React = require('react-native');
var {
  TouchableHighlight,
  Text,
  View,
  ListView,
  Image,
  StyleSheet,
  InteractionManager,
  Platform,
  Dimensions
  } = React;
var Adjust = require('../../comp/utils/adjust')
var AppStore = require('../../framework/store/appStore');
var MessageStore = require('../../framework/store/messageStore');
var MessageAction = require("../../framework/action/messageAction");
var _ = require('lodash');
var NavBarView = require('../../framework/system/navBarView');
var MessageGroupType = require('../../constants/messageGroupType');
var Detail = require('../billNew/billDetail');
var DateHelper = require("../../comp/utils/dateHelper");
var Alert = require('../../comp/utils/alert');
var VIcon = require('../../comp/icon/vIcon');
var GiftedListView = require('../../comp/listView/GiftedListView');
var MsgCategory = require('../../constants/notification').MsgCategory;
var CompCertification = require('../company/compCertification')
var PAGE_SIZE = 10;
var ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});
var MessageDetail = React.createClass({
  getStateFromStores() {
    var results = MessageStore.getResult(this.props.param.name);
    return {
      dataSource: results,
      renderList: this.renderLists,
      result: results
    }
  },
  componentDidMount() {
    this.fetchData();
    MessageAction.clearMessageDetail(MessageGroupType[this.props.param.name]);
    AppStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange);
  },
  _onChange: function () {
    this.setState(this.getStateFromStores());
    if (this.state.token && !_.isEmpty(this.refs['MsgList'])) {
      //this.refs['MsgList']._refreshWithoutSpinner();

      setTimeout(() => {
        InteractionManager.runAfterInteractions(() => {
              this.refs['MsgList']._refreshWithoutSpinner();
            }
        )
      }, 1000);
    }
  },
  getInitialState: function () {
    return this.getStateFromStores();
  },
  fetchData: function () {
    this.setState({
      dataSource: this.state.result
    });
  },

  _backPress () {
    MessageStore.updateUnReadNum(this.props.param.name);
    this.props.navigator.pop();
  },

  render(){
    return (
      <NavBarView navigator={this.props.navigator} title={this.props.param.title}
                  contentBackgroundColor='#f0f0f0' backPress={this._backPress}>
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
      </NavBarView>
    )
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

  toOther(item){
    if (this.props.param.name == MsgCategory.BILL_SENT) {
      let billId = item.billId;
      if (billId == null || billId == undefined) {
        return;
      }
      let bill = MessageStore.getSentBillDetail(billId);
      if (_.isEmpty(bill)) {
        Alert('票据信息不存在');
      } else {
        this.props.navigator.push({
          param: {title: '详情', item: bill},
          comp: Detail
        });
      }
    } else if (this.props.param.name == MsgCategory.SYSTEM_NOTICE){
      this.props.navigator.push({
        comp: CompCertification
      });
    }

  },

  toDetailView(){
    if (this.props.param.title != '市场动态') {
      return (
        <View>
          <View
            style={{marginHorizontal:10,borderBottomWidth: 0.5, borderColor: '#c8c7cc'}}></View>
          <View
            style={{height:40,flexDirection:'row',paddingHorizontal:12,alignItems:'center',justifyContent:'space-between'}}>
            <Text style={{fontSize:14,color:'#7f7f7f'}}>查看详情</Text>
            <VIcon/>
          </View>
        </View>
      )
    }
  },

  renderLists: function (item) {
    var {width,height} = Dimensions.get('window');
    return (
      <View
        style={{marginTop:5,flexDirection:'column',flex:1,backgroundColor:'white',borderBottomWidth: 0.5,borderColor: '#c8c7cc'}}>
        <TouchableHighlight underlayColor={'#cccccc'} onPress={()=>this.toOther(item)}>
          <View>
            <View style={{flexDirection:'row',justifyContent:'space-between',padding:12}}>
              <Text numberOfLines={2}
                    style={{width:width-Adjust.width(100),fontSize:16,color:'#333333'}}>{item.title}</Text>
              <Text
                style={{fontSize:11,color:'#7f7f7f'}}>{DateHelper.descDate(new Date(item.receiveDate))}</Text>
            </View>
            <Text
              style={[{marginBottom: 10, marginLeft:12, fontSize:14,color:'#7f7f7f',flex:1,paddingHorizontal:12}, styles.contentMargin]}>{item.content}</Text>
            {this.toDetailView()}
          </View>
        </TouchableHighlight>
      </View>
    )
  }

})
var styles = StyleSheet.create({
  contentMargin: {
    marginLeft: (Platform.OS === 'ios') ? 0 : 12
  }
})
module.exports = MessageDetail;