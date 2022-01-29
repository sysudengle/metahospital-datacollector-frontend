/* eslint-disable no-param-reassign */
import Env from './env';
import loginService from './login';
import { RETCODE } from './constants';
import SessionService from './session';
import wxPromise from '../utils/wxPromise';
import uiHelper from '../utils/uiHelper';
import Utils from '../utils/util';

const wxRequest = wxPromise.request;
const showModal = uiHelper.commonModal;

/**
 * 根据retcode的值来判断是否需要登录
 * @param retcode
 * @method needLogin
 */
const needLogin = (retcode) => {
  switch (retcode) {
    case RETCODE.WX_SESSION_ID_EXPIRED:
      return true;
    default: return false;
  }
};

/**
 * 获取请求头Cookie设置
 * @param session 登录态信息
 */
const getCookieStr = (session) => {
  const { WqfSession: wqfSession } = getApp().globalData;
  const cookieObj = {
    entpay_skey: session.session_id || '',
    plat_serial_no: wqfSession.plat_serial_no || '',
    platform_id: wqfSession.platform_id || '',
    reg_id: wqfSession.reg_id || '',
  };

  return Object.keys(cookieObj).map(key => `${key}=${cookieObj[key]}`)
    .join('; ');
};

/**
 * 是否需要鉴权
 * @param opts
 * @method needAuth
 */
const needAuth = (opts) => opts.method === 'POST' && (opts.auth || opts.auth === undefined);

/**
 * 设置代理 && header代理
 * @param opts
 */
export const handleProxy = (opts) => {
  const proxy = Env.getProxy();
  if (proxy !== '') {
    // header代理
    if (proxy[0] === 'e') {
      opts.header['X-Entpay-Env'] = proxy.substr(1);
      console.log(`getProxyEnv header ${opts.header['X-Entpay-Env']}`);
    } else {
      const hostName = Utils.getHostName(opts.url);
      if (hostName) {
        opts.header.Host = hostName;
        opts.url = Env.getProxyUrl(opts.url, hostName);
      }
    }
  }
};

const beforeRequest = (opts) => {
  const session = SessionService.get();
  // const cookieStr = getCookieStr(session);
  handleProxy(opts);
  opts.header = {
    // Cookie: cookieStr,
    ...opts.header,
  };
  // 实际进行请求
  return wxRequest({ ...opts });
};

const get = (opts) => beforeRequest({ ...opts, method: 'GET' });

const post = (opts) => {
  let { data } = opts;
  const { openId, userId } = getApp().globalData;
  if (openId && userId) {
    data = {
      ...data,
      openId,
      userId,
    };
  }
  return beforeRequest({
    ...opts,
    method: 'POST',
    header: {
      'content-type': 'application/json;charset=UTF-8',
      ...opts.header,
    },
    data,
  });
};

const loginHandler = () => loginService.loginHandler().catch((err) => {
  console.log('**登录失败**', err);
  showModal({
    content: '登录失效，请重新登录',
    showCancel: false,
  });
  return err;
});

const commonErrorHandler = (res, { autoError }) => {
  // timeout
  if (res?.errMsg === 'request:fail timeout') {
    showModal({
      title: '网络好像出错了',
      content: '请求超时，请检查网络',
    });
    return;
  }
  if (autoError && (`${res.statusCode}` !== '200' || res?.data?.retcode !== RETCODE.OK)) showModal(res?.data);
};

const bizRequest = async (opts) => {
  const session = SessionService.get() || {};
  const showLoading = opts.showLoading !== false; // 默认显示loading
  const autoError = opts.autoError !== false; // 默认自动报错
  let mustLogin = opts.login; // 需要强制登录
  showLoading && uiHelper.showLoading({
    title: '加载中...',
    mask: true,
  });

  // 前置检查：登录态失效需要强制登录
  // if (needAuth(opts) && !SessionService.validate(session)) mustLogin = true;

  // 方法处理
  const handler = opts.method === 'GET' ? get : post;
  const doRequest = async (opts) => {
    const retry = opts.retry !== false; // 默认需要重试
    // 需要强制登录
    if (mustLogin) {
      const data = await loginHandler(); // 先登录
      if (data?.retcode !== RETCODE.OK) {
        showLoading && uiHelper.hideLoading();
        return data; // 登录失败提退出
      }
    }

    const res = await handler(opts).catch((e) => {
      console.error('request.bizRequest.handler:exception', e);
      return e || {};
    });

    if (res?.data && typeof(res.data) === 'string') {
      res.data = JSON.parse(res.data)
    }

    showLoading && uiHelper.hideLoading();

    // 特殊场景1：登录态失效，需要重登
    if (retry && (`${res?.statusCode}` === '401' || needLogin(res?.data?.retcode))) {
      console.log('登录态失效需要重新登录');
      const reLoginRes = await loginHandler();
      // 登录成功则重新请求一次（重试时不需要再次登录及重试）
      if (reLoginRes?.retcode === RETCODE.OK) return doRequest({ ...opts, ...{ retry: false, login: false } });
      // 失败则返回失败结果
      return reLoginRes;
    }

    // 新增默认报错（状态码非200或返回码不为0时将会报错）
    commonErrorHandler(res, { autoError });

    return res.data;
  };

  return doRequest({
    ...opts,
    url: Env.getUrl(opts.url),
  });
};


export default {
  request: bizRequest,
};
