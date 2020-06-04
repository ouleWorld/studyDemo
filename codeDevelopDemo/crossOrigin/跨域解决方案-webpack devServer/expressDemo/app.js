const express = require('express')

const log = console.log.bind(console)
const app = express()

// cors 模块用来解决跨域问题,只要声明了 cor，就说明该服务器允许跨域的访问
// const cors = require('cors')

// app.use(cors())

app.get('/helloworld', (request, response) => {
    log('触发了该事件')
    response.send('hello')
})

app.get('/singlecors', (request, response) => {
    response.set('Access-Control-Allow-Origin', '*')
    response.send('hello')
})

app.get('/api/todos', (request, response) => {
    response.send('request todos')
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