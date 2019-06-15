const superagent = require('../config/superagent')
const config = require('../config/day')
const cheerio = require('cheerio')

async function getOne() { // 获取每日一句
    let res = await superagent.request(config.ONE, 'GET')
    let $ = cheerio.load(res.text)
    let todayOneList = $('#carousel-one .carousel-inner .item')
    let todayOne = $(todayOneList[0]).find('.fp-one-cita').text().replace(/(^\s*)|(\s*$)/g, "")
    return todayOne;
}

async function getWeather() { //获取墨迹天气
    let url = config.MOJI_HOST + config.CITY + '/' + config.LOCATION
    let res = await superagent.request(url, 'GET')
    let $ = cheerio.load(res.text)
    let weatherTips = $('.wea_tips em').text()
    const today = $('.forecast .days').first().find('li');
    let todayInfo = {
        Day: $(today[0]).text().replace(/(^\s*)|(\s*$)/g, ""),
        WeatherText: $(today[1]).text().replace(/(^\s*)|(\s*$)/g, ""),
        Temp: $(today[2]).text().replace(/(^\s*)|(\s*$)/g, ""),
        Wind: $(today[3]).find('em').text().replace(/(^\s*)|(\s*$)/g, ""),
        WindLevel: $(today[3]).find('b').text().replace(/(^\s*)|(\s*$)/g, ""),
        PollutionLevel: $(today[4]).find('strong').text().replace(/(^\s*)|(\s*$)/g, "")
    }
    let obj = {
        weatherTips: weatherTips,
        todayWeather: todayInfo.Day + ':' + todayInfo.WeatherText + '<br>' + '温度:' + todayInfo.Temp + '<br>' +
            todayInfo.Wind + todayInfo.WindLevel + '<br>' + '空气:' + todayInfo.PollutionLevel + '<br>'
    }
    return obj
}


function getDay(date) {
    var date2 = new Date();
    var date1 = new Date(date);
    var iDays = parseInt(Math.abs(date2.getTime() - date1.getTime()) / 1000 / 60 / 60 / 24);
    return iDays;
}

function formatDate(date) {
    var tempDate = new Date(date);
    var year = tempDate.getFullYear();
    var month = tempDate.getMonth() + 1;
    var day = tempDate.getDate();
    var hour = tempDate.getHours();
    var min = tempDate.getMinutes();
    var second = tempDate.getSeconds();
    var week = tempDate.getDay();
    var str = ''
    if (week === 0) {
        str = '星期日'
    } else if (week === 1) {
        str = "星期一";
    } else if (week === 2) {
        str = "星期二";
    } else if (week === 3) {
        str = "星期三";
    } else if (week === 4) {
        str = "星期四";
    } else if (week === 5) {
        str = "星期五";
    } else if (week === 6) {
        str = "星期六";
    }
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (min < 10) {
        min = "0" + min;
    }
    if (second < 10) {
        second = "0" + second;
    }
    return year + "-" + month + "-" + day + "日 " + hour + ":" + min + ' ' + str;
}

getToday = () => { // 获取今天日期
    const date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    return year + '-' + month + '-' + day + ' '
}

convertTime = (time) => { // 转换定时格式
    let array = time.split(':')
    return "0 " + array[1] + ' ' + array[0] + ' * * *'
}

contentDistinguish = (contact, keywordArray) => {
    let scheduleObj = {}
    let today = getToday()
    scheduleObj.setter = contact.name() // 设置定时任务的用户
    scheduleObj.subscribe = (keywordArray[1] === "我") ? contact.name() : keywordArray[1] // 定时任务接收者
    if (keywordArray[2] === "每天") { // 判断是否属于循环任务
        console.log('已设置每日定时任务')
        scheduleObj.isLoop = true
        let time = keywordArray[3].replace('：', ':')
        scheduleObj.time = convertTime(time)
        scheduleObj.content = (scheduleObj.setter === scheduleObj.subscribe) ? scheduleObj.content = "亲爱的" + scheduleObj.subscribe + "，温馨提醒：" + keywordArray[4].replace('我', '你') : "亲爱的" + scheduleObj.subscribe + "，" + scheduleObj.setter + "委托我提醒你，" + keywordArray[4].replace('我', '你')
    } else if (keywordArray[2] && keywordArray[2].indexOf('-') > -1) {
        console.log('已设置指定日期时间任务')
        scheduleObj.isLoop = false
        scheduleObj.time = keywordArray[2] + ' ' + keywordArray[3].replace('：', ':')
        scheduleObj.content = (scheduleObj.setter === scheduleObj.subscribe) ? scheduleObj.content = "亲爱的" + scheduleObj.subscribe + "，温馨提醒：" + keywordArray[4].replace('我', '你') : "亲爱的" + scheduleObj.subscribe + "，" + scheduleObj.setter + "委托我提醒你，" + keywordArray[4].replace('我', '你')
    } else {
        console.log('已设置当天任务')
        scheduleObj.isLoop = false
        scheduleObj.time = today + keywordArray[2].replace('：', ':')
        scheduleObj.content = (scheduleObj.setter === scheduleObj.subscribe) ? scheduleObj.content = "亲爱的" + scheduleObj.subscribe + "，温馨提醒：" + keywordArray[3].replace('我', '你') : "亲爱的" + scheduleObj.subscribe + "，" + scheduleObj.setter + "委托我提醒你，" + keywordArray[3].replace('我', '你')
    }
    return scheduleObj
}
async function getReply(word) { // 天行聊天机器人
    let url = config.AIBOTAPI
    let res = await superagent.request(url, 'GET', { key: config.APIKEY, question: word, })
    let content = JSON.parse(res.text)
    if (content.code === 200) {
        console.log(content)
        return content.newslist[0].reply
    } else {
        return '我好像迷失在无边的网络中了，你能找回我么'
    }
}
module.exports = {
    getToday,
    convertTime,
    contentDistinguish,
    getDay,
    formatDate,
    getOne,
    getWeather,
    getReply
}