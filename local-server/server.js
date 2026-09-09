/**
 * Lab02 - Alham 5: Lokal test server
 *
 * Node-iin durems http modulaar bichsen - garaas kheregseel suulgahgui
 * (node_modules ogt uusehgui) tul repo tsever, bagsh shuud ajilluulj chadna.
 *
 * Gurwan endpoint:
 *   GET /       - shuud hariulna (suuriin hemjilt)
 *   GET /slow   - 100ms hulteed hariulna (setTimeout = I/O-giin dutuurhen,
 *                 event loop-iig HAADAGGUI tul zeregtsee ajilladag)
 *   GET /cpu    - ~5ms CPU-giin ajil hiine (event loop-iig HAADAG tul
 *                 achaalal usukhud daraalal uusch latency shuud usne)
 *
 * Ajilluulah:  node local-server/server.js
 */
const http = require('http');

const PORT = 3000;

// Event loop-iig haadag ajil (keshlekh bolomjgui tootsoolol)
function burnCpu(ms) {
  const end = Date.now() + ms;
  let x = 0;
  while (Date.now() < end) {
    x += Math.sqrt(Math.random());
  }
  return x;
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  const send = (body) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
  };

  if (url === '/') {
    send({ ok: true, endpoint: 'fast' });
  } else if (url === '/slow') {
    // 100ms hulteelt - I/O huleelttei ijil, event loop chuluutei uldene
    setTimeout(() => send({ ok: true, endpoint: 'slow', delayMs: 100 }), 100);
  } else if (url === '/cpu') {
    // 5ms CPU - event loop haagdana
    burnCpu(5);
    send({ ok: true, endpoint: 'cpu', workMs: 5 });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'not found' }));
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Lab02 test server: http://127.0.0.1:${PORT}`);
  console.log('  GET /      shuud');
  console.log('  GET /slow  100ms setTimeout');
  console.log('  GET /cpu   5ms CPU');
});
