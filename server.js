const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Dosya Yolları
const DATA_FILE = path.join(__dirname, 'data', 'latest.json');
const ARCHIVE_FILE = path.join(__dirname, 'data', 'archive.json');

// 1. Ana Sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 2. Admin Sayfası
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// API: Güncel veriyi getir
app.get('/api/get-status', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.json({ date: "", content: "Veri yok" });
        res.json(JSON.parse(data));
    });
});

// API: YENİ VERİYİ KAYDET (Ve eskisini arşivle!)
app.post('/api/update-status', (req, res) => {
    const { password, content } = req.body;
    
    if (password !== '1234') {
        return res.json({ success: false, message: 'Şifre Yanlış!' });
    }

    // A) ÖNCE ESKİ VERİYİ OKU (Arşive atmak için)
    fs.readFile(DATA_FILE, 'utf8', (err, currentDataRaw) => {
        // Eğer dosya boşsa veya okunamazsa boş bir obje varsay
        let oldData = {};
        try { oldData = JSON.parse(currentDataRaw); } catch(e) {}

        // Eğer eski veri varsa, onu Arşive ekle
        if (oldData.content && oldData.content !== "Henüz veri girilmedi.") {
            fs.readFile(ARCHIVE_FILE, 'utf8', (err, archiveRaw) => {
                let archive = [];
                try { archive = JSON.parse(archiveRaw); } catch(e) { archive = []; }

                // Eski veriyi listeye ekle
                archive.push(oldData);

                // Arşiv dosyasını kaydet
                fs.writeFile(ARCHIVE_FILE, JSON.stringify(archive, null, 2), () => {});
            });
        }

        // B) ŞİMDİ YENİ VERİYİ KAYDET
        const newData = {
            date: new Date().toLocaleDateString('tr-TR'),
            content: content
        };

        fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2), (err) => {
            if (err) return res.json({ success: false, message: 'Yazma hatası!' });
            res.json({ success: true, message: 'Güncellendi ve eski yazı arşivlendi!' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});