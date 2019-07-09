/**
 * 微信好友消息事件监听
 * @param {string} msg 消息内容
 * @param {string} name 好友昵称
 * @returns {number} 返回事件类型
 * 事件说明
 * 0 机器人回复
 * 1 开启了好友验证 || 朋友推荐消息 || 发送的文字消息过长,大于40个字符
 * 2 初次添加好友
 * 3 加群
 * 4 初次发你好
 * 5 联系作者
 * 6 帮助
 * 7 提醒任务
 * 8 垃圾分类
 */
function filterFriendEvent(msg, name) {
  if (msg.indexOf('开启了朋友验证') > -1 || name == '朋友推荐消息' || msg.length > 40) {
    return 1;
  } else if (msg.indexOf('你已添加') > -1) {
    return 2;
  } else if (msg == '加群' || msg == '微信每日说') {
    return 3;
  } else if (msg == '你好' || msg== '您好'){
    return 4;
  } else if (msg.indexOf('联系作者') > -1) {
    return 5;
  } else if (msg =='帮助') {
    return 6;
  } else if (msg.substr(0, 2)== '提醒') {
    return 7;
  } else if (msg.substr(0, 1) == "？" || msg.substr(0, 1) == "?" ) {
    return 8;
  } else {
    return 0;
  }
}

/**
 * 微信群消息事件监听
 * @param {*} msg 群消息内容
 * @param {*} name 群名
 * @returns {number} 返回事件类型
 * 事件说明
 * 0 机器人回复
 * 1 开启了好友验证 || 朋友推荐消息 || 发送的文字消息过长,大于40个字符
 * 2 初次添加好友
 */
function filterRoomEvent(msg, name) {

}

module.exports ={
  filterFriendEvent,
  filterRoomEvent
}