'use strict';

var React = require('react-native');
var {
    StyleSheet,
    TouchableHighlight,
    Text,
    Dimensions,
    View,
    ListView,
    PanResponder
    } = React;
var Adjust=require('../../comp/utils/adjust')
var CompCertifyCopies = require('./compCertifyCopies');
var {height, width} = Dimensions.get('window');
var Space = require('../../comp/utilsUi/space')
var BottomButton = require('../../comp/utilsUi/bottomButton')
var VIcon = require('../../comp/icon/vIcon')
var AppStore = require('../../framework/store/appStore');
var CompStore = require('../../framework/store/compStore');
var CompAction = require("../../framework/action/compAction")
var NavBarView = require('../../framework/system/navBarView')
var certificateState = require('../../constants/certificateState');
var Swipeout = require('react-native-swipeout')
var Alert = require('../../comp/utils/alert');
var ds = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
var ret = new Array();
var Button = require('../../comp/utilsUi/button')
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
        let i = 0;
        var orgBean = CompStore.getOrgBeans()[0];
        res.map((item, index)=> {
            if (!item.name) {
                item.name = '认证企业信息' + ++i

            }
            ret.push(item)
        });
        return {
            bean: orgBean,
            dataSource: ds.cloneWithRows(ret)
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
    toOther(name){
        this.props.navigator.push({comp: name})
    },

    returnRow(data){
        var swipeoutBtns = [
            {
                text: '删除',
                backgroundColor:'red',
                onPress(){

                }
            }
        ]
        return (
            <Swipeout right={swipeoutBtns}>
                <TouchableHighlight onPress={()=>this.toOther()}>

                    <View style={styles.item} removeClippedSubviews={true}>
                        <View style={{width:width,flexDirection:'row',alignItems:'center'}}>
                            <Text style={{width:width-Adjust.width(90)}}>{data.name}</Text>
                            <Text style={{width:Adjust.width(50),color:certificateState[data.state].color,}}>{certificateState[data.state].desc}</Text>
                            <VIcon/>
                        </View>
                    </View>

                </TouchableHighlight>
            </Swipeout>
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
                <View style={{flex: 1}}>
                    {this.returnList()}
                </View>
                <BottomButton func={()=>this.toOther(CompCertifyCopies)} content="新增企业信息"/>
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
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        height: 50,
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: '#c8c7cc',
        width: width,
    }
})
module.exports = CompCertification;