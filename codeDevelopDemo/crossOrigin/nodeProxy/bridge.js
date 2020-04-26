const http = require('http')
const https = require('https')
const fs = require('fs')
const url = require('url')

const express = require('express')
const bodyParser = require('body-parser')

const SERVER = require('./server.config').server
const log = console.log.bind(console)

const app = express()
app.use(express.static('proxy'))
app.use(bodyParser.json())

const clientByProtocol = (protocol) => {
    if (protocol === 'http:') {
        return http
    } else {
        return https
    }
}

const httpOptions = (request) => {
    let server = SERVER
    // 把 server 网址解析成一个 url 对象, 方便发请求的时候使用
    let o = url.parse(server)
    log('o: ', o)
    // 把浏览器发送的请求的 headers 全部添加到 options 中,
    // 避免出现漏掉某些关键 headers(如 transfer-encoding, connection 等) 导致出 bug 的情况
    let headers = Object.assign({}, request.headers)
    // 组合成最终发送的请求格式
    let options = Object.assign({}, {
        headers: headers,
    }, o)
    options.method = request.method
    // request.originalUrl 不仅包含 path, 还包含 query string
    options.path = request.originalUrl
    return options
}

// 当访问主页时, 返回对应的HTML 内容
app.get('/', (request, response) => {
    log('here')
    fs.readFile('index.html', 'utf8', (error, data) => {
        response.set('Content-Type', 'text/html; charset=UTF-8')
        response.send(data)
    })
})

// 将服务器的响应转发至浏览器
const sendResponseToClient = (httpResponse, expressResponse) => {
    // 有两个响应对象, 一个是 http 响应对象, 另一个是 express 响应对象
    let r = httpResponse
    let response = expressResponse

    // 设置响应对象的状态码和头部字段
    response.status(r.statusCode)
    Object.entries(r.headers).forEach(([k, v]) => {
        response.setHeader(k, v)
    })
    // 当接收到数据的时候触发 data 事件, 然后把数据发送给客户端
    r.on('data', (chunk) => {
        response.send(chunk)
    })
    // 数据发送完成时触发 end 事件, express 对象告诉客户端数据发送完毕
    r.on('end', () => {
        response.end()
    })
    // 往客户端发送数据的过程中出错
    r.on('error', () => {
        log('error to request')
    })
}

// 将浏览器发送过来的请求转发至服务器
const sendRequestToServer = (request, response) => {
    // 根据当前request 以及后端接口信息, 定义新的请求格式
    let options = httpOptions(request)
    // log('options: ', options)
    // 根据协议来选择用 http 模块还是 https 模块发送
    let client = clientByProtocol(options.protocol)

    // 使用http/https 定义请求
    let req = client.request(options, (res) => {
        // 收到 server 传过来的响应后, 把这个响应发送给客户端(也就是浏览器)
        sendResponseToClient(res, response)
    })
    // 监听 error 事件, 也就是往 server 发送请求的过程中发生错误会触发这个事件
    req.on('error', (e) => {
        log(`往 server(${request.url}) 发送请求报错`, e)
    })
    // 如果发送的请求方法不是 GET, 说明 request.body 有数据
    // 此时也要把数据发给 server
    if (options.method !== 'GET') {
        let body = request.body
        let chunk = JSON.stringify(body)
        req.write(chunk)
    }
    // 完成发送请求
    req.end()
}

// 拿到浏览器发送的以 /api/ 开头的请求, 这些请求表述数据请求, 需要转发至后端服务器
app.all('/api/*',(request, response) => {
    sendRequestToServer(request, response)
})

const run = (port, host) => {
    let server = app.listen(port, host, () => {
        let address = server.address()
        log(`listening ${address.address}, ${address.port}`)
    })
}

if (require.main === module) {
    let port = 3300
    let host = 'localhost'
    run(port, host)
}
