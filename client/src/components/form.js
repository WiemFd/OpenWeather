import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WiThermometer,WiSunrise,WiSunset,WiUmbrella,WiHumidity,WiSnow, WiCloudyWindy,WiFlood,WiCloudyGusts,WiBarometer } from 'weather-icons-react';

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
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button type="submit">Submit<ToastContainer /></button>
        <button type="button" onClick={handleReset} className='reset'>Reset</button>
      </form>
      {weatherData && (
        <><form className='form-container'>
                      <div className='form-column weather'>
                          <h2>{weatherData.city} </h2>
                          <h5>Country: {weatherData.country}</h5>
                          <p className='weather_status'> Weather status: <span className='status'> {weatherData.status} </span></p>
                          <img src={`http://openweathermap.org/img/w/${weatherData.icon}.png`} alt="Weather Icon" />
                          <div className='real_time'>
                          <h4>{weatherData.date}</h4>
                          <h2><WiBarometer size={30} color='#696969' margin-left="7px" />{weatherData.time}</h2>
                          </div>
                      </div>
                      <div className='div form-column'>
                          <p className='temp'> <WiThermometer size={26} color='red' /> Temperature: <span className='temp_span'><span>{weatherData.temp_celsius}°C </span> | <span> {weatherData.temp_f}°F</span></span></p>
                          <p className='precip'><WiUmbrella size={26} color='#00008B' margin-left="7px" /> Precipitation (last hour): <span>{weatherData.rain}mm</span> </p>
                          <p className='snow'><WiSnow size={26} color='#F5F5F5' margin-left="7px" /> Snow (last hour): <span>{weatherData.snow}mm</span></p>
                          <p className='hum'> <WiHumidity size={26} color='#FF1493' margin-left="7px" /> Humidity: <span>{weatherData.humidity}% </span></p>
                          
                      </div>
                      <div className='div form-column'>
                      <p className='vis'><WiCloudyWindy size={26} color='pink' margin-left="7px" /> Visibility: <span>{weatherData.visibility}km</span></p>
                          <p className='pre'><WiFlood size={26} color='#00FF7F' margin-left="7px" /> Pressure: <span>{weatherData.pressure}hPa</span></p>
                          <p className='win'><WiCloudyGusts size={26} color='#FFDAB9' margin-left="7px" /> Wind Speed: <span>{weatherData.speed}km/h</span></p>
                          <p className='rise'> <WiSunrise size={26} color='#FFFF00' margin-left="7px" /> Sunrise Time: <span>{weatherData.sunrise}</span></p>
                          <p className='set'> <WiSunset size={26} color='#FF7F50' margin-left="7px" /> Sunset Time: <span>{weatherData.sunset}</span></p>
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
