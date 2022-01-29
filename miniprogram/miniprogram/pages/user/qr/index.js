import QRCode from '../../../lib/weapp-qrcode';
const appData = getApp().globalData;

Page({
  data: {
    qrText: '',
    bookingId: '',
    hospitalId: '',
    profileId: '',
    profile: null,
    booking: null
  },

  onLoad(opts) {
    console.log(opts)
    this.setData({
      qrText: `bookingId=${opts.bookingId}&hospitalId=${opts.hospitalId}&profileId=${opts.profileId}`,
      bookingId: opts.bookingId,
      hospitalId: opts.hospitalId,
      profileId: opts.profileId
    });
    this.drawQr();
    this.getRenderData();
  },

  onShow() {
    const titles = ['可体检信息', '已过期信息']
    const tabs = titles.map(item => ({title: item}))
    this.setData({tabs})
  },

  drawQr() {
    const qrcode = new QRCode('canvas', {
      text: this.data.qrText,
      width: 250,
      height: 250,
      padding: 15,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
      callback: (res) => {
        // 生成二维码的临时文件
        console.log(res.path)
      }
    });
  },
  
  getRenderData() {
    this.setData({
      profile: appData.profile,
      booking: appData.booking
    })
  },

  /**
   * TODO:长按操作保存
   * @param {*} e 
   */
  save(e) {
    console.log(e)
  }
})