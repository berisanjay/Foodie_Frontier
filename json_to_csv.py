import json
import csv

# Load the JSON file
with open("merged_images.json", "r", encoding="utf-8") as json_file:
    data = json.load(json_file)

# Check if data is a list and extract the first dictionary
if isinstance(data, list) and len(data) > 0:
    data = data[0]

# Ensure 'restaurants' key exists
restaurants = data.get("restaurants", [])

# Create a CSV file
with open("address.csv", "w", newline="", encoding="utf-8") as csv_file:
    writer = csv.writer(csv_file)
    writer.writerow(["Restaurant_id", "url"])  # Write CSV header

    for entry in restaurants:
        restaurant = entry.get("restaurant", {})
        restaurant_id = restaurant.get("R", {}).get("res_id")
        url = restaurant.get("url", "")

        if restaurant_id:
            writer.writerow([restaurant_id, url])

print("✅ JSON data successfully converted to address.csv!")
