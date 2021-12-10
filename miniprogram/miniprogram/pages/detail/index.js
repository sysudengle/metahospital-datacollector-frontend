/* 详情组件 */

Page({
  // 保存展示待办的 _id 和详细信息
  data: {
    _id: '',
    todo: {
      title: ''
    },
  },

  onLoad(options) {
    // 保存上一页传来的 _id 字段，用于后续查询待办记录
    if (options.id !== undefined) {
      this.setData({
        _id: options.id
      })
    }
  },

  // 根据 _id 值查询并显示数据生成二维码
  async onShow() {},
})