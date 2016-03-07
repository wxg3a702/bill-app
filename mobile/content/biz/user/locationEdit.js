'use strict';

var React = require('react-native');
var {
    StyleSheet,
    View,
    TouchableHighlight,
    Text,
    ScrollView,
    ListView,
    } = React;
var {Icon,} = require('react-native-icons');
var NavBarView = require('../../framework/system/navBarView')
var AppStore = require('../../framework/store/appStore');
var AppAction = require("../../framework/action/appAction")
var ds = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
var LocationEdit = React.createClass({
    getStateFromStores() {
        var city = this.props.param.item.city;
        return city;
    },
    componentDidMount() {
        this.fetchData();
        AppStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        AppStore.removeChangeListener(this._onChange);
    },
    _onChange: function () {
        this.setState({dataSource: ds.cloneWithRows(this.getStateFromStores()), data: this.getStateFromStores()});
    },
    getInitialState: function () {
        return {dataSource: ds.cloneWithRows(this.getStateFromStores()), data: this.getStateFromStores()};
    },
    fetchData: function () {
        this.setState({dataSource: ds.cloneWithRows(this.getStateFromStores()), data: this.getStateFromStores()});
    },
    goBack: function () {
        var routes = this.props.navigator.getCurrentRoutes();
        this.props.navigator.popToRoute(routes[routes.length - 3]);
    },
    toEdit(name){
        AppAction.updateUser(
            {location: this.props.param.item.name + ' ' + name}
            , this.goBack)
    },
    render: function () {
        if (!this.props.param.isCity) {
            return (
                <NavBarView navigator={this.props.navigator} title='所在地'>
                    <View style={{flexDirection:'row',height:10,borderBottomColor:'#cccccc',borderBottomWidth:1}}>
                    </View>
                    <ListView dataSource={this.state.dataSource} renderRow={this.renderLists}
                              loadData={this.fetchData} automaticallyAdjustContentInsets={false}/>
                </NavBarView>
            );
        } else {
            return (
                <NavBarView navigator={this.props.navigator} title='所在地'>
                    <View style={{flexDirection:'row',height:10,borderBottomColor:'#cccccc',borderBottomWidth:1}}>
                    </View>
                    <ScrollView>
                        {
                            this.props.param.item.city[0].area.map(
                                (res, index)=> {
                                    return (
                                        <TouchableHighlight underlayColor={'#cccccc'} key={index}
                                                            onPress={() => this.toEdit(res)}>
                                            <View
                                                style={{paddingLeft:16,paddingVertical:8,flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:'white',borderBottomColor: '#cccccc', borderBottomWidth: 1}}>
                                                <Text>{res}</Text>
                                                <Icon name='ion|ios-arrow-forward' size={26} color='C7C7CC'
                                                      style={{width: 35, height: 35}}/>
                                            </View>
                                        </TouchableHighlight>
                                    )
                                }
                            )
                        }
                    </ScrollView>
                </NavBarView>
            )
        }
    },
    renderLists: function (item) {
        return (
            <TouchableHighlight underlayColor={'#cccccc'} onPress={() => this.toEdit(item.name)}>
                <View
                    style={{paddingLeft:16,paddingVertical:8,flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:'white',borderBottomColor: '#cccccc', borderBottomWidth: 1}}>
                    <Text>{item.name}</Text>
                    <Icon name='ion|ios-arrow-forward' size={26} color='C7C7CC' style={{width: 35, height: 35}}/>
                </View>
            </TouchableHighlight>
        )
    }
});

var styles = StyleSheet.create({});
module.exports = LocationEdit;