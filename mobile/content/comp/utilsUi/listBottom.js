'use strict';
var React = require('react-native')
var {
    View,
    Platform
    }=React
var ListBottom = React.createClass({
    render(){
        return (
            <View style={{height:Platform.OS === 'ios' ?49:0}}/>
        )
    }
})
module.exports = ListBottom