from numpy.core.records import array
from numpy.lib.shape_base import column_stack
import requests
import json
import time
shopSearch = []
params = {}

endpoint_url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=coffee+shop&location=35.7790905,-78.642413&radius=500&region=us&type=cafe,bakery&key=AIzaSyD1qlq7FWZSpYjdpVdyWlDeVdEhFGhkaqk"
api_url = "http://localhost:5005/apiansw"

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
    requests.post(api_url, json=data , timeout=5)
    # SE QUEDA TRABADO EN ESTE PROCESO. PERO ENVÍA LA INFORMACION
except requests.exceptions.RequestException as e:
    raise SystemExit(e)

    # TRATAR DE DEVOLDER 2 O 3 OPCIONES DE 'SHOPS'
    # INTENTAR QUE FILTER POR 'SHOP_RATING' O ALGUN
    # VALOR SIMILAR

    # shops_top = {}
    # for i in range(3):
    #     r = {
    #         'shop_name': shop_name[i],
    #         'shop_address': shop_address[i],
    #         'shop_rating': shop_rating[i]
    #     }
    #     shops_top.append(r)





# for i in range(len(shops)):
#     aux = {
#         "name": shop_name[i],
#         "address": shop_address[i],
#         "rating": shop_rating[i]    
#     }
#     arrShops.append(aux)
     
# filtro = []
# for x in shop_rating:  
#         if x >= 4:
#              filtro.append(True)
#         else: 
#             filtro.append(False)
# # print(filtro);
# newArr = []
# for i in filtro:
#     newArr.append(i)

# print(newArr)
# shops = {"shop_name": shop_name[1:5],
# "shop_address": shop_address[1:5], "shop_": newArr[1:5]}