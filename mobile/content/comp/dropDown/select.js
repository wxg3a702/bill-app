const React = require('react-native');
const Option = require('./option');

const {
    Dimensions,
    StyleSheet,
    Component,
    TouchableWithoutFeedback,
    View
    } = React;
var VIcon = require('../../comp/icon/vIcon')
const window = Dimensions.get('window');
const SELECT = 'SELECT';
const styles = StyleSheet.create({
    container: {
        borderColor: '#BDBDC1',
        borderBottomWidth: 2 / window.scale
    }
});

class Select extends Component {
    constructor(props) {
        super(props);
        this.pageX = 0;
        this.pageY = 0;
        let defaultValue = props.defaultValue;
        if (!defaultValue) {
            if (Array.isArray(props.children)) {
                defaultValue = props.children[0].props.children;
            } else {
                defaultValue = props.children.props.children;
            }
        }
        this.state = {
            value: defaultValue,
            arrow: 'down'
        }
    }

    reset() {
        const { defaultValue } = this.props;
        this.setState({value: defaultValue});
    }

    _currentPosition(pageX, pageY) {
        this.pageX = pageX;
        this.pageY = pageY + this.props.height;
    }

    _onPress() {
        const { optionListRef, children, onSelect, width, height } = this.props;

        if (!children.length) {
            return false;
        }

        optionListRef()._show(children, this.pageX, this.pageY, width, height, (item, value = item) => {
            if (item) {
                onSelect(value);
                this.setState({
                    value: '全部'
                });
            }
        });
    }

    render() {
        const { width, height, children, defaultValue, style, styleOption, styleText } = this.props;

        const dimensions = {width, height};

        return (
            <TouchableWithoutFeedback onPress={this._onPress.bind(this)} style={{flex:1,alignSelf:'stretch'}}>
                <View
                    style={{flexDirection: 'row', alignSelf:'stretch',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#d9d9d9'}}>
                    <View ref={SELECT} style={[ {flex:9},style, dimensions ]}>
                        <Option style={ styleOption } styleText={ styleText }>{defaultValue}</Option>
                    </View>
                    <View style={{ flex:1,marginTop:0}}>
                        <VIcon direction={this.state.arrow} size={20} color='000000'/>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

Select.propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    optionListRef: React.PropTypes.func.isRequired,
    onSelect: React.PropTypes.func
};

Select.defaultProps = {
    width: 200,
    height: 40,
    onSelect: () => {
    }
};

module.exports = Select;
