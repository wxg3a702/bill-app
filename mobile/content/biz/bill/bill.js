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
var NavBarView = require('../../framework/system/navBarView');
var AppStore = require('../../framework/store/appStore');
var numeral = require('numeral');
var dateFormat = require('dateformat');
var Login = require('../login/login');
var BillStore = require('../../framework/store/billStore');
var VIcon = require('../../comp/icon/vIcon')
var BillStates = require('./billStates')
var Validation = require('../../comp/utils/validation')
var ds = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
var Bill = React.createClass({
    getDataSouce(bean, key1, key2, key3){
        let ret = new Array();
        bean.contentList.map((item, index)=> {
            if (item.status == key1 && !key2 && !key3) {
                ret.push(item);
            } else if (item.status == key1 || item.status == key2 || item.status == key3) {
                ret.push(item);
            }
        })
        return ret;
    },
    getStateFromStores(){
        var sentBill = BillStore.getSentBill();
        var revBill = BillStore.getRevBill();
        var token = AppStore.getToken();
        var resPick = [
            {desc: '全部', dataSource: Validation.returnIsNull(revBill, revBill.contentList)},
            {desc: '新票据', dataSource: Validation.returnIsNull(revBill, this.getDataSouce(revBill, 'NEW'))},
            {desc: '已申请', dataSource: Validation.returnIsNull(revBill, this.getDataSouce(revBill, 'REQ'))},
            {desc: '受理中', dataSource: Validation.returnIsNull(revBill, this.getDataSouce(revBill, 'HAN'))},
            {desc: '已贴现', dataSource: Validation.returnIsNull(revBill, this.getDataSouce(revBill, 'DIS'))},
            {desc: '不贴现', dataSource: Validation.returnIsNull(revBill, this.getDataSouce(revBill, 'IGN'))}
        ];
        var sentPick = [
            {desc: '全部', dataSource: Validation.returnIsNull(sentBill, sentBill.contentList)},
            {desc: '已贴现', dataSource: Validation.returnIsNull(sentBill, this.getDataSouce(sentBill, 'DIS'))},
            {desc: '不贴现', dataSource: Validation.returnIsNull(sentBill, this.getDataSouce(sentBill, 'IGN'))},
            {
                desc: '等待中',
                dataSource: Validation.returnIsNull(sentBill, this.getDataSouce(sentBill, 'NEW', 'REQ', 'HAN'))
            },
        ];
        return ({
            token: token,
            checkColor: 'white',
            unCheckColor: '#44bcb2',
            status: '全部',
            direction: 'left',
            modalVisible: false,
            animated: true,
            pick: resPick,
            pickStatus: 'rev',
            backColor: '#f0f0f0',
            contentColor: 'white',
            resPick: resPick,
            sentPick: sentPick,
            dataSource: resPick[0].dataSource
        })
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
    changeRev(){
        this.setState({
            checkColor: 'white',
            unCheckColor: '#44bcb2',
            pick: this.state.resPick,
            pickStatus: 'rev',
            status: '全部',
            dataSource: this.state.resPick[0].dataSource
        })
    },
    changeSend(){
        this.setState({
            checkColor: '#44bcb2',
            unCheckColor: 'white',
            pick: this.state.sentPick,
            pickStatus: 'sent',
            status: '全部',
            dataSource: this.state.sentPick[0].dataSource
        })
    },

    changePick(){
        this.setState({
            direction: 'down',
            modalVisible: true,
            backColor: '#d0d0d0',
            contentColor: '#e0e0e0'
        })
    },
    hidePick(){
        this.setState({
            modalVisible: false,
            backColor: '#f0f0f0',
            direction: 'left',
            contentColor: 'white'
        });
    },
    changePic(data){
        this.setState({
            status: data.desc,
            dataSource: data.dataSource
        })
        this.hidePick()
    },
    returnPick(data){
        return (
            <TouchableOpacity onPress={()=>this.changePic(data)} style={[styles.pickLine,styles.bottomColor]}>
                <Text style={{width:width,fontSize:18}}>{data.desc}</Text>
            </TouchableOpacity>
        )
    },
    returnInfo(role, status, discountDate, discountDueDate){
        if (role == 'drawer') {
            if ((status == 'NEW' || status == 'REQ' || status == 'HAN')) {
                return <Text style={{ color:'#999999'}}>请等待承兑行出票</Text>
            } else if (status == 'IGN') {
                return <Text style={{ color:'#ff5b58'}}>请至承兑行取票</Text>
            } else if (status == 'DIS') {
                return (
                    <View style={{flexDirection:'row'}}>
                        <Text style={{ color:'#44bcb2'}}>{dateFormat(new Date(discountDate), 'yyyy.mm.dd')}</Text>
                        <Text style={{ color:'#999999'}}>贴现</Text>
                    </View>
                )
            }
        } else if (role == 'payee') {
            if (status == 'NEW') {
                return (
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text
                            style={{color:'#ff5b58',fontSize:15}}>{discountDueDate ? dateFormat(new Date(discountDueDate), 'yyyy.mm.dd HH:MM') : "未知日期"}</Text>
                        <Text style={{color:'#333333',fontSize:15}}>出票</Text>
                    </View>
                );
            } else if (status == 'REQ') {
                return <Text style={{color:'#7f7f7f',fontSize:15}}>请等待银行处理</Text>
            } else if (status == 'HAN') {
                return <Text style={{color:'#7f7f7f',fontSize:15}}>请等待银行处理</Text>
            } else if (status == 'DIS') {
                return (
                    <View style={{flexDirection:'row',alignItems: 'center'}}>
                        <Text
                            style={{color:'#43bb80',fontSize:15}}>{dateFormat(new Date(discountDate), 'yyyy.mm.dd')}</Text>
                        <Text style={{color:'#7f7f7f',fontSize:15}}>贴现</Text>
                    </View>
                );
            } else if (status == 'IGN') {
                return <Text style={{ color:'#7f7f7f',fontSize:15}}>请等待交易方取票</Text>
            }
        }
    },
    renderRow(data){
        return (
            <View style={{backgroundColor:this.state.contentColor,marginTop:5,height:172,paddingLeft:6}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',paddingTop:5}}>
                    <View style={[{height:131}]}>
                        <Text style={{fontSize:11,color:'#7f7f7f',marginTop:15}}>票面金额</Text>
                        <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
                            <Text
                                style={{fontSize:28,color:'#44bcb2'}}>{numeral(data.amount / 10000).format('0,0.00')}</Text>
                            <Text style={{fontSize:15,color:'#7f7f7f',marginTop:8}}>万元</Text>
                        </View>
                        <Text style={{fontSize:11,color:'#7f7f7f',marginTop:20}}>开票人</Text>
                        <Text numberOfLines={1}
                              style={{width:width-170,color:'#7f7f7f',fontSize:15,marginTop:10}}>{data.payeeName}</Text>
                    </View>
                    <Image source={BillStates[this.state.pickStatus][data.status].pic} style={{width:31,height:116}}/>
                </View>
                <View
                    style={[{flexDirection:'row',justifyContent:'space-between',alignItems:'center',height:36,paddingRight:16},styles.topColor]}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Image style={{width:13,height:13,marginRight:2}}
                               source={require('../../image/bill/desc.png')}/>
                        {this.returnInfo(data.role, data.status, data.discountDate, data.discountDueDate)}
                    </View>
                    <Text style={{color:'#333333',fontSize:15}}>
                        {'~' + dateFormat(new Date(data.dueDate), 'yyyy.mm.dd') + ' 到期'}
                    </Text>
                </View>
            </View>
        )
    },
    render(){
        return (
            <NavBarView navigator={this.props.navigator} showBar={false} contentBackgroundColor={this.state.backColor}>
                <Modal animated={this.state.animated} transparent={true}
                       visible={this.state.modalVisible}>
                    <TouchableOpacity onPress={this.hidePick} style={{flex:1}}>
                        <View/>
                    </TouchableOpacity>
                    <View style={{position:'absolute',left:0,top:96,}}>
                        <ListView dataSource={ds.cloneWithRows(this.state.pick)} renderRow={this.returnPick}/>
                    </View>
                </Modal>
                <View style={{backgroundColor:'#f0f0f0'}}>
                    <View style={[styles.comStyle]}>
                        <TouchableOpacity onPress={this.changeRev} activeOpacity={0.9}>
                            <View
                                style={[styles.titleView,{backgroundColor:this.state.unCheckColor},styles.leftRadius]}>
                                <Text style={[styles.title,{color:this.state.checkColor}]}>收到的票</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.changeSend} activeOpacity={0.9}>
                            <View style={[styles.titleView,{backgroundColor:this.state.checkColor},styles.rightRadius]}>
                                <Text style={[styles.title,{color:this.state.unCheckColor}]}>开出的票</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={this.changePick} activeOpacity={0.8}>
                        <View style={[styles.pickTitle,styles.bottomColor]}>
                            <Text style={{fontSize:15,color:'#333333'}}>{this.state.status}</Text>
                            <VIcon direction={this.state.direction} size={22}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <ListView dataSource={ds.cloneWithRows(this.state.dataSource)} renderRow={this.renderRow}
                          automaticallyAdjustContentInsets={false} style={{paddingHorizontal:5}}/>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
    comStyle: {
        height: (Platform.OS === 'ios') ? 64 : 44,
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    title: {
        fontSize: 16, color: '#44bcb2',
    },
    leftRadius: {
        borderBottomLeftRadius: 4, borderTopLeftRadius: 4
    },
    rightRadius: {
        borderBottomRightRadius: 4, borderTopRightRadius: 4
    },
    titleView: {
        width: 80, height: 29, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#44bcb2'
    },
    pickTitle: {
        height: 32,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bottomColor: {
        borderBottomWidth: 1, borderColor: '#c8c8c8'
    },
    topColor: {
        borderTopWidth: 1, borderColor: '#c8c8c8'
    },
    pickLine: {
        backgroundColor: '#e6e6e6', justifyContent: 'center', height: 50, paddingLeft: 10,
    }
})
module.exports = Bill;
