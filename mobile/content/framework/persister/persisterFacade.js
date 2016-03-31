const _ = require('lodash');
const Realm = require('realm');
const {
  DeviceSchema,
  SCHEMA_DEVICE,
  UserSchema,
  SCHEMA_USER
  } = require('./schemas');
const DEVICE_ID = '-device-id-';


// Get the default Realm with support for our objects
let _realm = new Realm({schema: [DeviceSchema, UserSchema], schemaVersion: 4});
let _userid = '';
let _clearToken = function (data) {
  _realm.write(() => {
    _realm.create(SCHEMA_USER, {
      id: data.userInfoBean.id,
      token: '',
      lastLoginTime: new Date(),
      revBillBean:JSON.stringify({}),
      sentBillBean:JSON.stringify({}),
      filterBeans:JSON.stringify({}),
      userInfoBean:JSON.stringify({}),
      certifiedOrgBean: JSON.stringify({}),
      newOrg: JSON.stringify({}),
      mainMsgBean: JSON.stringify(data.mainMsgBean) ? JSON.stringify(data.mainMsgBean) : JSON.stringify({}),
      marketMsgBeans: JSON.stringify(data.marketMsgBeans) ? JSON.stringify(data.marketMsgBeans) : JSON.stringify([]),
      systemMsgBeans: JSON.stringify(data.systemMsgBeans) ? JSON.stringify(data.systemMsgBeans) : JSON.stringify([]),
      sentBillMsgBeans:  JSON.stringify(data.sentBillMsgBeans) ? JSON.stringify(data.sentBillMsgBeans) : JSON.stringify([]),
      demoFlag: JSON.stringify(data.demoFlag)
    }, true);
    _userid = '';
  });
};

let _getAppData = function (cb, userId) {
  let deviceData = _realm.objects(SCHEMA_DEVICE);
  let userData = _realm.objects(SCHEMA_USER);
  let _appObject = {};

  if (deviceData.length > 0) {
    let _persisterDevice = deviceData[0];
    _.assign(_appObject, {
      APNSToken: _persisterDevice.APNSToken
    });
  }

  if (userData.length > 0) {
    let _persisterUsers = [];
    if(userId) {
      _persisterUsers = userData.filtered('id = ' + userId);
    } else {
      _persisterUsers = userData.sorted('lastLoginTime',[true]);
      console.log(_persisterUsers)
    }
    if (_persisterUsers.length > 0) {
      let _persisterUser = _persisterUsers[0];
      _.assign(_appObject, {
        token: _persisterUser.token,
        lastLoginTime: _persisterUser.lastLoginTime,
        revBillBean: _persisterUser.revBillBean ? JSON.parse(_persisterUser.revBillBean) : {},
        sentBillBean: _persisterUser.sentBillBean ? JSON.parse(_persisterUser.sentBillBean) : {},
        filterBeans: _persisterUser.filterBeans ? JSON.parse(_persisterUser.filterBeans) : {},
        userInfoBean: _persisterUser.userInfoBean ? JSON.parse(_persisterUser.userInfoBean) : {},
        certifiedOrgBean: _persisterUser.certifiedOrgBean ? JSON.parse(_persisterUser.certifiedOrgBean) : {},
        newOrg: _persisterUser.newOrg ? JSON.parse(_persisterUser.newOrg) : {},
        mainMsgBean: _persisterUser.mainMsgBean ? JSON.parse(_persisterUser.mainMsgBean) : {},
        marketMsgBeans: _persisterUser.marketMsgBeans ? JSON.parse(_persisterUser.marketMsgBeans) : [],
        systemMsgBeans: _persisterUser.systemMsgBeans ? JSON.parse(_persisterUser.systemMsgBeans) : [],
        sentBillMsgBeans: _persisterUser.sentBillMsgBeans ? JSON.parse(_persisterUser.sentBillMsgBeans) : [],
        demoFlag: _persisterUser.demoFlag ? JSON.parse(_persisterUser.demoFlag) : {},
        acceptanceBankBeans:_persisterUser.acceptanceBankBeans,
        revBillMessage:_persisterUser.revBillMessage,
        newsMessage:_persisterUser.newsMessage
      });
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
      revBillBean:JSON.stringify(data.revBillBean),
      sentBillBean:JSON.stringify(data.sentBillBean),
      filterBeans:JSON.stringify(data.filterBeans),
      userInfoBean:JSON.stringify(data.userInfoBean),
      certifiedOrgBean:JSON.stringify(data.certifiedOrgBean),
      newOrg:  JSON.stringify(data.newOrg) ? JSON.stringify(data.newOrg) : JSON.stringify({}),
      mainMsgBean: JSON.stringify(d.mainMsgBean) ? JSON.stringify(d.mainMsgBean) : JSON.stringify({}),
      marketMsgBeans: JSON.stringify(d.marketMsgBeans) ? JSON.stringify(d.marketMsgBeans) : JSON.stringify([]),
      systemMsgBeans: JSON.stringify(d.systemMsgBeans) ? JSON.stringify(d.systemMsgBeans) : JSON.stringify([]),
      sentBillMsgBeans:  JSON.stringify(d.sentBillMsgBeans) ? JSON.stringify(d.sentBillMsgBeans) : JSON.stringify([]),
      demoFlag: JSON.stringify(d.demoFlag),
      acceptanceBankBeans:JSON.stringify(data.acceptanceBankBeans),
      revBillMessage:true,
      newsMessage:true
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
      revBillBean:JSON.stringify(data.revBillBean),
      sentBillBean:JSON.stringify(data.sentBillBean),
      filterBeans:JSON.stringify(data.filterBeans),
      userInfoBean:JSON.stringify(data.userInfoBean),
      certifiedOrgBean:JSON.stringify(data.certifiedOrgBean),
      newOrg:  JSON.stringify(data.newOrg) ? JSON.stringify(data.newOrg) : JSON.stringify({}),
      mainMsgBean: JSON.stringify(data.mainMsgBean) ? JSON.stringify(data.mainMsgBean) : JSON.stringify({}),
      marketMsgBeans: JSON.stringify(data.marketMsgBeans) ? JSON.stringify(data.marketMsgBeans) : JSON.stringify([]),
      systemMsgBeans: JSON.stringify(data.systemMsgBeans) ? JSON.stringify(data.systemMsgBeans) : JSON.stringify([]),
      sentBillMsgBeans:  JSON.stringify(data.sentBillMsgBeans) ? JSON.stringify(data.sentBillMsgBeans) : JSON.stringify([]),
      demoFlag: JSON.stringify(data.demoFlag),
      acceptanceBankBeans:JSON.stringify(data.acceptanceBankBeans),
      revBillMessage:true,
      newsMessage:true
    }, true);
  });
};

let PersisterFacade = {
  getAppData: (cb, userId) => _getAppData(cb, userId),
  saveAppData: (data) => _saveAppData(data),
  clearToken: (data) => _clearToken(data),
  saveAPNSToken: (apnsToken, cb) => _saveAPNToken(apnsToken, cb),
  saveLoginData: (data, d) => _saveLoginData(data, d)
};

module.exports = PersisterFacade;