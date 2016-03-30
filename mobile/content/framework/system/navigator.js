'use strict';
var React = require('react-native');
var {
    Navigator,
    StyleSheet,
    Text,
    View,
    BackAndroid,
    Platform
    } = React;
var AppAction = require('../action/commonAction');
AppAction.appInit();
var Home = require('../../biz/home/home')
var TabView = require('./tabView');
var AppStore = require('../store/appStore');
var Alert = require('../../comp/utils/alert');
if (Platform.OS === 'android') {
    var _navigator;
    BackAndroid.addEventListener('hardwareBackPress', function () {
        if (_navigator && _navigator.getCurrentRoutes().length > 1) {
            _navigator.pop();
            return true;
        }
        return false;
    });
}
var Main = React.createClass({

    getStateFromStores() {
        return {
            initLoading: AppStore.getInitLoadingState(),
            token: AppStore.getToken(),
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    componentDidMount() {
        AppStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        AppStore.removeChangeListener(this._onChange);
    },

    _onChange: function () {
        this.setState(this.getStateFromStores());
        if (AppStore.isLogout()) {
            if (AppStore.isForceLogout()) {
                Alert(
                    '账号已在别处登陆,系统将切换到登陆界面',
                    {text: '确定', onPress: () => this.refs.navigator.resetTo({comp: TabView})}
                )
            } else {
                Promise.resolve().then(function (resolve) {
                    this.refs.navigator.resetTo({comp: TabView})
                }.bind(this)).catch(function (e) {
                    Alert("系统异常")
                })
            }
        }
    },
    renderScene(route, navigator) {
        _navigator = navigator;
        var Comp = route.comp;
        if (Comp == "tabView") {
            Comp = TabView
        }
        navigator.cur = Comp;
        return (
            <Comp param={route.param} navigator={navigator} callback={route.callBack}/>
        )
    },
    render(){
        var initComp;
        if (this.state.initLoading) {
            return (
                <View style={styles.container}>
                    <Text>Loading...</Text>
                </View>
            )
        } else {
            initComp = TabView
            return (
                <Navigator ref="navigator" renderScene={this.renderScene} initialRoute={{comp:initComp}}/>
            );
        }
    }
})
var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
})
module.exports = Main;