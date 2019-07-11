const config = require('../../wechat.config');
const dispatch = require('./event-dispatch-service');
const WEIXINOFFICIAL = ['朋友推荐消息', '微信支付', '微信运动', '微信团队']; // 微信官方账户，针对此账户不做任何回复
const DELETEFRIEND = '开启了朋友验证'; // 被人删除后，防止重复回复
const NEWADDFRIEND = '你已添加';

/**
 * 微信好友消息事件过滤
 * @param {string} msg 消息内容
 * @param {string} name 好友昵称
 * @returns {number} 返回回复内容
 */
async function filterFriendMsg(msg, name, id) {
  let obj = {type:'',content:'',event:{}}
  if (msg.includes(DELETEFRIEND) ||WEIXINOFFICIAL.includes(name) ||msg.length > 40) {
    console.log('无效及官方消息，不做回复');
    obj.type ='text'
    obj.content = ''
    return obj;
  }
  if (msg.includes(NEWADDFRIEND)) {
    console.log(`新添加好友：${name}，默认回复`);
    obj.type ='text'
    obj.content = config.NEWFRIENDREPLY;
    return obj;
  }
  if (config.ADDROOMKEYLIST && config.ADDROOMKEYLIST.length > 0) {
    for (let item of config.ADDROOMKEY) {
      if (item.key.includes(msg)) {
        console.log(`匹配到加群关键词${msg},正在邀请用户进群`);
        obj.type = 'addRoom'
        obj.event = {name:item.roomName}
        return obj;
      }
    }
  }
  if (config.KEYWORDLIST && config.KEYWORDLIST.length > 0) {
    for (let item of config.KEYWORDLIST) {
      if (item.key.includes(msg)) {
        console.log(`匹配到关键词${msg},正在回复用户`);
        obj.type = 'text'
        obj.content = item.reply;
        return obj;
      }
    }
  }
  if (config.EVENTKEYWORDLIST && config.EVENTKEYWORDLIST.length > 0) {
    for (let item of config.EVENTKEYWORDLIST) {
      switch (item.position) {
        case 'start':
          if (msg.startsWith(item.key)) {
            let reply = await dispatch.dispatchEventContent(item.event,msg,name,id);
            obj.type = 'event'
            obj.event = {}
            return reply;
          }
          break;
        case 'middle':
          if (msg.includes(item.key)) {
            let reply = await dispatch.dispatchEventContent(item.event,msg,name,id);
            return reply;
          }
          break;
        case 'end':
          if (msg.endsWith(item.key)) {
            let reply = await dispatch.dispatchEventContent(item.event,msg,name,id);
            return reply;
          }
          break;
        default:
          break;
      }
    }
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
function filterRoomMsg(msg, name) {}

module.exports = {
  filterFriendMsg,
  filterRoomMsg
};
