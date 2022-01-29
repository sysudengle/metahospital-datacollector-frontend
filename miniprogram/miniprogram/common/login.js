import WxPromise from '../utils/wxPromise';
import Env from './env';
import API from './api';
import { RETCODE } from './constants';
import { handleProxy } from './request';

const wxRequest = WxPromise.request;
const handleErr = (retcode) => {
  console.log('未捕获错误码', retcode);
};

const loginHandler = async (options = {}) => {
  const wxLoginRes = await WxPromise.login(options);

  if (wxLoginRes?.code) {
    // 成功获取微信登录code
    const opts = {
      url: Env.getUrl(API.API_LOGIN),
      method: 'POST',
      header: {
        'content-type': 'application/json;charset=UTF-8',
      },
      data: { wechatJsCode: wxLoginRes?.code },
    };
    handleProxy(opts); // 设置代理 && header代理
    const cgiLoginRes = await wxRequest(opts);
    const { data } = cgiLoginRes || {};
    const retcode = data?.retcode !== undefined ? Number(data.retcode) : 10001;

    if (retcode === RETCODE.OK) {
      console.warn('TCL005: login.doLoginProcess login success', data.data);
      // 缓存登录态
      getApp().globalData.openId = resp?.data?.openId;
      getApp().globalData.userId = resp?.data?.userId;
      return data;
    }

    // 处理失败
    handleErr(retcode);
    throw data;
  }

  throw wxLoginRes;
};

export default {
  loginHandler,
};
