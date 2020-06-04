const _ajax = (method, url, data) => {
    let p = new Promise((resolve, reject) => {
        // Fetch API
        // axios
        let r = new XMLHttpRequest()
        r.open(method, url, true)
        r.setRequestHeader('Content-Type', 'application/json')
        r.onreadystatechange = () => {
            if (r.readyState === 4) {
                if (r.status === 200) {
                    let response = JSON.parse(r.response)
                    resolve(response)
                } else {
                    reject({
                        success: false,
                    })
                }
            }
        }
        r.send(data)
    })
    return p
}

class Ajax {
    constructor(baseUrl) {
        // 定义统一的接口，这样后面就可以直接引用了；后期如果需要更改这样也容易改
        this.baseUrl = baseUrl || 'http://localhost:8000/'
        // console.log(this.baseUrl)
    }
    get(path) {
        let url = this.baseUrl + path
        console.log(url)
        return _ajax('GET', url, '')
    }

    post(path, data) {
        let url = this.baseUrl + path
        data = JSON.stringify(data)
        return _ajax('POST', url, data)
    }
}

export default Ajax