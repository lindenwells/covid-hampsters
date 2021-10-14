import json
import pandas as pd #pip3 install pandas
from datetime import date
from typing import Any, Dict, List
import numpy as np
from google.cloud import firestore #pip3 install google-cloud-firestore
from random import randint

db = firestore.Client()
rng = np.random.default_rng(seed=42)
hospital_names : List[str] = []
max_beds : Dict[str, int] = {}
hospitals : List[Dict[str, Any]]= []
gen_occupancy : Dict[str, Dict[str, int]] = {}

with open("src/assets/hospitals.json", "r") as f:
    hospitals = json.load(f)
    for h in hospitals:
        max_beds[h["Facility Name"]] = h["Max Bed Capacity"]
        hospital_names.append(h["Facility Name"])

dates = list(map(lambda d: d.date().isoformat(), pd.date_range(date.today(), periods=100).to_pydatetime()))

rands = pd.DataFrame(rng.random((len(dates), len(hospital_names))) + 0.5, index=dates, columns=hospital_names)

def population(r : float, N : int, K : int):
    return round(N + r * N * (K - N) / K)

with open("src/assets/starting_occupancy.json", "r") as f:
    gen_occupancy[dates[0]] = json.load(f)


for i, day in enumerate(dates[1:], start=1):
    gen_occupancy[day] = {}
    
    for name in hospital_names:
        try: # If there is no previous data entry for this hospital, skip it
            prev = gen_occupancy[dates[i - 1]][name]
            max = max_beds[name]
            r = rands.get(name).get(day)
            gen_occupancy[day][name] = randint(1, max)
        except:
            continue


for day in dates:
    db.collection("occupancy_data").document(day).set(gen_occupancy[day])


