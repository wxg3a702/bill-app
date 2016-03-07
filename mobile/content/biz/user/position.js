'use strict';

var React = require('react-native');
var {
    StyleSheet,
    View,
    Image,
    TouchableHighlight,
    Text,
    ListView,
    ScrollView
    } = React;
var LocationEdit = require('./locationEdit')
var {Icon,} = require('react-native-icons');
var NavBarView = require('../../framework/system/navBarView')
var AppStore = require('../../framework/store/appStore');
var AppAction = require("../../framework/action/appAction")
var ds = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
var Position = React.createClass({
    getStateFromStores() {
        return AppStore.getArea();
    },
    componentDidMount() {
        this.fetchData();
        AppStore.addChangeListener(this._onChange);
        AppAction.getRegion(
            function (loc) {
                this.setState({'location': loc, gps: true});
            }.bind(this),
            function (loc) {
                this.setState({'location': loc, gps: false});
            }.bind(this)
        );
    },

    componentWillUnmount: function () {
        AppStore.removeChangeListener(this._onChange);
    },
    _onChange: function () {
        this.setState({dataSource: ds.cloneWithRows(this.getStateFromStores()), data: this.getStateFromStores()});
    },
    getInitialState: function () {
        return {
            dataSource: ds.cloneWithRows(this.getStateFromStores()),
            data: this.getStateFromStores(),
            location: '定位中...',
            gps: false
        };
    },
    fetchData: function () {
        this.setState({dataSource: ds.cloneWithRows(this.getStateFromStores()), data: this.getStateFromStores()});
    },
    toEdit(item){
        const { navigator } = this.props;
        if (item.city.length == 1) {
            if (item.city[0].area.length == 1) {
                AppAction.updateUser(
                    {location: item.name}
                    , function () {
                        navigator.pop()
                    })
            } else {
                if (navigator) {
                    navigator.push({
                        comp: LocationEdit,
                        param: {
                            item: item,
                            isCity: true
                        }
                    });
                }
            }
        } else {
            if (navigator) {
                navigator.push({
                    comp: LocationEdit,
                    param: {
                        item: item
                    }
                });
            }
        }
    },
    positionEdit(value){
        if (this.state.gps) {
            const { navigator } = this.props;
            AppAction.updateUser(
                {location: value}
                , function () {
                    navigator.pop()
                })
        }
    },
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title='所在地'>
                <ScrollView>
                    <View style={{paddingHorizontal:18,paddingTop:18,paddingBottom:8,}}>
                        <Text style={{fontSize:14}}>当前位置</Text>
                    </View>
                    <TouchableHighlight underlayColor={'#cccccc'} onPress={()=>this.positionEdit(this.state.location)}>
                        <View style={{backgroundColor:'white',padding:18,flexDirection:'row',alignItems:'center',}}>
                            <Image style={{width: 16,height: 16,borderRadius: 8,marginTop: 1}}
                                   resizeMode="stretch"
                                   source={require('../../image/user/location.png')}/>
                            <Text style={{fontSize:16,marginLeft:8}}>{this.state.location}</Text>
                        </View>
                    </TouchableHighlight>
                    <View style={{paddingHorizontal:18,paddingTop:18,paddingBottom:8}}>
                        <Text style={{fontSize:14}}>全部地区</Text>
                    </View>
                    <View
                        style={{flexDirection:'row',padding:18,justifyContent:'space-between',backgroundColor:'white',alignItems:'center'}}>
                        <Text style={{fontSize:16}}>{this.props.param.location}</Text>
                        <Text>已选地区</Text>
                    </View>
                    <View style={{height:12}}>
                    </View>
                    <ListView dataSource={this.state.dataSource} renderRow={this.renderLists}
                              loadData={this.fetchData} automaticallyAdjustContentInsets={false}/>
                </ScrollView>
            </NavBarView>
        );
    },
    renderLists: function (item) {
        return (
            <TouchableHighlight underlayColor={'#cccccc'} onPress={() => this.toEdit(item)}>
                <View
                    style={{paddingLeft:16,paddingVertical:8,flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:'white',borderBottomColor: '#cccccc', borderBottomWidth: 1}}>
                    <Text style={{fontSize:16}}>{item.name}</Text>
                    <Icon name='ion|ios-arrow-forward' size={26} color='C7C7CC' style={{width: 35, height: 35}}/>
                </View>
            </TouchableHighlight>
        )
    }
});


var styles = StyleSheet.create({});
module.exports = Position;