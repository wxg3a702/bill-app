'use strict';

var React = require('react-native');
var {
    ListView,
    TouchableHighlight,
    Text,
    View,
    Platform,
    Dimensions,
    Image,
    StyleSheet,
    TouchableOpacity
    } = React;
var NavBarView = require('../../framework/system/navBarView');
var AppStore = require('../../framework/store/appStore');
var numeral = require('numeral');
var Login = require('../login/login');
var BillStore = require('../../framework/store/billStore');
var Bill = React.createClass({
    getStateFromStores(){
        var token = AppStore.getToken();
        var sentBill = BillStore.getSentBill();
        var revBill = BillStore.getRevBill();
        return ({
            token: token,
            checkColor: 'white',
            unCheckColor: '#44bcb2'
        })
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
    },
    changeView(){
        this.setState({
            checkColor:this.state.checkColor=='white'?'#44bcb2':'white',
            unCheckColor:this.state.unCheckColor=='#44bcb2'?'white':'#44bcb2'
        })
    },
    render(){
        return (
            <NavBarView navigator={this.props.navigator} showBar={false}>
                <View style={[styles.comStyle]}>
                    <TouchableOpacity onPress={this.changeView}>
                        <View style={[styles.titleView,{backgroundColor:this.state.unCheckColor},styles.leftRadius]}>
                            <Text style={[styles.title,{color:this.state.checkColor}]}>收到的票</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.changeView}>
                        <View style={[styles.titleView,{backgroundColor:this.state.checkColor},styles.rightRadius]}>
                            <Text style={[styles.title,{color:this.state.unCheckColor}]}>开出的票</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
    comStyle: {
        height: (Platform.OS === 'ios') ? 64 : 44,
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    title: {
        fontSize: 16, color: '#44bcb2',
    },
    leftRadius: {
        borderBottomLeftRadius: 6,
        borderTopLeftRadius: 6
    },
    rightRadius: {
        borderBottomRightRadius: 6,
        borderTopRightRadius: 6
    },
    titleView: {
        width: 80, height: 29, justifyContent: 'center', alignItems: 'center',
    }
})
module.exports = Bill;
