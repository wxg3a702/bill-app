'use strict';
var React = require('react-native');
var {View,Image}=React
module.exports = {
    returnNumber(url, index, size){
        if (!size) size = 1
        return (
            <View style={{flex:size}} key={index}>
                <Image style={{height:100}} resizeMode="stretch" source={url}/>
            </View>
        );
    },
    returnNum: function (item, index) {
        switch (item) {
            case '0':
            {
                return this.returnNumber(require('../../image/home/zero.png'), index);
                break;
            }
            case '1':
            {
                return this.returnNumber(require('../../image/home/one.png'), index);
                break;
            }
            case '2':
            {
                return this.returnNumber(require('../../image/home/two.png'), index);
                break;
            }
            case '3':
            {
                return this.returnNumber(require('../../image/home/three.png'), index);
                break;
            }
            case '4':
            {
                return this.returnNumber(require('../../image/home/four.png'), index);
                break;
            }
            case '5':
            {
                return this.returnNumber(require('../../image/home/five.png'), index);
                break;
            }
            case '6':
            {
                return this.returnNumber(require('../../image/home/six.png'), index);
                break;
            }
            case '7':
            {
                return this.returnNumber(require('../../image/home/seven.png'), index);
                break;
            }
            case '8':
            {
                return this.returnNumber(require('../../image/home/eight.png'), index);
                break;
            }
            case '9':
            {
                return this.returnNumber(require('../../image/home/nine.png'), index);
                break;
            }
            case ',':
            {
                return this.returnNumber(require('../../image/home/spit.png'), index);
                break;
            }
            case 'W':
            {
                return this.returnNumber(require('../../image/home/10K.png'), index, 2);
                break;
            }
        }
    }
}