const { Wechaty, Friendship, config, log } = require('wechaty')
const schedule = require('./bin/schedule')
const { FileBox } = require('file-box')
const Qrterminal = require('qrcode-terminal')
const { req } = require('../proxy/superagent')
const utils = require('../lib/index')
const host = 'http://127.0.0.1:3008/api'
const day = require('../bin/day')


// 消息监听
onMessage = async(msg) => {
    const contact = msg.from()
    const content = ''
    if(msg.type === bot.Message.Type.Text){
       content = msg.text()
    }
    const room = msg.room()
    const meiri = await bot.Room.find({ topic: '微信每日说' })
    if (msg.self()) return
    if (room) {
        const roomName = await room.topic()
        console.log(`群名: ${roomName} 发消息人: ${contact.name()} 内容: ${content}`)
        let replyRoom
        if (roomName == "微信每日说" && content.indexOf('@小助手') > -1) {
			let roomContent = content.replace('@小助手','')
          if(day.DEFAULTBOT=='0'){
            replyRoom = await utils.getReply(roomContent)
            console.log('天行机器人回复：', replyRoom)
          }else if(day.DEFAULTBOT=='1'){
            replyRoom = await utils.getTuLingReply(roomContent)
            console.log('图灵机器人回复：', replyRoom)
          }else {
            replyRoom = '你好啊！有什么事情可以直接找群主的，我只是一个小助手，没法解决你的问题'
          }
            await utils.utils.delay(2000)
            await room.say(replyRoom)
        }
    } else if(content !== ''){
        console.log(`发消息人: ${contact.name()} 消息内容: ${content}`)
        let keywordArray = content.replace(/\s+/g, ' ').split(" ") // 把多个空格替换成一个空格，并使用空格作为标记，拆分关键词
        console.log("分词后效果", keywordArray)
        if (content.indexOf('开启了朋友验证') > -1 || contact.name() === '朋友推荐消息') { // 防止重复发送消息
            console.log('无需回复')
        } else if (content.indexOf('你已添加') > -1) { // 初始添加好友后提醒
            await utils.utils.delay(2000)
            contact.say('1、回复关键词“加群”<br>2、或回复“提醒 我 18:30 下班回家”，创建你的专属提醒<br>3、如试用过程中遇到问题，可回复关键词“联系作者”添加作者微信，此账号为机器人小号，不做任何回复<br>4、作者最新文章:《koa+mongodb打造掘金关注者分析面板》https://juejin.im/post/5cdac2dff265da0354032e8a<br>更多功能查看<a href="https://juejin.im/post/5ca1dd846fb9a05e6c77b72f">https://juejin.im/post/5ca1dd846fb9a05e6c77b72f</a>')
        } else if (content.indexOf('加群') > -1 || content.indexOf('微信每日说') > -1) {
            if (meiri) {
                try {
                    await utils.utils.delay(2000)
                    contact.say('小助手正在处理你的入群申请，请不要重复回复...')
                    await utils.utils.delay(10000)
                    await meiri.add(contact)
                } catch (e) {
                    console.error(e)
                }
            }
        } else if (keywordArray[0] === "提醒") {
            if (keywordArray.length > 3) {
                let scheduleObj = utils.contentDistinguish(contact, keywordArray)
                if (keywordArray[2] === '每天') {
                    if (keywordArray[3].indexOf(':') > -1 || keywordArray[3].indexOf('：') > -1) {
                        addSchedule(scheduleObj)
                        await utils.utils.delay(2000)
                        contact.say('小助手已经把你的提醒牢记在小本本上了')
                    } else {
                        await utils.utils.delay(2000)
                        contact.say('每日提醒设置失败，请保证每个关键词之间使用空格分割开。正确格式为：“提醒(空格)我(空格)每天(空格)18:30(空格)下班回家”')
                    }
                } else {
                    console.log('日期格式', scheduleObj.time, '结果', utils.isRealDate(scheduleObj.time))
                    let isTime = utils.isRealDate(scheduleObj.time)
                    if (isTime) {
                        addSchedule(scheduleObj)
                        await utils.utils.delay(2000)
                        contact.say('小助手已经把你的提醒牢记在小本本上了')
                    } else {
                        await utils.utils.delay(2000)
                        contact.say('提醒设置失败，请保证每个关键词之间使用空格分割开，并保证日期格式正确。正确格式为：“提醒(空格)我(空格)18:30(空格)下班回家”')
                    }
                }
            } else {
                await utils.utils.delay(2000)
                contact.say('提醒设置失败，请保证每个关键词之间使用空格分割开，并保证日期格式正确。正确格式为：“提醒(空格)我(空格)18:30(空格)下班回家”')
            }
        } else if (content && (content.indexOf('你好') > -1)) {
            await utils.utils.delay(2000)
            contact.say('你好，很高兴成为你的小秘书，来试试我的新功能吧！回复案例：“提醒 我 18:30 下班回家”，创建你的专属提醒，记得关键词之间使用空格分隔开')
        } else if (content && (content.indexOf('联系作者') > -1)) {
            console.log('联系作者')
            const auth = FileBox.fromFile('./static/auth.png') //添加本地文件
            await contact.say(auth)
            await utils.utils.delay(2000)
            contact.say('微信号：CG12104410')
        } else if (content && (content.indexOf('帮助') > -1)) {
            await utils.utils.delay(2000)
            contact.say('1、回复关键词“加群”<br>2、或回复“提醒 我 18:30 下班回家”，创建你的专属提醒<br>3、如试用过程中遇到问题，可回复关键词“联系作者”添加作者微信，此账号为机器人小号，不做任何回复<br>4、作者最新文章:《koa+mongodb打造掘金关注者分析面板》https://juejin.im/post/5cdac2dff265da0354032e8a<br>更多功能查看<a href="https://juejin.im/post/5ca1dd846fb9a05e6c77b72f">https://juejin.im/post/5ca1dd846fb9a05e6c77b72f</a>')
        } else {
            if (day.AUTOREPLY) {
				      let reply
              if(day.DEFAULTBOT=='0'){
                reply = await utils.getReply(content)
                console.log('天行机器人回复：', reply)
              }else if(day.DEFAULTBOT=='1'){
                reply = await utils.getTuLingReply(content)
                console.log('图灵机器人回复：', reply)
              }
                try {
                    await utils.utils.delay(2000)
                    await contact.say(reply)
                } catch (e) {
                    console.error(e)
                }
            } else {
                await utils.utils.delay(2000)
                await contact.say('主人没有开启自动聊天模式，我不敢随便说话的！')
                await utils.delay(2000)
                contact.say('1、回复关键词“加群”<br>2、或回复“提醒 我 18:30 下班回家”，创建你的专属提醒<br>3、如试用过程中遇到问题，可回复关键词“联系作者”添加作者微信，此账号为机器人小号，不做任何回复<br>4、作者最新文章:《koa+mongodb打造掘金关注者分析面板》https://juejin.im/post/5cdac2dff265da0354032e8a<br>更多功能查看<a href="https://juejin.im/post/5ca1dd846fb9a05e6c77b72f">https://juejin.im/post/5ca1dd846fb9a05e6c77b72f</a>')
            }
        }
    }
}


const bot = new Wechaty({ name: 'WechatEveryDay', profile: config.default.DEFAULT_PROFILE, })
bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)
bot.on('friendship', onFriendShip)
bot.on('room-join', roomJoin)
bot.start()
    .then(() => { console.log('开始登陆微信') })
    .catch(e => console.error(e))