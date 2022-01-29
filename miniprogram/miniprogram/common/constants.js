
export const RETCODE = {
  OK: 200,
  WX_SESSION_ID_EXPIRED: 400, // 登录态过期
};

/**
 * 用于覆盖CGI的转义
 * 正常情况下，标准弹窗的文案应该在CGI转义
 */
export const RETCODE_MSG = {};

export const TARBAR_CONFIG = {
  user: [{
    pagePath: "/pages/user/index/index",
    iconPath: "/imgs/tabbars/booking.png",
    selectedIconPath: "/imgs/tabbars/booking-1.png",
    text: "档案"
  }, {
    pagePath: "/pages/user/mine/index",
    iconPath: "/imgs/tabbars/mine.png",
    selectedIconPath: "/imgs/tabbars/mine-1.png",
    text: "我的"
  }],
  doctor: [{
    pagePath: "/pages/doctor/index/index",
    iconPath: "/imgs/tabbars/booking.png",
    selectedIconPath: "/imgs/tabbars/booking-1.png",
    text: "体检录单"
  }, {
    pagePath: "/pages/doctor/mine/index",
    iconPath: "/imgs/tabbars/mine.png",
    selectedIconPath: "/imgs/tabbars/mine-1.png",
    text: "我的"
  }]
};

export default {
  TARBAR_CONFIG,
  RETCODE
};
