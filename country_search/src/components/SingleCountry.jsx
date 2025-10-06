import { useState, useEffect } from 'react';
import axios from "axios";

const SingleCountry = ({ country, locationApiString, weatherApiString, apiKey }) => {

    const { name, capital, area, languages, flag } = country;
    const [temperature, setTemperature] = useState(null);

    let cityCode = null

    useEffect(() => {
        axios.get(locationApiString)
            .then(response => {
                cityCode = response.data[0].Key;
                return axios.get(`${weatherApiString}${cityCode}?apikey=${apiKey}`)
            })
            .then(response => {
                setTemperature(response.data[0].Temperature.Metric.Value);
            })
            .catch(error => {
                console.log("Error fetching weather data: ", error)
            })
    }, []);

    return (
        <div className="scc">
            <h1>{name.common}</h1>
            <p>Capital {capital}</p>
            <p>Area {area}</p>
            <h2>Languages</h2>
            <ul>
                {Object.values(languages).map((lang, i) => (
                    <li key={i}>{lang}</li>
                ))}
            </ul>
            <div style={{ fontSize: "200px" }}>{flag}</div>
            <h2>Weather in {capital}</h2>
            <p>Temperature {temperature} Celsius</p>
        </div>
    )
};

export default SingleCountry;
