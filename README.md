# 电商平台 API 演示

这是一个简单的电商平台原型，主要用于展示退货API功能。

## 功能

- 用户注册/登录
- 退货请求提交（包含图片上传）
- 退货历史查看

## 技术栈

### 前端
- Next.js (React框架)
- Tailwind CSS
- Axios

### 后端
- Node.js + Express
- MongoDB
- JWT认证

## 项目结构

```
mock-ecommerce/
├── client/                 # 前端代码
│   ├── components/         # React组件
│   ├── pages/              # Next.js页面
│   ├── public/             # 静态资源
│   ├── styles/             # CSS样式
│   └── ...
├── server/                 # 后端代码
│   ├── controllers/        # 控制器
│   ├── models/             # 数据模型
│   ├── routes/             # API路由
│   ├── middleware/         # 中间件
│   └── ...
└── docker-compose.yml      # Docker配置
```

## 安装与运行

### 前端

```bash
cd client
npm install
npm run dev
```

### 后端

```bash
cd server
npm install
npm run dev
```

### 使用Docker

```bash
docker-compose up
```

## API文档

### 用户API

- POST /api/auth/register - 用户注册
- POST /api/auth/login - 用户登录
- GET /api/auth/logout - 用户登出

### 退货API

- POST /api/returns - 创建退货请求
- GET /api/returns - 获取用户退货历史
- GET /api/returns/:id - 获取特定退货详情

## 与Python+Flask系统集成

本系统的API设计与Python+Flask系统兼容，退货数据将以JSON格式传输，包含base64编码的图片数据。
