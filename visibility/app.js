const express = require("express");
const app = express();
const port = 3004;
const axios = require("axios");

// Endpoint to retrieve product status by ID
app.get("/productStatus/:id", async (req, res) => {
  // Retrieve the product ID from the request parameters
  const productId = req.params.id; // TODO: Fetch the product status from the database or another service // Replace the code below with the actual logic to retrieve the product status
  const response = await axios.get(
    `http://localhost:3003/productMovement/${req.params.id}`
  );
  // const productStatus = {
  //   id: productId,
  //   status: "In transit",
  //   location: "Warehouse A",
  //   timestamp: "2023-05-09T10:30:00Z", // Additional product status properties...
  // }; // Send the product status as the response
  res.send(response.data[response.data.length - 1]);
});

// Start the server
app.listen(3004, () => {
  console.log("Visibility microservice listening on port 3004");
});
