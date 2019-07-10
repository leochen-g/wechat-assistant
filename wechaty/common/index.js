const api = require('../proxy/api')
const lib = require('../lib')

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
  let str = `${today}<br>我们在一起的第${memorialDay}天<br><br>元气满满的一天开始啦,要开心噢^_^<br><br>今日天气<br>${weather.weatherTips}<br>${weather.todayWeather}<br>每日一句:<br>${one}<br>情话对你说:<br>${sweetWord}<br><br>————————${endWord}`
  return str
}

/**
 * 设置提醒
 * @param {*} contact 设置定时任务的用户
 * @param {*} keywordArray 分词后内容
 */
async function contentDistinguish(contact, keywordArray) {
  let scheduleObj = {};
  let today = getToday();
  scheduleObj.setter = contact.name(); // 设置定时任务的用户
  scheduleObj.subscribe =
    keywordArray[1] === '我' ? await contact.alias() : keywordArray[1]; // 定时任务接收者
  if (keywordArray[2] === '每天') {
    // 判断是否属于循环任务
    console.log('已设置每日定时任务');
    scheduleObj.isLoop = true;
    let time = keywordArray[3].replace('：', ':');
    scheduleObj.time = convertTime(time);
    scheduleObj.content = (scheduleObj.setter === scheduleObj.subscribe) ? `亲爱的${scheduleObj.subscribe}，温馨提醒：${keywordArray[4].replace('我', '你')}`
        : `亲爱的${scheduleObj.subscribe},${scheduleObj.setter}委托我提醒你，${keywordArray[4].replace('我', '你')}`
  } else if (keywordArray[2] && keywordArray[2].indexOf('-') > -1) {
    console.log('已设置指定日期时间任务');
    scheduleObj.isLoop = false;
    scheduleObj.time =
    keywordArray[2] + ' ' + keywordArray[3].replace('：', ':');
    scheduleObj.content = (scheduleObj.setter === scheduleObj.subscribe) ? `亲爱的${scheduleObj.subscribe}，温馨提醒：${keywordArray[4].replace('我', '你')}`
        : `亲爱的${scheduleObj.subscribe},${scheduleObj.setter}委托我提醒你，${keywordArray[4].replace('我', '你')}`
  } else {
    console.log('已设置当天任务');
    scheduleObj.isLoop = false;
    scheduleObj.time = today + keywordArray[2].replace('：', ':');
    scheduleObj.content = (scheduleObj.setter === scheduleObj.subscribe) ? `亲爱的${scheduleObj.subscribe}，温馨提醒：${keywordArray[3].replace('我', '你')}`
        : `亲爱的${scheduleObj.subscribe},${scheduleObj.setter}委托我提醒你，${keywordArray[3].replace('我', '你')}`
  }
  return scheduleObj;
}

module.exports = {
  getEveryDayContent,
  getEveryDayRoomContent,
  contentDistinguish
};
