const { Wechaty, Friendship, config, log } = require('wechaty')
const schedule = require('./config/schedule')
const { FileBox } = require('file-box')
const Qrterminal = require('qrcode-terminal')
const { request } = require('./config/superagent')
const untils = require('./untils/index')
const host = 'http://127.0.0.1:3008/api'
const day = require('./config/day')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// 微信每日说配置
initDay = async() => {
    let logMsg
    let contact = await bot.Contact.find({ name: day.NICKNAME }) || await bot.Contact.find({ alias: day.NAME }) // 获取你要发送的联系人
    let one = await untils.getOne() //获取每日一句
    let weather = await untils.getWeather() //获取天气信息
    let today = await untils.formatDate(new Date()) //获取今天的日期
    let memorialDay = untils.getDay(day.MEMORIAL_DAY) //获取纪念日天数
    let str = today + '<br>我们在一起的第' + memorialDay + '天<br>' + '<br>元气满满的一天开始啦,要开心噢^_^<br>' +
        '<br>今日天气<br>' + weather.weatherTips + '<br>' + weather.todayWeather + '<br>每日一句:<br>' + one + '<br><br>' + '————————最爱你的我'
    try {
        logMsg = str
        await contact.say(str) // 发送消息
    } catch (e) {
        logMsg = e.message
    }
    console.log(logMsg)
}

// 每次登录初始化定时任务
initSchedule = async(list) => {
    try {
        for (item of list) {
            let time = item.isLoop ? item.time : new Date(item.time)
            schedule.setSchedule(time, async() => {
                let contact = await bot.Contact.find({ name: item.subscribe })
                console.log('你的专属提醒开启啦！')
                await contact.say(item.content)
                if (!item.isLoop) {
                    request(host + '/updateSchedule', 'POST', '', { id: item._id }).then((result) => {
                        console.log('更新定时任务成功')
                    }).catch(err => {
                        console.log('更新错误', err)
                    })
                }
            })
        }
        // 登陆后初始化微信每日说
        schedule.setSchedule(day.SENDDATE, async() => {
            console.log('微信每日说开始工作了！')
            initDay()
        })
    } catch (err) {
        console.log('初始化定时任务失败', err)
    }
}

// 二维码生成
onScan = (qrcode, status) => {
    Qrterminal.generate(qrcode)
    const qrImgUrl = ['https://api.qrserver.com/v1/create-qr-code/?data=', encodeURIComponent(qrcode)].join('')
    console.log(qrImgUrl)
}

// 登录事件·
onLogin = async(user) => {
    console.log(`贴心助理${user}登录了`)
    request(host + '/getScheduleList', 'GET').then((res) => {
        let text = JSON.parse(res.text)
        let scheduleList = text.data
        console.log('定时任务列表', scheduleList)
        initSchedule(scheduleList)
    }).catch(err => {
        console.log('获取任务列表错误', err)
    })
}

// 登出事件
onLogout = (user) => {
    console.log(`${user} 登出了`)
}

