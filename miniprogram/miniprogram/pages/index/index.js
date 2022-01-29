import API from '../../common/api';
import requestService from '../../common/request';
const appData = getApp().globalData;

Page({
  data: {
    type: '0', // 入口参数 1-医生，2-普通用户
    doctorLoginType: '', // 医生登录方式 1-微信授权，2-账号密码
    hospitals: [],
    selectIndex: 0, // 社区医院选择index
    formData: {},
    rules: [{
      name: 'radio',
      rules: {required: false, message: '单选列表是必选项'},
    }, {
      name: 'idcard',
      rules: {validator: function(rule, value, param, modeels) {
        if (!value || value.length !== 18) {
          return 'idcard格式不正确'
        }
      }},
    }]
  },

  onLoad(opts) {
    this.setData({
      type: opts.type ?? '0',
      hospitals: appData?.hospitals ?? [],
    });
  },
  onShow() {
    const titles = ['我是体检者', '我是医生']
    const tabs = titles.map(item => ({title: item}))
    this.setData({tabs})
  },

  /**
   * 选择登录入口
   * @param {*} e 
   */
  entry(e) {
    const { type } = e?.currentTarget?.dataset;
    console.log('login type -----: ', type);
    this.setData({
      type
    });
    if (!this.data.hospitals || this.data.hospitals?.length === 0) {
      this.getHospitals();
    }
  },
  /**
   * 获取医院信息
   */
  async getHospitals() {
    const resp = await requestService.request({
      url: API.API_CONFIG_HISPITAL,
      method: 'POST',
      data: {
        hospitalIds: []
      }
    });
    console.log(resp);
    appData.hospitals = resp?.data?.hospitalConfigDataList ?? [];
    this.setData({
      hospitals: resp?.data?.hospitalConfigDataList ?? []
    });
  },
  /**
   * 社区医院选择
   */
  bindPickerChange(e) {
    console.log(e)
    const { value } = e.detail;
    this.setData({
      selectIndex: value || 0
    });
    console.log(this.data.selectIndex);
  },
  /**
   * 选择社区医院确认
   */
  submitForm(e) {
    console.log(e)
    const { infokey = 'user' } = e.mark;
    appData.selectHospitalIndex = this.data.selectIndex;
    appData.loginKey = infokey;
    if (infokey === 'user') {
      wx.reLaunch({
        url: '../user/index/index',
      })
    } else {
      // 医生
      // TODO: 医生两种登录方式
      wx.reLaunch({
        url: '../doctor/index/index',
      })
    }
  },
  doctorLogin(e) {
    console.log(e)
    const { type } = e.currentTarget.dataset;
    // 1-微信授权登录，2-账号密码登录
    this.setData({
      doctorLoginType: type
    })
  }
})