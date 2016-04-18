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
var CompStore = require('../../framework/store/compStore')
var NavBarView = require('../../framework/system/navBarView')
var SearchBar = require('../../comp/utilsUi/searchBar')

var ds = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2
});
var EditComp = React.createClass({
    getStateFromStores(){
        var comp = CompStore.getCertifiedOrgBean()
        let res = new Array();
        comp.map((item, index)=> {
            if (!item.stdOrgBean) {
            } else {
                res.push(item.stdOrgBean)
            }
        })
        return {
            dataSource: ds.cloneWithRows(!res ? '' : res),
            res: res
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
        let res = this.state.res
        if (!res) {
        } else {
            var ret = new Array();
            if (!text) {
                ret = res
            } else {
                res.map((item, index)=> {
                    if (item.orgName.indexOf(text) > -1) {
                        ret.push(item)
                    }
                })
            }
            this.setState({dataSource: ds.cloneWithRows(ret)})
        }
    },

    setValue(data){
        const { navigator } = this.props;
        CompAction.updateDefaultOrgByUser(
            {
                orgId: data.id,
                defaultOrgName: data.orgName,
                setDefaultOrg: true
            },
            function () {
                navigator.pop()
            }.bind(this)
        )
    },

    setDefalutOrg:function(){
        const { navigator } = this.props;
        CompAction.unSetDefaultOrg(
            {
                defaultOrgName: undefined,
                setDefaultOrg: false
            },
            function () {
                navigator.pop()
            }.bind(this)
        )
    },

    returnItem(data){
        return (
            <TouchableHighlight onPress={()=>this.setValue(data)}
                                style={{borderBottomColor:'#f7f7f7',borderBottomWidth:1}}
                                underlayColor='#7f7f7f'>
                <View style={styles.content}>
                    <Text style={{fontSize:18}}>{data.orgName}</Text>
                </View>
            </TouchableHighlight>
        )
    },

    render(){
        return (
            <NavBarView navigator={this.props.navigator} title="公司">

                <SearchBar onChange={this.pick}/>

                <TouchableHighlight style={{borderBottomColor:'#f7f7f7',borderBottomWidth:1}}
                                    onPress={()=>this.setDefalutOrg()}
                                    underlayColor='#7f7f7f'>
                    <View style={styles.content}>
                        <Text style={{fontSize:18}}>未设置</Text>
                    </View>
                </TouchableHighlight>

                <ListView dataSource={this.state.dataSource} renderRow={this.returnItem}/>

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