import IpApi from '../api/IpApi'
import Model from './Model'

class IpModel extends Model{
    constructor() {
        super()
        this.api = new IpApi()
    }

    getIp() {
        let p = this.api.getIp()
        return p.then((ip) => {
            return ip.origin
        })
    }
}

export default IpModel