const fs = require("fs"),
  csv = require("csv-parser"),
  csvFilePath = "./Nums.csv",
  jsonFilePath = "./outputArray.json",
  numbersArray = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on("data", (row) => {
    const number = parseInt(row.number);

    if (!isNaN(number)) numbersArray.push(String(number).padStart(5, "0"));
  })
  .on("end", () => {
    fs.writeFileSync(jsonFilePath, JSON.stringify(numbersArray));
  });
