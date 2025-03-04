const express = require('express');
const { check } = require('express-validator');
const { register, login, getMe } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

// 测试路由
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route is working' });
});

// 注册路由
router.post(
  '/register',
  [
    check('username', '请输入用户名').not().isEmpty(),
    check('username', '用户名至少需要3个字符').isLength({ min: 3 }),
    check('password', '请输入密码').not().isEmpty(),
    check('password', '密码至少需要6个字符').isLength({ min: 6 })
  ],
  register
);

// 登录路由
router.post(
  '/login',
  [
    check('username', '请输入用户名').not().isEmpty(),
    check('password', '请输入密码').not().isEmpty()
  ],
  login
);

// 获取当前用户
router.get('/me', protect, getMe);

module.exports = router; 