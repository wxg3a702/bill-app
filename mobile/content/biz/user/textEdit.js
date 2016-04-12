'use strict';

var React = require('react-native');
var {
    StyleSheet,
    View,
    TextInput,
    Text,
    Picker,
} = React;
var _ = require('lodash');
var RightTopButton = require('../../comp/utilsUi/rightTopButton')
var NavBarView = require('../../framework/system/navBarView')
var dateFormat = require('dateformat')
var date = dateFormat(new Date(), 'yyyy-mm-dd');
var dismissKeyboard = require('react-native-dismiss-keyboard');
var Alert = require('../../comp/utils/alert');

var TextEdit = React.createClass({
    getInitialState: function () {
        var value = this.props.param.value;
        var type = this.props.param.type;
        if (type == 'number') {
            type = 'numeric'
        } else if (type == 'name') {
            type = 'default'
        } else {
            type = 'ascii-capable'
        }
        let year = this.props.param.type == "date" ? (this.props.param.value == '' ? Number(date.split("-")[0]) : Number(this.props.param.value.split("-")[0])) : '';
        let month = this.props.param.type == "date" ? (this.props.param.value == '' ? Number(date.split("-")[1]) : Number(this.props.param.value.split("-")[1])) : '';
        return {
            oldValue: (value == null || value == '') ? '' : this.props.param.value.toString(),
            year: year,
            month: month,
            day: this.props.param.type == "date" ? (this.props.param.value == '' ? Number(date.split("-")[2]) : Number(this.props.param.value.split("-")[2])) : '',
            newValue: this.props.param.value,
            type: type,
            tele: this.props.param.type == "telephone" ? (_.isEmpty(this.props.param.value) ? '' : this.props.param.value.split('-')[0] ) : '',
            phone: this.props.param.type == "telephone" ? (_.isEmpty(this.props.param.value) ? '' : this.props.param.value.split('-')[1]) : '',
            yearList: Array(200).fill({}).map((obj, index)=>obj = {name: 1949 + index + "年", value: 1949 + index}),
            monthList: Array(12).fill({}).map((obj, index)=>obj = {name: 1 + index + "月", value: 1 + index}),
            dayList: Array(this.calDay(year, month)).fill({}).map((obj, index)=>obj = {
                name: 1 + index + "日",
                value: 1 + index
            })
        }
    },
    calDay(year, month){
        if (!this.state) {
        } else {
            year = this.state.year;
            month = this.state.month;
        }
        let a = 0
        if (_.indexOf([1, 3, 5, 7, 8, 10, 12], month) > -1) {
            a = 31
        } else if (_.indexOf([4, 6, 9, 11], month) > -1) {
            a = 30;
        } else if (month == 2) {
            if (!(year % 4)) {
                a = 29
            } else {
                a = 28
            }
        }
        return a
    },
    setDayList(year, month){
        this.setState({
            dayList: Array(this.calDay(year, month)).fill({}).map((obj, index)=>obj = {
                name: 1 + index + "日",
                value: 1 + index
            })
        })
    },
    button(){
        return (
            <RightTopButton func={this.saveValue} content="保存"/>
        )
    },
    saveValue(){
        if (this.props.param.type == "date") {
            this.setState({
                newValue: this.state.year + "-" + this.state.month + "-" + this.state.day
            })
        }
        if (this.props.param.type == 'number') {
            this.setState({
                newValue: this.state.newValue
            })
        }
        if (this.props.param.type == 'telephone') {
            if (this.state.tele.length > 0 && this.state.phone.length > 0) {
                this.setState({
                    newValue: this.state.tele + '-' + this.state.phone
                })
            }
        }

        dismissKeyboard();

        //最小5位全数字筛选
        var reg = /^\d{5,}$/g;

        //中英文,下划线筛选
        var reg_userName = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/g;

        if (this.props.param.valid.length != 0 && !this.props.param.valid(this.state.newValue, this.props.param.title)) {

        } else if(this.state.newValue.length > this.props.param.maxLength && this.props.param.name != 'discountDate' && this.props.param.name != 'dueDate'){
            Alert('字数超过'+ this.props.param.maxLength +'字的限制');
        } else if(this.props.param.name == 'qqNo' && !reg.test(this.state.newValue)){
            Alert('请输入正确的QQ号格式');
        }else if(this.props.param.name == 'realName' && !reg_userName.test(this.state.newValue)){
            Alert('请输入20个字符内的中文或英文');
        } else {
            const {navigator} = this.props;
            this.props.callback(
                {[this.props.param.name]: this.state.newValue},
                ()=> {
                    navigator.pop()
                }
            );
        }
    },
    changeTime(itemValue, type){
        Promise.resolve(
            this.setState({[type]: itemValue})
            )
            .then(
                this.setDayList(this.state.year, this.state.month)
            )

    },
    
    render: function () {
        if (this.props.param.type == "date") {
            return (
                <NavBarView navigator={this.props.navigator} title={this.props.param.title}
                            contentBackgroundColor='white'
                            actionButton={this.button()}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex:1}}>
                            <Picker mode="dropdown"
                                    selectedValue={this.state.year}
                                    onValueChange={(itemValue)=>this.changeTime(itemValue,'year')}>
                                {this.state.yearList.map((obj, index) => (
                                        <Picker.Item
                                            key={obj.value}
                                            value={obj.value}
                                            label={obj.name.toString()}
                                        />
                                    )
                                )}
                            </Picker>
                        </View>
                        <View style={{flex:1}}>
                            <Picker
                                selectedValue={this.state.month}
                                onValueChange={(itemValue)=>this.changeTime(itemValue,'month')}>
                                {this.state.monthList.map((obj, index) => (
                                        <Picker.Item
                                            key={obj.value}
                                            value={obj.value}
                                            label={obj.name.toString()}
                                        />
                                    )
                                )}
                            </Picker>
                        </View>
                        <View style={{flex:1}}>
                            <Picker
                                selectedValue={this.state.day}
                                onValueChange={(itemValue)=>this.changeTime(itemValue,'day')}>
                                {this.state.dayList.map((obj, index) => (
                                        <Picker.Item
                                            key={obj.value}
                                            value={obj.value}
                                            label={obj.name.toString()}
                                        />
                                    )
                                )}
                            </Picker>
                        </View>
                    </View>
                </NavBarView>
            )
        } else if (this.props.param.type == "telephone") {
            return (
                <NavBarView navigator={this.props.navigator} title={this.props.param.title}
                            contentBackgroundColor='white' actionButton={this.button()}>
                    <View style={[styles.view,{flexDirection:'row',}]}>
                        <TextInput style={[styles.text,{width:80}]} defaultValue={this.state.oldValue.split("-")[0]}
                                   keyboardType='numeric'
                                   maxLength={4}
                                   onChangeText={(text) => this.setState({tele:text})}
                                   autoFocus={true}
                                   autoCapitalize="none"
                                   autoCorrect={false}/>
                        <Text>_</Text>
                        <TextInput style={[styles.text,{flex:1,marginLeft:10}]}
                                   defaultValue={this.state.oldValue.split("-")[1]} keyboardType='numeric'
                                   maxLength={8}
                                   onChangeText={(text) => this.setState({phone:text})}
                                   autoCapitalize="none"
                                   autoCorrect={false}/>
                    </View>
                </NavBarView>
            )
        } else {
            return (
                <NavBarView navigator={this.props.navigator} title={this.props.param.title}
                            contentBackgroundColor='white' actionButton={this.button()}>
                    <View style={styles.view}>
                        <TextInput style={styles.text} defaultValue={this.state.oldValue} keyboardType={this.state.type}
                                   maxLength={this.props.param.maxLength}
                                   onChangeText={(text) => this.setState({newValue:text})}
                                   autoFocus={true}
                                   autoCapitalize="none"
                                   autoCorrect={false}
                        />
                    </View>
                </NavBarView>
            )
        }
    }
})
var styles = StyleSheet.create({
    view: {
        borderBottomColor: '#00c0b2', marginTop: 18, marginHorizontal: 20, borderBottomWidth: 1
    },
    text: {
        height: 40, backgroundColor: 'white',
    }
})
module.exports = TextEdit;