#!/bin/sh
# Opens each live world in the desktop app under a virtual screen (software WebGL), with the internet
# blocked by the app itself, and writes a screenshot + report per world to selftest/.
cd "$(dirname "$0")"; mkdir -p selftest
ELECTRON=${ELECTRON:-node_modules/electron/dist/electron}
for w in ${WORLDS:-dustara sporeholm ferrox thalassa neonis}; do
  timeout 240 xvfb-run -a -s "-screen 0 1600x900x24" "$ELECTRON" ${APPDIR:-.} --no-sandbox --use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader \
    --selftest=$w,${SECS:-60},$PWD/selftest/$w.png >/dev/null 2>&1
  echo "== $w"; cat selftest/$w.json
done
