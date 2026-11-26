/* NusaStat — template tiap halaman (8 route).
   Hanya markup + pemanggilan charts.js. Semua angka diambil dari data.js.
   Kontrol interaktif dihubungkan oleh app.js setelah halaman dirender. */

function kpiCard(value, label, source) {
  return '<article class="kpi"><p class="kpi-value">' + value + '</p>' +
    '<p class="kpi-label">' + label + '</p>' +
    '<p class="source">' + source + '</p></article>';
}

function srcLine(source) {
  return '<p class="source">Sumber: ' + source + '</p>';
}

function pageHead(title, summary, dateLabel) {
  return '<header class="page-head"><h1>' + title + '</h1>' +
    '<p class="page-summary">' + summary + '</p>' +
    '<p class="source">Data: ' + dateLabel + '</p></header>';
}

/* ---------- Beranda ---------- */

function homeChartHtml(metric, type) {
  var d = NUSADATA;
  var opts;
  if (metric === 'pdb') {
    opts = {
      title: 'PDB nominal Indonesia, 2020–2024',
      yLabel: 'Rp triliun',
      desc: 'PDB nominal Indonesia 2020 sampai 2024 dalam triliun rupiah',
      data: d.ekonomi.pdb.map(function (r) { return { label: String(r.year), value: r.rpTriliun }; }),
      format: function (v) { return fmtDec(v, 1); }
    };
  } else if (metric === 'tpt') {
    opts = {
      title: 'Tingkat pengangguran terbuka (Agustus), 2020–2024',
      yLabel: '% angkatan kerja',
      desc: 'Tingkat pengangguran terbuka bulan Agustus 2020 sampai 2024',
      data: d.ketenagakerjaan.tptAgustus.map(function (r) { return { label: String(r.year), value: r.value }; }),
      format: function (v) { return fmtDec(v, 2) + '%'; }
    };
  } else {
    opts = {
      title: 'Penduduk Indonesia, 2020–2024',
      yLabel: 'juta jiwa',
      desc: 'Jumlah penduduk Indonesia 2020 sampai 2024 dalam juta jiwa',
      data: d.penduduk.series.map(function (r) { return { label: String(r.year), value: r.value / 1000000 }; }),
      format: function (v) { return fmtDec(v, 1) + ' jt'; }
    };
  }
  var chart = type === 'bar' ? barChart(opts) : lineChart(opts);
  return chart + srcLine(metric === 'pdb' ? 'BPS / IMF' : metric === 'tpt' ? d.ketenagakerjaan.tptSource : d.penduduk.source);
}

function pageHome() {
  var d = NUSADATA;
  var releases = d.rilisTerbaru.map(function (r) {
    return '<li><strong>' + r.date + '</strong> — ' + r.text + ' <span class="source">(' + r.source + ')</span></li>';
  }).join('');
  var provBars = sectorBars({
    title: 'Sekilas daerah: penduduk 8 provinsi terbesar, 2024',
    desc: 'Penduduk delapan provinsi terbesar di Indonesia tahun 2024',
    data: d.daerah.provinsi.map(function (p) { return { label: p.name, value: p.penduduk / 1000000 }; }),
    format: function (v) { return fmtDec(v, 1) + ' jt'; }
  });
  return pageHead('Berapa besar Indonesia hari ini?',
    'Empat angka utama Indonesia dalam satu layar: penduduk, ekonomi, pekerjaan, dan kemiskinan — semuanya dari publikasi resmi.',
    'Diperbarui 26 November 2026') +
    '<section class="kpi-grid">' +
    kpiCard('283.487.931', 'Penduduk, 2024', 'PBB, World Population Prospects 2024') +
    kpiCard('Rp 22.139 T', 'PDB nominal, 2024', 'BPS / IMF') +
    kpiCard('4,76%', 'Pengangguran (TPT), Feb 2025', 'BPS, Sakernas') +
    kpiCard('8,57%', 'Kemiskinan, Sep 2024', 'BPS') +
    '</section>' +
    '<section class="card"><h2>Grafik utama</h2>' +
    '<div class="control-row" role="group" aria-label="Pilih metrik">' +
    '<button type="button" class="toggle-btn" data-home-metric="penduduk">Penduduk</button>' +
    '<button type="button" class="toggle-btn" data-home-metric="pdb">PDB</button>' +
    '<button type="button" class="toggle-btn" data-home-metric="tpt">TPT</button>' +
    '</div>' +
    '<div class="control-row" role="group" aria-label="Jenis grafik">' +
    '<button type="button" class="toggle-btn" data-home-chart="bar">Batang</button>' +
    '<button type="button" class="toggle-btn" data-home-chart="line">Garis</button>' +
    '</div>' +
    '<div id="home-chart"></div></section>' +
    '<section class="card"><h2>Rilis terbaru</h2><ul class="releases">' + releases + '</ul></section>' +
    '<section class="card">' + provBars + srcLine(d.daerah.sourcePenduduk) + '</section>' +
    '<p class="page-note"><a href="#/daerah">Lihat semua data daerah →</a></p>';
}

