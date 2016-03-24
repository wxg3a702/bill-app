/**
 * Created by ljchen on 16/2/19.
 */

var React = require('react-native');
var {
    Dimensions,
    Image,
    View,
    TouchableOpacity,
    Text
    } = React;
var Swiper = require('../../comp/utils/swiper')

var Demo = React.createClass({

    getInitialState(){
        return {stepOne: false};
    },

    changeClickFlag(){
        this.setState({stepOne: true});
    },

    renderSkipBottom(){
        return (
            <TouchableOpacity onPress={()=>this.props.navigator.pop()}>
                <Text
                    style={{color:'#ff5b58',marginRight:10,borderRadius:5,paddingLeft:10,paddingRight:10,paddingTop:5,paddingBottom:5,fontSize:16,borderWidth:2,borderColor:'#ff5b58'}}>{"跳过"}</Text>
            </TouchableOpacity>
        );
    },
    renderFinishBottom(){
        return (
            <TouchableOpacity onPress={()=>this.props.navigator.pop()}>
                <Text
                    style={{color:'#ff5b58',marginRight:10,borderRadius:5,paddingLeft:10,paddingRight:10,paddingTop:5,paddingBottom:5,fontSize:16,borderWidth:2,borderColor:'#ff5b58'}}>{"结束"}</Text>
            </TouchableOpacity>
        );
    },
    renderSwiperPage(url){
        var {height, width} = Dimensions.get('window');
        return (
            <Image style={{width:width,height:height}} resizeMode="stretch" source={url}>
                <View style={{marginTop:28,flexDirection:'column'}}>
                    <View style={{justifyContent:'flex-end',flexDirection:'row',flex:1}}>
                        {this.renderSkipBottom()}
                    </View>
                </View>
            </Image>
        )
    },
    renderSwiperPageFinish(url){
        var {height, width} = Dimensions.get('window');
        return (
            <Image style={{width:width,height:height}} resizeMode="stretch" source={url}>
                <View style={{marginTop:28,flexDirection:'column'}}>
                    <View style={{justifyContent:'flex-end',flexDirection:'row',flex:1}}>
                        {this.renderFinishBottom()}
                    </View>
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


module.exports = Demo;
