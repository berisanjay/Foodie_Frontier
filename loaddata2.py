import json
import csv

# Load JSON data from merged_images.json
with open("merged_images.json", "r", encoding="utf-8") as jsonfile:
    json_data = json.load(jsonfile)  # Read and parse the JSON file

# Open a CSV file to write
with open("trainmodel1.csv", "w", newline="", encoding="utf-8") as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(["Restaurant_ID", "Restaurant_name", "Image_URL"])  # Writing header

    # Extract and write restaurant ID, name, and image URL
    for item in json_data:
        for restaurant in item.get("restaurants", []):  # Use get() to avoid KeyErrors
            res_id = restaurant["restaurant"].get("id", "")  # Get ID safely
            res_name = restaurant["restaurant"].get("name", "")  # Fix key name
            image_url = restaurant["restaurant"].get("featured_image", "")  # Get Image URL safely
            
            if res_id and image_url:  # Ensure both ID and Image URL are present
                writer.writerow([res_id, res_name, image_url])

print("CSV file created successfully! Hare Krishna! 🙏")
