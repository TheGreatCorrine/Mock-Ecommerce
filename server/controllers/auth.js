const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    注册用户
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    console.log('收到注册请求:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: '验证错误',
        errors: errors.array() 
      });
    }

    const { username, password } = req.body;

    // 检查用户是否已存在
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        success: false,
        message: '用户名已被使用'
      });
    }

    // 创建用户
    user = await User.create({
      username,
      password
    });

    // 返回token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      userId: user._id
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// @desc    用户登录
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    console.log('收到登录请求:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: '验证错误',
        errors: errors.array() 
      });
    }

    const { username, password } = req.body;

    // 检查用户是否存在
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 检查密码是否匹配
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 返回token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      userId: user._id
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// @desc    获取当前登录用户
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
}; 