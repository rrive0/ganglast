const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/gangItems", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error: ", err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Item Schema
const itemSchema = new mongoose.Schema({
  name: String,
  image: String,
  amount: Number
});

const Item = mongoose.model("Item", itemSchema);

// API to add items
app.post("/add-item", async (req, res) => {
  const { name, image, amount } = req.body;
  const newItem = new Item({ name, image, amount });
  try {
    await newItem.save();
    res.status(200).send("Item added successfully");
  } catch (error) {
    res.status(400).send("Error adding item");
  }
});

// API to get items
app.get("/get-items", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(400).send("Error fetching items");
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
