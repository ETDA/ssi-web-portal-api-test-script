export const CONFIG = {
  // BASE_URL: 'https://93b6f86bc25f.ngrok.io',
  BASE_URL: 'https://ssi.teda.th',
  MOBILE_URL: 'https://ssi.teda.th'
}

export const USER_INFO = {
  USER_NAME: 'ton@finema.co',
  PASSWORD: '12345678'
}

export const UPLOAD_KEY_TYPE = {
  ECDSA: 'ECDSA',
  RSA: 'RSA'
}
export const SCHEMA_ACCESS = {
  TOKEN: 'f36788684ae6f8baa20b6988dd4b53c542bed161e1c0ea4ed89f275a7b3ee56c'
}

export const WALLET_ACCESS = {
  TOKEN: 'c43639bee73a503cbd18b8736165b5d5edd5ff7d68b3c2c8b819331176c6d553'
}

export const USER_ROLE = {
  ADMIN: 'ADMIN',
  MOD: 'MOD',
  MEMBER: 'MEMBER'
}

export const VC_STATUS = {
  ACTIVE: 'active',
  CANCELED: 'CANCELED'
}

export const REQUEST_VP_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  CANCEL: 'CANCEL'
}

export const ID_INFO = {
  DATE_OF_BIRTH: {
    CORRECT: '6 มี.ค. 2537',
    INCORRECT: ''
  },
  LASER_ID: {
    CORRECT: 'JT3-1031897-60',
    INCORRECT: ''
  },
  EMAIL: {
    CORRECT: 'test@finema.co',
    INCORRECT: ''
  }
}

export const OPERATION = {
  DID_REGISTER: 'DID_REGISTER',
  DID_KEY_ADD: 'DID_KEY_ADD',
  DID_KEY_REVOKE: 'DID_KEY_REVOKE',
  VC_REGISTER: 'VC_REGISTER',
  VC_REVOKE: 'VC_REVOKE',
  VC_SCHEMA_CREATE: 'VC_SCHEMA_CREATE',
  VC_SCHEMA_UPDATE: 'VC_SCHEMA_UPDATE',
  VC_ADD_STATUS: 'VC_ADD_STATUS',
  VC_UPDATE_STATUS: 'VC_UPDATE_STATUS',
  VC_WALLET_CREATE: 'VC_WALLET_CREATE',
  VC_WALLET_ADD: 'VC_WALLET_ADD',
  VP_UPDATE_STATUS: 'VP_UPDATE_STATUS',
  WALLET_CREATE: 'WALLET_CREATE',
  WALLET_VC_ADD: 'WALLET_VC_ADD',
  WALLET_VP_ADD: 'WALLET_VP_ADD',
  REQUEST_CREATE: 'REQUEST_CREATE',
  DID_RECOVERER_ADD: 'DID_RECOVERER_ADD',
  DID_KEY_RESET: 'DID_KEY_RESET',
  VC_TAG_STATUS: 'VC_TAG_STATUS'
}

export const KEY_TYPE = {
  EcdsaSecp256r1VerificationKey2019: 'EcdsaSecp256r1VerificationKey2019',
  RsaVerificationKey2018: 'RsaVerificationKey2018'
}

export const INVALID = {
  INVALID_CREDENTIALS: {
    CODE: 'INVALID_CREDENTIALS',
    MESSAGE: 'email or password is an invalid'
  },
  INVALID_TOKEN: {
    CODE: 'INVALID_TOKEN',
    MESSAGE: 'Token is invalid'
  },
  INVALID_CURRENT_PASSWORD: {
    CODE: 'INVALID_CURRENT_PASSWORD',
    MESSAGE: 'current password does not match'
  },
  INVALID_STRING_SIZE_MIN: {
    CODE: 'INVALID_STRING_SIZE_MIN',
    MESSAGE: 'The new_password field must not be shorter than 8 character(s)'
  },
  SCHEMA_NOT_FOUND: {
    CODE: 'SCHEMA_NOT_FOUND',
    MESSAGE: 'schema is not found'
  },
  CONFIG_NOT_FOUND: {
    CODE: 'CONFIG_NOT_FOUND',
    MESSAGE: 'config is not found'
  },
  WALLET_CONFIG_NOT_CORRECT: {
    CODE: 'WALLET_CONFIG_NOT_CORRECT',
    MESSAGE: 'Endpoint or Access token is not correct'
  }
}

