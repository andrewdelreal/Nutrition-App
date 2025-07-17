from io import BytesIO
import ijson
from zipfile import ZipFile
from urllib.request import urlopen
import json

# resp = urlopen('https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_branded_food_json_2025-04-24.zip')
resp = urlopen('https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_foundation_food_json_2025-04-24.zip')
myzip = ZipFile(BytesIO(resp.read()))
# for line in myzip.open(myzip.namelist()[0]).readlines():
#     print(line.decode('utf-8'), '\n\n')
print('here')
with myzip.open(myzip.namelist()[0]) as f:
    # data = json.load(f)
    # print(data['FoundationFoods'][0]['description'])  # gets the name of a portion
    # print(data['FoundationFoods'][0]['foodPortions'][0]['gramWeight']) # gets the weight of a portion
    # print(data['FoundationFoods'][0]['foodNutrients']) # gets all nutrients
    count = 0
    # print(data['BrandedFoods'][21])

    # parser = ijson.items(f, 'BrandedFoods.item')
    parser = ijson.items(f, 'FoundationFoods.item')
    for i, item in enumerate(parser):
        
        if 'foodPortions' not in item: # If there is no portion info for weight of food
            count += 1
            continue

        if len(item['foodPortions']) == 0:
            count += 1
            continue
        
        print(f'Portion weight: {item['foodPortions'][0]['gramWeight']} g') # gets the weight of a portion
        print(f'{item['description']}')
        for j in range(len(item['foodNutrients'])): # for each nutrient in a food
            if (item['foodNutrients'][j]['nutrient']['name'] == 'Protein'): # Checks for a specific nutrient
                print(f'{i + 1}) {item['foodNutrients'][j]['amount']}') # gets the amount for 100 g

    print(count)
