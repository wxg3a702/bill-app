'use strict'
var React = require('react-native')
var {
    View,
    Text,
    Switch,
    StyleSheet
    }=React
var NavBarView = require('../../framework/system/navBarView')
var Space = require('../../comp/utilsUi/space')
var Notice = React.createClass({
    getInitialState(){
        return {
            bill: true,
            vocation: true
        }
    },
    render(){
        return (
            <NavBarView navigator={this.props.navigator} title="系统通知设置">
                <Space/>
                <View style={styles.layout}>
                    <View>
                        <Text style={{fontSize:18}}>收到的票据</Text>
                        <Text style={{fontSize:15,color:'#cccccc',marginTop:8}}>收到的票据相关业务通知</Text>
                    </View>
                    <Switch value={this.state.bill} onValueChange={(text)=>this.setState({bill: text})}/>
                </View>
                <View style={styles.layout}>
                    <View>
                        <Text style={{fontSize:18}}>行业动态</Text>
                        <Text style={{fontSize:15,color:'#cccccc',marginTop:8}}>为您精选的行业动态和通知</Text>
                    </View>
                    <Switch value={this.state.vocation} onValueChange={(text)=>this.setState({vocation: text})}/>
                </View>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
    layout: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        height: 60,
        backgroundColor: 'white',
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1
    }
})
module.exports = Notice