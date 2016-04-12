'use strict';
var React = require('react-native');
var {
    StyleSheet,
    TouchableHighlight,
    Text,
    View,
    } = React;
var BottomButton = React.createClass({
    getDefaultProps(){
        return {
            backColor: '#44bcb2',
            underColor: '#9ad6d1',
            fontColor: 'white',
            borderColor: '#44bcb2',
        }
    },
    render(){
        return (
            <View style={styles.bottom}>
                <TouchableHighlight
                    style={[styles.radius,styles.button,{backgroundColor:this.props.backColor}]}
                    activeOpacity={1} underlayColor={this.props.underColor} onPress={this.props.checked?()=>{}:this.props.func}>
                    <Text style={{color:this.props.fontColor,fontSize:18}}>{this.props.content}</Text>
                </TouchableHighlight>
            </View>
        )
    }
})
var styles = StyleSheet.create({
    bottom: {
        padding: 7,
        backgroundColor: '#f7f7f7',
        opacity: 0.9
    },
    radius: {
        borderRadius: 6
    },
    button: {
        height: 47,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
})
module.exports = BottomButton;

