const SCHEMA_DEVICE = 'device';
const SCHEMA_USER = 'user';

let DeviceSchema = {
  name: SCHEMA_DEVICE,
  primaryKey: 'device',
  properties: {
    device: {type: 'string'},
    APNSToken: {type: 'string', optional: true}
  }
};

let UserSchema = {
  name: SCHEMA_USER,
  primaryKey: 'id',
  properties: {
    id: 'int',
    token: {type: 'string', optional: true},
    lastLoginTime: {type: 'date', optional: true},
    revBillBean: {type: 'string', optional: true},
    sentBillBean: {type: 'string', optional: true},
    filterBeans: {type: 'string', optional: true},
    userInfoBean: {type: 'string', optional: true},
    certifiedOrgBean: {type: 'string', optional: true},
    newOrg: {type: 'string', optional: true},
    mainMsgBean: {type: 'string', optional: true},
    marketMsgBeans: {type: 'string', optional: true},
    systemMsgBeans: {type: 'string', optional: true},
    sentBillMsgBeans: {type: 'string', optional: true},
    demoFlag: {type: 'string', optional: true},
    revBillMessage:{type: 'boolean', optional: true},
    newsMessage:{type: 'boolean', optional: true},
    acceptanceBankBeans:{type: 'string', optional: true}
  }
};

module.exports = {
  DeviceSchema: DeviceSchema,
  SCHEMA_DEVICE: SCHEMA_DEVICE,
  UserSchema: UserSchema,
  SCHEMA_USER: SCHEMA_USER
};