let KEGIATAN_ALL = []
let currentPage = 1
let rowsPerPage = 10
let KEGIATAN_DATA = []
let chartInstance = null
let FILTER_TAHUN = ""

async function getData(){
  const res = await fetch(API_URL)
  return await res.json()
}

document.addEventListener("DOMContentLoaded",()=>{

  const page = window.location.pathname.split("/").pop()

  if(page === "" || page === "index.html"){
    initDashboard()
    startAutoRefresh()
  }

  if(page === "kegiatan.html"){
    loadKegiatan()
  }

})

async function loadKegiatan(){

  try{

    KEGIATAN_ALL = await getData()

    renderKegiatan()

  }catch(err){
    console.error("Load kegiatan gagal", err)
  }

}

function animateNumber(element, target){

  let start = 0
  const duration = 800
  const increment = target / (duration / 16)

  function update(){

    start += increment

    if(start < target){
      element.textContent = Math.floor(start)
      requestAnimationFrame(update)
    }else{
      element.textContent = target
    }

  }

  update()
}

async function initDashboard(){

  const data = await getData()

  // FILTER TAHUN
  if(FILTER_TAHUN){

    data = data.filter(d=>{
      const tahun = new Date(d.tanggal).getFullYear()
      return String(tahun) === FILTER_TAHUN
    })

  }

  initFilterTahun(await getData())

  animateNumber(
    document.getElementById("totalKegiatan"),
    data.length
  )

  const bulanSekarang = new Date().getMonth()

  const bulanIni = data.filter(d=>{
    const t = new Date(d.tanggal)
    return t.getMonth() === bulanSekarang
  })

  animateNumber(
  document.getElementById("kegiatanBulanIni"),
  bulanIni.length
)

  renderChart(data)
  renderRecentActivity(data)
  renderTopLokasi(data)
  renderRecentActivity(data)
  updateLastRefresh()

}

function formatTanggal(tgl){

  const d = new Date(tgl)

  return d.toLocaleDateString("id-ID",{
    day:"2-digit",
    month:"short",
    year:"numeric"
  })

}

function renderChart(data){
console.log("DATA DASHBOARD:", data)
  const skeleton = document.getElementById("chartSkeleton")
  const canvas = document.getElementById("activityChart")

  if(skeleton) skeleton.style.display="none"

  if(canvas){
  canvas.style.display="block"
  canvas.style.opacity="1"
  }

  const bulanYustisi = new Array(12).fill(0)
  const bulanNon = new Array(12).fill(0)

  data.forEach(d=>{

  if(!d.tanggal) return

  const date = new Date(d.tanggal)
  const m = date.getMonth()

  if(isNaN(m)) return

  const jenis = (d.jenis || "").toLowerCase().trim()

if(jenis === "yustisi"){
  bulanYustisi[m]++
}

else if(jenis === "non yustisi"){
  bulanNon[m]++
}

})

  const ctx = document
    .getElementById("activityChart")
    ?.getContext("2d")

  if(!ctx) return

  // gradient yustisi
  const gradientBlue = ctx.createLinearGradient(0,0,0,300)
  gradientBlue.addColorStop(0,"rgba(79,70,229,0.45)")
  gradientBlue.addColorStop(1,"rgba(79,70,229,0)")

  // gradient non yustisi
  const gradientOrange = ctx.createLinearGradient(0,0,0,300)
  gradientOrange.addColorStop(0,"rgba(249,115,22,0.45)")
  gradientOrange.addColorStop(1,"rgba(249,115,22,0)")

  if(chartInstance){
    chartInstance.destroy()
  }

  chartInstance = new Chart(ctx,{

    type:"line",

    data:{
      labels:[
        "Jan","Feb","Mar","Apr","Mei","Jun",
        "Jul","Agu","Sep","Okt","Nov","Des"
      ],

      datasets:[

        {
          label:"Yustisi",
          data:bulanYustisi,

          borderColor:"#4F46E5",
          backgroundColor:gradientBlue,

          borderWidth:3,
          tension:0.35,
          fill:true,

          pointRadius:4,
          pointHoverRadius:7,
          pointBackgroundColor:"#4F46E5",
          pointBorderColor:"#fff",
          pointBorderWidth:2
        },

        {
          label:"Non Yustisi",
          data:bulanNon,

          borderColor:"#F97316",
          backgroundColor:gradientOrange,

          borderWidth:3,
          tension:0.35,
          fill:true,

          pointRadius:4,
          pointHoverRadius:7,
          pointBackgroundColor:"#F97316",
          pointBorderColor:"#fff",
          pointBorderWidth:2
        }

      ]
    },

    options:{

      responsive:true,
      maintainAspectRatio:false,

      interaction:{
        mode:"index",
        intersect:false
      },

      plugins:{
        legend:{
          position:"top",
          labels:{
            usePointStyle:true,
            padding:20
          }
        },

        tooltip:{
          backgroundColor:"#111827",
          padding:12,
          cornerRadius:8
        }
      },

      scales:{

        x:{
          grid:{
            display:false
          }
        },

        y:{
          beginAtZero:true,
          ticks:{
            stepSize:5
          },
          grid:{
            color:"rgba(0,0,0,0.05)"
          }
        }

      },

      animation:{
        duration:1400,
        easing:"easeOutCubic"
      }

    }

  })

}

