/* NusaStat — router hash dan semua kontrol interaktif.
   Kontrol yang berfungsi (8): pemilih tahun, pencarian provinsi,
   urutkan tabel, toggle batang/garis, toggle Rp/USD, pengalih metrik
   dashboard, toggle inflasi, dan menu hamburger HP. */

var NUSA_STATE = {
  homeMetric: 'penduduk',
  homeChart: 'line',
  pendudukYear: 2024,
  econUnit: 'rp',
  econChart: 'bar',
  econYear: 2024,
  inflasiSeries: 'desember',
  provFilter: '',
  provSortKey: null,
  provSortDir: 1
};

var ROUTES = {
  '': 'home',
  'penduduk': 'penduduk',
  'ekonomi': 'ekonomi',
  'ketenagakerjaan': 'ketenagakerjaan',
  'harga': 'harga',
  'kesehatan-pendidikan': 'kesehatan',
  'daerah': 'daerah',
  'metodologi': 'metodologi'
};

function currentRoute() {
  var hash = window.location.hash.replace(/^#\/?/, '').replace(/\/$/, '');
  return ROUTES[hash] || 'home';
}

function setActiveNav(route) {
  var links = document.querySelectorAll('.nav-link');
  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    var r = link.getAttribute('data-route');
    if (r === route) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  }
}

function markToggle(container, attr, value) {
  var btns = container.querySelectorAll('[data-' + attr + ']');
  for (var i = 0; i < btns.length; i++) {
    var b = btns[i];
    if (b.getAttribute('data-' + attr) === value) {
      b.classList.add('active');
      b.setAttribute('aria-pressed', 'true');
    } else {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    }
  }
}

/* ---------- per-route wiring ---------- */

function wireHome() {
  var chartBox = document.getElementById('home-chart');
  var render = function () {
    chartBox.innerHTML = NUSAPAGES.homeChartHtml(NUSA_STATE.homeMetric, NUSA_STATE.homeChart);
    markToggle(document, 'home-metric', NUSA_STATE.homeMetric);
    markToggle(document, 'home-chart', NUSA_STATE.homeChart);
  };
  var metricBtns = document.querySelectorAll('[data-home-metric]');
  for (var i = 0; i < metricBtns.length; i++) {
    metricBtns[i].addEventListener('click', function (ev) {
      NUSA_STATE.homeMetric = ev.currentTarget.getAttribute('data-home-metric');
      render();
    });
  }
  var chartBtns = document.querySelectorAll('[data-home-chart]');
  for (var j = 0; j < chartBtns.length; j++) {
    chartBtns[j].addEventListener('click', function (ev) {
      NUSA_STATE.homeChart = ev.currentTarget.getAttribute('data-home-chart');
      render();
    });
  }
  render();
}

function wirePenduduk() {
  var select = document.getElementById('year-select');
  var spotlight = document.getElementById('year-spotlight');
  var chartBox = document.getElementById('penduduk-chart');
  var render = function () {
    spotlight.innerHTML = NUSAPAGES.pendudukSpotlightHtml(NUSA_STATE.pendudukYear);
    chartBox.innerHTML = NUSAPAGES.pendudukChartHtml(NUSA_STATE.pendudukYear);
    select.value = String(NUSA_STATE.pendudukYear);
  };
  select.addEventListener('change', function () {
    NUSA_STATE.pendudukYear = Number(select.value);
    render();
  });
  render();
}

