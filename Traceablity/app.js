const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const { ObjectId } = require("mongodb");

const app = express();
const port = 3003;

app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/traceability", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(err);
  });

const productMovementSchema = new mongoose.Schema({
  product_id: String,
  from_location: String,
  to_location: String,
  quantity: String,
  date: String,
});

const ProductMovement = mongoose.model(
  "productMovement",
  productMovementSchema
);

app.use(bodyParser.json());

app.get("/productMovement", async (req, res) => {
  console.log("Analysis ");
  try {
    const productMovementResult = await ProductMovement.find();
    res.json(productMovementResult);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

app.get("/productMovement/:id", async (req, res) => {
  console.log("Analysis ");
  try {
    const productMovementResult = await ProductMovement.find({
      product_id: new ObjectId(req.params.id),
    });
    res.json(productMovementResult);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

app.post("/analyze", async (req, res) => {
  // try {
  //   const todo = new Todo({
  //     text: req.body.text,
  //     completed: false,
  //   });
  //   const savedTodo = await todo.save();
  //   res.json(savedTodo);
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).send("Internal server error");
  // }
});

app.post("/productMovement/:id", async (req, res) => {
  try {
    // Retrieve data from another microservice API using the ID provided in the request
    console.log(req.body);
    const response = await axios.get(
      `http://localhost:3001/data/${req.params.id}`
    );
    console.log(response, "sddddddddd");
    if (response) {
      const productMovementObj = new ProductMovement({
        product_id: req.params.id,
        from_location: req.body.from_location,
        to_location: req.body.to_location,
        quantity: req.body.quantity,
        date: req.body.date,
      });
      const productMovementSaved = await productMovementObj.save();

      res.json(productMovementSaved);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving data for analysis");
  }
});

function performAnalysis(data) {
  // This is just a placeholder function for demonstration purposes
  const analysisResults = {
    product_name: data.product_name,
    manufacturer: data.manufacturer,
    analysis_date: new Date(),
    analysis_result: "This is a sample analysis result",
    analysis_type: "Sales Forecast",
    analysis_result: "Projected sales for next quarter: 500 units",
  };
  return analysisResults;
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
