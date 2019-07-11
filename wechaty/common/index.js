const api = require('../proxy/api')
const lib = require('../lib')
const service = require('../service/msg-filter-service')
/**
 * 获取每日新闻内容
 * @param {*} sortId 新闻资讯分类Id
 * @param {*} endWord 结尾备注
 */
async function getEveryDayRoomContent(sortId,endWord='微信小助手') {
  let today = lib.formatDate(new Date()) //获取今天的日期
  let news = await api.getNews(sortId)
  let content = `${today}<br>${news}<br>————————${endWord}`
  return  content
}
/**
 * 获取每日说内容
 * @param {*} date 与朋友的纪念日
 * @param {*} city 朋友所在城市
 * @param {*} endWord 结尾备注
 */
async function getEveryDayContent(date,city,endWord){
  let one = await api.getOne() //获取每日一句
  let weather = await api.getTXweather(city) //获取天气信息
  let today = lib.formatDate(new Date()) //获取今天的日期
  let memorialDay = lib.getDay(date) //获取纪念日天数
  let sweetWord = await api.getSweetWord() // 土味情话
  let str = `${today}<br>我们在一起的第${memorialDay}天<br><br>元气满满的一天开始啦,要开心噢^_^<br><br>今日天气<br>${weather.weatherTips}<br>${weather.todayWeather}<br>每日一句:<br>${one}<br><br>情话对你说:<br>${sweetWord}<br><br>————————${endWord}`
  return str
}

/**
 * 获取私聊返回内容
 */
async function getContactTextReply(contact,msg){
  const contactName = contact.name()
  const contactId = contact.id()
  let result = await service.filterFriendMsg(msg,contactName,contactId)
  
}


module.exports = {
  getEveryDayContent,
  getEveryDayRoomContent,
  getContactTextReply,
  contentDistinguish
};
