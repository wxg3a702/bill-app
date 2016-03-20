'use strict';

var React = require('react-native');
var {
    StyleSheet,
    TouchableHighlight,
    Text,
    View,
    ScrollView,
    TextInput,
    Platform,
    NativeModules,
    DeviceEventEmitter
    } = React;
var BottomButton = require('../../comp/utils/bottomButton')
var numeral = require('../../comp/utils/numberHelper')
var _ = require('lodash');
var VIcon = require('../../comp/icon/vIcon')
var TextEdit = require('./../user/textEdit');
var NavBarView = require('../../framework/system/navBarView')
var Alert = require('../../comp/utils/alert');
var RightTopButton = require('../../comp/utils/rightTopButton')
var DatePicker = require('NativeModules').DatePickerDialogModule;
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
    componentDidMount() {
        DeviceEventEmitter.addListener('getDate', function (e:Event) {
            console.log(e.date)
            console.log(e.name)
            if (e.name=="discountDate"){
                this.setState({
                    discountDate: e.date
                });
            }else if (e.name=="dueDate"){
                this.setState({
                    dueDate: e.date
                });
            }
        }.bind(this));

    },
    callBack(data, cb){
        var key = _.keys(data)[0];
        var value = data[key];
        this.setState({[key]: value}), cb()
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
    clear(){
        this.setState({
            discountDate: '',
            dueDate: '',
            monthRate: '',
            amount: '',
            discountAmount: '',
            actAmount: '',
            interestDay: ''
        })
    },
    button(){
        return (
            <RightTopButton func={() => this.clear()} content="清空"/>
        )
    },
    returnItem(key, desc, holder, unit, max){
        return (
            <View style={styles.layout}>
                <Text style={[styles.text,{width:109}]}>{desc}</Text>
                <View style={{flex:1}}>
                    <TextInput style={{height:32,fontSize:15,color:'#7f7f7f'}}
                               underlineColorAndroid="transparent"
                               keyboardType="numeric" maxLength={max}
                               onChangeText={(text) => this.setState({[key]:text})} value={this.state[key]}
                               placeholderTextColor='#cccccc' placeholder={holder}/>
                </View>
                <Text style={styles.text}>{unit}</Text>
            </View>
        )
    },
    showDate(word, key, value, type){
        if (Platform.OS == 'ios') {
            this.toEdit(word, key, value, type, '', '')
        } else {
            DatePicker.showDatePickerDialog(key);
        }
    },
    returnDate(key, desc, holder, value, type, word){
        var color;
        if (value.length == 0) {
            value = holder;
            color = '#cccccc';
        } else {
            color = '#7f7f7f'
        }
        return (
            <TouchableHighlight onPress={()=>this.showDate(word,key,value==holder?'':value,type,'','')}>
                <View style={[styles.layout,{paddingRight:10}]}>
                    <Text style={[styles.text,{width:109}]}>{desc}</Text>
                    <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <Text style={{fontSize:15,color:color}}>{value}</Text>
                        <VIcon/>
                    </View>
                </View>
            </TouchableHighlight>
        )
    },
    returnResult(desc, value, unit){
        return (
            <View style={[styles.result,styles.borderBottom]}>
                <Text style={[{width:109},styles.text]}>{desc}</Text>
                <Text style={styles.after}>{value.length == 0 ? '' : numeral.number4(value)}</Text>
                <Text style={styles.text}>{unit}</Text>
            </View>
        )
    },
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="贴现利率计算器" actionButton={this.button()}>
                <ScrollView style={{flex:1}} scrollEnabled={false}>
                    {this.returnItem('amount', '票面金额', '请输入票面金额', '万元', 9)}
                    {this.returnDate('discountDate', '贴现日期', '请输入贴现日期', this.state.discountDate, 'date', '修改贴现日期')}
                    {this.returnDate('dueDate', '到期日期', '请输入到期日期', this.state.dueDate, 'date', '修改到期日期')}
                    {this.returnItem('monthRate', '月利率', '请输入月利率', '‰', 6)}
                    <View style={[styles.calResult,styles.borderBottom]}>
                        <Text style={{color:'#333333',fontSize:15}}>计算结果</Text>
                    </View>
                    {this.returnResult('计息天数', this.state.interestDay, '天')}
                    {this.returnResult('贴现利息', this.state.discountAmount, '万元')}
                    {this.returnResult('贴现金额', this.state.actAmount, '万元')}
                </ScrollView>
                <BottomButton func={this.calculate} content="开始计算"/>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
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
    bottom: {
        padding: 7, backgroundColor: '#f7f7f7', borderTopWidth: 1, borderTopColor: '#cccccc', opacity: 0.9
    },
    borderBottom: {
        borderBottomWidth: 1, borderColor: '#c8c7cc'
    },
    result: {
        alignItems: 'center',
        height: 51,
        backgroundColor: 'white',
        flexDirection: 'row',
        paddingHorizontal: 16
    },
    calResult: {
        justifyContent: 'center', height: 55, paddingLeft: 16, backgroundColor: '#f0f0f0'
    },
    text: {
        fontSize: 18, color: '#333333'
    },
    after: {
        fontSize: 15,
        color: '#7f7f7f',
        flex: 1
    },
    layout: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 50,
        backgroundColor: 'white',
        paddingHorizontal: 16,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#c8c7cc'
    }
})
module.exports = Calculator;