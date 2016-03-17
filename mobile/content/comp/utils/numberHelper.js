/**
 * Created by yhbao on 2015/12/29.
 */

'use strict'
var numeral = require('numeral');
var _ = require('lodash')
module.exports = {
    number(data){
        return numeral(data).format('0,0');
    },
    number2(data){
        return numeral(data / 10000).format('0,0.00');
    },
    number4(data){
        return numeral(data).format('0,0.0000');
    },
    phoneNumber(data){
        return data.substring(0, 3) + "****" + data.substring(7, 11)
    },
    formatRate(data){
        return numeral(data * 1000).format("0,0.00") + "‰"
    },
    formatNum(data, f, e){
        return data.substring(0, f) + _.pad('', data.length - f - e, '*') + data.substring(data.length - e, data.length)
    }
};