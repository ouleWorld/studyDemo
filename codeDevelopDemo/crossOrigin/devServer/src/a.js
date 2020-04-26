const log = console.log.bind(console)

// const ajax = (method, url, data, headers, callback) => {
//     let r = new XMLHttpRequest()
//     r.open(method, url, true)
//
//     // 设置 headers
//     Object.entries(headers).forEach(([k, v]) => {
//         r.setRequestHeader(k, v)
//     })
//     r.onload = () => {
//         log('r', r.response)
//     }
//     if (method === 'POST') {
//         data = JSON.stringify(data)
//     }
//     r.send(data)
// }

const ajax = (method, url, data) => {
    let r = new XMLHttpRequest()
    r.open(method, url, true)
    r.setRequestHeader('Content-Type', 'application/json')
    r.onload = () => {
        log('r', r.response)
    }
    r.onerror = () => {

    }
    r.send(data)
}

const bindEvent = () => {
    let ele = document.querySelector('.ajaxButton')
    ele.addEventListener('click', function () {
        let url = '/api/todos'
        let method = 'GET'
        let data = ''
        ajax(method, url, data)
    })
}

const __main = () => {
    bindEvent()
}

__main()