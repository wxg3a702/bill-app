'use strict';
var React = require('react-native');
var {
    View,
    } = React;
var CompAction = require("../../framework/action/compAction")
var NavBarView = require('../../framework/system/navBarView')
var EditComp = React.createClass({
    render(){
        return (
            <NavBarView navigator={this.props.navigator} title="公司">
                
            </NavBarView>
        )
    }
})
module.exports = EditComp;