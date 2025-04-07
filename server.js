const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config(); // <== โหลดค่าจาก .env

const Item = require('./models/item');  // <== นำเข้า Model ของ Item

const app = express();

// เชื่อม MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // หยุดการทำงานของแอปพลิเคชันถ้าไม่สามารถเชื่อมต่อ MongoDB ได้
  });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API สำหรับเพิ่มไอเทม
app.post('/add-item', async (req, res) => {
  const { name, imageURL, quantity } = req.body;

  if (!name || !imageURL || !quantity) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newItem = new Item({
      name,
      imageURL,
      quantity
    });

    await newItem.save();  // บันทึกไอเทมใหม่ลงใน MongoDB

    res.status(201).json(newItem);  // ส่งข้อมูลไอเทมที่เพิ่มเข้าไปกลับ
  } catch (error) {
    console.error("Error saving item:", error);
    res.status(500).json({ message: 'Error saving item' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
