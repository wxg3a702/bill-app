'use strict'

var React = require('react-native');
var {Image,View,Text} = React;
var dateFormat = require('dateformat');

var PayeeDesc = React.createClass({

    render:function() {
        var {role, status, discountDate,estimatedIssueDate} = this.props;

        if(role=='payee' && status=='NEW' ) {
            return (
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={{ color:'#ff5b58',fontSize:15}}>{this.props.discountDueDate?dateFormat(new Date(this.props.discountDueDate), 'yyyy.mm.dd HH:MM'):"为知日期"}</Text>
                    <Text style={{ color:'#333333',fontSize:15}}>{'出票'}</Text>
                </View>
            );
        }else if(role=='payee' && status=='REQ'){
            return (
                <Text
                    style={{ color:'#7f7f7f',fontSize:15}}>{'请等待银行处理'}</Text>
            );
        }else if(role=='payee' && status=='HAN'){
            return (
                <Text
                    style={{ color:'#7f7f7f',fontSize:15}}>{'请等待银行处理'}</Text>
            );
        }else if(role=='payee' && status=='DIS'){
            return (
                <View style={{flexDirection:'row',alignItems: 'center'}}>
                    <Text style={{ color:'#43bb80',fontSize:15}}>{dateFormat(new Date(discountDate), 'yyyy.mm.dd')}</Text>
                    <Text style={{ color:'#7f7f7f',fontSize:15}}>{'贴现'}</Text>
                </View>
            );
        }else if(role=='payee' && status=='IGN'){
            return (
                <Text
                    style={{ color:'#7f7f7f',fontSize:15}}>{'请等待交易方取票'}</Text>

            );
        }else{
            return null;
        }
    }
});


module.exports = PayeeDesc;