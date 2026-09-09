import http from 'k6/http';
import { check } from 'k6';

/**
 * Lab02 - Alham 5: Lokal server ruu achaalliin test
 *
 * Bai: http://127.0.0.1:3000 - OORIIN mashin deer ajillaj baigaa server.
 * Yos zuin zaalt: zuwhun lokal server ba test.k6.io zuwshuurugdsun.
 *
 * Endpoint ba VU-g gadnaas ugnu:
 *   k6 run -e EP=/slow --vus 30 --duration 30s local-test.js
 *
 * Yagaad sleep() ashiglaagui ve:
 *   test.k6.io deer sleep(1) tavij bodit hereglegchiin zavsarlagiig damjuulsan.
 *   Harin end zorilgo n' ONDOR - serveriin BAGTAAMJIIN HYAZGAARIIG oloh.
 *   Sleep baival VU tutamd sekundend 1 huselt l ochno; sleep-gui uyed VU
 *   chadlaaraa huselt ilgeeh tul server hezee hanaj, latency hezee usej
 *   ehelj baigaa n' todorhoi haragdana.
 */
const EP = __ENV.EP || '/';
const BASE = 'http://127.0.0.1:3000';

export const options = {
  vus: 5,
  duration: '30s',
};

export default function () {
  const res = http.get(`${BASE}${EP}`);
  check(res, { 'status 200 baina': (r) => r.status === 200 });
}
