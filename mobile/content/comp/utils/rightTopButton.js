'use strict';

var React = require('react-native');
var {
    TouchableOpacity,
    Text,
    View,
    StyleSheet,
    Image
    } = React;
var RightTopButton = React.createClass({
    getDefaultProps() {
        return {
            content: '',
            color: '#44bcbc'
        }
    },
    render(){
        return (
            <View>
                <TouchableOpacity onPress={this.logout} activeOpacity={0.5} style={styles.layout}>
                    <Image resizeMode="stretch" style={{width:20,height:20}} source={this.props.source}/>
                    <Text style={[{color:this.props.color},styles.font]}>{this.props.content}</Text>
                </TouchableOpacity>
            </View>
        )
    }
})
var styles = StyleSheet.create({
    font: {
        textAlign: 'right',
        marginRight: 5,
        fontSize: 15
    },
    layout: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 20,
        padding: 10
    }

})
module.exports = RightTopButton;