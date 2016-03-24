'use strict';

var React = require('react-native');
var {
    StyleSheet,
    View,
    Image,
    Text
    } = React;

var BottomButton = require('../../comp/utilsUi/bottomButton')
var NavBarView = require('../../framework/system/navBarView')
var CertifySuccess = React.createClass({
    toPersonalCenter(){
        var routes = this.props.navigator.getCurrentRoutes();
        this.props.navigator.popToRoute(routes[routes.length - 5]);
    },

    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="认证提交成功">
                <View style={{flex:1,alignItems:'center'}}>
                    <Image style={{marginTop:100,width:300,height:300}}
                           source={require("../../image/company/apply_success.png")}/>
                    <Text style={{marginTop:20,color:"#CCCCCC"}}>资料提交成功,请耐心等待认证结果</Text>
                </View>
                <BottomButton func={this.toPersonalCenter} content="返回个人中心"/>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
    bottom: {
        padding: 7, backgroundColor: '#f7f7f7', borderTopWidth: 1, borderTopColor: '#cccccc', opacity: 0.9
    },
    borderBottom: {
        borderBottomWidth: 1, borderColor: '#c8c7cc'
    },
    radius: {
        borderRadius: 6
    },
    button: {
        backgroundColor: '#44bcbc',
        height: 47,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
})
module.exports = CertifySuccess;