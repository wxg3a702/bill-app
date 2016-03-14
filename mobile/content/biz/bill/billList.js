'use strict';

var React = require('react-native');
var {
    ListView,
    TouchableHighlight,
    Text,
    View,
    SegmentedControlIOS,
    Dimensions,
    Image,
    Platform
    }=React
var Login = require('../login/login')
var NavBarView = require('../../framework/system/navBarView');
var AppStore = require('../../framework/store/appStore');
var BillAction = require('../../framework/action/billAction');
var _ = require('lodash');
var window = Dimensions.get('window');
var ds = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
var BillList = React.createClass({
    getStateFromStores() {
        var token = AppStore.getToken();
        return {
            token: token,
        }
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
    toLogin(){
        this.props.navigator.push({comp: Login})
    },
    render: function () {
        var {height, width} = Dimensions.get('window');
        if (this.state.token == null) {
            return (
                <NavBarView navigator={this.props.navigator} showBack={false} title="票据"
                            contentBackgroundColor='#f0f0f0'>
                    <View style={{flexDirection:'row',justifyContent:'space-between',padding:8}}>
                        <Text>你还没有登陆</Text>
                        <TouchableHighlight onPress={this.toLogin}>
                            <Text>点击去登陆</Text>
                        </TouchableHighlight>
                    </View>
                </NavBarView>
            )
        } else {
            return (
                <NavBarView navigator={this.props.navigator} title="票据" showBar={false} showBack={false}
                            contentBackgroundColor='#f0f0f0'>


                </NavBarView>
            );
        }
    },
});

module.exports = BillList;