'use strict';

var React = require('react-native');
var {
    StyleSheet,
    TouchableHighlight,
    Text,
    } = React;
var Button = React.createClass({
    getDefaultProps(){
        return {
            check: false
        }
    },
    underCo(){
        if (this.props.checked) {
            return '#9ad6d1'
        } else {
            return '#9ad6d1'
        }
    },
    render(){
        return (
            <TouchableHighlight style={[styles.radius,styles.button, !this.props.checked && styles.buttonUseful]}
                                activeOpacity={1} onPress={this.props.checked?()=>{}:this.props.func}
                                underlayColor={this.underCo()}>
                <Text style={{color:'white',fontSize:18}}>{this.props.content}</Text>
            </TouchableHighlight>
        )
    }
})
var styles = StyleSheet.create({
    radius: {
        borderRadius: 6
    },
    button: {
        backgroundColor: '#9ad6d1',
        paddingHorizontal: 12,
        height: 47,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonUseful: {
        backgroundColor: '#44bcbc'
    },
})
module.exports = Button
