// pages/student/home/home.js
Page({
  data: {
    userInfo: null,
    pendingAssignments: [],
    completedAssignments: []
  },

  onLoad() {
    // 获取用户信息
    const app = getApp()
    this.setData({
      userInfo: app.globalData.userInfo
    })
    
    // 获取作业列表
    this.getAssignments()
  },

  // 获取作业列表
  getAssignments() {
    try {
      // 从本地存储获取作业
      const assignments = wx.getStorageSync('assignments') || []
      // 从本地存储获取已完成的作业结果
      const quizResults = wx.getStorageSync('quizResults') || []
      
      // 分离待做和已完成的作业
      const pendingAssignments = assignments.filter(assignment => {
        // 检查是否有对应的完成记录
        return !quizResults.some(result => result.assignmentId === assignment._id)
      })
      
      const completedAssignments = quizResults.map(result => {
        // 找到对应的作业信息
        const assignment = assignments.find(a => a._id === result.assignmentId)
        if (assignment) {
          return {
            ...assignment,
            score: result.score,
            completedAt: result.completedAt
          }
        }
        return null
      }).filter(Boolean)
      
      this.setData({
        pendingAssignments: pendingAssignments,
        completedAssignments: completedAssignments
      })
    } catch (err) {
      console.error('获取作业失败:', err)
      wx.showToast({
        title: '获取作业失败',
        icon: 'none'
      })
    }
  },

  // 开始做题
  startQuiz(e) {
    const assignmentId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/student/quiz/quiz?id=${assignmentId}`
    })
  },

  // 查看结果
  viewResult(e) {
    const assignmentId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/student/quiz/quiz?id=${assignmentId}&view=true`
    })
  },

  // 格式化日期
  formatDate(date) {
    if (!date) return ''
    const d = new Date(date)
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}`
  },

  onPullDownRefresh() {
    this.getAssignments()
    wx.stopPullDownRefresh()
  }
})