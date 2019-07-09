const Assistant = require('./schema')

module.exports = {
    insert: (conditions) => { // 添加定时任务
        return new Promise((resolve, reject) => {
            Assistant.create(conditions, (err, doc) => {
                if (err) return reject(err)
                console.log('创建成功', doc)
                return resolve(doc)
            })
        })
    },

    find: (conditions) => { // 获取定时任务列表
        return new Promise((resolve, reject) => {
            Assistant.find(conditions, (err, doc) => {
                if (err) return reject(err)
                return resolve(doc)
            })
        })
    },
    update: (conditions) => { // 更新定时任务状态
        return new Promise((resolve, reject) => {
            Assistant.updateOne(conditions, { hasExpired: true }, (err, doc) => {
                if (err) return reject(err)
                return resolve(doc)
            })
        })
    }
}