var React = require('react-native')
var Icon = require('react-native-vector-icons/FontAwesome');
var VIcon = React.createClass({
    getDefaultProps(){
        return {
            size: 24,
            color: 'blue',
            direction: 'right'
        }
    },

    direction(){
        switch (this.props.direction) {
            case 'left':
                return 'chevron-left'
            case 'right':
                return 'chevron-right'
        }
    },

    render(){
        return (
            <Icon name={this.direction()} size={this.props.size} style={{marginRight:6}} color={this.props.color}/>
        )
    }
})
module.exports = VIcon