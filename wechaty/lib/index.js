/**
 * 延时函数
 * @param {*} ms 毫秒
 */
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * 获取周几
 * @param {*} date 日期
 */
function getDay(date) {
  var date2 = new Date();
  var date1 = new Date(date);
  var iDays = parseInt(
    Math.abs(date2.getTime() - date1.getTime()) / 1000 / 60 / 60 / 24
  );
  return iDays;
}

/**
 * 格式化日期
 * @param {*} date 
 * @returns 例：2019-9-10 13:13:04
 */
function formatDate(date) {
  var tempDate = new Date(date);
  var year = tempDate.getFullYear();
  var month = tempDate.getMonth() + 1;
  var day = tempDate.getDate();
  var hour = tempDate.getHours();
  var min = tempDate.getMinutes();
  var second = tempDate.getSeconds();
  var week = tempDate.getDay();
  var str = '';
  if (week === 0) {
    str = '星期日';
  } else if (week === 1) {
    str = '星期一';
  } else if (week === 2) {
    str = '星期二';
  } else if (week === 3) {
    str = '星期三';
  } else if (week === 4) {
    str = '星期四';
  } else if (week === 5) {
    str = '星期五';
  } else if (week === 6) {
    str = '星期六';
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  if (min < 10) {
    min = '0' + min;
  }
  if (second < 10) {
    second = '0' + second;
  }
  return year + '-' + month + '-' + day + '日 ' + hour + ':' + min + ' ' + str;
}

/**
 * 获取今天日期
 * @returns 2019-7-19
 */
function getToday() {
  const date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return year + '-' + month + '-' + day + ' ';
}

/**
 * 转换定时日期格式
 * @param {*} time 
 * @returns 0 12 15 * * * 每天下午3点12分
 */
function convertTime(time) {
  let array = time.split(':');
  return '0 ' + array[1] + ' ' + array[0] + ' * * *';
}

/**
 * 设置提醒
 * @param {*} contact 设置定时任务的用户
 * @param {*} keywordArray 分词后内容
 */
function contentDistinguish(contact, keywordArray) {
  let scheduleObj = {};
  let today = getToday();
  scheduleObj.setter = contact.name(); // 设置定时任务的用户
  scheduleObj.subscribe =
    keywordArray[1] === '我' ? contact.name() : keywordArray[1]; // 定时任务接收者
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

// 判断日期时间格式是否正确
function isRealDate(str) {
  var reg = /^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2})$/;
  var r = str.match(reg);
  if (r == null) return false;
  r[2] = r[2] - 1;
  var d = new Date(r[1], r[2], r[3], r[4], r[5]);
  if (d.getFullYear() != r[1]) return false;
  if (d.getMonth() != r[2]) return false;
  if (d.getDate() != r[3]) return false;
  if (d.getHours() != r[4]) return false;
  if (d.getMinutes() != r[5]) return false;
  return true;
}

module.exports = {
  delay,
  getToday,
  convertTime,
  contentDistinguish,
  getDay,
  formatDate,
  isRealDate
};
