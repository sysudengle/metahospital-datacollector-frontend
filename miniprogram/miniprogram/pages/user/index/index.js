/* 个人中心体检预约 */
import API from '../../../common/api';
import requestService from '../../../common/request';
const appData = getApp().globalData;

Page({
  data: {
    profiles: [],
    hosptial: {},
  },

  onLoad(options) {
    this.setData({
      hosptial: appData.hospitals[appData.selectHospitalIndex]
    })
    this.getProfiles();
  },
  async onShow() {
    this.getProfiles();
  },

  async getProfiles() {
    const resp = await requestService.request({
      url: API.API_GET_PROFILES,
      method: 'POST',
      data: {}
    });
    console.log(resp);
    const profiles = resp?.data?.profiles ?? [];
    this.setData({
      profiles
    })
  },
  /**
   * 新增档案
   */
  add() {
    wx.navigateTo({
      url: '../profile/index'
    })
  },
  /**
   * 档案对应的预约列表
   */
  toBookingList(e) {
    console.log(e)
    const { id, index } = e.currentTarget.dataset;
    appData.profile = this.data.profiles[index];
    wx.navigateTo({
      url: `../booking/index?profileId=${id}`
    })
  },
})