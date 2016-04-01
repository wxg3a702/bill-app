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
var BottomButton = require('../../comp/utilsUi/bottomButton');

var ComResult = React.createClass({
    render: function (){
        return(
            <NavBarView navigator={this.props.navigator}
                        title="提交结果">
                <View style={{justifyContent:'space-between',flex:1}}>
                    <View style={{alignItems:'center',marginTop:80}}>
                        <Image
                            style={{width:120,height:120}}
                            source={!this.props.result?require('../../image/bill/apply_success.png'):require('../../image/bill/apply_fail.png')}
                        />
                        <Text style={{marginTop:10,fontSize:15,color:'#7f7f7f'}}>{!this.props.result?'贴现申请发送成功!':'贴现申请发送失败!'}</Text>
                    </View>
                    <View>
                        <BottomButton func={() => {this.props.navigator.popToTop()}} content={'返回票据首页'}/>
                    </View>
                </View>
            </NavBarView>
        );
    },
});

var styles = StyleSheet.create({});

module.exports = ComResult;