'use strict';

var React = require('react-native');
var {
  PushNotificationIOS,
  AppStateIOS,
  TabBarIOS,
  Platform,
  ViewPagerAndroid,
  View,
  ScrollView,
  Image
  } = React;
var Home = require('../../biz/home/home')
var Bill = require("../../biz/bill/billList")
var Message = require("../../biz/message/messageList")
var PersonCenter = require("../../biz/user/personalCenter")
var AppAction = require('../action/appAction');
var AppStore = require('../store/appStore');
var ScrollableTabView = require('../../comp/tabBar/android/tabContainer')
var AndroidTabBar = require('../../comp/tabBar/android/tabBar')

var TabView = React.createClass({
  getStateFromStores() {
  },

  componentDidMount() {
    AppStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    AppStore.removeChangeListener(this._onChange);
  },

  _handleAppStateChange: function (currentAppState) {
    switch (currentAppState) {
      //case "active":
      //    AppAction.freshNotification();break;
    }
  },

  _onChange: function () {
    this.setState(this.getStateFromStores());
  },

  getInitialState: function () {
    return _.assign(
      this.getStateFromStores(),
      {selectedTab: 'home'}
    );
  },

  returnImage(source){
    return (
      <Image style={{width:40,height:40}} resizeMode="stretch" source={source}/>
    )
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
            onPress={() => {this.setState({selectedTab: 'bills'});}}>
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
      <ScrollableTabView initialPage={1} renderTabBar={() => <AndroidTabBar />}>

        <ScrollView
          tabLabel="ios-home"
          tabDesc="首页"
          icon={require('../../image/tab/home.png')}
          selectedIcon={require('../../image/tab/home_selected.png')} >
          <Home navigator={this.props.navigator}/>
        </ScrollView>

        <ScrollView
          tabLabel="clipboard"
          tabDesc="票据"
          icon={require('../../image/tab/bill.png')}
          selectedIcon={require('../../image/tab/bill_selected.png')}>
          <Bill navigator={this.props.navigator}/>
        </ScrollView>

        <ScrollView
          tabLabel="chatbubble-working"
          tabDesc="消息"
          badge=' '
          icon={require('../../image/tab/message.png')}
          selectedIcon={require('../../image/tab/message_selected.png')}>
          <Message navigator={this.props.navigator}></Message>
        </ScrollView>

        <ScrollView
          tabLabel="person-stalker"
          tabDesc="我的"
          icon={require('../../image/tab/member.png')}
          selectedIcon={require('../../image/tab/member_selected.png')}>
          <PersonCenter navigator={this.props.navigator}></PersonCenter>
        </ScrollView>

      </ScrollableTabView>

      )
    }
  },
});

module.exports = TabView;