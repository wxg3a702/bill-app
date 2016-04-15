'use strict';

var React = require('react-native');
var {
    StyleSheet,
    View
} = React;
var TestView = React.createClass({


    getInitialState: function () {
        return {
            phone: '021-35885888-2627'
        }
    },
    render: function () {
        return (
            <View style={{backgroundColor: 'red', height: 100, width: 100}}>

            </View>
        )
    }
});
var styles = StyleSheet.create({

});
module.exports = TestView;