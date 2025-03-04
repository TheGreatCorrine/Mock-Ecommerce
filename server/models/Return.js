const mongoose = require('mongoose');

const ReturnSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  returnId: {
    type: Number,
    unique: true
  },
  description: {
    type: String,
    required: [true, '请提供退货原因'],
    trim: true
  },
  image: {
    type: String,
    required: [true, '请提供商品图片']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 自动生成退货ID
ReturnSchema.pre('save', async function(next) {
  if (!this.returnId) {
    // 查找最大的returnId并加1
    const maxReturn = await this.constructor.findOne({}, {}, { sort: { 'returnId': -1 } });
    this.returnId = maxReturn ? maxReturn.returnId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Return', ReturnSchema); 