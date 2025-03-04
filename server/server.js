const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// 加载环境变量
dotenv.config();

// 导入路由
const authRoutes = require('./routes/auth');
const returnRoutes = require('./routes/returns');

// 初始化Express应用
const app = express();

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// CORS配置
app.use(cors({
  origin: true, // 允许所有来源
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// 中间件
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 测试路由
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// 静态文件目录
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/returns', returnRoutes);

// 基本路由
app.get('/', (req, res) => {
  res.json({ message: '欢迎使用电商平台API' });
});

// 404处理
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: '未找到请求的资源'
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('错误:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '服务器错误',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 连接MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB连接成功');
  } catch (error) {
    console.error('MongoDB连接失败:', error.message);
    process.exit(1);
  }
};

// 添加更多的错误处理
mongoose.connection.on('error', (err) => {
  console.error('MongoDB连接错误:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB断开连接');
});

connectDB();

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
}); 