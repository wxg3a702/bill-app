'use strict';

var React = require('react-native');
var {
    StyleSheet,
    View,
    TextInput,
    Text,
    PickerIOS,
    } = React;
var _ = require('lodash');
var PickerItemIOS = PickerIOS.Item;
var RightTopButton = require('../../comp/utils/rightTopButton')
var NavBarView = require('../../framework/system/navBarView')
var dateFormat = require('dateformat')
var date = dateFormat(new Date(), 'yyyy-mm-dd');
var year = Array(200).fill({}).map((obj, index)=>obj = {
    name: 1949 + index + "年",
    value: 1949 + index
})
var month = Array(12).fill({}).map((obj, index)=>obj = {name: 1 + index + "月", value: 1 + index})
var day = Array(31).fill({}).map((obj, index)=>obj = {name: 1 + index + "日", value: 1 + index})
var dismissKeyboard = require('react-native-dismiss-keyboard');
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
        return {
            oldValue: (value == null || value == '') ? '' : this.props.param.value.toString(),
            year: this.props.param.type == "date" ? (this.props.param.value == '' ? Number(date.split("-")[0]) : Number(this.props.param.value.split("-")[0])) : '',
            month: this.props.param.type == "date" ? (this.props.param.value == '' ? Number(date.split("-")[1]) : Number(this.props.param.value.split("-")[1])) : '',
            day: this.props.param.type == "date" ? (this.props.param.value == '' ? Number(date.split("-")[2]) : Number(this.props.param.value.split("-")[2])) : '',
            newValue: this.props.param.value,
            type: type,
            tele: this.props.param.type == "telephone" ? (_.isEmpty(this.props.param.value) ? '' : this.props.param.value.split('-')[0] ) : '',
            phone: this.props.param.type == "telephone" ? (_.isEmpty(this.props.param.value) ? '' : this.props.param.value.split('-')[1]) : '',

        }
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
                newValue: Number(this.state.newValue)
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
        if (this.props.param.valid.length != 0 && !this.props.param.valid(this.state.newValue, this.props.param.title)) {

        } else {
            const { navigator } = this.props;
            this.props.callback(
                {[this.props.param.name]: this.state.newValue},
                ()=> {
                    navigator.pop()
                }
            );
        }
    },
    render: function () {
        if (this.props.param.type == "date") {
            return (
                <NavBarView navigator={this.props.navigator} title={this.props.param.title}
                            contentBackgroundColor='white'
                            actionButton={this.button()}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex:1}}>
                            <PickerIOS
                                selectedValue={this.state.year}
                                onValueChange={(year) => this.setState({year, modelIndex: 0})}>
                                {year.map((obj, index) => (
                                        <PickerItemIOS
                                            key={obj.value}
                                            value={obj.value}
                                            label={obj.name.toString()}
                                        />
                                    )
                                )}
                            </PickerIOS>
                        </View>
                        <View style={{flex:1}}>
                            <PickerIOS
                                selectedValue={this.state.month}
                                onValueChange={(month) => this.setState({month, modelIndex: 0})}>
                                {month.map((obj, index) => (
                                        <PickerItemIOS
                                            key={obj.value}
                                            value={obj.value}
                                            label={obj.name.toString()}
                                        />
                                    )
                                )}
                            </PickerIOS>
                        </View>
                        <View style={{flex:1}}>
                            <PickerIOS
                                selectedValue={this.state.day}
                                onValueChange={(day) => this.setState({day, modelIndex: 0})}>
                                {day.map((obj, index) => (
                                        <PickerItemIOS
                                            key={obj.value}
                                            value={obj.value}
                                            label={obj.name.toString()}
                                        />
                                    )
                                )}
                            </PickerIOS>
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