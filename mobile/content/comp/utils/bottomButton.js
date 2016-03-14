'use strict';
var React = require('react-native');
var {
    StyleSheet,
    TouchableHighlight,
    Text,
    View,
    } = React;
var BottomButton = React.createClass({
    render(){
        return (
            <View style={styles.bottom}>
                <TouchableHighlight style={[styles.radius,styles.button]} activeOpacity={1} underlayColor='#a6c7f2'
                                    onPress={this.props.func}>
                    <Text style={{color:'white',fontSize:18}}>{this.props.content}</Text>
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
        backgroundColor: '#44bcbc',
        height: 47,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
})
module.exports = BottomButton;

