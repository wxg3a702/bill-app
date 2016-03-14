'use strict';

var React = require('react-native');
var {
    StyleSheet,
    TouchableOpacity,
    View,
    TextInput,
    Text,
    Dimensions,
    Image
    } = React;
var LoginAction = require("../../framework/action/loginAction")
var TimerMixin = require('react-timer-mixin');
var SMSTimer = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function () {
        return {
            verify: '',
            time: "60秒",
            active: '',
            click: false,
        };
    },
    changeVerify: function () {
        if (this.state.time == "重新获取") {
            LoginAction[this.props.func](
                {
                    mobileNo: this.props.parameter
                },
                function () {
                    this.setState({
                        startTime: new Date().getTime(),
                        deadline: 60,
                        click: false,
                        tim: this.setInterval(this.updateText, 1000)
                    })
                }.bind(this)
            )
        } else if (this.state.time == "60秒") {
            this.setState({
                startTime: new Date().getTime(),
                deadline: 60,
                tim: this.setInterval(this.updateText, 1000)
            })
        }

    },
    updateText: function () {
        var nowTime = new Date().getTime();
        var timeGo = Math.floor((nowTime - this.state.startTime) / 1000);

        var t = --this.state.deadline;
        if (t + timeGo == 60) {

        } else if (t + timeGo > 60) {
            if (timeGo >= 60) {
                t = 0
            } else {
                t = 60 - timeGo;
            }
        }
        this.setState({
            deadline: t,
            time: t + "秒"
        });
        if (t == 0) {
            this.setState({
                time: "重新获取",
                click: true,
            });
            this.clearInterval(this.state.tim);
        }
    },
    textOnchange: function (text, type) {
        this.setState({[type]: text})
        this.props.onChanged(type, this.state.verify)
    },
    render() {
        var {height, width} = Dimensions.get('window');
        return (
            <View style={{flexDirection: 'row',flex:1}}>
                <View style={[styles.view,styles.radius]}>
                    <Image source={require('../../image/utils/smsCode.png')}
                           style={{height:16,width:16,marginLeft:9}}/>
                    <TextInput style={[styles.input,{width:width-170}]}
                               placeholder="短信验证码" onChangeText={(text) => this.textOnchange(text,"verify")}
                               autoCorrect={false} maxLength={6} keyboardType="numeric" placeholderTextColor="#7f7f7f"
                               clearButtonMode="while-editing"/>
                </View>
                <View style={{width:75,marginLeft:12}}>
                    <TouchableOpacity
                        style={[{width:75,height:36},styles.radius, styles.button,this.state.click && styles.color]}
                        onPress={this.changeVerify}>
                        <Text style={[styles.fontColor]}>{this.state.time}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
})
var styles = StyleSheet.create({
    view: {
        height: 36, borderColor: '#cccccc', borderWidth: 0.5, backgroundColor: 'white',
        flexDirection: 'row', alignItems: 'center', flex: 1
    },
    input: {
        fontSize: 14, color: '#7f7f7f', marginLeft: 9
    },
    radius: {
        borderRadius: 4
    },
    button: {
        backgroundColor: '#9ad6d1',
        height: 36,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center'
    },
    fontColor: {
        color: 'white'
    },
    color: {
        backgroundColor: '#44bcbc'
    }

})
module.exports = SMSTimer;