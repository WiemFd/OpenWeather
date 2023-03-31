import pymongo
import json
import httplib2
def thread_for_5_days_3_hour_forecast(city_names):

                open_weather_map_API_key = "8d4e8f807af8f877a9b46931b17a21cc"
                open_weather_API_endpoint = "http://api.openweathermap.org/"

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