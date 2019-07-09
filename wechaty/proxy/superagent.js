const superagent = require('superagent')

req = (url, method, params, data, cookies) => {
    return new Promise((resolve, reject) => {
        superagent(method, url)
            .query(params)
            .send(data)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .end((err, res) => {
                if (err) reject(err)
                resolve(res)
            })
    })
}

module.exports = { req }