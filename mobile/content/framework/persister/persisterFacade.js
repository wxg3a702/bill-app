const _ = require('lodash');
const Realm = require('realm');
const {
  DeviceSchema,
  SCHEMA_DEVICE,
  ValueSchema,
  FlagSchema,
  UserSchema,
  SCHEMA_USER
  } = require('./schemas');

const DEVICE_ID = '-device-id-';


// Get the default Realm with support for our objects
let _realm = new Realm({schema: [DeviceSchema, ValueSchema, FlagSchema, UserSchema], schemaVersion: 1});
let _userid = '';

let _clearToken = function (data) {
  //_userid = '';
  _realm.write(() => {
    _realm.create(SCHEMA_USER, {
      id: data.userInfoBean.id,
      token: '',
      lastLoginTime: new Date(),
      values: [{
        key: 'revBillBean',
        value: JSON.stringify({})
      }, {
        key: 'sentBillBean',
        value: JSON.stringify({})
      }, {
        key: 'filterBeans',
        value: JSON.stringify({})
      }, {
        key: 'userInfoBean',
        value: JSON.stringify({})
      }, {
        key: 'certifiedOrgBean',
        value: JSON.stringify({})
      }, {
        key: 'acceptanceBankBeans',
        value: JSON.stringify([])
      }, {
        key: 'newOrg',
        value: JSON.stringify({})
      }, {
        key: 'mainMsgBean',
        value: JSON.stringify(data.mainMsgBean) ? JSON.stringify(data.mainMsgBean) : JSON.stringify({})
      }, {
        key: 'marketMsgBeans',
        value: JSON.stringify(data.marketMsgBeans) ? JSON.stringify(data.marketMsgBeans) : JSON.stringify([])
      }, {
        key: 'systemMsgBeans',
        value: JSON.stringify(data.systemMsgBeans) ? JSON.stringify(data.systemMsgBeans) : JSON.stringify([])
      }, {
        key: 'sentBillMsgBeans',
        value: JSON.stringify(data.sentBillMsgBeans) ? JSON.stringify(data.sentBillMsgBeans) : JSON.stringify([])
      }],
      flags: [{
        key: 'demoFlag',
        flag: JSON.stringify(data.demoFlag)
      }]
    }, true);
    _userid = '';
  });
  /*_realm.write(() => {
    // Delete multiple books by passing in a `Results`, `List`,
    // or JavaScript `Array`
    let _persister = _realm.objects(SCHEMA_TOKEN);
    _realm.delete(_persister); // Deletes all books
  });*/

};
//_clearToken();

let _setValue = function (key, value, cb) {
  _realm.write(() => {
    _realm.create(SCHEMA_USER, {
      id: _userid,
      values: [{
        key: key,
        value: JSON.stringify(value)
      }]
    }, true);
    if (cb)cb();
  });
};

let _setFlag = function (key, flag, cb) {
  _realm.write(() => {
    _realm.create(SCHEMA_USER, {
      id: _userid,
      flags: [{
        key: key,
        flag: Boolean(flag)
      }]
    }, true);
    if (cb)cb();
  });
};


let _getAppData = function (cb, userId) {
  let deviceData = _realm.objects(SCHEMA_DEVICE);
  let userData = _realm.objects(SCHEMA_USER);
  let _appObject = {};

  if (deviceData.length > 0) {
    let _persisterDevice = deviceData[0];
    _.assign(_appObject, {
      APNSToken: _persisterDevice.APNSToken,
    });
  }

  if (userData.length > 0) {
    let _persisterUsers = [];
    if(userId) {
      _persisterUsers = userData.filtered('id = ' + userId);
    } else {
      _persisterUsers = userData.sorted('lastLoginTime');
    }
    if (_persisterUsers.length > 0) {
      let _persisterUser = _persisterUsers[0];
      _userid = _persisterUser.id;
      let _values = _persisterUser.values;
      _(_values).forEach((item) => {
        console.log(item.key + ":" + item.value);
        _appObject[item.key] = item.value ? JSON.parse(item.value) : {};
      });

      let _flags = _persisterUser.flags.filtered('key == "demoFlag"');
      _.assign(_appObject, {
        token: _persisterUser.token,
        demoFlag: JSON.parse(_flags[0].flag)
      });
      //let _persisterUser = userData[0];
      //if (userId) {
      //  userData.some((item, index) => {
      //    if (item.id === userId) {
      //      _persisterUser = item;
      //      return true;
      //    }
      //    return false;
      //  });
    }
  }

  if (cb) cb(_appObject);
};

let _saveAPNToken = function (_apnToken, cb) {
  console.log('apnToken => ' + _apnToken);
  _realm.write(() => {
    _realm.create(SCHEMA_DEVICE, {
      device: DEVICE_ID,
      APNSToken: _apnToken
    }, true);
    if (cb) cb();
  })
};

