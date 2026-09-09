#!/bin/bash
# Lab02 - k6 garaltiin zurag uusgeh
#
# results/*.txt dotorh BODIT garaltaas terminal-iin hewtei PNG uusgene.
# Ingesneer README-giin hüsnegtiin to, hawsargasan tekst fail, ba zurag
# gurwuulaa NEG l ehees garna - zurag deer neg to, faild oor to gej
# zuruh bolomjgui.
#
# Ajilluulah:  bash docs/make-screenshots.sh
set -e
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT=docs/screenshots
TMP=$(mktemp -d)

shot() { # $1=src txt  $2=out name  $3=garchig
  local src="$1" name="$2" title="$3"
  # Progress-iin muruudiig hasch, uldsen bukh garaltiig awna
  local body
  body=$(grep -v -E '^(running \(|default +[✓✗]? *\[)' "$src" | cat -s)
  {
    printf '<meta charset="utf-8"><style>'
    printf 'body{margin:0;background:#0d1117;font:13px/1.45 Menlo,Monaco,monospace;color:#c9d1d9}'
    printf '.bar{background:#161b22;color:#8b949e;padding:8px 14px;border-bottom:1px solid #30363d;font-size:12px}'
    printf '.dot{height:11px;width:11px;border-radius:50%%;display:inline-block;margin-right:6px}'
    printf 'pre{margin:0;padding:14px 18px;white-space:pre;color:#c9d1d9}'
    printf '</style><div class="bar">'
    printf '<span class="dot" style="background:#ff5f57"></span>'
    printf '<span class="dot" style="background:#febc2e"></span>'
    printf '<span class="dot" style="background:#28c840"></span>'
    printf '%s</div><pre>' "$title"
    printf '%s' "$body" | sed -e 's/&/\&amp;/g' -e 's/</\&lt;/g' -e 's/>/\&gt;/g'
    printf '</pre>'
  } > "$TMP/$name.html"

  # Ondriig aguulgiin mur toogoor bodno - dooguur hooson zai uldehgui
  local lines h
  lines=$(printf '%s\n' "$body" | wc -l | tr -d ' ')
  h=$(( lines * 19 + 70 ))
  [ "$h" -lt 300 ] && h=300

  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --window-size=1120,$h --screenshot="$OUT/$name.png" \
    "file://$TMP/$name.html" >/dev/null 2>&1
  echo "  $OUT/$name.png"
}

echo "Zurag uusgej baina..."
shot results/run-05vu.txt              01-baseline-05vu    "k6 run --vus 5 --duration 1m script.js"
shot results/run-30vu.txt              02-30vu             "k6 run --vus 30 --duration 1m script.js"
shot results/run-100vu.txt             03-100vu            "k6 run --vus 100 --duration 1m script.js"
shot results/run-stages.txt            04-stages           "k6 run stages.js"
shot results/run-threshold-pass.txt    05-threshold-pass   "k6 run threshold-pass.js   (exit 0 - PASS)"
shot results/run-threshold-fail.txt    06-threshold-fail   "k6 run threshold-fail.js   (exit 99 - FAIL)"
shot results/local/cpu-100vu.txt       07-local-cpu-100vu  "k6 run -e EP=/cpu --vus 100 --duration 30s local-test.js"
shot results/run-ai-original.txt       08-ai-original      "k6 run ai/ai-scenario-original.js   (exit 99)"
shot results/run-ai-fixed.txt          09-ai-fixed         "k6 run ai/ai-scenario-fixed.js   (exit 0)"
rm -rf "$TMP"
echo "Bolow."
