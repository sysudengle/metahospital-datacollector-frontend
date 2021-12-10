Page({
  data: {
    tabs: [],
    activeTab: 0,
    renderList: [
      [{
        name: '张三',
        id: '426***********1234',
        hospital: '南山医院',
        item: '2022年上半年体检',
      }],
      [{
        name: '李四',
        id: '426***********1222',
        hospital: '南山医院',
        item: '2021年上半年体检',
      }, {
        name: '李四',
        id: '426***********1222',
        hospital: '南山医院',
        item: '2021年上半年体检',
      }]
    ],
  },

  onShow() {
    const titles = ['可体检信息', '已过期信息']
    const tabs = titles.map(item => ({title: item}))
    this.setData({tabs})
  },

  onTabChange(e) {
    console.log('change', e)
    const index = e.detail.index
    this.setData({
      activeTab: index,
    })
  },

  toDetailPage(e) {
    wx.showToast({
      title: '进入详情',  
    })
  },

  toAddPage() {
    wx.navigateTo({
      url: '../../pages/add/index',
    })
  }
})