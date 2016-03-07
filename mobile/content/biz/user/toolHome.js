'use strict';

var React = require('react-native');
var {
    Image,
    StyleSheet,
    TouchableHighlight,
    Text,
    View,
    } = React;
var {Icon,} = require('react-native-icons');
var NoRisk = require('./noRisk')
var NavBarView = require('../../framework/system/navBarView')
var Calculator = require('./calculator')
var ToolHome = React.createClass({
    getInitialState: function () {
        return {};
    },
    toOther(name){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({comp: name})
        }
    },
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="工具" contentBackgroundColor='#f0f0f0'>
                <View style={[styles.flexColumn,{marginTop:18,backgroundColor:'white'}]}>
                    <TouchableHighlight activeOpacity={0.8} underlayColor='#cccccc' onPress={()=>this.toOther(Calculator)}>
                        <View
                            style={[styles.flexRow,styles.listLayout,styles.borderTop,styles.borderBottom,styles.between,{alignItems:'center'}]}>
                            <View style={[styles.flexOne,styles.flexRow]}>
                                <Image style={styles.circle} source={require('../../image/user/calculator.png')}/>
                                <View style={{marginLeft:16}}>
                                    <Text style={styles.title}>贴现利率计算器</Text>
                                </View>
                            </View>
                            <Icon name='ion|ios-arrow-forward' size={26} color='C7C7CC' style={styles.icon}/>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight activeOpacity={0.8} underlayColor='#cccccc' onPress={()=>this.toOther(NoRisk)}>
                        <View
                            style={[styles.flexRow,styles.listLayout,styles.borderBottom,styles.between,{alignItems:'center'}]}>
                            <View style={[styles.flexOne,styles.flexRow]}>
                                <Image style={styles.circle}
                                       source={require('../../image/user/riskNotesSearch.png')}/>
                                <View style={{marginLeft:16}}>
                                    <Text style={styles.title}>风险票据查询</Text>
                                </View>
                            </View>
                            <Icon name='ion|ios-arrow-forward' size={26} color='C7C7CC' style={styles.icon}/>
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
        height: 51, paddingLeft: 16,
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
        fontSize: 12,
        color: '#7f7f7f',
    },
    circle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginTop: 1
    },
    title:{
        fontSize:18
    }
})
module.exports = ToolHome;