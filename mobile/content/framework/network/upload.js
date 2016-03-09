//var host="http://192.168.108.113:8080";
//var host="http://192.168.108.106:9081";
var host = "http://192.168.108.144:9081";

var AppStore = require('../store/appStore');
var AppDispatcher = require('../dispatcher/appDispatcher');
var ChatConstants = require('../../constants/command');
module.exports = function (url) {
    var obj = {
        uploadUrl: url,
        method: 'POST', // default 'POST',support 'POST' and 'PUT'
        headers: {
            'Accept': 'application/json',

            'Authorization': 'Basic  ' + AppStore.getToken()
        },
        fields: {
            'hello': 'world',
        },
        files: [
            {
                name: 'file',
                filename: '11.jpg', // require, file name
                filepath: fileURL, // require, file absoluete path
            },
        ]
    };
    FileUpload.upload(obj, function (err, result) {
        console.log('upload:', err, result);
    })
}