let _saveLoginData = (data, d) => {
  _userid = data.userInfoBean.id;
  _realm.write(() => {
    _realm.create(SCHEMA_USER, {
      id: _userid,
      token: data.token,
      lastLoginTime: new Date(),
      values: [{
        key: 'revBillBean',
        value: JSON.stringify(data.revBillBean)
      }, {
        key: 'sentBillBean',
        value: JSON.stringify(data.sentBillBean)
      }, {
        key: 'filterBeans',
        value: JSON.stringify(data.filterBeans)
      }, {
        key: 'userInfoBean',
        value: JSON.stringify(data.userInfoBean)
      }, {
        key: 'certifiedOrgBean',
        value: JSON.stringify(data.certifiedOrgBean)
      }, {
        key: 'acceptanceBankBeans',
        value: JSON.stringify(data.acceptanceBankBeans)
      }, {
        key: 'newOrg',
        value: JSON.stringify(data.newOrg) ? JSON.stringify(data.newOrg) : JSON.stringify({})
      }, {
        key: 'mainMsgBean',
        value: JSON.stringify(d.mainMsgBean) ? JSON.stringify(d.mainMsgBean) : JSON.stringify({})
      }, {
        key: 'marketMsgBeans',
        value: JSON.stringify(d.marketMsgBeans) ? JSON.stringify(d.marketMsgBeans) : JSON.stringify([])
      }, {
        key: 'systemMsgBeans',
        value: JSON.stringify(d.systemMsgBeans) ? JSON.stringify(d.systemMsgBeans) : JSON.stringify([])
      }, {
        key: 'sentBillMsgBeans',
        value: JSON.stringify(d.sentBillMsgBeans) ? JSON.stringify(d.sentBillMsgBeans) : JSON.stringify([])
      }],
      flags: [{
        key: 'demoFlag',
        flag: JSON.stringify(d.demoFlag)
      }]
    }, true);
  });
}

let _saveAppData = function (data) {
  let a = Date.now();
  // Create Realm objects and write to local storage
  _userid = data.userInfoBean.id;
  _realm.write(() => {
    _realm.create(SCHEMA_USER, {
      id: _userid,
      token: data.token,
      lastLoginTime: new Date(),
      values: [{
        key: 'revBillBean',
        value: JSON.stringify(data.revBillBean)
      }, {
        key: 'sentBillBean',
        value: JSON.stringify(data.sentBillBean)
      }, {
        key: 'filterBeans',
        value: JSON.stringify(data.filterBeans)
      }, {
        key: 'userInfoBean',
        value: JSON.stringify(data.userInfoBean)
      }, {
        key: 'certifiedOrgBean',
        value: JSON.stringify(data.certifiedOrgBean)
      }, {
        key: 'acceptanceBankBeans',
        value: JSON.stringify(data.acceptanceBankBeans)
      }, {
        key: 'newOrg',
        value: JSON.stringify(data.newOrg) ? JSON.stringify(data.newOrg) : JSON.stringify({})
      }, {
        key: 'mainMsgBean',
        value: JSON.stringify(data.mainMsgBean) ? JSON.stringify(data.mainMsgBean) : JSON.stringify({})
      }, {
        key: 'marketMsgBeans',
        value: JSON.stringify(data.marketMsgBeans) ? JSON.stringify(data.marketMsgBeans) : JSON.stringify([])
      }, {
        key: 'systemMsgBeans',
        value: JSON.stringify(data.systemMsgBeans) ? JSON.stringify(data.systemMsgBeans) : JSON.stringify([])
      }, {
        key: 'sentBillMsgBeans',
        value: JSON.stringify(data.sentBillMsgBeans) ? JSON.stringify(data.sentBillMsgBeans) : JSON.stringify([])
      }],
      flags: [{
        key: 'demoFlag',
        flag: JSON.stringify(data.demoFlag)
      }]
    }, true);
  });
};


let PersisterFacade = {
  getAppData: (cb, userId) => _getAppData(cb, userId),
  saveAppData: (data) => _saveAppData(data),
  clearToken: (data) => _clearToken(data),
  saveAPNSToken: (apnsToken, cb) => _saveAPNToken(apnsToken, cb),
  setItem: (k, v, c) => _setValue(k, v, c),
  saveUser: (user, cb) => _setValue('userInfoBean', user, cb),
  saveOrg: (org, cb) => _setValue('certifiedOrgBean', org, cb),
  saveMainMsgBean: (key, mainMsgBean, cb) => _setValue(key, mainMsgBean, cb),
  saveDemoFlag: (flag, cb) => _setFlag('demoFlag', flag, cb),
  saveLoginData: (data, d) => _saveLoginData(data, d),
};

module.exports = PersisterFacade;