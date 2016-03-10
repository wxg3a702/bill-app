'use strict';

var React = require('react-native');
var {
    Image,
    TouchableHighlight,
    Text,
    View,
    StyleSheet
    } = React;
var VIcon = require('../icon/vIcon')
var Item = React.createClass({
    render(){
        return (
            <TouchableHighlight activeOpacity={0.8} underlayColor='#cccccc' onPress={this.props.func}>
                <View style={styles.listLayout}>
                    <View style={{flex:1,flexDirection:'row'}}>
                        <Image style={styles.circle} source={this.props.imgPath}/>
                        <View style={{marginLeft:16}}>
                            <Text style={styles.title}>{this.props.desc}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={[{fontSize: 15,color: '#7f7f7f'}]}>{this.props.value}</Text>
                        <VIcon/>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
})
var styles = StyleSheet.create({
    listLayout: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 51,
        paddingLeft: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: '#c8c7cc'
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
module.exports = Item;