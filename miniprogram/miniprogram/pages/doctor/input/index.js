/* 医生：结果录入 */
import API from '../../../common/api';
import requestService from '../../../common/request';
const appData = getApp().globalData;

let hospitalId = null;
let bookingId = null;
let profileId = null;
let departmentId = null;
let dataflag = [];
let dataSending = [];

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
    hospitalId = options.hospitalId;
    bookingId = options.bookingId;
    profileId = options.profileId;
    departmentId = options.departmentId;
    this.loadData(options);
  },

  onUnload() {
    hospitalId = null;
    bookingId = null;
    profileId = null;
    departmentId = null;
    dataflag = [];
    dataSending = [];
  },

  async loadData(data) {
    console.log(data)
    const resp = await requestService.request({
      url: API.API_GET_ITEMS,
      method: 'POST',
      data: {
        ...data
      }
    });
    console.log(resp);
    const items = resp?.data ??[]
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
    var itemId = e.currentTarget.dataset.itemid
    var value = e.detail.value
    this.dataUpdate({'itemId': itemId, 'value': value}, e)
  },
  /**
   * 数字文本输入检测校验码，之后可能会分开
   */
  onBlur(e) {
    var i = e.currentTarget.dataset.index
    var value = e.detail.value
    var itemRenderList = this.data.itemRenderList[i]
    if(value < itemRenderList.ext.min || value >itemRenderList.ext.max || value > itemRenderList.ext.maxLength){
      dataflag[i] = false
    }
    else{dataflag[i] = true}
  },

  /**
   * 选择 和校验码
   * @param {*} e 
   */
  checkboxChange(e) {
    console.log(e)
    var i = e.currentTarget.dataset.index
    var itemId = e.currentTarget.dataset.itemid
    var value = e.detail.value
    var itemRenderList = this.data.itemRenderList[i]
    if(!itemRenderList.ext.selectNum || value.length == itemRenderList.ext.selectNum){
      dataflag[i] = true
      this.dataUpdate({'itemId': itemId, 'value': JSON.stringify(value.map(Number))},e)
    }
    else{
      dataflag[i] = false
      wx.showModal({
        content: `请按照规范选择，请选择${itemRenderList.ext.selectNum}项`,
        showCancel: false,
        complete() {
        }
      })
    }
    
},
  /** 
   * 数据存贮
   */
  dataUpdate(data,e){
    var i  = e.currentTarget.dataset.index
    if(!dataSending[i] || dataSending[i].length <= 0){
      dataSending.push(data)
    }
    else{
      dataSending.splice(i, 1, data)
    }
    console.log(dataSending)
  },

  /** 
   * TODO 表单核查
   */
  checkItems(e){
    console.log(e)
  },

  /** 
   * 数据发送
   */
  async save(){
    await wx.showLoading({
      title: '请稍后',
   })
   setTimeout(() => {
    wx.hideLoading({
    success: (res) => {if(!dataflag || dataflag.length <=0){
        wx.showModal({
        content: '请填写表格',
        showCancel: false,
        complete() {
        }
      })
    }
    else{
      var dataflagCount = 0
      console.log(dataflag)
      dataflag.forEach((element) => {dataflagCount += element})
      if(dataflagCount < dataSending.length){
          wx.showModal({
          content: '存在不符合填写要求的体检项',
          showCancel: false,
          complete() {
          }
        })
      }else{
        this.sending(dataSending)
      }
    }},
  })
    }, 500);
  },

  async sending(data){
    console.log(data)
    const resp = await requestService.request({
      url: API.API_SET_ITEMS,
      method: 'POST',
      data: {
      hospitalId: hospitalId,
      profileId: profileId,
      bookingId: bookingId,
      departmentId: departmentId,
      itemValueDtos: data
      }
    });
    console.log(resp)
    if(resp.retcode == 200){
      wx.showModal({
        content: '成功提交',
        showCancel: false,
        complete() {
          wx.navigateBack()
        }
      })
    }

  }
})