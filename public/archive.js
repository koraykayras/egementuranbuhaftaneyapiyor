fetch("/get-archive")
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("archive-list");

    if (!data || data.length === 0) {
      list.innerHTML = "<p>Henüz geçmiş kayıt yok.</p>";
      return;
    }

    data.forEach(item => {
      const div = document.createElement("div");
      div.className = "archive-item";

      const date = item.date || "Tarih yok";
      const content = item.content || "İçerik yok";

      div.innerHTML = `
        <h3>${date}</h3>
        <p>${content}</p>
      `;

      list.appendChild(div);
    });
  })
  .catch(err => {
    console.error(err);
    document.getElementById("archive-list").innerHTML = "<p>Veri alınırken hata oluştu.</p>";
  });
