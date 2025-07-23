from io import BytesIO
import ijson
from zipfile import ZipFile
from urllib.request import urlopen
from tqdm import tqdm

resp = urlopen('https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_branded_food_json_2025-04-24.zip')
# resp = urlopen('https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_foundation_food_json_2025-04-24.zip')
myzip = ZipFile(BytesIO(resp.read()))
# for line in myzip.open(myzip.namelist()[0]).readlines():
#     print(line.decode('utf-8'), '\n\n')
with myzip.open(myzip.namelist()[0]) as f:
    # data = json.load(f)
    # print(data['FoundationFoods'][0]['description'])  # gets the name of a portion
    # print(data['FoundationFoods'][0]['foodPortions'][0]['gramWeight']) # gets the weight of a portion
    # print(data['FoundationFoods'][0]['foodNutrients']) # gets all nutrients
    # print(data['BrandedFoods'][21])

    parser = ijson.items(f, 'BrandedFoods.item')
    # parser = ijson.items(f, 'FoundationFoods.item')
    for i, item in enumerate(tqdm(parser)):
        weight, calories, carbs, fat, protein = 100, 0, 0, 0, 0   # initialize data values
        carbs_diff_found, carbs_sum_found = False, False

        # if 'foodPortions' not in item: # If there is no portion info for weight of food
        #     weight = 100    # default weight according to database
        # elif len(item['foodPortions']) == 0:
        #     weight = 100    # default weight according to database
        
        # print(f'{i + 1}) {item['description']}')
        # print(f'Portion weight: {item['foodPortions'][0]['gramWeight']} g') # gets the weight of a portion

        for nutrient in item['foodNutrients']: # for each nutrient in a food
            nutrient_id = nutrient['nutrient']['id']
            amount = nutrient.get('amount')

            if amount is None:
                continue  # skip if amount is missing or None

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

        if calories < 1:
            calories = carbs * 4 + fat * 9 + protein * 4

        # if i == 326: 
        #     my_string = str(item['description'])+ '\n' + str(f'Wt: {weight} g, Ca: {calories} kCal, Cb: {carbs} g, Fat: {fat} g, Pr: {protein}') + '\n\n' + str(item['foodNutrients'])
        #     file_path = 'output.txt'

        #     with open(file_path, "w") as file_object:
        #         file_object.write(my_string)

        # print(f'{i + 1}) {item['description']}')
        # print(f'Wt: {weight} g, Ca: {calories} kCal, Cb: {carbs} g, Fat: {fat} g, Pr: {protein} g\n')
