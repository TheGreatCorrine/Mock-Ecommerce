const Return = require('../models/Return');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// @desc    创建退货请求
// @route   POST /api/returns
// @access  Private
exports.createReturn = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { description } = req.body;
    let userId = req.body.userId || req.user.id;

    // 处理图片
    let imageData;
    if (req.file) {
      // 如果是通过multer上传的文件
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      imageData = `${baseUrl}/uploads/${req.file.filename}`;
    } else if (req.body.image && req.body.image.startsWith('data:image')) {
      // 如果是base64编码的图片
      imageData = req.body.image;
    } else {
      return res.status(400).json({
        success: false,
        message: '请提供商品图片'
      });
    }

    // 创建退货记录
    const returnItem = await Return.create({
      userId,
      description,
      image: imageData
    });

    // 构建API响应格式
    const apiResponse = {
      userId: returnItem.userId,
      returnId: returnItem.returnId,
      image: returnItem.image,
      description: returnItem.description,
      createdAt: returnItem.createdAt
    };

    res.status(201).json(apiResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// @desc    获取用户的所有退货
// @route   GET /api/returns
// @access  Private
exports.getReturns = async (req, res) => {
  try {
    let userId = req.query.userId || req.user.id;

    const returns = await Return.find({ userId }).sort({ createdAt: -1 });

    // 格式化响应
    const formattedReturns = returns.map(item => ({
      userId: item.userId,
      returnId: item.returnId,
      image: item.image,
      description: item.description,
      createdAt: item.createdAt
    }));

    res.status(200).json(formattedReturns);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
};

// @desc    获取单个退货详情
// @route   GET /api/returns/:id
// @access  Private
exports.getReturn = async (req, res) => {
  try {
    const returnItem = await Return.findOne({ returnId: req.params.id });

    if (!returnItem) {
      return res.status(404).json({
        success: false,
        message: '未找到退货记录'
      });
    }

    // 检查是否是当前用户的退货记录
    if (returnItem.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '未授权访问此退货记录'
      });
    }

    // 格式化响应
    const formattedReturn = {
      userId: returnItem.userId,
      returnId: returnItem.returnId,
      image: returnItem.image,
      description: returnItem.description,
      createdAt: returnItem.createdAt
    };

    res.status(200).json(formattedReturn);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
}; 