/* ---------- Penduduk ---------- */

function pendudukChartHtml(year) {
  var d = NUSADATA;
  var idx = d.penduduk.series.findIndex(function (r) { return r.year === year; });
  return lineChart({
    title: 'Penduduk Indonesia, 2020–2024',
    yLabel: 'juta jiwa',
    desc: 'Jumlah penduduk Indonesia 2020 sampai 2024 dalam juta jiwa',
    data: d.penduduk.series.map(function (r) { return { label: String(r.year), value: r.value / 1000000 }; }),
    format: function (v) { return fmtDec(v, 1) + ' jt'; },
    highlightIndex: idx
  }) + srcLine(d.penduduk.source);
}

function pendudukSpotlightHtml(year) {
  var s = NUSADATA.penduduk.series;
  var i = s.findIndex(function (r) { return r.year === year; });
  var row = s[i];
  var prev = i > 0 ? s[i - 1] : null;
  var delta = prev ? fmtInt(row.value - prev.value) + ' jiwa lebih banyak dari ' + prev.year : 'Tahun pertama dalam seri ini.';
  return '<p class="spotlight-value">' + fmtInt(row.value) + ' jiwa</p>' +
    '<p class="spotlight-detail">Tahun ' + row.year + ' · laju tumbuh ' + fmtSignedDec(row.growth, 2) + ' · ' + delta + '</p>';
}

function yearOptions(selected) {
  return [2020, 2021, 2022, 2023, 2024].map(function (y) {
    return '<option value="' + y + '"' + (y === selected ? ' selected' : '') + '>' + y + '</option>';
  }).join('');
}

function pagePenduduk() {
  var d = NUSADATA;
  return pageHead('Berapa banyak penduduk Indonesia?',
    'Indonesia adalah negara berpenduduk terbesar keempat di dunia. Seri di bawah ini memakai estimasi PBB agar konsisten tahun ke tahun.',
    'PBB, World Population Prospects 2024') +
    '<section class="kpi-grid">' +
    kpiCard('283.487.931', 'Penduduk, 2024', 'PBB, 2024') +
    kpiCard('+0,82%', 'Laju tumbuh, 2024', 'PBB, 2024') +
    kpiCard('156', 'Kepadatan (jiwa/km²), 2024', 'PBB, 2024') +
    kpiCard('30,1 tahun', 'Usia median, 2024', 'PBB, 2024') +
    kpiCard('59,0%', 'Penduduk perkotaan, 2024', 'PBB, 2024') +
    kpiCard('2,12', 'Anak per perempuan (fertilitas), 2024', 'PBB, 2024') +
    '</section>' +
    '<section class="card"><h2>Pertumbuhan penduduk</h2>' +
    '<label class="control-label" for="year-select">Pilih tahun sorotan</label>' +
    '<select id="year-select" class="select">' + yearOptions(2024) + '</select>' +
    '<div id="year-spotlight" class="spotlight">' + pendudukSpotlightHtml(2024) + '</div>' +
    '<div id="penduduk-chart">' + pendudukChartHtml(2024) + '</div></section>' +
    '<section class="card"><h2>Struktur umur, 2024</h2>' +
    '<div class="table-wrap"><table><thead><tr><th>Kelompok umur</th><th>Pangsa penduduk</th></tr></thead>' +
    '<tbody>' +
    '<tr><td>0–14 tahun</td><td class="num">24,6%</td></tr>' +
    '<tr><td>15–64 tahun</td><td class="num">68,1% *</td></tr>' +
    '<tr><td>65 tahun ke atas</td><td class="num">7,3%</td></tr>' +
    '</tbody></table></div>' +
    '<p class="source">Sumber: PBB, World Population Prospects 2024. * Kelompok 15–64 tahun dihitung dari sisa 100% setelah kelompok 0–14 dan 65+.</p></section>' +
    '<section class="card note-card"><h2>Catatan: BPS atau PBB?</h2><p>' + d.penduduk.supasNote.text + '</p>' +
    srcLine(d.penduduk.supasNote.source) + '</section>';
}