async function initKegiatan(){
   console.log("Halaman kegiatan aktif")
}

function startAutoRefresh(){

  setInterval(async ()=>{

    const page = window.location.pathname.split("/").pop()

    if(page === "" || page === "index.html"){

      console.log("Auto refresh dashboard...")

      await initDashboard()

    }

  },20000)

}

function updateLastRefresh(){

  const now = new Date()

  const time = now.toLocaleTimeString("id-ID")

  const el = document.getElementById("lastUpdate")

  if(el){
    el.textContent = "Update: " + time
  }

}

function renderRecentActivity(data){

  const tbody = document.getElementById("recentActivity")

  if(!tbody) return

  tbody.innerHTML = ""

  const sorted = [...data]
    .sort((a,b)=> new Date(b.tanggal) - new Date(a.tanggal))
    .slice(0,5)

  sorted.forEach(d=>{

    const tr = document.createElement("tr")

    tr.innerHTML = `
      <td>${formatTanggal(d.tanggal)}</td>
      <td>${d.jenis}</td>
      <td>${d.lokasi}</td>
      <td>${d.tim}</td>
    `

    tbody.appendChild(tr)

  })

}

function setActiveSidebar(){

  const links = document.querySelectorAll(".sidebar ul li a")
  const currentPage = window.location.pathname.split("/").pop()

  links.forEach(link => {

    const href = link.getAttribute("href")

    if(href === currentPage){
      link.parentElement.classList.add("active")
    }

  })

}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(setActiveSidebar, 200)
})

function renderTopLokasi(data){

const lokasiCount = {}

data.forEach(d=>{

if(!d.lokasi) return

lokasiCount[d.lokasi] = (lokasiCount[d.lokasi] || 0) + 1

})

const sorted = Object.entries(lokasiCount)
.sort((a,b)=>b[1]-a[1])
.slice(0,5)

const labels = sorted.map(i=>i[0])
const values = sorted.map(i=>i[1])

const ctx = document.getElementById("lokasiChart")

if(!ctx) return

new Chart(ctx,{

type:"bar",

data:{
labels:labels,
datasets:[{
label:"Jumlah Kegiatan",
data:values,
backgroundColor:"#4F46E5",
borderRadius:8
}]
},

options:{
responsive:true,
maintainAspectRatio:false,
plugins:{
legend:{display:false}
},
scales:{
y:{
beginAtZero:true
}
}
}

})

}

