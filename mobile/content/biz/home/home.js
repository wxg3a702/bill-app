'use strict';

var React = require('react-native');
var {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Dimensions,
    Image,
    TouchableHighlight,
}=React
var Adjust = require('../../comp/utils/adjust')
var ReturnNum = require('./returnNum')
var NoRisk = require('../personalCenter/noRisk')
var Calculator = require('../personalCenter/calculator');
var NavBarView = require('../../framework/system/navBarView');
var {height, width} = Dimensions.get('window');
var ViewPager = require('react-native-viewpager');
var PAGES = [
    require('../../image/home/banner1.png'),
    require('../../image/home/banner2.png'),
    require('../../image/home/banner3.png')
];

var Home = React.createClass({
    getInitialState(){
        var dataSource = new ViewPager.DataSource({
            pageHasChanged: (p1, p2) => p1 !== p2,
        });
        return ({
            num: 423324,
            dataSource: dataSource.cloneWithPages(PAGES),
        })
    },
    pad(num, size) {
        var s = num + "W";
        while (s.length < size) s = "0" + s;
        return s;
    },
    add(num){
        var arr = [];
        for (var i = 0, len = num.length; i < len; i++) {
            arr[i] = num[i];
        }
        arr.splice(3, 0, ',')
        this.setState({number: arr});
    },
    toArray(){
        this.state.number = this.pad(this.state.num, 7);
        this.add(this.state.number);
    },
    componentWillMount(){
        this.toArray();
    },
    componentDidMount() {
        //setInterval(this.set, 20)
    },
    set(){
        this.state.num++;
        this.toArray();
        //alert(this.state.number)
    },
    toOther(name, desc){
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                comp: name,
                param: {
                    desc: desc
                }
            })
        }
    },
    returnImg(path, img, desc){
        return (
            <TouchableHighlight underlayColor='#ebf1f2' onPress={()=>this.toOther(path,desc)}
                                style={{flex:1,borderColor:'#cccccc',borderRightWidth:1}}>
                <View style={{flexDirection:'column',alignItems:'center'}}>
                    <Image style={{height:74,width:Adjust.width(74),marginTop:12}} source={img}/>
                    <Text style={{marginTop:18,fontSize:13,color:'#333333'}}>{desc}</Text>
                </View>
            </TouchableHighlight>
        )
    },
    returnItem(item, index){
        return ReturnNum.returnNum(item, index)
    },
    returnSwiper(url){
        return (
            <Image style={{width:width}} resizeMode="stretch" source={url}/>
        )
    },

    _renderPage: function (data:Object) {
        return (
            <Image
                resizeMode="stretch"
                style={styles.page}
                source={data}/>
        );
    },

    _onChangePage: function (page) {

    },
    render(){

        return (
            <NavBarView navigator={this.props.navigator} title="首页" showBack={false} showBar={true}>

                <ScrollView automaticallyAdjustContentInsets={false} horizontal={false}>
                    <View style={{flexDirection:'column'}}>
                        <View style={{height:200,width:width}}>
                            <ViewPager
                                style={this.props.style}
                                dataSource={this.state.dataSource}
                                renderPage={this._renderPage}
                                onChangePage={this._onChangePage}
                                isLoop={true}
                                autoPlay={true}/>
                        </View>
                        <View style={styles.tool}>
                            {this.returnImg(Calculator, require('../../image/home/calculator.png'), '贴现计算器')}
                            {this.returnImg(NoRisk, require('../../image/home/riskNotesSearch.png'), '风险票据查询')}
                            {this.returnImg(NoRisk, require('../../image/home/shiborSearch.png'), 'Shibor查询')}
                        </View>
                    </View>
                    <View style={styles.amount}>
                        <Image style={{marginTop:12,width:width,height:20}} resizeMode="stretch"
                               source={require('../../image/home/calTitle.png')}>
                            <Text
                                style={{marginLeft:(width-Adjust.width(100))/2,marginTop:2,width:Adjust.width(100),fontSize:16,color:'#7f7f7f'}}>累计贴现金额</Text>
                        </Image>
                        <View style={{flex:1,flexDirection:'row',marginTop:14,height:80}}>
                            {this.state.number.map((item, index)=> {
                                return this.returnItem(item, index)
                            })}
                        </View>
                    </View>
                    <View style={styles.userCount}>
                        <View>
                            <Text style={{fontSize:14,color:'#7f7f7f'}}>累计入住用户</Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Text style={{fontSize:14,color:'#43bb80'}}>{this.state.num}</Text>
                            <Text>人</Text>
                        </View>
                    </View>
                </ScrollView>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
    tool: {
        height: 135, flexDirection: 'row', backgroundColor: 'white', borderBottomColor: '#cccccc', borderBottomWidth: 1
    },
    amount: {
        height: 149,
        marginTop: 10,
        backgroundColor: 'white',
        flexDirection: 'column',
        borderTopWidth: 1,
        borderTopColor: '#cccccc',
        justifyContent: 'center'
    },
    userCount: {
        height: 55,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#cccccc',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    page: {
        width: width,
        height: 200
    },
})
module.exports = Home