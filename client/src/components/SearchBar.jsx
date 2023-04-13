import '../styles/searchbar.css'
import { useState } from 'react'
import axios from 'axios'

const google = window.google
const autocompleteService = new google.maps.places.AutocompleteService()
const placesService = new google.maps.places.PlacesService(
  document.createElement('div')
)

const SearchBar = ({ bucketList }) => {
  // props { bucketlist: [{ bucketlistName: '' }, { bucketListName: '' }], something: ''   }
  // props.bucketList.map()
  // props.something
  // or bucketList.map()
  // or something

  const [inputValues, setInput] = useState('')
  const [predictions, setPredictions] = useState([])
  const [photo, setPhoto] = useState(null)
  const [cityData, setCityData] = useState(null)

  const handleChange = (e) => {
    console.log(e.target.value)
    setInput(e.target.value)
    // get a list from google, array of strings
    autocompleteService.getPlacePredictions(
      { input: e.target.value, types: ['(cities)'] },
      (predictions) => {
        console.log(predictions)
        // if predictions value is not null, then set the predictions
        // since there's no else, it will stay as is
        // filter out impurities early in your logic
        // the things we dont want to be a part of the state, we want to take it out
        // before we even set the state
        if (predictions !== null) {
          setPredictions(predictions)
        }
      }
    )
  }

  const handleCityClick = (placeId) => {
    placesService.getDetails(
      { placeId: placeId, fields: ['name', 'photos'] },
      (place, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          place.photos &&
          place.photos.length > 0
        ) {
          const photoUrl = place.photos[0].getUrl({
            maxWidth: 250,
            maxHeight: 300
          })
          setPhoto(photoUrl)
        }
      }
    )
  }

  return (
    <div id="blurbsearch-container">
      <p id="intro-blurb">
        Explore the world <br /> with us!
      </p>
      <div id="searchbar-container">
        <input
          type="text"
          id="search-input"
          value={inputValues}
          onChange={handleChange}
        />
        {predictions.length > 0 && (
          <div className="search-panel">
            {predictions.map((predictionItem) => {
              return (
                <div className="cities-container">
                  <p
                    className="suggested-city"
                    onClick={() => {
                      setInput(predictionItem.description)
                      setPredictions([])
                      handleCityClick(predictionItem.place_id)
                    }}
                  >
                    {predictionItem.description}
                  </p>
                </div>
              )
            })}
          </div>
        )}
        {photo && (
          <div id="photodata-container">
            <form className="bucketlistname-dropdown">
              <h6 className="bucket-title">Buckets...</h6>
              <img
                src="https://i.imgur.com/Gl9m7pe.png"
                className="dropdown-icon"
              />
              <button id="savebucket-btn">Save</button>
            </form>
            <img src={photo} alt="city photo" id="photo-data" />

            <ul className="bucketdropdown-panel">
              {bucketList.map((bucketItem) => {
                return (
                  <li className="dropdown-list">
                    <img
                      src={photo}
                      className="dropdown-img"
                    />
                    <h6 className="dropdown-text">{bucketItem.bucketListName}</h6>
                    
                    <div className="dropdownsave-container">
                    <button className="dropdown-save">Save</button>

                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
        {cityData && <div id="cityname-data">{setCityData}</div>}
      </div>
    </div>
  )
}
export default SearchBar
