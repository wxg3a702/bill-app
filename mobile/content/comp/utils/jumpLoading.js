'use strict'

var React = require('react-native');
var { View} = React;
var VIcon = require('../../comp/icon/vIcon')
var JumpLoading = React.createClass({
    render: function () {
        return (
            <View style={{justifyContent: 'center',alignItems: 'center',flex:1}}>
                <VIcon style={{flex:1,padding:15, justifyContent: 'center',alignItems: 'center'}} size={30}
                       color='#b2b2b2' direction='load'/>
            </View>
        );
    }
});


module.exports = JumpLoading;
