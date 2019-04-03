const getToday = () => { // 获取今天日期
    const date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    return year + '-' + month + '-' + day + ' '
}

const convertTime = (time) => { // 转换定时格式
    let array = time.split(':')
    return "0 " + array[1] + ' ' + array[0] + ' * * *'
}

const contentDistinguish = (contact, keywordArray) => {
    let scheduleObj = {}
    let today = getToday()
    scheduleObj.setter = contact.name() // 设置定时任务的用户
    scheduleObj.subscribe = (keywordArray[1] === "我") ? contact.name() : keywordArray[1] // 定时任务接收者
    if (keywordArray[2] === "每天") { // 判断是否属于循环任务
        console.log('已设置每日定时任务')
        scheduleObj.isLoop = true
        scheduleObj.time = convertTime(keywordArray[3])
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
module.exports = {
    getToday,
    convertTime,
    contentDistinguish
}