'use strict';

var React = require('react-native');
var {
    ListView,
    TouchableHighlight,
    Text,
    View,
    SegmentedControlIOS,
    Dimensions,
    Image,
    Platform,
    Animated
    }=React
var Detail = require('./billDetail');
var _ = require('lodash');
var StatusIcon = require('./statusIcon');
var PayeeDesc = require('./payeeDesc');
var DrawerDesc = require('./drawerDesc');
const DropDown = require('../../comp/dropDown/dropDown');
var NavBarView = require('../../framework/system/navBarView');
var AppStore = require('../../framework/store/appStore');
var numeral = require('numeral');
var dateFormat = require('dateformat');
var window = Dimensions.get('window');
var Demo = require('../bill/demo');

var Alert = require('../../comp/utils/alert');
var Login = require('../login/login');
var BillStore = require('../../framework/store/billStore');
var UserStore = require('../../framework/store/userStore');
var BillAction = require('../../framework/action/billAction');

const {
    Select,
    Option,
    OptionList,
    updatePosition
    } = DropDown;

var ds = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});

var BillList = React.createClass({
    getStateFromStores() {
        var token = AppStore.getToken();
        if (!token) {
            return {
                token: token,
            }
        }else{
            var contentlist, fuc = this.renderRec
            var flag;
            if (!this.state || !this.state.flag) {
                flag = 0;
            } else {
                flag = this.state.flag;
            }
            if (flag == 1) {
                contentlist = BillStore.getBillSentViewItems("");
            } else {
                contentlist = BillStore.getBillRevViewItems("");
            }
            if (this.state && this.state.flag == 1) {
                fuc = this.renderSend;
            }
            return {
                token: token,
                flag: flag,
                renderFuc: fuc,
                dataSource: ds.cloneWithRows(contentlist),
                db: contentlist,
                filterValue: '全部',
                fadeAnim: new Animated.Value(0),
                left: new Animated.Value(0)
            }

        }

    },
    getInitialState: function () {
        return this.getStateFromStores();

    },
    componentDidMount() {
        if(!AppStore.getToken()){

        }else{
            updatePosition(this.refs['SELECT1']);
            updatePosition(this.refs['OPTIONLIST']);
            this.showView();
        }
        AppStore.addChangeListener(this._onChange);

        //var obj = BillStore.getDemoFlag();
        //if ((obj == undefined || obj.flag != true || (obj.id != UserStore.getUserId())) && (this.state.db != undefined && this.state.db.length > 0)) {
        //    //Alert("是否需要引导?",  () => this.toOther(), (text) => console.log('OK pressed'));
        //    this.toOther();
        //    BillAction.setDemoFlag();
        //}
    },

    componentWillUnmount: function () {
        AppStore.removeChangeListener(this._onChange);
    },
    _onChange: function () {
        this.setState(this.getStateFromStores());
        this.showView();
    },
    toLogin(){
        this.props.navigator.push({comp: Login})
    },
    render: function () {
        var {height, width} = Dimensions.get('window');
        if (this.state.token == null) {
            return (
                <NavBarView navigator={this.props.navigator} showBack={false} title="票据"
                            contentBackgroundColor='#f0f0f0'>
                    <View style={{flexDirection:'row',justifyContent:'space-between',padding:8}}>
                        <Text>你还没有登陆</Text>
                        <TouchableHighlight onPress={this.toLogin}>
                            <Text>点击去登陆</Text>
                        </TouchableHighlight>
                    </View>
                </NavBarView>
            )
        } else {
            return (
                <NavBarView navigator={this.props.navigator} showBar={false}>
                    {this.renderSeg()}
                    {(()=> {
                        if (this.state.flag == 0) {
                            return (
                                <Select
                                    style={{ alignSelf:'center'}}
                                    width={width}
                                    ref="SELECT1"
                                    optionListRef={this._getOptionList}
                                    defaultValue={this.state.filterValue}
                                    onSelect={this._canada}>
                                    <Option>全部</Option>
                                    <Option>新票据</Option>
                                    <Option>已申请</Option>
                                    <Option>受理中</Option>
                                    <Option>已贴现</Option>
                                    <Option>不贴现</Option>
                                </Select>);
                        } else {
                            return (
                                <Select
                                    style={{ alignSelf:'center'}}
                                    width={width}
                                    ref="SELECT1"
                                    optionListRef={this._getOptionList}
                                    defaultValue={this.state.filterValue}
                                    onSelect={this._canada}>
                                    <Option>全部</Option>
                                    <Option>等待中</Option>
                                    <Option>已贴现</Option>
                                    <Option>不贴现</Option>
                                </Select>);
                        }

                    })()}
                    <View style={{ flex: 1,backgroundColor: '#f0f0f0'}}>
                        {(()=> {
                            if (!_.isEmpty(this.state.db) && this.state.db.length > 0) {
                                return (
                                    <ListView
                                        dataSource={this.state.dataSource}
                                        renderRow={this.state.renderFuc}
                                        automaticallyAdjustContentInsets={false}
                                        style={{backgroundColor: '#f0f0f0' ,width:width}}/>
                                );
                            }
                            else {
                                return (
                                    <View style={{marginTop:65,flexDirection:'column',alignItems:'center'}}>
                                        <Image style={{width:350,height:200}} resizeMode="stretch"
                                               source={require('../../image/bill/noBill.png')}/>
                                        <Text style={{marginTop:20,fontSize:16,color:'#7f7f7f'}}>暂时没有票据信息</Text>
                                    </View>
                                );
                            }
                        })()}

                    </View>

                    <OptionList ref="OPTIONLIST" height={this.state.flag==0?72:48}/>
                </NavBarView>
            );
        }
    },
    renderSeg: function () {
        if (Platform.OS === 'ios') {
            return (
                <SegmentedControlIOS onValueChange={this.changeRenderFuc} values={this.props.segctldata}
                                     selectedIndex={this.state.flag}
                                     style={{ alignSelf:'center',width:200,marginTop:30, height:30}}
                                     tintColor={'#44bcb2'}/>
            );
        } else {
            return (
                <View>
                    <Text>android</Text>
                </View>
            );
        }
    },
    getDefaultProps: function () {
        return {
            segctldata: ['收到的票', '开出的票'],
            recOption: ['全部', '新票据', '已申请', '受理中', '已贴现', '不贴现'],
            sendOption: ['全部', '等待中', '已贴现', '不贴现']
        };
    },
    changeRenderFuc: function (value) {

        if (value == this.props.segctldata[0]) {
            this.setState({flag: 0, renderFuc: this.renderRec, filterValue: '全部', status: ''});
        } else {
            this.setState({flag: 1, renderFuc: this.renderSend, filterValue: '全部', status: ''});
        }
        this.flushPage();

    },
    flushPage: function () {
        this.hiddenView();
        var contentlist;
        if (this.state.flag == 0) {
            contentlist = BillStore.getBillRevViewItems(this.state.status);
        } else {
            contentlist = BillStore.getBillSentViewItems(this.state.status);
        }
        this.setState({dataSource: this.state.dataSource.cloneWithRows(contentlist), db: contentlist});
        this.showView();
    },
    hiddenView: function () {
        //Animated.parallel([
        //    Animated.timing(this.state.left, {toValue: 400, duration: 600})
        //
        //]).start();
    },
    showView: function () {
        Animated.sequence([
            Animated.timing(          // Uses easing functions
                this.state.fadeAnim,    // The value to drive
                {toValue: 0, duration: 0}          // Configuration
            ),
            Animated.timing(this.state.left, {toValue: window.width, duration: 0}),
            Animated.timing(          // Uses easing functions
                this.state.fadeAnim,    // The value to drive
                {toValue: 1, duration: 0}          // Configuration
            ),
            Animated.timing(this.state.left, {toValue: 0, duration: 200})
        ]).start();
    },
    _getOptionList() {
        return this.refs['OPTIONLIST'];
    },
    _canada(province) {
        this.state.filterValue = province;
        switch (province) {
            case "全部":
                this.setState({status: ""});
                break;
            case "新票据":
                this.setState({status: "NEW"});
                break;
            case "已申请":
                this.setState({status: "REQ"});
                break;
            case "受理中":
                this.setState({status: "HAN"});
                break;
            case "已贴现":
                this.setState({status: "DIS"});
                break;
            case "不贴现":
                this.setState({status: "IGN"});
                break;
            case "等待中":
                this.setState({status: "WAT"});
                break;
        }
        this.flushPage();

    },
    //开出的票据
    renderSend: function (item) {
        var {height, width} = Dimensions.get('window');
        return (
            <TouchableHighlight onPress={() => this.selectTeam(item)} activeOpacity={0.8} underlayColor='#f0f0f0'>
                <View
                    style={{backgroundColor:'#ffffff',borderWidth: 1,marginHorizontal:5,marginTop:5,borderColor:'#dfdfdf',height:171}}>
                    <View style={{flex: 1,flexDirection: 'row',justifyContent: 'space-between',height:136}}>
                        <View style={{flexDirection: 'column',marginLeft:12,marginTop:20}}>
                            <Text style={{fontSize:11,color:'#7f7f7f'}}>票面金额</Text>
                            <View style={{flexDirection: 'row',alignItems: 'center',marginTop:10}}>
                                <Text
                                    style={{color:'#44bcb2',fontSize:28,marginLeft:-8}}> {numeral(item.amount / 10000).format('0,0.00')}</Text>
                                <Text style={{color:'#7f7f7f',fontSize:15}}>万元</Text>
                            </View>
                            <View style={{flexDirection: 'column',marginTop:10}}>
                                <Text style={{color:'#7f7f7f',fontSize:11,alignItems: 'center'}}>收款人</Text>
                                <Text numberOfLines={1}
                                      style={{width:width-170,color:'#7f7f7f',fontSize:15,alignItems: 'center',marginTop:10}}>{item.payeeName}</Text>
                            </View>
                        </View>
                        <StatusIcon role={item.role} status={item.status}/>
                    </View>
                    <View style={{borderBottomColor:'#cccccc',borderBottomWidth:0.5,marginHorizontal:6}}></View>
                    <View
                        style={{flexDirection: 'row',justifyContent:'space-between',paddingHorizontal:6,alignItems:'center',height:35}}>
                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                            <View style={{ flexDirection: 'row',alignItems: 'center'}}>
                                <Image
                                    style={{width:13,height:13,marginRight:2,marginLeft:6}}
                                    source={require('../../image/bill/desc.png')}
                                />
                                <DrawerDesc role={item.role} status={item.status} discountDate={item.discountDate}/>
                            </View>
                        </View>
                        <Text
                            style={{color:'#333333',textAlign:'right',fontSize:15}}>{'~' + dateFormat(new Date(item.dueDate), 'yyyy.mm.dd') + ' 到期'}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    },
    selectTeam: function (item:Object) {

        this.props.navigator.push({
            param: {title: '详情', record: item},
            comp: Detail
        });


    },
//收到的票据
    renderRec: function (item) {
        var {height, width} = Dimensions.get('window');
        return (
            <TouchableHighlight onPress={() => this.selectTeam(item)} activeOpacity={0.8} underlayColor='#f0f0f0'>
                <View
                    style={{backgroundColor:'#ffffff',borderWidth: 1,marginHorizontal:5,marginTop:5,borderColor:'#dfdfdf',height:171,flex:1}}>
                    <View style={{flex: 1,flexDirection: 'row',justifyContent: 'space-between',height:136}}>
                        <View style={{flexDirection: 'column',marginLeft:12,marginTop:20}}>
                            <Text style={{fontSize:11,color:'#7f7f7f'}}>票面金额</Text>
                            <View style={{flexDirection: 'row',alignItems: 'center',marginTop:10}}>
                                <Text
                                    style={{color:'#44bcb2',fontSize:28,marginLeft:-8}}> {numeral(item.amount / 10000).format('0,0.00')}</Text>
                                <Text style={{color:'#7f7f7f',fontSize:15}}>万元</Text>
                            </View>
                            {(()=> {
                                if (item.status == 'DIS') {
                                    return (
                                        <View style={{ flexDirection: 'row', alignItems: 'center',marginTop:20}}>
                                            <Text numberOfLines={1}
                                                  style={{ marginLeft:6,color:'#4e4e4e'}}>{numeral(item.discountRate * 1000).format("0,0.00") + "‰"}</Text>
                                        </View>
                                    );
                                }
                                else
                                    return (
                                        <View style={{flexDirection: 'column',marginTop:10}}>
                                            <Text style={{color:'#7f7f7f',fontSize:11,alignItems: 'center'}}>开票人</Text>
                                            <Text numberOfLines={1}
                                                  style={{width:width-70,color:'#7f7f7f',fontSize:15,alignItems: 'center',marginTop:10}}>{item.drawerName}</Text>
                                        </View>
                                    );
                            })()}
                        </View>
                        <StatusIcon role={item.role} status={item.status}/>
                    </View>
                    <View style={{borderBottomColor:'#cccccc',borderBottomWidth:0.5,marginHorizontal:6}}></View>
                    <View
                        style={{flexDirection: 'row',justifyContent:'space-between',paddingHorizontal:6,alignItems:'center',height:35}}>
                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                            <Image
                                style={{width:13,height:13,marginRight:2,marginLeft:6}}
                                source={require('../../image/bill/desc.png')}
                            />

                            <PayeeDesc role={item.role} status={item.status} discountDate={item.discountDate}
                                       discountDueDate={item.discountDueDate}
                                       estimatedIssueDate={item.estimatedIssueDate}/>
                        </View>
                        <Text
                            style={{color:'#333333',textAlign:'right',fontSize:15}}>{'~' + dateFormat(new Date(item.dueDate), 'yyyy.mm.dd') + ' 到期'}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
});

module.exports = BillList;