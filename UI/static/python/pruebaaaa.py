import requests
import json
import time
shopSearch = []
params = {}

res = requests.get('http://localhost:5050/location')
resType = requests.get('http://localhost:5050/buscarLugar')
typeLugar = resType.content
typeLugar = typeLugar.decode('UTF-8')
print(typeLugar)
lat_lon = res.content
lat_lon = lat_lon.decode('UTF-8')
basura = "[]"
for x in range(len(basura)):
    lat_lon = lat_lon.replace(basura[x], "")

lat_lon = lat_lon.split(',')
# lon = lat_lon['longitude']
# lat = lat_lon['latitude']
# print("lon:" + lon)
# print("lat:" + lat)
endpoint_url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=&location=" + \
    lat_lon[0] + "," + lat_lon[1] + \
    "&radius=1&region=ar&type=" + typeLugar + \
    "&key=AIzaSyD1qlq7FWZSpYjdpVdyWlDeVdEhFGhkaqk"
api_url = "http://localhost:5050/apiansw"

res = requests.get(endpoint_url, params=params)
results = json.loads(res.content)
shopSearch.extend(results['results'])
time.sleep(2)
while "next_page_token" in results:
    params['pagetoken'] = results['next_page_token'],
    res = requests.get(endpoint_url, params=params)
    results = json.loads(res.content)
    shopSearch.extend(results['results'])
#     print(results['results'])
    time.sleep(2)

shop_name = []
shop_address = []
shop_rating = []

for i in range(len(shopSearch)):
    shop = shopSearch[i]
    try:
        shop_name.append(shop['name'])
    except:
        shop_name.append('none')
    try:
        shop_address.append(shop['formatted_address'])
    except:
        shop_address.append('none')
    try:
        shop_rating.append(shop['rating'])
    except:
        shop_rating.append('none')

# shops = {"shop_name": shop_name[1:5],
#          "shop_address": shop_address[1:5], "shop_rating": shop_rating[1:5]}

data = [
    {
        "name": shop_name[0],
        "address": shop_address[0],
        "rating": shop_rating[0]
    },
    {
        "name": shop_name[1],
        "address": shop_address[1],
        "rating": shop_rating[1]
    }
]

try:
    print("\nEnviado")
    requests.post(api_url, json=data, timeout=5)
except requests.exceptions.RequestException as e:
    raise SystemExit(e)
