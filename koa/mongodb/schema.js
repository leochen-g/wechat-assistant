const mongoose = require('./config')
const Schema = mongoose.Schema

let assistant = new Schema({
    subscribe: String, // 订阅者
    setter: String, // 设定任务者
    content: String, // 订阅内容
    time: String, // 定时日期
    isLoop: Boolean, // 是否为循环定时任务
    hasExpired: { type: Boolean, default: false }, // 判断任务是否过期
    createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Assistant', assistant)