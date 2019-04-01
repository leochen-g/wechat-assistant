const Assistant = require('./schema')

module.exports = {
    insert: (conditions) => {
        return new Promise((resolve, reject) => {
            Assistant.create(conditions, (err, doc) => {
                if (err) return reject(err)
                console.log('创建成功', doc)
                return resolve(doc)
            })
        })
    },

    find: (conditions) => {
        return new Promise((resolve, reject) => {
            Assistant.find(conditions, (err, doc) => {
                if (err) return reject(err)
                return resolve(doc)
            })
        })
    },
    update: (conditions) => {
        return new Promise((resolve, reject) => {
            Assistant.updateOne(conditions, { hasExpired: true }, (err, doc) => {
                if (err) return reject(err)
                return resolve(doc)
            })
        })
    }
}