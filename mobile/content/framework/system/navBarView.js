'use strict';

var React = require('react-native');
var {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Platform
    } = React;
var AppStore = require('../store/appStore');
var RequestState = require('../../constants/requestState');
var VIcon = require('../../comp/icon/vIcon')
var ProgressHUD = require('react-native-progress-hud');
var dismissKeyboard = require('react-native-dismiss-keyboard');
var Alert = require('../../comp/utils/alert');
var NavBarView = React.createClass({
    mixins: [ProgressHUD.Mixin],
    curRoute: null,

    componentDidMount() {
        AppStore.addChangeListener(this._onChange, "rpc");
        this.curRoute = this.props.navigator.getCurrentRoutes().slice().pop();
    },

    componentWillUnmount: function () {
        AppStore.removeChangeListener(this._onChange, "rpc");
        this.curRoute = this.props.navigator.getCurrentRoutes().slice().pop();
    },
    _onChange: function () {
        var route = this.props.navigator.getCurrentRoutes().slice().pop();
        var cur = this.props.navigator.cur;
        if (cur == this.curRoute.comp || route.comp == "login") {
            if (!this.props.customLoading) {
                switch (AppStore.requestLoadingState()) {
                    case RequestState.START:
                        this.showProgressHUD();
                        break;
                    case RequestState.END:
                        this.dismissProgressHUD();
                        new Promise(function (res, rej) {
                            res()
                        }).then(function () {
                            AppStore.requestHandle()();
                        }).catch(function (e) {
                            Alert("系统异常")
                        })
                        break;
                    default:
                }
            }
        }
    },

    getDefaultProps() {
        return {
            color: '#00c0b2',
            backgroundColor: '#f7f7f7',
            fontColor: "#333333",
            contentBackgroundColor: '#f0f0f0',
            actionButton: null,
            customLoading: false,
            showBack: true,
            navBarBottomWidth: 1,
            showBar: true
        }
    },
    showLoading(){
        this.showProgressHUD();
    },

    hideLoading(){
        this.dismissProgressHUD();

    },
    getContainerHandle(){
        return {
            showLoading: this.showLoading,
            hideLoading: this.hideLoading
        }
    },

    getBack(){
        if (this.props.showBack) {
            return (
                <TouchableOpacity
                    style={{flex:1,justifyContent:"center",alignItems:"flex-start" ,paddingLeft:10}}
                    onPress={() => {this.props.navigator.pop()}}>
                    <VIcon
                        direction='left'
                        size={30}
                        color={this.props.fontColor}
                        style={{width:35,height:35}}
                    />
                </TouchableOpacity>
            );
        }
    },

    render(){
        return (
            <View style={{flex:1}} onStartShouldSetResponder={()=>dismissKeyboard()}>
                {
                    (()=> {
                        if (this.props.showBar) {
                            return (
                                <View
                                    style={[{flexDirection: 'row',backgroundColor:this.props.backgroundColor,borderBottomWidth:this.props.navBarBottomWidth, borderColor: '#c8c7cc'},styles.comStyle]}>
                                    <View style={{width:70,justifyContent:"center",alignItems:"stretch"}}>
                                        {this.getBack()}
                                    </View>
                                    <View style={{flex:1,justifyContent:"center",alignItems:"center", width:120}}>
                                        <Text numberOfLines={1} style={{fontSize:18,color:this.props.fontColor, justifyContent:"center"}}>
                                            {this.props.title}
                                        </Text>
                                    </View>
                                    <View style={{width:70,justifyContent:"center",alignItems:"stretch",paddingRight:10}}>
                                        {this.props.actionButton}
                                    </View>
                                </View>
                            )
                        }
                    }).bind(this)()
                }

                <View style={{flex:1}} backgroundColor={this.props.contentBackgroundColor}>
                    {this.props.children}
                </View>

                <ProgressHUD
                    isVisible={this.state.is_hud_visible}
                    isDismissible={false}
                    overlayColor="rgba(0, 0, 0, 0)"/>
            </View>
        )
    }
})
var styles = StyleSheet.create({
    comStyle: {
        height: (Platform.OS === 'ios') ? 64 : 44,
        paddingTop: (Platform.OS === 'ios') ? 20 : 0
    },
})
module.exports = NavBarView;