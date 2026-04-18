// pages/student/plan/plan.js
Page({
  data: {
    learningPlan: null,
    loading: false
  },

  onLoad() {
    // 检查是否已有学习方案
    this.checkExistingPlan()
  },

  // 检查是否已有学习方案
  checkExistingPlan() {
    try {
      // 从本地存储获取学习方案
      const existingPlan = wx.getStorageSync('learningPlan')
      if (existingPlan) {
        this.setData({
          learningPlan: existingPlan
        })
      }
    } catch (err) {
      console.error('获取学习方案失败:', err)
    }
  },

  // 生成学习方案
  generatePlan() {
    this.setData({ loading: true })
    
    // 从本地存储获取做题结果
    try {
      const quizResults = wx.getStorageSync('quizResults') || []
      const app = getApp()
      const studentName = app.globalData.userInfo ? app.globalData.userInfo.nickName : '同学'
      
      // 分析做题数据
      const scores = quizResults.map(r => r.score)
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
      
      // 调用DeepSeek API生成学习方案
      this.callDeepSeekAPI({
        studentName: studentName,
        avgScore: avgScore,
        weakPoints: ['二次函数', '几何证明', '三角函数'] // 模拟薄弱知识点
      })
    } catch (err) {
      console.error('生成方案失败:', err)
      this.setData({ loading: false })
      wx.showToast({
        title: '生成方案失败，请重试',
        icon: 'none'
      })
    }
  },

  // 调用DeepSeek API
  callDeepSeekAPI(data) {
    const API_KEY = 'sk-34de69ebefed4c56854954db59c5fb0d'
    const SYSTEM_PROMPT = `你是一位经验丰富的教育专家。根据学生的做题数据，生成个性化学习方案。
输入数据：学生姓名、平均分、薄弱知识点列表
输出格式（严格JSON）：
{
  "assessment": "学习状况评估（80字内）",
  "weakPoints": ["知识点1", "知识点2", ...],
  "suggestions": ["建议1", "建议2", ...],
  "encouragement": "个性化鼓励语（30字内）"
}`

    wx.request({
      url: 'https://api.deepseek.com/v1/chat/completions',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      data: {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: JSON.stringify(data) }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      success: (res) => {
        if (res.data.choices && res.data.choices.length > 0) {
          try {
            const plan = JSON.parse(res.data.choices[0].message.content)
            this.setData({
              loading: false,
              learningPlan: plan
            })
            // 保存到本地存储
            wx.setStorageSync('learningPlan', plan)
          } catch (parseErr) {
            console.error('解析AI响应失败:', parseErr)
            this.showDefaultPlan()
          }
        } else {
          this.showDefaultPlan()
        }
      },
      fail: (err) => {
        console.error('调用API失败:', err)
        this.showDefaultPlan()
      }
    })
  },

  // 显示默认学习方案
  showDefaultPlan() {
    this.setData({
      loading: false,
      learningPlan: {
        assessment: '你的学习基础较好，掌握了大部分知识点，但在二次函数和几何证明方面还有提升空间。建议重点加强这两个板块的练习。',
        weakPoints: ['二次函数', '几何证明', '三角函数'],
        suggestions: [
          '每天花30分钟练习二次函数相关题目，重点掌握顶点坐标和开口方向的判断',
          '多做几何证明题，培养逻辑推理能力',
          '利用周末时间系统复习三角函数的基本公式和应用',
          '建立错题本，定期回顾错题，避免重复犯错'
        ],
        encouragement: '你是一个有潜力的学生，只要坚持努力，一定能够取得更大的进步！加油！'
      }
    })
    // 保存默认方案到本地存储
    wx.setStorageSync('learningPlan', this.data.learningPlan)
  }
})