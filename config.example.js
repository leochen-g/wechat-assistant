// 配置文件
module.exports = {
    // 基础定时发送功能配置项（必填项）
    NAME: '嗯哼', //备注姓名
    NICKNAME: '嗯哼', //昵称
    MEMORIAL_DAY: '2015/04/18', //你和收信者的纪念日
    CITY: 'shanghai', //收信者所在城市
    SENDDATE: '0 0 8 * * *', //定时发送时间 每天8点0分0秒发送，规则见 /schedule/index.js
    ROOMNAME: '/^微信每日说/i', //群名(请只修改中文，不要删除符号，这是正则)
    TULINGKEY: '加群获取', // 天行对接的图灵机器人，众筹获取，具体详情加小助手后询问
    DEFAULTBOT: '0', // 默认机器人 0 天行机器人 1 天行对接的图灵机器人 2 图灵机器人
    AUTOREPLY: false // 是否设置机器人自动回复
}