/* ---------- Ekonomi ---------- */

function econChartHtml(unit, type, year) {
  var d = NUSADATA;
  var isUsd = unit === 'usd';
  var data = d.ekonomi.pdb.map(function (r) {
    return { label: String(r.year), value: isUsd ? r.usdMiliar : r.rpTriliun };
  });
  var opts = {
    title: isUsd ? 'PDB nominal Indonesia, 2020–2024 (miliar USD)' : 'PDB nominal Indonesia, 2020–2024 (Rp triliun)',
    yLabel: isUsd ? 'miliar USD' : 'Rp triliun',
    desc: 'PDB nominal Indonesia 2020 sampai 2024',
    data: data,
    format: function (v) { return fmtDec(v, 1); },
    highlightIndex: d.ekonomi.pdb.findIndex(function (r) { return r.year === year; })
  };
  var chart = type === 'bar' ? barChart(opts) : lineChart(opts);
  return chart + srcLine(d.ekonomi.source);
}

function econSpotlightHtml(unit, year) {
  var d = NUSADATA;
  var row = d.ekonomi.pdb.find(function (r) { return r.year === year; });
  var value = unit === 'usd'
    ? 'US$' + fmtDec(row.usdMiliar, 1) + ' miliar'
    : 'Rp ' + fmtDec(row.rpTriliun, 1) + ' triliun';
  return '<p class="spotlight-value">' + value + '</p>' +
    '<p class="spotlight-detail">Tahun ' + row.year + ' · pertumbuhan riil ' + fmtSignedDec(row.growth, 2) + '</p>';
}

