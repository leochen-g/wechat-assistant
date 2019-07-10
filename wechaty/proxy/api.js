const cheerio = require('cheerio');
const http = require('./superagent');
const apiConfig = require('./config');
const config = require('../../wechat.config');
const { machineIdSync } = require('node-machine-id');
const crypto = require('crypto');
let md5 = crypto.createHash('md5');
let uniqueId = md5.update(machineIdSync()).digest('hex'); // 获取机器唯一识别码并MD5，方便机器人上下文关联

/**
 * 获取定时任务列表
 */
async function getScheduleList () {
  try {
    let res = await http.req(apiConfig.KOAHOST + '/getScheduleList', 'GET')
    let text = JSON.parse(res.text);
    let scheduleList = text.data;
    return scheduleList
  } catch (error) {
    console.log('获取定时任务失败:'+error)
  }
}
/**
 * 更新定时任务
 */
async function updateSchedule (id) {
  try {
    let res = await http.req(apiConfig.KOAHOST + '/updateSchedule', 'POST','', { id: id })
    console.log('更新定时任务成功')
  } catch (error) {
    console.log('更新定时任务失败',error)
  }
}
/**
 * 获取每日一句
 */
async function getOne() {
  let res = await http.req(apiConfig.ONE, 'GET');
  let $ = cheerio.load(res.text);
  let todayOneList = $('#carousel-one .carousel-inner .item');
  let todayOne = $(todayOneList[0])
    .find('.fp-one-cita')
    .text()
    .replace(/(^\s*)|(\s*$)/g, '');
  return todayOne;
}


/**
 * 天行图灵聊天机器人
 * @param {*} word 发送内容
 */
async function getResByTXTL(word) {
  let url = apiConfig.TXTLBOT;
  let res = await http.req(url, 'GET', {
    key: config.APIKEY,
    question: word,
    userid: uniqueId
  });
  let content = JSON.parse(res.text);
  if (content.code === 200) {
    let response = content.newslist[0].reply;
    return response;
  } else {
    return '我好像迷失在无边的网络中了，接口调用错误：' + content.msg;
  }
}

/**
 * 天行聊天机器人
 * @param {*} word 
 */
async function getResByTX(word) { 
  let url = apiConfig.TXBOT
  let res = await http.req(url, 'GET', { key: apiConfig.APIKEY, question: word, userid: uniqueId})
  let content = JSON.parse(res.text)
  if (content.code === 200) {
      let response = ''
      if (content.datatype === 'text') {
          response = content.newslist[0].reply
      } else if (content.datatype === 'view') {
          response = '虽然我不太懂你说的是什么，但是感觉很高级的样子，因此我也查找了类似的文章去学习，你觉得有用吗<br>' + '《' + content.newslist[0].title + '》' + content.newslist[0].url
      } else {
          response = '你太厉害了，说的话把我难倒了，我要去学习了，不然没法回答你的问题'
      }
      return response
  } else {
      return '我好像迷失在无边的网络中了，你能找回我么'
  }
}

/**
 * 图灵智能聊天机器人
 * @param {*} word 
 */
async function getResByTL(word) {
  let url = apiConfig.TULING
  let res = await http.req(url,'GET',{key:config.TULINGKEY,info:word})
  let content = JSON.parse(res.text)
  if(content.code===100000){
    return content.text
  }else {
    return '出错了：'+ content.text
  }
}

/**
 * 获取垃圾分类结果
 * @param {String} word 垃圾名称
 */
async function getRubbishType (word) {
  let url = apiConfig.TXRUBBISH
  let res = await http.req(url,'GET',{key:apiConfig.APIKEY,word:word})
  let content = JSON.parse(res.text)
  if (content.code === 200) {
    let type
  if(content.newslist[0].type == 0){
    type = '是可回收垃圾'
  }else if(content.newslist[0].type == 1){
    type = '是有害垃圾'
  }else if(content.newslist[0].type == 2){
    type = '是厨余(湿)垃圾'
  }else if(content.newslist[0].type == 3){
    type = '是其他(干)垃圾'
  }
  let response = content.newslist[0].name + type + '<br>解释：' + content.newslist[0].explain + '<br>主要包括：' + content.newslist[0].contain + '<br>投放提示：' +content.newslist[0].tip
  return response
} else {
     console.log('查询失败提示：', content.msg)
    return '暂时还没找到这个分类信息呢'
}  
}

/**
 * 土味情话获取
 */
async function getSweetWord() { 
  let url = apiConfig.TXLOVE
  try {
      let res = await http.req(url, 'GET', { key: apiConfig.APIKEY })
      let content = JSON.parse(res.text)
      if (content.code === 200) {
          let sweet = content.newslist[0].content
          let str = sweet.replace('\r\n', '<br>')
          return str
      } else {
          console.log('获取接口失败', content.msg)
      }
  } catch (err) {
      console.log('获取接口失败', err)
  }
}

/**
 * 获取天行天气
 */
async function getTXweather(city) {
  let url = apiConfig.TXWEATHER
  try {
      let res = await http.req(url, 'GET', { key: apiConfig.APIKEY, city: city })
      let content = JSON.parse(res.text)
      if (content.code === 200) {
          let todayInfo = content.newslist[0]
          let obj = {
              weatherTips: todayInfo.tips,
              todayWeather: '今天:' + todayInfo.weather + '<br>' + '温度:' + todayInfo.lowest + '/' + todayInfo.highest + '<br>' +
                  todayInfo.wind + ' ' + todayInfo.windspeed + '<br>' + '空气:' + todayInfo.air_level + ' ' + todayInfo.air + '<br>'
          }
          console.log('获取天行天气成功', obj)
          return obj
      } else {
          console.log('获取接口失败', content.msg)
      }
  } catch (err) {
      console.log('获取接口失败', err)
  }
}
/**
 * 获取每日新闻内容
 * @param {*} id 新闻频道对应的ID
 */
async function getNews(id) {
  let url = apiConfig.TXDAYNEWS
  try {
    let res = await http.req(url,'GET',{key:apiConfig.APIKEY, num: 10,col: id})
    let content = JSON.parse(res.text)
    if(content.code === 200){
      let newList = content.newslist
      let news = ''
      for(let i in newList){
        let num = i+1
        news = `${news}<br>${num}.${newList[i].title}`
      }
      return news
    }
  } catch (error) {
    console.log('获取天行新闻失败',error)
  }
}
module.exports = {
  getOne,
  getResByTXTL,
  getResByTX,
  getResByTL,
  getTXweather,
  getRubbishType,
  getSweetWord,
  getScheduleList,
  updateSchedule,
  getNews
}