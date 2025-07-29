from io import BytesIO
import ijson
from zipfile import ZipFile
from urllib.request import urlopen
from tqdm import tqdm
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

# branded_resp = urlopen('https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_branded_food_json_2025-04-24.zip')
# foundation_resp = urlopen('https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_foundation_food_json_2025-04-24.zip')

url = 'http://localhost:54321/food'

def send_request(data):
    try:
        response = requests.post(url, json=data, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
         # Ignore errors silently, don't print
        pass

def process_zip(zip_url, top_level_key, max_workers=20):
    print(f'Processing zip: {zip_url}')
    resp = urlopen(zip_url)
    myzip = ZipFile(BytesIO(resp.read()))

    with myzip.open(myzip.namelist()[0]) as f, ThreadPoolExecutor(max_workers=max_workers) as executor:
        parser = ijson.items(f, f'{top_level_key}.item')
        futures = []

        for item in tqdm(parser, desc=top_level_key):
            weight, calories, carbs, fat, protein = 100, 0, 0, 0, 0   # initialize data values
            carbs_diff_found, carbs_sum_found = False, False
            multiplier = 1.0

            if 'foodPortions' in item: # If there is no portion info for weight of food
                if len(item['foodPortions']) != 0:
                    weight = float(item['foodPortions'][0]['gramWeight'])
                    multiplier = float(weight) / 100.0

            for nutrient in item['foodNutrients']: # for each nutrient in a food
                nutrient_id = nutrient['nutrient']['id']
                amount = nutrient.get('amount')

                if amount is None:
                    continue  # skip if amount is missing or None

                amount = float(amount)  

                if nutrient_id == 2047:         # calories
                    calories = amount           # gets the amount of calories for 100 g of item

                elif nutrient_id == 1005:       # Carbs by difference
                    carbs = amount              # gets the amount of carbs for 100 g of item
                    carbs_diff_found = True
                
                elif nutrient_id == 1050 and not carbs_diff_found:       # carbs by summation
                    carbs = amount
                
                elif nutrient_id in [1063, 1009, 1079] and not carbs_diff_found and not carbs_sum_found: # 
                    carbs += amount             # If the nutrient is starch, fiber, or sugar

                elif nutrient_id == 1004:       # Total Fat
                    fat = amount                # gets the amount of fat for 100 g of item 

                elif nutrient_id == 1003:       # protein
                    protein = amount            # gets the amount of protein for 100 g of item

            if carbs < 0.0: carbs = 0

            fat *= multiplier
            carbs *= multiplier
            protein *= multiplier

            if calories < 1:
                calories = carbs * 4 + fat * 9 + protein * 4

            data = {
                'name': item['description'],
                'calories': calories,
                'carbs': carbs,
                'fat': fat,
                'protein': protein,
                'weight': weight
            }

            futures.append(executor.submit(send_request, data))

        # Wait for all requests to complete
        for future in tqdm(as_completed(futures), total=len(futures), desc="Uploading"):
            pass

# Run both datasets in parallel as well
from threading import Thread

t1 = Thread(target=process_zip, args=('https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_branded_food_json_2025-04-24.zip', 'BrandedFoods'))
t2 = Thread(target=process_zip, args=('https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_foundation_food_json_2025-04-24.zip', 'FoundationFoods'))

t1.start()
t2.start()
t1.join()
t2.join()