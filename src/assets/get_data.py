import urllib3
import json
from random import randint

http = urllib3.PoolManager()
r = http.request('GET', 'https://www.data.qld.gov.au/api/3/action/datastore_search?resource_id=7de61fec-6670-4cad-a163-d955f0102cef')
hospitals = json.loads(r.data)["result"]["records"]

for hospital in hospitals:
    max_beds = randint(10, 200)
    occupied_beds = randint(0, max_beds)
    hospital["Max Bed Capacity"] = max_beds
    hospital["Occupied Beds"] = occupied_beds
    r = http.request('GET', 'https://nominatim.openstreetmap.org/search?q=%2218%20Mowbray%20Terrace,%20East%20Brisbane%22&format=json')
    print(json.dumps(json.loads(r.data), indent=4))
    # coords = json.loads(r.data)[0]["boundingbox"]
    # hospital["lat"], hospital["lon"] = coords["lat"], coords["lon"]
    

with open("hospitals.json", mode="x") as f:
    f.write(json.dumps(hospitals))