'use strict';

var React = require('react-native');
var {
    StyleSheet,
    Text,
    View,
    } = React;
var NavBarView = require('../../framework/system/navBarView')
var Advantage = React.createClass({
    render(){
        return (
            <NavBarView navigator={this.props.navigator} title="平台优势" contentBackgroundColor='#f0f0f0'>
                <View style={{backgroundColor:'white',padding:20}}>
                    <Text style={styles.fontStyle}>{'    ' + '(1)手续简单：线上办理、操作简单。'}</Text>
                    <Text style={styles.fontStyle}>{'    ' + '(2)贴现自由：几万元、几十万元、几千万元均可操作。'}</Text>
                    <Text style={styles.fontStyle}>{'    ' + '(3)贴现便捷：提交贴现申请后，1个工作日内打款。'}</Text>
                    <Text style={styles.fontStyle}>{'    ' + '(4)利率合理：银行直接贴现，少去中间商。'}</Text>
                    <Text style={styles.fontStyle}>{'    ' + '(5)安全保障：票据由银行代为保管，资金由银行无条件兑付，风险趋零。'}</Text>
                    <Text style={styles.fontStyle}>{'    ' + '(6)0服务费：平台不收取任何服务费。'}</Text>
                </View>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
    fontStyle: {
        fontSize: 16,
        color: '#7f7f7f',
        lineHeight: 25
    }
})
module.exports = Advantage