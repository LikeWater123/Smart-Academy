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

  // 调用DeepSeek API（使用模拟数据避免域名限制）
  callDeepSeekAPI(data) {
    // 由于微信小程序域名限制，使用模拟数据
    console.log('生成学习方案中...', data)
    
    // 模拟API响应
    setTimeout(() => {
      // 根据平均分生成不同的学习方案
      let plan
      if (data.avgScore >= 80) {
        plan = {
          assessment: `${data.studentName}的学习基础非常扎实，掌握了大部分知识点，建议挑战更高难度的题目，进一步提升自己的学习水平。`,
          weakPoints: ['高难度几何证明', '复杂函数应用', '竞赛题技巧'],
          suggestions: [
            '尝试解决一些竞赛级别的数学问题，提升解题能力',
            '参加数学兴趣小组，与同学交流学习心得',
            '阅读数学相关的科普书籍，拓展数学视野',
            '定期回顾错题，总结解题思路和方法'
          ],
          encouragement: `${data.studentName}，你是一个数学天才！继续保持，未来可期！`
        }
      } else if (data.avgScore >= 60) {
        plan = {
          assessment: `${data.studentName}的学习基础较好，掌握了基本知识点，但在一些难点上还有提升空间，建议加强针对性练习。`,
          weakPoints: ['二次函数', '几何证明', '三角函数'],
          suggestions: [
            '每天花30分钟练习二次函数相关题目，重点掌握顶点坐标和开口方向的判断',
            '多做几何证明题，培养逻辑推理能力',
            '利用周末时间系统复习三角函数的基本公式和应用',
            '建立错题本，定期回顾错题，避免重复犯错'
          ],
          encouragement: `${data.studentName}，你有很大的潜力！只要坚持努力，一定能够取得更大的进步！`
        }
      } else {
        plan = {
          assessment: `${data.studentName}的学习基础相对薄弱，需要从基础知识点开始加强，建议制定系统的学习计划。`,
          weakPoints: ['基础概念', '计算能力', '解题方法'],
          suggestions: [
            '从基础概念开始，确保每个知识点都理解透彻',
            '加强计算练习，提高计算的准确性和速度',
            '学习基本的解题方法和技巧',
            '寻求老师和同学的帮助，及时解决学习中的问题'
          ],
          encouragement: `${data.studentName}，学习是一个过程，只要不放弃，你一定能够逐步提高！`
        }
      }
      
      this.setData({
        loading: false,
        learningPlan: plan
      })
      // 保存到本地存储
      wx.setStorageSync('learningPlan', plan)
      console.log('学习方案生成成功')
    }, 1500)
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