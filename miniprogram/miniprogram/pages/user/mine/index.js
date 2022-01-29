/* 详情组件 */

Page({
  // 保存展示待办的 _id 和详细信息
  data: {
    list: [
      { title: '体检报告', lineColor: '#e8e8e8', key: 'report' },
      { title: '切换医院', lineColor: '#e8e8e8', key: 'changeHospital' },
      { title: '切换角色', lineColor: 'rgba(0,0,0,0)', key: 'changeLogin' },
    ]
  },

  onLoad(options) {
    // 保存上一页传来的 _id 字段，用于后续查询待办记录
    if (options.id !== undefined) {
      this.setData({
        _id: options.id
      })
    }
  },

  async onShow() {},
  onTap(e) {
    console.log(e)
    const { id } = e.currentTarget;
    const item = this.data.list[+id];
    switch (item.key) {
      case 'report':
        wx.showToast({
          title: '暂未开放，敬请期待',
          icon: 'none',
          duration: 1500
        });
        break;
      case 'changeHospital':
        wx.reLaunch({
          url: '/pages/index/index?type=2'
        })
        break;
      case 'changeLogin':
        wx.reLaunch({
          url: '/pages/index/index'
        })
        break;
      default:
        break;
    }
  }
})