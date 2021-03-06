'use strict';

var React = require('react-native');
var {
  PushNotificationIOS,
  AppStateIOS,
  Platform,
  ScrollView,
  View,
  TabBarIOS,
  InteractionManager,
  DeviceEventEmitter
  } = React;
var _ = require('lodash');
var Home = require('../../biz/home/home');
var Bill = require('../../biz/billNew/billList');

var Demo = require('../../biz/billNew/demo');

var Message = require("../../biz/message/messageList")
var PersonCenter = require("../../biz/personalCenter/personalCenter")
var CommonAction = require('../action/commonAction');
var AppStore = require('../store/appStore');
var MessageStore = require('../../framework/store/messageStore');
//var TabBarIOS = require('./tabBarIOS.ios.fas')
var Alert = require('../../comp/utils/alert');
var Login = require('../../biz/login/login')
var ScrollableTabView = require('../../comp/tabBar/android/tabContainer')
var AndroidTabBar = require('../../comp/tabBar/android/tabBar');
var NotificationManager = require('./notificationManager');

const PageDic = {
  home:0,
  bills:1,
  messages:2,
  personCenter:3

};

var BillStore = require('../../framework/store/billStore');
var UserStore = require('../../framework/store/userStore');
var _showDemo = false;

var TabView = React.createClass({
  getStateFromStores() {
    var token = AppStore.getToken();
    var mainMsgBean = MessageStore.getMainMsgBean();
    if (token != null) {
      var othMsgNum = 0;
      var sum = 0;
      var billSum = 0;
      if (_.isEmpty(mainMsgBean)) {

      } else {
        if (mainMsgBean.messageBeans) {
          mainMsgBean.messageBeans.forEach(function (object) {
            billSum += ((object.isRead) ? 0 : 1)
          });
        }
        if (mainMsgBean.billSentBean) {
          othMsgNum = mainMsgBean.billSentBean.unReadNum;
        }
        if (mainMsgBean.marketNewsBean) {
          othMsgNum = mainMsgBean.marketNewsBean.unReadNum + othMsgNum;
        }
        if (mainMsgBean.systemNoticeBean) {
          othMsgNum = mainMsgBean.systemNoticeBean.unReadNum + othMsgNum;
        }
      }
      sum = billSum;
      var show;
      if (Platform.OS == 'ios') {
        PushNotificationIOS.setApplicationIconBadgeNumber(sum);
        show = sum >= 99 ? "99+" : sum;
      } else {
        show = sum;
      }
      return {
        othMsgNum: othMsgNum,
        billSum: show,
        token: token,
        initialPage: 0
      }
    } else {
      return {
        token: token,
        initialPage: 0
      }
    }
  },

  componentDidMount() {
    AppStore.addChangeListener(this._onChange);
    InteractionManager.runAfterInteractions(() => {
      //if (AppStore.getRevBillMessage()) {
        NotificationManager.openNotification(()=>{this.setState({initialPage: 2})});
      //}
    });
  },

  componentWillUnmount: function () {
   // if (this.state.token) {
      if (AppStore.getRevBillMessage()) {
        //if (Platform.OS === 'ios') {

        //  PushNotificationIOS.removeEventListener('register', CommonAction.notificationRegister);
        //  PushNotificationIOS.removeEventListener('notification', CommonAction.onNotification);
        //  AppStateIOS.removeEventListener('change', this._handleAppStateChange);
        //  PushNotificationIOS.setApplicationIconBadgeNumber(0);
        //}
        NotificationManager.closeNotification();
      }
  //  }
    AppStore.removeChangeListener(this._onChange);
  },

  _handleAppStateChange: function (currentAppState) {
    if (AppStore.getRevBillMessage()) {
      switch (currentAppState) {
        case "active":
          CommonAction.freshNotification();
          break;
      }
    }
  },

  _onChange: function () {
    this.setState(this.getStateFromStores());
  },

  getInitialState: function () {
    let tabName = this.props.tabName;
    if(!tabName){
      tabName = 'home';
    }
    let initialPage = PageDic[tabName];

    return _.assign(
      this.getStateFromStores(),
      {selectedTab: tabName, initialPage: initialPage}
    );
  },

  render: function () {
    var navigator = this.props.navigator;
    if (Platform.OS === 'ios') {
      return (
        <TabBarIOS selectedTab={this.state.selectedTab} tintColor={'#44bcb2'} barTintColor={'#f6f6f6'}>
          <TabBarIOS.Item
            title="首页"
            icon={require('../../image/tab/home.png')}
            selectedIcon={require('../../image/tab/home_selected.png')}
            selected={this.state.selectedTab === 'home'}
            onPress={() => {this.setState({selectedTab: 'home'});}}>
            <Home navigator={this.props.navigator}/>
          </TabBarIOS.Item>

          <TabBarIOS.Item
            title="票据"
            icon={require('../../image/tab/bill.png')}
            selectedIcon={require('../../image/tab/bill_selected.png')}
            selected={this.state.selectedTab === 'bills'}
            onPress={() => {this.setState({selectedTab: 'bills'})}}>
            <Bill navigator={this.props.navigator}/>
          </TabBarIOS.Item>

          <TabBarIOS.Item
            badge={this.state.billSum==0?null:this.state.billSum}
            title="消息"
            icon={require('../../image/tab/message.png')}
            selectedIcon={require('../../image/tab/message_selected.png')}
            selected={this.state.selectedTab === 'messages'}
            onPress={() => {this.setState({selectedTab: 'messages'})}}>
            <Message navigator={this.props.navigator}></Message>
          </TabBarIOS.Item>

          <TabBarIOS.Item
            title="个人"
            icon={require('../../image/tab/member.png')}
            selectedIcon={require('../../image/tab/member_selected.png')}
            selected={this.state.selectedTab === 'personCenter'}
            onPress={() => {this.setState({selectedTab: 'personCenter'})}}>
            <PersonCenter navigator={this.props.navigator}></PersonCenter>
          </TabBarIOS.Item>

        </TabBarIOS>
      );
    } else {
      return (
          <ScrollableTabView
              initialPage={this.state.initialPage}
              locked={true}
              renderTabBar={() => <AndroidTabBar />}
              onChangeTab={(data) => {
              if (data.i === 1) {
                var obj = BillStore.getDemoFlag();
                if (_showDemo && (obj == undefined || obj.flag != true || (obj.id != UserStore.getUserId()))) {
                  _showDemo = false;
                  navigator.push({
                      comp: Demo
                  });
                }
              }
            }}
          >

          <Home navigator={this.props.navigator}
                tabLabel="ios-home"
                tabDesc="首页"
                icon={require('../../image/tab/home.png')}
                selectedIcon={require('../../image/tab/home_selected.png')}>
          </Home>

          <Bill navigator={this.props.navigator}
                tabLabel="clipboard"
                tabDesc="票据"
                icon={require('../../image/tab/bill.png')}
                selectedIcon={require('../../image/tab/bill_selected.png')}
                onShowDemo={() => {
                  _showDemo = true;
                }}
          >
          </Bill>

          <Message navigator={this.props.navigator} tabDesc="消息"
                   badge={this.state.billSum==0?(this.state.othMsgNum == 0 ? null : null):this.state.billSum}
                   icon={require('../../image/tab/message.png')}
                   selectedIcon={require('../../image/tab/message_selected.png')}/>

          <PersonCenter navigator={this.props.navigator}
                        tabLabel="person-stalker"
                        tabDesc="我的"
                        icon={require('../../image/tab/member.png')}
                        selectedIcon={require('../../image/tab/member_selected.png')}>
          </PersonCenter>

          </ScrollableTabView>
      )
    }
  },
});

module.exports = TabView;