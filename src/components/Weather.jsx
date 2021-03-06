import React from 'react';

import WeatherForm from 'WeatherForm';
import WeatherMessage from 'WeatherMessage';
import axios from 'axios';

const WEATHER_API_KEY = "380170ad0ee01fe048ecc89e68a8b13d";
const ROOT_URL = `http://api.openweathermap.org/data/2.5/weather?appid=${WEATHER_API_KEY}&units=metric`;

class Weather extends React.Component {

    constructor() {
        super();
        this.state = {
            city: '',
            temperature: '',
            cod: '',
            isLoading: false
        };
        this.handleCitySelect = this.handleCitySelect.bind(this);
    }

    componentDidMount() {
        //pull the location from props
        //react router makes available the props through this.props.location.query
        const location = this.props.location.query.location;

        if(location && location.length > 0){
            this.handleCitySelect(location);
            //reset the hash
            window.location.hash = '#/';
        }
    }

    handleCitySelect(city) {

        this.setState({isLoading: true});

        axios.get(`${ROOT_URL}&q=${encodeURIComponent(city)}`)
            .then((res) => {

                if (res.data.cod !== '404') {
                    this.setState({city: res.data.name, temperature: res.data.main.temp, cod: res.data.cod});
                } else {
                    this.setState({cod: res.data.cod});
                }
                this.setState({isLoading: false});
            }, (err) => {
                throw new Error(err.data.message);
            });
    }

    componentWillReceiveProps(nextProps) {
        //pull the location from nextProps
        //the router will pass new props to Weather
        const location = nextProps.location.query.location;

        if(location && location.length > 0){
            this.handleCitySelect(location);
            //reset the hash
            window.location.hash = '#/';
        }
    }


    render() {
        return (
            <div>
                <h1 className="text-center page-title">Get Weather</h1>
                <WeatherForm onCitySelect={this.handleCitySelect}/>
                {this.state.isLoading ? <h1 className="text-center"><img src="./img/ajax-loader.gif" alt=""/></h1> :
                    <WeatherMessage {...this.state}/>}
            </div>
        );
    }
}

export default Weather;