export const INVALID_PARAMS = {
  CODE: 'INVALID_PARAMS',
  MESSAGE: 'Invalid parameters',
  EMAIL: {
    CODE: 'REQUIRED',
    MESSAGE: 'The email field is required'
  },
  EMAIL_FORMAT: {
    CODE: 'INVALID_FORMAT',
    MESSAGE: 'The email field must be Email Address'
  },
  PASSWORD: {
    CODE: 'REQUIRED',
    MESSAGE: 'The password field is required'
  },
  NAME: {
    CODE: 'REQUIRED',
    MESSAGE: 'The name field is required'
  },
  ENDPOINT: {
    CODE: 'REQUIRED',
    MESSAGE: 'The endpoint field is required'
  },
  TOKEN: {
    CODE: 'REQUIRED',
    MESSAGE: 'The token field is required'
  },
  ACCESS_TOKEN: {
    CODE: 'REQUIRED',
    MESSAGE: 'The access_token field is required'
  },
  PARAMS: {
    CODE: 'INVALID_PARAMS',
    MESSAGE: 'Invalid parameters'
  },
  SIGNATURE: {
    CODE: 'INVALID_SIGNATURE',
    MESSAGE: 'Signature is not valid'
  },
  SCHEMA_BODY: {
    CODE: 'INVALID_TYPE',
    MESSAGE: 'schema_body field must be requests.VCSchemaSchemaBody type'
  },
  JSON_SCHEMA: {
    CODE: 'INVALID_JSON_SCHEMA',
    MESSAGE: 'schema is not valid'
  },
  SCHEMA_BODY_DEGREE_VALUE: {
    CODE: 'INVALID_JSON',
    MESSAGE: 'The schema.schema_body.degree.value field must be json object'
  },
  SCHEMA_BODY_DEGREE_REQUIRED: {
    CODE: 'INVALID_TYPE',
    MESSAGE: 'The schema.schema_body.degree.required field must be boolean'
  },
  SCHEMA_BODY_DEGREE_VALUE_NAME_REQUIRED: {
    CODE: 'INVALID_TYPE',
    MESSAGE: 'The schema.schema_body.degree.value.name.required field must be boolean'
  },
  SCHEMA_BODY_DEGREE_VALUE_TYPE_REQUIRED: {
    CODE: 'INVALID_TYPE',
    MESSAGE: 'The schema.schema_body.degree.value.type.required field must be boolean'
  },
  SCHEMA_BODY_DEGREE_ID_REQUIRED: {
    CODE: 'INVALID_TYPE',
    MESSAGE: 'The schema.schema_body.degree_id.required field must be boolean'
  },
  SCHEMA_BODY_DEGREE_NAME_TYPE_AS_OBJ: {
    CODE: 'NESTED_OBJECT_DISALLOWED',
    MESSAGE: 'The field degree.value.name.type cannot be object'
  },
  SCHEMA_BODY_DEGREE_TYPE_TYPE_AS_OBJ: {
    CODE: 'NESTED_OBJECT_DISALLOWED',
    MESSAGE: 'The field degree.value.type.type cannot be object'
  },
  VERSION_DISALLOWED: {
    CODE: 'VERSION_DISALLOWED',
    MESSAGE: 'The current version (1.0.0) on field schema_body.version can only be updated to 2.0.0, 1.1.0 or 1.0.1'
  },
  SCHEMA_ID: {
    CODE: 'NOT_EXISTS',
    MESSAGE: 'The id field\'s value is not exists'
  },
  SCHEMA_VERSION_UPDATE: {
    CODE: 'VERSION_DISALLOWED',
    MESSAGE: 'The current version (1.0.0) on field schema_body.version can only be updated to 2.0.0, 1.1.0 or 1.0.1'
  },
  CONTROLLER: {
    CODE: 'NOT_EXISTS',
    MESSAGE: 'The controller field\'s value is not exists'
  },
  CLAIMS_SUB: {
    CODE: 'NOT_EXISTS',
    MESSAGE: 'The Claims.sub field\'s value is not exists'
  },
  CLAIMS_JTI: {
    CODE: 'NOT_EXISTS',
    MESSAGE: 'The Claims.jti field\'s value is not exists'
  },
  CLAIMS_AUD: {
    CODE: 'NOT_EXISTS',
    MESSAGE: 'The Claims.aud field\'s value is not exists'
  },
  CLAIMS_VC_TYPE: {
    CODE: 'NOT_EXISTS',
    MESSAGE: 'The Claims.vc.type[1] field\'s value is not exists'
  },
  CLAIMS_ISS: {
    CODE: 'NOT_EXISTS',
    MESSAGE: 'The Claims.iss field\'s value is not exists'
  },
  VC_CAN_NOT_UPDATE: {
    CODE: 'VC_CAN_NOT_UPDATE',
    MESSAGE: 'can\'t update. please add this vc status first'
  },
  SCHEMA_BODY_REQUIRED: {
    CODE: 'INVALID_VALUE_NOT_IN_LIST',
    MESSAGE: 'The required[0] field must be one of example_array'
  },
  SCHEMA_BODY_REQUIRED_TYPE: {
    CODE: 'INVALID_TYPE',
    MESSAGE: 'This schema.schema_body.required field must be []*string type'
  },
  SCHEMA_BODY_TYPE: {
    CODE: 'INVALID_VALUE_NOT_IN_LIST',
    MESSAGE: 'The type field must be one of object'
  },
  SCHEMA_PROPERTY_TYPE: {
    CODE: 'INVALID_VALUE_NOT_IN_LIST',
    MESSAGE: 'The properties.example_array field must be one of string, number, boolean, object, array'
  },
  SCHEMA_TYPE: {
    CODE: 'SCHEMA_TYPE_MISMATCH',
    MESSAGE: ''
  },
  HEADER_KID: {
    CODE: 'NOT_EXISTS',
    MESSAGE: 'The Header.kid field\'s value is not exists'
  },
  JWT: {
    CODE: 'INVALID_JWT',
    MESSAGE: 'JWT is not valid'
  },
  ISSUER: {
    CODE: 'ISSUER_IS_NOT_MATCH',
    MESSAGE: 'jwt\'s issuer is not match with your did address'
  },
  INVALID_DID_ADDRESS: {
    CODE: 'INVALID_DID_ADDRESS',
    MESSAGE: 'did address is invalid format or not registered'
  },
  OTP: {
    CODE: 'OTP_NOT_VALID',
    MESSAGE: 'OTP is not valid.'
  },
  UUID: {
    CODE: 'NOT_EXISTS',
    MESSAGE: 'The uuid field\'s value is not exists'
  },
  USER_ID: {
    CODE: 'NOT_EXISTS',
    MESSAGE: 'The id field\'s value is not exists'
  },
  ARRAY_TYPE: {
    CODE: 'type',
    MESSAGE: 'must be array'
  },
  INVALID_TOKEN_ROLE: {
    CODE: 'INVALID_VALUE_NOT_IN_LIST',
    MESSAGE: 'The role field must be one of ADMIN, READ/WRITE, READ'
  },
  SCHEMA_FILE_TYPE: {
    CODE: 'BAD_REQUEST',
    MESSAGE: 'uploaded file must be in extension *.zip'
  },
  NO_SCHEMA_FILE: {
    CODE: 'BAD_REQUEST',
    MESSAGE: 'http: no such file'
  },
  VC_CANCELLED_ONLY: {
    CODE: 'INVALID_VALUE_NOT_IN_LIST',
    MESSAGE: 'The status field must be one of CANCELED'
  },
  ROLE: {
    CODE: 'INVALID_VALUE_NOT_IN_LIST',
    MESSAGE: 'The role field must be one of ADMIN, MEMBER'
  },
  VP_REQUEST_STATUS: {
    CODE: 'INVALID_VALUE_NOT_IN_LIST',
    MESSAGE: 'The status field must be one of ACTIVE, INACTIVE, CANCEL'
  }
}

