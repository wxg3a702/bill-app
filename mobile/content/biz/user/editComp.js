'use strict';
var React = require('react-native');
var {
    View,
    ListView,
    Text,
    ScrollView
    } = React;
var AppStore = require('../../framework/store/appStore');
var CompAction = require("../../framework/action/compAction")
var NavBarView = require('../../framework/system/navBarView')
var SearchBar = require('react-native-search-bar')
var ds = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2
});
var res = [
    {
        id: 1,
        name: '美国安硕信息网络技术有限公司',
        state: 'CERTIFIED',
    }, {
        id: 2,
        name: '上海安硕信息网络技术有限公司',
        state: 'CERTIFIED',
    }, {
        id: 3,
        name: '美国安硕信息网络技术有限公司',
        state: 'CERTIFIED',
    }
]
var EditComp = React.createClass({
    getStateFromStores(){
        return {
            dataSource: ds.cloneWithRows(res)
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
    pick(text){
        var ret = new Array();
        if (!text) {
            ret = res
        } else {
            res.map((item, index)=> {
                if (text.indexOf(item.name) > -1) {
                    ret.push(item)
                }
            })
        }
        this.setState({dataSource: ds.cloneWithRows(ret)})
    },
    returnItem(data){
        return (
            <View style={{justifyContent:'center',height:50,paddingVertical:10,paddingLeft:10,backgroundColor:'white'}}>
                <Text style={{fontSize:18}}>{data.name}</Text>
            </View>
        )
    },
    renderSectionHeader: function (sectionData, sectionID) {
        return (
            <View style={{flexDirection:'row',height:40,alignItems:'center',paddingLeft:10}}>
                <Text>{sectionID}</Text>
            </View>
        )
    },
    render(){
        return (
            <NavBarView navigator={this.props.navigator} title="公司">
                <SearchBar ref='searchBar' placeholder='Search' onChangeText={(text)=>this.pick(text)}/>
                <ListView dataSource={this.state.dataSource} renderRow={this.returnItem}
                          renderSectionHeader={this.renderSectionHeader}/>
            </NavBarView>
        )
    }
})
module.exports = EditComp;