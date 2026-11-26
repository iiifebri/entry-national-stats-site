/* NusaStat — pembuat grafik SVG tanpa library.
   Semua grafik digambar dari angka di data.js. Tidak ada dependensi,
   tidak ada request jaringan. */

var CHART_COLORS = ['#0B5D4A', '#E9A319', '#2A9D8F', '#C05621', '#64748B', '#7FB069'];
var CHART_NEGATIVE = '#B3402A';
var CHART_GRID = '#EDF0EC';

function chartEsc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* Skala "bagus" untuk sumbu Y: bulatkan batas atas ke kelipatan yang rapi. */
function niceMax(max) {
  if (max <= 0) return 1;
  var pow = Math.pow(10, Math.floor(Math.log10(max)));
  var norm = max / pow;
  var nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  return nice * pow;
}

function chartFrame(o) {
  /* o: {title, yLabel, desc, width, height, body, yTicks} */
  var w = o.width || 640;
  var h = o.height || 360;
  var ticks = o.yTicks.map(function (t) {
    return '<text x="52" y="' + t.y + '" text-anchor="end" class="axis-label">' + chartEsc(t.label) + '</text>' +
      '<line x1="60" y1="' + t.y + '" x2="' + (w - 16) + '" y2="' + t.y + '" class="grid-line"/>';
  }).join('');
  return '<figure class="chart" role="img" aria-label="' + chartEsc(o.desc || o.title) + '">' +
    '<figcaption class="chart-title">' + chartEsc(o.title) + '</figcaption>' +
    '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" role="img" aria-label="' + chartEsc(o.desc || o.title) + '">' +
    '<title>' + chartEsc(o.title) + '</title>' +
    '<text x="16" y="24" class="axis-label y-label">' + chartEsc(o.yLabel || '') + '</text>' +
    ticks + o.body +
    '</svg></figure>';
}

/* Tick sumbu Y dari skala yang sama dengan titik/batang (min..max),
   supaya label dan garis grid sejajar dengan posisi datanya. */
function scaledTicks(min, max, format, yOf) {
  var steps = 4;
  var out = [];
  for (var k = 0; k <= steps; k++) {
    var v = min + (max - min) * k / steps;
    out.push({ y: Math.round(yOf(v)) + 4, label: format(v) });
  }
  return out;
}

/* Grafik batang vertikal.
   opts: {title, yLabel, desc, data:[{label, value}], format, highlightIndex, negativeColor} */
function barChart(opts) {
  var W = 640, H = 360, top = 44, bottom = 320, left = 60, right = 16;
  var data = opts.data;
  var max = niceMax(Math.max.apply(null, data.map(function (d) { return d.value; })));
  var min = Math.min(0, Math.min.apply(null, data.map(function (d) { return d.value; })));
  var span = max - min;
  var plotH = bottom - top;
  var yOf = function (v) { return top + plotH * (max - v) / span; };
  var slot = (W - left - right) / data.length;
  var barW = Math.min(64, slot * 0.62);
  var body = '';
  data.forEach(function (d, i) {
    var x = left + slot * i + (slot - barW) / 2;
    var y = yOf(Math.max(d.value, 0));
    var h = Math.abs(yOf(d.value) - yOf(0));
    var isNeg = d.value < 0;
    var fill = isNeg ? (opts.negativeColor || CHART_NEGATIVE) : CHART_COLORS[i % CHART_COLORS.length];
    if (opts.highlightIndex !== undefined && i === opts.highlightIndex) {
      body += '<rect x="' + (x - 4) + '" y="' + (top - 8) + '" width="' + (barW + 8) + '" height="' + (plotH + 16) + '" rx="6" class="highlight-band"/>';
    }
    body += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + Math.max(h, 1).toFixed(1) + '" fill="' + fill + '" rx="3">' +
      '<title>' + chartEsc(d.label) + ': ' + chartEsc(opts.format(d.value)) + '</title></rect>';
    var labelY = isNeg ? yOf(d.value) + 16 : y - 8;
    body += '<text x="' + (x + barW / 2).toFixed(1) + '" y="' + labelY.toFixed(1) + '" text-anchor="middle" class="value-label">' + chartEsc(opts.format(d.value)) + '</text>';
    body += '<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (bottom + 22) + '" text-anchor="middle" class="axis-label">' + chartEsc(d.label) + '</text>';
  });
  body += '<line x1="' + left + '" y1="' + yOf(0).toFixed(1) + '" x2="' + (W - right) + '" y2="' + yOf(0).toFixed(1) + '" class="axis-line"/>';
  return chartFrame({
    title: opts.title, yLabel: opts.yLabel, desc: opts.desc,
    yTicks: scaledTicks(min, max, opts.format, yOf), body: body
  });
}