function pageEkonomi() {
  var d = NUSADATA;
  var sektor = sectorBars({
    title: 'Struktur PDB menurut sektor, 2024',
    desc: 'Pangsa pertanian, industri, dan jasa dalam PDB 2024',
    data: d.ekonomi.sektor2024,
    format: function (v) { return fmtDec(v, 1) + '%'; }
  });
  var lapangan = d.ekonomi.lapanganTerbesarQ32024.map(function (r) {
    return '<tr><td>' + r.label + '</td><td class="num">' + fmtDec(r.value, 2) + '%</td></tr>';
  }).join('');
  return pageHead('Berapa besar ekonomi Indonesia?',
    'PDB Indonesia menembus Rp 22.139 triliun pada 2024 dan tumbuh 5,03%. Tahun 2025 ekonominya tumbuh 5,11%.',
    'BPS / IMF') +
    '<section class="kpi-grid">' +
    '<div id="econ-kpi-pdb">' + kpiCard('Rp 22.139 T', 'PDB nominal, 2024', 'BPS / IMF') + '</div>' +
    kpiCard('Rp 78,62 jt', 'PDB per kapita, 2024 (US$4.960,33)', 'BPS, rilis 5 Feb 2025') +
    kpiCard('+5,03%', 'Pertumbuhan riil, 2024', 'BPS') +
    kpiCard('+5,11%', 'Pertumbuhan riil, 2025', 'BPS, rilis 5 Feb 2026') +
    '</section>' +
    '<section class="card"><h2>PDB nominal, 2020–2024</h2>' +
    '<div class="control-row" role="group" aria-label="Satuan PDB">' +
    '<button type="button" class="toggle-btn" data-econ-unit="rp">Rp triliun</button>' +
    '<button type="button" class="toggle-btn" data-econ-unit="usd">US$ miliar</button>' +
    '</div>' +
    '<div class="control-row" role="group" aria-label="Jenis grafik">' +
    '<button type="button" class="toggle-btn" data-econ-chart="bar">Batang</button>' +
    '<button type="button" class="toggle-btn" data-econ-chart="line">Garis</button>' +
    '</div>' +
    '<label class="control-label" for="econ-year-select">Pilih tahun sorotan</label>' +
    '<select id="econ-year-select" class="select">' + yearOptions(2024) + '</select>' +
    '<div id="econ-spotlight" class="spotlight">' + econSpotlightHtml('rp', 2024) + '</div>' +
    '<div id="econ-chart">' + econChartHtml('rp', 'bar', 2024) + '</div>' +
    '<p class="source">Kurs rata-rata 2024: Rp 15.855 per USD (' + d.meta.kursSource + ').</p></section>' +
    '<section class="card">' + sektor +
    '<p class="source">Sumber: ' + d.ekonomi.sektorSource + '. ' + d.ekonomi.sektorNote + '</p></section>' +
    '<section class="card"><h2>5 lapangan usaha terbesar, Kuartal III 2024</h2>' +
    '<div class="table-wrap"><table><thead><tr><th>Lapangan usaha</th><th>Pangsa PDB</th></tr></thead>' +
    '<tbody>' + lapangan + '</tbody></table></div>' + srcLine(d.ekonomi.lapanganSource) + '</section>' +
    '<section class="card"><h2>PDB 2025: angka terbaru</h2><p>Ekonomi Indonesia tumbuh <strong>5,11%</strong> pada 2025, dengan PDB nominal <strong>Rp 23.821,1 triliun</strong>.</p>' +
    srcLine(d.ekonomi.pdb2025.source) + '</section>';
}

/* ---------- Ketenagakerjaan ---------- */

function pageKetenagakerjaan() {
  var d = NUSADATA;
  var f = d.ketenagakerjaan.feb2025;
  var tptChart = lineChart({
    title: 'Tingkat pengangguran terbuka (Agustus), 2020–2024',
    yLabel: '% angkatan kerja',
    desc: 'Tingkat pengangguran terbuka bulan Agustus 2020 sampai 2024',
    data: d.ketenagakerjaan.tptAgustus.map(function (r) { return { label: String(r.year), value: r.value }; }),
    format: function (v) { return fmtDec(v, 2) + '%'; }
  });
  var formalBars = sectorBars({
    title: 'Pekerja formal vs informal, Februari 2025',
    desc: 'Pangsa pekerja formal dan informal Februari 2025',
    data: [
      { label: 'Formal', value: f.formal },
      { label: 'Informal', value: f.informal }
    ],
    format: function (v) { return fmtDec(v, 2) + '%'; }
  });
  var lapangan = d.ketenagakerjaan.lapanganTerbesar.map(function (r) {
    return '<tr><td>' + r.label + '</td><td class="num">' + fmtDec(r.value, 2) + '%</td></tr>';
  }).join('');
  return pageHead('Berapa banyak orang Indonesia yang bekerja?',
    'Pengangguran terus turun sejak 2020. Pada Februari 2025, 145,77 juta orang bekerja dari 153,05 juta angkatan kerja.',
    'BPS, Sakernas') +
    '<section class="kpi-grid">' +
    kpiCard('4,76%', 'TPT, Februari 2025 (Feb 2024: 4,82%)', 'BPS, 5 Mei 2025') +
    kpiCard('153,05 jt', 'Angkatan kerja, Feb 2025', 'BPS') +
    kpiCard('40,60%', 'Pekerja formal, Feb 2025', 'BPS') +
    kpiCard('Rp 3,09 jt', 'Upah rata-rata buruh, /bulan, Feb 2025', 'BPS') +
    '</section>' +
    '<section class="card"><h2>Pengangguran turun lima tahun berturut-turut</h2>' + tptChart + srcLine(d.ketenagakerjaan.tptSource) + '</section>' +
    '<section class="card">' + formalBars + srcLine(f.source) + '</section>' +
    '<section class="card"><h2>Lapangan kerja terbesar, Februari 2025</h2>' +
    '<div class="table-wrap"><table><thead><tr><th>Lapangan usaha</th><th>Pangsa pekerja</th></tr></thead>' +
    '<tbody>' + lapangan + '</tbody></table></div>' + srcLine(d.ketenagakerjaan.lapanganSource) +
    '<p>Bekerja: <strong>145,77 juta</strong> · Menganggur: <strong>7,28 juta</strong> · TPAK: <strong>70,60%</strong>.</p>' +
    srcLine(f.source) + '</section>';
}

