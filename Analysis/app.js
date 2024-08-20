const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const { ObjectId } = require("mongodb");

const app = express();
const port = 3000;

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

const analysisResultSchema = new mongoose.Schema({
  product_name: String,
  manufacturer: String,
  analysis_date: Date,
  analysis_result: String,
  analysis_type: String,
});

const AnalysisResult = mongoose.model("analysisResults", analysisResultSchema);

app.use(bodyParser.json());

app.get("/analysis/:id", async (req, res) => {
  console.log("Analysis ");
  try {
    const analysisResult = await AnalysisResult.findOne({
      _id: new ObjectId(req.params.id),
    });
    res.json(analysisResult);
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

app.post("/analyze/:id", async (req, res) => {
  try {
    // Retrieve data from another microservice API using the ID provided in the request
    const response = await axios.get(
      `http://localhost:3001/data/${req.params.id}`
    );
    const data = response.data; // Perform analysis on the data
    const analysisResults = performAnalysis(data); // Return the analysis results
    console.log("data", data, "analysisResults ", analysisResults);
    const analysisObj = new AnalysisResult({
      ...analysisResults,
    });

    const analysisResultSaved = await analysisObj.save();
    res.json(analysisResultSaved);
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
