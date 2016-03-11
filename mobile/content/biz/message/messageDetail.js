'use strict';

var React = require('react-native');
var {
    TouchableHighlight,
    Text,
    View,
    ListView,
    StyleSheet,
    Dimensions
    } = React;
var AppStore = require('../../framework/store/appStore');
var MessageAction = require("../../framework/action/messageAction");
var _ = require('lodash');
var NavBarView = require('../../framework/system/navBarView');
var MessageGroupType = require('../../constants/messageGroupType');
var Detail = require('../bill/billDetail');
var DateHelper = require("../../comp/utils/dateHelper");
var Alert = require('../../comp/utils/alert');
var VIcon = require('../../comp/icon/vIcon')
var ds = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
var MessageDetail = React.createClass({
    getStateFromStores() {
        var results = AppStore.getResult(this.props.param.name);
        return {
            dataSource: ds.cloneWithRows(results),
            renderList: this.renderLists,
            result: results
        }
    },
    componentDidMount() {
        this.fetchData();
        MessageAction.clearMessageDetail(MessageGroupType[this.props.param.name]);
        AppStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        AppStore.removeChangeListener(this._onChange);
    },
    _onChange: function () {
        this.setState(this.getStateFromStores());
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    fetchData: function () {
        this.setState({
            dataSource: ds.cloneWithRows(this.state.result)
        });
    },
    render(){
        return (
            <NavBarView navigator={this.props.navigator} title={this.props.param.title}
                        contentBackgroundColor='#f0f0f0'>
                <ListView dataSource={this.state.dataSource} renderRow={this.state.renderList}
                          automaticallyAdjustContentInsets={false}/>

            </NavBarView>
        )
    },

    toOther(item){
        let billId = item.billId;
        if (billId == null || billId == undefined) {
            return;
        }
        let bill = AppStore.getSentBillDetail(billId);
        if (_.isEmpty(bill)) {
            Alert('票据信息不存在');
        } else {
            this.props.navigator.push({
                param: {title: '详情', record: bill},
                comp: Detail
            });
        }
    },
    renderLists: function (item) {
        var {width,height} = Dimensions.get('window');
        return (
            <View
                style={{marginTop:5,flexDirection:'column',flex:1,backgroundColor:'white',borderBottomWidth: 0.5,borderColor: '#c8c7cc'}}>
                <TouchableHighlight underlayColor={'#cccccc'} onPress={()=>this.toOther(item)}>
                    <View>
                        <View style={{flexDirection:'row',justifyContent:'space-between',padding:12}}>
                            <Text numberOfLines={1}
                                  style={{width:width-100,fontSize:16,color:'#333333'}}>{item.title}</Text>
                            <Text
                                style={{fontSize:11,color:'#7f7f7f'}}>{DateHelper.descDate(new Date(item.receiveDate))}</Text>
                        </View>
                        <Text style={{fontSize:14,color:'#7f7f7f',flex:1,paddingHorizontal:12}}>{item.content}</Text>
                        <View
                            style={{marginTop:10,marginHorizontal:10,borderBottomWidth: 0.5, borderColor: '#c8c7cc'}}></View>
                        <View
                            style={{height:40,flexDirection:'row',paddingHorizontal:12,alignItems:'center',justifyContent:'space-between'}}>
                            <Text style={{fontSize:14,color:'#7f7f7f'}}>查看详情</Text>
                            <VIcon/>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }

})
var styles = StyleSheet.create({})
module.exports = MessageDetail;