from pprint import pprint
import requests
import json

url = 'http://localhost:3000/locations'

response = requests.get(url)
pprint(response.json())