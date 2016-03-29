'use strict';

var React = require('react-native');
var {
    StyleSheet,
    View,
} = React;
var AppStore = require('../../framework/store/appStore');
var CompStore = require('../../framework/store/compStore');
var CompAction = require("../../framework/action/compAction");
var NavBarView = require('../../framework/system/navBarView');
var certificateState = require('../../constants/certificateState');
var CertifySuccess = require('./certifySuccess');
var Input = require('../../comp/utilsUi/input');
var Alert = require('../../comp/utils/alert');
var Button = require('../../comp/utilsUi/button');
var CompAccountInfo = React.createClass({
    getStateFromStores(){
        let check
        var newOrg = !this.props.param.item ? CompStore.getNewOrg() : this.props.param.item
        if (!newOrg.accountName || !newOrg.accountNo || !newOrg.openBank) {
            check = true
        } else {
            check = false
        }
        return {
            newOrg: newOrg,
            accountName: newOrg.accountName,
            accountNo: newOrg.accountNo,
            openBank: newOrg.openBank,
            checked: check,
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
    submit: function () {
        let newOrg = this.state.newOrg;
        newOrg.accountName = this.state.accountName;
        newOrg.accountNo = this.state.accountNo;
        newOrg.openBank = this.state.openBank
        this.setState({newOrg: newOrg})
        if (!this.props.param) {
            CompAction.deleteOrg(
                {orgId: this.props.param.item.id}
            )
        }
        CompAction.submitOrg(
            this.state.newOrg,
            ()=>this.props.navigator.push({comp: CertifySuccess}),
            ()=>Alert("认证失败")
        )
    },
    textOnchange: function (text, type) {
        this.setState({[type]: text})
        if (this.state.accountName.length == 0 || this.state.accountNo.length == 0 || this.state.openBank.length == 0) {
            this.setState({checked: true})
        } else {
            this.setState({checked: false})
        }
    },

    handleChanged(key, value){
        this.textOnchange(value, key);
    },
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="2.关联账户信息">
                <View style={{flex:1,marginHorizontal:10}}>
                    <Input type='default' prompt="账户名称" max={20} field="accountName" isPwd={false}
                           defaultValue={this.state.accountName}
                           onChanged={this.handleChanged} icon="user"/>
                    <Input type='default' prompt="账户" max={20} field="accountNo" isPwd={false}
                           defaultValue={this.state.accountNo}
                           onChanged={this.handleChanged} icon="user"/>
                    <Input type='default' prompt="开户行" max={20} field="openBank" isPwd={false}
                           defaultValue={this.state.openBank}
                           onChanged={this.handleChanged} icon="user"/>
                </View>
                <View style={{margin:10}}>
                    <Button func={this.submit} content="提交" checked={this.state.checked}/>
                </View>
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