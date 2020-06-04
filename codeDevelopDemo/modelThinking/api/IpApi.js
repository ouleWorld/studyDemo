import Api from './api'

class IpApi extends Api {
    constructor(props) {
        super('https://httpbin.org/ip');
    }

    getIp() {
        return this.get('')
    }
}

export default IpApi