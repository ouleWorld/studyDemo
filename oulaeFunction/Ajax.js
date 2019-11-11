const ajax = (request) => {
    // request.method: 请求的方法
    // request.path: 请求的路径
    // request.data: 需要发送的数据
    // request.contentType: 请求的头部文件
    // request.callback: 回调函数
    // request.asynchronousJudge: 是否为异步请求，true 表示异步请求，false 表示同步请求
    let r = new XMLHttpRequest()
    r.open(request.method, request.path, request.asynchronousJudge)
    if (request.contentType !== undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = () => {
        if (r.readyState === 4) {
            request.callback(r.response)
        }
    }
    // console.log(request.data)
    r.send(request.data)
}

const ajaxPromise = (request) => {
    // request.method: 请求的方法
    // request.path: 请求的路径
    // request.data: 需要发送的数据
    // request.contentType: 请求的头部文件
    // request.callback: 回调函数
    // request.asynchronousJudge: 是否为异步请求，true 表示异步请求，false 表示同步请求
    let p = new Promise((resolve, reject) => {
        let r = new XMLHttpRequest()
        r.open(request.method, request.url, true)
        if (request.contentType !== undefined) {
            r.setRequestHeader('Content-Type', request.contentType)
        }
        // 除了监听 readystatechange 事件, 也可以监听 load 事件
        // 除了调用 request.callback, 还会调用 resolve, 就是 promise 处理成功之后会调用 resolve
        // 这样可以使用两种方式来处理 ajax
        r.addEventListener('load', () => {
            request.callback(r.response)
            // 这里抛出一个返回值，后面的 Promise.all()可以用到
            resolve(r.response)
        })
        if (request.method == 'GET') {
            r.send()
        } else {
            r.send(request.data)
        }

    })
    return p
}

class Ajax {
    constructor() {
        // 定义统一的接口，这样后面就可以直接引用了；后期如果需要更改这样也容易改
        this.baseUrl = 'http://localhost:8000/'
    }
    get(path, callback) {
        let url = this.baseUrl + path
        ajax('GET', url, '', (r) => {
            let t = JSON.parse(r)
            // console.log(t)
            callback(t)
        })
    }

    post(path, data, callback) {
        let url = this.baseUrl + path
        data = JSON.stringify(data)
        ajax('POST', url, data, (r) => {
            let t = JSON.parse(r)
            callback(t)
        })
    }
}

export default Ajax
