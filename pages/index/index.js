Page({
  data: {
    dishes: [],
    rolling: false,
    rollingDish: {},
    selectedDish: null,
    todayDish: null,
    todayDate: '',
    historyList: [],
    dishCount: 0
  },

  onLoad() {
    this.loadData()
    this.checkTodayRecord()
  },

  onShow() {
    this.loadData()
  },

  // 加载菜品数据
  loadData() {
    const dishes = wx.getStorageSync('dishes') || []
    const history = wx.getStorageSync('history') || []
    this.setData({
      dishes,
      dishCount: dishes.length,
      historyList: history.slice(0, 10)
    })
  },

  // 检查今日是否已经选过
  checkTodayRecord() {
    const today = this.formatDate(new Date())
    const history = wx.getStorageSync('history') || []
    const todayRecord = history.find(item => item.date === today)
    if (todayRecord) {
      this.setData({
        todayDish: todayRecord,
        todayDate: today,
        selectedDish: todayRecord
      })
    } else {
      this.setData({
        todayDate: today
      })
    }
  },

  // 随机选菜
  rollDish() {
    const { dishes } = this.data
    if (dishes.length === 0) {
      wx.showToast({
        title: '请先添加菜品哦',
        icon: 'none'
      })
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/add/add'
        })
      }, 1000)
      return
    }

    this.setData({ rolling: true, selectedDish: null })

    // 滚动动画效果
    let count = 0
    const rollInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * dishes.length)
      this.setData({
        rollingDish: dishes[randomIndex]
      })
      count++
      if (count > 20) {
        clearInterval(rollInterval)
        // 最终选中
        const finalIndex = Math.floor(Math.random() * dishes.length)
        const selected = dishes[finalIndex]
        this.setData({
          rolling: false,
          selectedDish: selected
        })
        // 保存到今日记录和历史
        this.saveTodayRecord(selected)
      }
    }, 80)
  },

  // 保存今日选择记录
  saveTodayRecord(dish) {
    const today = this.formatDate(new Date())
    const history = wx.getStorageSync('history') || []
    // 移除今日已有记录
    const newHistory = history.filter(item => item.date !== today)
    // 添加新记录
    const record = {
      ...dish,
      date: today,
      selectTime: Date.now()
    }
    newHistory.unshift(record)
    // 最多保留30天记录
    wx.setStorageSync('history', newHistory.slice(0, 30))
    this.setData({
      todayDish: record,
      historyList: newHistory.slice(0, 10)
    })
  },

  // 重置选菜
  resetRoll() {
    this.setData({
      selectedDish: this.data.todayDish || null
    })
  },

  // 换一个今天的菜
  changeToday() {
    this.setData({
      selectedDish: null,
      todayDish: null
    })
    this.rollDish()
  },

  // 格式化日期
  formatDate(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}年${month}月${day}日`
  },

  onShareAppMessage() {
    return {
      title: '我今天吃这个！你也来选选？',
      path: '/pages/index/index'
    }
  }
})
