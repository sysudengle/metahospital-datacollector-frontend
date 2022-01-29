/**
 * @class uiHelper-ui组件模块
 */
import { RETCODE_MSG } from '../common/constants';

/**
* 是否是iPhone X
* @method isIphoneX
*/
function isIphoneX() {
  const APP = getApp();
  const bIsIphoneX = /(iphone x|iphone11,8|iphone11,2|iphone11,4|iphone11.6|iphone12,1|iphone12,3|iphone12,5|iphone13,1|iphone13,2|iphone13,3|iphone13,4)/gi.test(APP.globalData.systemInfo.model);
  return bIsIphoneX;
}

// loading timeout
let loadingTimer = 0;

/**
* showLoading
* @param options
* @method showLoading
*/
function showLoading(_options) {
  const options = _options;
  if (loadingTimer) {
    clearTimeout(loadingTimer);
  }
  if (wx.showLoading) wx.showLoading(options);
}

/**
* hideLoading
* @param delay=30
* @method hideLoading
*/
function hideLoading(delay = 30) {
  loadingTimer = setTimeout(() => {
    if (wx.hideLoading) wx.hideLoading();
  }, delay);
}

/**
* commonModal 通用弹层
* @param options
* @method commonModal
*/
const commonModal = (params) => {
  let { content = '系统繁忙，请稍后重试' } = params;
  const { retcode = '', retmsg = ''} = params;
  const formattedCode = (retcode && `[${retcode}]`) || '';

  const cloneParams = Object.assign(params);

  if (retcode && RETCODE_MSG[retcode]) {
    content = `${formattedCode}${RETCODE_MSG[retcode]}`;
  } else {
    content = retmsg ? `${formattedCode}${retmsg}` : content;
  }

  const options = Object.assign({
    title: '提示',
    showCancel: false,
    content,
  }, cloneParams);

  wx.showModal(options);
};

export default {
  isIphoneX,
  showLoading,
  commonModal,
  hideLoading,
};
 