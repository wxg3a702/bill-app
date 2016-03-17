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
    Modal,
    StyleSheet,
    TouchableOpacity
    } = React;
var {width,height} = Dimensions.get('window');
var Space = require('../../comp/utils/space');
var DateHelper = require('../../comp/utils/dateHelper');
var BottomButton = require('../../comp/utils/bottomButton');
var NavBarView = require('../../framework/system/navBarView');
var BillStates = require('./billStates');
var NumberHelper = require('../../comp/utils/numberHelper')
var BillDetail = React.createClass({
    getInitialState(){
        var item = this.props.param.item;
        return {
            item: item,
            type: item.role == 'payee' ? 'rev' : 'sent'
        }
    },
    func(){

    },
    viewDetail(){

    },
    returnDes(){
        let obj = BillStates[this.state.type][this.state.item.status]
        if (obj.value == 'dateC') {
            return (
                <View style={[styles.margin,styles.center]}>
                    <Text style={{color:obj.color,fontSize:15}}>
                        {DateHelper.formatBillDetail(this.state.item.discountDueDate)}
                    </Text>
                    <Text style={{fontSize:15,color:'#7f7f7f'}}>出票</Text>
                </View>
            )
        } else if (obj.value == 'dateT') {
            return (
                <View style={[styles.margin,styles.center]}>
                    <Text style={{color:obj.color,fontSize:15}}>1</Text>
                    <Text style={{fontSize:15,color:'#7f7f7f'}}>贴现</Text>
                </View>
            )
        } else {
            return (
                <View style={[styles.margin,styles.center]}>
                    <Text style={{color:obj.color,fontSize:15}}>{obj.value}</Text>
                </View>
            )
        }
    },
    returnBottom(){
        let obj = BillStates[this.state.type][this.state.item.status];
        var backColor = obj.button == '撤销申请' ? '#f0f0f0' : '#44bcb2';
        var borderColor = obj.button == '撤销申请' ? '#ff5b58' : '#44bcb2';
        var fontColor = obj.button == '撤销申请' ? '#ff5b58' : 'white';
        var underColor = obj.button == '撤销申请' ? '#cccccc' : '#a6c7f2';
        return (
            <BottomButton func={this.func} backColor={backColor} fontColor={fontColor} borderColor={borderColor}
                          underColor={underColor} content={obj.button}/>
        )
    },
    returnTitle(){
        return (
            <View style={{height:170,backgroundColor:'white',paddingHorizontal:12,paddingTop:12}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',height:18,alignItems:'center'}}>
                    <Text style={{fontSize:12,color:'#7f7f7f'}}>{'票号：' + this.state.item.billNo}</Text>
                    <View
                        style={[{backgroundColor:BillStates[this.state.type][this.state.item.status].color},styles.circle]}>
                        <Text style={{fontSize:11,color:'white'}}>
                            {BillStates[this.state.type][this.state.item.status].desc}
                        </Text>
                    </View>
                </View>
                <View style={{justifyContent:'center',alignItems:'center',marginTop:9}}>
                    <Text style={{fontSize:15,color:'#333333'}}>
                        {BillStates[this.state.type][this.state.item.status].content}
                    </Text>
                </View>
                <View style={[{marginTop:10},styles.center]}>
                    <Text style={{fontSize:42,color:'#44bcb2'}}>
                        {BillStates[this.state.type][this.state.item.status].key == 'amount' ? NumberHelper.number2(this.state.item.amount) : NumberHelper.number2(this.state.item.discountAmount)}
                    </Text>
                    <Text style={{fontSize:15,color:'#7f7f7f',marginTop:17}}>万元</Text>
                </View>
                {this.returnDes()}
            </View>
        )
    },
    returnTitleT(){
        if (this.state.item.role == 'payee' && this.state.item.status != 'NEW') {
            return (
                <TouchableHighlight onPress={this.viewDetail}>
                    {this.returnTitle()}
                </TouchableHighlight>
            )
        } else {
            return (
                <View>
                    {this.returnTitle()}
                </View>
            )
        }
    },
    render(){
        return (
            <NavBarView navigator={this.props.navigator} title="票据详情">
                {this.returnTitleT()}
                <Space height={6} backgroundColor='#f0f0f0'/>
                <View style={{paddingTop:4,backgroundColor:'white',paddingHorizontal:12}}>
                    <View style={{flexDirection:'row',alignItems:'center',paddingVertical:8}}>
                        <Text style={{fontSize:16,color:'#333333',flex:1}}>22</Text>
                        <Text style={{fontSize:16,color:'#333333',width:235}}>33</Text>
                    </View>
                </View>
                <View style={{flex:1}}/>
                {this.returnBottom()}
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
    circle: {
        width: 49, height: 18, borderRadius: 8, justifyContent: 'center', alignItems: 'center'
    },
    center: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    },
    margin: {
        marginTop: Platform.OS === 'ios' ? 25 : 12
    }
})
module.exports = BillDetail;