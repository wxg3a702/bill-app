'use strict';

var React = require('react-native');
var {
    ListView,
    TouchableHighlight,
    Text,
    View,
    Platform,
    Dimensions,
    Image,
    Modal,
    StyleSheet,
    TouchableOpacity
    } = React;
var {width,height} = Dimensions.get('window');
var ToLogin = React.createClass({
    render(){
        return (
            <TouchableHighlight style={{position:'absolute',left:0,bottom:60}} onPress={this.props.func}>
                <View style={styles.content}>
                    <Text style={{fontSize:18}}>你还没有登陆</Text>
                    <Text style={{fontSize:18}}>点击去登陆</Text>
                </View>
            </TouchableHighlight>
        )
    }
})
var styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width,
        padding: 8,
        height: 50,
        backgroundColor: 'white',
        alignItems: 'center'
    }
})
module.exports = ToLogin