const superagent = require('superagent')

req = (url, method, params, data, cookies,contentType='application/x-www-form-urlencoded') => {
    return new Promise((resolve, reject) => {
        superagent(method, url)
            .query(params)
            .send(data)
            .set('Content-Type', contentType)
            .end((err, res) => {
                if (err) reject(err)
                resolve(res)
            })
    })
}

module.exports = { req }