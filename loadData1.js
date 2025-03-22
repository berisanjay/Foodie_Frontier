const mysql = require('mysql2');
const xlsx = require('xlsx');

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

// Read Excel file
const workbook = xlsx.readFile("country_data.xlsx"); // or .xlsx
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Insert data into 'countries' table
data.forEach((row) => {
  // Ensure these match the headers in your XLS
  const { country_code, country_name } = row;

  if (!country_code || !country_name) {
    console.log("Skipping row with missing data:", row); 
    return;
  }

  const query = `
    INSERT INTO countries (country_code, country_name)
    VALUES (?, ?)
  `;

  db.query(query, [country_code, country_name], (err) => {
    if (err) {
      console.error("Insert Error:", err);
    } else {
      console.log(`Inserted country_code: ${country_code}, country_name: ${country_name}`);
    }
  });
});

setTimeout(() => {
  db.end();
  console.log("Finished loading country data!");
}, 2000);
