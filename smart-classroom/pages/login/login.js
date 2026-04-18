Page({
  data: {
    showRoleSelector: false,
    selectedRole: null,
    userInfo: null
  },

  loginWithWechat() {
    const that = this
    wx.login({
      success: function(loginRes) {
        const defaultUserInfo = {
          nickName: '微信用户',
          avatarUrl: ''
        }
        that.setData({
          userInfo: defaultUserInfo,
          showRoleSelector: true
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        })
      }
    })
  },

  selectRole(e) {
    this.setData({
      selectedRole: e.currentTarget.dataset.role
    })
  },

  confirmRole() {
    const { selectedRole, userInfo } = this.data
    if (!selectedRole) return

    const app = getApp()
    app.globalData.userInfo = userInfo
    app.globalData.role = selectedRole

    wx.setStorageSync('userInfo', userInfo)
    wx.setStorageSync('role', selectedRole)

    wx.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1000
    })

    setTimeout(() => {
      if (selectedRole === 'teacher') {
        wx.switchTab({ url: '/pages/teacher/home/home' })
      } else {
        wx.switchTab({ url: '/pages/student/home/home' })
      }
    }, 1000)
  },

  onLoad() {
    const userInfo = wx.getStorageSync('userInfo')
    const role = wx.getStorageSync('role')
    if (userInfo && role) {
      const app = getApp()
      app.globalData.userInfo = userInfo
      app.globalData.role = role
      
      if (role === 'teacher') {
        wx.switchTab({ url: '/pages/teacher/home/home' })
      } else {
        wx.switchTab({ url: '/pages/student/home/home' })
      }
    }
  }
})