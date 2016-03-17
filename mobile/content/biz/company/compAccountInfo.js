/**
 * Created by vison on 16/3/14.
 */
'use strict';

var React = require('react-native');
var {
    StyleSheet,
    TouchableHighlight,
    CameraRoll,
    Text,
    Image,
    View,
    } = React;
var Realm = require('realm');
var Space = require('../../comp/utils/space')
var BottomButton = require('../../comp/utils/bottomButton')
var VIcon = require('../../comp/icon/vIcon')
var AppStore = require('../../framework/store/appStore');
var CompStore = require('../../framework/store/compStore');
var CompAction = require("../../framework/action/compAction")
var NavBarView = require('../../framework/system/navBarView')
var certificateState = require('../../constants/certificateState');
var Input = require('../../comp/utils/input');
var Alert = require('../../comp/utils/alert');
var Button = require('../../comp/utils/button')
var CompAccountInfo = React.createClass({
    getStateFromStores(){
        var orgBean = CompStore.getOrgBeans()[0];
        return orgBean
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
    addComp(){
       
    },
    render: function () {
        var realm = new Realm({path:Realm.defaultPath.replace("/default.realm","")+"/realm.realm",schema:[{name:'Dog', properties:{name: 'string'}}]});
        realm.write(()=>{
            realm.create('Dog', ['Rex']);
        })
        console.log(realm.path);
        //console.log(Realm.defaultPath);
        return (
            <NavBarView navigator={this.props.navigator} title="2.关联账户信息">
                <View style={{flex:1,marginHorizontal:10}}>
                    <Input  type='default' prompt="账户名称" max={20} field="userName" isPwd={false}
                           onChanged={this.handleChanged} icon="user"/>
                    <Input  type='default' prompt="账户" max={20} field="userName" isPwd={false}
                           onChanged={this.handleChanged} icon="user"/>
                    <Input  type='default' prompt="开户预留手机号" max={20} field="userName" isPwd={false}
                           onChanged={this.handleChanged} icon="user"/>
                    <Text style={styles.welcome}>
                        Count of Dogs in Realm: {realm.objects('Dog').length}
                    </Text>
                    <Text style={styles.welcome}>
                        Count of Dogs in Realm: {realm.objects('Dog').toString()}
                    </Text>
                </View>
                <BottomButton func={this.addComp} content="提交"/>
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
})
module.exports = CompAccountInfo;