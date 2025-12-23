const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static('public'));


app.get('/admin', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Admin Paneli</title>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; background-color: #f4f4f4; }
                form { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); max-width: 500px; margin: auto; }
                input, textarea { width: 100%; padding: 10px; margin: 10px 0; box-sizing: border-box; }
                button { background-color: #28a745; color: white; border: none; padding: 10px 20px; cursor: pointer; width: 100%; }
                button:hover { background-color: #218838; }
            </style>
        </head>
        <body>
            <h2 style="text-align:center;">Yeni İçerik Oluştur</h2>
            <form action="/admin/create" method="POST">
                <label>Yönetici Şifresi:</label>
                <input type="password" name="password" required placeholder="Şifre">
                
                <label>Sayfa Başlığı:</label>
                <input type="text" name="baslik" required placeholder="Örn: Bu Hafta Neler Yaptım?">
                
                <label>İçerik:</label>
                <textarea name="icerik" rows="6" required placeholder="Yazını buraya gir..."></textarea>
                
                <button type="submit">SİTEYİ OLUŞTUR VE KAYDET</button>
            </form>
        </body>
        </html>
    `);
});


app.post('/admin/create', (req, res) => {
    const { password, baslik, icerik } = req.body;

    // mukemmel guvenlik
    if (password !== '1234') {
        return res.send('<h1 style="color:red; text-align:center;">Hatalı Şifre! 🚫</h1><p style="text-align:center;"><a href="/admin">Geri Dön</a></p>');
    }


    const turkceKarakterler = { 'ı': 'i', 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c', 'İ': 'I', 'Ğ': 'G', 'Ü': 'U', 'Ş': 'S', 'Ö': 'O', 'Ç': 'C' };
    let temizBaslik = baslik.replace(/[ığüşöçİĞÜŞÖÇ]/g, harf => turkceKarakterler[harf]);
    const dosyaAdi = temizBaslik.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') + '.html';
    

    const dosyaYolu = path.join(__dirname, 'public', dosyaAdi);

   
    const htmlIcerigi = `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${baslik}</title>
    <link rel="stylesheet" href="style.css"> <style>
        .container { max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
        .back-link { display: inline-block; margin-top: 20px; padding: 10px 15px; background: #333; color: white; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${baslik}</h1>
        <hr>
        <div class="content">
            <p>${icerik}</p>
        </div>
        <br>
        <a href="/" class="back-link">← Ana Sayfaya Dön</a>
    </div>
</body>
</html>`;

  
    fs.writeFile(dosyaYolu, htmlIcerigi, (err) => {
        if (err) {
            console.error(err);
            return res.send('Dosya oluşturulurken bir hata oluştu.');
        }
        
        console.log(`${dosyaAdi} oluşturuldu!`);
        
       
        res.send(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: green;">✅ Başarılı!</h1>
                <p>Yeni sayfa fiziksel olarak oluşturuldu ve kaydedildi.</p>
                <p>Dosya Adı: <strong>${dosyaAdi}</strong></p>
                <br>
                <a href="/${dosyaAdi}" style="padding: 15px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">Yeni Sayfayı Görüntüle</a>
                <br><br>
                <a href="/admin">Yeni Bir Tane Daha Ekle</a>
            </div>
        `);
    });
});

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});