///**
// * Created by ljchen on 16/1/20.
// */
//var React = require('react-native');
//var rebound = require('rebound');
//var {Animated,View,TouchableWithoutFeedback,Image} = React;
//class Playground extends React.Component {
//    constructor(props: any) {
//        super(props);
//        this.state = {
//            bounceValue: new Animated.Value(0),
//        };
//    }
//    render(): ReactElement {
//        return (
//            <Animated.Image                         // 可选的基本组件类型: Image, Text, View
//                source={require('../../resource/img/billpack/payee_new.png')}
//                style={{
//          flex: 1,
//          transform: [                        // `transform`是一个有序数组（动画按顺序执行）
//            {scale: this.state.bounceValue},  // 将`bounceValue`赋值给 `scale`
//          ]
//        }}
//            />
//        );
//    }
//    componentDidMount() {
//        this.state.bounceValue.setValue(1.5);     // 设置一个较大的初始值
//        Animated.decay(                          // 可选的基本动画类型: spring, decay, timing
//            this.state.bounceValue,                 // 将`bounceValue`值动画化
//            {
//                velocity: {x: gestureState.vx, y: gestureState.vy}, // 根据用户的手势设置速度
//                deceleration: 0.997,
//            }
//        ).start();                                // 开始执行动画
//    }
//}
//
////var Playground = React.createClass({
////    // 首先我们初始化一个spring动画，并添加监听函数，
////    // 这个函数会在spring更新时调用setState
////    componentWillMount() {
////        // 初始化spring
////        this.springSystem = new rebound.SpringSystem();
////        this._scrollSpring = this.springSystem.createSpring();
////        var springConfig = this._scrollSpring.getSpringConfig();
////        springConfig.tension = 230;
////        springConfig.friction = 10;
////
////        this._scrollSpring.addListener({
////            onSpringUpdate: () => {
////                this.setState({scale: this._scrollSpring.getCurrentValue()});
////            },
////        });
////
////        // 将spring的初始值设为1
////        this._scrollSpring.setCurrentValue(1);
////        this._scrollSpring.setOvershootClampingEnabled(true);
////    },
////
////    _onPressIn() {
////        this._scrollSpring.setEndValue(0.5);
////    },
////
////    _onPressOut() {
////        this._scrollSpring.setEndValue(1);
////    },
////
////    render: function() {
////        var imageStyle = {
////            width: 250,
////            height: 200,
////            transform: [{scaleX: this.state.scale}, {scaleY: this.state.scale}],
////        };
////
////
////
////        return (
////            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
////                <TouchableWithoutFeedback onPressIn={this._onPressIn}
////                                          onPressOut={this._onPressOut}>
////                    <Image source={require('../../resource/img/billpack/payee_new.png')} style={imageStyle} />
////                </TouchableWithoutFeedback>
////            </View>
////        );
////    }
////});
//
//module.exports = Playground;
//'use strict';
//
//var React = require('react-native');
//var {
//    Animated,
//    Image,
//    PanResponder,
//    StyleSheet,
//    View,
//    } = React;
//
//class Playground extends React.Component {
//    constructor(props) {
//        super(props);
//        this.state = {
//            stickers: [new Animated.ValueXY()],                    // 1 leader
//        };
//        var stickerConfig = {tension: 2, friction: 3};           // soft spring
//        for (var i = 0; i < 4; i++) {                            // 4 followers
//            var sticker = new Animated.ValueXY();
//            Animated.spring(sticker, {
//                ...stickerConfig,
//                toValue: this.state.stickers[i],                     // Animated toValue's are tracked
//            }).start();
//            this.state.stickers.push(sticker);                     // push on the followers
//        }
//        var releaseChain = (e, gestureState) => {
//            // TODO: use sequence after fixing parallel + tracking
//            Animated.decay(this.state.stickers[0], {
//                velocity: {x: gestureState.vx, y: gestureState.vy},
//                deceleration: 0.997,
//            }).start((finished) => {
//                if (finished) {
//                    this.state.stickers[0].setOffset({x: 0, y: 0});    // reset to original coordinates
//                    Animated.spring(this.state.stickers[0], {
//                        toValue: {x: 0, y: 0}                            // return to start
//                    }).start();
//                }
//            });
//        };
//        this.state.chainResponder = PanResponder.create({
//            onStartShouldSetPanResponder: () => true,
//            onPanResponderGrant: () => {
//                this.state.stickers[0].stopAnimation((value) => {
//                    this.state.stickers[0].setOffset(value);           // start where sticker animated to
//                    this.state.stickers[0].setValue({x: 0, y: 0});     // avoid flicker before next event
//                });
//            },
//            onPanResponderMove: Animated.event(
//                [null, {dx: this.state.stickers[0].x, dy: this.state.stickers[0].y}] // map gesture to leader
//            ),
//            onPanResponderRelease: releaseChain,
//            onPanResponderTerminate: releaseChain,
//        });
//    }
//
//    render() {
//        return (
//            <View style={styles.chained}>
//                {this.state.stickers.map((_, i) => {
//                    var j = this.state.stickers.length - i - 1; // reverse so leader is on top
//                    var handlers = (j === 0) ? this.state.chainResponder.panHandlers : {};
//                    return (
//                        <Animated.Image
//                            {...handlers}
//                            source={CHAIN_IMGS[j]}
//                            style={[styles.sticker, {left:(1+j)*100},{
//                transform: this.state.stickers[j].getTranslateTransform(), // simple conversion
//              }]}
//                        />
//                    );
//                })}
//            </View>
//        );
//    }
//}
//
//var styles = StyleSheet.create({
//    chained: {
//        alignSelf: 'flex-end',
//        top: 10,
//        right:500
//    },
//    sticker: {
//        position: 'absolute',
//        height: 120,
//        width: 120,
//        backgroundColor: 'transparent',
//    },
//});
//
//var CHAIN_IMGS = [
//    require('../../resource/img/billpack/payee_new.png'),
//    require('../../resource/img/billpack/payee_ign.png'),
//    require('../../resource/img/billpack/payee_dis.png'),
//    require('../../resource/img/billpack/payee_req.png')
//];
//
//module.exports = Playground;

'use strict';

var _ = require('lodash');

console.log(_.isEmpty(null));
console.log(_.isEmpty(undefined));
console.log(_.isEmpty(""));