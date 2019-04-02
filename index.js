const { Wechaty, Friendship } = require('wechaty')
const schedule = require('./config/schedule')
const { FileBox } = require('file-box')
const Qrterminal = require('qrcode-terminal')
const { request } = require('./config/superagent')
const untils = require('./untils/index')
const host = 'http://127.0.0.1:3008/api'

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

// 登录事件
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
    if (msg.self()) return
    if (room) {
        const roomName = await room.topic()
        console.log(`群名: ${roomName} 发消息人: ${contact.name()} 内容: ${content}`)
    } else {
        console.log(`发消息人: ${contact.name()} 消息内容: ${content}`)

        let keywordArray = content.replace(/\s+/g, ' ').split(" ") // 把多个空格替换成一个空格，并使用空格作为标记，拆分关键词
        console.log("分词后效果", keywordArray)
        if (keywordArray[0] === "提醒") {
            let scheduleObj = untils.contentDistinguish(contact, keywordArray)
            addSchedule(scheduleObj)
            contact.say('小助手已经把你的提醒牢记在小本本上了')
        } else if (content && content.indexOf('你好') > -1) {
            contact.say('你好，很高兴成为你的小秘书，来试试我的新功能吧！回复案例：“提醒 我 18:30 下班回家”，创建你的专属提醒，记得关键词之间使用空格分隔开')
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
            await contact.say(content)
            if (!res.isLoop) {
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
const bot = new Wechaty({ name: 'WechatEveryDay' })
bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)
bot.on('friendship', onFriendShip)
bot.start()
    .then(() => { console.log('开始登陆微信') })
    .catch(e => console.error(e))