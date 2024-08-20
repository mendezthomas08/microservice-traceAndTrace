const express = require("express");
const axios = require("axios");
const app = express();
const port = 3005;

// Endpoint to retrieve product status by ID

// GET /reports/{type} endpoint
app.get("/reports/:type", async (req, res) => {
  const reportType = req.params.type;
  console.log("sssssssssssssssssssss", reportType);

  try {
    if (reportType === "inventory") {
      const inventoryReport = await generateInventoryReport();
      console.log("asddddddddddddddddddddddddddd", inventoryReport);

      res.send(inventoryReport);
    } else if (reportType === "movement") {
      const movementReport = await generateMovementReport();
      res.json(movementReport);
    } else {
      res.status(400).json({ error: "Invalid report type" });
    }
  } catch (error) {
    // res.status(500).json({ error: "Failed to generate report" });
  }
});

// Function to generate the product inventory report
async function generateInventoryReport() {
  // Retrieve product details from the Data storage and management microservice
  const response = await axios.get(`http://localhost:3001/data`);
  // You would need to implement the code to make the API request and handle the response
  // console.log(response.data);
  // For demonstration purposes, let's assume the product data is retrieved synchronously

  return response.data;
}

// Function to generate the product movement report
function generateMovementReport() {
  // Retrieve product movement details from the Traceability microservice
  const movementData = getProductMovementData(); // Format the product movement data into the movement report format

  return movementData;
}

// Function to retrieve product details from the Data storage and management microservice
async function getProductData() {
  // Make an HTTP request to the Data storage and management microservice to retrieve the product data
  const response = await axios.get(`http://localhost:3001/data`);
  // You would need to implement the code to make the API request and handle the response
  // console.log(response.data);
  // For demonstration purposes, let's assume the product data is retrieved synchronously

  return response.data;
}

// Function to retrieve product movement details from the Traceability microservice
async function getProductMovementData() {
  // Make an HTTP request to the Traceability microservice to retrieve the product movement data
  const response = await axios.get(`http://localhost:3003/productMovement`);
  console.log(response.data);

  // You would need to implement the code to make the API request and handle the response
  return response.data;
}

// Start the server
app.listen(3005, () => {
  console.log("Visibility microservice listening on port 3005");
});
