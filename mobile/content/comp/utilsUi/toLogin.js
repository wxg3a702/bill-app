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
    getDefaultProps(){
        return {
            mar: false
        }
    },
    render(){
        return (
            <TouchableHighlight style={[styles.content,{marginTop:this.props.mar?height-196:height-164}]}
                                onPress={this.props.func} underlayColor="#cccccc">
                <View style={{ flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center', height: 50,padding: 8,}}>
                    <Text style={{fontSize:18}}>你还没有登录</Text>
                    <Text style={{fontSize:18}}>点击去登录</Text>
                </View>
            </TouchableHighlight>
        )
    }
})
var styles = StyleSheet.create({
    content: {
        width: width,
        backgroundColor: 'white'
    }
})
module.exports = ToLogin