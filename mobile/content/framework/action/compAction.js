var {BFetch,PFetch,UFetch,host,token} = require('../network/fetch');
var async = require('async')
var AppDispatcher = require('../dispatcher/appDispatcher');
var Command = require('../../constants/command');
var ActionTypes = Command.ActionTypes;
var _ = require('lodash');
var pub = "/pub";
var api = "/api"
var CompAction = {
    updateOrgBeans: (p, c, f)=> _updateOrgBeans(p, c, f),
    updateNewOrgInfo: (p, c, f)=> _updateNewOrgInfo(p, c, f),
    updateExist: (p, c, f)=>_updateExist(p, c, f),
    submitOrg: (p, c, f)=> _submitOrg(p, c, f),
    deleteOrg: (p, c, f)=>_deleteOrg(p, c, f),
    updateDefaultOrgByUser: (p, c, f)=>_updateDefaultOrgByUser(p, c, f)
}
var _deleteOrg = function (p, c, f) {
    PFetch(api + '/Organization/deleteOrg', p,
        function (msg) {
            AppDispatcher.dispatch({
                type: ActionTypes.DELETE_ORGBEANS,
                data: p
            })
            c(msg);
        },
        f
    )
}
var _updateDefaultOrgByUser = function (p, c, f) {
    PFetch(api + '/Organization/updateDefaultOrgByUser',
        {orgId: p.orgId}, function (msg) {
            AppDispatcher.dispatch({
                type: ActionTypes.UPDATE_USERINFO,
                data: {comp: p.comp}
            })
            c(msg);
        }, f
    )
}
var _updateExist = function (p, c, f) {
    AppDispatcher.dispatch({
        type: ActionTypes.UPDATE_EXISTORG,
        data: p,
        successHandle: c
    });
}
var _updateNewOrgInfo = function (p, c, f) {
    AppDispatcher.dispatch({
        type: ActionTypes.UPDATE_NEWORG,
        data: p,
        successHandle: c
    });
}
var _updateOrgBeans = function (p, c) {
    AppDispatcher.dispatch({
        type: ActionTypes.UPDATE_ORGBEANS,
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
                BFetch(api + "/Organization/updateOrg",
                    {
                        licenseCopyFileId: res[0].licenseCopyFileId.fileId,
                        corpIdentityFileId: res[1].corpIdentityFileId.fileId,
                        authFileId: res[2].authFileId.fileId,
                        authIdentityFileId: res[3].authIdentityFileId.fileId,
                        accountName: p.accountName,
                        accountNo: p.accountNo,
                        openBank: p.openBank
                    },
                    function (data) {
                        c(data)
                    },
                    function (err) {
                        _updateOrgBeans(p, f)
                    }, {custLoading: true}
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