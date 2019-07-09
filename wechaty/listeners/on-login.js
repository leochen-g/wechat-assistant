// 每次登录初始化定时任务
initSchedule = async that => {
  try {
    let contact = await that.Contact.find({ name: '嗯哼' });
    contact.say('这就回去啦');
    console.log('你的专属提醒开启啦！', contact);
  } catch (err) {
    console.log('初始化定时任务失败', err);
  }
};
onLogin = async function(user) {
  console.log(`贴心助理${user}登录了`);
  initSchedule(this);
};
module.exports = {
  onLogin
};
