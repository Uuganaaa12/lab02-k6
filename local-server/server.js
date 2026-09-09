/**
 * Lab02 - Alham 5 ba AI daalgavar: Lokal test server
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
 * AI daalgavriin scenario-d zoriulsan (nevtreh + hailt):
 *   GET  /login   - nevtreh maygt, csrf token butsaana
 *   POST /login   - csrf + newtreh medeelel shalgaj session token ugne
 *   GET  /search  - session shaardana, ?q= parametreer heaj hariulna
 *
 * Ajilluulah:  node local-server/server.js
 */
const http = require('http');

const PORT = 3000;

// Nevtrelt: energiin bagatai demo hereglegch. Ene ni LOKAL mock server
// tul jinhene nuuts ug bish - repo-d ilerhii bichij bolno.
const USER = 'admin';
const PASS = '123';

// Idewhtei session-uud (sanamsargui token -> hereglegchiin ner)
const sessions = new Map();

// Buh GET /login huselt neg csrf token ugne. Bodit sistemd ene ni
// session bur deer ondor baih yostoi; end k6-iin CORRELATION
// (hariunaas utga sugalj daraagiin huseld damjuulah) -iig uzuuleh
// zoriulalttai hyalbarchilsan hewilbar.
function makeToken() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const csrfTokens = new Set();

// Event loop-iig haadag ajil (keshlekh bolomjgui tootsoolol)
function burnCpu(ms) {
  const end = Date.now() + ms;
  let x = 0;
  while (Date.now() < end) {
    x += Math.sqrt(Math.random());
  }
  return x;
}

const BASE_FOR_PARSE = `http://127.0.0.1:${PORT}`;

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  const send = (body) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
  };

  if (url === '/login' && req.method === 'GET') {
    // Nevtreh maygt - csrf token-iig HTML dotor buulgana (k6 regex-eer sugalna)
    const token = makeToken();
    csrfTokens.add(token);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!doctype html><html><body><h2>Login</h2>
<form method="post" action="/login">
<input type="hidden" name="csrftoken" value="${token}">
<input name="login"><input name="password" type="password">
<button>Login</button></form></body></html>`);
  } else if (url === '/login' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      const f = Object.fromEntries(new URLSearchParams(body));

      // 1. csrf token shalgah - AI-giin anhnii kod uunig ogt hiigeegui
      if (!f.csrftoken || !csrfTokens.has(f.csrftoken)) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ ok: false, error: 'bad csrf token' }));
      }
      csrfTokens.delete(f.csrftoken); // neg udaagiin token

      // 2. Newtreh medeelel shalgah
      if (f.login !== USER || f.password !== PASS) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ ok: false, error: 'buruu ner esvel nuuts ug' }));
      }

      const sid = makeToken();
      sessions.set(sid, f.login);
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Set-Cookie': `sid=${sid}; Path=/; HttpOnly`,
      });
      res.end(JSON.stringify({ ok: true, user: f.login, message: `Welcome, ${f.login}!` }));
    });
    return;
  } else if (url === '/search') {
    // Session shaardana - cookie-goos sid unshina
    const cookie = req.headers.cookie || '';
    const m = cookie.match(/sid=([^;]+)/);
    if (!m || !sessions.has(m[1])) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: false, error: 'nevtreegui' }));
    }
    const q = new URL(req.url, BASE_FOR_PARSE).searchParams.get('q') || '';
    // Hailtiin ajil duuraij ~2ms CPU zartsuulna
    burnCpu(2);
    const hits = q ? [`${q} - result 1`, `${q} - result 2`, `${q} - result 3`] : [];
    send({ ok: true, query: q, count: hits.length, hits });
  } else if (url === '/') {
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
  console.log('  GET/POST /login   nevtrelt (csrf + session)');
  console.log('  GET /search?q=..  session shaardana');
});
