'use strict';

var React = require('react-native');
var {
    Image,
    TouchableHighlight,
    Text,
    View,
    StyleSheet,
    Dimensions
    } = React;

var VIcon = require('../icon/vIcon');
var ScreenWindow = Dimensions.get('window');

var Item = React.createClass({
    getDefaultProps(){
        return {
            img: true,
            top: false,
            icon: true,
            detailEnable: true,
        }
    },

    returnImg(){
        if (this.props.img) {
            return (
                <Image style={styles.circle} source={this.props.imgPath}/>
            )
        }
    },

    returnRightDetailText(){
        if (this.props.detailEnable) {

        }
    },

    returnIcon(){
        if (this.props.icon) {
            return <VIcon/>
        } else {
            return <View style={{width:22}}/>
        }
    },

    render(){
        return (
            <TouchableHighlight activeOpacity={0.8} underlayColor='#cccccc' onPress={this.props.func}>
                <View style={[styles.listLayout,this.props.top && styles.borderTop]}>

                    <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                        {this.returnImg()}
                        <Text style={styles.title} numberOfLines={1}>{this.props.desc}</Text>
                    </View>

                    <View style={[{flexDirection:'row',alignItems:'center'},{justifyContent:'space-between'}]}>
                        {
                            this.props.detailEnable ?
                                <Text
                                    style={[{fontSize: 15,color: '#7f7f7f',width:ScreenWindow.width-220,textAlign:'right'}]}
                                    numberOfLines={1}
                                >
                                    {this.props.value}
                                </Text> :
                                <Text/>
                        }
                    </View>

                    {this.returnIcon()}

                </View>
            </TouchableHighlight>
        )
    }
})
var styles = StyleSheet.create({
    borderTop: {
        borderTopWidth: 1,
    },
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
        marginTop: 1,
        marginRight: 16
    },
    title: {
        fontSize: 18,
        color: '#323232',
        width: Dimensions.get('window').width - 20
    },
})
module.exports = Item;