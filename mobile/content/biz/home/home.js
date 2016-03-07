'use strict';

var React = require('react-native');
var {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Dimensions,
    Image,
    Animated
    }=React
//var Swiper = require('../../comp/utils/swiper')
var Swiper = require('../../comp/utils/swiper')
var Calculator = require('../../biz/user/calculator');
var NavBarView = require('../../framework/system/navBarView');
var {height, width} = Dimensions.get('window');
var Home = React.createClass({
    getInitialState(){
        return {
            aaa: new Animated.Value(0)
        }
    },
    returnSwiper(url){
        return (
            <Image style={{width:width}} resizeMode="stretch" source={url}/>
        )
    },
    createAnimatedComponent(){

    },
    componentDidMount(){
        Animated.timing(            // Uses easing functions
            this.state.aaa,    // The value to drive
            {toValue: 1}            // Configuration
        ).start();
    },
    render(): ReactElement{
        return (
            <NavBarView navigator={this.props.navigator} title="首页" showBack={false} showBar={true}>
                <Animated.View style={{height:30,transform:[{scale: this.state.aaa}]}}>
                    <Text>111</Text>
                    <Text>222</Text>
                </Animated.View>

                <ScrollView automaticallyAdjustContentInsets={false} horizontal={false}>
                    <View style={{flexDirection:'column'}}>
                        <View style={{height:200,backgroundColor:'#44bcbc'}}>
                            <Swiper showsPagination={false} showsButtons={false} autoplay={true} horizontal={true}
                                    loop={true} autoplayTimeout={2}>
                                {this.returnSwiper(require('../../image/home/banner1.png'))}
                                {this.returnSwiper(require('../../image/home/banner2.png'))}
                                {this.returnSwiper(require('../../image/home/banner3.png'))}
                            </Swiper>
                        </View>
                    </View>
                </ScrollView>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({})
module.exports = Home