function wireEkonomi() {
  var chartBox = document.getElementById('econ-chart');
  var spotlight = document.getElementById('econ-spotlight');
  var kpiBox = document.getElementById('econ-kpi-pdb');
  var select = document.getElementById('econ-year-select');
  var render = function () {
    chartBox.innerHTML = NUSAPAGES.econChartHtml(NUSA_STATE.econUnit, NUSA_STATE.econChart, NUSA_STATE.econYear);
    spotlight.innerHTML = NUSAPAGES.econSpotlightHtml(NUSA_STATE.econUnit, NUSA_STATE.econYear);
    kpiBox.innerHTML = NUSA_STATE.econUnit === 'usd'
      ? kpiCard('US$1.396 M', 'PDB nominal, 2024', 'BPS / IMF')
      : kpiCard('Rp 22.139 T', 'PDB nominal, 2024', 'BPS / IMF');
    select.value = String(NUSA_STATE.econYear);
    markToggle(document, 'econ-unit', NUSA_STATE.econUnit);
    markToggle(document, 'econ-chart', NUSA_STATE.econChart);
  };
  var unitBtns = document.querySelectorAll('[data-econ-unit]');
  for (var i = 0; i < unitBtns.length; i++) {
    unitBtns[i].addEventListener('click', function (ev) {
      NUSA_STATE.econUnit = ev.currentTarget.getAttribute('data-econ-unit');
      render();
    });
  }
  var chartBtns = document.querySelectorAll('[data-econ-chart]');
  for (var j = 0; j < chartBtns.length; j++) {
    chartBtns[j].addEventListener('click', function (ev) {
      NUSA_STATE.econChart = ev.currentTarget.getAttribute('data-econ-chart');
      render();
    });
  }
  select.addEventListener('change', function () {
    NUSA_STATE.econYear = Number(select.value);
    render();
  });
  render();
}

function wireHarga() {
  var chartBox = document.getElementById('inflasi-chart');
  var render = function () {
    chartBox.innerHTML = NUSAPAGES.inflasiChartHtml(NUSA_STATE.inflasiSeries);
    markToggle(document, 'inflasi', NUSA_STATE.inflasiSeries);
  };
  var btns = document.querySelectorAll('[data-inflasi]');
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function (ev) {
      NUSA_STATE.inflasiSeries = ev.currentTarget.getAttribute('data-inflasi');
      render();
    });
  }
  render();
}

function wireDaerah() {
  var search = document.getElementById('prov-search');
  var tbody = document.getElementById('prov-tbody');
  var render = function () {
    tbody.innerHTML = NUSAPAGES.provRows(NUSA_STATE.provFilter, NUSA_STATE.provSortKey, NUSA_STATE.provSortDir);
    var arrows = document.querySelectorAll('[data-arrow]');
    for (var i = 0; i < arrows.length; i++) {
      var key = arrows[i].getAttribute('data-arrow');
      arrows[i].textContent = NUSA_STATE.provSortKey === key
        ? (NUSA_STATE.provSortDir === 1 ? '▲' : '▼')
        : '';
    }
  };
  search.value = NUSA_STATE.provFilter;
  search.addEventListener('input', function () {
    NUSA_STATE.provFilter = search.value;
    render();
  });
  var sortBtns = document.querySelectorAll('[data-sort]');
  for (var j = 0; j < sortBtns.length; j++) {
    sortBtns[j].addEventListener('click', function (ev) {
      var key = ev.currentTarget.getAttribute('data-sort');
      if (NUSA_STATE.provSortKey === key) {
        NUSA_STATE.provSortDir = -NUSA_STATE.provSortDir;
      } else {
        NUSA_STATE.provSortKey = key;
        NUSA_STATE.provSortDir = -1;
      }
      render();
    });
  }
  render();
}

/* ---------- render + router ---------- */

function render() {
  var route = currentRoute();
  var app = document.getElementById('app');
  app.innerHTML = NUSAPAGES[route]();
  setActiveNav(route);
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('nav-toggle').setAttribute('aria-expanded', 'false');
  window.scrollTo(0, 0);
  if (route === 'home') wireHome();
  else if (route === 'penduduk') wirePenduduk();
  else if (route === 'ekonomi') wireEkonomi();
  else if (route === 'harga') wireHarga();
  else if (route === 'daerah') wireDaerah();
}

function wireHamburger() {
  var toggle = document.getElementById('nav-toggle');
  var sidebar = document.getElementById('sidebar');
  toggle.addEventListener('click', function () {
    var open = sidebar.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

window.addEventListener('hashchange', render);
document.addEventListener('DOMContentLoaded', function () {
  wireHamburger();
  render();
});
