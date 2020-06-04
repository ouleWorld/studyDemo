import WeatherApi from '../api/WeatherApi'
import Model from './Model'

class WeatherModel extends Model{
    constructor() {
        super()
        this.api = new WeatherApi()
    }

    getWeather() {
        let path = '?location=beijing&key=cc8fb05bb74c41f3ad6121e9f2826eb7'
        let p = this.api.getPi(path)
        return p.then((pi) => {
            let result = pi.HeWeather6[0].now.cond_txt + ' ' + pi.HeWeather6[0].now.wind_dir
            return result
        })
    }
}

export default WeatherModel