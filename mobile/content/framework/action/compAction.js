var {BFetch,PFetch,UFetch,host,token} = require('../network/fetch');
var async = require('async')
var AppDispatcher = require('../dispatcher/appDispatcher');
var Command = require('../../constants/command');
var ActionTypes = Command.ActionTypes;
var _ = require('lodash');
var pub = "/pub";
var api = "/api"
var CompAction = {
    updateCompBaseInfo: (p, c, f)=> _updateCompBaseInfo(p, c, f),
    submitOrg: (p, c, f)=> _submitOrg(p, c, f),
}
var _updateCompBaseInfo = function (p, c, f) {

    AppDispatcher.dispatch({
        type: ActionTypes.UPDATE_COMPBASEINFO,
        data: p,
        successHandle: c
    });
}
var _submitOrg = function (p, c, f) {
    async.series([
            uploadFileHandle(p, 'licenseCopyFileId'),
            uploadFileHandle(p, 'orgCodeCopyFileId'),
            uploadFileHandle(p, 'taxFileId'),
            uploadFileHandle(p, 'corpIdentityFileId'),
            uploadFileHandle(p, 'authFileId'),
            uploadFileHandle(p, 'authIdentityFileId'),
        ],
        function (err, res) {
            if (err) {
                f();
            } else {
                BFetch(api + "/Organization/updateOrg", p,
                    function (data) {
                        _updateCompBaseInfo({
                            biStatus: 'CERTIFIED',
                            userType: 'CERTIFIED'
                        })
                        c()
                    },
                    function (err) {
                        f()
                    }, {custLoading: true}
                )
            }
        })
}
var uploadFileHandle = function (params, fileFieldName) {
    return function (callback) {
        UFetch(api + '/File/uploadFile',
            {
                uri: params[name],
                type: 'image/jpeg',
                name: name,
            },
            function (data) {
                callback(null, name);
            },
            function (err) {
                callback(err, name);
            });
    }
}
module.exports = CompAction