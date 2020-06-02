import Api from './api'

class TodoApi extends Api {
    constructor() {
        super()
        // 右边的 this.baseUrl 是父类 Api 里面的 baseUrl
        // 左边的 this.baseUrl 是当前类 TodoApi 的 baseUrl
        this.baseUrl = this.baseUrl + '/todo'
    }
    all() {
        let path = '/all'
        return this.get(path)
    }
}

export default TodoApi
