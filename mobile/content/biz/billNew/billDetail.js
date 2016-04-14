'use strict';

var React = require('react-native');
var {
    ListView,
    TouchableHighlight,
    Text,
    View,
    Platform,
    ScrollView,
    Dimensions,
    StyleSheet,
    } = React;

var _ = require('lodash');
var Adjust = require('../../comp/utils/adjust')
var Circle = require('./../../comp/utilsUi/circle')
var BillAction = require("../../framework/action/billAction");
var {width,height} = Dimensions.get('window');
var Space = require('../../comp/utilsUi/space');
var DateHelper = require('../../comp/utils/dateHelper');
var BottomButton = require('../../comp/utilsUi/bottomButton');
var NavBarView = require('../../framework/system/navBarView');
var BillStates = require('./../../constants/billStates');
var BillContent = require('./billContent')
var BillStore = require('../../framework/store/billStore')
var NumberHelper = require('../../comp/utils/numberHelper')
var ApplyDis = require('./applyDiscount')
var Alert = require('../../comp/utils/alert')
var AppStore = require('../../framework/store/appStore');

var ds = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});

var BillDetail = React.createClass({
    getStateFromStores(){
        let id = this.props.param.item.billId
        let item = BillStore.getBill(id)
        //let item = this.props.param.item;
        let flow = item.billStatusTraceBeans;
        if (!flow) {
            flow = ''
        } else {
            flow[0].new = true
        }
        //if (!flow) {
        //    flow = ''
        //} else {
        //    if (!item.new) {
        //        flow[flow.length - 1].new = true;
        //        flow = _(flow).reverse().value();
        //        item.new = true;
        //    }
        //}
        return {
            item: item,
            type: item.role == 'payee' ? 'rev' : 'sent',
            dataSource: flow
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
    func(key){
        const {navigator}=this.props
        let item = this.state.item;
        if (key == 'back') {
            navigator.pop()
        } else if (key == 'tie') {
            navigator.push({
                comp: ApplyDis,
                param: {
                    billBean: this.state.item
                }
            })
        } else if (key == 'che') {
            Alert("确认撤销贴现申请吗？",
                ()=>BillAction.cancleBillDiscount(
                    {
                        billId: this.state.item.billId
                    },
                    function () {
                        Alert("撤销成功!", ()=>this.goBack());
                    }.bind(this),
                    function () {
                    }
                ), function () {
                }
            )
        }
    },

    goBack:function(){
      this.props.navigator.pop();
    },

    viewDetail(){
        this.props.navigator.push({
            comp: BillContent,
            param: {
                item: this.state.item
            }
        })
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
                    <Text style={{color:obj.color,fontSize:15}}>{DateHelper.formatBillDetail(this.state.item.discountDueDate)}</Text>
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
            <BottomButton func={()=>this.func(obj.go)} backColor={backColor} fontColor={fontColor}
                          borderColor={borderColor} underColor={underColor} content={obj.button}/>
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
    returnTitleTouchable(){
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
    returnItem(desc, value){
        return (
            <View style={{flexDirection:'row',alignItems:'center',paddingVertical:8}}>

                <Text style={{fontSize:16,color:'#333333',flex:1}}>
                    {desc}
                </Text>

                <Text style={{fontSize:16,color:'#7f7f7f',width:Adjust.width(235)}}
                      numberOfLines={2}
                >
                    {value}
                </Text>

            </View>
        )
    },
    returnItemReference(desc, value){
        return (
            <View style={{flexDirection:'row',alignItems:'center',paddingVertical:8}}>
                <Text style={{fontSize:16,color:'#333333',width:width-Adjust.width(259)}}>{desc}</Text>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={{fontSize:16,color:'#7f7f7f'}}>{value}</Text>
                    <Text style={{fontSize:18,color:'#ff5b58'}}>(参考)</Text>
                </View>
            </View>
        )
    },
    isNeedDetail(){
        let item = this.state.item;
        if (item.role == "payee" && item.status != "NEW") {
            if (item.status == 'REQ' || item.status == 'HAN') {
                return (
                    <View style={styles.layout}>
                        {this.returnItemReference('起  息  日：', DateHelper.formatBillContent(item.dueDate))}
                        {this.returnItem('贴  现  行：', item.discountBankName)}
                        {this.returnItem('贴现利率：', NumberHelper.formatRate(item.discountRate))}
                        {this.returnItem('收款账号：', NumberHelper.formatNum(item.payeeBankAccountNo, 3, 2))}
                    </View>
                )
            } else if (item.status == 'DIS') {
                return (
                    <View style={styles.layout}>
                        {this.returnItem('起  息  日：', DateHelper.formatBillContent(item.dueDate))}
                        {this.returnItem('贴  现  行：', item.discountBankName)}
                        {this.returnItem('贴现利率：', NumberHelper.formatRate(item.discountRate))}
                        {this.returnItem('收款账号：', NumberHelper.formatNum(item.payeeBankAccountNo, 3, 2))}
                    </View>
                )
            } else if (item.status == 'IGN') {

            }
        } else {
            return (
                <BillContent param={item} needTitle={false}/>
            )
        }
    },
    renderRow(data){
        return (
            <Circle now={data.new} content={data.traceMsg} date={DateHelper.formatFlow(data.createDate)}/>
        )
    },
    returnFlow(){
        let item = this.state.item;
        if (item.role == "payee" && item.status != "NEW") {
            return (
                <View style={{backgroundColor:'white',paddingVertical:8,paddingHorizontal:12}}>
                    <View style={{borderBottomColor:'#f0f0f0',borderBottomWidth:1,paddingBottom:12}}>
                        <Text>票据状态追踪</Text>
                    </View>
                    <View style={{height:12}}/>
                    <ListView dataSource={ds.cloneWithRows(this.state.dataSource)} renderRow={this.renderRow}/>
                </View>
            )
        }
    },
    isNeedSpace(){
        let item = this.state.item;
        if (item.role == "payee" && (item.status == 'REQ' || item.status == 'HAN') || item.status == 'DIS') {
            return (
                <Space height={6} backgroundColor='#f0f0f0' top={false}/>
            )
        } else {

        }

    },
    render(){
        return (
            <NavBarView navigator={this.props.navigator} title="票据详情">
                <ScrollView>
                    {this.returnTitleTouchable()}
                    <Space height={6} backgroundColor='#f0f0f0'/>
                    {this.isNeedDetail()}
                    {this.isNeedSpace()}
                    {this.returnFlow()}
                </ScrollView>
                {this.returnBottom()}
            </NavBarView>
        )
    }
});

var styles = StyleSheet.create({
    circle: {
        width: Adjust.width(49), height: 18, borderRadius: 8, justifyContent: 'center', alignItems: 'center'
    },
    center: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    },
    margin: {
        marginTop: Platform.OS === 'ios' ? 25 : 12
    },
    layout: {
        paddingTop: 4, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#c8c8c8', paddingHorizontal: 12
    }
});

module.exports = BillDetail;