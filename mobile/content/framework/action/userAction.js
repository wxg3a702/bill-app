var {BFetch,PFetch,UFetch,host,token} = require('../network/fetch');
var async = require('async')
var AppDispatcher = require('../dispatcher/appDispatcher');
var Command = require('../../constants/command');
var ActionTypes = Command.ActionTypes;
var _ = require('lodash');
var pub = "/pub";
var api = "/api"
var UserActions = {
    updateUser: (p, c, f)=>_updateUser(api + "/User/updateUser", p, c, f),
    updateUserHead: (p, c, f)=> _updateUserHead(p, c, f),
    feedbackOpinion: (p, c, f)=>BFetch(api + "/User/feedbackOpinion", p, c, f),
    getFile: (fid)=>host + api + '/File/downLoad/' + fid + '?token=' + token(),
    getRegion: (f, e)=>_getRegion(f, e),
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
                callback(null, {[fileFieldName]:data});
            },
            function (err) {
                callback(err, fileFieldName);
            });
    }
}

var _updateUserHead = function (p, c, f) {
    async.series([uploadFileHandle(p,'photoStoreId')],
        function (err, res) {
            if (err) {
                f();
            } else {
                UserActions.updateUser(
                    {photoStoreId: res[0]['photoStoreId'].fileId},
                    function(data){
                        console.log(err);
                    },
                    function(err){
                        console.log(err);
                    },
                    {custLoading: true}
                )
            }
        }
    );
}
var _updateUser = function (u, p, c, f,option) {
    var key = _.keys(p)[0];
    var value = p[key]
    BFetch(u, {column: key, value: value},
        function (msg) {
            AppDispatcher.dispatch({
                type: ActionTypes.UPDATE_USERINFO,
                data: p
            });
            c(msg);
        },
        f,
        option
    )
}
var _getRegion = function (cb, e) {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    function success(pos) {
        var crd = pos.coords;
        fetch('http://api.map.baidu.com/geocoder/v2/?ak=ks20zOgRmsf5rdSM9n0i9FPK&location=' + crd.latitude + ',' + crd.longitude + '&output=json')
            .then((response) =>
                response.json())
            .then(((json) => {
                console.log(json);
                cb(json.result.addressComponent.province.substr(0, 2) + ' ' + json.result.addressComponent.city.substr(0, 2))
            }).bind(this))
            .catch((error) => {
                console.warn(error);
                e('定位失败');
            });
    };
    function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
        e('定位失败');
    };
    navigator.geolocation.getCurrentPosition(success.bind(this), error, options);
}
module.exports = UserActions