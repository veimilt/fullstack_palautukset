import { useEffect, useState } from 'react'
import axios from 'axios'
import Country from './components/Country';
import SingleCountry from './components/SingleCountry';

const baseURL = 'https://studies.cs.helsinki.fi/restcountries/api/all';

function App() {
  const [allCountries, setAllCountries] = useState([])
  const [resultList, setResultList] = useState([])
  const [infoText, setInfoText] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)

  const handleNameChange = (event) => {
    const searchString = event.target.value
    filterCountries(searchString)
  }

  const filterCountries = (searchString) => {
    const results = allCountries.filter(country => country.name.common.toLowerCase().includes(searchString.toLowerCase()))
    setSelectedCountry(null)
    if (results.length > 10) {
      setResultList([])
      setInfoText("Too many results, make better filter string!")
    } else if (results.length === 0) {
      setResultList([])
      setInfoText("no results")
    } else {
      setInfoText(null)
      setResultList(results)
    }
  }

  useEffect(() => {
    const request = axios.get(baseURL)
    request.then(response => {
      setAllCountries(response.data)
    })
  }, [])

  const handleShowCountry = (country) => {
    setSelectedCountry(country)
  }

  const apiKey = import.meta.env.VITE_SOME_KEY;
  const locationApiBase = "https://dataservice.accuweather.com/locations/v1/cities/search"
  const weatherApiBase = "http://dataservice.accuweather.com/currentconditions/v1/"


  return (
    <div>
      find countries: <input onChange={handleNameChange} />
      <p>{infoText}</p>
      {selectedCountry ? (
        <SingleCountry
          country={selectedCountry}
          locationApiString={`${locationApiBase}?apikey=${apiKey}&q=${selectedCountry.capital}`}
          weatherApiString={weatherApiBase}
          apiKey={apiKey}
        />
      ) : resultList.length === 1 ? (
        <SingleCountry
          country={resultList[0]}
          locationApiString={`${locationApiBase}?apikey=${apiKey}&q=${resultList[0].capital}`}
          weatherApiString={weatherApiBase}
          apiKey={apiKey}
        />
      ) : resultList.length > 1 ? (
        <ul>
          {resultList.map(result => (
            <Country
              key={result.cca3}
              name={result.name.common}
              onShow={() => handleShowCountry(result)}
            />
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export default App
