import Api from './api'

class WeatherApi extends Api {
    constructor(props) {
        super('https://free-api.heweather.net/s6/weather/now');
    }

    getPi(path) {
        return this.get(path)
    }
}

export default WeatherApi