/* Grafik garis.
   opts: {title, yLabel, desc, data:[{label, value}], format, highlightIndex, color} */
function lineChart(opts) {
  var W = 640, H = 360, top = 44, bottom = 320, left = 60, right = 24;
  var data = opts.data;
  var vals = data.map(function (d) { return d.value; });
  var rawMax = Math.max.apply(null, vals);
  var rawMin = Math.min.apply(null, vals);
  var pad = (rawMax - rawMin) * 0.15 || 1;
  /* Skala garis mengikuti rentang data (bukan dari nol), supaya tren
     tahun ke tahun terlihat; tick memakai skala yang sama. */
  var max = rawMax + pad;
  var min = Math.max(0, rawMin - pad);
  var plotH = bottom - top;
  var plotW = W - left - right;
  var xOf = function (i) { return left + plotW * (data.length === 1 ? 0.5 : i / (data.length - 1)); };
  var yOf = function (v) { return top + plotH * (max - v) / (max - min); };
  var pts = data.map(function (d, i) { return xOf(i).toFixed(1) + ',' + yOf(d.value).toFixed(1); }).join(' ');
  var body = '<polyline points="' + pts + '" fill="none" stroke="' + (opts.color || CHART_COLORS[0]) + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>';
  data.forEach(function (d, i) {
    var cx = xOf(i), cy = yOf(d.value);
    if (opts.highlightIndex !== undefined && i === opts.highlightIndex) {
      body += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="11" class="highlight-ring"/>';
    }
    body += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="5" fill="' + (opts.color || CHART_COLORS[0]) + '" stroke="#FFFFFF" stroke-width="2">' +
      '<title>' + chartEsc(d.label) + ': ' + chartEsc(opts.format(d.value)) + '</title></circle>';
    body += '<text x="' + cx.toFixed(1) + '" y="' + (cy - 14).toFixed(1) + '" text-anchor="middle" class="value-label">' + chartEsc(opts.format(d.value)) + '</text>';
    body += '<text x="' + cx.toFixed(1) + '" y="' + (bottom + 22) + '" text-anchor="middle" class="axis-label">' + chartEsc(d.label) + '</text>';
  });
  return chartFrame({
    title: opts.title, yLabel: opts.yLabel, desc: opts.desc,
    yTicks: scaledTicks(min, max, opts.format, yOf), body: body
  });
}

/* Grafik batang horizontal (dipakai untuk struktur sektor, formal/informal,
   dan penduduk per provinsi). opts: {title, desc, data:[{label, value}],
   format, unit} */
function sectorBars(opts) {
  var rowH = 52;
  var W = 640;
  var H = 64 + opts.data.length * rowH + 8;
  var max = Math.max.apply(null, opts.data.map(function (d) { return d.value; }));
  var body = '';
  opts.data.forEach(function (d, i) {
    var y = 56 + i * rowH;
    var w = Math.max(2, (W - 260) * d.value / max);
    var fill = CHART_COLORS[i % CHART_COLORS.length];
    body += '<text x="16" y="' + (y + 16) + '" class="bar-label">' + chartEsc(d.label) + '</text>';
    body += '<rect x="180" y="' + y + '" width="' + w.toFixed(1) + '" height="24" fill="' + fill + '" rx="3">' +
      '<title>' + chartEsc(d.label) + ': ' + chartEsc(opts.format(d.value)) + '</title></rect>';
    body += '<text x="' + (180 + w + 10).toFixed(1) + '" y="' + (y + 17) + '" class="value-label">' + chartEsc(opts.format(d.value)) + '</text>';
  });
  return '<figure class="chart" role="img" aria-label="' + chartEsc(opts.desc || opts.title) + '">' +
    '<figcaption class="chart-title">' + chartEsc(opts.title) + '</figcaption>' +
    '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-label="' + chartEsc(opts.desc || opts.title) + '">' +
    '<title>' + chartEsc(opts.title) + '</title>' + body + '</svg></figure>';
}
