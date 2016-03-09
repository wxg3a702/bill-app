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
var PersonCenter = require("../../biz/user/personalCenter")
var AppAction = require('../action/appAction');
var AppStore = require('../store/appStore');
//var TabBarIOS = require('./tabBarIOS.ios.fas')
var Alert = require('../../comp/utils/alert');
var Login = require('../../biz/login/login')
var ScrollableTabView = require('../../comp/tabBar/android/tabContainer')
var AndroidTabBar = require('../../comp/tabBar/android/tabBar')

var TabView = React.createClass({
    getStateFromStores() {
        var token = AppStore.getToken();
        var mainMsgBean = AppStore.getMainMsgBean();
        if (token != null) {
            var sum = 0;
            var billSum = 0;
            mainMsgBean.messageBeans.forEach(function (object) {
                billSum += ((object.isRead) ? 0 : 1)
            });
            sum = billSum;
            var show = sum >= 99 ? "99+" : sum;
            PushNotificationIOS.setApplicationIconBadgeNumber(sum);
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

            PushNotificationIOS.removeEventListener('register', AppAction.notificationRegister);
            PushNotificationIOS.removeEventListener('notification', AppAction.onNotification);
            AppStateIOS.removeEventListener('change', this._handleAppStateChange);


            PushNotificationIOS.addEventListener('register', AppAction.notificationRegister);
            PushNotificationIOS.addEventListener('notification', AppAction.onNotification);

            AppStateIOS.addEventListener('change', this._handleAppStateChange);
        }
    },

    componentWillUnmount: function () {
        if (Platform.OS === 'ios') {
            AppStore.removeChangeListener(this._onChange);
            PushNotificationIOS.removeEventListener('register', AppAction.notificationRegister);
            PushNotificationIOS.removeEventListener('notification', AppAction.onNotification);
            AppStateIOS.removeEventListener('change', this._handleAppStateChange);
            PushNotificationIOS.setApplicationIconBadgeNumber(0);
        }
    },

    _handleAppStateChange: function (currentAppState) {
        switch (currentAppState) {
            case "active":
                AppAction.freshNotification();
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

    toPage(call){
        if (this.state.token == null) {
            this.props.navigator.push({comp: Login})
        } else {
            call();
        }
    },

    //changeTab(i){
    //    if ((i == 1 || i == 2) && this.state.token == null) {
    //        this.props.navigator.push({comp: Login})
    //    }
    //},
    //onChangeTab={()=>this.changeTab(i)}

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
                        onPress={()=>this.toPage(() => {this.setState({selectedTab: 'bills'})})}>
                        <Bill navigator={this.props.navigator}/>
                    </TabBarIOS.Item>

                    <TabBarIOS.Item
                        badge={this.state.billSum==0?null:this.state.billSum}
                        title="消息"
                        icon={require('../../image/tab/message.png')}
                        selectedIcon={require('../../image/tab/message_selected.png')}
                        selected={this.state.selectedTab === 'messages'}
                        onPress={()=>this.toPage(() => {this.setState({selectedTab: 'messages'})})}>
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
                <ScrollableTabView initialPage={1} locked={true}
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