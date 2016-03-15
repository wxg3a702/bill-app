/**
 * Created by cui on 16/3/11.
 */
var React = require('react-native');
var {
    AppRegistry,
    Image,
    ListView,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    Text,
    View,
    TextInput,
    ScrollView,
    Dimensions
    } = React;

var NavBarView = require('../../framework/system/navBarView');

var ComResult = React.createClass({
    render: function (){
        return(
            <NavBarView navigator={this.props.navigator}
                        title="提交结果">
                <View style={{justifyContent:'space-between',flex:1}}>
                    <View style={{alignItems:'center',marginTop:80}}>
                        <Image
                            style={{width:120,height:120}}
                            source={require('../../image/bill/apply_success.png')}
                        />
                        <Text style={{marginTop:10,fontSize:15,color:'#7f7f7f'}}>{'贴现申请发送成功!'}</Text>
                    </View>
                    <View
                        style={{padding:10,flexDirection: 'row',justifyContent:'center',borderStyle:'solid',backgroundColor:'transparent'}}>
                        <View
                            style={{flex:12,height:35,borderRadius:5,backgroundColor: '#44bcb2',paddingLeft:10,paddingRight:10}}>
                            <TouchableHighlight activeOpacity={0.8} underlayColor='#44bcbc'
                                                onPress={() => {this.props.navigator.popToTop()}}
                                                style={{flex:1}}>
                                <Text style={{paddingTop: 10,color:'#fff',textAlign:'center'}}>{'返回票据首页'}</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </NavBarView>
        );
    },
    goToBillHome(){

    },
});

var styles = StyleSheet.create({});

module.exports = ComResult;