var React = require('react-native')
var Icon = require('react-native-vector-icons/Ionicons');
var VIcon = React.createClass({
    getDefaultProps(){
        return {
            size: 26,
            color: 'black',
            direction: 'right'
        }
    },

    direction(){
        switch (this.props.direction) {
            case 'left':
                return 'ios-arrow-back'
            case 'right':
                return 'ios-arrow-right'
            case 'down':
                return 'ios-arrow-down'
            case 'load':
                return 'load-a'
        }
    },

    render(){
        return (
            <Icon name={this.direction()} size={this.props.size} style={{marginRight:6,marginLeft:6}} color={this.props.color}/>
        )
    }
})
module.exports = VIcon