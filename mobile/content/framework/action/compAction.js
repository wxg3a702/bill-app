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
    updateNewOrgInfo: (p, c, f)=> _updateNewOrgInfo(p, c, f),
    submitOrg: (p, c, f)=> _submitOrg(p, c, f),
    getOrgList: (c, f)=>PFetch(api + '/Organization／getOrg', '', c, f)
}
var _updateNewOrgInfo = function (p, c, f) {
    AppDispatcher.dispatch({
        type: ActionTypes.UPDATE_NEWORG,
        data: p,
        successHandle: c
    });
}

var _updateCompBaseInfo = function (p, c) {
    AppDispatcher.dispatch({
        type: ActionTypes.UPDATE_COMPBASEINFO,
        data: p,
        successHandle: c
    });
}
var _submitOrg = function (p, c, f) {
    async.series([
            uploadFileHandle(p, 'licenseCopyFileId'),
            uploadFileHandle(p, 'corpIdentityFileId'),
            uploadFileHandle(p, 'authFileId'),
            uploadFileHandle(p, 'authIdentityFileId'),
        ],
        function (err, res) {
            if (err) {
                f();
            } else {
                BFetch(api + "/Organization/updateOrg", p,
                    function (res) {
                        c()
                    },
                    function (err) {
                        f()
                    },
                    {custLoading: true}
                )
            }
        })
}
var uploadFileHandle = function (params, fileFieldName) {
    return function (callback) {
        UFetch(api + '/File/uploadFile',
            {
                uri: params[fileFieldName],
                type: 'image/jpeg',
                name: fileFieldName,
            },
            function (data) {
                callback(null, {[fileFieldName]: data});
            },
            function (err) {
                callback(err, fileFieldName);
            });
    }
}

module.exports = CompAction