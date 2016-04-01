'use strict';

var React = require('react-native');
var Item = require('../../comp/utils/item')
var Space = require('../../comp/utilsUi/space')
var SecurityCenter = require('./securityCenter')
var Notice = require('./notice')
var NavBarView = require('../../framework/system/navBarView')
var Setting = React.createClass({
    toOther(name){
        const {navigator}=this.props;
        if (navigator) {
            navigator.push({
                comp: name,
            })
        }
    },
    render: function () {
        return (
            <NavBarView navigator={this.props.navigator} title="设置">
                <Space top={false}/>
                <Item func={()=>this.toOther(Notice)} desc="消息通知设置"
                      imgPath={require('../../image/user/editPhone.png')}/>

                <Item func={()=>this.toOther(SecurityCenter)} desc="安全设置"
                      imgPath={require('../../image/user/editPwd.png')}/>

            </NavBarView>
        )
    }
})
module.exports = Setting;