function initFilterTahun(data){

  const select = document.getElementById("filterTahun")
  if(!select) return

  const tahunSet = new Set()

  data.forEach(d=>{
    if(!d.tanggal) return
    const t = new Date(d.tanggal).getFullYear()
    tahunSet.add(t)
  })

  const sorted = [...tahunSet].sort()

  sorted.forEach(t=>{
    const opt = document.createElement("option")
    opt.value = t
    opt.textContent = t
    select.appendChild(opt)
  })

  select.addEventListener("change",()=>{
    FILTER_TAHUN = select.value
    initDashboard()
  })

}

// =========================
// EXPORT PDF
// =========================

async function exportPDF(btn){
const NAMA_INSTANSI = "PEMERINTAH KABUPATEN CILACAP"
const NAMA_DINAS = "SATUAN POLISI PAMONG PRAJA"
const ALAMAT = "Jl. Contoh Alamat No.1, Cilacap"
const JABATAN = "Kepala Satpol PP Kabupaten Cilacap"
const NAMA_PEJABAT = "MUHAMMAD BAGUS IRVANUDIEN, A.Md."
const NIP = "199606142025041002"

const original = btn.innerHTML

btn.classList.add("loading")
btn.disabled = true
btn.innerHTML = `
<div class="spinner"></div>
<span>Membuat PDF...</span>
`

try{

const { jsPDF } = window.jspdf

const data = await getData()

let filtered = data

if(FILTER_TAHUN){
filtered = data.filter(d=>{
const tahun = new Date(d.tanggal).getFullYear()
return String(tahun) === FILTER_TAHUN
})
}

// =========================
// HITUNG STATISTIK
// =========================

const total = filtered.length
const yustisi = filtered.filter(d=>d.jenis==="Yustisi").length
const non = filtered.filter(d=>d.jenis==="Non Yustisi").length

const today = new Date().toLocaleDateString("id-ID")

// =========================
// AMBIL CHART
// =========================

const chartCanvas = document.getElementById("activityChart")
const chartImage = chartCanvas.toDataURL("image/png")

// =========================
// BUAT PDF
// =========================

const pdf = new jsPDF("p","mm","a4")

// =========================
// LOAD LOGO
// =========================

const logo = new Image()
logo.src = "logo.png"

await new Promise(resolve=>{
logo.onload = resolve
})

// =========================
// KOP SURAT
// =========================

pdf.addImage(logo,"PNG",15,10,25,25)

pdf.setFontSize(14)
pdf.text(NAMA_INSTANSI,105,18,{align:"center"})

pdf.setFontSize(12)
pdf.text(NAMA_DINAS,105,25,{align:"center"})

pdf.setFontSize(10)
pdf.text(ALAMAT,105,31,{align:"center"})

// garis kop
pdf.setLineWidth(0.8)
pdf.line(14,38,196,38)

pdf.setLineWidth(0.2)
pdf.line(14,40,196,40)

pdf.setFontSize(16)
pdf.setFontSize(14)
pdf.text("LAPORAN KEGIATAN PENINDAKAN",105,55,{align:"center"})

// =========================
// INFO LAPORAN
// =========================

pdf.setFontSize(10)

pdf.text(`Tahun : ${FILTER_TAHUN || "Semua Tahun"}`,14,75)
pdf.text(`Tanggal Cetak : ${today}`,14,81)

// =========================
// STATISTIK
// =========================

pdf.setFontSize(12)
pdf.text("STATISTIK",14,90)

pdf.setFontSize(10)

pdf.text(`Total Kegiatan : ${total}`,14,98)
pdf.text(`Yustisi : ${yustisi}`,14,104)
pdf.text(`Non Yustisi : ${non}`,14,110)

// =========================
// CHART
// =========================

pdf.setFontSize(12)
pdf.text("GRAFIK KEGIATAN",14,125)

pdf.addImage(chartImage,"PNG",14,130,180,70)

// =========================
// TABEL KEGIATAN
// =========================

let y = 210

pdf.setFontSize(12)
pdf.text("DAFTAR KEGIATAN",14,y)

y += 8

pdf.setFontSize(10)

// header tabel

pdf.text("No",14,y)
pdf.text("Tanggal",24,y)
pdf.text("Jenis",60,y)
pdf.text("Lokasi",95,y)
pdf.text("Tim",150,y)

y += 2

pdf.line(14,y,196,y)

y += 6

// isi tabel

filtered.forEach((d,i)=>{

if(y>280){
pdf.addPage()
y = 20

pdf.setFontSize(10)

pdf.text("No",14,y)
pdf.text("Tanggal",24,y)
pdf.text("Jenis",60,y)
pdf.text("Lokasi",95,y)
pdf.text("Tim",150,y)

y += 2
pdf.line(14,y,196,y)
y += 6
}

pdf.text(String(i+1),14,y)
pdf.text(formatTanggal(d.tanggal),24,y)
pdf.text(d.jenis,60,y)
pdf.text(d.lokasi,95,y)
pdf.text(d.tim,150,y)

y += 6

})
// =========================
// TANDA TANGAN
// =========================

let signY = y + 15

// jika hampir habis halaman, buat halaman baru
if(signY > 260){
pdf.addPage()
signY = 40
}

pdf.setFontSize(11)

pdf.text("Mengetahui",140,signY,{align:"center"})

signY += 6

pdf.text(JABATAN,140,signY,{align:"center"})

// jarak untuk tanda tangan
signY += 20

pdf.setFontSize(11)
pdf.text(`(${NAMA_PEJABAT})`,140,signY,{align:"center"})

signY += 6

pdf.setFontSize(10)
pdf.text(`NIP. ${NIP}`,140,signY,{align:"center"})

// =========================
// SAVE PDF
// =========================

pdf.save("laporan-kegiatan.pdf")

}catch(err){

console.error(err)
alert("Gagal membuat PDF")

}

btn.classList.remove("loading")
btn.disabled = false
btn.innerHTML = original

}

