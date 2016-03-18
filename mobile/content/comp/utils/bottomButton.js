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
            underColor: '#a6c7f2',
            fontColor: 'white',
            borderColor: '#44bcb2'
        }
    },
    render(){
        return (
            <View style={styles.bottom}>
                <TouchableHighlight
                    style={[styles.radius,styles.button,{backgroundColor:this.props.backColor},{borderColor:this.props.borderColor}]}
                    activeOpacity={1} underlayColor={this.props.underColor} onPress={this.props.func}>
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
        borderTopWidth: 1,
        borderTopColor: '#cccccc',
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
        justifyContent: 'center',
        borderWidth: 1
    },
})
module.exports = BottomButton;

