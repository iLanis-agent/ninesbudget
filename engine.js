(function (root) {
  var PERIODS = { day: 1, week: 7, month: 365 / 12, year: 365 };
  // availability in percent; returns seconds of allowed downtime per period
  function allowed(pct, days) { if (!(pct >= 0 && pct <= 100) || !(days > 0)) return null; return (1 - pct / 100) * days * 86400; }
  function table(pct) {
    if (!(pct >= 0 && pct <= 100)) return null;
    var o = {}; Object.keys(PERIODS).forEach(function (k) { o[k] = allowed(pct, PERIODS[k]); }); return o;
  }
  function nines(pct) { if (!(pct >= 0 && pct < 100)) return pct === 100 ? Infinity : null; return -Math.log10(1 - pct / 100); }
  // components in a chain, all needed: product of availabilities
  function series(list) {
    if (!list.length) return null;
    var p = 1; for (var i = 0; i < list.length; i++) { if (!(list[i] >= 0 && list[i] <= 100)) return null; p *= list[i] / 100; } return p * 100;
  }
  // redundant copies, any one is enough (assumes independent failures)
  function parallel(list) {
    if (!list.length) return null;
    var q = 1; for (var i = 0; i < list.length; i++) { if (!(list[i] >= 0 && list[i] <= 100)) return null; q *= 1 - list[i] / 100; } return (1 - q) * 100;
  }
  // availability needed for at most `seconds` of downtime in `days`
  function needed(seconds, days) { if (!(seconds >= 0) || !(days > 0)) return null; var v = 100 * (1 - seconds / (days * 86400)); return v < 0 ? null : v; }
  // error budget: target pct over `days`, used seconds so far
  function budget(pct, days, usedSec) {
    var a = allowed(pct, days); if (a === null || !(usedSec >= 0)) return null;
    return { total: a, used: usedSec, left: a - usedSec, usedPct: a === 0 ? (usedSec > 0 ? Infinity : 0) : usedSec / a * 100, breached: usedSec > a, achieved: (1 - usedSec / (days * 86400)) * 100 };
  }
  function fmt(sec) {
    if (sec === null || !isFinite(sec)) return 'n/a';
    var neg = sec < 0; if (neg) sec = -sec; var s;
    if (sec >= 86400 * 2) s = (sec / 86400).toFixed(1) + ' days';
    else if (sec >= 3600) s = Math.floor(sec / 3600) + ' h ' + Math.round((sec % 3600) / 60) + ' min';
    else if (sec >= 60) s = (sec / 60).toFixed(1) + ' min';
    else if (sec >= 1) s = sec.toFixed(1) + ' s';
    else if (sec >= 0.001) s = (sec * 1000).toFixed(1) + ' ms';
    else s = (sec * 1e6).toFixed(1) + ' us';
    if (/^(\d+) h 60 min$/.test(s)) s = (parseInt(s) + 1) + ' h 0 min';
    return (neg ? '-' : '') + s;
  }
  var api = { PERIODS: PERIODS, allowed: allowed, table: table, nines: nines, series: series, parallel: parallel, needed: needed, budget: budget, fmt: fmt };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.NinesBudget = api;
})(typeof window !== 'undefined' ? window : this);
