const express = require('express');
const multer  = require('multer');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Разрешаем запросы с любого домена
app.use(cors());

// Папка, где будут храниться загруженные фото
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Настройка multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename:    (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Эндпоинт для загрузки
app.post('/upload', upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Эндпоинт для списка всех фото
app.get('/photos', (req, res) => {
  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) return res.status(500).send('Error reading files.');
    res.json(files.map(f => `/uploads/${f}`));
  });
});

// Раздача статичных файлов из папки uploads
app.use('/uploads', express.static(UPLOAD_DIR));

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
