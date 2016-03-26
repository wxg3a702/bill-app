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
    StyleSheet,
    TouchableOpacity,
    InteractionManager
    } = React;
var Demo = require('./demo')
var Adjust = require('../../comp/utils/adjust')
var ListBottom = require('../../comp/utilsUi/listBottom')
var {width,height} = Dimensions.get('window');
var NavBarView = require('../../framework/system/navBarView');
var AppStore = require('../../framework/store/appStore');
var NumberHelper = require('../../comp/utils/numberHelper')
var DateHelper = require('../../comp/utils/dateHelper');
var ToLogin = require('../../comp/utilsUi/toLogin');
var Login = require('../login/login')
var UserStore = require('../../framework/store/userStore');
var BillStore = require('../../framework/store/billStore');
var BillAction = require('../../framework/action/billAction');
var BillDetail = require('./billDetail')
var VIcon = require('../../comp/icon/vIcon')
var BillStates = require('./../../constants/billStates')
var Validation = require('../../comp/utils/validation')
var ds = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});

var GiftedListView = require('../../comp/listView/GiftedListView');
const PAGE_SIZE = 5;

var Bill = React.createClass({
    getDataSouce(bean, key1, key2, key3){
        if (!bean) {
            return ''
        } else {
            let ret = new Array();
            bean.contentList.map((item, index)=> {
                if (item.status == key1 && !key2 && !key3) {
                    ret.push(item);
                } else if (item.status == key1 || item.status == key2 || item.status == key3) {
                    ret.push(item);
                }
            })
            return ret;
        }
    },
    getStateFromStores(){
        var sentBill = BillStore.getSentBill();
        var revBill = BillStore.getRevBill();
        var token = AppStore.getToken();
        var resPick = [
            {desc: '全部', dataSource: Validation.returnIsNull(revBill, !revBill ? '' : revBill.contentList)},
            {desc: '新票据', dataSource: Validation.returnIsNull(revBill, this.getDataSouce(revBill, 'NEW'))},
            {desc: '已申请', dataSource: Validation.returnIsNull(revBill, this.getDataSouce(revBill, 'REQ'))},
            {desc: '受理中', dataSource: Validation.returnIsNull(revBill, this.getDataSouce(revBill, 'HAN'))},
            {desc: '已贴现', dataSource: Validation.returnIsNull(revBill, this.getDataSouce(revBill, 'DIS'))},
            {desc: '不贴现', dataSource: Validation.returnIsNull(revBill, this.getDataSouce(revBill, 'IGN'))}
        ];
        var sentPick = [
            {desc: '全部', dataSource: Validation.returnIsNull(sentBill, !sentBill ? '' : sentBill.contentList)},
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
            pick: resPick,
            pickStatus: 'rev',
            backColor: '#f0f0f0',
            contentColor: 'white',
            resPick: resPick,
            sentPick: sentPick,
            opacity: 0,
            dataSource: !token ? '' : resPick[0].dataSource
        })
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    componentDidMount() {
        AppStore.addChangeListener(this._onChange);
        var obj = BillStore.getDemoFlag();
        if ((obj == undefined || obj.flag != true || (obj.id != UserStore.getUserId())) && (this.state.db != undefined && this.state.db.length > 0)) {
            this.props.navigator.push({comp: Demo});
            BillAction.setDemoFlag();
        }
    },

    componentWillUnmount: function () {
        AppStore.removeChangeListener(this._onChange);
    },
    _onChange: function () {
        this.setState(this.getStateFromStores());
    },
    changeRev(){
        Promise.resolve(
            this.setState({
                checkColor: 'white',
                unCheckColor: '#44bcb2',
                pick: this.state.resPick,
                pickStatus: 'rev',
                status: '全部',
                dataSource: this.state.resPick[0].dataSource
            })
            )
            .then(
                !this.state.token ? '' : this.refs.BillList._refresh()
            )
    },
    changeSend(){
        Promise.resolve(
            this.setState({
                checkColor: '#44bcb2',
                unCheckColor: 'white',
                pick: this.state.sentPick,
                pickStatus: 'sent',
                status: '全部',
                dataSource: this.state.sentPick[0].dataSource
            })
        ).then(
            !this.state.token ? '' : this.refs.BillList._refresh()
        )
    },
    changePick(){
        this.setState({
            direction: 'down',
            backColor: '#d0d0d0',
            contentColor: '#e0e0e0',
            opacity: 1
        })
    },
    hidePick(){
        this.setState({
            backColor: '#f0f0f0',
            direction: 'left',
            contentColor: 'white',
            opacity: 0
        });
    },
    changePic(data){
        Promise.resolve(
            this.setState({
                status: data.desc,
                dataSource: !this.state.token ? '' : data.dataSource,
            })
        ).then(
            this.hidePick()
        ).then(
            !this.state.token ? '' : this.refs.BillList._refresh()
        )
    },
    returnPick(data){
        if (!this.state.opacity) {
            return (
                <View style={[styles.pickLine,styles.bottomColor]}>
                    <Text style={{width:width,fontSize:18}}>{data.desc}</Text>
                </View>
            )
        } else {
            return (
                <TouchableHighlight underlayColor='#cccccc' onPress={()=>this.changePic(data)}
                                    style={[styles.pickLine,styles.bottomColor]}>
                    <Text style={{width:width,fontSize:18}}>{data.desc}</Text>
                </TouchableHighlight>
            )
        }
    },
    returnInfo(role, status, discountDate, discountDueDate){
        if (role == 'drawer') {
            if ((status == 'NEW' || status == 'REQ' || status == 'HAN')) {
                return <Text style={{color:'#999999'}}>请等待承兑行出票</Text>
            } else if (status == 'IGN') {
                return <Text style={{color:'#ff5b58'}}>请至承兑行取票</Text>
            } else if (status == 'DIS') {
                return (
                    <View style={{flexDirection:'row'}}>
                        <Text style={{color:'#44bcb2'}}>{DateHelper.formatBillList(discountDate)}</Text>
                        <Text style={{color:'#999999'}}>贴现</Text>
                    </View>
                )
            }
        } else if (role == 'payee') {
            if (status == 'NEW') {
                return (
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text
                            style={{color:'#ff5b58',fontSize:15}}>{discountDueDate ? DateHelper.formatBillList(discountDueDate) : "未知日期"}</Text>
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
                            style={{color:'#43bb80',fontSize:15}}>{DateHelper.formatBillList(discountDate)}</Text>
                        <Text style={{color:'#7f7f7f',fontSize:15}}>贴现</Text>
                    </View>
                );
            } else if (status == 'IGN') {
                return <Text style={{ color:'#7f7f7f',fontSize:15}}>请等待交易方取票</Text>
            }
        }
    },
    toOther(name, item) {
        this.props.navigator.push({
            comp: name,
            param: {
                item: item
            }
        });
    },
    hasBill(){
        if (!this.state.token) {
            return (
                <ToLogin func={()=>this.toOther(Login)} mar={true}/>
            )
        } else {
            return (
                <GiftedListView
                    ref="BillList"
                    rowView={this._renderRowView}
                    onFetch={this._onFetch}
                    emptyView={this._emptyView}
                    firstLoader={true} // display a loader for the first fetching
                    pagination={true} // enable infinite scrolling using touch to load more
                    refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
                    withSections={false} // enable sections
                />
            );

        }
    },
    _emptyView() {
        return (
            <View style={{marginTop:65,alignItems:'center',flex:1}}>
                <Image style={{width:Adjust.width(350),height:200}} resizeMode="stretch"
                       source={require('../../image/bill/noBill.png')}/>
                <Text style={{marginTop:20,fontSize:16,color:'#7f7f7f'}}>暂时没有票据信息</Text>
            </View>
        );
    },

    _onFetch(page = 1, callback, options) {
        setTimeout(() => {
            Promise.resolve().then(
                InteractionManager.runAfterInteractions(
                    ()=> this._fetchData(page - 1, callback, options)
                )
            );
        }, 300)
    },

    _fetchData: function (page, callback, options) {
        var rows = [];
        var end = (page + 1) * PAGE_SIZE;
        var length = this.state.dataSource.length;
        if (length <= end) {
            rows = this.state.dataSource.slice(page * PAGE_SIZE);
            callback(rows, {
                allLoaded: true // the end of the list is reached
            });
        } else {
            rows = this.state.dataSource.slice(page * PAGE_SIZE, end);
            callback(rows);
        }
    },

    _renderRowView(rowData) {
        return (
            <TouchableHighlight onPress={() => this.toOther(BillDetail,rowData)} activeOpacity={0.8}
                                underlayColor='#ebf1f2'>
                <View style={[{backgroundColor:this.state.contentColor},styles.content]}>
                    <View
                        style={{flexDirection:'row',justifyContent:'space-between',paddingTop:5,height:Platform.OS === 'ios'?136:146}}>
                        <View style={[{height:131}]}>
                            <Text style={{fontSize:11,color:'#7f7f7f',marginTop:12}}>票面金额</Text>
                            <View style={{flexDirection:'row',alignItems:'center',marginTop:10}}>
                                <Text style={{fontSize:28,color:'#44bcb2'}}>
                                    {NumberHelper.number2(rowData.amount)}
                                </Text>
                                <Text style={{fontSize:15,color:'#7f7f7f',marginTop:8}}>万元</Text>
                            </View>
                            <Text
                                style={{fontSize:11,color:'#7f7f7f',marginTop:10}}>{rowData.role == 'payee' ? '开票人' : '收款人'}</Text>
                            <Text numberOfLines={1}
                                  style={{width:width-Adjust.width(170),color:'#7f7f7f',fontSize:15,marginTop:10}}>
                                {this.state.pick == this.state.resPick ? rowData.drawerName : rowData.payeeName}
                            </Text>
                        </View>
                        <Image source={BillStates[this.state.pickStatus][rowData.status].pic}
                               style={{width:31,height:116}}/>
                    </View>
                    <View style={[styles.contentBottom,styles.topColor]}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Image style={{width:13,height:13,marginRight:2}}
                                   source={require('../../image/bill/desc.png')}/>
                            {this.returnInfo(rowData.role, rowData.status, rowData.discountDate, rowData.discountDueDate)}
                        </View>
                        <Text style={{color:'#333333',fontSize:15}}>
                            {'~' + DateHelper.formatBillList(rowData.dueDate) + ' 到期'}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        );

    },

    returnView(){
        if (!this.state.opacity) {
            return (
                <View/>
            )
        } else {
            return (
                <View style={[styles.position,{opacity:this.state.opacity}]}>
                    <TouchableOpacity onPress={this.hidePick} style={{height:Platform.OS === 'ios' ?96 : 76}}>
                        <View/>
                    </TouchableOpacity>
                    <ListView dataSource={ds.cloneWithRows(this.state.pick)} renderRow={this.returnPick}/>
                    <TouchableOpacity onPress={this.hidePick} style={{flex:1}}>
                        <View/>
                    </TouchableOpacity>
                </View>
            )
        }
    },
    render(){
        return (
            <NavBarView navigator={this.props.navigator} showBar={false} contentBackgroundColor={this.state.backColor}>
                <View style={{backgroundColor:'#f0f0f0'}}>
                    <View style={[styles.comStyle]}>
                        <TouchableOpacity onPress={this.changeRev} activeOpacity={0.9}>
                            <View
                                style={[styles.titleView,styles.leftRadius,{backgroundColor:this.state.unCheckColor}]}>
                                <Text style={[styles.title,{color:this.state.checkColor}]}>收到的票</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.changeSend} activeOpacity={0.9}>
                            <View style={[styles.titleView,styles.rightRadius,{backgroundColor:this.state.checkColor}]}>
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
                {this.hasBill()}
                {this.returnView()}
                <ListBottom/>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
    comStyle: {
        height: (Platform.OS === 'ios') ? 64 : 44,
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        justifyContent: 'center', alignItems: 'center', flexDirection: 'row'
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
        height: 32, paddingHorizontal: 10,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    bottomColor: {
        borderBottomWidth: 1, borderColor: '#c8c8c8'
    },
    topColor: {
        borderTopWidth: 1, borderColor: '#c8c8c8'
    },
    pickLine: {
        backgroundColor: '#e6e6e6', justifyContent: 'center', height: 40, paddingLeft: 10,
    },
    contentBottom: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 36, paddingRight: 16
    },
    content: {
        marginTop: 5, paddingLeft: 6, borderWidth: 1, borderColor: '#c8c8c8',
        height: Platform.OS === 'ios' ? 172 : 182,
    },
    position: {
        position: 'absolute',
        left: 0, top: 0, width: width, height: height
    }
})
module.exports = Bill;
