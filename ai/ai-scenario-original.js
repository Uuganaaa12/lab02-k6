/**
 * ==========================================================================
 *  AI-GEER UUSGESEN KOD - ZASWARGUI, ANHNII HUWILBAR
 * ==========================================================================
 *  Uusgesen: Claude (Anthropic), 2026-09-09
 *  Huselt:  "Nevtreh, daraa n' hailt hiideg hereglegchiin scenario-g
 *            k6-aar bich"
 *
 *  ENE FAIL-D GAR HURUUGUI. Yag garsan chigeeree n' hadgalsan - yagaad
 *  gevel daalgavriin nemelt heseg "AI yu buruu hiisen" -iig shalgahiig
 *  huusen. Zaswarlasan huwilbar: ai-scenario-fixed.js
 *
 *  Ajilluulahaas UMNU hiisen ZAAVAL SHALGALT (yos zuin zaalt):
 *    AI ni BASE_URL-ee https://test.k6.io gej sansan - ene ni zaawriin
 *    zuwshuurugdsun bai mun tul solih shaardlagagui baisan. Gehdee
 *    shalgalt hiih n' zaawal - AI ihewchlen sanamsargui gadaad sait
 *    zaadag.
 * ==========================================================================
 */
import http from 'k6/http';
import { check, sleep, group } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.95'],
  },
};

const BASE_URL = 'https://test.k6.io';

export default function () {
  group('01. Nevtreh', function () {
    const res = http.post(`${BASE_URL}/my_messages.php`, {
      login: 'admin',
      password: '123',
    });
    check(res, {
      'nevtrelt amjilttai': (r) => r.status === 200,
      'Welcome tekst baina': (r) => r.body.includes('Welcome'),
    });
  });

  sleep(1);

  group('02. Hailt', function () {
    const res = http.get(`${BASE_URL}/news.php?search=k6`);
    check(res, {
      'hailt amjilttai': (r) => r.status === 200,
    });
  });

  sleep(1);
}
