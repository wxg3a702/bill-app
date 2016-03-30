const SCHEMA_DEVICE = 'device';
const SCHEMA_USER = 'user';
const SCHEMA_VALUE = 'value';
const SCHEMA_FLAG = 'flag';

let DeviceSchema = {
  name: SCHEMA_DEVICE,
  primaryKey: 'device',
  properties: {
    device: {type: 'string'},
    APNSToken: {type: 'string', optional: true}
  }
};

let ValueSchema = {
  name: SCHEMA_VALUE,
  primaryKey: 'key',
  properties: {
    key: {type: 'string'},
    value: {type: 'string'}
  }
};

let FlagSchema = {
  name: SCHEMA_FLAG,
  primaryKey: 'key',
  properties: {
    key: {type: 'string'},
    flag: {type: 'string'}
  }
};

let UserSchema = {
  name: SCHEMA_USER,
  primaryKey: 'id',
  properties: {
    id: 'int',
    token: {type: 'string', optional: true},
    lastLoginTime: {type: 'date', optional: true},
    values: {type: 'list', objectType: SCHEMA_VALUE},
    flags: {type: 'list',  objectType: SCHEMA_FLAG}
  }
};

module.exports = {
  DeviceSchema: DeviceSchema,
  SCHEMA_DEVICE: SCHEMA_DEVICE,
  ValueSchema: ValueSchema,
  SCHEMA_VALUE: SCHEMA_VALUE,
  FlagSchema: FlagSchema,
  SCHEMA_FLAG: SCHEMA_FLAG,
  UserSchema: UserSchema,
  SCHEMA_USER: SCHEMA_USER
};