'use strict';

var React = require('react-native');
var {
    StyleSheet,
    Image,
    ScrollView,
    Dimensions
    } = React;
var NavBarView = require('../../framework/system/navBarView')
var Instruction = React.createClass({
    render(){
        var {height, width} = Dimensions.get('window');
        return (
            <NavBarView navigator={this.props.navigator} title='使用手册'>
                <ScrollView>
                    <Image style={{width:width,height:8*height}}
                           resizeMode="stretch"
                           source={require('../../image/user/instruction.png')}/>
                </ScrollView>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({});
module.exports = Instruction;