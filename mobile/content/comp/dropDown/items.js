const React = require('react-native');

const {
  Dimensions,
  StyleSheet,
  Component,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Text
} = React;

const window = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollView: {
    height: 24,
    width: 198 //TODO: this needs to be dynamic
  },
  container: {
    position: 'absolute',

  }
})

class Items extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { items, positionX, positionY, show, onPress, width, height } = this.props;

    if (!show) {
      return null;
    }

    const renderedItems = React.Children.map(items, (item) => {

      return (
        <TouchableWithoutFeedback onPress={() => onPress(item.props.children, item.props.value) }>
          <View style={{ padding: 10 ,backgroundColor:"rgba(255,255,255,0.8)",backgroundColor: 'transparent',borderBottomWidth:1,borderColor:'#dfdfdf'}}>
            <Text>{item.props.children}</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    });

    return (
      <View style={[styles.container, { top: positionY, left: positionX}]}>
        <ScrollView
          style={{ width: width - 2, height: height * 3 ,opacity: 0.5,borderTopColor:'#d9d9d9',borderTopWidth:1}}
          automaticallyAdjustContentInsets={false}
          bounces={false}>
          {renderedItems}
        </ScrollView>
      </View>
    );
  }
}

Items.propTypes = {
  positionX: React.PropTypes.number,
  positionY: React.PropTypes.number,
  show: React.PropTypes.bool,
  onPress: React.PropTypes.func
};

Items.defaultProps = {
  width: 0,
  height: 0,
  positionX: 0,
  positionY: 0,
  show: false,
  onPress: () => {}
};

module.exports = Items;
