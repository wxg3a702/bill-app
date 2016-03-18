'use strict'
var React = require('react-native')
var {
    View,
    StyleSheet,
    Dimensions,
    Text
    }=React
var Adjust=require('../../comp/utils/adjust')
var {width,height} = Dimensions.get('window');
var Circle = React.createClass({
    getDefaultProps(){
        return {
            now: false,
            content: '',
            date: ''
        }
    },
    render(){
        if (!this.props.now) {
            return (
                <View style={{backgroundColor:'white',height:50}}>
                    <View style={styles.line}/>
                    <View style={[{borderColor:'rgb(219,219,219)'},styles.circle1]}/>
                    <View style={[{backgroundColor:'rgb(208,208,208)'},styles.circle2]}/>
                    <View style={[{backgroundColor:'rgb(172,172,172)'},styles.circle3]}/>
                    <View style={{flexDirection:'row'}}>
                        <Text style={styles.content}>{this.props.content}</Text>
                    </View>
                    <Text style={styles.date}>{this.props.date}</Text>
                </View>
            )
        } else {
            return (
                <View style={{backgroundColor:'white',height:50}}>
                    <View style={styles.line}/>
                    <View style={[{borderColor:'rgb(201,229,171)'},styles.circle1]}/>
                    <View style={[{backgroundColor:'rgb(201,229,171)'},styles.circle2]}/>
                    <View style={[{backgroundColor:'rgb(146,202,89)'},styles.circle3]}/>
                    <Text style={styles.content}>{this.props.content}</Text>
                    <Text style={styles.date}>{this.props.date}</Text>
                </View>
            )
        }
    }
})
var styles = StyleSheet.create({
    circle1: {
        width: 20, height: 20, borderRadius: 10, borderWidth: 0.5, position: 'absolute', left: 2, top: 0
    },
    circle2: {
        width: 17, height: 17, borderRadius: 8.5, position: 'absolute', left: 3.5, top: 1.5
    },
    circle3: {
        width: 11, height: 11, borderRadius: 5.5, position: 'absolute', left: 6.5, top: 4.5
    },
    line: {
        width: 1, height: 45, backgroundColor: 'rgb(229,229,229)', position: 'absolute', left: 12, top: 10
    },
    content: {
        position: 'absolute', top: 1, left: 32, width: width - Adjust.width(125), fontSize: 15, color: '#7f7f7f'
    },
    date: {
        position: 'absolute', top: 1, left: width - Adjust.width(75), fontSize: 13, color: '#7f7f7f'
    }
})
module.exports = Circle;