const common = require('../common');
const lib = require('../lib/index');

async function dispatchFriendFilterByMsgType(that, msg) {
  const type = msg.type();
  const contact = msg.from(); // 发消息人
  
  const content = '';
  const reply = '';
  switch (type) {
    case that.Message.Type.Text:
      content = msg.text();
      reply = common.getContactTextReply(contact,content);
      if (reply !== '') {
        lib.delay(2000);
        contact.say(reply);
      }
      break;
    case that.Message.Type.Image:
      break;
    case that.Message.Type.Url:
      break;
    case that.Message.Type.Video:
      break;
    case that.Message.type.MiniProgram:
      break;
  }
}

async function dispatchRoomFilterByMsgType(that, msg) {}

async function onMessage(msg) {
  const room = msg.room(); // 是否为群消息
  const msgSelf = msg.self(); // 是否自己发给自己的消息

  if (msgSelf) return;
  if (room) {
    const mentionSelf = msg.mentionSelf(); // 机器人是否在群里被@ 了
  } else {
  }
}

module.exports = onMessage;
