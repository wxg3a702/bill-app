'use strict'

var React = require('react-native');
var {Image,View,Text} = React;
var dateFormat = require('dateformat');

var DrawerDesc = React.createClass({

    render: function () {
        var {role, status, discountDate} = this.props;

        if (role == 'drawer' && (status == 'NEW' || status == 'REQ' || status == 'HAN')) {
            return (
                <Text style={{ color:'#999999'}}>{'请等待承兑行出票'}</Text>
            );
        } else if (role == 'drawer' && status == 'IGN') {
            return (
                <Text style={{ color:'#ff5b58'}}>{'请至承兑行取票'}</Text>
            );
        } else if (role == 'drawer' && status == 'DIS') {
            return (
                <View style={{flexDirection:'row'}}>
                    <Text style={{ color:'#44bcb2'}}>{dateFormat(new Date(discountDate), 'yyyy.mm.dd')}</Text>
                    <Text style={{ color:'#999999'}}>{'贴现'}</Text>
                </View>
            );
        } else {
            return null;
        }
    }
});


module.exports = DrawerDesc;