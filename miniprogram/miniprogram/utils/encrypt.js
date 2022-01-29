import forge from '../lib/forge';
import CryptoJS from 'crypto-js';

const aesDefaultMode = CryptoJS.mode.CBC;
const aesDefaultPadding = CryptoJS.pad.Pkcs7;
const aesDefaultIv = CryptoJS.enc.Hex.parse('0');

const aiSeePublicKey = ``;

/**
 * rsa加密
 */
export const rsa = {
  encrypt(val, key) {
    const app = getApp();
    const publicKey = key || app.globalData.rsaPubKey;
    const pubKey = forge.pki.publicKeyFromPem(publicKey);
    return forge.util.encode64(pubKey.encrypt(forge.util.encodeUtf8(val), 'RSA-OAEP'));
  },
  encryptByAiSee() {
    const publicKey = forge.pki.publicKeyFromPem(aiSeePublicKey);
    return forge.util.encode64(publicKey.encrypt(encodeURIComponent(`t=${Date.now()}&userid=${new Date().getTime()}`)));
  },
};

export const guid = () => {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return (`${S4() + S4()}${S4()}${S4()}`);
};

/**
 * AES加解密方法
 */
export const aes = {
  getAesKey() {
    return guid();
  },

  getEncKey(val, key) {
    return rsa.encrypt(val, key);
  },

  encrypt(val, akey) {
    const ekey = CryptoJS.enc.Utf8.parse(akey);
    const encrypted = CryptoJS.AES.encrypt(val, ekey, {
      iv: aesDefaultIv,
      mode: aesDefaultMode,
      padding: aesDefaultPadding,
    });
    return encrypted.toString();
  },

  /**
   * aes解密后台传过来的信息
   * key动态变化
   */
  decrypt(val) {
    const app = getApp();
    const { sdkToken: token } = app.globalData;
    const akey = token.slice(0, 16);
    const ekey = CryptoJS.enc.Utf8.parse(akey);
    const decrypted = CryptoJS.AES.decrypt(val, ekey, {
      iv: aesDefaultIv,
      mode: aesDefaultMode,
      padding: aesDefaultPadding,
    });
    return CryptoJS.enc.Utf8.stringify(decrypted);
  },
};