/* ---------- Harga ---------- */

function inflasiChartHtml(series) {
  var d = NUSADATA;
  var isTahunan = series === 'tahunan';
  return lineChart({
    title: isTahunan ? 'Inflasi rata-rata tahunan, 2020–2024' : 'Inflasi Desember (year-on-year), 2020–2024',
    yLabel: '% per tahun',
    desc: isTahunan ? 'Inflasi rata-rata tahunan 2020 sampai 2024' : 'Inflasi Desember year-on-year 2020 sampai 2024',
    data: d.harga.inflasi.map(function (r) { return { label: String(r.year), value: isTahunan ? r.tahunan : r.desember }; }),
    format: function (v) { return fmtDec(v, 2) + '%'; }
  }) + srcLine(isTahunan ? d.harga.tahunanSource : d.harga.desemberSource);
}

function pageHarga() {
  var d = NUSADATA;
  var rows = d.harga.inflasi.map(function (r) {
    return '<tr><td>' + r.year + '</td><td class="num">' + fmtDec(r.desember, 2) + '%</td><td class="num">' + fmtDec(r.tahunan, 2) + '%</td></tr>';
  }).join('');
  return pageHead('Seberapa cepat harga naik?',
    'Inflasi Indonesia kembali ke kisaran 1–3% setelah melonjak pada 2022. Angka terbaru: 3,23% pada Oktober 2026.',
    'BPS') +
    '<section class="kpi-grid">' +
    kpiCard('1,57%', 'Inflasi Desember 2024 (yoy)', 'BPS') +
    kpiCard('3,23%', 'Inflasi Oktober 2026 (yoy)', 'BPS, rilis 2 Nov 2026') +
    kpiCard('5,51%', 'Inflasi Desember 2022 — tertinggi seri ini', 'BPS') +
    kpiCard('2,18%', 'Rata-rata tahunan 2024', 'Bank Dunia') +
    '</section>' +
    '<section class="card"><h2>Tren inflasi, 2020–2024</h2>' +
    '<div class="control-row" role="group" aria-label="Seri inflasi">' +
    '<button type="button" class="toggle-btn" data-inflasi="desember">Desember (yoy)</button>' +
    '<button type="button" class="toggle-btn" data-inflasi="tahunan">Rata-rata tahunan</button>' +
    '</div>' +
    '<div id="inflasi-chart">' + inflasiChartHtml('desember') + '</div></section>' +
    '<section class="card"><h2>Kenapa inflasi melonjak pada 2022?</h2><p>' + d.harga.penjelasan2022 + '</p></section>' +
    '<section class="card"><h2>Tabel inflasi, 2020–2024</h2>' +
    '<div class="table-wrap"><table><thead><tr><th>Tahun</th><th>Desember (yoy)</th><th>Rata-rata tahunan</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table></div>' +
    '<p class="source">Sumber: ' + d.harga.desemberSource + '; ' + d.harga.tahunanSource + '.</p></section>';
}

/* ---------- Kesehatan & Pendidikan ---------- */

