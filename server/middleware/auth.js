const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 保护路由
exports.protect = async (req, res, next) => {
  let token;

  // 从请求头中获取token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 检查token是否存在
  if (!token) {
    return res.status(401).json({
      success: false,
      message: '未授权访问'
    });
  }

  try {
    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 获取用户
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '未授权访问'
    });
  }
}; 