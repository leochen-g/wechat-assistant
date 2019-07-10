const { Wechaty } = require('wechaty');
// const onScan = require('./listeners/on-scan')
const onLogin = require('./listeners/on-login')
const bot = new Wechaty({ name: 'WechatEveryDay' });

let onScan = async function(user){
  const contact = await bot.Contact.find({name: '嗯哼'})
  console.log(contact)
}

bot.on('scan', onScan);
bot.on('login', onLogin);
// bot.on('logout', './listeners/on-logout');
// bot.on('friendship', './listeners/on-friend');
// bot.on('room-join', './listeners/on-roomjoin');
// bot.on('message', './listeners/on-message');


bot
  .start()
  .then(() => {
    console.log('开始登陆微信');
  })
  .catch(async function(e) {
    console.log(`初始化失败: ${e}.`)
    await bot.stop()
    process.exit(1)
  });