function pageKesehatan() {
  var d = NUSADATA;
  var k = d.kesehatanPendidikan;
  var hhChart = lineChart({
    title: 'Harapan hidup saat lahir, 2020–2024',
    yLabel: 'tahun',
    desc: 'Harapan hidup saat lahir 2020 sampai 2024 dalam tahun',
    data: k.harapanHidup.map(function (r) { return { label: String(r.year), value: r.value }; }),
    format: function (v) { return fmtDec(v, 2) + ' thn'; }
  });
  var sekolahChart = barChart({
    title: 'Rata-rata lama sekolah, 2020–2024',
    yLabel: 'tahun',
    desc: 'Rata-rata lama sekolah penduduk 2020 sampai 2024 dalam tahun',
    data: k.lamaSekolah.map(function (r) { return { label: String(r.year), value: r.value }; }),
    format: function (v) { return fmtDec(v, 2) + ' thn'; }
  });
  var rows = k.harapanLamaSekolah.map(function (r) {
    return '<tr><td>' + r.year + '</td><td class="num">' + fmtDec(r.value, 2) + ' thn</td></tr>';
  }).join('');
  return pageHead('Seberapa sehat dan terdidik penduduk Indonesia?',
    'Harapan hidup mencapai 74,15 tahun pada 2024 dan Indeks Pembangunan Manusia naik ke 75,02.',
    'BPS, rilis IPM 15 Nov 2024') +
    '<section class="kpi-grid">' +
    kpiCard('74,15 thn', 'Harapan hidup, 2024', 'BPS') +
    kpiCard('75,02', 'Indeks Pembangunan Manusia, 2024 (2023: 74,39)', 'BPS') +
    kpiCard('8,85 thn', 'Rata-rata lama sekolah, 2024', 'BPS') +
    kpiCard('15,2', 'Kematian bayi per 1.000 kelahiran, 2024', 'Bank Dunia') +
    '</section>' +
    '<section class="card"><h2>Harapan hidup terus naik</h2>' + hhChart + srcLine(k.source) + '</section>' +
    '<section class="card"><h2>Lama sekolah juga naik</h2>' + sekolahChart + srcLine(k.source) + '</section>' +
    '<section class="card"><h2>Harapan lama sekolah</h2>' +
    '<div class="table-wrap"><table><thead><tr><th>Tahun</th><th>Harapan lama sekolah</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table></div>' + srcLine(k.source) + '</section>' +
    '<section class="card"><h2>Melek huruf dan kesehatan anak</h2>' +
    '<p>Angka melek huruf: <strong>96,3%</strong> (' + k.melekHuruf.source + '). ' + k.melekHurufNote + '</p>' +
    '<p>Kematian balita 2024: <strong>17,7 per 1.000 kelahiran hidup</strong> (' + k.kematianBalita.source + ').</p>' +
    '<p class="source">Catatan metode: Bank Dunia mencatat harapan hidup 71,3 tahun dengan metode berbeda; situs ini memakai angka BPS 74,15 tahun sebagai angka utama. Lihat halaman Metodologi.</p></section>';
}

/* ---------- Daerah ---------- */

function provRows(filter, sortKey, sortDir) {
  var d = NUSADATA;
  var q = (filter || '').trim().toLowerCase();
  var rows = d.daerah.provinsi.filter(function (p) {
    return q === '' || p.name.toLowerCase().indexOf(q) !== -1;
  });
  if (sortKey) {
    rows = rows.slice().sort(function (a, b) {
      var av = sortKey === 'penduduk' ? a.penduduk : a.pdrbPerKapitaRibu;
      var bv = sortKey === 'penduduk' ? b.penduduk : b.pdrbPerKapitaRibu;
      return (av - bv) * sortDir;
    });
  }
  if (rows.length === 0) {
    return '<tr><td colspan="3">Tidak ada provinsi yang cocok dengan pencarian.</td></tr>';
  }
  return rows.map(function (p) {
    var name = p.name + (p.footnote ? ' *' : '');
    return '<tr><td>' + name + '</td><td class="num">' + fmtInt(p.penduduk) + '</td>' +
      '<td class="num">Rp ' + fmtInt(p.pdrbPerKapitaRibu) + ' ribu</td></tr>';
  }).join('');
}

