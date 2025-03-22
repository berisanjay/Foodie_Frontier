import mysql.connector

# Establish a connection to MySQL with local infile enabled
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="omgamganapathayenamaha",
    database="zomato",  # Enable LOCAL INFILE support
)
cursor = conn.cursor()

# Define the full path to your CSV file (use a raw string to avoid escaping issues)
csv_file_path = r"C:\ProgramData\MySQL\MySQL Server 9.2\Uploads\events.csv"

# Prepare the LOAD DATA LOCAL INFILE query
load_query = f"""
LOAD DATA LOCAL INFILE '{csv_file_path}'
INTO TABLE events
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(Restaurant_id, Event_title, Event_description, Start_date, End_date, Start_time, End_time, Display_date, Display_time, Date_added, Is_active)
"""

try:
    cursor.execute(load_query)
    conn.commit()
    print("CSV file loaded successfully into the events table! Hare Krishna!")
except mysql.connector.Error as err:
    print("Error loading CSV file:", err)
finally:
    cursor.close()
    conn.close()
