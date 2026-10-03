var N = require('./engine.js'), fails = 0, n = 0;
function eq(a, b, m, t) { n++; t = t === undefined ? 1e-9 : t; if (!(Math.abs(a - b) <= t) && a !== b) { fails++; console.log('FAIL', m, a, b); } }
// Wikipedia High availability table (rounded values)
var t = N.table(99.9); eq(t.year / 3600, 8.76, '99.9 year h', 0.005); eq(t.month / 60, 43.8, '99.9 month min', 0.05); eq(t.week / 60, 10.08, '99.9 week', 0.01); eq(t.day / 60, 1.44, '99.9 day min', 0.005);
t = N.table(99.99); eq(t.year / 60, 52.56, '99.99 year', 0.01); eq(t.month / 60, 4.38, '99.99 month', 0.01); eq(t.week / 60, 1.008, '99.99 week', 0.001); eq(t.day, 8.64, '99.99 day s', 0.001);
t = N.table(99.999); eq(t.year / 60, 5.256, '5 nines year min', 0.001); eq(t.month, 26.28, '5 nines month s', 0.01); eq(t.week, 6.048, '5n week s', 0.001); eq(t.day * 1000, 864, '5n day ms', 0.01);
t = N.table(99.9999); eq(t.year, 31.536, '6n year s', 0.001); eq(t.month, 2.628, '6n month', 0.001); eq(t.day * 1000, 86.4, '6n day ms', 0.001);
t = N.table(99); eq(t.year / 86400, 3.65, '99 year days', 1e-9); eq(t.day / 60, 14.4, '99 day', 1e-9);
t = N.table(100); eq(t.year, 0, '100'); t = N.table(0); eq(t.day, 86400, '0%');
eq(N.table(101), null, '>100'); eq(N.table(-1), null, '<0');
eq(N.nines(99.9), 3, 'nines 3', 1e-9); eq(N.nines(99.99), 4, 'nines 4', 1e-9); eq(N.nines(99), 2, 'nines 2', 1e-9); eq(N.nines(99.95), 3.30103, 'nines 99.95', 1e-4); eq(N.nines(100), Infinity, 'inf'); eq(N.nines(-5), null, 'neg');
// series: two 99.9 -> 99.8001 ; three 99.9 -> 99.7003
eq(N.series([99.9, 99.9]), 99.8001, 'series2', 1e-9); eq(N.series([99.9, 99.9, 99.9]), 99.7002999, 'series3', 1e-6); eq(N.series([99.99]), 99.99, 'series1', 1e-9); eq(N.series([]), null, 'series0'); eq(N.series([99, 120]), null, 'series bad');
// parallel: two 99 -> 99.99 ; two 99.9 -> 99.9999 ; three 90 -> 99.9
eq(N.parallel([99, 99]), 99.99, 'par 2x99', 1e-9); eq(N.parallel([99.9, 99.9]), 99.9999, 'par 2x99.9', 1e-9); eq(N.parallel([90, 90, 90]), 99.9, 'par 3x90', 1e-9); eq(N.parallel([]), null, 'par0');
eq(N.parallel([50]), 50, 'par1', 1e-9);
// needed
eq(N.needed(N.allowed(99.9, 30), 30), 99.9, 'needed round trip', 1e-9); eq(N.needed(0, 30), 100, 'needed 0'); eq(N.needed(86400 * 31, 30), null, 'needed negative'); eq(N.needed(-1, 30), null, 'needed bad');
eq(N.needed(3600, 365), 100 * (1 - 3600 / (365 * 86400)), 'needed 1h/yr', 1e-9);
// budget
var b = N.budget(99.9, 30, 20 * 60); eq(b.total, 2592, 'budget total'); eq(b.left, 1392, 'left'); eq(b.usedPct, 20 * 60 / 2592 * 100, 'used pct', 1e-9); eq(b.breached ? 1 : 0, 0, 'not breached');
b = N.budget(99.9, 30, 3000); eq(b.breached ? 1 : 0, 1, 'breached'); eq(b.left, -408, 'neg left'); eq(b.achieved, (1 - 3000 / 2592000) * 100, 'achieved', 1e-9);
eq(N.budget(100, 30, 0).usedPct, 0, 'zero budget zero use'); eq(N.budget(100, 30, 5).usedPct, Infinity, 'zero budget used'); eq(N.budget(99.9, 30, -1), null, 'neg used');
// fmt
eq(N.fmt(8.64) === '8.6 s' ? 1 : 0, 1, 'fmt s'); eq(N.fmt(3600 * 8.76) === '8 h 46 min' ? 1 : 0, 1, 'fmt h'); eq(N.fmt(0.0864) === '86.4 ms' ? 1 : 0, 1, 'fmt ms'); eq(N.fmt(0) === '0.0 us' ? 1 : 0, 1, 'fmt zero'); eq(N.fmt(90) === '1.5 min' ? 1 : 0, 1, 'fmt min'); eq(N.fmt(86400 * 3.65) === '3.7 days' || N.fmt(86400 * 3.65) === '3.6 days' ? 1 : 0, 1, 'fmt days'); eq(N.fmt(-60) === '-1.0 min' ? 1 : 0, 1, 'fmt neg'); eq(N.fmt(null), 'n/a', 'fmt null');
console.log(n - fails + '/' + n + ' pass'); process.exit(fails ? 1 : 0);
