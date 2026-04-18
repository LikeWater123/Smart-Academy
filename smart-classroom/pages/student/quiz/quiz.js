// pages/student/quiz/quiz.js
Page({
  data: {
    questions: [],
    currentIndex: 0,
    selected: -1,
    answers: [],
    startTime: null,
    duration: 0,
    submitted: false,
    score: 0,
    assignmentId: ''
  },

  onLoad(options) {
    this.setData({
      startTime: Date.now(),
      assignmentId: options.id
    })
    this.startTimer()
    this.getAssignment(options.id)
  },

  // 获取作业题目
  getAssignment(id) {
    try {
      // 从本地存储获取作业
      const assignments = wx.getStorageSync('assignments') || []
      const assignment = assignments.find(item => item._id === id)
      
      if (assignment) {
        this.setData({
          questions: assignment.questions,
          answers: new Array(assignment.questions.length).fill(-1)
        })
      } else {
        wx.showToast({
          title: '作业不存在',
          icon: 'none'
        })
      }
    } catch (err) {
      console.error('获取题目失败:', err)
      wx.showToast({
        title: '获取题目失败',
        icon: 'none'
      })
    }
  },

  // 开始计时
  startTimer() {
    setInterval(() => {
      if (!this.data.submitted) {
        this.setData({
          duration: Math.floor((Date.now() - this.data.startTime) / 1000)
        })
      }
    }, 1000)
  },

  // 格式化时间
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  },

  // 选择答案
  onSelect(e) {
    this.setData({
      selected: e.currentTarget.dataset.index
    })
  },

  // 上一题
  onPrev() {
    const { currentIndex, selected, answers } = this.data
    if (currentIndex > 0) {
      answers[currentIndex] = selected
      this.setData({
        answers,
        currentIndex: currentIndex - 1,
        selected: answers[currentIndex - 1]
      })
    }
  },

  // 下一题
  onNext() {
    const { currentIndex, selected, answers, questions } = this.data
    if (currentIndex < questions.length - 1) {
      answers[currentIndex] = selected
      this.setData({
        answers,
        currentIndex: currentIndex + 1,
        selected: answers[currentIndex + 1]
      })
    }
  },

  // 提交作业
  onSubmit() {
    const { answers, questions, duration, assignmentId } = this.data
    
    // 保存当前题目的答案
    answers[this.data.currentIndex] = this.data.selected
    
    // 计算得分
    const score = answers.reduce((sum, ans, i) => {
      return sum + (ans === questions[i].correctAnswer ? 10 : 0)
    }, 0)
    
    // 停止计时
    this.setData({
      submitted: true,
      score,
      answers
    })
    
    // 保存结果到本地存储
    try {
      // 获取现有结果
      const existingResults = wx.getStorageSync('quizResults') || []
      
      const resultData = {
        assignmentId: assignmentId,
        answers: answers,
        score: score,
        duration: duration,
        completedAt: new Date().toISOString()
      }
      
      // 检查是否已存在该作业的结果
      const existingIndex = existingResults.findIndex(item => item.assignmentId === assignmentId)
      
      let updatedResults
      if (existingIndex > -1) {
        // 更新现有结果
        updatedResults = [...existingResults]
        updatedResults[existingIndex] = resultData
      } else {
        // 添加新结果
        updatedResults = [...existingResults, resultData]
      }
      
      // 保存到本地存储
      wx.setStorageSync('quizResults', updatedResults)
      console.log('提交成功')
    } catch (err) {
      console.error('保存结果失败:', err)
    }
  },

  // 返回作业列表
  navigateBack() {
    wx.navigateBack()
  }
})