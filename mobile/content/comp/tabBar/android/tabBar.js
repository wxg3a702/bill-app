'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Animated,
  } = React;

//var { Icon, } = require('react-native-icons');
var Icon = require('react-native-vector-icons/Ionicons');
var styles = StyleSheet.create({

  tabWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },

  tabs: {
    height: 50,
    flexDirection: 'row',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopColor: '#7f7f7f',
    backgroundColor: '#ffffff'
  },
  badgeNoNumber: {
    flexDirection: 'row',
    justifyContent: 'center',
    top: 4,
    right: 24,
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    borderColor: '#ffffff',
    backgroundColor: '#ff0000',
  },
  badgeWithNumber: {
    flexDirection: 'row',
    justifyContent: 'center',
    top: 4,
    right: 24,
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#ffffff',
    backgroundColor: '#ff0000',
  },
  badgeText: {
    alignSelf: 'center',
    fontSize: 11,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});

var AndroidTabBar = React.createClass({
  selectedTabIcons: [],
  unselectedTabIcons: [],

  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array
  },

  getInitialState() {
    return {
      selected: this.props.activeTab
    };
  },

  initBadge(tab) {
    if (tab.badgeNum) {
      let _badgeStyle = (typeof tab.badgeNum == 'number') ? styles.badgeWithNumber : styles.badgeNoNumber;
      return (
        <View style={_badgeStyle}>
          <Text style={styles.badgeText}>{tab.badgeNum}</Text>
        </View>
      );
    } else {
      return null;
    }
  },

  renderTabOptionIcon(tab, page){
    var isTabActive = this.state.selected === page;

    if (isTabActive) {
      return (
        <View style={[styles.tabWrap]}>
          <Image source={tab.selectedIcon} style={{width: 30, height: 30}} />
          <Text style={{color:'#44bcb2',fontSize:10}}>{tab.label}</Text>
          {this.initBadge(tab)}
        </View>
      )
    } else {
      return (
        <View style={[styles.tabWrap]}>
          <Image source={tab.icon} style={{width: 30, height: 30}} />
          <Text style={{color:'#7f7f7f',fontSize:10}}>{tab.label}</Text>
          {this.initBadge(tab)}
        </View>
      )
    }
  },

  _goToPage(tab, page){
    this.setState({
      selected: page
    })
    this.props.goToPage(page)

  },

  renderTabOption(tab, page) {
    var isTabActive = this.props.activeTab === page;

    return (
      <TouchableWithoutFeedback key={tab.label} onPress={() => this._goToPage(tab, page)} style={[styles.tab]}>
        {this.renderTabOptionIcon(tab, page)}


      </TouchableWithoutFeedback>
    );
  },

  componentDidMount() {

    this.setAnimationValue({value: this.props.activeTab});

  },

  setAnimationValue({value}) {
    if (this.props.activeTab != this.state.selected) {
      this.setState({
        selected: this.props.activeTab
      })
    }

    var currentPage = this.props.activeTab;

  },

  render() {
    var containerWidth = this.props.containerWidth;
    var numberOfTabs = this.props.tabs.length;
    var tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: 3,
      backgroundColor: '#3b5998',
      bottom: 0,
    };

    var left = this.props.scrollValue.interpolate({
      inputRange: [0, 1], outputRange: [0, containerWidth / numberOfTabs]
    });

    return (
      <View>
        <View style={styles.tabs}>
          {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
        </View>

      </View>
    );
  },
});

module.exports = AndroidTabBar;
