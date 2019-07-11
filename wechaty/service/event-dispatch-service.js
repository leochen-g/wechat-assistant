const api = require('../proxy/api')
const lib = require('../lib')

/**
 * 内容解析
 * @param {*} contact 设置定时任务的用户
 * @param {*} keywordArray 分词后内容
 */
async function contentDistinguish(keywordArray,name) {
  let keywordArray = msg.replace(/\s+/g, ' ').split(" ")
  let scheduleObj = {};
  let today = lib.getToday();
  scheduleObj.setter = name // 设置定时任务的用户
  scheduleObj.subscribe = keywordArray[1] === '我' ? name : keywordArray[1]; // 定时任务接收者
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


async function dispatchEventContent({eName,...item}){
  switch (eName) {
    case 'remind':
      let msgArr = item.msg.replace(/\s+/g, ' ').split(" ")
      let obj = {type:'',content:''}
      if(msgArr.length>3){
        obj.type = 'object'
        obj.content = contentDistinguish(msgArr,name)
      }else{
        obj.type = 'text'
        obj.content = '提醒设置失败，请保证每个关键词之间使用空格分割开，并保证日期格式正确。正确格式为：“提醒(空格)我(空格)18:30(空格)下班回家”'
      }
      return obj
      break;
    case '':
      
      break;  
    default:
      break;
  }
}

module.exports ={
  dispatchEventContent
}