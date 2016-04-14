var {BFetch, PFetch, UFetch, host, token} = require('../network/fetch');
var async = require('async')
var AppDispatcher = require('../dispatcher/appDispatcher');
var Command = require('../../constants/command');
var ActionTypes = Command.ActionTypes;
var _ = require('lodash');
var pub = "/pub";
var api = "/api"
var CompAction = {
  updateNewOrgInfo: (p, c, f)=> _updateNewOrgInfo(p, c, f),
  updateExist: (p, c, f)=>_updateExist(p, c, f),
  submitOrg: (p, c, f)=> _submitOrg(p, c, f),
  getOrgList: (c, f)=>PFetch(api + '/Organization／getOrg', '', c, f),
  deleteOrg: (p, c, f)=>_deleteOrg(p, c, f),
  updateDefaultOrgByUser: (p, c, f)=>_updateDefaultOrgByUser(p, c, f),

  //重置用户默认公司,即把用户公司设置成未设置状态
  unSetDefaultOrg: (p, c, f) =>_unSetDefaultOrg(p, c, f),

  clearNewOrg: ()=>_clearNewOrg(),
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
                data: {defaultOrgName: p.defaultOrgName}
            })
            c(msg);
        }, f
    )
}

var _unSetDefaultOrg = function (p, c, f) {
    BFetch(api + '/User/unSetDefaultOrg',
        {},
        function (msg) {
            AppDispatcher.dispatch({
                type: ActionTypes.UPDATE_USERINFO,
                data: {defaultOrgName: p.defaultOrgName}
            })
            c(msg);
        }, f
    )
};

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
var _clearNewOrg = function () {
  AppDispatcher.dispatch({
    type: ActionTypes.CLEAR_NEWORG
  });
}

var _updateOrgBeans = function (p, c) {
  AppDispatcher.dispatch({
    type: ActionTypes.UPDATE_ORGBEANS,
    data: p,
    successHandle: c
  });
}
var _updateUnAuditing = function (p, c) {
  AppDispatcher.dispatch({
    type: ActionTypes.UPDATE_UNAUDITING,
    data: p,
    successHandle: c
  });
}
var _submitOrg = function (p, c, f) {
  let arrs = [uploadFileHandle(p, 'licenseCopyFileId')];
  if (p.corpIdentityFileId && !_.isEmpty(p.corpIdentityFileId)) {
    arrs.push(uploadFileHandle(p, 'corpIdentityFileId'))
  }
  if (p.authFileId && !_.isEmpty(p.authFileId)) {
    arrs.push(uploadFileHandle(p, 'authFileId'))
  }
  if (p.authIdentityFileId && !_.isEmpty(p.authIdentityFileId)) {
    arrs.push(uploadFileHandle(p, 'authIdentityFileId'))
  }
  async.series(arrs,
    function (err, res) {
      if (err) {
        f();
      } else {
        let params = {
          licenseCopyFileId: res[0].licenseCopyFileId.fileId,
          accountName: p.accountName,
          accountNo: p.accountNo,
          openBank: p.openBank
        };
        if (res[1].corpIdentityFileId && !_.isEmpty(res[1].corpIdentityFileId)) {
          params.corpIdentityFileId = res[1].corpIdentityFileId.fileId;
          if (res.length > 2 && res[2].authFileId && !_.isEmpty(res[2].authFileId)) {
            params.authFileId = res[2].authFileId.fileId;
            if (res.length > 3 && res[3].authIdentityFileId && !_.isEmpty(res[3].authIdentityFileId)) {
              params.authIdentityFileId = res[3].authIdentityFileId.fileId;
            }
          } else if (res.length > 2 && res[2].authIdentityFileId && !_.isEmpty(res[2].authIdentityFileId)) {
            params.authIdentityFileId = res[2].authIdentityFileId.fileId;
          }
        } else {
          params.authFileId = res[1].authFileId.fileId;
          params.authIdentityFileId = res[2].authIdentityFileId.fileId;
        }
        BFetch(api + "/Organization/updateOrg",
          params,
          function (data) {
            if (!data) {
              p.id = data.id
            }
            if (p.status == 'UNAUDITING') {
              p.status = 'AUDITING'
              _updateUnAuditing(p, c(data))
            } else {
              p.status = 'AUDITING'
              _updateOrgBeans(p, c(data));
            }
          },
          function (err) {
            p.status = 'UNAUDITING'
            _updateOrgBeans(p, f)
          }, {custLoading: true}
        )
      }
    })
}
var uploadFileHandle = function (params, fileFieldName) {
  return function (callback) {
    if (params[fileFieldName].indexOf("_userId") > -1) {
      var data = {fileId: params[fileFieldName]}
      callback(null, {[fileFieldName]: data});
    } else {
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


}

module.exports = CompAction