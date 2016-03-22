const _ = require('lodash');
const Realm = require('realm');
const SCHEMA_KEY = 'persister';

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
    saveDemoFlag: (flag, cb) => _setDemoFlag(flag, cb),
};

let _clearToken = function () {
    _realm.write(() => {
        // Delete multiple books by passing in a `Results`, `List`,
        // or JavaScript `Array`
        let data = _realm.objects(SCHEMA_KEY);
        _realm.delete(data); // Deletes all books
    });
};
//_clearToken();

let _setItem = function (key, value, cb) {
    //let data = _realm.objects(SCHEMA_KEY)[0];
    //_realm.create(SCHEMA_KEY, _.assign(data, { key: value }), true);

    _persister[key] = JSON.stringify(value);
    _realm.create(SCHEMA_KEY, _persister, true);
    if (cb)cb();
};

let _setDemoFlag = function (value, cb) {
    _persister['demoFlag'] = Boolean(value);
    _realm.create(SCHEMA_KEY, _persister, true);
    if (cb)cb();
};


let _getAppData = function (cb) {
    let data = _realm.objects(SCHEMA_KEY);
    if (data.length > 0 && cb) {
        _persister = data[0];
        cb({
            token: JSON.parse(_persister.token),
            APNSToken: JSON.parse(_persister.APNSToken),
            revBillBean: JSON.parse(_persister.revBillBean),
            sentBillBean: JSON.parse(_persister.sentBillBean),
            filterBeans: JSON.parse(_persister.filterBeans),
            userInfoBean: JSON.parse(_persister.userInfoBean),
            orgBeans: JSON.parse(_persister.orgBeans),
            mainMsgBean: JSON.parse(_persister.mainMsgBean),
            marketMsgBeans: JSON.parse(_persister.marketMsgBeans),
            systemMsgBeans: JSON.parse(_persister.systemMsgBeans),
            sentBillMsgBeans: JSON.parse(_persister.sentBillMsgBeans),
            demoFlag: _persister.demoFlag
        });
    } else {
        cb({});
    }

    //if (cb)cb(_persister);
};

let _saveAppData = function (data) {
    // Create Realm objects and write to local storage
    _realm.write(() => {
        _persister = _realm.create(SCHEMA_KEY, {
            token: JSON.stringify(data.token),
            APNSToken: JSON.stringify(''),
            revBillBean: JSON.stringify(data.revBillBean),
            sentBillBean: JSON.stringify(data.sentBillBean),
            filterBeans: JSON.stringify(data.filterBeans),
            userInfoBean: JSON.stringify(data.userInfoBean),
            orgBeans: JSON.stringify(data.orgBeans),
            mainMsgBean: JSON.stringify(data.mainMsgBean),
            marketMsgBeans: JSON.stringify(data.marketMsgBeans),
            systemMsgBeans: JSON.stringify(data.systemMsgBeans),
            sentBillMsgBeans: JSON.stringify(data.sentBillMsgBeans),
            demoFlag: Boolean(data.demoFlag)
        });
    });
};

module.exports = PersisterFacade;