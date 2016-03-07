'use strict';

var React = require('react-native');
var {
    TouchableOpacity,
    Text,
    View,
    } = React;
var RightTopButton = React.createClass({
    getDefaultProps() {
        return {
            title: '',
            content: ''
        }
    },
    render(){
        return (
            <View>
                <TouchableOpacity onPress={this.props.func} style={{padding:10}} activeOpacity={0.5}>
                    <Text style={{color:'#44bcbc',textAlign:'right',marginRight:5,fontSize:15}}>{this.props.content}</Text>
                </TouchableOpacity>
            </View>
        )
    }
})
module.exports = RightTopButton;