// =========================
// INPUT KEGIATAN + UPLOAD FOTO
// =========================

document.addEventListener("DOMContentLoaded",()=>{

const form = document.getElementById("kegiatanForm")
const fotoInput = document.getElementById("fotoInput")
const preview = document.getElementById("previewFoto")

if(!form) return

// =========================
// SUBMIT FORM
// =========================

form.addEventListener("submit", async function(e){

  e.preventDefault()

  const btn = document.querySelector(".submit-btn")

  btn.disabled = true
  btn.innerHTML = "Menyimpan..."

  try{

    const payload = {
      mode:"save",
      tanggal: document.querySelector('[name="tanggal"]').value,
      jenis: document.querySelector('[name="jenis"]').value,
      lokasi: document.querySelector('[name="lokasi"]').value,
      uraian: document.querySelector('[name="uraian"]').value,
      tim: document.querySelector('[name="tim"]').value
    }

    console.log("PAYLOAD:", payload)

    const res = await fetch(API_URL,{
      method:"POST",
      headers:{
        "Content-Type":"text/plain"
      },
      body:JSON.stringify(payload)
    })

    const text = await res.text()
    console.log("RAW RESPONSE:", text)

    const result = JSON.parse(text)

    console.log("RESULT:", result)

    if(result.status === "success"){
      alert("✔ Data berhasil disimpan")
      form.reset()
    }else{
      alert("❌ Gagal menyimpan data")
    }

  }catch(err){

    console.error(err)
    alert("❌ Error koneksi server")

  }

  btn.disabled = false
  btn.innerHTML = "Simpan"

})

})

function initInput(){
console.log("Halaman input aktif")
}

function initDokumen(){
  console.log("Halaman dokumen aktif")
}

