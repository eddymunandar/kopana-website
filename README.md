# KOPANA Yogyakarta — Website Resmi

**Koperasi Jasa Serba Usaha Purnakaryawan Pertamina KOPANA Yogyakarta**

> Melayani Anggota dengan Integritas dan Kebersamaan Sejak 1996

---

## Deskripsi

Website resmi **KOPANA** (kopana.id). Dibangun dengan HTML5, CSS3, dan Vanilla JavaScript — tanpa framework dan tanpa build step. Konten dikelola melalui **Sveltia CMS** di halaman `/admin/` yang menyimpan data sebagai file JSON di folder `data/` dan meng-commit-nya langsung ke repo GitHub. Setiap commit otomatis di-deploy oleh **Cloudflare Pages**.

---

## Struktur File

```
/
├── index.html              # Halaman utama
├── pengurus.html           # Struktur organisasi (pengurus, pengawas, cabang)
├── faq.html                # FAQ
├── unduhan.html            # Pusat unduhan dokumen
├── daftar.html             # Formulir pendaftaran anggota (isi → cetak A4)
├── pengunduran.html        # Formulir pengunduran diri (isi → cetak A4)
│
├── admin/
│   ├── index.html          # Loader Sveltia CMS
│   └── config.yml          # Skema koleksi CMS → data/*.json
│
├── data/                   # Konten website (dikelola via CMS, JANGAN edit manual)
│   ├── pengaturan.json     # Nama, tagline, logo, versi counter pengunjung
│   ├── beranda.json        # Hero + sambutan ketua
│   ├── profil.json         # Sejarah, visi, misi
│   ├── pengurus.json       # Pengurus, pengawas, cabang
│   ├── berita.json         # Berita & pengumuman
│   ├── galeri.json         # Galeri foto (kategori → tombol filter otomatis)
│   ├── usaha.json          # Bidang usaha
│   ├── statistik.json      # KOPANA dalam angka
│   ├── kontak.json         # Alamat, telepon, email, embed Google Maps
│   ├── faq.json            # Daftar FAQ
│   ├── formulir.json       # Dokumen unduhan (+ PIN dokumen terkunci)
│   └── pengumuman.json     # Popup pengumuman
│
├── assets/
│   ├── css/style.css       # Stylesheet utama
│   ├── js/script.js        # JavaScript utama (UI + KopanaAPI)
│   └── img/                # Gambar situs; img/uploads/ = media dari CMS
│
├── _headers                # Header keamanan & cache (Cloudflare Pages)
├── _redirects              # Aturan redirect (Cloudflare Pages)
├── robots.txt, sitemap.xml # SEO
├── manifest.json           # Manifest PWA (ikon & warna)
└── favicon.ico
```

---

## Cara Kerja Konten

1. Pengurus login ke `https://kopana.id/admin/` (Sveltia CMS, autentikasi GitHub).
2. Perubahan disimpan sebagai commit ke repo `eddymunandar/kopana-website` branch `main`.
3. Cloudflare Pages otomatis men-deploy ulang; perubahan tampil dalam ±5 menit
   (file `data/*.json` di-cache browser maksimal 5 menit).
4. `assets/js/script.js` membaca `data/*.json` lalu merender konten ke halaman.

### Catatan penting untuk pengelola

- **Tanggal berita** wajib berformat `DD MMM YYYY` (contoh: `15 Jan 2026`) — dipakai untuk mengurutkan berita.
- **Kategori galeri** bebas diisi; tombol filter di halaman utama dibangun otomatis dari kategori yang ada.
- **Foto**: usahakan unggah foto maksimal ±1600 px dan di bawah 300 KB agar situs tetap cepat.
- **PIN dokumen terkunci** (`formulir.json`) hanya penghalang ringan di sisi browser, BUKAN proteksi keamanan sungguhan — jangan gunakan untuk dokumen rahasia.
- Jika mengubah `style.css` atau `script.js`, naikkan parameter versi `?v=...` di semua file HTML agar cache pengunjung diperbarui.

---

## Deploy (Cloudflare Pages)

Repo GitHub sudah terhubung ke Cloudflare Pages:

- **Framework preset:** None
- **Build command:** (kosong)
- **Build output directory:** `/` (root)

Setiap push ke `main` otomatis ter-deploy.

---

## Pengembangan Lokal

```bash
# Node.js
npx serve .

# Atau Python
python3 -m http.server 8080
```

Buka `http://localhost:8080`. (Membuka index.html langsung dari file explorer tidak akan memuat data JSON karena batasan fetch pada protokol file://.)

---

## Informasi Kontak

- **Alamat:** Brambang Gatak, Selomartani, Kalasan, Sleman, DIY
- **Telepon/WA:** 0822 2715 4266
- **Email:** kopanayk@gmail.com
- **Website:** [kopana.id](https://kopana.id)

---

© 2026 Koperasi Jasa Serba Usaha Purnakaryawan Pertamina KOPANA Yogyakarta.
