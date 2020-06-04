const express = require('express')

const log = console.log.bind(console)
const app = express()

app.get('/helloworld', (request, response) => {
    response.send('hello')
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
