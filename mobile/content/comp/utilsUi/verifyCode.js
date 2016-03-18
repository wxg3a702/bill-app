'use strict';

var React = require('react-native');
var {
    StyleSheet,
    Image,
    TouchableOpacity,
    View,
    TextInput,
    Text,
    ActivityIndicatorIOS,
    Dimensions
    } = React;
var {host}=require('../../framework/network/fetch');
var Alert = require('alert');
var Verify = React.createClass({
    getInitialState(){
        return {
            refresh: new Date().getTime(),
            verify: '',
            load: 'loadding',
            animating: true
        };
    },
    textOnchange: function (text, type) {
        this.setState({[type]: text})
        this.props.onChanged(type, this.state.verify)
    },
    changeVerify: function () {
        this.setState({verify: '', load: 'loadding', refresh: new Date().getTime()});

    },
    reload(){
        this.setState({load: 'loadding'})
    },
    loadSuccess(id){
        this.setState({load: 'success'})

    },
    loadErr(id){
        this.setState({load: 'failure'});
        Alert("网络不好,请检查网络之后重试");
    },
    returnPicCode(){
        if (this.state.load != 'failure') {
            return (
                <Image source={{uri:host+'/pub/getCaptcha?timestamp=' +this.state.refresh}}
                       style={[{width:90,height:47},styles.radius]} resizeMode='stretch'
                       onLoad={this.loadSuccess}
                       onError={this.loadErr}
                >
                    {
                        (()=> {
                            if (this.state.load == 'loadding') {
                                return (
                                    <ActivityIndicatorIOS animating={this.state.animating} size="large" color="#44bcb2"
                                                          style={[{height: 47,alignItems: 'center',justifyContent: 'center'}]}/>)
                            } else if (this.state.load == 'success') {
                            }
                        })()
                    }
                </Image>
            )
        } else {
            return (
                <TouchableOpacity
                    style={[{width:90,height:47,justifyContent:'center'},styles.radius, styles.button]}
                    onPress={this.reload}>
                    <Text style={{color:'white'}}>重新获取</Text>
                </TouchableOpacity>
            )
        }


    },
    render(){
        var {height, width} = Dimensions.get('window');
        return (
            <View style={{height:47,flexDirection: 'row'}}>
                <View style={[styles.view,styles.radius,{width:width-126}]}>
                    <Image source={require('../../image/utils/picCode.png')}
                           style={{height:16,width:16,marginLeft:9}}/>
                    <TextInput style={[styles.input,{width:width-180}]} placeholder="验证码" underlineColorAndroid="transparent"
                               onChangeText={(text) => this.textOnchange(text,'verify')}
                               autoCapitalize="none" keyboardType={'ascii-capable'}
                               value={this.state.verify} autoCorrect={false} maxLength={4}
                               placeholderTextColor="#7f7f7f" clearButtonMode="while-editing"/>
                </View>
                <View style={{width:90,marginTop:12,marginLeft:12}}>
                    <TouchableOpacity onPress={this.changeVerify} activeOpacity={0.5}>
                        {this.returnPicCode()}
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
})
var styles = StyleSheet.create({
    view: {
        height: 47, borderColor: '#cccccc', borderWidth: 0.5, marginTop: 12, backgroundColor: 'white',
        flexDirection: 'row', alignItems: 'center', flex: 1
    },
    radius: {
        borderRadius: 4
    },
    input: {
        fontSize: 18, color: '#7f7f7f', marginLeft: 9
    },
    button: {
        backgroundColor: '#9ad6d1',
        height: 47,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center'
    },
})
module.exports = Verify;