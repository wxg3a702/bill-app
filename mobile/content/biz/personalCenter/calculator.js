'use strict';

var React = require('react-native');
var {
    StyleSheet,
    TouchableHighlight,
    Text,
    View,
    ScrollView,
    TextInput,
    } = React;
var _ = require('lodash');
var VIcon = require('../../comp/icon/vIcon')
var TextEdit = require('./../user/textEdit');
var NavBarView = require('../../framework/system/navBarView')
var Alert = require('../../comp/utils/alert');
var Calculator = React.createClass({
    getInitialState: function () {
        return {
            discountDate: '',
            dueDate: '',
            monthRate: '',
            amount: '',
            discountAmount: '',
            actAmount: '',
            interestDay: ''
        }
    },
    callBack(data, cb){
        var key = _.keys(data)[0];
        var value = data[key];
        this.setState({[key]: value}),
            cb()
    },
    toEdit: function (title, name, value, type, length, valid) {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                comp: TextEdit,
                param: {
                    title: title,
                    name: name,
                    value: value,
                    type: type,
                    maxLength: length,
                    valid: valid
                },
                callBack: this.callBack
            })
        }
    },
    dataDiff(sDate1, sDate2) {
        var startTime = Date.parse(sDate1.replace(/-/g, "/"));
        var endTime = Date.parse(sDate2.replace(/-/g, "/"));
        var dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
        this.setState({
            interestDay: dates
        })
    },
    calculate(){
        if (this.state.amount.length == 0) {
            Alert("请填写票面金额")
            return false;
        }
        if (this.state.discountDate.length == 0) {
            Alert("请填写贴现日期")
            return false;
        }
        if (this.state.dueDate.length == 0) {
            Alert("请填写到期日")
            return false;
        }
        if (this.state.monthRate == 0) {
            Alert("请填写月利率")
            return false;
        }
        var reg = /^\d{1,6}(\.\d{1,2})?$/
        if (!reg.test(this.state.amount)) {
            Alert("票面金额在0~999999.99之间");
            return false;
        }
        var re = /^\d{1,3}(\.\d{1,2})?$/
        if (!re.test(this.state.monthRate)) {
            Alert("月利率在0~999.99之间");
            return false;
        }
        if (new Date(Date.parse(this.state.discountDate.replace(/-/g, "/"))) > new Date(Date.parse(this.state.dueDate.replace(/-/g, "/")))) {
            Alert("到期日不可早于贴现日期")
            return false;
        }
        this.dataDiff(this.state.discountDate, this.state.dueDate);
        var discountAmount = this.state.amount * this.state.monthRate / 1000 * this.state.interestDay / 30;
        this.setState({
            discountAmount: discountAmount,
            actAmount: this.state.amount - discountAmount
        })
    },
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="贴现利率计算器" contentBackgroundColor='#f0f0f0'>
                <ScrollView style={[styles.flexColumn,styles.flexOne]} scrollEnabled={false}>
                    <View
                        style={[styles.flexRow,styles.borderBottom,{height:51,backgroundColor:'white',paddingLeft:16,paddingRight:16,alignItems:'center'}]}>
                        <View style={{width:109}}>
                            <Text style={[styles.text,{color:'#323232'}]}>票面金额</Text>
                        </View>
                        <View style={{flex:1}}>
                            <TextInput style={[{height:32},styles.value]} keyboardType="numeric"
                                       onChangeText={(text) => this.setState({amount:text})}
                                       placeholderTextColor='#cccccc' placeholder="请输入票面金额"/>
                        </View>
                        <Text>万元</Text>
                    </View>
                    <TouchableHighlight
                        onPress={() => this.toEdit("修改贴现日期","discountDate",this.state.discountDate,"date",'','')}>
                        <View
                            style={[styles.flexRow,styles.borderBottom,{height:51,backgroundColor:'white',paddingLeft:16,paddingRight:4,alignItems:'center'}]}>
                            <View style={{width:109}}>
                                <Text style={[styles.text,{color:'#323232'}]}>贴现日期</Text>
                            </View>
                            <View style={[styles.between,styles.flexOne,styles.flexRow,{alignItems:'center'}]}>
                                <View style={{flex:1}}>
                                    <Text style={styles.value}>{this.state.discountDate}</Text>
                                </View>
                                <VIcon/>
                            </View>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => this.toEdit("修改到期日期","dueDate",this.state.dueDate,"date",'','')}>
                        <View
                            style={[styles.flexRow,styles.borderBottom,{height:51,backgroundColor:'white',paddingLeft:16,paddingRight:4,alignItems:'center'}]}>
                            <View style={{width:109}}>
                                <Text style={[styles.text,{color:'#323232'}]}>到期日期</Text>
                            </View>
                            <View style={[styles.between,styles.flexOne,styles.flexRow,{alignItems:'center'}]}>
                                <View style={{flex:1}}>
                                    <Text style={styles.value}>{this.state.dueDate}</Text>
                                </View>
                                <VIcon/>
                            </View>
                        </View>
                    </TouchableHighlight>
                    <View
                        style={[styles.flexRow,styles.borderBottom,{height:51,backgroundColor:'white',paddingLeft:16,paddingRight:16,alignItems:'center'}]}>
                        <View style={{width:109}}>
                            <Text style={[styles.text]}>月利率</Text>
                        </View>
                        <View style={{flex:1}}>
                            <TextInput style={[{height:32},styles.value]} keyboardType="numeric"
                                       onChangeText={(text) => this.setState({monthRate:text})}
                                       placeholderTextColor='#cccccc' placeholder="请输入月利率"/>
                        </View>
                        <Text>‰</Text>
                    </View>
                    <View style={[styles.calResult,styles.borderBottom]}>
                        <Text style={[styles.value,{color:'#333333'}]}>计算结果</Text>
                    </View>
                    <View style={[styles.result,styles.borderBottom,{paddingRight:16}]}>
                        <Text style={[{width:109},styles.text]}>计息天数</Text>
                        <Text style={{flex:1}}>{this.state.interestDay}</Text>
                        <Text>天</Text>
                    </View>
                    <View style={[styles.result,styles.borderBottom,{paddingRight:16}]}>
                        <Text style={[{width:109},styles.text]}>贴现利息</Text>
                        <Text style={{flex:1}}>{this.state.discountAmount}</Text>
                        <Text>万元</Text>
                    </View>
                    <View style={[styles.result,styles.borderBottom,{paddingRight:16}]}>
                        <Text style={[{width:109},styles.text]}>贴现金额</Text>
                        <Text style={{flex:1}}>{this.state.actAmount}</Text>
                        <Text>万元</Text>
                    </View>
                </ScrollView>
                <View
                    style={[styles.flexColumn,{justifyContent:'center',padding:7,backgroundColor:'#f7f7f7',borderTopWidth:1,borderTopColor:'#cccccc',opacity:0.9}]}>
                    <TouchableHighlight style={[styles.radius,styles.button]} activeOpacity={1}
                                        underlayColor='#a6c7f2' onPress={this.calculate}>
                        <View>
                            <Text style={[styles.text,{color:'white'}]}>开始计算</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
    flexOne: {
        flex: 1
    },
    flexColumn: {
        flexDirection: 'column'
    },
    flexRow: {
        flexDirection: 'row'
    },
    text: {
        fontSize: 18,
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderColor: '#c8c7cc'
    },
    icon: {
        width: 35, height: 35,
    },
    between: {
        justifyContent: 'space-between'
    },
    calResult: {
        justifyContent: 'center', height: 55, paddingLeft: 16,backgroundColor:'#f0f0f0'
    },
    result: {
        alignItems: 'center',
        height: 51,
        backgroundColor: 'white',
        paddingLeft: 16,
        flexDirection: 'row'
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
        justifyContent:'center'
    },
    value:{
        fontSize:18,
        color:'#7f7f7f'
    }
})
module.exports = Calculator;