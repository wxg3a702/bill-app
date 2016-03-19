const _ = require('lodash');
const Realm = require('realm');
const SCHEMA_KEY = '@realm:schema';

let PersisterSchema = {
    name: SCHEMA_KEY,
    primaryKey: 'token',
    properties: {
        token: {type: 'string'},
        APNSToken: {type: 'string'},
        revBillBean: {type: 'string'},
        sentBillBean: {type: 'string'},
        filterBeans: {type: 'string'},
        userInfoBean: {type: 'string'},
        orgBeans: {type: 'string'},
        mainMsgBean: {type: 'string'},
        marketMsgBeans: {type: 'string'},
        systemMsgBeans: {type: 'string'},
        sentBillMsgBeans: {type: 'string'},
        demoFlag: {type: 'bool'}
    }
};
// Get the default Realm with support for our objects
let _realm = new Realm({schema: [PersisterSchema]});
let _persister = null;

let PersisterFacade = {
    getAppData: (cb) => _getAppData(cb),
    saveAppData: (data) => _saveAppData(data),
    clearToken: () => _clearToken(),
    saveAPNSToken: (apnsToken, cb) => _setItem('APNSToken', apnsToken, cb),
    setItem: (k, v, c) => _setItem(k, v, c),
    saveUser: (user, cb) => _setItem('userInfoBean', user, cb),
    saveOrg: (org, cb) => _setItem('orgBeans', org, cb),
    saveMsgDetail: (mainMsgBean, cb) => _setItem('mainMsgBean', mainMsgBean, cb),
    saveMainMsgBean: (mainMsgBean, cb) => _setItem('mainMsgBean', mainMsgBean, cb),
    saveDemoFlag: (flag, cb) => _setItem('demoFlag', flag, cb)
};

let _clearToken = function () {
    realm.delete(_persister);
};

let _setItem = function (key, value, cb) {
    //let data = _realm.objects(SCHEMA_KEY)[0];
    //realm.create(SCHEMA_KEY, _.assign(data, { key: value }), true);

    _persister[key] = value;
    realm.create(SCHEMA_KEY, _persister, true);
    //if (cb)cb();
};


let _getAppData = function (cb) {
    //let data = _realm.objects(SCHEMA_KEY)[0];
    //if (cb)cb(data);
    if (cb)cb(_persister);
};

let _saveAppData = function (data) {
    // Create Realm objects and write to local storage
    _realm.write(() => {
        _persister = _realm.create(SCHEMA_KEY, {
            token: JSON.stringify(data.token),
            APNSToken: '',
            revBillBean: JSON.stringify(data.revBillBean),
            sentBillBean: JSON.stringify(data.sentBillBean),
            filterBeans: JSON.stringify(data.filterBeans),
            userInfoBean: JSON.stringify(data.userInfoBean),
            orgBeans: JSON.stringify(data.orgBeans),
            mainMsgBean: JSON.stringify(data.mainMsgBean),
            marketMsgBeans: JSON.stringify(data.marketMsgBeans),
            systemMsgBeans: JSON.stringify(data.systemMsgBeans),
            sentBillMsgBeans: JSON.stringify(data.sentBillMsgBeans),
            demoFlag: JSON.stringify(data.demoFlag)
        });
    });
};

module.exports = PersisterFacade;