import http from 'k6/http';
import { sleep, check } from 'k6';

/**
 * Lab02 - Alham 4: Thresholds (SLO-g kodoor shalguulah) - PASS hüwilbar
 *
 * SLO-giin undeslel (zaawriin jishee toog HUULAAGUI):
 *   Baseline hemjilt (results/run-05vu.txt, 5 VU x 1m):  p95 = 441.95 ms
 *   SLO = baseline p95 x 1.5 = 662.9 ms  ->  buruulj 650 ms bolgow.
 *
 *   Yagaad 1.5 dahin ve: baseline ni achaalal bagatai uyeiin SAIN nohtsol.
 *   Achaalal usukhud zarim udaashral nemegdehiig hulteetsteiger huleen
 *   zuwshuurch, gehdee 1.5 dahinaas hetervel "hereglegchid medegdehuits
 *   muudsan" gej uzej testiig unagana.
 *
 *   Aldaanii SLO 1% ni lektsiin POFOD-iin shuud analog.
 */
export const options = {
  vus: 30,
  duration: '1m',

  dns: { ttl: 'inf', select: 'first', policy: 'preferIPv4' },

  thresholds: {
    http_req_duration: ['p(95)<650'],  // SLO: p95 < 650ms (baseline x 1.5)
    http_req_failed: ['rate<0.01'],    // SLO: aldaanii huvi < 1%
  },
};

export default function () {
  const res = http.get('https://test.k6.io');
  check(res, { 'status 200 baina': (r) => r.status === 200 });
  sleep(1);
}
