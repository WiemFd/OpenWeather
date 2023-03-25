import React, { useState } from 'react'; //useState is a hook function that allows us to add state to a functional component in React.
import './App.css';

function App() {
  const [city, setCity] = useState(''); //setCity function to update the city state variable when the user types into the input field
  const [weatherData, setWeatherData] = useState(null); //setWeatherData function to update it with the weather data that we receive from the Flask backend API.
  const [error, setError] = useState(null); // error : city not found

  const handleSubmit = async (e) => { //handleSubmit function is called when the user submits the form
    e.preventDefault();
    const url = `http://localhost:5000/weather?city=${city}`;
    const response = await fetch(url); // handleSubmit makes a request to the Flask backend API using the fetch
    const data = await response.json(); // the result is converted to JSON using the response.json() method
    if (data.cod === '404') { // Check if the API returns an error code
      setError('City not found. Please enter a valid city name.');
      setWeatherData(null);
    } else {
      setWeatherData(data);
      setError(null);
    }
  };

  const handleReset = () => { //handleReset is used to clear out input data
    setCity("");
    setWeatherData("");
    setError(null);
  };

  return (
    <div className='body'>
    <div className="App">
      <div>
     <div class="wave"></div>
     <div class="wave"></div>
     <div class="wave"></div>
    </div>
      <h1>SkyCast</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button type="submit">Submit</button>
        <button type="button" onClick={handleReset}>Reset</button>
      </form>
      {weatherData && (
         <form className="form-container">
          <div className='form-column'>
            <h2>{weatherData.city}</h2>
            <p>Country: {weatherData.country}</p>
            <p>Weather status: {weatherData.status}</p>
            <img src={`http://openweathermap.org/img/w/${weatherData.icon}.png`} alt="Weather Icon" />
          </div>
          <div className='form-column'>
            <p>Temperature: {weatherData.temp_celsius}°C , {weatherData.temp_f}°F</p>
            <p>Precipitation (last hour): {weatherData.rain}mm</p>
            <p>Snow (last hour): {weatherData.snow}mm</p>
          </div>
          <div className='form-column'>
            <p>Humidity: {weatherData.humidity}%</p>
            <p>Visibility: {weatherData.visibility}km</p>
            <p>Pressure: {weatherData.pressure}hPa</p>
            <p>Wind Speed: {weatherData.speed}km/h</p>
          </div>
          <div className='form-column'>
            <p>{weatherData.date}</p>
            <p>Real Time: {weatherData.time}</p>
            <p>Sunrise Time: {weatherData.sunrise}</p>
            <p>Sunset Time: {weatherData.sunset}</p>
          </div>
         </form>  
      )}
      {error && (
        <p>{error}</p>
      )}
         
      
    </div>
    </div>
  );
}

export default App;
