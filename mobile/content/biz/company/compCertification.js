'use strict';

var React = require('react-native');
var {
    StyleSheet,
    TouchableHighlight,
    Text,
    Dimensions,
    View,
    ListView,
    Image
} = React;
var Adjust = require('../../comp/utils/adjust')
var CompCertifyCopies = require('./compCertifyCopies');
var {height, width} = Dimensions.get('window');
var Space = require('../../comp/utilsUi/space')
var BottomButton = require('../../comp/utilsUi/bottomButton')
var VIcon = require('../../comp/icon/vIcon')
var AppStore = require('../../framework/store/appStore');
var CompStore = require('../../framework/store/compStore');
var CompAction = require("../../framework/action/compAction")
var NavBarView = require('../../framework/system/navBarView')
var certificateState = require('../../constants/certificateState');
var _ = require('lodash')
var Swipeout = require('react-native-swipeout')
var Alert = require('../../comp/utils/alert');
var ds = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
var CompCertification = React.createClass({
    getStateFromStores(){
        let ret = new Array();
        let i = 0;
        var orgBean = CompStore.getCertifiedOrgBean();
        let certifiedCon = [];
        let auditingCon = [];
        let rejectedCon = [];
        orgBean.map((item, index)=>{
            if (item.status == 'CERTIFIED') {
                certifiedCon.push(item);
            } else if(item.status == 'AUDITING'){
                auditingCon.push(item);
            } else {
                rejectedCon.push(item);
            }
        });
        let con = certifiedCon.concat(auditingCon).concat(rejectedCon);
        //orgBean.map((item, index)=> {
        //    if (!item.status) {
        //        item.status = 'AUDITING';
        //    }
        //    if (item.status != 'CERTIFIED') {
        //        item.orgName = '认证企业信息' + ++i;
        //
        //    }
        //    ret.push(item)
        //});
        return {
            bean: con,
            dataSource: con
        }
    },

    getInitialState: function () {
        return this.getStateFromStores();
    },

    componentDidMount() {
        AppStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        AppStore.removeChangeListener(this._onChange);
    },

    _onChange: function () {
        this.setState(this.getStateFromStores());
    },
    toOther(item){
        this.props.navigator.push({
            comp: CompCertifyCopies,
            param: {
                item: item,
            }
        })
    },

    returnRow(data){
        var swipeoutBtns = [
            {
                text: '删除',
                backgroundColor: 'red',
                onPress(){
                    if (data.status == 'AUDITING') {
                        Alert('认证中的企业不能删除')
                    } else {
                        Alert('您正在试图删除一条企业信息，确认操作后，您将无法继续查看该企业所有的业务信息，确认删除吗？',
                            ()=> {
                                CompAction.deleteOrg(
                                    {orgId: data.id},
                                    ()=>Alert("删除成功!"),
                                    ()=> {
                                    }
                                )
                            },
                            function () {
                            }
                        )
                    }
                }
            }
        ]
        return (
            <Swipeout right={swipeoutBtns}>
                <TouchableHighlight onPress={()=>this.toOther(data)}>
                    <View style={styles.item} removeClippedSubviews={true}>
                        <View style={{width:width,flexDirection:'row',alignItems:'center'}}>
                            <Text style={{width:width-Adjust.width(90)}}>
                                {data.status == 'CERTIFIED' ? data.stdOrgBean.orgName : data.orgName}
                            </Text>
                            <Text style={{width:Adjust.width(50),color:certificateState[data.status].color}}>
                                {certificateState[data.status].desc}
                            </Text>
                            <VIcon/>
                        </View>
                    </View>
                </TouchableHighlight>
            </Swipeout>
        )
    },
    returnList(){
        if (this.state.bean.length == 0) {
            return (
                <View style={{flex:1,alignItems:'center'}}>
                    <Image style={{marginTop:100}} source={require("../../image/company/no_company.png")}/>
                    <Text style={{marginTop:20,color:"#CCCCCC"}}>点击下方按钮进行"企业认证"哦</Text>
                </View>
            )
        } else {
            return (
                <ListView dataSource={ds.cloneWithRows(this.state.dataSource)} renderRow={this.returnRow}/>
            )
        }
    },
    returnTitle(){
        if (!_.isEmpty(this.state.bean)) {
            return <Space backgroundColor="#f0f0f0" top={false}/>
        }
    },
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="企业认证">
                {this.returnTitle()}
                <View style={{flex: 1}}>
                    {this.returnList()}
                </View>
                <BottomButton func={()=>this.toOther('')} content="新增企业信息"/>
            </NavBarView>
        )
    }
})
var styles = StyleSheet.create({
    bottom: {
        padding: 7, backgroundColor: '#f7f7f7', borderTopWidth: 1, borderTopColor: '#cccccc', opacity: 0.9
    },
    borderBottom: {
        borderBottomWidth: 1, borderColor: '#c8c7cc'
    },
    radius: {
        borderRadius: 6
    },
    button: {
        backgroundColor: '#44bcbc',
        height: 47,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        height: 50,
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: '#c8c7cc',
        width: width,
    }
})
module.exports = CompCertification;