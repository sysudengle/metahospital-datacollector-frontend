import { TARBAR_CONFIG } from '../common/constants';

console.log('TARBAR_CONFIG', TARBAR_CONFIG);

Component({
  properties: {
    active: {
      type: Number,
      value: 0
    }
  },
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "rgb(87, 190, 173)",
  },
  attached() {
    console.log(this.data.active)
    const { loginKey } = getApp().globalData;
    console.log(loginKey, TARBAR_CONFIG[loginKey])
    if (loginKey) {
      this.setData({
        list: TARBAR_CONFIG[loginKey]
      })
    }
    this.setData({
      selected: this.data.active
    })
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.redirectTo({url})
    }
  }
})