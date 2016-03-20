'use strict';
var React = require('react-native');
var {
    View,
    ListView,
    Text,
    ScrollView,
    TouchableHighlight,
    StyleSheet
    } = React;
var AppStore = require('../../framework/store/appStore');
var CompAction = require("../../framework/action/compAction")
var NavBarView = require('../../framework/system/navBarView')
var SearchBar = require('../../comp/utilsUi/searchBar')
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
                if (item.name.indexOf(text) > -1) {
                    ret.push(item)
                }
            })
        }
        this.setState({dataSource: ds.cloneWithRows(ret)})
    },
    setValue(data){
        const { navigator } = this.props;
        this.props.callback(
            {comp: data.name},
            ()=> {
                navigator.pop()
            }
        )
    },
    returnItem(data){
        return (
            <TouchableHighlight onPress={()=>this.setValue(data)} underlayColor='#7f7f7f'>
                <View style={styles.content}>
                    <Text style={{fontSize:18}}>{data.name}</Text>
                </View>
            </TouchableHighlight>
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
                <SearchBar onChange={this.pick}/>
                <ListView dataSource={this.state.dataSource} renderRow={this.returnItem}
                          renderSectionHeader={this.renderSectionHeader}/>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
    content: {
        justifyContent: 'center', height: 50, paddingVertical: 10, paddingLeft: 10, backgroundColor: 'white'
    }
})
module.exports = EditComp;