function pageDaerah() {
  var d = NUSADATA;
  var provBars = sectorBars({
    title: 'Penduduk per provinsi, 2024',
    desc: 'Penduduk delapan provinsi terbesar tahun 2024',
    data: d.daerah.provinsi.map(function (p) { return { label: p.name, value: p.penduduk / 1000000 }; }),
    format: function (v) { return fmtDec(v, 1) + ' jt'; }
  });
  var pdrbBars = sectorBars({
    title: 'PDRB per kapita per provinsi, 2024',
    desc: 'PDRB per kapita delapan provinsi terbesar tahun 2024',
    data: d.daerah.provinsi.map(function (p) { return { label: p.name, value: p.pdrbPerKapitaRibu }; }),
    format: function (v) { return 'Rp ' + fmtInt(v) + ' rb'; }
  });
  return pageHead('Di mana penduduk Indonesia tinggal?',
    'Delapan provinsi terbesar menampung sebagian besar penduduk. Jawa Barat sendiri berpenduduk 50,35 juta jiwa — lebih besar dari banyak negara.',
    'BPS, 2024') +
    '<section class="card"><h2>Tabel provinsi</h2>' +
    '<label class="control-label" for="prov-search">Cari provinsi</label>' +
    '<input id="prov-search" class="input" type="search" placeholder="Ketik nama provinsi, mis. Jawa" autocomplete="off">' +
    '<div class="table-wrap"><table id="prov-table"><thead><tr>' +
    '<th>Provinsi</th>' +
    '<th><button type="button" class="sort-btn" data-sort="penduduk">Penduduk <span class="sort-arrow" data-arrow="penduduk"></span></button></th>' +
    '<th><button type="button" class="sort-btn" data-sort="pdrb">PDRB per kapita <span class="sort-arrow" data-arrow="pdrb"></span></button></th>' +
    '</tr></thead><tbody id="prov-tbody">' + provRows('', null, 1) + '</tbody></table></div>' +
    '<p class="source">Sumber penduduk: ' + d.daerah.sourcePenduduk + '. Sumber PDRB per kapita: ' + d.daerah.sourcePdrb + '.</p>' +
    '<p class="source">* Banten: angka penduduk dari SUPAS 2025 (BPS).</p></section>' +
    '<section class="card">' + provBars + srcLine(d.daerah.sourcePenduduk) + '</section>' +
    '<section class="card">' + pdrbBars + srcLine(d.daerah.sourcePdrb) + '</section>' +
    '<section class="card"><h2>Konteks: Jawa mendominasi ekonomi</h2>' +
    '<p>Pulau Jawa menyumbang <strong>' + fmtDec(d.daerah.konteks.jawaPdb, 2) + '% PDB nasional</strong> 2024; Sumatra ' + fmtDec(d.daerah.konteks.sumatraPdb, 2) + '%.</p>' +
    '<p>PDRB per kapita nasional 2024: <strong>Rp ' + fmtInt(d.daerah.konteks.pdrbNasionalRibu) + ' ribu</strong>. DKI Jakarta tertinggi di antara delapan provinsi ini (Rp 367.687 ribu) karena pusat pemerintahan dan jasa keuangan berada di sana.</p>' +
    srcLine(d.daerah.konteks.source) + '</section>';
}

/* ---------- Metodologi ---------- */

