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
    Platform
    }=React
var Login = require('../login/login')
var NavBarView = require('../../framework/system/navBarView');
var AppStore = require('../../framework/store/appStore');
var AppAction = require('../../framework/action/appAction');
var _ = require('lodash');
var window = Dimensions.get('window');
var ds = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
const DropDown = require('../../comp/dropDown/dropDown');
const {
    Select,
    Option,
    OptionList,
    updatePosition
    } = DropDown;
var BillList = React.createClass({
    getStateFromStores() {
        var token = AppStore.getToken();
        if (token != null) {
            //updatePosition(this.refs['SELECT1']);
            //updatePosition(this.refs['OPTIONLIST']);
            var obj = AppStore.getDemoFlag();
            if ((obj == undefined || obj.flag != true || (obj.id != AppStore.getUserId())) && (this.state.db != undefined && this.state.db.length > 0)) {
                //Alert("是否需要引导?",  () => this.toOther(), (text) => console.log('OK pressed'));
                this.toOther();
                AppAction.setDemoFlag();
            }
            var contentlist, fuc = this.renderRec
            if (this.state && this.state.flag == 1) {
                fuc = this.renderSend;
            }
            var flag;
            if (!this.state || !this.state.flag) {
                flag = 0;
            } else {
                flag = this.state.flag;
            }
            if (flag == 1) {
                contentlist = AppStore.getBillSentViewItems("");
            } else {
                contentlist = AppStore.getBillRevViewItems("");
            }
            return {
                token: token,
                flag: flag,
                renderFuc: fuc,
                dataSource: ds.cloneWithRows(contentlist),
                db: contentlist,
                filterValue: '全部',
            };
        } else {
            return {
                token: token
            }
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
    getDefaultProps: function () {
        return {
            segctldata: ['收到的票', '开出的票'],
            recOption: ['全部', '新票据', '已申请', '受理中', '已贴现', '不贴现'],
            sendOption: ['全部', '等待中', '已贴现', '不贴现']
        };
    },

    toOther: function () {
        this.props.navigator.push({
            param: {},
            comp: Demo
        });
    },
    renderSeg: function () {
        if (Platform.OS === 'ios') {
            return (
                <SegmentedControlIOS onValueChange={this.changeRenderFuc} values={this.props.segctldata}
                                     selectedIndex={this.state.flag}
                                     style={{alignSelf:'center',width:200,marginTop:30, height:30}}
                                     tintColor={'#44bcb2'}/>
            );
        }
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
                <NavBarView navigator={this.props.navigator} title="票据" showBar={false} showBack={false}
                            contentBackgroundColor='#f0f0f0'>
                    {this.renderSeg()}
                    {(()=> {
                        if (this.state.flag == 0) {
                            return (
                                <Select
                                    style={{alignSelf:'center'}}
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
                                    style={{alignSelf:'center'}}
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


                </NavBarView>
            );
        }
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
        var contentlist;
        if (this.state.flag == 0) {
            contentlist = AppStore.getBillRevViewItems(this.state.status);
        } else {
            contentlist = AppStore.getBillSentViewItems(this.state.status);
        }
        this.setState({dataSource: this.state.dataSource.cloneWithRows(contentlist), db: contentlist});
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

    renderDetail: function (team) {
        return (
            <View style={styles.container}>
                <Text>{team.team_cn}</Text>
            </View>
        );
    },

    update: function (data) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.db),
            db: this.state.db,
            loaded: true
        });
    },

    selectTeam: function (item:Object) {

        this.props.navigator.push({
            param: {title: '详情', record: item},
            comp: Detail
        });


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
//收到的票据
    renderRec: function (item) {
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
                                                  style={{width:width-170,color:'#7f7f7f',fontSize:15,alignItems: 'center',marginTop:10}}>{item.drawerName}</Text>
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