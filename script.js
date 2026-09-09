import http from 'k6/http';
import { sleep, check } from 'k6';

/**
 * Lab02 - Alham 2: Anhny test (baseline)
 *
 * Bai (target): https://test.k6.io - k6-iin ALBAN YOSNII dadlagiin sait.
 * Zaavriin yos zuin heseg zuvhun uunig ba lokal server ruu test hiihiig
 * zuvshuursun. Onder sait ruu ogt handahgui.
 *
 * VU/duration-g endees bish CLI-gaas ugnu (--vus, --duration) gesen uchir ni
 * Alham 3-d neg l script-eer 5/30/100 VU-g tusad n' ajilluulah shaardlagatai.
 * Ingesneer gurvan hemjilt YAG IJIL kodoos garna.
 */
export const options = {
  vus: 5,
  duration: '30s',

  /**
   * DNS-iin kesh. Uunigui uyed 30 ba tuunees deesh VU deer bukh huselt
   * "lookup test.k6.io: no such host" gej unasan (nootolgoo:
   * results/known-issue-dns-30vu.txt). Shaltgaan ni k6 iteration bur deer
   * shine DNS lookup hiihed macOS-iin resolver 30+ zeregtsee huselt daahgui
   * bolson yavdal. ttl=inf gesneer hayagiig neg l udaa shiideed testiin
   * turshid keshleedeg tul asuudal barigdsan.
   */
  dns: {
    ttl: 'inf',
    select: 'first',
    policy: 'preferIPv4',
  },
};

export default function () {
  const res = http.get('https://test.k6.io');

  // check() ni testiig unagaadaggui, zuvhun amjiltiin huviig toolno.
  // Bodit PASS/FAIL-g Alham 4-iin thresholds shiidne.
  check(res, {
    'status 200 baina': (r) => r.status === 200,
  });

  // Bodit hereglegch huudas unshih zavsarlagiig damjuulna.
  // Ugui bol 1 VU sekundend heden zuun hüseld ilgeeh bolno.
  sleep(1);
}
