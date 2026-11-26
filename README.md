# NusaStat — Portal Statistik Indonesia

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/iiifebri/entry-national-stats-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/iiifebri/entry-national-stats-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

**Angka Indonesia, dibaca semua orang.** NusaStat adalah portal statistik nasional berbahasa Indonesia: penduduk, ekonomi, ketenagakerjaan, harga, kemiskinan, kesehatan, pendidikan, dan data daerah — semuanya dari publikasi resmi, dengan sumber dan tahun di samping setiap angka.

NusaStat adalah proyek independen, bukan situs resmi BPS.

## Run it

Situs ini hanya file statis — tidak ada build step, tidak ada dependensi, tidak ada request jaringan.

```sh
python3 -m http.server --directory app 8080
```

Lalu buka http://localhost:8080 di browser.

## Yang ada di dalam

- **8 halaman**: Beranda, Penduduk, Ekonomi, Ketenagakerjaan, Harga & Inflasi, Kesehatan & Pendidikan, Daerah, Metodologi & Sumber — semua lewat hash routing, semua tautan navigasi berfungsi.
- **Grafik SVG buatan sendiri** (tanpa library): batang, garis, dan batang horizontal, lengkap dengan label sumbu, nilai, dan tabel data yang sama di halaman.
- **8 kontrol yang benar-benar berfungsi**: pemilih tahun 2020–2024, pencarian provinsi, urutkan tabel (▲▼), toggle batang/garis, toggle Rp/USD (kurs 15.855), pengalih metrik dashboard (Penduduk | PDB | TPT), toggle seri inflasi, dan menu hamburger di HP.
- **Responsif**: sidebar 248px di desktop 1280px, top bar + menu geser di HP 390px, tabel bisa digeser horizontal, target sentuh minimal 44px.

## Design decisions

- **Satu sumber kebenaran**: semua angka tinggal di `app/js/data.js`, lengkap dengan sumber dan tahun per angka. Grafik dan tabel membaca dari sana, jadi tidak ada angka grafik yang berbeda dari angka tabel.
- **Seri PBB untuk penduduk**: grafik penduduk 2020–2024 memakai estimasi PBB (World Population Prospects 2024) agar konsisten; angka BPS SUPAS 2025 (284,44 juta jiwa) dicantumkan sebagai catatan metode di halaman Penduduk dan Metodologi.
- **Angka BPS sebagai utama untuk indikator dalam negeri**: harapan hidup memakai BPS 74,15 tahun (bukan Bank Dunia 71,3 tahun, yang metodenya berbeda) — perbedaannya dijelaskan di Metodologi.
- **Offline penuh**: system font saja, tanpa CDN, tanpa font eksternal, tanpa request jaringan. Semua teks antarmuka Bahasa Indonesia.
- **Palet sendiri**: zamrud gelap `#0B5D4A`, emas kunyit `#E9A319`, latar krem kertas `#F7F5F0` — bukan meniru identitas BPS.

## Data sources

- **BPS** — PDB, PDB per kapita, pertumbuhan ekonomi, Sakernas (TPT, angkatan kerja, upah), inflasi, kemiskinan dan Gini, IPM/harapan hidup/lama sekolah, penduduk dan PDRB per kapita provinsi, SUPAS 2025.
- **Bank Dunia (World Development Indicators)** — struktur PDB menurut sektor, inflasi rata-rata tahunan, kematian bayi dan balita.
- **PBB (World Population Prospects 2024)** — seri penduduk 2020–2024, kepadatan, usia median, penduduk perkotaan, fertilitas, struktur umur.
- **CIA World Factbook** — kurs rata-rata 2024 (Rp 15.855 per USD).

Daftar lengkap setiap angka beserta publikasi dan tanggal rilisnya ada di halaman Metodologi & Sumber di situs. Data terakhir diperbarui 26 November 2026.

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
