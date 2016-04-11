'use strict';

var React = require('react-native');
var {
    View,
    } = React;
var RightTopButton = require('../../comp/utilsUi/rightTopButton');
var Alert = require('../../comp/utils/alert');
var LoginAction = require("../../framework/action/loginAction")
var NavBarView = require('../../framework/system/navBarView')
var EditPhoneVerify = require('./editPhoneVerify');
var Validation = require('../../comp/utils/validation');
var Input = require('../../comp/utilsUi/input');
var Button = require('../../comp/utilsUi/button');

var EditPhoneNewPhone = React.createClass({
    getInitialState: function () {
        return {
            newPhoneNumber: '',
            checked:true
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
                this.checkNewPhone();
            }
        }
    },



    checkNewPhone: function () {
        LoginAction.validateMobileForResetMobile(
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
        this.textOnchange(value, key);
    },

    textOnchange: function (text, type) {
        this.setState({[type]: text})
        if (this.state.newPhoneNumber.length == 0) {
            this.setState({checked: true,})
        } else {
            this.setState({checked: false,})
        }
    },

    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="填写新手机号" >
                <View style={{flexDirection: 'column',paddingHorizontal:12}}>
                    <Input type='default' prompt="请输入新手机号" max={11} field="newPhoneNumber" isPwd={false} isPhone={true}
                           onChanged={this.handleChanged} icon="phone"/>
                </View>

                <View style={{marginTop:20,marginLeft:10,marginRight:10}}>
                    <Button  func={this.next} checked={this.state.checked} content='下一步' />
                </View>

            </NavBarView>
        )
    }
})
module.exports = EditPhoneNewPhone;