'use strict';

var React = require('react-native');
var {
    StyleSheet,
    TouchableHighlight,
    Text,
    View,
    } = React;
var VIcon = require('../../comp/icon/vIcon')
var NavBarView = require('../../framework/system/navBarView')
var KeyPoint=require('./keyPoint')
var Instruction=require('./instruction')
var HelpCenter = React.createClass({
    toOther(name){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                comp: name,
            })
        }
    },
    render(){
        return (
            <NavBarView navigator={this.props.navigator} title="帮助中心" contentBackgroundColor='#f0f0f0'>
                <View style={[{flexDirection:'column',marginTop:18,backgroundColor:'white'}]}>
                    <TouchableHighlight underlayColor='#cccccc' activeOpacity={0.8} style={[styles.borderTop,styles.borderBottom]} onPress={()=>this.toOther(Instruction)}>
                        <View style={[{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:10,height:51}]}>
                            <Text style={{fontSize:18,color:'#323232',fontWeight:'bold'}}>使用手册</Text>
                            <VIcon/>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor='#cccccc' activeOpacity={0.8} style={[styles.borderBottom]} onPress={()=>this.toOther(KeyPoint)}>
                        <View style={[{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:10,height:51}]}>
                            <Text style={{fontSize:18,color:'#323232',fontWeight:'bold'}}>热点问题</Text>
                            <VIcon/>
                        </View>
                    </TouchableHighlight>
                </View>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
    borderTop: {
        borderTopWidth: 1,
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderColor: '#c8c7cc'
    },
    icon: {
        width: 35, height: 35,
    },
})
module.exports = HelpCenter