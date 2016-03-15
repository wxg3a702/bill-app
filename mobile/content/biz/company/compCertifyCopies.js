/**
 * Created by vison on 16/3/14.
 */
'use strict';

var React = require('react-native');
var {
    StyleSheet,
    TouchableHighlight,
    CameraRoll,
    Text,
    Image,
    View,
    Dimensions
    } = React;
var CompAccountInfo = require('./compAccountInfo')
var Space = require('../../comp/utils/space')
var BottomButton = require('../../comp/utils/bottomButton')
var VIcon = require('../../comp/icon/vIcon')
var AppStore = require('../../framework/store/appStore');
var CompStore = require('../../framework/store/compStore');
var CompAction = require("../../framework/action/compAction")
var NavBarView = require('../../framework/system/navBarView')
var certificateState = require('../../constants/certificateState');
var Alert = require('../../comp/utils/alert');
var Button = require('../../comp/utils/button')
var CompCertifyCopies = React.createClass({
    getStateFromStores(){
        var orgBean = CompStore.getOrgBeans()[0];
        return orgBean
    },

    getInitialState: function () {
        return this.getStateFromStores();
    },

    componentDidMount() {
        AppStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        AppStore.removeChangeListener(this._onChange);
    },

    _onChange: function () {
        this.setState(this.getStateFromStores());
    },
    addComp(){
        this.props.navigator.push({comp: CompAccountInfo});
    },
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="1.认证资料副本">
                <View style={{flex:1,marginTop:32}}>
                    <View style={{flexDirection:"row",marginHorizontal:12}}>
                        <View style={{flex:1,flexDirection:"column"}}>
                            <Text style={styles.copyName}>营业执照副本</Text>
                            <Image style={[styles.image,styles.radius]}
                                   resizeMode="cover"
                                   source={require('../../image/user/head.png')}/>
                        </View>
                        <View style={{flex:1,flexDirection:"column"}}>
                            <Text style={styles.copyName}>法定代表人身份证</Text>
                            <Image style={[styles.image,styles.radius]}
                                   resizeMode="cover"
                                   source={require('../../image/user/head.png')}/>
                        </View>
                    </View>
                    <View style={{flexDirection:"row",marginTop:10,marginHorizontal:12}}>
                        <View style={{flex:1,flexDirection:"column"}}>
                            <Text
                                style={[styles.copyName,{height:46,marginRight:10}]}>法人授权委托证明书(需盖公章)</Text>
                            <Image style={[styles.image,styles.radius]}
                                   resizeMode="cover"
                                   source={require('../../image/user/head.png')}/>
                        </View>
                        <View style={{flex:1,flexDirection:"column"}}>
                            <Text style={[styles.copyName,{height:46}]}>授权经办人身份证</Text>
                            <Image style={[styles.image,styles.radius]}
                                   resizeMode="cover"
                                   source={require('../../image/user/head.png')}/>
                        </View>
                    </View>
                    <View style={{ marginTop:18, marginLeft:12,flexDirection:"row"}}>
                        <Text style={styles.communicate}>如遇问题,请</Text>
                        <Text style={[styles.communicate,{textDecorationLine:"underline"}]}>联系客服</Text>
                    </View>

                </View>
                <BottomButton func={this.addComp} content="下一步"/>
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
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#C8C8C8"
    },
    button: {
        backgroundColor: '#44bcbc',
        height: 47,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        height: 113,
        width: Dimensions.get("window").width / 2 - 20,
        backgroundColor: "#f0f0f0",
        marginTop: 5
    },
    copyName: {
        alignItems: "center",
        fontSize: 15,
        color:"#333333"
    },
    communicate:{
        fontSize: 15,
        color:"#ff5b58",
    }

})
module.exports = CompCertifyCopies;