'use strict';
var React = require('react-native');
var {
    Navigator,
    StyleSheet,
    Text,
    View,
    } = React;
var TabView = require('./tabView');
var AppStore = require('../store/appStore');
var AppAction = require('../action/appAction');
var cssVar = require('cssVar');
AppAction.appInit()
var Alert = require('../../comp/utils/alert');
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

    },
    renderScene(route, navigator) {
        var Comp = route.comp;
        if (Comp == "tabView")Comp = TabView
        navigator.cur = Comp;
        var res = <Comp param={route.param} navigator={navigator} callback={route.callBack}/>;
        return res;
    },
    render(){
        var initComp = TabView;
        if (this.state.initLoading) {
            return (
                <View style={styles.container}>
                    <Text>Loading...</Text>
                </View>
            )
        } else {
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