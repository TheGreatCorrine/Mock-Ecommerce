const express = require('express');
const { check } = require('express-validator');
const { createReturn, getReturns, getReturn } = require('../controllers/returns');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// 所有路由都需要认证
router.use(protect);

// 创建退货请求
router.post(
  '/',
  upload.single('image'),
  [
    check('description', '请提供退货原因').not().isEmpty()
  ],
  createReturn
);

// 获取用户的所有退货
router.get('/', getReturns);

// 获取单个退货详情
router.get('/:id', getReturn);

module.exports = router; 