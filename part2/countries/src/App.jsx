import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryDisplay = ({ country: countryData }) => {
  if (!countryData) {
    return null
  }
  return (
    <div>
      <h2>{countryData.name.common}</h2>
      <p>Capital: {countryData.capital[0]}</p>
      <p>Area: {countryData.area} km²</p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(countryData.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <h3>Flag:</h3>
      <div
        style={{
          border: '2px solid #333',
          display: 'inline-block',
          padding: '8px',
          borderRadius: '8px',
        }}
      >
        <img 
          src={countryData.flags.png} 
          alt={`Flag of ${countryData.name.common}`} 
          width="200" 
        />
      </div>
    </div>
  )
}

const SearchBar = ({ filter, handleFilterChange }) => (
  <div>
    <label>
      Find countries:{' '}
      <input
        type="text"
        value={filter}
        onChange={handleFilterChange}
        placeholder="Type country name..."
      />
    </label>
  </div>
)

const SearchItem = ( {name, handleShow} ) => {
  return (
    <li>
      {name} <button onClick={() => handleShow(name)}>show</button>
    </li>
  )
}

const SearchResults = ({ filteredCountryNames, handleShow }) => {
  if (filteredCountryNames.length === 0) {
    return <p>No countries match your search.</p>
  } else if (filteredCountryNames.length > 10) {
    return <p>Too many matches, be more specific.</p>
  } else if (filteredCountryNames.length !== 1) {
    return (
      <ul>
        {filteredCountryNames.map(name => (
          <SearchItem key={name} name={name} handleShow={() => handleShow( name )} />
        ))}
      </ul>
    )
  } else {
    // The single country will automatically be displayed by CountryDisplay
    return null
  }
}

const App = () => {

  const [filter, setFilter] = useState('')
  const [allCountryNames, setAllCountryNames] = useState([])
  const [filteredCountryNames, setFilteredCountryNames] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [countryData, setCountryData] = useState(null)

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleShow = (countryName) => {
    setSelectedCountry(countryName)
    setFilter(countryName)
  }

  // This runs whenever filter changes to update the filtered country names and selected country
  useEffect(() => {
    const newFilteredCountryNames = allCountryNames.filter(name =>
      name.toLowerCase().includes(filter.toLowerCase())
    )
    setFilteredCountryNames(newFilteredCountryNames)
    if (newFilteredCountryNames.length === 1) {
      setSelectedCountry(newFilteredCountryNames[0]);
    }
    else {
      setSelectedCountry(null);
      setCountryData(null);
    }
  }, [filter]);

  // This runs once at the start of the app to get all country names
  useEffect(() => {
    const allUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
    axios.get(allUrl).then(response => {
      const allCountryNames = response.data.map(country => country.name.common)
      console.log(`Retrieved the names of ${allCountryNames.length} countries`)
      setAllCountryNames(allCountryNames)
    });
  }, []);

  // Fetch and display data for a specific country (display is automatic via state)
  const displayCountry = (countryName) => {
    console.log('Displaying country:', countryName)
    const countryUrl = `https://studies.cs.helsinki.fi/restcountries/api/name/${countryName}`
    axios.get(countryUrl).then(response => {
      setCountryData(response.data)
    });
  }

  // This runs whenever selectedCountry changes and updates all the internal states accordingly
  /*
  Note:
  - displayCountry is a function that changes state (countryData)
  - Calling displayCountry in the main body of the component would cause infinite re-renders
  - Hence, we use useEffect to call displayCountry only when selectedCountry changes
  - This is not the only solution, we could for example call displayCountry from an event handler (e.g. onClick),
  however since changes to buttons or the search bar can require displaying a new country, using useEffect is more convenient.
  */
  useEffect(() => {
    if (selectedCountry) {
      displayCountry(selectedCountry)
    }
  }, [selectedCountry]);

  return (
    <div>
      <h1>Country Info</h1>
      <SearchBar filter={filter} handleFilterChange={handleFilterChange} />
      <SearchResults filteredCountryNames={filteredCountryNames} handleShow={handleShow} />
      <CountryDisplay country={countryData} />
    </div>
  )
}

export default App
