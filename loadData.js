const mysql = require("mysql2");
const csv = require("csv-parser");
const fs = require("fs");

// MySQL Connection (update credentials as needed)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "omgamganapathayenamaha",
  database: "zomato"
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL Database!");
});

// Read the CSV file and insert data into MySQL
fs.createReadStream("zomato_data.csv")
  .pipe(csv())
  .on("data", (row) => {
    // Destructure the row using CSV header names exactly
    const {
      Restaurant_id,
      Restaurant_name,
      Country_code,
      City,
      Address,
      Locality,
      Locality_Verbose,
      Longitude,
      Latitude,
      Cuisines,
      Average_Cost_for_two,
      Currency,
      Has_Table_booking,
      Has_Online_delivery,
      Is_delivering_now,
      switch_to_order_menu,
      price_range,
      Aggregate_rating,
      Rating_color,
      Rating_text,
      Votes
    } = row;

    const query = `
      INSERT INTO restaurants (
        Restaurant_id, Restaurant_name, Country_code, City, Address, Locality, Locality_Verbose,
        Longitude, Latitude, Cuisines, Average_Cost_for_two, Currency, Has_Table_booking,
        Has_Online_delivery, Is_delivering_now, switch_to_order_menu, price_range,
        Aggregate_rating, Rating_color, Rating_text, Votes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
      Restaurant_id,
      Restaurant_name,
      Country_code,
      City,
      Address,
      Locality,
      Locality_Verbose,
      Longitude,
      Latitude,
      Cuisines,
      Average_Cost_for_two,
      Currency,
      Has_Table_booking,
      Has_Online_delivery,
      Is_delivering_now,
      switch_to_order_menu,
      price_range,
      Aggregate_rating,
      Rating_color,
      Rating_text,
      Votes
    ], (err, result) => {
      if (err) {
        console.error("Insert Error:", err);
      }
    });
  })
  .on("end", () => {
    console.log("CSV file successfully processed and data insertion initiated!");
    db.end();
  });
//om gam ganapathaye namaha