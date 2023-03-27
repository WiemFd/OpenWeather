import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Form(props) {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    const url = `http://localhost:5000/weather?city=${city}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.cod === '404') {
      setWeatherData(null);
      setError('City not found ! Please enter a valid city name.');
      toast.error('City not found !', {
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });

        toast.info(' Please enter a valid city name. ', {
            position: "top-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
    } else {
      setCity('');
      setWeatherData(data);
      setError(null);
    }
  };

  function notify() {
        if (weatherData && weatherData.alerts) {
            for (let i = 0; i < weatherData.alerts.length; i++) {
                if (i===0){
                    toast(weatherData.alerts[i], {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    }); 
                }
                else {
                let delay=(i+1)*3000
                toast(weatherData.alerts[i], {
                    position: "top-right",
                    autoClose: delay,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });}
            }
        } 
    }

  function handleReset() {
        setCity('');
        setWeatherData(null);
        setError(null);
        toast.dismiss(); //to close all toast alerts
    }
  

  return (
    <div className='body'>
    <div className='App'>
    <h1>SkyCast</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button type="submit">Submit<ToastContainer /></button>
        <button type="button" onClick={handleReset}>Reset</button>
      </form>
      {weatherData && (
        <><form className="form-container">
                      <div className='form-column'>
                          <h2>{weatherData.city}</h2>
                          <p>Country: {weatherData.country}</p>
                          <p>Weather status: {weatherData.status}</p>
                          <img src={`http://openweathermap.org/img/w/${weatherData.icon}.png`} alt="Weather Icon" />
                      </div>
                      <div className='form-column'>
                          <p> Temperature: {weatherData.temp_celsius}°C , {weatherData.temp_f}°F</p>
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
                  <div> 
                          <button onClick={notify} className="notif">Notify!</button>
                          <ToastContainer />
                      </div></>
                      
      )}
      {error}
    </div>
    </div>
  );
}

export default Form;
