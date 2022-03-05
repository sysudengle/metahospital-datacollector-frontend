
## 社区医院前端开发文档

### 小程序信息

- AppId：wx89dcffe5b777995e
- APPSecret：67f00ed9959ec7119b45f6ae37da9a35
- 管理平台：找管理员@张鑫

### 代码仓库

https://github.com/sysudengle/metahospital-datacollector-frontend.git

### 代码目录

```javascript
# miniprogram 小程序开发目录
# miniprogram/cloudfunctions 小程序云
# miniprogram/cloudfunctions/ocr 身份证orc云调用

miniprogram/miniprogram 小程序端具体目录及作用
├── common  公共类库
|   ├── api.js 请求配置
|   ├── cache.js 缓存
|   ├── config.js 配置信息
|   ├── constants.js 常量配置
|   ├── env.js 环境信息
|   ├── login.js 登录请求
|   ├── request.js 通用请求能力封装
|   ├── session.js session处理
├── components  组件
├── custom-tab-bar 自定义tab-bar组件样式
├── imgs  图片
├── lib  第三方库
├── miniprogram_npm  小程序npm资源包
├── pages  页面
|   ├── index 入口页
|   ├── ocr 身份证ocr
|   ├── user 普通用户使用流程
|   |   ├── index 普通用户档案中心
|   |   ├── booking/index 预约记录列表
|   |   ├── booking/add 添加预约
|   |   ├── profile 添加档案
|   |   ├── mine 个人中心
|   |   ├── qr 二维码展示
|   ├── doctor
|   |   ├── index 科室选择及扫码
|   |   ├── input 指标录入
|   |   ├── mine 个人中心
├── utils 工具封装
├── app.js
├── app.json
├── app.wxss
├── project.config.json
├── sitemap.json
```

### 对接文档

- 接口文档：https://docs.qq.com/doc/DWVdPQ0tIR2NGemVm
- 前端交互：https://docs.qq.com/sheet/DRmJ4bmNRbEFTQ1lI?tab=2rb8iz

### 版本发布

- 提交版本：开发者工具上传即可
- 管理平台：选择对应版本提交审核
- 管理平台：审核通过的版本即可提交发布

### 开发文档

1、小程序原生开发框架，详见：https://developers.weixin.qq.com/miniprogram/dev/framework/

2、小程序OCR，详见：https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/ocr/ocr.idcard.html

3、小程序OCR能力购买，详见：https://fuwu.weixin.qq.com/service/detail/000ce4cec24ca026d37900ed551415

