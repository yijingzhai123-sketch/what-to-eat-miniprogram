App({
  onLaunch() {
    // 初始化本地存储的菜品数据
    const dishes = wx.getStorageSync('dishes')
    if (!dishes || dishes.length === 0) {
      // 预置几个默认菜品
      const defaultDishes = [
        {id: 1, name: '番茄炒蛋', image: '/images/default1.png', tag: '家常菜', createTime: Date.now()},
        {id: 2, name: '青椒肉丝', image: '/images/default2.png', tag: '家常菜', createTime: Date.now()},
        {id: 3, name: '清蒸鲈鱼', image: '/images/default3.png', tag: '海鲜', createTime: Date.now()},
        {id: 4, name: '蛋炒饭', image: '/images/default4.png', tag: '主食', createTime: Date.now()},
        {id: 5, name: '火锅', image: '/images/default5.png', tag: '聚餐', createTime: Date.now()},
        {id: 6, name: '沙拉', image: '/images/default6.png', tag: '轻食', createTime: Date.now()}
      ]
      wx.setStorageSync('dishes', defaultDishes)
    }
    // 初始化历史记录
    const history = wx.getStorageSync('history')
    if (!history) {
      wx.setStorageSync('history', [])
    }
  },
  globalData: {
    userInfo: null
  }
})
