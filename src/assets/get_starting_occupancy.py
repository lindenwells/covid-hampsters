import json
from random import randint

hospitals = []
starting_occupancy = {}

with open("src/assets/hospitals.json") as f:
    hospitals = json.load(f)

with open("src/assets/starting_occupancy.json") as f:
    starting_occupancy = json.load(f)

# print(json.dumps(hospitals, indent=4))
# print(json.dumps(starting_occupancy, indent=4))

for hospital in hospitals:
    if hospital["Facility Name"] not in starting_occupancy:
        # generate a starting occupancy
        max = hospital["Max Bed Capacity"]
        starting_occupancy[hospital["Facility Name"]] = randint(1, max)

assert len(hospitals) == len(starting_occupancy)

with open("src/assets/starting_occupancy.json", "w") as f:
    json.dump(starting_occupancy, f, indent=4)