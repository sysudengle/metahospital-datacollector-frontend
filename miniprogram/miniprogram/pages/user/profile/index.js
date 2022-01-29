
import API from '../../../common/api';
import requestService from '../../../common/request';
const appData = getApp().globalData;

Page({
  // 保存编辑中待办的信息
  data: {
    name: '',
    id: '',
    idAddr: '',
    addr: '',
    gender: '',
  },

  onLoad() {
    // 刚进入页面ocr数据置空
    appData.ocr = null;
  },

  onShow() {
    const ocrData = appData.ocr;
    console.log('ocr data: ', ocrData);
    if (ocrData) {
      this.setData({
        name: ocrData.name,
        id: ocrData.id,
        gender: ocrData.gender,
        idAddr: ocrData.addr,
        addr: ocrData.addr,
      })
    }
  },

  onAddressInput(e) {
    this.setData({
      addr: e.detail.value
    })
  },

  ocr() {
    wx.navigateTo({
      url: '../../ocr/index',
    })
  },

  onChooseItem(e) {
    this.setData({
      item: this.data.items[e.detail.value]
    })
  },

  // 保存待办
  async save() {
    if (!this.data.id) {
      wx.showToast({
        title: '请扫描身份证获取身份信息',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    if (!this.data.addr) {
      wx.showToast({
        title: '请填写详细居住地址',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    const resp = await requestService.request({
      url: API.API_SET_PROFILE,
      method: 'POST',
      data: {
        profileInfoDto: {
          hospitalId: appData.hospitals[appData.selectHospitalIndex]?.hospitalId ?? '',
          personalID: this.data.id,
          name: this.data.name,
          gender: this.data.gender === '男' ? 'Male' : 'Female',
          pidAddress: this.data.idAddr,
          homeAddress: this.data.addr,
        }
      }
    });
    console.log(resp);
    if (resp?.retcode === 200) {
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 1500
      });
      wx.navigateBack();
    }
  },
})