// 消息监听
onMessage = async(msg) => {
    const contact = msg.from()
    const content = msg.text()
    const room = msg.room()
    const meiri = await bot.Room.find({ topic: '微信每日说' })
    if (msg.self()) return
    if (room) {
        const roomName = await room.topic()
        console.log(`群名: ${roomName} 发消息人: ${contact.name()} 内容: ${content}`)
    } else {
        console.log(`发消息人: ${contact.name()} 消息内容: ${content}`)

        let keywordArray = content.replace(/\s+/g, ' ').split(" ") // 把多个空格替换成一个空格，并使用空格作为标记，拆分关键词
        console.log("分词后效果", keywordArray)
        if (content.indexOf('开启了朋友验证') > -1 || contact.name() === '朋友推荐消息') { // 防止重复发送消息
            console.log('无需回复')
        } else if (content.indexOf('你已添加') > -1) { // 初始添加好友后提醒
            await delay(2000)
            contact.say('1、回复关键词“加群”<br>2、或回复“提醒 我 18:30 下班回家”，创建你的专属提醒<br>3、如试用过程中遇到问题，可回复关键词“联系作者”添加作者微信，此账号为机器人小号，不做任何回复<br>4、作者最新文章:《koa+mongodb打造掘金关注者分析面板》https://juejin.im/post/5cdac2dff265da0354032e8a<br>更多功能查看<a href="https://juejin.im/post/5ca1dd846fb9a05e6c77b72f">https://juejin.im/post/5ca1dd846fb9a05e6c77b72f</a>')
        } else if (content.indexOf('加群') > -1 || content.indexOf('微信每日说') > -1) {
            if (meiri) {
                try {
                    await delay(2000)
                    contact.say('小助手正在处理你的入群申请，请不要重复回复...')
                    await delay(10000)
                    await meiri.add(contact)
                } catch (e) {
                    console.error(e)
                }
            }
        } else if (keywordArray[0] === "提醒") {
            if (keywordArray.length > 3) {
                let scheduleObj = untils.contentDistinguish(contact, keywordArray)
                if (keywordArray[2] === '每天') {
                    if (keywordArray[3].indexOf(':') > -1 || keywordArray[3].indexOf('：') > -1) {
                        addSchedule(scheduleObj)
                        await delay(2000)
                        contact.say('小助手已经把你的提醒牢记在小本本上了')
                    } else {
                        await delay(2000)
                        contact.say('每日提醒设置失败，请保证每个关键词之间使用空格分割开。正确格式为：“提醒(空格)我(空格)每天(空格)18:30(空格)下班回家”')
                    }
                } else {
                    console.log('日期格式', scheduleObj.time, '结果', untils.isRealDate(scheduleObj.time))
                    let isTime = untils.isRealDate(scheduleObj.time)
                    if (isTime) {
                        addSchedule(scheduleObj)
                        await delay(2000)
                        contact.say('小助手已经把你的提醒牢记在小本本上了')
                    } else {
                        await delay(2000)
                        contact.say('提醒设置失败，请保证每个关键词之间使用空格分割开，并保证日期格式正确。正确格式为：“提醒(空格)我(空格)18:30(空格)下班回家”')
                    }
                }
            } else {
                await delay(2000)
                contact.say('提醒设置失败，请保证每个关键词之间使用空格分割开，并保证日期格式正确。正确格式为：“提醒(空格)我(空格)18:30(空格)下班回家”')
            }
        } else if (content && (content.indexOf('你好') > -1)) {
            await delay(2000)
            contact.say('你好，很高兴成为你的小秘书，来试试我的新功能吧！回复案例：“提醒 我 18:30 下班回家”，创建你的专属提醒，记得关键词之间使用空格分隔开')
        } else if (content && (content.indexOf('联系作者') > -1)) {
            console.log('联系作者')
            const auth = FileBox.fromFile('./static/auth.png') //添加本地文件
            await contact.say(auth)
            await delay(2000)
            contact.say('微信号：CG12104410')
        } else if (content && (content.indexOf('帮助') > -1)) {
            await delay(2000)
            contact.say('1、回复关键词“加群”<br>2、或回复“提醒 我 18:30 下班回家”，创建你的专属提醒<br>3、如试用过程中遇到问题，可回复关键词“联系作者”添加作者微信，此账号为机器人小号，不做任何回复<br>4、作者最新文章:《koa+mongodb打造掘金关注者分析面板》https://juejin.im/post/5cdac2dff265da0354032e8a<br>更多功能查看<a href="https://juejin.im/post/5ca1dd846fb9a05e6c77b72f">https://juejin.im/post/5ca1dd846fb9a05e6c77b72f</a>')
        } else {
            if (day.AUTOREPLY) {
                let reply = await untils.getReply(content)
                console.log('天行机器人回复：', reply)
                try {
                    await delay(2000)
                    await contact.say(reply)
                } catch (e) {
                    console.error(e)
                }
            } else {
                await delay(2000)
                await contact.say('主人没有开启自动聊天模式，我不敢随便说话的！')
                await delay(2000)
                contact.say('1、回复关键词“加群”<br>2、或回复“提醒 我 18:30 下班回家”，创建你的专属提醒<br>3、如试用过程中遇到问题，可回复关键词“联系作者”添加作者微信，此账号为机器人小号，不做任何回复<br>4、作者最新文章:《koa+mongodb打造掘金关注者分析面板》https://juejin.im/post/5cdac2dff265da0354032e8a<br>更多功能查看<a href="https://juejin.im/post/5ca1dd846fb9a05e6c77b72f">https://juejin.im/post/5ca1dd846fb9a05e6c77b72f</a>')
            }
        }
    }
}

// 添加定时提醒
addSchedule = async(obj) => {
    request(host + '/addSchedule', 'POST', '', obj).then(async(res) => {
        res = JSON.parse(res.text)
        let nickName = res.data.subscribe
        let time = res.data.time
        let Rule1 = res.data.isLoop ? time : new Date(time)
        let content = res.data.content
        let contact = await bot.Contact.find({ name: nickName })
        schedule.setSchedule(Rule1, async() => {
            console.log('你的专属提醒开启啦！')
            await delay(10000)
            await contact.say(content)
            if (!res.data.isLoop) {
                request(host + '/updateSchedule', 'POST', '', { id: res.data._id }).then((result) => {
                    console.log('更新定时任务成功')
                }).catch(err => {
                    console.log('更新错误', err)
                })
            }
        })
    }).catch(err => {
        console.log('错误', err)
    })
}

// 自动加好友
onFriendShip = async(friendship) => {
    let logMsg
    try {
        logMsg = '添加好友' + friendship.contact().name()
        console.log(logMsg)
        switch (friendship.type()) {
            /**
             *
             * 1. New Friend Request
             *
             * when request is set, we can get verify message from `request.hello`,
             * and accept this request by `request.accept()`
             */
            case Friendship.Type.Receive:
                await delay(60000) // 延时1分钟后同意好友
                await friendship.accept()
                break
                /**
                 *
                 * 2. Friend Ship Confirmed
                 *
                 */
            case Friendship.Type.Confirm:
                logMsg = 'friend ship confirmed with ' + friendship.contact().name()
                break
        }
    } catch (e) {
        logMsg = e.message
    }
    console.log(logMsg)
}

// 加群提醒
function roomJoin(room, inviteeList, inviter) {
    const nameList = inviteeList.map(c => c.name()).join(',')
    room.topic().then(function(res) {
        const roomNameReg = eval(day.ROOMNAME)
        if (roomNameReg.test(res)) {
            console.log(`群名： ${res} ，加入新成员： ${nameList}, 邀请人： ${inviter}`)
            room.say(`${res}：欢迎新朋友 @${nameList}，<br>使用过程中有什么问题都可以在群里提出`)
        }
    })
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