var React = require('react-native');
var {
    View,
    StyleSheet
    } = React;
var Space = React.createClass({
    getDefaultProps(){
        return {
            top: true,
            bottom: true
        }
    },
    render(){
        return (
            <View style={[styles.border,this.props.top && styles.borderTop,this.props.bottom && styles.borderBottom]}></View>
        )
    }
})
var styles = StyleSheet.create({
    borderTop: {
        borderTopWidth: 1,
    },
    borderBottom: {
        borderBottomWidth: 1,
    },
    border: {
        borderColor: '#c8c7cc',
        height: 23,
        backgroundColor: '#f7f7f7'
    }
})
module.exports = Space;