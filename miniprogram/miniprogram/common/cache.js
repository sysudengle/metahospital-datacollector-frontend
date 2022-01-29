import wxp from '../utils/wxPromise';
import config from './config';

// 一级缓存内存
// 二级缓存storage
let caches = {};
// 最大缓存数
const MAX_CACHE_COUNT = 20;
// 单个缓存最大字节数
const MAX_CACHE_BYTE = 6144;

/**
 * 计算字节数
 * @param str 字符串
 * @method sizeOf
 */
function sizeOf(str) {
  let byteLen = 0;
  let charCode = -1;
  const len = str.length;
  for (let i = 0; i < len; i += 1) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 255) {
      byteLen += 1;
    } else {
      byteLen += 2;
    }
  }
  return byteLen;
}

/**
 * 写一级缓存
 * @param key 缓存key
 * @param data 缓存数据
 * @method setL1
 */
function setL1(key, data) {
  try {
    if (!key || data === undefined) {
      return;
    }
    const str = typeof data === 'object' ? JSON.stringify(data) : `${data}`;
    // 计算字节数
    const byteLen = sizeOf(str);
    if (caches[key] === undefined) {
      const cacheCount = Object.keys(caches).length;
      // 缓存是否达到最大个数和最大字节数
      if (cacheCount < MAX_CACHE_COUNT && byteLen <= MAX_CACHE_BYTE) {
        caches[key] = data;
      } else {
        console.warn('cache.setL1.max_cache_count_or_byte');
      }
    } else if (byteLen > MAX_CACHE_BYTE) {
      // 更新超过最大字节数删除
      delete caches[key];
    } else {
      caches[key] = data;
    }
  } catch (e) {
    console.error('cache.setL1:fail', e);
  }
}

/**
 * 异步取缓存
 * @param key 缓存key
 * @method get
 */
function get(key) {
  let val = caches[key];
  if (val !== undefined) {
    // 复杂对象深克隆防止直接修改
    if (val && typeof val === 'object') {
      val = JSON.parse(JSON.stringify(val));
    }
    return Promise.resolve(val);
  }

  return wxp.getStorage({
    key,
  }).then((res) => {
    if (res?.data) {
      let { data } = res;
      if (data && typeof data === 'object') {
        // 复杂对象深克隆防止直接修改
        data = JSON.parse(JSON.stringify(data));
      }
      setL1(key, data);
      return data;
    }
    return Promise.resolve();
  }, () => Promise.resolve());
}

/**
 * 异步取缓存过滤版本号
 * @param key 缓存key
 * @method getWithoutVer
 */
function getWithoutVer(key) {
  return get(key).then((data) => {
    if (data?.value) {
      return data.value;
    }
    return Promise.resolve();
  }, () => Promise.resolve());
}

/**
 * 同步取缓存
 * @param key 缓存key
 * @param throwException 是否抛异常
 * @method getSync
 */
function getSync(key, throwException) {
  try {
    let val = caches[key];
    if (val === undefined) {
      val = wx.getStorageSync(key);
      val && setL1(key, val);
    }
    if (val && typeof val === 'object') {
      // 复杂对象深克隆防止直接修改
      val = JSON.parse(JSON.stringify(val));
    }
    return val;
  } catch (e) {
    console.error('cache.getSync:fail', e);
    if (throwException) {
      throw e;
    }
  }
  return null;
}

/**
 * 同步取缓存过滤版本号
 * @param key 缓存key
 * @param throwException 是否抛异常
 * @method getSyncWithoutVer
 */
function getSyncWithoutVer(key, throwException) {
  try {
    const data = getSync(key);
    if (data?.value) {
      return data.value;
    }
  } catch (e) {
    console.error('cache.getCardId:fail', e);
    if (throwException) {
      throw e;
    }
  }
  return null;
}

/**
 * 删除
 * @param key 缓存key
 * @method del
 */
function del(key) {
  if (key && caches[key] !== undefined) {
    delete caches[key];
  }
  return wxp.removeStorage({
    key,
  });
}

/**
 * 删除
 * @param key 缓存key
 * @method del
 */
function delSync(key) {
  if (key && caches[key] !== undefined) {
    delete caches[key];
  }
  try {
    wx.removeStorageSync(key);
    return true;
  } catch (e) {
    console.error('cache.delSync:fail', e);
    return false;
  }
}

/**
 * 异步缓存数据
 * @param key 缓存key
 * @param data 缓存数据
 * @method set
 */
function set(key, data) {
  if (key && data !== undefined) {
    setL1(key, data);
    return wxp.setStorage({
      key,
      data,
    }).then((res) => res, (e) => {
      console.error('cache.set:fail', typeof e === 'object' ? JSON.stringify(e) : e);
      return Promise.reject(e);
    });
  }
  return Promise.reject();
}

/**
 * 同步缓存数据
 * @param key 缓存key
 * @param data 缓存数据
 * @param throwException 是否抛异常
 * @method setSync
 */
function setSync(key, data, throwException) {
  try {
    if (key && data !== undefined) {
      setL1(key, data);
      wx.setStorageSync(key, data);
    }
  } catch (e) {
    console.error('cache.setSync:fail', e);
    if (throwException) {
      throw e;
    }
  }
}

/**
 * 带版本号异步缓存数据
 * @param {Object} opts
 * @method setWithVer
 */
function setWithVer(key, data) {
  if (key && data !== undefined) {
    const val = {
      version: config.APP_VERSION,
      value: data,
    };

    setL1(key, val);

    return wxp.setStorage({
      key,
      data: val,
    }).then((res) => res, (e) => {
      console.error('cache.setWithVer:fail', e);
      return Promise.reject(e);
    });
  }
  return Promise.reject();
}

/**
 * 带版本号同步缓存数据
 * @param key 缓存key
 * @param data 缓存数据
 * @param throwException 是否抛异常
 * @method setSyncWithVer
 */
function setSyncWithVer(key, data, throwException) {
  try {
    if (key && data !== undefined) {
      const val = {
        version: config.APP_VERSION,
        value: data,
      };

      setL1(key, val);

      wx.setStorageSync(key, val);
    }
  } catch (e) {
    console.error('cache.setSyncWithVer:fail', e);
    if (throwException) {
      throw e;
    }
  }
}

/**
 * 清除内存缓存
 * @method clearL1
 */
function clearL1() {
  caches = {};
}

export default {
  get,
  getSync,
  getSyncWithoutVer,
  getWithoutVer,
  set,
  setSync,
  del,
  delSync,
  setWithVer,
  setSyncWithVer,
  clearL1,
};
