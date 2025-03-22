import json
import csv

# Load JSON data
with open('merged_images.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Open CSV file for writing
with open('events.csv', 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    # Write header row
    writer.writerow([
        'Restaurant_id', 'Event_title', 'Event_description', 'Start_date', 
        'End_date', 'Start_time', 'End_time', 'Display_date', 'Display_time', 
        'Date_added', 'Is_active'
    ])
    
    # data is a list, so iterate over each entry in the list
    for entry in data:
        # Ensure the entry has a 'restaurants' key
        if 'restaurants' in entry:
            for item in entry['restaurants']:
                restaurant = item['restaurant']
                restaurant_id = restaurant.get('id', '')
                # Check if events exist
                if 'zomato_events' in restaurant:
                    for event_item in restaurant['zomato_events']:
                        event = event_item.get('event', {})
                        writer.writerow([
                            restaurant_id,
                            event.get('title', ''),
                            event.get('description', ''),
                            event.get('start_date', ''),
                            event.get('end_date', ''),
                            event.get('start_time', ''),
                            event.get('end_time', ''),
                            event.get('display_date', ''),
                            event.get('display_time', ''),
                            event.get('date_added', ''),
                            event.get('is_active', 0)
                        ])
