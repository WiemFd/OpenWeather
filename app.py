#jsonify converts a json output into a response object with application/json.
# request contains all the data sent from the Client to Server.
from flask import Flask, jsonify, request
from flask_cors import CORS #Flask-Cors enables communication with resources housed in many domains.
import datetime as date
import requests #The requests module allows you to send HTTP requests using Python.
import colorama  #The Colorama is one of the built-in Python modules to display the text in different colors.
from colorama import Fore, Style
colorama.init(autoreset=True) 
import pymongo
#import app as config
#from app import get_weather
import requests
import threading
import os
import time
from datetime import datetime
import shutil
import json
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import httplib2
import folium
import pandas as pd
import seaborn as sns

def Kelvin_To_Celsius_Fathrenheit(kelvin): #function to convert temperature from kelvin to celsius and fathrenheit
    celsius = kelvin - 273.15
    fathrenheit = celsius * (9/5) + 32
    return celsius, fathrenheit

def mPERs_To_kmPERh(wind_speed): #function to convert wind speed from m/s to km/h
    wind_speed2 = wind_speed * 3.6
    return wind_speed2

root_url = "http://api.openweathermap.org/data/2.5/weather?"
api_key = "41a5602c0366af4dd27e1e3cc499b9da" # openWeather API key

app = Flask(__name__)
CORS(app)  # enable Cross-Origin Resource Sharing (CORS)

