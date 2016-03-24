const SCHEMA_DEVICE = 'device';
const SCHEMA_TOKEN = 'token';
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
    flag: {type: 'bool'}
  }
};

let TokenSchema = {
  name: SCHEMA_TOKEN,
  primaryKey: 'token',
  properties: {
    token: {type: 'string'},
    values: {type: 'list', objectType: SCHEMA_VALUE},
    flags: {type: 'list',  objectType: SCHEMA_FLAG}
  }
};

module .exports = {
  DeviceSchema: DeviceSchema,
  SCHEMA_DEVICE: SCHEMA_DEVICE,
  ValueSchema: ValueSchema,
  SCHEMA_VALUE: SCHEMA_VALUE,
  FlagSchema: FlagSchema,
  SCHEMA_FLAG: SCHEMA_FLAG,
  TokenSchema: TokenSchema,
  SCHEMA_TOKEN: SCHEMA_TOKEN,
};