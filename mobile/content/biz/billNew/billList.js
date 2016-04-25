'use strict';

var React = require('react-native');
var {
    ListView,
    TouchableHighlight,
    Text,
    View,
    Platform,
    Dimensions,
    Image,
    StyleSheet,
    TouchableOpacity,
    InteractionManager,
    } = React;
var _ = require('lodash');
var Demo = require('./demo');
var Adjust = require('../../comp/utils/adjust');
var ListBottom = require('../../comp/utilsUi/listBottom');
var {width, height} = Dimensions.get('window');
var NavBarView = require('../../framework/system/navBarView');
var AppStore = require('../../framework/store/appStore');
var ToLogin = require('../../comp/utilsUi/toLogin');
var Login = require('../login/login');
var UserStore = require('../../framework/store/userStore');
var BillStore = require('../../framework/store/billStore');
var VIcon = require('../../comp/icon/vIcon');
var Validation = require('../../comp/utils/validation');
var Alert = require('../../comp/utils/alert');
var RevBill = require('./revBillList');
var SentBill = require('./sentBillList');

var ds = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});

var GiftedListView = require('../../comp/listView/GiftedListView');
const PAGE_SIZE = 5;

var Bill = React.createClass({
    getDataSouce(bean, key1, key2, key3){
        if (!bean || _.isEmpty(bean)) {
            return ''
        } else {
            let ret = new Array();
            bean.contentList.map((item, index)=> {
                if (item.status == key1 && !key2 && !key3) {
                    ret.push(item);
                } else if (item.status == key1 || item.status == key2 || item.status == key3) {
                    ret.push(item);
                }
            })
            return ret;
        }
    },

    getStateFromStores(){
        var token = AppStore.getToken();

        return ({
            token: token,
            checkColor: 'white',
            unCheckColor: '#44bcb2',
            status: '全部',
            direction: 'left',
            pickStatus: 'rev',
            backColor: '#f0f0f0',
            contentColor: 'white',
            opacity: 1,
            billType: 'rev',
        })

    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    componentDidMount() {

        AppStore.addChangeListener(this._onChange);

        InteractionManager.runAfterInteractions(() => {

            if (this.state.token) {
                var userType = UserStore.getUserType();
                if (userType !== 'CERTIFIED') {
                    Alert('您还未完成企业认证');
                }
            }

            var obj = BillStore.getDemoFlag();

            if ((obj == undefined || obj.flag != true || (obj.id != UserStore.getUserId())) && (this.state.dataSource != undefined && this.state.dataSource.length > 0)) {
                if (Platform.OS === 'ios') {
                    this.props.navigator.push({
                        comp: Demo
                    });
                } else {
                    this.props.onShowDemo();
                }

            }
        });

    },

    componentWillUnmount: function () {
        AppStore.removeChangeListener(this._onChange);
    },
    _onChange: function () {
        this.setState(this.getStateFromStores());
    },

    changeRev(){
        this.setState({
            checkColor: 'white',
            unCheckColor: '#44bcb2',
            pick: this.state.resPick,
            pickStatus: 'rev',
            status: '全部',
            billType: 'rev',

        });
    },
    changeSend(){
        this.setState({
            checkColor: '#44bcb2',
            unCheckColor: 'white',
            pick: this.state.sentPick,
            pickStatus: 'sent',
            status: '全部',
            billType: 'sent',
        });
    },

    toOther(name, item) {
        this.props.navigator.push({
            comp: name,
            param: {
                item: item
            }
        });
    },

    hasBill(){
        if (!this.state.token) {
            return (
                <ToLogin func={()=>this.toOther(Login)} mar={true}/>
            )
        } else if (this.state.billType === 'rev') {
            return (

                <RevBill navigator={this.props.navigator}></RevBill>

            );

        } else if (this.state.billType === 'sent') {
            return (

                <SentBill navigator={this.props.navigator}></SentBill>

            );
        }
    },


    returnView(){
        if (!this.state.token) {
            return (
                <TouchableOpacity activeOpacity={0.8}>
                    <View style={[styles.pickTitle,styles.bottomColor]}>
                        <Text style={{fontSize:15,color:'#333333'}}>全部</Text>
                        <VIcon direction='down' size={22}/>
                    </View>
                </TouchableOpacity>
            )
        }
    },

    render(){
        return (
            <NavBarView navigator={this.props.navigator} showBar={false} contentBackgroundColor={this.state.backColor}
                        style={{flex:1}}>
                <View style={{backgroundColor:'#f0f0f0'}}>
                    <View style={[styles.comStyle]}>
                        <TouchableOpacity onPress={this.changeRev} activeOpacity={0.9}>
                            <View
                                style={[styles.titleView,styles.leftRadius,{backgroundColor:this.state.unCheckColor}]}>
                                <Text style={[styles.title,{color:this.state.checkColor}]}>收到的票</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.changeSend} activeOpacity={0.9}>
                            <View style={[styles.titleView,styles.rightRadius,{backgroundColor:this.state.checkColor}]}>
                                <Text style={[styles.title,{color:this.state.unCheckColor}]}>开出的票</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                {this.returnView()}
                {this.hasBill()}
                <ListBottom/>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
    comStyle: {
        height: (Platform.OS === 'ios') ? 64 : 44,
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        justifyContent: 'center', alignItems: 'center', flexDirection: 'row'
    },
    title: {
        fontSize: 16
    },
    leftRadius: {
        borderBottomLeftRadius: 4, borderTopLeftRadius: 4, borderBottomRightRadius: 4, borderTopRightRadius: 4
    },
    rightRadius: {
        borderBottomRightRadius: 4, borderTopRightRadius: 4, borderBottomLeftRadius: 4, borderTopLeftRadius: 4,
    },
    titleView: {
        width: 80, height: 29, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#44bcb2'
    },
    pickTitle: {
        height: 32, paddingHorizontal: 10,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    bottomColor: {
        borderBottomWidth: 1, borderColor: '#c8c8c8'
    },
    topColor: {
        borderTopWidth: 1, borderColor: '#c8c8c8'
    },
    pickLine: {
        backgroundColor: '#e6e6e6', justifyContent: 'center', height: 40, paddingLeft: 10,
    },
    contentBottom: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 36, paddingRight: 16
    },
    content: {
        marginTop: 5, paddingLeft: 6, borderWidth: 1, borderColor: '#c8c8c8',
        height: Platform.OS === 'ios' ? 172 : 182,
    },
    position: {
        position: 'absolute',
        left: 0, top: 0, width: width, height: height
    }
})
module.exports = Bill;
