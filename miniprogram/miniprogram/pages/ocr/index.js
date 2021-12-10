Page({
  data: {},
  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.ocr(res.tempImagePath);
      }
    })
  },
  async ocr(img) {
    wx.showLoading();
    wx.cloud.callFunction({
      name: 'ocr',
      data: {
        img: wx.cloud.CDN({
          type: 'filePath',
          filePath: img,
        })
      },
    })
    .then(res => {
      wx.hideLoading();
      console.log(res.result)
      const { type, id, name, addr, gender, nationality} = res.result;
      if (!id && !name && type !== 'Front') {
        wx.showToast({
          icon: 'none',
          title: '请拍照识别身份证人像面',
        })
      } else {
        getApp().globalData.ocr = res.result;
        setTimeout(() => {
          wx.navigateBack();
        }, 0);
      }
    })
    .catch(error => {
      wx.hideLoading();
      console.error(error);
    })
  },
  error(e) {
    console.log(e);
  },
})