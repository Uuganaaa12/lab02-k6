import http from 'k6/http';
import { sleep, check } from 'k6';

/**
 * Lab02 - Alham 4: Thresholds - SANAATAI UNAGASAN hüwilbar
 *
 * Ene ni SLO BISH. threshold-pass.js-tei yag ijil, gants ylgaa n' p95-iin
 * hyazgaariig 650ms-ees 50ms bolgoj SANAATAIGAAR biyelehgui bolgoson.
 *
 * Zorilgo: CI pipeline deer quality gate yaj ajilladgiig uzuuleh.
 *   - k6 exit code 99 gargana (0 bish) -> CI shat ULAAN bolno
 *   - garalt deer threshold-iin mur ✗ temdegtei garna
 *
 * Yagaad 50ms biyelehgui ve: gadaad sait ruu zuwhun TLS handshake hiihed
 * l ~130ms zartsuuldag. Ooroor helbel 50ms ni suljeenii bodit
 * hyazgaaraas dooguur tul HEZEE CH biyelehgui.
 */
export const options = {
  vus: 30,
  duration: '1m',

  dns: { ttl: 'inf', select: 'first', policy: 'preferIPv4' },

  thresholds: {
    http_req_duration: ['p(95)<50'],   // SANAATAI HATUU: 50ms - biyelehgui
    http_req_failed: ['rate<0.01'],    // SLO: aldaanii huvi < 1%
  },
};

export default function () {
  const res = http.get('https://test.k6.io');
  check(res, { 'status 200 baina': (r) => r.status === 200 });
  sleep(1);
}
