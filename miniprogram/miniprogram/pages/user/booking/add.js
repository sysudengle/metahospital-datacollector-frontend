
import API from '../../../common/api';
import requestService from '../../../common/request';
import Utils from '../../../utils/util'
const appData = getApp().globalData;

Page({
  // 保存编辑中待办的信息
  data: {
    fromSelect: true,
    profile: null,
    profiles: [],
    selectProfileIndex: '',
    name: '',
    id: '',
    idAddr: '',
    addr: '',
    gender: '',
    combos: [],
    selectCombos: [],
    dateTime: '',
    start: '',
  },

  onLoad() {
    // 刚进入页面ocr数据置空
    appData.ocr = null;
    this.getProfiles();
    this.getCombos();
    this.setData({
      start: Utils.formatDate(new Date(), 'yyyy-MM-dd')
    })
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

  async getCombos() {
    const resp = await requestService.request({
      url: API.API_CONFIG_COMBO,
      method: 'POST',
      data: {
        comboIds: appData.hospitals[appData.selectHospitalIndex].comboIds ?? []
      }
    });
    console.log(resp);
    const combos = resp?.data?.comboConfigDataList ?? [];
    this.setData({
      combos
    })
  },

  checkboxChange(e) {
    console.log(e)
    const { value } = e.detail;
    this.setData({
      selectCombos: value
    })
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
    console.log(e)
    const { value } = e.detail;
    this.setData({
      profile: this.data.profiles[value]
    })
  },
  onChooseDate(e) {
    console.log(e)
    const { value } = e.detail;
    this.setData({
      dateTime: value
    })
  },

  // 保存档案
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

  /**
   * 提交预约
   */
  async book() {
    if (!this.data.profile) {
      wx.showToast({
        title: '请先选择体检人',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    if (!this.data.selectCombos || this.data.selectCombos.length === 0) {
      wx.showToast({
        title: '请选择体检套餐',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    if (!this.data.dateTime) {
      wx.showToast({
        title: '请先选择体检时间',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    const list = this.data.selectCombos.map((item) => {
      return {
        comboId: Number(item)
      }
    })
    const resp = await requestService.request({
      url: API.API_SET_BOOKING,
      method: 'POST',
      data: {
        hospitalId: appData.hospitals[appData.selectHospitalIndex]?.hospitalId,
        profileId: this.data.profile.profileId,
        bookingInfoDto: {
          comboDtos: list,
          dateTime: this.data.dateTime,
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