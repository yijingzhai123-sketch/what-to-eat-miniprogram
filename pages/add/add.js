Page({
  data: {
    formData: {
      name: '',
      image: '',
      tag: '',
      remark: ''
    },
    tagOptions: ['家常菜', '外卖', '火锅', '烧烤', '轻食', '海鲜', '主食', '小吃', '甜品'],
    customTag: '',
    showCustomTag: false,
    canSave: false
  },

  onLoad() {
  },

  // 选择图片
  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.setData({
          'formData.image': tempFilePath
        })
        this.checkCanSave()
      }
    })
  },

  // 输入菜品名称
  onNameInput(e) {
    this.setData({
      'formData.name': e.detail.value.trim()
    })
    this.checkCanSave()
  },

  // 选择标签
  selectTag(e) {
    const tag = e.currentTarget.dataset.tag
    this.setData({
      'formData.tag': tag,
      showCustomTag: false,
      customTag: ''
    })
  },

  // 切换自定义标签输入
  toggleCustomTag() {
    this.setData({
      showCustomTag: true,
      'formData.tag': ''
    })
  },

  // 输入自定义标签
  onTagInput(e) {
    this.setData({
      customTag: e.detail.value.trim(),
      'formData.tag': e.detail.value.trim()
    })
  },

  // 输入备注
  onRemarkInput(e) {
    this.setData({
      'formData.remark': e.detail.value
    })
  },

  // 检查是否可以保存
  checkCanSave() {
    const { name, image } = this.data.formData
    this.setData({
      canSave: name.length > 0 && image.length > 0
    })
  },

  // 保存菜品
  saveDish() {
    const { formData } = this.data
    if (!formData.name.trim()) {
      wx.showToast({ title: '请输入菜品名称', icon: 'none' })
      return
    }
    if (!formData.image) {
      wx.showToast({ title: '请上传菜品图片', icon: 'none' })
      return
    }

    // 读取现有菜品
    const dishes = wx.getStorageSync('dishes') || []
    // 生成新ID
    const newId = dishes.length > 0 ? Math.max(...dishes.map(d => d.id)) + 1 : 1
    const newDish = {
      id: newId,
      name: formData.name.trim(),
      image: formData.image,
      tag: formData.tag,
      remark: formData.remark,
      createTime: Date.now()
    }
    dishes.unshift(newDish)
    wx.setStorageSync('dishes', dishes)

    wx.showToast({
      title: '添加成功',
      icon: 'success'
    })

    // 重置表单
    setTimeout(() => {
      this.setData({
        formData: { name: '', image: '', tag: '', remark: '' },
        customTag: '',
        showCustomTag: false,
        canSave: false
      })
      // 跳转到菜品列表
      wx.switchTab({
        url: '/pages/list/list'
      })
    }, 1000)
  }
})
