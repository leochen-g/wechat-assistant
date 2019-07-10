
module.exports = {
  ONE: 'http://wufazhuce.com/', // 每日一句网址
  TULING: 'http://www.tuling123.com/openapi/api', // 图灵api
  MOJI: 'https://tianqi.moji.com/weather/china/', // 墨迹天气官网
  TXHOST: 'http://api.tianapi.com/', // 天行host
  APIKEY: '762be789103e1ae7b65573f8d4fc0df6', //天行机器人apikey，免费提供
  KOAHOST: 'http://127.0.0.1:3008/api',// koa服务接口host 如果koa端口更换，此处也需更换
  TXBOT: this.TXHOST+ 'txapi/robot/', // 天行机器人
  TXTLBOT: this.TXHOST+ 'txapi/tuling/', // 天行图灵机器人
  TXRUBBISH: this.TXHOST+ 'txapi/lajifenlei/',// 天行垃圾分类
  TXLOVE: this.TXHOST+ 'txapi/saylove/', // 天行土情话
  TXWEATHER: this.TXHOST+ 'txapi/tianqi/', // 天行天气
  TXDAYNEWS: this.TXHOST+ 'allnews/',// 天行每日新闻
} 
