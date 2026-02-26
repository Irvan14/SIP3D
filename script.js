const API_URL = "https://script.google.com/macros/s/AKfycbziTjfC3Sh0jor3rLIeUkseqQ6EUIfNjDorS8WQsSuiVsbgH27N0VyO822ezRlz_X-RQw/exec";

fetch(API_URL)
  .then(response => response.json())
  .then(data => {
    if (data.length > 1) {
      const total = data.length - 1;
      document.getElementById("totalKegiatan").innerText = total;

      const bulanSekarang = new Date().getMonth();
      let countBulanIni = 0;

      for (let i = 1; i < data.length; i++) {
        const tanggal = new Date(data[i][1]);
        if (tanggal.getMonth() === bulanSekarang) {
          countBulanIni++;
        }
      }

      document.getElementById("bulanIni").innerText = countBulanIni;
    }
  })
  .catch(error => console.error("Error:", error));
