'use strict';

var React = require('react-native');
var {
    Text,
    View,
    Image
    } = React;
var NavBarView = require('../../framework/system/navBarView')
var NoRisk = React.createClass({
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title={this.props.param.desc}>
                <View style={{marginTop:65,alignItems:'center'}}>
                    <Image style={{width:350,height:200}} resizeMode="stretch"
                           source={require('../../image/user/noRisk.png')}/>
                    <Text style={{marginTop:20,fontSize:16,color:'#7f7f7f'}}>前方高能,敬请期待</Text>
                </View>
            </NavBarView>
        )
    }
})
module.exports = NoRisk;