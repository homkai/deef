# 导入标题弹窗
- 贴近百度推广实际业务场景
- 使用内部的UI库 —— fcui2
- 集成表单校验公共组件
- 完善的es6、less、mock开发支持

## fcui2（本demo依赖的）
文档：http://fcfe.github.io/products/fcui2/

## 启动
```bash
npm install #（仅首次运行需要）
npm run dev
```
打开 http://127.0.0.1:8881

## 目录结构
 - api 数据接口（mock）
 - src 项目源码
    - common 公共UI控件、工具方法等
    - IdeaEditor 创意编辑器代码
        - index.js 主文件
        - UI.js UI组件
        - model.js 状态数据model
        - handler.js 用于响应用户事件的处理方法
        - config 配置

**主要参考src/IdeaEditor的代码即可**

## 技术栈说明
- 需要es6基础、组件化开发、单向数据流思维
- 项目基于自研框架deef开发，https://github.com/homkai/deef
- deef基于react、redux实现，但不强依赖react、redux基础，仅需要JSX基础

**deef的代码组织很简单，不需要太参考文档，看demo代码模仿即可**

## 其他参考
- 本demo依赖的UI库 fcui2文档：http://fcfe.github.io/products/fcui2/

## 需求开发练习
可依据《需求说明》，练习使用deef开发