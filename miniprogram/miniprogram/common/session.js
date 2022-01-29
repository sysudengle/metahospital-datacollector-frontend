import constants from './constants';
import cache from './cache';
import Env from './env';

// 有效期buff 100s
const buff = 100;

export default {
  /**
   * 获取登录态
   */
  get() {
    try {
      return cache.getSync(constants.LOGIN_DATA_KEY);
    } catch (e) {
      console.error('session.get:fail', e);
      return null;
    }
  },

  /**
   * 存储登录态
   */
  set(session) {
    try {
      cache.setSync(constants.LOGIN_DATA_KEY, session, true);
    } catch (e) {
      console.error('session.set:fail', e);
      wx.getStorageInfo({
        success(res) {
          // 空间少于100K
          (res && (res.currentSize + 100 > res.limitSize)) && wx.clearStorage();
        },
      });
    }
  },

  /**
   * 验证登录态
   */
  validate(session) {
    const sess = session === undefined ? this.get() : session;

    const value = !!sess && !!sess.session_id; // 必须的登录态字段

    // 有环境标志，登录成功时间和有效期时进行检查
    return sess?.env === Env.getEnv() && value && (!sess.time
      || !sess.session_timeout
      || (Math.floor(Date.now() / 1000) - sess.time) < sess.session_timeout - buff);
  },
};
