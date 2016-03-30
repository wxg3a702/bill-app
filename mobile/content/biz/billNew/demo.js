/**
 * Created by ljchen on 16/2/19.
 */

var React = require('react-native');
var {
    Dimensions,
    Image,
    View,
    TouchableOpacity,
    Text,
    StyleSheet
} = React;
var {height, width} = Dimensions.get('window');
var Swiper = require('../../comp/utils/swiper')
var PAGES = [
    require('../../image/bill/teach1.png'),
    require('../../image/home/teach2.png'),
    require('../../image/home/teach3.png'),
    require('../../image/home/teach4.png'),
    require('../../image/home/teach5.png'),
    require('../../image/home/teach6.png')
];
var Demo = React.createClass({

    getInitialState(){
        return {
            stepOne: false
        };
    },

    changeClickFlag(){
        this.setState({
            stepOne: true
        });
    },

    renderSkipBottom(){
        return (
            <TouchableOpacity onPress={()=>this.props.navigator.pop()}>
                <Text style={styles.layout}>跳过</Text>
            </TouchableOpacity>
        );
    },
    renderFinishBottom(){
        return (
            <TouchableOpacity onPress={()=>this.props.navigator.pop()}>
                <Text style={styles.layout}>结束</Text>
            </TouchableOpacity>
        );
    },
    renderSwiperPage(url){

        return (
            <Image style={{width:width,height:height}} resizeMode="stretch" source={url}>
                <View style={{justifyContent:'flex-end',flexDirection:'row',flex:1,marginTop:28}}>
                    {this.renderSkipBottom()}
                </View>
            </Image>
        )
    },
    renderSwiperPageFinish(url){
        return (
            <Image style={{width:width,height:height}} resizeMode="stretch" source={url}>
                <View style={{justifyContent:'flex-end',flexDirection:'row',flex:1,marginTop:28}}>
                    {this.renderFinishBottom()}
                </View>
            </Image>
        )
    },

    render(){
        return (
            <Swiper showsPagination={false} showsButtons={true} autoplay={false} horizontal={true} loop={false}
                    autoplayTimeout={2}>
                {this.renderSwiperPage(require('../../image/bill/teach1.png'))}
                {this.renderSwiperPage(require('../../image/bill/teach2.png'))}
                {this.renderSwiperPage(require('../../image/bill/teach3.png'))}
                {this.renderSwiperPage(require('../../image/bill/teach4.png'))}
                {this.renderSwiperPage(require('../../image/bill/teach5.png'))}
                {this.renderSwiperPageFinish(require('../../image/bill/teach6.png'))}
            </Swiper>
        );
    }
});
var styles = StyleSheet.create({
    layout: {
        color: '#ff5b58',
        marginRight: 10,
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        fontSize: 16,
        borderWidth: 2,
        borderColor: '#ff5b58'
    }
})

module.exports = Demo;
