from typing import List
import urllib3
import json
from random import randint

BASE_URL = 'https://www.data.gov.au'

"""
path should be the path to a .json file specifying known hospitals

Returns the names of all hospitals in that file
"""
def get_known_hospitals(path : str) -> List[str]:
    with open(path, "r") as f:
        known = json.load(f)
        return list(map(lambda h: h["Facility Name"], known))


def main():
    known = get_known_hospitals("./src/assets/hospitals.json")
    assert len(known) >= 1 # throw an error if known is empty
    http = urllib3.PoolManager()
    next_link = '/data/api/3/action/datastore_search?resource_id=43b9e4a4-0752-44c7-b825-bc32c46cf3b7'
    
    hospitals = []
    response = "dummy"

    done = False
    while not done:
        response = json.loads(http.request('GET', BASE_URL + next_link).data)["result"]
        extras = response["records"]
        hospitals += extras
        next_link = response["_links"]["next"]
        done = len(extras) == 0

    assert len(hospitals) >= 5 #idk, just make sure it returns some results!
    hospitals = list(filter(lambda h: h["Hospital name"] in known, hospitals))

    # Construct a dict where keys are the "Facility Name" and values are "Number of available beds"
    result = {}
    for hospital in hospitals:
        result[hospital["Hospital name"]] = hospital["Number of available beds"]
    
    # TODO save result in firebase with the document ID as the current day
    print(json.dumps(result, indent=4))

if __name__ == "__main__":
    main()