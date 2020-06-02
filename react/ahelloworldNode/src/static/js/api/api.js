import axios from 'axios'

class Api {
    constructor(baseUrl) {
        this.baseUrl = baseUrl || 'http://localhost:8000/api'
    }
    get(path) {
        let url = this.baseUrl + path
        return axios.get(url).then(r => r.data)
    }
    post(path, data) {
        let url = this.baseUrl + path
        return axios.post(url, data).then(r => r.data)
    }
}

export default Api
