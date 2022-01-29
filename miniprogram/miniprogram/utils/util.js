/* eslint-disable no-restricted-syntax */
/* eslint-disable eqeqeq */
/* eslint-disable no-param-reassign */

const formatMoney = (
  num = 0,
  places = 2,
  symbol = '¥',
  thousand = ',',
  decimal = '.',
) => {
  const negative = Number(num) < 0 ? '-' : '';
  num = Number(Math.abs(Number(num)).toFixed(places));
  const i = `${parseInt(String(num), 10)}`;
  let j = i.length;
  j = j > 3 ? j % 3 : 0;
  return `${
    symbol + negative + (j ? i.substr(0, j) + thousand : '')
    + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${thousand}`)
    + (places ? decimal + Math.abs(num - Number(i)).toFixed(places)
      .slice(2) : '')
  }`;
};

const formatMoneyInChinese = (money = 0) => {
  const tenThousand = 10000 * 100;
  if (money >= tenThousand) {
    return `${money / (10000 * 100)}万`;
  }
  return money / 100;
};

const getUrlParamByName = (name, url) => {
  const path = url;
  const key = name.replace(/[[\]]/g, '\\$&');
  const regex = new RegExp(`(?:^|[?&])${key}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(path);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const getHostName = (url) => {
  const regex = /^http(?:s)?:\/\/(.*?)([?/]|$)/;
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[1]) return '';
  return results[1];
};

const parseQueryString = (queryStr) => {
  if (!queryStr) {
    return {};
  }
  const params = queryStr.split('&');
  const obj = {};
  params.forEach((v) => {
    const [fItem, sItem] = v.split('=');
    obj[fItem] = sItem;
  });
  return obj;
};
// 元to分
const yuan2fen = (yuan) => {
  if (typeof yuan === 'undefined' || Object.prototype.toString.call(yuan) === '[object Null]') {
    return '';
  }
  // 转数组 '12' => ['1','2']
  const yuanArr = String(yuan).split('');

  // 后补零
  const dotIndex = yuanArr.indexOf('.');
  let addNum = 2;
  if (dotIndex > 0) {
    addNum = 2 - String(yuan).split('.')[1].length;
    yuanArr.splice(dotIndex, 1);
  }
  for (let i = 0; i < addNum; i += 1) {
    yuanArr.push('0');
  }

  // 前去零
  for (let i = 0; i < yuanArr.length - 1; i += 1) {
    if (String(yuanArr[i]) === '0') {
      yuanArr[i] = '';
    } else {
      break;
    }
  }
  return yuanArr.join('');
};

// 分to元
const fen2yuan = (fen) => {
  if (typeof fen === 'undefined' || Object.prototype.toString.call(fen) === '[object Null]') {
    return '';
  }
  // 转数组 '12' => ['1','2']
  const fenArr = String(fen).split('');

  // 不足三位，前补零。['1','2'] => ['0','1','2']
  for (let i = 0; fenArr.length < 3; i += 1) {
    fenArr.unshift('0');
  }

  // 倒数第二位插入“.“ ['0','1','2'] => ['0','.','1','2']
  fenArr.splice(-2, 0, '.');

  return fenArr.join('');
};

/**
 * 获取手机当前时间戳
 */
const getSystemTimestamp = () => Date.now() / 1000 | 0;

const compareDateTime = (startTime, endTime, isDate = false) => {
  const st = new Date(`${startTime}${isDate ? '00:00:00' : ''}`);
  const et = new Date(`${endTime}${isDate ? '00:00:00' : ''}`);

  return et >= st;
};

const formatKey = (raw, formater) => {
  const isArray = (data) => Object.prototype.toString.call(data) === '[object Array]';
  const isObject = (data) => Object.prototype.toString.call(data) === '[object Object]';
  const res = isArray(raw) ? [] : {};

  const handler = (raw, data = {}) => {
    if (!raw) return;

    Object.keys(raw).forEach((key) => {
      const value = raw[key];
      const newKey = formater(key);
      if (isArray(value)) {
        data[newKey] = [];
        handler(value, data[newKey]);
      } else if (value && isObject(value)) {
        data[newKey] = {};
        handler(value, data[newKey]);
      } else {
        if (isArray(data[newKey])) {
          data[newKey].push(value);
        } else {
          data[newKey] = value;
        }
      }
    });
  };
  handler(raw, res);
  return res;
};

const camelCase = (raw) => {
  const reg = /(\w)_(\w)/g;
  return raw.replace(reg, (_match, m1, m2) => m1 + m2.toUpperCase());
};

const formatKeyToCamelCase = (raw) => formatKey(raw, camelCase);

// 数据处理
const arr2Map = (arr = [], key) => {
  const map = {};
  arr.forEach((item) => {
    if (item.status !== 0) {
      map[item[key]] = item;
    }
  });
  return map;
};

const formatDate = (date, fmt) => {
  const o = {
    'M+': date.getMonth() + 1,                 // 月份
    'd+': date.getDate(),                    // 日
    'h+': date.getHours(),                   // 小时
    'm+': date.getMinutes(),                 // 分
    's+': date.getSeconds(),                 // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(),             // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if ((new RegExp(`(${k})`)).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
    }
  }
  return fmt;
};

// ${0}开始
const renderTpl = (tpl, dataArr) => {
  let str = tpl;
  const regex = /\$\{\d\}/g;
  const bindKeys = str.match(regex);
  if (bindKeys.length === 2 && dataArr.length === 2 && !dataArr[1]) {
    str = str.replace('${0}(${1})', '');
  } else {
    bindKeys.forEach((item) => {
      const iRegex = /\$\{(\d)\}/;
      const idx = (item.match(iRegex))[1];
      str = str.replace(item, dataArr[idx] || '');
    });
  }
  return str;
};

const hasTpl = (tpl) => {
  if (tpl.indexOf('${0}') > -1) {
    return true;
  }
  return false;
};

const debounce = function (ctx, fn,  time) {
  if (ctx.debounceTimer) {
    clearTimeout(ctx.debounceTimer);
  }
  ctx.debounceTimer = setTimeout(fn, time);
};

// 数组排序
const arrSort = (sArr, key, pre) => {
  const preArr = [];
  const afterArr = [];
  sArr.forEach((item) => {
    if (item[key] === pre) {
      preArr.push(item);
    } else {
      afterArr.push(item);
    }
  });
  return [...preArr, ...afterArr];
};

export default {
  formatMoney,
  formatMoneyInChinese,
  getUrlParamByName,
  getHostName,
  parseQueryString,
  yuan2fen,
  fen2yuan,
  getSystemTimestamp,
  compareDateTime,
  formatKeyToCamelCase,
  arr2Map,
  formatDate,
  renderTpl,
  hasTpl,
  debounce,
  arrSort,
};
