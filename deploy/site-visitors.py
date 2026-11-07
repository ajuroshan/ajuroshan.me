#!/usr/bin/env python3
"""Count unique daily visitors to ajmalroshan.dev from the nginx log. No cookies, no scripts.

A visitor is one (real IP, user agent) pair per UTC day, kept only as a salted hash and only for that day.
Run every minute by site-status; prints the running total. State: /var/lib/site-visitors/state.json
"""
import hashlib, json, os, re, secrets, sys, time

LOG = '/var/log/nginx/ajmalroshan.visits.log'
STATE = '/var/lib/site-visitors/state.json'
BOTS = re.compile(r'bot|crawl|spider|slurp|preview|curl|wget|python|httpclient|go-http|headless|lighthouse|monitor|uptime|facebookexternalhit|embedly', re.I)
PAGE = re.compile(r'^/(?:[\w\-./]*/)?(?:index\.html)?(?:\?.*)?$')   # directory pages only, not assets or json

def load():
    try:
        with open(STATE) as f: return json.load(f)
    except Exception:
        return {'total': 0, 'inode': None, 'offset': 0, 'day': None, 'salt': None, 'seen': []}

def main():
    st = load()
    day = time.strftime('%Y-%m-%d', time.gmtime())
    if st.get('day') != day:
        st.update(day=day, salt=secrets.token_hex(16), seen=[])   # forget yesterday entirely
    seen = set(st['seen'])
    try:
        s = os.stat(LOG)
    except FileNotFoundError:
        print(st['total']); return
    if st.get('inode') != s.st_ino or st.get('offset', 0) > s.st_size:
        st['inode'], st['offset'] = s.st_ino, 0          # rotated
    with open(LOG, 'rb') as f:
        f.seek(st['offset'])
        for raw in f:
            try:
                ip, method, path, status, ua = raw.decode('utf-8', 'replace').rstrip('\n').split('\t')[:5]
            except ValueError:
                continue
            if method != 'GET' or status != '200' or not PAGE.match(path) or not ip or BOTS.search(ua):
                continue
            h = hashlib.sha256(f"{st['salt']}|{ip}|{ua}".encode()).hexdigest()[:20]
            if h not in seen:
                seen.add(h); st['total'] += 1
        st['offset'] = f.tell()
    st['seen'] = sorted(seen)
    os.makedirs(os.path.dirname(STATE), exist_ok=True)
    tmp = STATE + '.tmp'
    with open(tmp, 'w') as f: json.dump(st, f)
    os.replace(tmp, STATE)
    print(st['total'])

if __name__ == '__main__':
    main()