function compressImage(file, quality = 0.6){

return new Promise(resolve=>{

const reader = new FileReader()

reader.onload = function(e){

const img = new Image()

img.onload = function(){

const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

const maxWidth = 1200

let width = img.width
let height = img.height

if(width > maxWidth){
height *= maxWidth / width
width = maxWidth
}

canvas.width = width
canvas.height = height

ctx.drawImage(img,0,0,width,height)

const compressed = canvas.toDataURL("image/jpeg",quality)

resolve(compressed)

}

img.src = e.target.result

}

reader.readAsDataURL(file)

})

}

// ===============================
// LOAD DATA
// ===============================
async function loadKegiatan(){
  try{
    KEGIATAN_ALL = await getData()
    renderKegiatan()
  }catch(err){
    console.error("Load kegiatan gagal", err)
  }
}

// ===============================
// FILTER DATA
// ===============================
function getFilteredData(){

  let data = [...KEGIATAN_ALL]

  // 🔍 SEARCH
  const keyword = document.getElementById("searchInput")?.value.toLowerCase() || ""

  if(keyword){
    data = data.filter(d =>
      (d.lokasi || "").toLowerCase().includes(keyword) ||
      (d.tim || "").toLowerCase().includes(keyword)
    )
  }

  // 🎯 FILTER JENIS
  const jenis = document.getElementById("filterJenis")?.value
  if(jenis){
    data = data.filter(d => d.jenis === jenis)
  }

  // 📅 FILTER BULAN
  const bulan = document.getElementById("filterBulan")?.value
  if(bulan){
    data = data.filter(d => {
      const tgl = new Date(d.tanggal)
      const format = tgl.toISOString().slice(0,7)
      return format === bulan
    })
  }

  return data
}

// ===============================
// RENDER TABLE + PAGINATION
// ===============================
function renderKegiatan(){

  const tbody = document.querySelector("#kegiatanTable tbody")
  if(!tbody) return

  tbody.innerHTML = ""

  const filtered = getFilteredData()

  const start = (currentPage - 1) * rowsPerPage
  const end = start + rowsPerPage

  const data = filtered.slice(start, end)

  data.forEach(d => {

    const tr = document.createElement("tr")

    tr.innerHTML = `
      <td>${formatTanggal(d.tanggal)}</td>
      <td>${d.jenis}</td>
      <td>${d.lokasi}</td>
      <td>${d.tim}</td>
      <td>-</td>
      <td>-</td>
      <td>${d.input}</td>
    `

    tbody.appendChild(tr)

  })

  updatePaginationInfo()
}

// ===============================
// PAGINATION INFO
// ===============================
function updatePaginationInfo(){

  const total = getFilteredData().length
  const totalPage = Math.ceil(total / rowsPerPage)

  const el = document.getElementById("pageInfo")

  if(el){
    el.textContent = `Halaman ${currentPage} dari ${totalPage || 1}`
  }
}

// ===============================
// EVENT LISTENER
// ===============================
document.addEventListener("DOMContentLoaded",()=>{

  // LOAD DATA
  if(window.location.pathname.includes("kegiatan.html")){
    loadKegiatan()
  }

  // SEARCH
  document.getElementById("searchInput")?.addEventListener("input", ()=>{
    currentPage = 1
    renderKegiatan()
  })

  // FILTER JENIS
  document.getElementById("filterJenis")?.addEventListener("change", ()=>{
    currentPage = 1
    renderKegiatan()
  })

  // FILTER BULAN
  document.getElementById("filterBulan")?.addEventListener("change", ()=>{
    currentPage = 1
    renderKegiatan()
  })

  // DROPDOWN JUMLAH DATA
  document.getElementById("rowsPerPage")?.addEventListener("change", function(){
    rowsPerPage = parseInt(this.value)
    currentPage = 1
    renderKegiatan()
  })

  // NEXT
  document.getElementById("nextPage")?.addEventListener("click", ()=>{
    if(currentPage * rowsPerPage < getFilteredData().length){
      currentPage++
      renderKegiatan()
    }
  })

  // PREV
  document.getElementById("prevPage")?.addEventListener("click", ()=>{
    if(currentPage > 1){
      currentPage--
      renderKegiatan()
    }
  })

})

