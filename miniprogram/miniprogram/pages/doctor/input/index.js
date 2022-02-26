/* 医生：结果录入 */
import API from '../../../common/api';
import requestService from '../../../common/request';
const appData = getApp().globalData;

let hospitalId = null;
let bookingId = null;
let profileId = null;
let departmentId = null;

const itemTypesMap = {
  1: 'numberItemTypeId',
  2: 'stringItemTypeId',
  3: 'selectionItemTypeId'
}

Page({
  data: {
    items: [],
    itemRenderList: [],
    checkboxItems: [
      {name: 'standard is dealt for u.', value: '0', checked: true},
      {name: 'standard is dealicient for u.', value: '1'}
    ]
  },

  onLoad(options) {
    console.log(options)
    hospitalId = null;
    bookingId = null;
    profileId = null;
    departmentId = null;
    this.loadData(options);
  },

  onUnload() {
    hospitalId = null;
    bookingId = null;
    profileId = null;
    departmentId = null;
  },

  async loadData(data) {
    console.log()
    const resp = await requestService.request({
      url: API.API_GET_ITEMS,
      method: 'POST',
      data: {
        ...data
      }
    });
    console.log(resp);
    const items = resp?.data ?? []
    if (items.length > 0) {
      this.setData({
        items
      })
      const itemIds = items.map((item) => {
        return item.itemId
      })
      console.log('itemIds', itemIds)
      this.getItemsDetail(itemIds)
    } else {
      // 该预约信息在当前科室没有检测项目
      wx.showModal({
        content: '该预约在当前科室没有体检项目',
        showCancel: false,
        complete() {
          wx.navigateBack()
        }
      })
    }
  },
  /**
   * 获取指标配置项数据
   * @param {Array} ids 
   */
  async getItemsDetail(ids) {
    const resp = await requestService.request({
      url: API.API_COMFIG_ITEM,
      method: 'POST',
      data: {
        itemIds: ids
      }
    });
    console.log(resp);
    if (resp?.data?.itemConfigDataList?.length > 0) {
      this.formatItemsList(resp?.data?.itemConfigDataList, resp?.data?.itemExtConfigDataList)
    }
  },
  /**
   * 指标项数据处理
   * @param {Array} list 
   * @param {Array} ext 
   */
  formatItemsList(list, ext) {
    const result = list.map((item) => {
      ext.forEach((element) => {
        const typeKey = element.itemType
        const typeId = element[itemTypesMap[`${typeKey}`]]
        if (element.itemType === item.itemType && item.itemTypeId === typeId) {
          item.ext = element
        }
      })
      return item;
    })
    this.setData({
      itemRenderList: result
    })
    console.log('result', result)
  },
  /**
   * 页面输入
   * @param {*} e 
   */
  onInput(e) {
    console.log(e)
  },
  /**
   * 选择
   * @param {*} e 
   */
  checkboxChange(e) {
    console.log(e)
  },
  /**
   * 数据提交
   */
  save() {
    // TODO:
  },
})