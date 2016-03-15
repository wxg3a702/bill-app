/**
 * Created by cui on 16/3/15.
 */
/**
 * Created by cui on 16/3/9.
 */
var React = require('react-native');
var {
    Image,
    StyleSheet,
    TouchableHighlight,
    Text,
    View,
    ScrollView,
    } = React;

var NavBarView = require('../../framework/system/navBarView');
var SelectBank = require('./selectBank')
var ConDiscount = require('./conDiscount')

var ApplyDis = React.createClass({
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator}
                        title="申请贴现">
                <ScrollView>
                    <View style={{backgroundColor:'#f0f0f0'}}>
                        {this.renderBillAmount()}
                        {this.renderSelectBank()}
                        {this.renderDisInfo()}
                        {this.renderDisaTips()}
                    </View>
                </ScrollView>
                {this.renderApplyBtn()}
            </NavBarView>
        );
    },
    renderBillAmount(){
        return (
            <View
                style={{height:145,flexDirection: 'column',borderStyle:'solid',alignItems:'center',justifyContent: 'center',backgroundColor:'#34374b',flex:1}}>
                <View style={{flexDirection: 'row',borderStyle:'solid',alignItems:'center'}}>
                    <Text style={{fontSize:15,color:'#fff',flexDirection: 'row'}}>{'参考贴现金额'}</Text>
                </View>
                <View style={{flexDirection: 'row',alignItems:'flex-end'}}>
                    <Text style={{fontSize:42,color:'#f6b63e'}}>{'123,333.33'}</Text>
                    <Text style={{fontSize:15,color:'#fff',marginBottom:10}}>{' 万元'}</Text>
                </View>
            </View>
        );
    },
    renderSelectBank(){
        return (
            <View style={{flexDirection: 'column',borderStyle:'solid',backgroundColor:'#fff',flex:1}}>
                <View
                    style={{height:50,flexDirection: 'row',borderStyle:'solid',backgroundColor:'#f0f0f0',flex:1,borderBottomWidth:1,borderBottomColor:'#e0e0e0'}}>
                    <Text
                        style={{marginLeft:12,marginRight:12,marginTop:25,fontSize:15,color:'#4e4e4e',flexDirection: 'row',flex:1}}>{'选择贴现行'}</Text>
                </View>
                <TouchableHighlight activeOpacity={0.8} underlayColor='#f0f0f0'
                                    onPress={() => this.goToSelectBank()}
                                    style={{flex:1}}>
                    <View
                        style={{height:60,flexDirection: 'row',borderStyle:'solid',backgroundColor:'#fff',alignItems:'center',flex:1,borderBottomWidth:1,borderBottomColor:'#e0e0e0'}}>
                        <Image
                            style={{width:30,height:30,marginLeft:15}}
                            source={require('../../image/bill/payee_new.png')}
                        />
                        <Text
                            style={{fontSize:18,color:'#4e4e4e',flexDirection: 'row',justifyContent: 'center',alignItems:'center',marginLeft:20,flex:3}}
                            numberOfLines={1}>{'中国银行上海分行 旧沙发框架和第三空间加看哈电视开机'}</Text>
                        <Text style={{color:'#ff5b58',fontSize:18}}>{'(费率最低)'}</Text>
                        <Image
                            style={{width:15,height:15,marginLeft:12,marginRight:12}}
                            source={require('../../image/bill/payee_new.png')}
                        />
                    </View>
                </TouchableHighlight>

            </View>
        );
    },
    renderDisInfo(){
        return (
            <View
                style={{flexDirection: 'column',borderStyle:'solid',backgroundColor:'#ffffff',marginTop:6}}>
                <View
                    style={{borderBottomColor:'#e0e0e0',borderBottomWidth:1,marginLeft:12,marginRight:12,marginTop:15,flexDirection: 'row',justifyContent: 'center',flex:1}}>
                    <Text style={{paddingBottom:10,fontSize:17,flex:4,color:'#4e4e4e'}}>{'贴现利率：' }</Text>
                    <Text
                        style={{paddingBottom:10,fontSize:17,flex:6,color:'#7f7f7f'}}>{'99.99‰'}</Text>
                </View>
                <View
                    style={{borderBottomColor:'#e0e0e0',borderBottomWidth:1,margin:10,marginLeft:12,marginRight:12,marginTop:10,flexDirection: 'row',justifyContent: 'center',flex:1}}>
                    <Text style={{paddingBottom:10,fontSize:17,flex:4,color:'#4e4e4e'}}>{'起  息  日：' }</Text>
                    <View style={{flex:6,flexDirection:'row'}}>
                        <Text
                            style={{paddingBottom:10,fontSize:17,color:'#7f7f7f'}}>{'2015年04月12日'}</Text>
                        <Text style={{color:'#ff5b58',fontSize:17}}>{'(参考)'}</Text>
                    </View>
                </View>
                <View
                    style={{marginLeft:12,marginRight:12,flexDirection: 'row',justifyContent: 'center',flex:1}}>
                    <Text style={{paddingBottom:10,fontSize:17,flex:4,color:'#4e4e4e'}}>{'贴现利息：' }</Text>
                    <Text
                        style={{paddingBottom:10,fontSize:17,flex:6,color:'#7f7f7f'}}>{'0.1万元'}</Text>
                </View>

            </View>
        );
    },
    renderDisaTips(){
        return (
            <View style={{flexDirection: 'column',borderStyle:'solid',backgroundColor:'#f0f0f0',marginTop:6}}>
                <Text style={{fontSize:15,color:'#7f7f7f',marginTop:20,marginLeft:12,marginRight:12}}>{'您的具体贴现金额与银行批准申请的时间和当天利率有关,以上计算仅供参考\n如有疑问,欢迎联系客服'}</Text>

            </View>
        );
    },
    renderApplyBtn(){
        return(
            <View
                style={{padding:10,flexDirection: 'row',justifyContent:'center',borderStyle:'solid',backgroundColor:'transparent'}}>
                <View
                    style={{flex:12,height:35,borderRadius:5,backgroundColor: '#44bcb2',paddingLeft:10,paddingRight:10}}>
                    <TouchableHighlight activeOpacity={0.8} underlayColor='#44bcbc'
                                        onPress={() => this.goToConDiscount()}
                                        style={{flex:1}}>
                        <Text style={{paddingTop: 10,color:'#ffffff',textAlign:'center'}}>{'发送申请'}</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    },
    goToSelectBank:function (){
        this.props.navigator.push({
            param: {title: '选择贴现行'},
            comp: SelectBank
        });
    },
    goToConDiscount:function (){
        this.props.navigator.push({
            param: {title: '确认贴现'},
            comp: ConDiscount
        });
    },

});

var styles = StyleSheet.create({

});

module.exports = ApplyDis;