const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// ใช้ CORS เพื่ออนุญาตให้ทุกโดเมนเข้าถึงเซิร์ฟเวอร์ได้
app.use(cors());

// เสิร์ฟไฟล์หน้าเว็บจาก public/
app.use(express.static('public')); 

// รองรับการรับข้อมูลในรูปแบบ JSON
app.use(express.json());

const filePath = path.join(__dirname, 'iteam.json'); // เปลี่ยนจาก iteam.js เป็น iteam.json

// อ่านข้อมูล
app.get('/items', (req, res) => {
  try {
    if (!fs.existsSync(filePath)) return res.json([]); // ถ้าไฟล์ไม่พบ ก็ส่งกลับเป็น array ว่าง
    const raw = fs.readFileSync(filePath, 'utf-8');
    const items = JSON.parse(raw || '[]'); // ถ้าไม่มีข้อมูลก็ส่งกลับเป็น array ว่าง
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'ไม่สามารถอ่านไฟล์ได้' });
  }
});

// เพิ่มข้อมูล
app.post('/add-item', (req, res) => {
  const { name, image, amount } = req.body;

  if (!name || !image || typeof amount !== 'number') {
    return res.status(400).json({ error: 'ข้อมูลไม่ครบถ้วน' });
  }

  try {
    let items = [];
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      items = JSON.parse(raw || '[]');
    }
    items.push({ name, image, amount });
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2)); // เขียนข้อมูลลงไฟล์
    res.status(200).json({ message: 'เพิ่มข้อมูลสำเร็จ' });
  } catch (err) {
    res.status(500).json({ error: 'บันทึกไม่สำเร็จ' });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
