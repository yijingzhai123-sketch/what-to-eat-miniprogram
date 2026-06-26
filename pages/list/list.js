Page({
  data: {
    dishList: [],
    filterList: [],
    tagList: [],
    currentTag: '',
    tagCount: 0,
    cookedCount: 0
  },

  onLoad() {
  },

  onShow() {
    this.loadData()
  },

  // 加载数据
  loadData() {
    const dishes = wx.getStorageSync('dishes') || []
    const history = wx.getStorageSync('history') || []
    // 提取所有标签
    const tags = [...new Set(dishes.map(d => d.tag).filter(tag => tag))]
    // 计算吃过的数量
    const cookedIds = [...new Set(history.map(h => h.id))]
    const cookedCount = dishes.filter(d => cookedIds.includes(d.id)).length

    this.setData({
      dishList: dishes,
      filterList: dishes,
      tagList: tags,
      tagCount: tags.length,
      cookedCount: cookedCount
    })
  },

  // 按标签筛选
  filterTag(e) {
    const tag = e.currentTarget.dataset.tag
    const { dishList } = this.data
    if (!tag) {
      this.setData({
        currentTag: '',
        filterList: dishList
      })
      return
    }
    const filtered = dishList.filter(d => d.tag === tag)
    this.setData({
      currentTag: tag,
      filterList: filtered
    })
  },

  // 就吃这个菜
  chooseThis(e) {
    const dish = e.currentTarget.dataset.dish
    wx.showModal({
      title: '确认选择',
      content: `今天确定吃${dish.name}吗？`,
      success: (res) => {
        if (res.confirm) {
          // 保存为今日选择
          const today = this.formatDate(new Date())
          const history = wx.getStorageSync('history') || []
          const newHistory = history.filter(item => item.date !== today)
          const record = {
            ...dish,
            date: today,
            selectTime: Date.now()
          }
          newHistory.unshift(record)
          wx.setStorageSync('history', newHistory.slice(0, 30))
          wx.showToast({
            title: `今天就吃${dish.name}！`,
            icon: 'success'
          })
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/index/index'
            })
          }, 1000)
        }
      }
    })
  },

  // 删除菜品
  deleteDish(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定要删掉这个菜吗？',
      success: (res) => {
        if (res.confirm) {
          const dishes = wx.getStorageSync('dishes') || []
          const newDishes = dishes.filter(d => d.id !== id)
          wx.setStorageSync('dishes', newDishes)
          wx.showToast({ title: '删除成功', icon: 'success' })
          this.loadData()
          // 如果当前有筛选，重新筛选
          if (this.data.currentTag) {
            this.filterTag({ currentTarget: { dataset: { tag: this.data.currentTag } } })
          }
        }
      }
    })
  },

  // 格式化日期
  formatDate(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}年${month}月${day}日`
  }
})
