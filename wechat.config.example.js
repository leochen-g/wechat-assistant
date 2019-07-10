// 本文件是配置案例文件，请拷贝一份此文件后重命名为config.js，否则项目无法运行
module.exports = {
    /**
     * 每日说定时任务（支持多人）
     * name:要发送好友的昵称 （注：不是微信号！不是微信号！不是微信号！）
     * alias:要发送好友的备注（默认查找备注优先，防止昵称带表情特殊字符）
     * memorialDay:你与朋友的纪念日
     * city:朋友所在城市，写的时候不要带‘市’
     * endWord:每日说内容的最后的落款 案例中效果为‘——————————爱你的朋友Leo_chen’
     * date:每天定时的发送时间，案例中代表每天早上8点钟，具体规则见‘wechaty/lib/index.js’ (多个好友不要设置相同时间！不要设置相同时间！不要设置相同时间！)
     */ 
    DAYLIST: [
      {name:'昵称1',alias:'备注1',memorialDay:'2015/04/18',city:'上海',endWord:'爱你的朋友Leo_chen',date:'0 0 8 * * *'},
      {name:'昵称2',alias:'备2',memorialDay:'2018/01/18',city:'上海',endWord:'爱你的朋友Leo_chen',date:'0 0 9 * * *'},
    ],

    /**
     * 群定时任务列表（支持多群配置）
     * roomName: 群名
     * sortId: 新闻资讯类别id （详情参见README.md数据字典）
     * endword: 结尾备注 ‘————————小助手雷欧’
     * date:每天定时的发送时间，案例中代表每天早上7点30分，具体规则见‘wechaty/lib/index.js’(多个群不要设置相同时间！不要设置相同时间！不要设置相同时间！)
     */
    ROOMLIST: [
      {roomName:'群名称1',sortId:22,endWord:'小助手雷欧',date:'0 30 7 * * *'},
      {roomName:'群名称2',sortId:22,endWord:'新闻后缀',date:'0 30 8 * * *'},
    ],

    ROOMNAME: '/^微信每日说/i', //群名(请只修改中文，不要删除符号，这是正则)
    TULINGKEY: '加群获取', // 天行对接的图灵机器人，众筹获取，具体详情加小助手后询问
    DEFAULTBOT: '0', // 默认机器人 0 天行机器人 1 天行对接的图灵机器人 2 图灵机器人
    AUTOREPLY: false // 是否设置机器人自动回复
}