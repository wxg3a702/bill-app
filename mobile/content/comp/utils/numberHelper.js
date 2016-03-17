/**
 * Created by yhbao on 2015/12/29.
 */

'use strict'
var numeral = require('numeral');
module.exports = {
    number(data){
        return numeral(data).format('0,0');
    },
    number2(data){
        return numeral(data/10000).format('0,0.00');
    },
    number4(data){
        return numeral(data).format('0,0.0000');
    },
    phoneNumber(data){
        return data.substring(0, 3) + "****" + data.substring(7, 11)
    }
};