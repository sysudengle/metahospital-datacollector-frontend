/* 个人中心体检预约 */
import API from '../../../common/api';
import requestService from '../../../common/request';
const appData = getApp().globalData;

Page({
  data: {
    bookings: [],
    hosptial: {},

  },

  onLoad(options) {
    console.log(options);
    this.setData({
      profileId: options.profileId,
      hosptial: appData.hospitals[appData.selectHospitalIndex]
    })
    this.getBookings();
  },
  async onShow() {
    this.getBookings();
  },

  async getBookings() {
    const resp = await requestService.request({
      url: API.API_GET_BOOKINGS,
      method: 'POST',
      data: {
        profileId: this.data.profileId,
        hospitalId: this.data.hosptial.hospitalId
      }
    });
    console.log(resp);
    const bookings = resp?.data?.bookings ?? [];
    this.setData({
      bookings
    })
  },
  /**
   * 新增预约
   */
  add() {
    wx.navigateTo({
      url: './add'
    })
  },
  /**
   * 查看预约码
   */
  toQrDetail(e) {
    const { id, index } = e.currentTarget.dataset;
    appData.booking = this.data.bookings[index];
    wx.navigateTo({
      url: `../qr/index?hospitalId=${this.data.hosptial.hospitalId}&profileId=${this.data.profileId}&bookingId=${id}`
    })
  },
})