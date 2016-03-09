'use strict';

var React = require('react-native');
var {
    Text,
    View,
    Image,
    } = React;
var RightTopButton = require('../../comp/utils/rightTopButton')
var NavBarView = require('../../framework/system/navBarView')
var EditPhoneVerifySuccess = React.createClass({
    button(){
        return (
            <RightTopButton func={this.back} content="返回"/>
        )
    },
    back: function () {
        const { navigator } = this.props;
        if (navigator) {
            navigator.popToTop()
        }
    },
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="修改手机号" actionButton={this.button()}>
                <View style={{flex:1,flexDirection:'column',alignItems:'center',marginTop:40}}>
                    <Image style={{width:137,height:137}} source={require('../../image/user/editPhoneSuccess.png')}/>
                    <Text style={{marginTop:27,fontSize:14,color:'#7f7f7f'}}>修改完成!</Text>
                </View>
            </NavBarView>
        )
    }
})
module.exports = EditPhoneVerifySuccess;