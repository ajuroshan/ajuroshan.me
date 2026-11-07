#!/usr/bin/env bash
# Writes /var/www/status/status.json: what arm-free-01 is doing right now.
# Run by site-status.timer every minute (as root). The site reads it at build time and in the browser.
set -euo pipefail
OUT=/var/www/status/status.json
TMP="$OUT.tmp"
units=(nginx hermes-gateway)   # only what the site shows; keep the rest of the box private

iso() { date -u -d "$1" +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u +%Y-%m-%dT%H:%M:%SZ; }
svc() { printf '{"id":"%s","state":"%s","since":"%s"}' "$1" "$2" "$3"; }

rows=()
for u in "${units[@]}"; do
  state=$(systemctl is-active "$u" 2>/dev/null || true)
  since=$(systemctl show -p ActiveEnterTimestamp --value "$u" 2>/dev/null || true)
  rows+=("$(svc "$u" "${state:-unknown}" "$(iso "${since:-now}")")")
done
# the habit tracker is a container
if hs=$(docker inspect -f '{{.State.Status}} {{.State.StartedAt}}' habit-tracker 2>/dev/null); then
  st=${hs%% *}; [ "$st" = running ] && st=active
  rows+=("$(svc habit-tracker "$st" "$(iso "${hs#* }")")")
fi

uptime_s=$(cut -d. -f1 /proc/uptime)
boot=$(date -u -d "@$(( $(date +%s) - uptime_s ))" +%Y-%m-%dT%H:%M:%SZ)
read -r l1 l5 l15 _ < /proc/loadavg
read -r _ mt mu _ < <(free -m | awk '/^Mem:/{print "x",$2,$3}')
read -r du dt < <(df -BG --output=used,size / | awk 'NR==2{gsub("G","");print $1,$2}')
brief=$(grep -E ' sent' /home/ubuntu/.hermes/logs/morning_digest.log 2>/dev/null | tail -1 | cut -c1-19 || true)
brief_iso=""; [ -n "$brief" ] && brief_iso=$(TZ=Asia/Kolkata date -u -d "$brief" +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || true)
visitors=$(/usr/local/bin/site-visitors 2>/dev/null || echo null)
rel=$(readlink -f /var/www/ajuroshan.me/current 2>/dev/null || true)
ver=${rel##*-}; dep=""
[ -n "$rel" ] && dep=$(date -u -r "$rel" +%Y-%m-%dT%H:%M:%SZ)

install -d -m 755 "$(dirname "$OUT")"
{
  printf '{"host":"%s","arch":"%s","cpus":%s,"generated":"%s","boot":"%s","uptime_s":%s,' \
    "$(hostname)" "$(uname -m)" "$(nproc)" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$boot" "$uptime_s"
  printf '"load":[%s,%s,%s],"mem_used_mb":%s,"mem_total_mb":%s,"disk_used_gb":%s,"disk_total_gb":%s,' "$l1" "$l5" "$l15" "$mu" "$mt" "$du" "$dt"
  printf '"services":[%s],' "$(IFS=,; echo "${rows[*]}")"
  printf '"visitors":%s,' "${visitors:-null}"
  printf '"brief_last":%s,' "$([ -n "$brief_iso" ] && printf '"%s"' "$brief_iso" || echo null)"
  printf '"site":{"version":"%s","deployed":"%s"}}\n' "$ver" "$dep"
} > "$TMP"
python3 -c 'import json,sys; json.load(open(sys.argv[1]))' "$TMP"   # refuse to publish broken JSON
chmod 644 "$TMP"; mv -f "$TMP" "$OUT"
