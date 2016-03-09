'use strict';

var React = require('react-native');
var {AlertIOS}=React
var Alert = function (title, _ok, _cancel) {
    let btnAry = new Array();
    if (_ok) {
        if (typeof _ok === 'function') {
            btnAry.push({
                text: '确定', onPress: () => _ok()
            });
        }
        else {
            btnAry.push(_ok);
        }

        if (_cancel) {
            if (typeof _cancel === 'function') {
                btnAry.push({
                    text: '取消', onPress: () => _cancel()
                });
            }
            else {
                btnAry.push(_cancel);
            }

        }
    }

    if (btnAry.length == 0) {
        btnAry.push({
            text: '确定', onPress: null
        });
    }
    if (btnAry.length == 2) {
        var obj = btnAry[0];
        btnAry[0] = btnAry[1];
        btnAry[1] = obj;
    }
    AlertIOS.alert(title, null, btnAry);
}
module.exports = Alert;