/* NusaStat — Portal Statistik Indonesia.
   Satu-satunya sumber angka di situs ini. Semua angka terverifikasi
   dari publikasi BPS, Bank Dunia, dan PBB (lihat halaman Metodologi).
   Tidak ada angka estimasi sendiri di sini. */

var NUSADATA = {
  meta: {
    country: 'Indonesia',
    updated: '26 November 2026',
    kursUsd2024: 15855,
    kursSource: 'CIA World Factbook, 2024'
  },

  penduduk: {
    source: 'PBB, World Population Prospects 2024',
    series: [
      { year: 2020, value: 274814866, growth: 0.85 },
      { year: 2021, value: 276758053, growth: 0.71 },
      { year: 2022, value: 278830529, growth: 0.75 },
      { year: 2023, value: 281190067, growth: 0.85 },
      { year: 2024, value: 283487931, growth: 0.82 }
    ],
    density: { value: 156, unit: 'jiwa/km²', source: 'PBB, World Population Prospects 2024' },
    medianAge: { value: 30.1, unit: 'tahun', source: 'PBB, World Population Prospects 2024' },
    urban: { value: 59.0, unit: '%', source: 'PBB, World Population Prospects 2024' },
    fertility: { value: 2.12, unit: 'anak per perempuan', source: 'PBB, World Population Prospects 2024' },
    age014: { value: 24.6, unit: '%', source: 'PBB, World Population Prospects 2024' },
    age65: { value: 7.3, unit: '%', source: 'PBB, World Population Prospects 2024' },
    supasNote: {
      text: 'BPS SUPAS 2025 mencatat 284,44 juta jiwa pada pertengahan 2025 dengan laju tumbuh 1,11%. Angka BPS dan PBB berbeda karena metode: BPS memakai registrasi dan proyeksi, PBB memakai estimasi. Situs ini memakai seri PBB agar grafik 2020–2024 konsisten.',
      source: 'BPS, SUPAS 2025'
    }
  },

  ekonomi: {
    source: 'BPS / IMF',
    pdb: [
      { year: 2020, rpTriliun: 15443.4, usdMiliar: 1059.1, growth: -2.07 },
      { year: 2021, rpTriliun: 16976.8, usdMiliar: 1186.5, growth: 3.70 },
      { year: 2022, rpTriliun: 19588.5, usdMiliar: 1319.1, growth: 5.31 },
      { year: 2023, rpTriliun: 20892.3, usdMiliar: 1371.2, growth: 5.05 },
      { year: 2024, rpTriliun: 22139.0, usdMiliar: 1396.3, growth: 5.03 }
    ],
    pdbPerKapita: {
      rp: 'Rp 78,62 juta',
      usd: 'US$4.960,33',
      source: 'BPS, rilis 5 Februari 2025',
      worldBankUsd: 'US$4.925'
    },
    pdb2025: { growth: 5.11, nominalRpTriliun: 23821.1, source: 'BPS, rilis 5 Februari 2026' },
    sektor2024: [
      { label: 'Pertanian', value: 12.6 },
      { label: 'Industri', value: 39.3 },
      { label: 'Jasa', value: 43.8 }
    ],
    sektorSource: 'Bank Dunia, World Development Indicators',
    sektorNote: 'Sisa ±4,3% adalah pajak bersih atas produk yang tidak dialokasikan ke sektor.',
    lapanganTerbesarQ32024: [
      { label: 'Manufaktur', value: 19.02 },
      { label: 'Pertanian, kehutanan, dan perikanan', value: 13.71 },
      { label: 'Perdagangan', value: 13.09 },
      { label: 'Konstruksi', value: 10.06 },
      { label: 'Pertambangan', value: 9.06 }
    ],
    lapanganSource: 'BPS, Kuartal III 2024'
  },

  ketenagakerjaan: {
    tptAgustus: [
      { year: 2020, value: 7.07 },
      { year: 2021, value: 6.49 },
      { year: 2022, value: 5.86 },
      { year: 2023, value: 5.32 },
      { year: 2024, value: 4.91 }
    ],
    tptSource: 'BPS, Sakernas (Agustus)',
    feb2025: {
      tpt: 4.76,
      tptFeb2024: 4.82,
      angkatanKerjaJt: 153.05,
      bekerjaJt: 145.77,
      menganggurJt: 7.28,
      tpak: 70.60,
      formal: 40.60,
      informal: 59.40,
      upahRataRata: 'Rp 3,09 juta/bulan',
      source: 'BPS, Berita Resmi Statistik, 5 Mei 2025'
    },
    lapanganTerbesar: [
      { label: 'Pertanian, kehutanan, dan perikanan', value: 28.54 },
      { label: 'Perdagangan', value: 19.26 }
    ],
    lapanganSource: 'BPS, Sakernas Februari 2025'
  },

  harga: {
    inflasi: [
      { year: 2020, desember: 1.68, tahunan: 1.92 },
      { year: 2021, desember: 1.87, tahunan: 1.56 },
      { year: 2022, desember: 5.51, tahunan: 4.21 },
      { year: 2023, desember: 2.61, tahunan: 3.67 },
      { year: 2024, desember: 1.57, tahunan: 2.18 }
    ],
    desemberSource: 'BPS (inflasi Desember, year-on-year)',
    tahunanSource: 'Bank Dunia (rata-rata tahunan)',
    terbaru: { label: 'Oktober 2026', value: 3.23, source: 'BPS, rilis 2 November 2026' },
    penjelasan2022: 'Lonjakan inflasi 2022 dipicu kenaikan harga BBM bersubsidi pada September 2022, yang mendorong naiknya ongkos transportasi dan harga bahan pangan. Setelah efek kenaikan itu mereda, inflasi kembali turun ke 2,61% pada Desember 2023.'
  },

  kemiskinan: {
    september: [
      { year: 2020, value: 10.19 },
      { year: 2021, value: 9.71 },
      { year: 2022, value: 9.57 },
      { year: 2023, value: 9.36 },
      { year: 2024, value: 8.57 }
    ],
    source: 'BPS (September)',
    sep2024: {
      jumlahMiskinJt: 24.06,
      garisKemiskinan: 'Rp 595.243/kapita/bulan',
      perkotaan: 6.66,
      perdesaan: 11.34
    },
    mar2024: { value: 9.03, jumlahMiskinJt: 25.22 },
    gini: {
      sep2024: 0.381,
      mar2024: 0.379,
      perkotaan: 0.402,
      perdesaan: 0.308,
      tertinggi: 'DKI Jakarta 0,431',
      source: 'BPS, September 2024'
    },
    terbaru: { label: 'Maret 2026', value: 8.07, jumlahMiskinJt: 22.93, source: 'BPS, rilis 5 Agustus 2026' }
  },

  kesehatanPendidikan: {
    harapanHidup: [
      { year: 2020, value: 73.37 },
      { year: 2021, value: 73.46 },
      { year: 2022, value: 73.70 },
      { year: 2023, value: 73.93 },
      { year: 2024, value: 74.15 }
    ],
    lamaSekolah: [
      { year: 2020, value: 8.48 },
      { year: 2021, value: 8.54 },
      { year: 2022, value: 8.69 },
      { year: 2023, value: 8.77 },
      { year: 2024, value: 8.85 }
    ],
    harapanLamaSekolah: [
      { year: 2020, value: 12.98 },
      { year: 2021, value: 13.08 },
      { year: 2022, value: 13.10 },
      { year: 2023, value: 13.15 },
      { year: 2024, value: 13.21 }
    ],
    source: 'BPS, rilis Indeks Pembangunan Manusia, 15 November 2024',
    ipm2024: 75.02,
    ipm2023: 74.39,
    kematianBayi: { value: 15.2, unit: 'per 1.000 kelahiran hidup', source: 'Bank Dunia, 2024' },
    kematianBalita: { value: 17.7, unit: 'per 1.000 kelahiran hidup', source: 'Bank Dunia, 2024' },
    melekHuruf: { value: 96.3, unit: '%', source: 'BPS, 2023' },
    melekHurufNote: 'Kemenkes, Profil Kesehatan Indonesia 2025, mencatat 97,1% (2025) sebagai pembanding; angka utama situs ini memakai BPS 2023.'
  },

  daerah: {
    sourcePenduduk: 'BPS, 2024',
    sourcePdrb: 'BPS, PDRB per kapita Seri 2010, publikasi 2025',
    provinsi: [
      { name: 'Jawa Barat', penduduk: 50345200, pdrbPerKapitaRibu: 59865 },
      { name: 'Jawa Timur', penduduk: 41527900, pdrbPerKapitaRibu: 80856 },
      { name: 'Jawa Tengah', penduduk: 37892300, pdrbPerKapitaRibu: 50824 },
      { name: 'Sumatera Utara', penduduk: 15588500, pdrbPerKapitaRibu: 78310 },
      { name: 'Banten', penduduk: 12640000, pdrbPerKapitaRibu: 74673, footnote: 'SUPAS 2025 (BPS)' },
      { name: 'DKI Jakarta', penduduk: 10684900, pdrbPerKapitaRibu: 367687 },
      { name: 'Sulawesi Selatan', penduduk: 9463390, pdrbPerKapitaRibu: 78748 },
      { name: 'Lampung', penduduk: 9419600, pdrbPerKapitaRibu: 55009 }
    ],
    konteks: {
      jawaPdb: 57.02,
      sumatraPdb: 22.12,
      pdrbNasionalRibu: 78617,
      source: 'BPS via MNCS, 2025'
    }
  },

  rilisTerbaru: [
    { date: '5 Februari 2026', text: 'Ekonomi Indonesia 2025 tumbuh 5,11%. PDB nominal Rp 23.821,1 triliun.', source: 'BPS' },
    { date: '2 November 2026', text: 'Inflasi Oktober 2026 tercatat 3,23% (year-on-year).', source: 'BPS' },
    { date: '5 Agustus 2026', text: 'Kemiskinan Maret 2026 turun ke 8,07%, atau 22,93 juta jiwa.', source: 'BPS' },
    { date: '2025', text: 'SUPAS 2025: penduduk 284,44 juta jiwa, tumbuh 1,11%.', source: 'BPS' }
  ]
};

/* Format angka gaya Indonesia: ribuan dipisah titik, desimal dipisah koma. */
function fmtInt(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
function fmtDec(n, digits) {
  var parts = Number(n).toFixed(digits).split('.');
  return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + parts[1];
}
function fmtSignedDec(n, digits) {
  var sign = n < 0 ? '−' : '+';
  return sign + fmtDec(Math.abs(n), digits) + '%';
}
