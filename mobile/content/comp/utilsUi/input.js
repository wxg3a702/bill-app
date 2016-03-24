'use strict';

var React = require('react-native');
var {
    StyleSheet,
    TextInput,
    View,
    Image,
    Dimensions
    } = React;
var InputIcon=require('../../constants/inputIcon')
var Adjust=require('../../comp/utils/adjust')
var Input = React.createClass({
    getDefaultProps(){

    },
    textOnchange: function (text, type) {
        this.props.onChanged(type, text)
    },
    render(){
        var {height, width} = Dimensions.get('window');
        if (this.props.type == 'default') {
            return (
                <View style={[styles.view,styles.radius]}>
                    <Image style={{height:16,width:16,marginLeft:9}}
                           source={InputIcon[this.props.icon].icon}/>
                    <TextInput style={[styles.input,{width:width-Adjust.width(80)}]} underlineColorAndroid="transparent"
                               onChangeText={(text) => this.textOnchange(text,this.props.field)}
                               maxLength={this.props.max}
                               placeholder={this.props.prompt} secureTextEntry={this.props.isPwd} autoCorrect={false}
                               autoCapitalize="none" placeholderTextColor="#7f7f7f" clearButtonMode="while-editing"
                               keyboardType={this.props.isPhone?'numeric':'ascii-capable'}/>
                </View>
            )
        }
    }
})
var styles = StyleSheet.create({
    view: {
        height: 47, borderColor: '#cccccc', borderWidth: 0.5, marginTop: 12, backgroundColor: 'white',
        flexDirection: 'row', alignItems: 'center'
    },
    input: {
        fontSize: 18, color: '#7f7f7f', marginLeft: 9,
    },
    radius: {
        borderRadius: 6
    },
})
module.exports = Input;