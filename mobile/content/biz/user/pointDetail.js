'use strict';

var React = require('react-native');
var {
    StyleSheet,
    Text,
    View,
    } = React;
var NavBarView = require('../../framework/system/navBarView')
var pointDetail = React.createClass({
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title='热点问题' contentBackgroundColor='#f0f0f0'>
                <View style={{backgroundColor:'white',padding:10,borderBottomWidth: 0.5, borderColor: '#c8c7cc'}}>
                    <View style={{flexDirection:'column',alignItems:'center'}}>
                        <Text style={{fontSize:18,color:'#7f7f7f'}}>{this.props.param.title}</Text>
                    </View>
                    <View style={{padding:5}}>
                        <Text style={{fontSize:15,lineHeight:20,color:'#7f7f7f'}}>{'      '+this.props.param.content}</Text>
                    </View>
                </View>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({})
module.exports = pointDetail;