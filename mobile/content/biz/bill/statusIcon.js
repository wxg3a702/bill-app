'use strict'

var React = require('react-native');
var {Image} = React;

var StatusIcon = React.createClass({
    render:function() {
        var {role, status} = this.props;
        if(role=='payee'){
            switch(status){
                case 'NEW':
                    return (
                        <Image
                            style={{width:31,height:116,marginRight:0,marginTop:10}}
                            source={require('../../image/bill/payee_new.png')}
                            />
                    );
                    break;
                case 'REQ':
                    return (
                        <Image
                            style={{width:31,height:116,marginRight:0,marginTop:10}}
                            source={require('../../image/bill/payee_req.png')}
                            />
                    );
                    break;
                case 'HAN':
                    return (
                        <Image
                            style={{width:31,height:116,marginRight:0,marginTop:10}}
                            source={require('../../image/bill/payee_han.png')}
                            />
                    );
                    break;
                case 'DIS':
                    return (
                        <Image
                            style={{width:31,height:116,marginRight:0,marginTop:10}}
                            source={require('../../image/bill/payee_dis.png')}
                            />
                    );
                    break;
                case 'IGN':
                    return (
                        <Image
                            style={{width:31,height:116,marginRight:0,marginTop:10}}
                            source={require('../../image/bill/payee_ign.png')}
                            />
                    );
                    break;
            }
        }else if(role=='drawer'){
            switch(status){
                case 'NEW':;
                case 'REQ':;
                case 'HAN':
                    return (
                        <Image
                            style={{width:31,height:116,marginRight:0,marginTop:10}}
                            source={require('../../image/bill/drawer_wait.png')}
                            />
                    );
                    break;
                case 'DIS':
                    return (
                        <Image
                            style={{width:31,height:116,marginRight:0,marginTop:10}}
                            source={require('../../image/bill/drawer_dis.png')}
                            />
                    );
                    break;
                case 'IGN':
                    return (
                        <Image
                            style={{width:31,height:116,marginRight:0,marginTop:10}}
                            source={require('../../image/bill/drawer_ign.png')}
                            />
                    );
                    break;
            }
        }else{
            return null;
        }
    }
});

module.exports = StatusIcon;

