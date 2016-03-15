'use strict';

var React = require('react-native');
var {
    StyleSheet,
    TouchableHighlight,
    CameraRoll,
    Text,
    Dimensions,
    Image,
    View,
    ListView,
    } = React;
var {height, width} = Dimensions.get('window');
var Space = require('../../comp/utils/space')
var BottomButton = require('../../comp/utils/bottomButton')
var VIcon = require('../../comp/icon/vIcon')
var AppStore = require('../../framework/store/appStore');
var CompStore = require('../../framework/store/compStore');
var CompAction = require("../../framework/action/compAction")
var NavBarView = require('../../framework/system/navBarView')
var certificateState = require('../../constants/certificateState');
var Alert = require('../../comp/utils/alert');
var ds = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
var Button = require('../../comp/utils/button')
var res = [
    {
        id: 1,
        name: '',
        state: 'UNAUDITING'
    }, {
        id: 2,
        name: '',
        state: 'AUDITING',
    }, {
        id: 3,
        name: '',
        state: 'REJECTED'
    }, {
        id: 4,
        name: '上海安硕信息网络技术有限公司',
        state: 'CERTIFIED',
    }
]
var CompCertification = React.createClass({
    getStateFromStores(){
        var orgBean = CompStore.getOrgBeans()[0];
        return {
            bean: orgBean,
            num: 0,
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
    returnRow(data){
        if (data.name.length == 0) {
            this.setState({num: this.state.num + 1})
            data.name = '认证企业信息' + this.state.num;
        }
        return (
            <View
                style={{flexDirection:'row',justifyContent:'space-between',padding:16,height:50,alignItems:'center',backgroundColor:'white',borderBottomWidth: 1, borderColor: '#c8c7cc'}}>
                <Text style={{flex:1}}>{data.name}</Text>
                <Text
                    style={{width:60,color:certificateState[data.state].color}}>{certificateState[data.state].desc}</Text>
                <VIcon/>
            </View>
        )
    },
    returnList(){
        if (res.length == 0) {
            return (
                <View>

                </View>
            )
        } else {
            return (
                <ListView dataSource={this.state.dataSource} renderRow={this.returnRow}/>
            )
        }
    },
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="企业认证">
                <Space backgroundColor="#f0f0f0"/>
                <View style={{flex:1}}>
                    {this.returnList()}
                </View>
                <BottomButton func={this.addComp} content="新增企业信息"/>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
    bottom: {
        padding: 7, backgroundColor: '#f7f7f7', borderTopWidth: 1, borderTopColor: '#cccccc', opacity: 0.9
    },
    borderBottom: {
        borderBottomWidth: 1, borderColor: '#c8c7cc'
    },
    radius: {
        borderRadius: 6
    },
    button: {
        backgroundColor: '#44bcbc',
        height: 47,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
})
module.exports = CompCertification;