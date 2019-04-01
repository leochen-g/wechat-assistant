const mongoose = require("mongoose")

const db_url = 'mongodb://localhost:27017/wechatAssitant'
let db = mongoose.connect(db_url, { useNewUrlParser: true })

//连接成功
mongoose.connection.on('connect', () => {
    console.log("Mongoose connection open to " + db_url)
})

//连接异常
mongoose.connection.on('error', (err) => {
    console.log("Mongoose connection erro " + err);
});

//连接断开
mongoose.connection.on('disconnected', () => {
    console.log("Mongoose connection disconnected ");
});

module.exports = mongoose