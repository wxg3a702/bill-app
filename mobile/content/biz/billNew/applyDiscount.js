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
    Dimensions
    } = React;

var NavBarView = require('../../framework/system/navBarView');
var VIcon = require('../../comp/icon/vIcon')
var BottomButton = require('../../comp/utilsUi/bottomButton');
var SelectBank = require('./selectBank')
var ConDiscount = require('./conDiscount')
var numeral = require('numeral');
var dateFormat = require('dateformat');
var window = Dimensions.get('window');
var dismissKeyboard = require('react-native-dismiss-keyboard');

var BillStore = require('../../framework/store/billStore');
var BillAction = require('../../framework/action/billAction');

var ApplyDis = React.createClass({
    //getInitialState(){
    //},
    componentWillMount(){
        var responseData = this.props.param.billBean;
        this.setState(responseData);
        var acceptanceBankBeans = BillStore.getAcceptanceBankBeans();
        var acceptanceJson = JSON.parse(acceptanceBankBeans);


        if (acceptanceJson == null || acceptanceJson == []) {
            this.setState({
                discountBankName: '请选择贴现银行',
                description:'',
                discountRate:0
            });
        } else {
            let res;
            acceptanceJson.map((item, index)=> {
                if (item.description == '利率最低') {
                    res = item
                }
            })

            this.setState({
                discountBankName: res.bankName,
                description:res.description,
                discountRate:res.discountRate
            });
        }
    },
    //componentDidMount(){
    //
    //},
    //componentWillUnmount(){
    //
    //},
    callBack(item){
        this.setState({
            discountRate: item.discountRate / 1000,
            description:item.description,
            discountBankName: item.bankName
        })
    },
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

    dataDiff: function (sDate1, sDate2) {
        var startTime = new Date(Date.parse(sDate1.replace(/-/g, "/"))).getTime();
        var endTime = new Date(Date.parse(sDate2.replace(/-/g, "/"))).getTime();
        var days = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
        return days;
    },

    //贴现金额=票面金额*[1-贴现利率*（到期日-贴现日期）/30]
    calDis: function (amount, discountRate, dueDate) {
        var days = this.dataDiff(dateFormat(new Date(this.state.dueDate), 'yyyy-mm-dd'), dateFormat(_.now(), 'yyyy-mm-dd'));
        return amount * (1 - discountRate * days / 30);

    },

    renderBillAmount(){
        return (
            <View
                style={{height:145,flexDirection: 'column',borderStyle:'solid',alignItems:'center',justifyContent: 'center',backgroundColor:'#34374b',flex:1}}>
                <View style={{flexDirection: 'row',borderStyle:'solid',alignItems:'center'}}>
                    <Text style={{fontSize:15,color:'#fff',flexDirection: 'row'}}>{'参考贴现金额'}</Text>
                </View>
                <View style={{flexDirection: 'row',alignItems:'flex-end'}}>
                    <Text
                        style={{fontSize:42,color:'#f6b63e'}}>{numeral(this.calDis(this.state.amount, this.state.discountRate, this.state.dueDate) / 10000).format("0,0.00")}</Text>
                    <Text style={{fontSize:15,color:'#fff',marginBottom:10}}>{' 万元'}</Text>
                </View>
            </View>
        );
    },
    renderSelectBank(){
        var {height, width} = Dimensions.get('window');
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
                        <View style={{width:width-175,flex:3,flexDirection:'row'}}>
                            <Text
                                style={{fontSize:18,color:'#4e4e4e',flexDirection: 'row',justifyContent: 'center',alignItems:'center',marginLeft:20}}
                                numberOfLines={1}>{this.state.discountBankName}</Text>

                            <Text style={{color:'#ff5b58',fontSize:18}}>{'('+this.state.description+')'}</Text>

                        </View>
                        <VIcon/>
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
                        style={{paddingBottom:10,fontSize:17,flex:6,color:'#7f7f7f'}}>{numeral(this.state.discountRate * 1000).format("0,0.00") + "‰"}</Text>
                </View>
                <View
                    style={{borderBottomColor:'#e0e0e0',borderBottomWidth:1,margin:10,marginLeft:12,marginRight:12,marginTop:10,flexDirection: 'row',justifyContent: 'center',flex:1}}>
                    <Text style={{paddingBottom:10,fontSize:17,flex:4,color:'#4e4e4e'}}>{'起  息  日：' }</Text>
                    <View style={{flex:6,flexDirection:'row'}}>
                        <Text
                            style={{paddingBottom:10,fontSize:17,color:'#7f7f7f'}}>{dateFormat((new Date((new Date / 1000 + 86400 * 2) * 1000)), 'yyyy年mm月dd日')}</Text>
                        <Text style={{color:'#ff5b58',fontSize:17}}>{'(参考)'}</Text>
                    </View>
                </View>
                <View
                    style={{marginLeft:12,marginRight:12,flexDirection: 'row',justifyContent: 'center',flex:1}}>
                    <Text style={{paddingBottom:10,fontSize:17,flex:4,color:'#4e4e4e'}}>{'贴现利息：' }</Text>
                    <Text
                        style={{paddingBottom:10,fontSize:17,flex:6,color:'#7f7f7f'}}>{numeral((this.state.amount - this.calDis(this.state.amount, this.state.discountRate, this.state.dueDate)) / 10000).format("0,0.00") + '万元'}</Text>
                </View>

            </View>
        );
    },
    renderDisaTips(){
        return (
            <View style={{flexDirection: 'column',borderStyle:'solid',backgroundColor:'#f0f0f0',marginTop:6}}>
                <Text
                    style={{fontSize:15,color:'#7f7f7f',marginTop:20,marginLeft:12,marginRight:12}}>{'您的具体贴现金额与银行批准申请的时间和当天利率有关,以上计算仅供参考\n如有疑问,欢迎联系客服'}</Text>

            </View>
        );
    },
    renderApplyBtn(){
        return (
            <View>
                <BottomButton func={() => this.goToConDiscount(this.state)} content={'发送申请'}/>
            </View>

        );
    },
    goToSelectBank: function () {
        this.props.navigator.push({
            param: {title: '选择贴现行'},
            comp: SelectBank,
            callBack: this.callBack
        });
    },
    goToConDiscount: function (item:Object) {
        this.props.navigator.push({
            param: {title: '确认贴现', billBean: item},
            comp: ConDiscount
        });
    },
});

var styles = StyleSheet.create({});

module.exports = ApplyDis;