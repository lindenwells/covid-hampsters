import urllib3
import json
from random import randint

BASE_URL = 'https://www.data.qld.gov.au'

def main():
    http = urllib3.PoolManager()
    next_link = '/api/3/action/datastore_search?resource_id=7de61fec-6670-4cad-a163-d955f0102cef' #works, returns 201 results
    
    hospitals = []
    r = http.request('GET', BASE_URL + next_link)

    done = False
    while not done:
        response = json.loads(http.request('GET', BASE_URL + next_link).data)["result"]
        extras = response["records"]
        hospitals += extras
        next_link = response["_links"]["next"]
        done = len(extras) == 0

    assert len(hospitals) >= 5 #idk, just make sure it returns some results!
    hospitals = list(filter(lambda h: h["Facility Idenitifier"] != "", hospitals))
    # print(json.dumps(hospitals, indent=4))

    for hospital in hospitals:
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

    json_data = json.dumps(hospitals, indent=4)

    with open("hospitals.json", mode="w") as f:
        f.write(json_data)

if __name__ == "__main__":
    main()