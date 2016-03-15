'use strict';

var React = require('react-native');
var {
    StyleSheet,
    TouchableHighlight,
    Text,
    View,
    ScrollView,
    Image
    } = React;

var _ = require('lodash');
var DisConfirm = require('./disConfirm');
var cssVar = require('cssVar');
var BillAction = require("../../framework/action/billAction");
var JumpLoading = require('../../comp/utils/jumpLoading');
var NavBarView = require('../../framework/system/navBarView');
var dismissKeyboard = require('react-native-dismiss-keyboard');
var numeral = require('numeral');
var dateFormat = require('dateformat');
var Alert = require('../../comp/utils/alert');
var ApplyDiscount = require('./applyDiscount');
var styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#ffffff'
    },
    lefttext: {},
    rowF: {
        paddingLeft: 10,
        marginTop: 90,
        flexDirection: 'row'
    },
    flexOne: {
        flex: 1
    },
    widthOneH: {
        width: 100
    },
    rowS: {
        paddingLeft: 10,
        flexDirection: 'row',
        marginTop: 5
    },
    buttonContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 5,
        justifyContent: 'center',
        width: 350,
        marginLeft: 10
    },
    leftContainerButton: {
        width: 90,
        padding: 10,
        backgroundColor: 'red',
        borderRadius: 5
    },
    leftContainerButtonText: {
        color: '#ffffff',
        textAlign: 'center'
    },
    rightContainerButton: {
        width: 210,
        marginLeft: 5,
        padding: 10,
        backgroundColor: 'green',
        borderRadius: 5
    },
    rightContainerButtonText: {
        color: '#ffffff',
        textAlign: 'center'
    }
});

var containerHolder;

