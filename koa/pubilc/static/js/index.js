;(function(){
    var app = new Vue({
        el:'#app',
        data(){
            return {
                title:'小助手',
                dayListInit:{
                    name:'',
                    alias:'',
                    memorialDay:'',
                    city:'',
                    endWord:'',
                    date:''
                },
                roomListInit:{roomName:'',sortId:0,endWord:'',date:''},
                roomListInit:{roomName:'',sortId:0,endWord:'',date:''},
                formData:{
                    AUTOREPLY: true, // 是否设置机器人自动回复，默认关闭 false  开启为 true
                    DEFAULTBOT: '1', // 默认机器人 0 天行机器人 1 天行对接的图灵机器人 2 图灵机器人
                    TULINGKEY: '1065ca6daa614c12b15d730f3a2b33dd', //图灵机器人KEY
                    TXAPIKEY: '036ca1b5371d6ffc668a05fce44a2d7c',// 天行数据key
                    DAYLIST: [
                        {name:'嗯哼',alias:'A兔子',memorialDay:'2015/04/18',city:'上海',endWord:'最爱你的庚',date:'0 10 8 * * *'},
                    ],
                    ROOMLIST: [
                        {roomName:'微信每日说',sortId:22,endWord:'小助手雷欧',date:'0 0 8 * * *'},
                    ],
                    ACCEPTFRIEND: [],
                    ROOMJOINLIST: [
                        {name:'微信每日说',welcome:'有什么问题都可以群里提出，大家都是很热情的'},
                    ],
                    KEYWORDLIST:[{key:['你好','您好'],reply:'你好啊，我是小助手雷欧'}],
                    NEWFRIENDREPLY: "1、回复关键词“加群”<br>2、或回复“提醒 我 18:30 下班回家”，创建你的专属提醒<br>3、如试用过程中遇到问题，可回复关键词“联系作者”添加作者微信，此账号为机器人小号，不做任何回复<br>更多功能查看https://github.com/gengchen528/wechat-assistant",
                    ADDROOMKEYLIST:[
                        {key:['加群','微信每日说'],roomName:'微信每日说'},
                    ],
                    EVENTKEYWORDLIST:[
                        {key:'?',position:'start',event:'rubbish'}
                    ],
                }
            }
        },
        mounted(){
            this.getConfig()
        },
        methods:{
            getConfig(){
                let req = {}
                axios.get('/api/getConfig',req).then(res=>{
                    console.log(res.data.data);
                    
                })
            },
            addDayTask(){

            },
            deleteDayTask(){

            }
        }
    })
}());
