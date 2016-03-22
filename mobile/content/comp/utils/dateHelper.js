/**
 * Created by yhbao on 2015/12/29.
 */

'use strict'
var dateFormat = require('dateformat')
var _ = require('lodash');
module.exports = {
    format: function (date, fmt) {
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "H+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    formatTimeStamp: function (string) {
        string = string.replace(/-/g, '/');
        var date = new Date(string);
        return date.getTime();
    },

    df: function (data, fmt) {

        return dateFormat(new Date(data), fmt);
    },
    dfy: function (data) {
        if (_.isString(data)) return data;
        return dateFormat(new Date(data), 'yyyy-mm-dd');
    },
    descDate: function (time) {
        var now = new Date();
        var tag = new Date(time);
        // var t = now - time;
        if (now.getFullYear() == tag.getFullYear() && now.getMonth() == tag.getMonth() && now.getDate() == tag.getDate()) {
            return dateFormat(new Date(time), 'HH:MM');
        } else {
            var h = now.getHours();
            var m = now.getMinutes();
            var s = now.getSeconds();
            var ms = now.getMilliseconds();
            var today = now.getTime() - h * 60 * 60 * 1000 - m * 60 * 1000 - s * 1000 - ms;
            var twoD = today - 1 * 24 * 60 * 60 * 1000;

            if (now.getFullYear() == tag.getFullYear() && tag.getTime() >= twoD) {
                return "昨天";
            } else if (now.getFullYear() == tag.getFullYear() && tag.getTime() >= twoD - 1 * 24 * 60 * 60 * 1000) {
                return "前天";
            } else {
                return dateFormat(new Date(time), 'yyyy-mm-dd');
            }
        }
    },
    formatBillDetail(data){
        return dateFormat(new Date(data), 'yyyy年mm月dd日 HH:MM')
    },
    formatBillList(data){
        return dateFormat(new Date(data), 'yyyy.mm.dd HH:MM')
    },
    formatBillContent(data){
        return dateFormat(new Date(data), 'yyyy年mm月dd日')
    },
    formatFlow(data){
        return dateFormat(new Date(data), 'yyyy.mm.dd')
    },
    returnDate(){
        return 'RZ ' + dateFormat(new Date(), 'yyyy mmdd HHMM')
    }


};