'use strict';

var React = require('react-native');
var {
    View,
    } = React;
var RightTopButton = require('../../comp/utils/rightTopButton');
var Alert = require('../../comp/utils/alert');
var AppAction = require("../../framework/action/appAction")
var NavBarView = require('../../framework/system/navBarView')
var EditPhoneVerify = require('./editPhoneVerify');
var Validation = require('../../comp/utils/validation');
var Input = require('../../comp/utils/input');
var EditPhoneNewPhone = React.createClass({
    getInitialState: function () {
        return {
            newPhoneNumber: '',
        };
    },
    button(){
        return (
            <RightTopButton func={this.next} content="确定"/>
        )
    },
    next: function () {
        if (this.state.newPhoneNumber.length == 0) {
            Alert("请输入新手机号")
        } else {
            if (!Validation.isPhone(this.state.newPhoneNumber)) {
                return false;
            } else {
                var isCheckNewPhone = this.checkNewPhone();
            }
        }
    },
    checkNewPhone: function () {
        AppAction.validateMobileForResetMobile(
            {
                newMobileNo: this.state.newPhoneNumber,
            },
            function () {
                const { navigator } = this.props;
                if (navigator) {
                    this.props.navigator.push({
                        comp: EditPhoneVerify,
                        param: {
                            phoneNumber: this.state.newPhoneNumber
                        },
                    });
                }
            }.bind(this)
        )
    },
    handleChanged(key, value){
        this.setState({[key]: value});
    },
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="修改手机号" actionButton={this.button()}>
                <View style={{flexDirection: 'column',paddingHorizontal:12}}>
                    <Input type='default' prompt="请输入新手机号" max={11} field="newPhoneNumber" isPwd={false} isPhone={true}
                           onChanged={this.handleChanged} icon="phone"/>
                </View>
            </NavBarView>
        )
    }
})
module.exports = EditPhoneNewPhone;