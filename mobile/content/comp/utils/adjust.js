'use strict'
var React = require('react-native')
var {Dimensions}=React
var {width,height}=Dimensions.get('window');
module.exports = {
    width(data){
        return data / 375 * width
    }
}