function pageMetodologi() {
  var d = NUSADATA;
  var srcRows = [
    ['Penduduk 2020–2024, kepadatan, usia median, perkotaan, fertilitas, struktur umur', 'PBB, World Population Prospects 2024', '2024'],
    ['Penduduk SUPAS (catatan metode)', 'BPS, SUPAS 2025', '2025'],
    ['PDB nominal, PDB per kapita, pertumbuhan riil', 'BPS / IMF', '2020–2024'],
    ['PDB 2025', 'BPS, rilis 5 Februari 2026', '2025'],
    ['Struktur PDB menurut sektor', 'Bank Dunia, World Development Indicators', '2024'],
    ['5 lapangan usaha terbesar', 'BPS, Kuartal III 2024', '2024'],
    ['TPT Agustus', 'BPS, Sakernas', '2020–2024'],
    ['TPT Februari, angkatan kerja, formal/informal, upah', 'BPS, Berita Resmi Statistik, 5 Mei 2025', 'Feb 2025'],
    ['Inflasi Desember (yoy)', 'BPS', '2020–2024'],
    ['Inflasi rata-rata tahunan', 'Bank Dunia', '2020–2024'],
    ['Inflasi Oktober 2026', 'BPS, rilis 2 November 2026', '2026'],
    ['Kemiskinan September, garis kemiskinan, Gini', 'BPS', '2020–2024'],
    ['Kemiskinan Maret 2026', 'BPS, rilis 5 Agustus 2026', '2026'],
    ['Harapan hidup, lama sekolah, IPM', 'BPS, rilis IPM 15 November 2024', '2020–2024'],
    ['Kematian bayi dan balita', 'Bank Dunia', '2024'],
    ['Melek huruf', 'BPS', '2023'],
    ['Penduduk 8 provinsi terbesar', 'BPS', '2024'],
    ['Penduduk Banten (catatan kaki)', 'BPS, SUPAS 2025', '2025'],
    ['PDRB per kapita provinsi', 'BPS, Seri 2010, publikasi 2025', '2024'],
    ['Kontribusi Jawa dan Sumatra terhadap PDB', 'BPS via MNCS', '2024–2025'],
    ['Kurs rata-rata Rp/USD', 'CIA World Factbook', '2024']
  ].map(function (r) {
    return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>';
  }).join('');
  return pageHead('Dari mana angka-angka ini?',
    'Semua angka di situs ini berasal dari publikasi resmi. Tidak ada angka estimasi sendiri.',
    'Terakhir diperbarui 26 November 2026') +
    '<section class="card"><h2>Cara angka dikompilasi</h2>' +
    '<p>Angka dikumpulkan 26 November 2026 dari publikasi resmi BPS, Bank Dunia (World Development Indicators), dan PBB (World Population Prospects 2024). Seri tahunan 2020–2024 dipakai agar semua grafik sebanding. Tidak ada angka estimasi sendiri. Setiap angka di situs menampilkan sumber dan tahunnya di samping angka tersebut.</p></section>' +
    '<section class="card"><h2>Tabel sumber lengkap</h2>' +
    '<div class="table-wrap"><table><thead><tr><th>Angka</th><th>Sumber (publikasi + tanggal rilis bila diketahui)</th><th>Tahun data</th></tr></thead>' +
    '<tbody>' + srcRows + '</tbody></table></div></section>' +
    '<section class="card"><h2>Perbedaan antar sumber</h2>' +
    '<p><strong>Penduduk — BPS vs PBB.</strong> BPS SUPAS 2025 mencatat 284,44 juta jiwa pada pertengahan 2025 dengan laju tumbuh 1,11%, sedangkan PBB mencatat 283,49 juta jiwa pada 2024. Perbedaan ini wajar karena metode: BPS memakai registrasi dan proyeksi, PBB memakai estimasi. Situs ini memakai seri PBB untuk grafik 2020–2024 agar konsisten, dan menyebut angka SUPAS sebagai catatan.</p>' +
    '<p><strong>Harapan hidup — BPS vs Bank Dunia.</strong> BPS mencatat 74,15 tahun (2024), sedangkan Bank Dunia mencatat 71,3 tahun dengan metode berbeda. Situs ini memakai angka BPS sebagai angka utama untuk indikator dalam negeri.</p>' +
    '<p><strong>Melek huruf — BPS vs Kemenkes.</strong> BPS mencatat 96,3% (2023); Kemenkes, Profil Kesehatan Indonesia 2025, mencatat 97,1% (2025). Angka utama situs ini memakai BPS 2023.</p></section>' +
    '<section class="card"><h2>Tentang situs ini</h2>' +
    '<p>NusaStat adalah proyek independen, bukan situs resmi BPS. Situs ini dibuat untuk bounty make.fun. Terakhir diperbarui: <strong>26 November 2026</strong>.</p></section>';
}

var NUSAPAGES = {
  home: pageHome,
  penduduk: pagePenduduk,
  ekonomi: pageEkonomi,
  ketenagakerjaan: pageKetenagakerjaan,
  harga: pageHarga,
  kesehatan: pageKesehatan,
  daerah: pageDaerah,
  metodologi: pageMetodologi,
  provRows: provRows,
  homeChartHtml: homeChartHtml,
  pendudukChartHtml: pendudukChartHtml,
  pendudukSpotlightHtml: pendudukSpotlightHtml,
  econChartHtml: econChartHtml,
  econSpotlightHtml: econSpotlightHtml,
  inflasiChartHtml: inflasiChartHtml
};