@app.route('/weather', methods=['GET']) 
def get_weather(): #function to extract weather data from backend
    city = request.args.get('city') 
    final_url = root_url+"appid="+api_key+"&q="+city
    response = requests.get(final_url).json() #the dictionary that contains the weather data 
    city_cod=response['cod']
    if city_cod != "404": #if the city is available in openweathermap API
            city2 = response['name']
            country = response['sys']['country']
            temp_kelvin = response['main']['temp']
            temp_celsius, temp_fathrenheit = Kelvin_To_Celsius_Fathrenheit(temp_kelvin)
            temp_celsius=round(temp_celsius,2)
            temp_fathrenheit=round(temp_fathrenheit,2)
            humidity = response['main']['humidity']
            pressure = response['main']['pressure']
            wind_speed = response['wind']['speed']
            wind_speed= round(mPERs_To_kmPERh(wind_speed),2)
            weather_status = response['weather'][0]['description']
            icon_id = response['weather'][0]['icon']
            sunrise_time = date.datetime.fromtimestamp(response['sys']['sunrise'])
            sunrise_time = sunrise_time.strftime("%H:%M")
            sunset_time = date.datetime.fromtimestamp(response['sys']['sunset'])
            sunset_time = sunset_time.strftime("%H:%M")
            visibility = response['visibility']/1000
            visibility=round(visibility,1)
            real_time_date = date.datetime.utcfromtimestamp(response['dt']+response['timezone'])
            real_time = real_time_date.strftime("%H:%M")
            real_date = real_time_date.date().strftime("%A, %d %B %Y")


            print(response)

            print(Fore.LIGHTMAGENTA_EX+Style.BRIGHT+"\nCity : "+Fore.WHITE+city2+"\n")
            print(Fore.LIGHTMAGENTA_EX+Style.BRIGHT+"Country : "+Fore.WHITE+country+"\n")
            print(Fore.LIGHTMAGENTA_EX+Style.BRIGHT+"Weather Status : "+Fore.WHITE+weather_status+"\n")
            print(Fore.LIGHTMAGENTA_EX+Style.BRIGHT+"Temperature : "+Fore.WHITE+f"{temp_celsius} °C , {temp_fathrenheit} °F\n")

            key_rain = 'rain'
            if key_rain in response :
                rain = response['rain']['1h']
            else:
                rain = 0
            print(Fore.LIGHTMAGENTA_EX+Style.BRIGHT+"Precipitation volume for last hour : "+Fore.WHITE+f"{rain} mm\n")

            key_snow = 'snow'
            if key_snow in response :
                snow = response['snow']['1h']
            else:
                snow = 0
            print(Fore.LIGHTMAGENTA_EX+Style.BRIGHT+"Snow volume for last hour : "+Fore.WHITE+f"{snow} mm\n")

            print(Fore.LIGHTMAGENTA_EX+Style.BRIGHT+"Humidity : "+Fore.WHITE+f"{humidity} %\n")
            print(Fore.LIGHTMAGENTA_EX+Style.BRIGHT+"Pressure : "+Fore.WHITE+f"{pressure} hPa\n")
            print(Fore.LIGHTMAGENTA_EX+Style.BRIGHT+"Wind Speed : "+Fore.WHITE+f"{wind_speed} km/h\n")
            print(Fore.LIGHTMAGENTA_EX+Style.BRIGHT+"Visibility : "+Fore.WHITE+f"{visibility} km\n")
            print(Fore.LIGHTMAGENTA_EX+Style.BRIGHT+"Real Time & Date : "+Fore.WHITE+f"{real_time} {real_date}\n")
            print(Fore.LIGHTMAGENTA_EX+Style.BRIGHT+"Sunrise Time : "+Fore.WHITE+f"{sunrise_time}\n")
            print(Fore.LIGHTMAGENTA_EX+Style.BRIGHT+"Sunset Time : "+Fore.WHITE+f"{sunset_time}\n")

            locations = [city2]
        
            

            open_weather_map_API_key = "8d4e8f807af8f877a9b46931b17a21cc"
            open_weather_API_endpoint = "http://api.openweathermap.org/" 

            # Initialized HTTPlib for HTTP requests
            http_initializer = httplib2.Http()

            

            city_names = locations

            

            def thread_for_5_days_3_hour_forecast():

                # Initialize MongoDB client running on localhost
                client = pymongo.MongoClient('mongodb://localhost:27017/')

                # Dictionary to store the alerts for rain, snow and freezing temperature
                alerts = {"rain":[],"snow":[],"freezing_temperature":[], "floods":[], "wind_storm":[], "wildfire":[] }

                for city in city_names:
                    url = open_weather_API_endpoint+"/data/2.5/forecast?q="+city+"&appid="+open_weather_map_API_key
                    http_initializer = httplib2.Http()
                    response, content = http_initializer.request(url,'GET')
                    utf_decoded_content = content.decode('utf-8')
                    json_object = json.loads(utf_decoded_content)

                    # Creating Mongodb database
                    db = client.weather_data

                    # Putting Openweathermap API data in database, with timestamp as primary key
                    for element in json_object["list"]:
                        try:
                            datetime = element['dt']
                            del element['dt']
                            db['{}'.format(city)].insert_one({'_id':datetime,"data":element})
                        except pymongo.errors.DuplicateKeyError:
                            continue
                    # Here we store the alerts based on conditions
                    for a in db['{}'.format(city)].find({}):
                        # Converting temperature to Fahrenheit
                        temperature = (float(a["data"]["main"]["temp"]) - 273.15)  # en °C
                        wind_speed = (float(a["data"]["wind"]["speed"]) * 3.6)
                        rain_3h = (a["data"]["weather"][0]["main"])
                        freezing_temperature_threshold = 0 # 0 °C
                        wind_storm_threshold = 118 #(118 km/h) est considérée comme suffisante pour déclencher une alerte de tempête
                        floods_threshold = "150" #Les inondations peuvent être déclenchées par de fortes précipitations, généralement supérieures à 50 mm en 24 heures.
                        wildfire_threshold = 50 # 50 °C
                        if temperature<freezing_temperature_threshold:
                            alerts["freezing_temperature"].append("Freezing temperature 0 °C "+ temperature +" in "+city+" on "+str(a["data"]["dt_txt"]).split(" ")[0]+" at "+str(a["data"]["dt_txt"]).split(" ")[1])
                        elif a["data"]["weather"][0]["main"]=="Rain":
                            alerts["rain"].append("Rain expected in "+city+" on "+str(a["data"]["dt_txt"]).split(" ")[0]+" at "+str(a["data"]["dt_txt"]).split(" ")[1])
                        elif rain_3h>floods_threshold and a["data"]["weather"][0]["main"]=="Rain": 
                                alerts["floods"].append("Floods expected on "+city+" on "+str(a["data"]["dt_txt"]).split(" ")[0]+" at "+str(a["data"]["dt_txt"]).split(" ")[1])
                        elif a["data"]["weather"][0]["main"]=="Snow":
                            alerts["snow"].append("Snow expected in "+city+" on "+str(a["data"]["dt_txt"]).split(" ")[0]+" at "+str(a["data"]["dt_txt"]).split(" ")[1])
                        elif wind_speed>wind_storm_threshold : 
                            alerts["wind_storm"].append("Wind Storm expected on "+city+" on "+str(a["data"]["dt_txt"]).split(" ")[0]+" at "+str(a["data"]["dt_txt"]).split(" ")[1])
                        elif temperature> wildfire_threshold:
                            alerts["wildfire"].append("Wildfire expected on "+city+" on "+str(a["data"]["dt_txt"]).split(" ")[0]+" at "+str(a["data"]["dt_txt"]).split(" ")[1])
                all_alerts=[]   
                print("*********WEATHER ALERTS********")
                for alert_type, alert_msg in alerts.items():
                    if len(alerts[alert_type])>0:
                        print(alert_type.upper()+ ":")
                        for msg in alert_msg:
                            print(" - "+ msg)
                            all_alerts.append(msg)
                    if len(alerts[alert_type]) == 0:
                        nomsg=("No alerts found for " + alert_type)
                        all_alerts.append(nomsg)
                 
                return(all_alerts)
            
            alerts=thread_for_5_days_3_hour_forecast()
            print(alerts)
    


    else: #if the city is not available in openweathermap API
            print(Fore.GREEN+Style.BRIGHT+"City Not Found\n")
            city_cod="404"
            city2=" City Not Fount"
            country=" "
            weather_status=" "
            icon_id=" "
            temp_celsius=" "
            temp_fathrenheit=" "
            rain=" "
            snow=" "
            humidity=" "
            pressure=" "
            wind_speed=" "
            visibility=" "
            real_date=" "
            real_time=" "
            sunrise_time=" "
            sunset_time=" "
            alerts=[]
        
            
    return jsonify({'cod':city_cod,
                    'city': city2,
                    'country':country,
                    'status':weather_status,
                    'icon':icon_id,
                    'temp_celsius':temp_celsius,
                    'temp_f':temp_fathrenheit,
                    'rain':rain,'snow':snow,
                    'humidity':humidity,
                    'pressure':pressure,
                    'speed':wind_speed,
                    'visibility':visibility,
                    'time':real_time,
                    'date': real_date,
                    'sunrise':sunrise_time,
                    'sunset':sunset_time,
                    'alerts':alerts})

if __name__ == '__main__':
    app.run()