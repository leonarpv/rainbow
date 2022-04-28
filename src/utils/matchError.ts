export default function mirrorKeys<
  Key extends string,
  MirroredKeys = { [K in Key]: K }
>(keys: Key[]): MirroredKeys {
  return keys.reduce((acc, current) => {
    acc[current] = current;
    return acc;
  }, {});
}

export const errorsCode = mirrorKeys([
  //keychain
  'KEYCHAIN_ERROR',
  'KEYCHAIN_ERROR_AUTHENTICATING', //user created keychain cell with another biometric type
  'KEYCHAIN_CANCEL',
  'KEYCHAIN_FACE_UNLOCK_CANCEL',
  'INVALID_PASSWORD',
  'KEYCHAIN_USER_CANCELED',
  'KEYCHAIN_NOT_AUTHENTICATED',

  'CAN_ACCESS_SECRET_PHRASE',

  //biometry
  'CREATED_WITH_BIOMETRY_ERROR',

  'NOT_VALID_ENS',
  'CANNOT_ADD_ENS',
  'NOT_VALID_UNSTOPPABLE_NAME',
  'CANNOT_ADD_UNSTOPPABLE_NAME',

  'DECRYPT_ANDROID_PIN_ERROR',

  'ERROR_IN_RESTORE_SPECIFIC_BACKUP_INTO_KEYCHAIN',
  'ERROR_IN_RESTORE_BACKUP_INTO_KEYCHAIN',
]);

export function matchError(error: string): typeof errorsCode {
  // const { message: msgKey } = error;
  return Object.keys(errorsCode).reduce((acc, item) => {
    acc[item] = error === item;
    return acc;
  }, {});
}
