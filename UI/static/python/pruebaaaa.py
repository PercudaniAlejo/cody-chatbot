
import requests
import json
import time
coffee_shops = []
params = {}
  
endpoint_url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=coffee+shop&location=35.7790905,-78.642413&radius=2000&region=us&type=cafe,bakery&key=AIzaSyD1qlq7FWZSpYjdpVdyWlDeVdEhFGhkaqk"
         
res = requests.get(endpoint_url, params = params)
results =  json.loads(res.content)
coffee_shops.extend(results['results'])
time.sleep(2)
while "next_page_token" in results:
     params['pagetoken'] = results['next_page_token'],
     res = requests.get(endpoint_url, params = params)
     results = json.loads(res.content)
     coffee_shops.extend(results['results'])
     print(results['results'])
     time.sleep(2)
url = "localhost:5005/apiansw"
x = requests.post(url, data=results)
print(x)
