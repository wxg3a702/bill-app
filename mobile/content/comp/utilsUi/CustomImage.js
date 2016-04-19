'use strict'

var React = require('react-native');
var {
  Text,
  TouchableOpacity,
  Image,
  Platform
  } = React;

var GiftedSpinner = require('../listView/GiftedSpinner');

var CustomImage = React.createClass({

  propTypes: {
    source: React.PropTypes.string.isRequired,
    loadView: React.PropTypes.func,
    centerText: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      centerText: ''
    };
  },

  getInitialState() {
    return {
      loadError: false,
      loading: false,
      ts: new Date().getTime()
    };
  },

  _onPress() {
    if (this.state.loadError) {
      this._onRefresh();
    } else {
      if (this.props.onPress) {
        this.props.onPress();
      }
    }
  },

  _onRefresh() {
    this.setState({
      ts: new Date().getTime()
    });
  },

  _renderPrompt() {
    if (this.state.loading) {
      return (
        <GiftedSpinner style={{height: 36,flex: 1, alignSelf: 'stretch'}} color="#44bcb2"/>
      );
    }

    if (this.state.loadError) {
      return (
        <Text style={{color: '#44bcb2'}}> ↻ 重新获取</Text>
      );
    }

    if (this.props.centerText) {
      return (
        <Text style={{fontSize:11,color:'white'}}>{this.props.centerText}</Text>
      );
    }
  },

  render () {
    return (
      <TouchableOpacity
        style={this.props.style}
        underlayColor="#ebf1f2"
        activeOpacity={0.6}
        onShowUnderlay={this.props.onShowUnderlay}
        onHideUnderlay={this.props.onHideUnderlay}
        onPress={this._onPress}
      >
        <Image
          style={this.props.imageStyle}
          onLoadStart={() => this.setState({ loading: true })}
          onLoad={() => this.setState({ loading: false, loadError: false })}
          onError={() => this.setState({ loading: false, loadError: true })}
          //defaultSource={require('image!loading')}
          source={{uri: this.props.source.indexOf("_userId") > -1 ? this.props.source + '&ts=' + this.state.ts : this.props.source}}
        >
          {this._renderPrompt()}
        </Image>
      </TouchableOpacity>
    );
  }
});

module.exports = CustomImage;