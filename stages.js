import http from 'k6/http';
import { sleep, check } from 'k6';

/**
 * Lab02 - Alham 3: Achaalliig shatlan usguh (ramp-up)
 *
 * Bai: https://test.k6.io (zuvshuurugdsun dadlagiin sait)
 *
 * ANHAAR: stages ashiglasan NEG ajilluulalt ni testiin tugsguld NEGTGESEN
 * gantshan summary ugdug. Uunees 5/30/100 VU tus buriin p95-g SALGAJ
 * AVAH BOLOMJGUI. Tiimees README-giin hartsuulsan hüsnegtiin toog endees
 * bish, script.js-g tusad n' ajilluulsan gurwan garaltaas (results/run-*.txt)
 * avsan. Ene ajilluulalt ni zuvhun achaalal usuh ba buuh UYEIIN
 * YERUNHII ZURGIIG haruulah zoriulalttai.
 */
export const options = {
  stages: [
    { duration: '30s', target: 5 },    // halaalt
    { duration: '1m', target: 30 },    // usgult
    { duration: '30s', target: 100 },  // orgil
    { duration: '30s', target: 0 },    // buult
  ],

  // script.js-tei ijil shaltgaanaar (30+ VU deer DNS lookup unadag)
  dns: { ttl: 'inf', select: 'first', policy: 'preferIPv4' },
};

export default function () {
  const res = http.get('https://test.k6.io');
  check(res, { 'status 200 baina': (r) => r.status === 200 });
  sleep(1);
}
