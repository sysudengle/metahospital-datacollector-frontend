Page({
  // 保存编辑中待办的信息
  data: {
    name: '',
    id: '',
    addr: '',
    detailAddress: '',
    gender: '',
    showSwitch: false,
    sameAddr: false,
    regionCode: ['', '', ''],
    regionName: ['', '', ''],
    hospitals: ['南山医院', '南方医科', '宝安中医院'], // 医院列表
    items: ['2021年下半年体检', '2022年上半年体检', '2022年下半年体检'], // 项目列表
    hospital: '',
    item: '',
  },

  onLoad() {
    // 刚进入页面ocr数据置空
    getApp().globalData.ocr = null;
  },

  onShow() {
    const ocrData = getApp().globalData.ocr;
    console.log('ocr data: ', ocrData);
    if (ocrData) {
      this.setData({
        showSwitch: true,
        name: ocrData.name,
        id: ocrData.id,
        gender: ocrData.gender,
        addr: ocrData.addr,
      })
    }
  },
  // 表单输入处理函数
  onNameInput(e) {
    this.setData({
      title: e.detail.value
    })
  },

  onIdInput(e) {
    this.setData({
      desc: e.detail.value
    })
  },

  onAddressInput(e) {
    this.setData({
      addr: e.detail.value
    })
  },

  ocr() {
    wx.navigateTo({
      url: '../ocr/index',
    })
  },

  radiochange(e) {
    this.setData({
      gender: e.detail.value
    })
  },
  onSwitchChange(e) {
    console.log(e)
    this.setData({
      sameAddr: e.detail.value,
      detailAddress: this.data.addr
    })
  },

  onChooseRegion(e) {
    console.log(e)
    const { code, value } = e.detail;
    this.setData({
      regionCode: code,
      regionName: value,
    })
  },

  onChooseHospital(e) {
    this.setData({
      hospital: this.data.hospitals[e.detail.value]
    })
  },
  onChooseItem(e) {
    this.setData({
      item: this.data.items[e.detail.value]
    })
  },

  // 保存待办
  async save() {
    console.log('e');
    wx.showToast({
      title: 'SUBMIT'
    })
  },

  // 重置所有表单项
  reset() {
    this.setData({
      name: '',
      id: '',
      addr: '',
      gender: '',
      detailAddress: '',
      showSwitch: false,
      sameAddr: false,
      regionCode: ['', '', ''],
      regionName: ['', '', ''],
    })
  }
})