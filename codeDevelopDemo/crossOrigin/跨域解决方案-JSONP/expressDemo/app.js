const express = require('express')

const log = console.log.bind(console)
const app = express()

app.get('/api/getuserinfo/jsonp', (request, response) => {
    let query = request.query
    let callback = query.callback
    let name = 'oulae'
    // 获取数据, 通过 jsonp 的方式传给前端
    let s = `${callback}('${name}')`
    response.send(s)
})

const main = () => {
    let server = app.listen(2300, () => {
        let host = server.address().address
        let port = server.address().port

        log(`应用实例，访问地址为 http://${host}:${port}`)
    })
}

if (require.main === module) {
    main()
}