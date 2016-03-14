'use strict';

var React = require('react-native');
var {
    PushNotificationIOS,
    AppStateIOS,
    Platform,
    ScrollView,
    TabBarIOS
    } = React;
var Home = require('../../biz/home/home')
var Bill = require("../../biz/bill/billList")
var Message = require("../../biz/message/messageList")
var PersonCenter = require("../../biz/personalCenter/personalCenter")
var CommonAction = require('../action/commonAction');
var AppStore = require('../store/appStore');
var MessageStore = require('../../framework/store/messageStore');
//var TabBarIOS = require('./tabBarIOS.ios.fas')
var Alert = require('../../comp/utils/alert');
var Login = require('../../biz/login/login')
var ScrollableTabView = require('../../comp/tabBar/android/tabContainer')
var AndroidTabBar = require('../../comp/tabBar/android/tabBar')

var TabView = React.createClass({
    getStateFromStores() {
        var token = AppStore.getToken();
        var mainMsgBean = MessageStore.getMainMsgBean();
        if (token != null) {
            var sum = 0;
            var billSum = 0;
            mainMsgBean.messageBeans.forEach(function (object) {
                billSum += ((object.isRead) ? 0 : 1)
            });
            sum = billSum;
            var show = sum >= 99 ? "99+" : sum;
            if (Platform.OS == 'ios') {
                PushNotificationIOS.setApplicationIconBadgeNumber(sum);
            }
            return {
                billSum: show,
                token: token
            }
        } else {
            return {
                token: token
            }
        }
    },

    componentDidMount() {
        AppStore.addChangeListener(this._onChange);
        if (Platform.OS === 'ios') {
            if (!AppStore.getAPNSToken()) {
                PushNotificationIOS.requestPermissions();
            }

            PushNotificationIOS.removeEventListener('register', CommonAction.notificationRegister);
            PushNotificationIOS.removeEventListener('notification', CommonAction.onNotification);
            AppStateIOS.removeEventListener('change', this._handleAppStateChange);


            PushNotificationIOS.addEventListener('register', CommonAction.notificationRegister);
            PushNotificationIOS.addEventListener('notification', CommonAction.onNotification);

            AppStateIOS.addEventListener('change', this._handleAppStateChange);
        }
    },

    componentWillUnmount: function () {
        if (Platform.OS === 'ios') {
            AppStore.removeChangeListener(this._onChange);
            PushNotificationIOS.removeEventListener('register', CommonAction.notificationRegister);
            PushNotificationIOS.removeEventListener('notification', CommonAction.onNotification);
            AppStateIOS.removeEventListener('change', this._handleAppStateChange);
            PushNotificationIOS.setApplicationIconBadgeNumber(0);
        }
    },

    _handleAppStateChange: function (currentAppState) {
        switch (currentAppState) {
            case "active":
                CommonAction.freshNotification();
                break;
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
                <ScrollableTabView initialPage={0} locked={true}
                                   renderTabBar={() => <AndroidTabBar />}>
                    <ScrollView
                        tabLabel="ios-home"
                        tabDesc="首页"
                        icon={require('../../image/tab/home.png')}
                        selectedIcon={require('../../image/tab/home_selected.png')}>
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
                        tabDesc="消息"
                        badge={this.state.billSum==0?null:this.state.billSum}
                        icon={require('../../image/tab/message.png')}
                        selectedIcon={require('../../image/tab/message_selected.png')}>
                        <Message navigator={this.props.navigator}></Message>
                    </ScrollView>

                    <ScrollView
                        tabLabel="person-stalker"
                        tabDesc="我的"
                        icon={require('../../image/tab/member.png')}
                        selectedIcon={require('../../image/tab/member_selected.png')}>
                        <PersonCenter navigator={this.props.navigator}/>
                    </ScrollView>
                </ScrollableTabView>
            )
        }
    },
});

module.exports = TabView;