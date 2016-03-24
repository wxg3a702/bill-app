const _ = require('lodash');
const Realm = require('realm');
const {
  DeviceSchema,
  SCHEMA_DEVICE,
  ValueSchema,
  FlagSchema,
  TokenSchema,
  SCHEMA_TOKEN
  } = require('./schemas');

const DEVICE_ID = '-device-id-';


// Get the default Realm with support for our objects
let _realm = new Realm({schema: [DeviceSchema, ValueSchema, FlagSchema, TokenSchema]});
let _token = '';

let _clearToken = function () {
    _realm.write(() => {
        // Delete multiple books by passing in a `Results`, `List`,
        // or JavaScript `Array`
        let _persister = _realm.objects(SCHEMA_TOKEN);
        _realm.delete(_persister); // Deletes all books
    });
};
//_clearToken();

let _setValue = function (key, value, cb) {
    _realm.write(() => {
        _realm.create(SCHEMA_TOKEN, {
            token: _token,
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
        _realm.create(SCHEMA_TOKEN, {
            token: _token,
            flags: [{
                key: key,
                flag: Boolean(flag)
            }]
        }, true);
        if (cb)cb();
    });
};


let _getAppData = function (cb) {
    let deviceData = _realm.objects(SCHEMA_DEVICE);
    let tokenData = _realm.objects(SCHEMA_TOKEN);
    let _appObject = {};

    if (deviceData.length > 0) {
        let _persisterDevice = deviceData[0];
        _.assign(_appObject, {
            APNSToken: _persisterDevice.APNSToken,
        });
    }

    if (tokenData.length > 0) {
        let _persisterToken = tokenData[0];
        _token = _persisterToken.token;
        let _values = _persisterToken.values;

        _(_values).forEach((item) => {
            _appObject[item.key] = JSON.parse(item.value);
        });

        let _flags = _persisterToken.flags.filtered('key == "demoFlag"');
        _.assign(_appObject, {
            token: _persisterToken.token,
            demoFlag: _flags[0].flag
        });
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

let _saveAppData = function (data) {
    // Create Realm objects and write to local storage
    _token = data.token;
    _realm.write(() => {
        _realm.create(SCHEMA_TOKEN, {
            token: data.token,
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
                key: 'newOrg',
                value: JSON.stringify(data.newOrg)
            }, {
                key: 'mainMsgBean',
                value: JSON.stringify(data.mainMsgBean)
            }, {
                key: 'marketMsgBeans',
                value: JSON.stringify(data.marketMsgBeans)
            }, {
                key: 'systemMsgBeans',
                value: JSON.stringify(data.systemMsgBeans)
            }, {
                key: 'sentBillMsgBeans',
                value: JSON.stringify(data.sentBillMsgBeans)
            }],
            flags: [{
                key: 'demoFlag',
                flag: Boolean(data.demoFlag)
            }]
        }, true);
    });
};


let PersisterFacade = {
    getAppData: (cb) => _getAppData(cb),
    saveAppData: (data) => _saveAppData(data),
    clearToken: () => _clearToken(),
    saveAPNSToken: (apnsToken, cb) => _saveAPNToken(apnsToken, cb),
    setItem: (k, v, c) => _setValue(k, v, c),
    saveUser: (user, cb) => _setValue('userInfoBean', user, cb),
    saveOrg: (org, cb) => _setValue('certifiedOrgBean', org, cb),
    saveMsgDetail: (mainMsgBean, cb) => _setValue('mainMsgBean', mainMsgBean, cb),
    saveMainMsgBean: (mainMsgBean, cb) => _setValue('mainMsgBean', mainMsgBean, cb),
    saveDemoFlag: (flag, cb) => _setFlag('demoFlag', flag, cb),
};

module.exports = PersisterFacade;