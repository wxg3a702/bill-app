'use strict';

var React = require('react-native');
var {
    TouchableOpacity,
    Text,
    View,
    Image,
    Dimensions
    } = React;
var CompCertifyCopies = require('../company/compCertifyCopies');
var window = Dimensions.get('window');
var GotoRegister = React.createClass({
    render(){
        let {width,height} = window;
        return (
            <Image resizeMode="stretch"
                   source={require('../../image/utils/gotoRegister.png')} style={{width:width,height:height}}>
                <View style={{flex:1,justifyContent:'flex-end',alignItems:'center'}}>
                    <TouchableOpacity
                        onPress={()=>{
                            this.props.navigator.push({comp:CompCertifyCopies,param:{fromRegister:true,item:''}}
                        )}}
                        style={{marginBottom:40, borderColor:'white',borderWidth:1,paddingHorizontal:25,paddingVertical:10,borderRadius:5}}>
                        <Text style={{color:"white", fontSize:25}}>去企业认证</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>{this.props.navigator.resetTo({comp: 'tabView'})}}
                        style={{marginBottom:40}}>
                        <Text style={{color:"white", fontSize:15}}>下次再说></Text>
                    </TouchableOpacity>
                </View>
            </Image>
        )
    },
})
module.exports = GotoRegister;