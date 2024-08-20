const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 3001;
const { ObjectId } = require("mongodb");

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
const schemaJson = {
  product_name: String,
  manufacturer: String,
  serial_number: String,
  manufacture_date: String,
  location: String,
  quantity: String,
}
const productSchema = new mongoose.Schema(schemaJson);


const Product = mongoose.model("Product", productSchema);

app.use(bodyParser.json());

app.get("/data", async (req, res) => {
  try {
    const productDetail = await Product.find();
    console.log(productDetail);
    res.json(productDetail);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

app.get("/data/:id", async (req, res) => {
  try {
    const productDetail = await Product.findOne({
      _id: new ObjectId(req.params.id),
    });
    res.json(productDetail);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

app.post("/data", async (req, res) => {
  console.log("now in POST API of data collection service", req.body);
  try {
    const product_detail = new Product({
      product_name: req.body.product_name,
      manufacturer: req.body.manufacturer,
      serial_number: req.body.serial_number,
      manufacture_date: req.body.manufacture_date,
      location: req.body.location,
      quantity: req.body.quantity,
    });
    const savedProduct = await product_detail.save();
    res.json(savedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
