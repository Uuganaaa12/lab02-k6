/**
 * ==========================================================================
 *  AI-giin kodiig OORIIN GAARAAR ZASSAN huwilbar
 * ==========================================================================
 *  Anhnii AI kod: ai-scenario-original.js (garalt: results/run-ai-original.txt)
 *  Ene faild yu solisniig README.md-iin "AI onts" hesegt jagsaasan.
 *
 *  Hamgiin tom zasvar: BAI SOLISON.
 *    AI ni test.k6.io ruu nevtreh POST ilgeesen. Bodit deer:
 *      - csrf token-gui POST -> CloudFront 403 butsaadag
 *      - csrf token-tei ch gesen tere huudas ni "Imitation page" buyu
 *        zuvhun HELBER n' baigaa mock - session ogt uusgedeggui
 *    Ooroor helbel AI ni BAIHGUI zan tuluwd ('Welcome' tekst garna gej)
 *    assertion bichsen. Tiimees nevtreh scenario-g OORIIN lokal server ruu
 *    (local-server/server.js) shiljuulsen - tende nevtrelt jinhene
 *    ajilladag ba bi hariug n' burnee handaj chadna.
 */
import http from 'k6/http';
import { check, sleep, group } from 'k6';

const BASE = 'http://127.0.0.1:3000';

export const options = {
  vus: 30,
  duration: '30s',

  /**
   * AI ni p(95)<500 gej dur zorgoor to sanal bolgoson - ali ch
   * hemjilted undeslegdeegui. Ene bol SLO bish, taamag.
   *
   * Ene threshold ni OORIIN baseline-aas garsan:
   *   results/run-ai-fixed-baseline.txt (5 VU x 30s): p95 = 6.03 ms
   *   SLO = 6.03 x 1.5 = 9.05 ms  ->  10 ms bolgoj bugleew.
   */
  thresholds: {
    http_req_duration: ['p(95)<10'],   // SLO: baseline p95 x 1.5
    http_req_failed: ['rate<0.01'],    // SLO: aldaa < 1%
    checks: ['rate>0.99'],             // scenario-giin alham bur biyelekh
  },
};

export default function () {
  let csrf;
  let loggedIn = false;

  group('01. Nevtreh huudas avah', function () {
    const res = http.get(`${BASE}/login`);
    // CORRELATION: hariunaas csrf token-g sugalj avna.
    // AI-giin kod ene alhmiig ogt hiigeegui - tiimees l 403 avdag baisan.
    const m = res.body.match(/name="csrftoken" value="([^"]+)"/);
    csrf = m ? m[1] : null;

    check(res, {
      'login huudas 200': (r) => r.status === 200,
      'csrf token oldson': () => csrf !== null,
    });
  });

  group('02. Nevtreh', function () {
    if (!csrf) return; // token-gui bol nevtrehiig ch oroldohgui

    const res = http.post(`${BASE}/login`, {
      login: 'admin',
      password: '123',
      csrftoken: csrf,
    });

    // AI ni zuvhun status===200 shalgasan. Gehdee nevtreh maygt
    // butsaad iree ch 200 baidag tul ene ni HUURMAG NOGOON ugnu.
    // Tiimees hariunii AGUULGIIG shalgana.
    loggedIn = res.status === 200 && res.json('ok') === true;

    check(res, {
      'nevtrelt 200': (r) => r.status === 200,
      'ok:true butssan': (r) => r.json('ok') === true,
      'Welcome zurvas irsen': (r) => String(r.json('message')).includes('Welcome'),
    });
  });

  sleep(1);

  group('03. Hailt', function () {
    if (!loggedIn) return;

    // Session cookie-g k6 avtomataar hadgalj daraagiin huseld hawsargana.
    const res = http.get(`${BASE}/search?q=k6`);

    check(res, {
      'hailt 200': (r) => r.status === 200,
      'ur dun 3 baina': (r) => r.json('count') === 3,
    });
  });

  sleep(1);
}
