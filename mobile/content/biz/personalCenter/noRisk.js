'use strict';

var React = require('react-native');
var {
    StyleSheet,
    Text,
    View,
    Image
    } = React;
var NavBarView = require('../../framework/system/navBarView')
var NoRisk = React.createClass({
    renderDetail(){
        return (
            <View style={{marginTop:65,flexDirection:'column',alignItems:'center'}}>
                <Image style={{width:350,height:200}} resizeMode="stretch"
                       source={require('../../image/user/noRisk.png')}/>
                <Text style={{marginTop:20,fontSize:16,color:'#7f7f7f'}}>前方高能,敬请期待</Text>
            </View>
        )
    },
    render: function () {
        if (typeof (this.props.param) != 'undefined') {
            return (
                <NavBarView navigator={this.props.navigator} title={this.props.param.desc}>
                    {this.renderDetail()}
                </NavBarView>
            )
        } else {
            return (
                <NavBarView navigator={this.props.navigator} title={'风险票据查询'}>
                    {this.renderDetail()}
                </NavBarView>
            )
        }
    }
})
var styles = StyleSheet.create({})
module.exports = NoRisk;