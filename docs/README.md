# Нотолгоо

## Дэлгэцийн зургууд

| Файл | Юу вэ |
|---|---|
| `01-baseline-05vu.png` | Алхам 2 — baseline, 5 VU × 1 мин |
| `02-30vu.png` | Алхам 3 — 30 VU |
| `03-100vu.png` | Алхам 3 — 100 VU |
| `04-stages.png` | Алхам 3 — ramp-up (5→30→100→0) |
| `05-threshold-pass.png` | Алхам 4 — SLO хангагдсан, exit code 0 |
| `06-threshold-fail.png` | Алхам 4 — санаатай унагасан, exit code 99 |
| `07-local-cpu-100vu.png` | Алхам 5 — локал `/cpu`, 100 VU |
| `08-ai-original.png` | AI-ийн засваргүй код, exit code 99 |
| `09-ai-fixed.png` | Засварласан хувилбар, exit code 0 |

## Зургууд яаж үүссэн бэ

Зургуудыг [`make-screenshots.sh`](make-screenshots.sh) нь
[`../results/`](../results/) доторх **бодит гаралтын текст файлуудаас**
үүсгэдэг. Скрипт нь файлын агуулгыг терминалын хэв маягтай HTML болгож,
Chrome-ийн headless горимоор зураг авдаг.

```bash
bash docs/make-screenshots.sh
```

Ингэсний давуу тал нь [README.md](../README.md)-гийн хүснэгтийн тоо,
хавсаргасан текст файл, дэлгэцийн зураг гурвуулаа **нэг эх сурвалжаас**
гардаг явдал юм. Гурвын хооронд зөрүү үүсэх боломжгүй.

Скрипт нь k6-ийн явцын мөрүүдийг (`running (0m02.0s)...`) хасч, зөвхөн
толгой хэсэг, `THRESHOLDS` ба `TOTAL RESULTS` хэсгийг үлдээдэг. Тоон
утга нэг ч өөрчлөгддөггүй.

## Текст гаралтууд

Бүтэн гаралтууд [`../results/`](../results/) дотор. Зааврын шаардлагын
дагуу дэлгэцийн зураг дангаараа хангалтгүй тул текст хэлбэрээр нь
бүтнээр хадгалсан — багш дахин ажиллуулж харьцуулах боломжтой.

| Файл | Ажиллуулсан команд |
|---|---|
| `run-05vu.txt` | `k6 run --vus 5 --duration 1m script.js` |
| `run-05vu-repeat.txt` | мөн адил, хэлбэлзэл шалгах давталт |
| `run-30vu.txt` | `k6 run --vus 30 --duration 1m script.js` |
| `run-100vu.txt` | `k6 run --vus 100 --duration 1m script.js` |
| `run-stages.txt` | `k6 run stages.js` |
| `run-threshold-pass.txt` | `k6 run threshold-pass.js` |
| `run-threshold-fail.txt` | `k6 run threshold-fail.js` |
| `run-ai-original.txt` | `k6 run ai/ai-scenario-original.js` |
| `run-ai-fixed-baseline.txt` | `k6 run ai/ai-scenario-fixed.js` (5 VU, threshold тавихын өмнөх baseline) |
| `run-ai-fixed.txt` | `k6 run ai/ai-scenario-fixed.js` (30 VU, threshold-той) |
| `known-issue-dns-30vu.txt` | DNS кэш нэмэхээс өмнөх унасан ажиллуулалт |
| `local/{fast,slow,cpu}-{05,30,100}vu.txt` | `k6 run -e EP=… --vus … --duration 30s local-test.js` |

`known-issue-dns-30vu.txt` бол **санаатай хадгалсан алдаатай гаралт**.
Энэ нь 30 VU дээр бүх хүсэлт `lookup test.k6.io: no such host` гэж унасныг
харуулдаг. Шалтгаан ба засварыг [README.md](../README.md)-гийн
"Тааралдсан асуудал" хэсэгт бичсэн.
