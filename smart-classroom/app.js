//app.js
App({
  onLaunch: function() {
    // 初始化云开发
    wx.cloud.init({
      env: 'cloudbase-d5gpn2btk3d55613b',
      traceUser: true
    })
  },
  globalData: {
    userInfo: null,
    role: null
  }
})