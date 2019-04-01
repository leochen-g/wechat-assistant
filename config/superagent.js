const superagent = require('superagent')

request = (url, method, params, data, cookies) => {
    return new Promise((resolve, reject) => {
        superagent(method, url)
            .query(params)
            .send(data)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .end((err, res) => {
                if (err) reject(errr)
                resolve(res)
            })
    })
}

module.exports = { request }