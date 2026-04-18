# 智慧学堂微信小程序

## 项目简介
智慧学堂是一个面向教师和学生的微信小程序，提供作业管理、学习方案生成等功能。

## 云函数部署参考
云函数部署参考文档：[微信小程序云函数开发指南](https://developers.weixin.qq.com/miniprogram/dev/wxcloudservice/wxcloud/guide/functions/getting-started.html)

## 项目结构
- `cloudfunctions/` - 云函数目录
  - `ai-service/` - AI 服务云函数
  - `assignment/` - 作业管理云函数
  - `login/` - 登录云函数
  - `quiz/` - 测验云函数
- `miniprogram_npm/` - 小程序依赖包
- `pages/` - 页面目录
- `app.js` - 小程序入口文件
- `app.json` - 小程序配置文件
- `app.wxss` - 全局样式文件
- `project.config.json` - 项目配置文件

## 开发说明
1. 使用微信开发者工具打开项目
2. 在云开发控制台中创建对应的云函数
3. 上传云函数到云端
4. 在本地进行调试

## 依赖包
- @vant/weapp - Vant 小程序组件库
- echarts-for-weixin - ECharts 小程序适配库
