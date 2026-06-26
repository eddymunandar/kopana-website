# KOPANA Yogyakarta — Website Resmi

**Koperasi Jasa Serba Usaha Purnakaryawan Pertamina KOPANA Yogyakarta**

> Melayani Anggota dengan Integritas dan Kebersamaan Sejak 1996

---

## 📋 Deskripsi

Website resmi **KOPANA** (Koperasi Jasa Serba Usaha Purnakaryawan Pertamina) Yogyakarta.
Dibangun dengan HTML5, CSS3, dan Vanilla JavaScript — tanpa framework, ringan, cepat, dan siap deploy.

---

## 🗂️ Struktur File

```
/
├── index.html              # Halaman utama
├── favicon.ico             # Favicon
├── robots.txt              # Panduan crawler mesin pencari
├── sitemap.xml             # Sitemap SEO
├── README.md               # Dokumentasi ini
│
└── assets/
    ├── css/
    │   └── style.css       # Stylesheet utama (design tokens, komponen, responsive)
    ├── js/
    │   └── script.js       # JavaScript utama
    ├── img/                # Gambar & foto
    └── icons/              # Ikon tambahan (jika ada)
```

---

## 🚀 Deploy ke Cloudflare Pages

### Cara 1: Upload Langsung (Drag & Drop)

1. Login ke [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Masuk ke **Pages** → **Create a project**
3. Pilih **Direct Upload**
4. Upload seluruh folder website ini
5. Selesai! Website langsung live.

### Cara 2: GitHub + Cloudflare Pages (Rekomendasi)

1. Push seluruh folder ini ke repository GitHub
2. Di Cloudflare Pages, klik **Connect to Git**
3. Pilih repository GitHub Anda
4. Konfigurasi build:
   - **Framework preset:** `None`
   - **Build command:** *(kosongkan)*
   - **Build output directory:** `/` (root)
5. Klik **Save and Deploy**

---

## ⚙️ Konfigurasi & Kustomisasi

### Placeholder yang Harus Diganti

Cari dan ganti placeholder berikut di seluruh file:

| Placeholder | Keterangan | File |
|---|---|---|
| `https://script.google.com/macros/s/AKfycbzYDPTRz9usUEwOhgWEy7Y4HiC_gfKxQ310KWAr4seA3KgrFXObiEX1VAPjaUclF7XG/exec` | URL aplikasi anggota Google Apps Script | `index.html`, `assets/js/script.js` |
| `EMAIL_KOPERASI` | Email resmi KOPANA | `index.html` |
| `JUMLAH_ANGGOTA` | Jumlah anggota aktif (angka) | `index.html` |
| `SAMBUTAN_KETUA` | Teks sambutan ketua | `index.html` |
| `GOOGLE_MAPS` | Embed Google Maps | `index.html` |
| `https://script.google.com/macros/s/AKfycbzYDPTRz9usUEwOhgWEy7Y4HiC_gfKxQ310KWAr4seA3KgrFXObiEX1VAPjaUclF7XG/exec` | URL API Google Apps Script | `assets/js/script.js` |

### Cara Mengganti Placeholder

```bash
# Contoh mengganti https://script.google.com/macros/s/AKfycbzYDPTRz9usUEwOhgWEy7Y4HiC_gfKxQ310KWAr4seA3KgrFXObiEX1VAPjaUclF7XG/exec secara massal (Linux/Mac):
sed -i 's|https://script.google.com/macros/s/AKfycbzYDPTRz9usUEwOhgWEy7Y4HiC_gfKxQ310KWAr4seA3KgrFXObiEX1VAPjaUclF7XG/exec|https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec|g' index.html
```

---

## 🔗 Integrasi Google Apps Script

Website ini siap diintegrasikan dengan Google Apps Script sebagai backend CMS.

### Format Response API yang Diharapkan

**Endpoint Berita** (`?action=getBerita&limit=3`):
```json
{
  "success": true,
  "items": [
    {
      "judul": "Judul Berita",
      "tanggal": "26 Juni 2026",
      "penulis": "Redaksi",
      "kategori": "RAT",
      "ringkasan": "Ringkasan berita...",
      "foto": "https://...",
      "url": "https://..."
    }
  ]
}
```

**Endpoint Statistik** (`?action=getStatistik`):
```json
{
  "success": true,
  "anggota": 450
}
```

### Mengaktifkan API

Di file `assets/js/script.js`, uncomment baris berikut dan isi URL:

```javascript
const KopanaAPI = {
  scriptUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
  // ...
};

// Uncomment baris ini untuk mengaktifkan:
KopanaAPI.getBerita();
KopanaAPI.getStatistik();
```

---

## 🎨 Fitur

| Fitur | Status |
|---|---|
| Responsive (Desktop/Tablet/Mobile) | ✅ |
| Dark Mode | ✅ |
| Loading Screen | ✅ |
| Sticky Navbar | ✅ |
| Smooth Scroll | ✅ |
| Scroll Reveal Animation | ✅ |
| Counter Animation | ✅ |
| Galeri + Filter + Lightbox | ✅ |
| Back to Top | ✅ |
| SEO Friendly | ✅ |
| Open Graph Meta | ✅ |
| Structured Data (JSON-LD) | ✅ |
| Accessibility (ARIA) | ✅ |
| Lazy Loading Images | ✅ |
| API Ready (Google Apps Script) | ✅ |
| Siap Deploy Cloudflare Pages | ✅ |

---

## 🔧 Pengembangan Lokal

Karena website ini adalah HTML statis, cukup buka `index.html` di browser.

Atau gunakan Live Server (VSCode extension) untuk hot reload:

```bash
# Jika menggunakan Node.js
npx serve .

# Atau Python
python3 -m http.server 8080
```

Buka: `http://localhost:8080`

---

## 📞 Informasi Kontak

- **Alamat:** Brambang Gatak, Selomartani, Kalasan, Sleman, DIY
- **Telepon:** 0822 2715 4266
- **Website:** [kopana.id](https://kopana.id)
- **Domain:** kopana.id

---

## 📄 Lisensi & Hak Cipta

© 2026 Koperasi Jasa Serba Usaha Purnakaryawan Pertamina KOPANA Yogyakarta.  
Seluruh hak cipta dilindungi.

---

*Dibuat dengan ❤️ untuk KOPANA Yogyakarta*