export const ERR_REQUIRE = {
  DID_ADDRESS: {
    CODE: 'REQUIRED',
    MESSAGE: 'The did_address field is required'
  },
  RECOVERER: {
    CODE: 'REQUIRED',
    MESSAGE: 'The recoverer field is required'
  },
  REQUEST_DID: {
    CODE: 'REQUIRED',
    MESSAGE: 'The request_did field is required'
  },
  NEW_KEY_CONTROLLER: {
    CODE: 'REQUIRED',
    MESSAGE: `The new_key.controller field is required`
  },
  KEY_PEM: {
    CODE: 'REQUIRED',
    MESSAGE: 'The key_pem field is required'
  },
  NONCE: {
    CODE: 'REQUIRED',
    MESSAGE: 'The nonce field is required'
  },
  HOLDER: {
    CODE: 'REQUIRED',
    MESSAGE: 'The holder field is required'
  },
  NAME: {
    CODE: 'REQUIRED',
    MESSAGE: 'The name field is required'
  },
  CREDENTIAL_SUBJECT: {
    CODE: 'INVALID_TYPE',
    MESSAGE: 'This credentialSubject field must be core.Map type'
  },
  CIDS_FIELD_TYPE: {
    CODE: 'INVALID_TYPE',
    MESSAGE: 'This cids field must be []string type'
  },
  CREDENTIAL_SUBJECT_ID: {
    CODE: 'REQUIRED',
    MESSAGE: 'The credentialSchema.id field is required'
  },
  CREDENTIAL_SUBJECT_TYPE: {
    CODE: 'REQUIRED',
    MESSAGE: 'The credentialSchema.type field is required'
  },
  KEY_ID: {
    CODE: 'REQUIRED',
    MESSAGE: 'The key_id field is required'
  },
  KEY_TYPE: {
    CODE: 'REQUIRED',
    MESSAGE: 'The key_type field is required'
  },
  CID: {
    CODE: 'REQUIRED',
    MESSAGE: 'The cid field is required'
  },
  SCHEMA_NAME: {
    CODE: 'REQUIRED',
    MESSAGE: 'The schema_name field is required'
  },
  SCHEMA_TYPE: {
    CODE: 'REQUIRED',
    MESSAGE: 'The schema_type field is required'
  },
  SCHEMA_BODY: {
    CODE: 'REQUIRED',
    MESSAGE: 'The schema_body.$schema field is required'
  },
  SCHEMA_BODY_DEGREE_ID_TYPE: {
    CODE: 'REQUIRED',
    MESSAGE: 'The schema.schema_body.degree_id.type field is required'
  },
  SCHEMA_BODY_DEGREE_TYPE: {
    CODE: 'REQUIRED',
    MESSAGE: 'The schema.schema_body.degree.type field is required'
  },
  SCHEMA_VERSION: {
    CODE: 'REQUIRED',
    MESSAGE: 'The version field is required'
  },
  SCHEMA_ID: {
    CODE: 'REQUIRED',
    MESSAGE: 'The id field\'s value is not exists'
  },
  CLAIMS_SUB: {
    CODE: 'REQUIRED',
    MESSAGE: 'The Claims.sub field is required'
  },
  CLAIMS_JTI: {
    CODE: 'REQUIRED',
    MESSAGE: 'The Claims.jti field is required'
  },
  CLAIMS_ISS: {
    CODE: 'REQUIRED',
    MESSAGE: 'The Claims.iss field is required'
  },
  CLAIMS_AUD: {
    CODE: 'REQUIRED',
    MESSAGE: 'The Claims.aud field is required'
  },
  HEADER_KID: {
    CODE: 'REQUIRED',
    MESSAGE: 'The Header.kid field is required'
  },
  CONTROLLER: {
    CODE: 'REQUIRED',
    MESSAGE: 'The controller field is required'
  },
  VC_STATUS: {
    CODE: 'REQUIRED',
    MESSAGE: 'The status field is required'
  },
  CLAIMS_VC_TYPE: {
    CODE: 'REQUIRED',
    MESSAGE: 'The Claims.vc.type[1] field is required'
  },
  CLAIMS_VP_TYPE: {
    CODE: 'REQUIRED',
    MESSAGE: 'The Claims.vp.type[0] field is required'
  },
  SCHEMA_BODY_DESC: {
    CODE: 'REQUIRED',
    MESSAGE: 'The description field is required'
  },
  SCHEMA_BODY_TYPE: {
    CODE: 'REQUIRED',
    MESSAGE: 'The type field is required'
  },
  SCHEMA_BODY_TITLE: {
    CODE: 'REQUIRED',
    MESSAGE: 'The title field is required'
  },
  JWT: {
    CODE: 'REQUIRED',
    MESSAGE: 'The jwt field is required'
  },
  SCHEMA_PROPERTY_TYPE: {
    CODE: 'REQUIRED',
    MESSAGE: 'The properties.example_array field is required'
  },
  SCHEMA_PROPERTY_ARRAY_MIN_ITEMS: {
    CODE: 'type',
    MESSAGE: 'must be integer'
  },
  SCHEMA_PROPERTY_ITEM_TYPE: {
    CODE: 'INVALID_VALUE_NOT_IN_LIST',
    MESSAGE: 'The properties.example_array field must be one of string, number, boolean, object, array'
  },
  UUID: {
    CODE: 'REQUIRED',
    MESSAGE: 'The uuid field is required'
  },
  TOKEN: {
    CODE: 'REQUIRED',
    MESSAGE: 'The token field is required'
  },
  USER_ID: {
    CODE: 'REQUIRED',
    MESSAGE: 'The id field is required'
  },
  NEW_KEY: {
    CODE: 'REQUIRED',
    MESSAGE: 'The new_key.public_key field is required'
  },
  NEW_KEY_SIGNATURE: {
    CODE: 'REQUIRED',
    MESSAGE: 'The new_key.signature field is required'
  },
  DEVICE_UUID: {
    CODE: 'REQUIRED',
    MESSAGE: 'The device.uuid field is required'
  },
  SCHEMA_ID_REQUIRED: {
    CODE: 'REQUIRED',
    MESSAGE: 'The schema_id field is required'
  },
  TOKEN_NAME_REQUIRED: {
    CODE: 'REQUIRED',
    MESSAGE: 'The name field is required'
  },
  VC_STATUS_REQUIRED: {
    CODE: 'REQUIRED',
    MESSAGE: 'The status field is required'
  },
  EMAIL: {
    CODE: 'REQUIRED',
    MESSAGE: 'The email field is required'
  },
  ROLE: {
    CODE: 'REQUIRED',
    MESSAGE: 'The role field is required'
  },
  FIRST_NAME: {
    CODE: 'REQUIRED',
    MESSAGE: 'The first_name field is required'
  },
  LAST_NAME: {
    CODE: 'REQUIRED',
    MESSAGE: 'The last_name field is required'
  },
  DATE_OF_BIRTH: {
    CODE: 'REQUIRED',
    MESSAGE: 'The date_of_birth field is required'
  },
  REASON: {
    CODE: 'REQUIRED',
    MESSAGE: 'The reason field is required'
  },
  SCHEMA_LIST_SCHEMA_TYPE: {
    CODE: 'REQUIRED',
    MESSAGE: 'The schema_list[0].schema_type field is required'
  }
}
