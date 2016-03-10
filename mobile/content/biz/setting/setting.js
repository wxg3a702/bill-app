'use strict';

var React = require('react-native');
var {
    Image,
    StyleSheet,
    TouchableHighlight,
    Text,
    View,
    } = React;
var VIcon = require('../../comp/icon/vIcon')
var NavBarView = require('../../framework/system/navBarView')
var Setting = React.createClass({
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="设置">
                <View style={[styles.flexColumn,{marginTop:18,backgroundColor:'#eef3fa'}]}>
                    <TouchableHighlight activeOpacity={0.8} underlayColor='#cccccc' onPress={this.toEditPhone}>
                        <View
                            style={[styles.flexRow,styles.between,styles.listLayout,styles.borderTop,styles.borderBottom,{alignItems:'center'}]}>
                            <View style={[styles.flexOne,styles.flexRow]}>
                                <Image style={styles.circle}
                                       source={require('../../image/user/editPhone.png')}/>
                                <View style={{marginLeft:16}}>
                                    <Text style={styles.title}>消息通知设置</Text>
                                </View>
                            </View>
                            <VIcon/>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight activeOpacity={0.8} underlayColor='#cccccc' onPress={this.toEditPassword}>
                        <View
                            style={[styles.flexRow,styles.between,styles.listLayout,styles.borderBottom,{alignItems:'center'}]}>
                            <View style={[styles.flexOne,styles.flexRow,{alignItems:'center'}]}>
                                <Image style={styles.circle} source={require('../../image/user/editPwd.png')}/>
                                <View style={{marginLeft:16}}>
                                    <Text style={styles.title}>安全设置</Text>
                                </View>
                            </View>
                            <VIcon/>
                        </View>
                    </TouchableHighlight>
                </View>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
    flexOne: {
        flex: 1
    },
    flexColumn: {
        flexDirection: 'column'
    },
    flexRow: {
        flexDirection: 'row'
    },
    listLayout: {
        height: 51, paddingLeft: 16, backgroundColor: 'white'
    },
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
    between: {
        justifyContent: 'space-between'
    },
    date: {
        fontSize: 15,
        color: '#7f7f7f',
    },
    circle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginTop: 1
    },
    title: {
        fontSize: 18,
        color: '#323232'
    },
})
module.exports = Setting;