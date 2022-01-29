/* 医生：结果录入 */
import API from '../../../common/api';
import requestService from '../../../common/request';
const appData = getApp().globalData;

Page({
  data: {
    departments: [],
    department: null,
    hosptial: null,
    initValue: null,
  },

  onLoad(options) {
    this.setData({
      hosptial: appData.hospitals[appData.selectHospitalIndex]
    })
    this.getDepartments();
  },

  async getDepartments() {
    const resp = await requestService.request({
      url: API.API_CONFIG_DEP,
      method: 'POST',
      data: {
        departmentIds: this.data.hosptial?.departmentIds ?? []
      }
    });
    console.log(resp);
    const departments = resp?.data?.departmentConfigDataList ?? [];
    this.setData({
      departments
    })
    if ((appData.doctorDepartmentSelected ?? false) !== false) {
      this.setData({
        initValue: appData.doctorDepartmentSelected
      })
    }
  },
  onChooseDepartment(e) {
    console.log(e)
    const { value } = e.detail;
    appData.doctorDepartmentSelected = +value;
    this.setData({
      department: this.data.departments[+value]
    })
  },

  scan() {
    if (!this.data.department) {
      wx.showToast({
        title: '请先选择科室信息',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    wx.scanCode({
      onlyFromCamera: true,
      success (res) {
        console.log(res)
        const { result } = res;

      }
    })
  },

  toInput(result) {
    wx.navigateTo({
      url: `../input/index?${result}`
    })
  }
})