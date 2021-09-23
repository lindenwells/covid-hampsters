import urllib3
import json
from random import randint

def main():
    http = urllib3.PoolManager()
    r = http.request('GET', 'https://www.data.qld.gov.au/api/3/action/datastore_search?resource_id=7de61fec-6670-4cad-a163-d955f0102cef')
    hospitals = json.loads(r.data)["result"]["records"]

    for hospital in hospitals:
        max_beds = randint(10, 200)
        occupied_beds = randint(0, max_beds)
        hospital["Max Bed Capacity"] = max_beds
        hospital["Occupied Beds"] = occupied_beds
        url = 'https://nominatim.openstreetmap.org/search?q={0}&format=json'.format(
            hospital["Address"])
        r = http.request('GET', url)
        data = json.loads(r.data)
        if len(data) == 0:
            hospital["geocoding_failed"] = True # Add a key, value to hospital's dict to mark failure
        else:
            data = data[0] # Just pick the first one lol
            hospital["lat"], hospital["lon"] = data["lat"], data["lon"]

    # filter out the hospitals where geocoding failed
    hospitals = list(filter(lambda h: "geocoding_failed" not in h, hospitals))

    print(json.dumps(hospitals, indent=4))
        

    with open("hospitals.json", mode="w") as f:
        f.write(json.dumps(hospitals))

if __name__ == "__main__":
    main()