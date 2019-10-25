;(function () {
    var app = new Vue({
        el: '#app',
        data() {
            return {
                title: '小助手',
                dayListInit: {name: '', alias: '', memorialDay: '', city: '', endWord: '', cycle: 'day', day: '1', time: ''},
                roomListInit: {roomName: '', sortId: '', endWord: '', cycle: 'day', day: '1', time: ''},
                roomJoinListInit: {name: '', welcome: ''},
                keyWordListInit: {key: '', reply: ''},
                addRoomKeyListInit: {key: '', roomName: ''},
                eventKeywordListInit: {key: '', position: '', event: ''},
                newList: {
                    5: '社会新闻',
                    7: '国内新闻',
                    8: '国际新闻',
                    10: '娱乐新闻',
                    11: '美女图片',
                    12: '体育新闻',
                    13: '科技新闻',
                    14: '奇闻异事',
                    17: '健康知识',
                    18: '旅游资讯',
                    38: '汉服新闻',
                    37: '房产新闻',
                    36: '科学探索',
                    35: '汽车新闻',
                    34: '互联网资讯',
                    33: '动漫资讯',
                    32: '财经新闻',
                    31: '游戏资讯',
                    30: 'CBA新闻',
                    29: '人工智能',
                    28: '区块链新闻',
                    27: '军事新闻',
                    26: '足球新闻',
                    24: '创业新闻',
                    23: '移动互联',
                    22: 'IT资讯',
                    21: 'VR科技'
                },
                position: {
                    end: "从结尾开始匹配",
                    start: "从头开始匹配",
                    middle: '任意位置匹配'
                },
                eventList: {
                    rubbish: '垃圾类型',
                    mingyan: '名人名言',
                    star: '星座运势',
                    xing: '姓氏起源',
                    lunar: '老黄历查询',
                    goldreply: '神回复',
                    rkl: '绕口令',
                    skl: '顺口溜',
                    avatar: '我要国旗',
                    emo: '获取表情包',
                    meinv: '获取美女图'
                },
                formData: {
                    AUTOREPLY: false, // 是否设置机器人自动回复，默认关闭 false  开启为 true
                    DEFAULTBOT: '1', // 默认机器人 0 天行机器人 1 天行对接的图灵机器人 2 图灵机器人
                    TULINGKEY: '1065ca6daa614c12b15d730f3a2b33dd', //图灵机器人KEY
                    TXAPIKEY: '036ca1b5371d6ffc668a05fce44a2d7c',// 天行数据key
                    DAYLIST: [
                        {
                            name: '嗯哼',
                            alias: 'A兔子',
                            memorialDay: '2015/04/18',
                            city: '上海',
                            endWord: '最爱你的庚',
                            date: '0 10 8 * * *'
                        },
                    ],
                    ROOMLIST: [
                        {roomName: '微信每日说', sortId: 22, endWord: '小助手雷欧', date: '0 0 8 * * *'},
                    ],
                    ACCEPTFRIEND: [],
                    ROOMJOINLIST: [
                        {name: '微信每日说', welcome: '有什么问题都可以群里提出，大家都是很热情的'},
                    ],
                    KEYWORDLIST: [{key: ['你好', '您好'], reply: '你好啊，我是小助手雷欧'}],
                    NEWFRIENDREPLY: "1、回复关键词“加群”<br>2、或回复“提醒 我 18:30 下班回家”，创建你的专属提醒<br>3、如试用过程中遇到问题，可回复关键词“联系作者”添加作者微信，此账号为机器人小号，不做任何回复<br>更多功能查看https://github.com/gengchen528/wechat-assistant",
                    ADDROOMKEYLIST: [
                        {key: ['加群', '微信每日说'], roomName: '微信每日说'},
                    ],
                    EVENTKEYWORDLIST: [
                        {key: '?', position: 'start', event: 'rubbish'}
                    ],
                }
            }
        },
        mounted() {
            this.initDate()
            this.getConfig()
        },
        methods: {
            deepCopy(fromObj,toObj){
                // 容错
                if(fromObj === null) return null // 当fromObj为null
                if(fromObj instanceof RegExp) return new RegExp(fromObj) // 当fromObj为正则
                if(fromObj instanceof Date) return new Date(fromObj) // 当fromObj为Date

                toObj = toObj || {}

                for(let key in fromObj){ // 遍历
                    if(typeof fromObj[key] !== 'object'){ // 是否为对象
                        toObj[key] = fromObj[key] // 如果为普通值，则直接赋值
                    }else{
                        if(fromObj[key] === null){
                            toObj[key] = null
                        }else{
                            toObj[key] = new fromObj[key].constructor // 如果为object，则new这个object指向的构造函数
                            deepCopy(fromObj[key],toObj[key]) // 递归
                        }
                    }
                }
                return toObj
            },
            initTask(type){
                let that = this
                let obj = {
                    dayListInit: {name: '', alias: '', memorialDay: '', city: '', endWord: '', cycle: 'day', day: '1', time: ''},
                    roomListInit: {roomName: '', sortId: 0, endWord: '', cycle: 'day', day: '1', time: ''},
                    roomJoinListInit: {name: '', welcome: ''},
                    keyWordListInit: {key: '', reply: ''},
                    addRoomKeyListInit: {key: '', roomName: ''},
                    eventKeywordListInit: {key: '', position: '', event: ''},
                }
                that[type]=obj[type]
            },
            filterWeek(num) {
                let weekList = {
                    0: '日',
                    1: '一',
                    2: '二',
                    3: '三',
                    4: '四',
                    5: '五',
                    6: '六',
                    7: '日',
                }
                return weekList[num]
            },
            convertToFormat(cycle, time, day) {
                let timeArray = time.split(':')
                let cycleTime = ''
                if (cycle == 'day') {
                    cycleTime = `${timeArray[2]} ${timeArray[1]} ${timeArray[0]} * * *`
                } else if (cycle == 'week') {
                    cycleTime = `${timeArray[2]} ${timeArray[1]} ${timeArray[0]} * * ${day}`
                } else if (cycle == 'month') {
                    cycleTime = `${timeArray[2]} ${timeArray[1]} ${timeArray[0]} ${day} * *`
                }
                return cycleTime
            },
            convertFormatToDate(cycle) {
                let arr = cycle.split(' ')
                let time = `${arr[2]}:${arr[1]}:${arr[0]}`
                if (arr[3] !== '*') {
                    return `每月${arr[3]}号 ${time}`
                } else if (arr[5] !== '*') {
                    return `每周${this.filterWeek(arr[5])} ${time}`
                } else {
                    return `每天 ${time}`
                }
            },
            initDate() {
                let that = this
                laydate.render({
                    elem: '#memorial', //指定元素
                    format: 'yyyy/MM/dd',
                    value:'',
                    done: function(value, date, endDate){
                        that.dayListInit.memorialDay = value
                    }
                })
                laydate.render({
                    elem: '#cycle-date', //指定元素
                    type: 'time',
                    value:'',
                    done: function(value, date, endDate){
                       that.dayListInit.time = value
                    }
                })
                laydate.render({
                    elem: '#cycle-date-room', //指定元素
                    type: 'time',
                    value:'',
                    done: function(value, date, endDate){
                        that.roomListInit.time = value
                    }
                })
            },
            getConfig() {
                let req = {}
                axios.get('/api/getConfig', req).then(res => {
                    console.log(res.data.data);

                })
            },
            addDayTask(type,to) {
                let that = this
                let dayTask = that[type]
                let obj = {
                    ...dayTask,
                    date: that.convertToFormat(dayTask.cycle, dayTask.time, dayTask.day)
                }
                that.formData[to].push(obj)
                that.initTask(type)
            },
            deleteItem(index,type) {
                let that = this
                that.formData[type].splice(index,1)
            }
        }
    })
}());
