const { Wechaty } = require('wechaty');
const bot = new Wechaty({ name: 'WechatEveryDay' });
const { onLogin } = require('./listeners/on-login');
const { onScan } = require('./listeners/on-scan');

bot.on('scan', onScan);
bot.on('login', onLogin);

bot
  .start()
  .then(() => {
    console.log('开始登陆微信');
  })
  .catch(e => console.error(e));
