'use strict';

var React = require('react-native');
var {
    View,
    StyleSheet,
    Text,
    ScrollView
    }=React
var NavBarView = require('../../framework/system/navBarView');
var Home = React.createClass({
    render(){
        return(
            <NavBarView navigator={this.props.navigator} title="首页" showBack={false} showBar={true}>
                <ScrollView  automaticallyAdjustContentInsets={false} horizontal={false}>

                </ScrollView>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
})
module.exports = Home