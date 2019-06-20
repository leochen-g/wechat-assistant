// 配置文件
module.exports = {
    // 基础定时发送功能配置项（必填项）
    NAME: '嗯哼', //备注姓名
    NICKNAME: '嗯哼', //昵称
    MEMORIAL_DAY: '2015/04/18', //你和收信者的纪念日
    CITY: 'shanghai', //收信者所在城市
    LOCATION: 'pudong-new-district', //收信者所在区 （可以访问墨迹天气网站后，查询区的英文拼写）
    SENDDATE: '0 0 8 * * *', //定时发送时间 每天8点0分0秒发送，规则见 /schedule/index.js
    ONE: 'http://wufazhuce.com/', ////ONE的web版网站
    MOJI_HOST: 'https://tianqi.moji.com/weather/china/', //中国墨迹天气url
    ROOMNAME: '/^微信每日说/i', //群名(请只修改中文，不要删除符号，这是正则)
    AIBOTAPI: 'http://api.tianapi.com/txapi/robot/', //天行机器人API 注册地址https://www.tianapi.com/signup.html?source=474284281
    APIKEY: '762be789103e1ae7b65573f8d4fc0df6', //天行机器人apikey
    AUTOREPLY: false
}