var Detail = React.createClass({

    dataDiff: function (sDate1, sDate2) {
        var startTime = new Date(Date.parse(sDate1.replace(/-/g, "/"))).getTime();
        var endTime = new Date(Date.parse(sDate2.replace(/-/g, "/"))).getTime();
        var days = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
        return days;
    },

    //贴现金额=票面金额*[1-贴现利率*（到期日-贴现日期）/30]
    calDis: function (amount, discountRate, dueDate) {
        var days = this.dataDiff(dateFormat(new Date(this.state.dueDate), 'yyyy-mm-dd'), dateFormat(_.now(), 'yyyy-mm-dd'));
        return amount * (1 - discountRate * days / 30);

    },

    getInitialState: function () {
        return {
            loaded: false,
        };
    },


    renderBillHeader(){
        let summaryHeight = 170;
        return (
            <View
                style={{flexDirection: 'column',borderStyle:'solid',backgroundColor:'#ffffff',marginTop:0,height:summaryHeight}}>
                <View
                    style={{paddingHorizontal:12,paddingTop:15,paddingBottom:0,flexDirection: 'row',justifyContent: 'space-between',flex:1}}>
                    <Text
                        style={{color:'#7f7f7f',alignSelf:"flex-start",fontSize:15}}>{'票号：' + this.state.billNo}</Text>
                    {(() => {
                        if (this.state.role == "payee") {
                            if (this.state.status == "NEW") {
                                return (
                                    <View
                                        style={{borderRadius:8,width:49,height:18,backgroundColor:'#ff5b58',justifyContent:"center",alignItems:"center" }}>
                                        <Text style={{ color:'#ffffff',fontSize:11}}>新票据</Text>
                                    </View>
                                )
                            }
                            if (this.state.status == "REQ") {
                                return (
                                    <View
                                        style={{borderRadius:8,width:49,height:18,backgroundColor:'#FEB923',justifyContent:"center",alignItems:"center" ,alignSelf:"flex-start"}}>
                                        <Text style={{ color:'#ffffff',fontSize:11}}>已申请</Text>
                                    </View>
                                )
                            }
                            if (this.state.status == "HAN") {
                                return (
                                    <View
                                        style={{borderRadius:8,width:49,height:18,backgroundColor:'#438CEC',justifyContent:"center",alignItems:"center" ,alignSelf:"flex-start"}}>
                                        <Text style={{ color:'#ffffff',fontSize:11}}>受理中</Text>
                                    </View>)
                            }
                            if (this.state.status == "DIS") {
                                return (
                                    <View
                                        style={{borderRadius:8,width:49,height:18,backgroundColor:'#44bcb2',justifyContent:"center",alignItems:"center" ,alignSelf:"flex-start"}}>
                                        <Text style={{ color:'#ffffff',fontSize:11}}>已贴现</Text>
                                    </View>)
                            }
                            if (this.state.status == "IGN") {
                                return (
                                    <View
                                        style={{borderRadius:8,width:49,height:18 ,backgroundColor:'#96a5b8',justifyContent:"center",alignItems:"center" ,alignSelf:"flex-start"}}>
                                        <Text style={{ color:'#ffffff',fontSize:11}}>不贴现</Text>
                                    </View>
                                )
                            } else {
                                return (
                                    <View
                                        style={{borderRadius:8,  width:55,height:15,backgroundColor:'#96a5b8',justifyContent:"center",alignItems:"center" ,alignSelf:"flex-start"}}>
                                        <Text style={{ color:'#ffffff',fontSize:11}}>this.state.status</Text>
                                    </View>
                                )
                            }
                        } else {
                            if (this.state.status == 'NEW' || this.state.status == 'REQ' || this.state.status == 'HAN') {
                                return (
                                    <View
                                        style={{borderRadius:8,width:49,height:18,backgroundColor:'#96a5b8',justifyContent:"center",alignItems:"center" ,alignSelf:"flex-start"}}>
                                        <Text style={{ color:'#ffffff',fontSize:11}}>等待中</Text>
                                    </View>
                                );
                            } else if (this.state.status == "IGN") {
                                return (<View
                                    style={{borderRadius:8,width:49,height:18,backgroundColor:'#ff5b58',justifyContent:"center",alignItems:"center" ,alignSelf:"flex-start"}}>
                                    <Text style={{ color:'#ffffff',fontSize:11}}>不贴现</Text>
                                </View>);
                            } else if (this.state.status == "DIS") {
                                return (<View
                                    style={{borderRadius:8,width:49,height:18,backgroundColor:'#44bcb2',justifyContent:"center",alignItems:"center" ,alignSelf:"flex-start"}}>
                                    <Text style={{ color:'#ffffff',fontSize:11}}>已贴现</Text>
                                </View>);
                            }
                        }
                    })()}
                </View>
                {(() => {
                    if (this.state.role == "payee") {
                        return (
                            <View>
                                <View style={{paddingTop:0,justifyContent:'center',flexDirection: 'row'}}>
                                    <Text style={{color:'#333333',fontSize:18}}>{'贴现金额'}</Text>
                                </View>
                                <View
                                    style={{paddingTop:15,justifyContent:'center',alignItems:'flex-end',flexDirection: 'row'}}>
                                    <Text
                                        style={{color:'#44bcb2',fontSize:42}}>{this.state.status == 'NEW' ? numeral(this.calDis(this.state.amount, this.state.discountRate, this.state.dueDate) / 10000).format("0,0.00") : numeral(this.state.discountAmount / 10000).format("0,0.00")}</Text>
                                    <Text style={{color:'#4e4e4e',fontSize:15,marginBottom:9}}>{'万元'}</Text>
                                </View>
                            </View>
                        )
                    }
                })()
                }
                {(()=> {
                    if (this.state.role == "payee") {
                        switch (this.state.status) {
                            case "NEW":
                                return (
                                    <View
                                        style={{paddingTop:10,justifyContent:'center',alignItems:'center',flexDirection: 'row',flex:1}}>
                                        <Text
                                            style={{ color:'#ff5b58',fontSize:18}}>{dateFormat(new Date(this.state.discountDueDate), 'yyyy年mm月dd日 HH:MM')}</Text>
                                        <Text style={{ fontSize:18,color:'#999999'}}>{'出票'}</Text>
                                    </View>);
                                break;
                            case "REQ":
                                return (
                                    <View
                                        style={{paddingTop:10,justifyContent:'center',alignItems:'center',flexDirection: 'row',flex:1}}>
                                        <Text
                                            style={{ fontSize:18,color:'#999999'}}>{'请等待银行处理'}</Text>
                                    </View>);
                                break;
                            case "HAN":
                                return (
                                    <View
                                        style={{paddingTop:10,justifyContent:'center',alignItems:'center',flexDirection: 'row',flex:1}}>
                                        <Text
                                            style={{ fontSize:18,color:'#999999'}}>{'请等待银行汇款'}</Text>
                                    </View>);
                                break;
                            case "DIS":
                                return (
                                    <View
                                        style={{paddingTop:10,justifyContent:'center',alignItems:'center',flexDirection: 'row',flex:1}}>
                                        <Text
                                            style={{ fontSize:18,color:'#44bcb2'}}>{dateFormat(new Date(this.state.discountDate), 'yyyy年mm月dd日')}</Text>
                                        <Text style={{ fontSize:18,color:'#999999'}}>{'贴现'}</Text>
                                    </View>);
                                break;
                            case "IGN":
                                return (
                                    <View
                                        style={{fontSize:18,paddingTop:10,justifyContent:'center',alignItems:'center',flexDirection: 'row',flex:1}}>
                                        <Text
                                            style={{ fontSize:18,color:'#999999'}}>{'请等待交易方取票'}</Text>
                                    </View>);
                                break;

                        }

                    } else {
                        switch (this.state.status) {
                            case "NEW":
                            case "REQ":
                            case "HAN":
                                return (
                                    <View style={{paddingTop:10,justifyContent:'center',flexDirection: 'column',flex:1}}>
                                        <View style={{paddingTop:0,justifyContent:'center',flexDirection: 'row',marginTop:-40}}>
                                            <Text style={{color:'#333333',fontSize:18}}>{'票面金额'}</Text>
                                        </View>
                                        <View
                                            style={{paddingTop:15,justifyContent:'center',alignItems:'center',flexDirection: 'row'}}>
                                            <Text
                                                style={{color:'#44bcb2',fontSize:42}}>{this.state.status == 'NEW' ? numeral(this.calDis(this.state.amount, this.state.discountRate, this.state.dueDate) / 10000).format("0,0.00") : numeral(this.state.discountAmount / 10000).format("0,0.00")}</Text>
                                            <Text style={{color:'#4e4e4e',fontSize:15,marginBottom:-10}}>{'万元'}</Text>
                                        </View>
                                        <View style={{justifyContent:'center',alignItems:'center',flexDirection: 'row'}}>
                                            <Text style={{color:'#999999',fontSize:18,marginTop:2}}>{' 请等待承兑行出票'}</Text>
                                        </View>
                                    </View>
                                );
                                break;
                            case "IGN":
                                return (
                                    <View style={{paddingTop:10,justifyContent:'center',flexDirection: 'column',flex:1}}>
                                        <View style={{paddingTop:0,justifyContent:'center',flexDirection: 'row',marginTop:-40}}>
                                            <Text style={{color:'#333333',fontSize:18}}>{'票面金额'}</Text>
                                        </View>
                                        <View
                                            style={{paddingTop:15,justifyContent:'center',alignItems:'center',flexDirection: 'row'}}>
                                            <Text
                                                style={{color:'#44bcb2',fontSize:42}}>{this.state.status == 'NEW' ? numeral(this.calDis(this.state.amount, this.state.discountRate, this.state.dueDate) / 10000).format("0,0.00") : numeral(this.state.discountAmount / 10000).format("0,0.00")}</Text>
                                            <Text style={{color:'#4e4e4e',fontSize:15,marginBottom:-10}}>{'万元'}</Text>
                                        </View>
                                        <View style={{justifyContent:'center',alignItems:'center',flexDirection: 'row'}}>
                                            <Text style={{color:'#999999',fontSize:18,marginTop:2}}>{' 请至承兑行取票'}</Text>
                                        </View>
                                    </View>
                                );
                                break;
                            case "DIS":
                                return (
                                    <View style={{paddingTop:10,justifyContent:'center',flexDirection: 'column',flex:1}}>
                                        <View style={{paddingTop:0,justifyContent:'center',flexDirection: 'row',marginTop:-40}}>
                                            <Text style={{color:'#333333',fontSize:18}}>{'票面金额'}</Text>
                                        </View>
                                        <View
                                            style={{paddingTop:15,justifyContent:'center',alignItems:'center',flexDirection: 'row'}}>
                                            <Text
                                                style={{color:'#44bcb2',fontSize:42}}>{this.state.status == 'NEW' ? numeral(this.calDis(this.state.amount, this.state.discountRate, this.state.dueDate) / 10000).format("0,0.00") : numeral(this.state.discountAmount / 10000).format("0,0.00")}</Text>
                                            <Text style={{color:'#4e4e4e',fontSize:15,marginBottom:-10}}>{'万元'}</Text>
                                        </View>
                                        <View style={{justifyContent:'center',alignItems:'center',flexDirection: 'row'}}>
                                            <Text
                                                style={{ fontSize:18,color:'#44bcb2'}}>{dateFormat(new Date(this.state.discountDate), 'yyyy年mm月dd日')}</Text>
                                            <Text style={{ fontSize:18,color:'#999999'}}>{'贴现'}</Text>
                                        </View>

                                    </View>
                                );
                                break;
                        }
                    }
                })()}


            </View>
        )
    },

    renderBillDisInfo(){
        if(this.state.role=="payee" && (this.state.status == "NEW" || this.state.status == "IGN")){
            return (
                <View></View>
            );
        }else {
            return (
                <View style={{flexDirection: 'column',borderStyle:'solid',backgroundColor:'#ffffff',marginTop:10}}>
                    <View
                        style={{borderBottomColor:'#f6f6f6',borderBottomWidth:2,margin:20,marginTop:10,flexDirection: 'row',justifyContent: 'center',flex:1}}>
                        <Text style={{paddingBottom:10,fontSize:17,flex:4,color:'#4e4e4e'}}>{'起  息  日：' }</Text>
                        <Text
                            style={{paddingBottom:10,fontSize:17,flex:6,color:'#7f7f7f'}}>{dateFormat(new Date(this.state.dueDate), 'yyyy年mm月dd日')}</Text>
                        <Text style={{color:'#ff5b58',fontSize:17}}>{'(参考)'}</Text>
                    </View>
                    <View
                        style={{borderBottomColor:'#f6f6f6',borderBottomWidth:2,marginLeft:20,marginRight:20,marginTop:-10,flexDirection: 'row',justifyContent: 'center',flex:1}}>
                        <Text style={{paddingBottom:5,fontSize:17,flex:4,color:'#4e4e4e'}}>{'贴  现  行：' }</Text>
                        <Text
                            style={{paddingBottom:5,fontSize:17,flex:6,color:'#7f7f7f'}}>{this.state.discountBankName}</Text>
                    </View>
                    <View
                        style={{borderBottomColor:'#f6f6f6',borderBottomWidth:2,marginLeft:20,marginRight:20,marginTop:10,flexDirection: 'row',justifyContent: 'center',flex:1}}>
                        <Text style={{paddingBottom:5,fontSize:17,flex:4,color:'#4e4e4e'}}>{'贴现利率：' }</Text>
                        <Text
                            style={{paddingBottom:5,fontSize:17,flex:6,color:'#7f7f7f'}}>{numeral(this.state.discountRate * 1000).format("0,0.00") + "‰"}</Text>
                    </View>
                    <View
                        style={{marginLeft:20,marginRight:20,marginTop:10,flexDirection: 'row',justifyContent: 'center',flex:1}}>
                        <Text style={{paddingBottom:5,fontSize:17,flex:4,color:'#4e4e4e'}}>{'收款账号：' }</Text>
                        <Text
                            style={{paddingBottom:5,fontSize:17,flex:6,color:'#7f7f7f'}}>{this.state.payeeBankAccountNo}</Text>
                    </View>
                </View>

            )
        }
    },

    renderBillInfo(){
        if((this.state.role=="payee" && this.state.status == "NEW") || this.state.role=="drawer"){
            return (
                <View style={{flexDirection: 'column',borderStyle:'solid',backgroundColor:'#ffffff',marginTop:10}}>
                    <View
                        style={{borderBottomColor:'#f6f6f6',borderBottomWidth:2,margin:20,marginTop:10,flexDirection: 'row',justifyContent: 'center',flex:1}}>
                        <Text style={{paddingBottom:10,fontSize:17,flex:4,color:'#4e4e4e'}}>{'票面金额：' }</Text>
                        <Text
                            style={{paddingBottom:10,fontSize:17,flex:6,color:'#7f7f7f'}}>{numeral(this.state.amount / 10000).format("0,0.00") + "万元"}</Text>
                    </View>
                    <View
                        style={{borderBottomColor:'#f6f6f6',borderBottomWidth:2,marginLeft:20,marginRight:20,marginTop:-10,flexDirection: 'row',justifyContent: 'center',flex:1}}>
                        <Text style={{paddingBottom:5,fontSize:17,flex:4,color:'#4e4e4e'}}>{'开票日期：' }</Text>
                        <Text
                            style={{paddingBottom:5,fontSize:17,flex:6,color:'#7f7f7f'}}>{dateFormat(new Date(this.state.estimatedIssueDate), 'yyyy年mm月dd日')}</Text>
                    </View>
                    <View
                        style={{borderBottomColor:'#f6f6f6',borderBottomWidth:2,marginLeft:20,marginRight:20,marginTop:10,flexDirection: 'row',justifyContent: 'center',flex:1}}>
                        <Text style={{paddingBottom:5,fontSize:17,flex:4,color:'#4e4e4e'}}>{'到 期 日：' }</Text>
                        <Text
                            style={{paddingBottom:5,fontSize:17,flex:6,color:'#7f7f7f'}}>{dateFormat(new Date(this.state.dueDate), 'yyyy年mm月dd日')}</Text>
                    </View>
                    <View
                        style={{borderBottomColor:'#f6f6f6',borderBottomWidth:2,marginLeft:20,marginRight:20,marginTop:10,flexDirection: 'row',justifyContent: 'center',flex:1}}>
                        <Text style={{paddingBottom:5,fontSize:17,flex:4, color:'#4e4e4e'}}>{'出 票 人：' }</Text>
                        <Text style={{paddingBottom:5,fontSize:17,flex:6, color:'#7f7f7f'}}>{this.state.drawerName}</Text>
                    </View>
                    <View
                        style={{borderBottomColor:'#f6f6f6',borderBottomWidth:2,marginLeft:20,marginRight:20,marginTop:10,flexDirection: 'row',justifyContent: 'center',flex:1}}>
                        <Text style={{paddingBottom:5,fontSize:17,flex:4,color:'#4e4e4e'}}>{'收 款 人：' }</Text>
                        <Text style={{paddingBottom:5,fontSize:17,flex:6,color:'#7f7f7f'}}>{this.state.payeeName}</Text>
                    </View>
                    <View
                        style={{marginLeft:20,marginRight:20,marginTop:10,flexDirection: 'row',justifyContent: 'center',flex:1}}>
                        <Text style={{paddingBottom:5,fontSize:17,flex:4,color:'#4e4e4e'}}>{'承兑银行：' }</Text>
                        <Text
                            style={{paddingBottom:5,fontSize:17,flex:6,color:'#7f7f7f'}}>{this.state.acceptBankName }</Text>
                    </View>

                </View>
            )
        }else {
            return(
                <View></View>
            )
        }

    },

    renderBillStateTrack(){
        if(this.state.role=="payee" && this.state.status != "NEW"){
            return (
                <View style={{flexDirection: 'column',borderStyle:'solid',backgroundColor:'#ffffff',marginTop:10}}>
                    <View
                        style={{borderBottomColor:'#f6f6f6',borderBottomWidth:2,margin:20,marginTop:10,flexDirection: 'row',justifyContent: 'center',flex:1}}>
                        <Text style={{paddingBottom:10,fontSize:17,flex:4,color:'#4e4e4e'}}>{'票据状态追踪' }</Text>
                    </View>
                    <View
                        style={{borderBottomColor:'#f6f6f6',marginLeft:20,marginRight:20,marginTop:-10,flexDirection: 'row',justifyContent: 'center',flex:1}}>
                        <Image
                            style={{width:31,height:65,marginRight:0,marginTop:0}}
                            source={require('../../image/bill/desc.png')}
                        />
                        <Text style={{paddingBottom:10,fontSize:17,flex:4,color:'#7f7f7f'}}>{'申请贴现,请等待银行受理' }</Text>
                        <Text
                            style={{marginTop:5,fontSize:12,flex:1,color:'#7f7f7f'}}>15.12.12</Text>
                    </View>
                    <View
                        style={{borderBottomColor:'#f6f6f6',marginLeft:20,marginRight:20,flexDirection: 'row',justifyContent: 'center',flex:1}}>
                        <Image
                            style={{width:31,height:65,marginRight:0,marginTop:0}}
                            source={require('../../image/bill/desc.png')}
                        />
                        <Text style={{paddingBottom:10,fontSize:17,flex:4,color:'#7f7f7f'}}>{'创建票据信息' }</Text>
                        <Text
                            style={{marginTop:5,fontSize:12,flex:1,color:'#7f7f7f'}}>15.12.12</Text>
                    </View>
                </View>
            )
        }else {
            return(
                <View></View>
            )
        }
    },

    ignAction: function () {
        //不贴现
        dismissKeyboard();
        BillAction.giveUpBillDiscount(
            {
                billId: this.state.billId
            },
            function () {
                Alert("操作成功!", ()=>this.goBack());
            }.bind(this)
        )

    },

    reqAction: function () {
        //撤销
        dismissKeyboard();
        BillAction.cancleBillDiscount(
            {
                billId: this.state.billId
            },
            function () {
                Alert("撤销成功!", ()=>this.goBack());
            }.bind(this)
        )
    },

    disAction: function () {
        Alert("你确定要贴现?", () => this.confirmDis({
                billId: this.state.billId,
                discountRate: this.state.discountRate,
                discountAmount: this.state.discountAmount,
                discountBankName: this.state.discountBankName,
                payeeBankAccountNo: this.state.payeeBankAccountNo
            }), {text: '取消', onPress: null}
        );

    },

    confirmDis: function (item:Object) {

        this.props.navigator.push({
            param: {title: '详情', billBean: item},
            comp: ApplyDiscount
        });


    },

    renderAction(){
        if (this.state.role == "payee") {
            switch (this.state.status) {
                case "NEW":
                    return (
                        <View
                            style={{padding:10,flexDirection: 'row',justifyContent:'center',borderStyle:'solid',backgroundColor:'transparent'}}>
                            <View
                                style={{flex:12,height:35,borderRadius:5,backgroundColor: '#44bcb2',paddingLeft:10,paddingRight:10}}>
                                <TouchableHighlight activeOpacity={0.8} underlayColor='#44bcbc'
                                                    onPress={() => this.disAction()} style={{flex:1}}>
                                    <Text style={{paddingTop: 10,color:'#ffffff',textAlign:'center'}}>{'我要贴现'}</Text>
                                </TouchableHighlight>
                            </View>


                        </View>);
                    break;
                case "REQ":
                    return (
                        <View
                            style={{padding:10,flexDirection: 'row',justifyContent:'center',borderStyle:'solid',backgroundColor:'transparent'}}>

                            <View
                                style={{flex:1,height:35,borderRadius:5,backgroundColor: '#ffffff',paddingLeft:10,paddingRight:10,borderWidth:1,borderColor:'#ff5b58'}}>
                                <TouchableHighlight activeOpacity={0.8} underlayColor='#ffffff'
                                                    onPress={() => Alert("确认撤销贴现申请吗？",()=>this.reqAction(),function(){})}
                                                    style={{flex:1}}>
                                    <Text style={{paddingTop: 10,color:'#ff5b58',textAlign:'center'}}>{'撤销申请'}</Text>
                                </TouchableHighlight>
                            </View>

                        </View>);
                    break;
                case "HAN":
                case "DIS":
                case "IGN":
                    return (
                        <View
                            style={{padding:10,flexDirection: 'row',justifyContent:'center',borderStyle:'solid',backgroundColor:'transparent'}}>

                            <View
                                style={{ flex:1,height:35,borderRadius:5,backgroundColor: '#44bcb2',paddingLeft:10,paddingRight:10}}>
                                <TouchableHighlight activeOpacity={0.8} underlayColor='#44bcbc'
                                                    onPress={() => this.goBack()}
                                                    style={{flex:1}}>
                                    <Text style={{paddingTop: 10,color:'#ffffff',textAlign:'center'}}>{'返回'}</Text>
                                </TouchableHighlight>
                            </View>


                        </View>);
                    break;
            }
        } else {
            return (
                <View
                    style={{padding:10,flexDirection: 'row',justifyContent:'center',borderStyle:'solid',backgroundColor:'transparent'}}>

                    <View
                        style={{ flex:1,height:35,borderRadius:5,backgroundColor: '#44bcb2',paddingLeft:10,paddingRight:10}}>
                        <TouchableHighlight activeOpacity={0.8} underlayColor='#44bcbc' onPress={() => this.goBack()}
                                            style={{flex:1}}>
                            <Text style={{paddingTop: 10,color:'#ffffff',textAlign:'center'}}>{'返回'}</Text>
                        </TouchableHighlight>
                    </View>
                </View>);

        }

    },


    renderDrawerDetail: function () {
        return (
            <View style={{backgroundColor: '#f0f0f0',flex:1,justifyContent:"flex-start"}}>
                <ScrollView>
                    {this.renderBillHeader()}
                    {this.renderBillInfo()}
                </ScrollView>
                {this.renderAction()}
            </View>

        );
    },

    onAction(){
        console.log("aa")
        containerHolder.showLoading()
    },

    renderPayeeDetail: function () {
        return (
            <View style={{backgroundColor: '#f0f0f0',flex:1,justifyContent:"flex-start"}}>
                <ScrollView>
                    {this.renderBillHeader()}
                    {this.renderBillDisInfo()}
                    {this.renderBillInfo()}
                    {this.renderBillStateTrack()}
                </ScrollView>
                {this.renderAction()}
            </View>

        );
    },

    goBack: function () {
        this.props.navigator.pop();
        //this.props.callback(); //更新
    },
    render: function () {
        if (!this.state.loaded) {
            return (<JumpLoading />);
        }

        var record = this.props.param.record;
        var content;
        if (record.role == "drawer") {
            content = this.renderDrawerDetail();
        } else {
            content = this.renderPayeeDetail();
        }
        return (
            <NavBarView navigator={this.props.navigator} ref={c=>{if(c)containerHolder=c.getContainerHandle()}}
                        title="票据详情">
                {content}
            </NavBarView>
        );

    },

    componentDidMount: function () {
        var responseData = this.props.param.record;

        this.setState({loaded: true});
        this.setState(responseData);
    }

});


module.exports = Detail;
