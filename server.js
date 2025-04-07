const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// เชื่อมต่อ MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.log("❌ MongoDB connection error: ", err));

app.use(cors());
app.use(bodyParser.json());

// Schema และ Model
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  amount: { type: Number, required: true },
});
const Item = mongoose.model("Item", itemSchema);

// POST /add-item
app.post("/add-item", async (req, res) => {
  try {
    const { name, image, amount } = req.body;

    // ตรวจสอบข้อมูลที่ได้รับ
    if (!name || !image || !amount) {
      return res.status(400).json({ error: "ข้อมูลไม่ครบ" });
    }

    // สร้างและบันทึก Item ใหม่
    const newItem = new Item({ name, image, amount });
    await newItem.save();

    res.status(200).json({ message: "เพิ่มของสำเร็จ" });
  } catch (error) {
    console.error("❌ Error saving item:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
