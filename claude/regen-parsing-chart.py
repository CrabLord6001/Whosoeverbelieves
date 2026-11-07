#!/usr/bin/env python3
"""Rebuild the baked study-chart images for /greek/parsing-flowchart.

The page serves the master chart as two WebP files (one per theme) rather than
rendering it at runtime, so they must be regenerated whenever TREE changes.
This drives the page's own renderFlow() in a headless browser, so the output
always matches the live game's layout exactly.

    python3 claude/regen-parsing-chart.py [repo_root]

Writes images/gk/parsing-flowchart-{dark,light}.webp and prints the chart's
pixel width, which must match the width in the page's .fc-chart img rule.
"""
import sys, os, subprocess, threading, http.server, socketserver, functools
from playwright.sync_api import sync_playwright
from PIL import Image

ROOT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else '.')
PORT = 8911
OUT  = os.path.join(ROOT, 'images', 'gk')

INJECT = """() => {
  const host=document.createElement('div');
  host.id='regen';
  host.style.cssText='position:fixed;left:0;top:0;background:var(--bg);padding:28px;z-index:99999';
  const NS='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(NS,'svg'); svg.setAttribute('class','cv');
  const g=document.createElementNS(NS,'g');
  svg.appendChild(g); host.appendChild(svg); document.body.appendChild(host);
  const L=renderFlow(g, new Set(Object.keys(G)), {});
  svg.setAttribute('viewBox','0 0 '+L.W+' '+L.H);
  svg.style.width=Math.round(L.W)+'px'; svg.style.height=Math.round(L.H)+'px';
  return {W:Math.round(L.W), H:Math.round(L.H)};
}"""

def serve():
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
    socketserver.TCPServer.allow_reuse_address = True
    srv = socketserver.TCPServer(('127.0.0.1', PORT), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv

def main():
    srv = serve()
    os.makedirs(OUT, exist_ok=True)
    try:
        with sync_playwright() as p:
            b = p.chromium.launch()
            dims = None
            for mode in ('dark', 'light'):
                pg = b.new_page(viewport={'width': 2200, 'height': 1400}, device_scale_factor=2)
                pg.goto('http://127.0.0.1:%d/greek/parsing-flowchart.html' % PORT)
                pg.wait_for_function("document.fonts && document.fonts.status==='loaded'", timeout=30000)
                pg.wait_for_timeout(600)
                if mode == 'light':
                    pg.evaluate("document.documentElement.classList.add('light-mode')")
                    pg.wait_for_timeout(300)
                dims = pg.evaluate(INJECT)
                pg.wait_for_timeout(400)
                png = '/tmp/regen-%s.png' % mode
                pg.query_selector('#regen').screenshot(path=png)
                dst = os.path.join(OUT, 'parsing-flowchart-%s.webp' % mode)
                Image.open(png).convert('RGB').save(dst, 'WEBP', quality=92, method=6)
                print('  %-5s %s  %d KB' % (mode, dst, os.path.getsize(dst) // 1024))
                pg.close()
            b.close()
        print('\nchart is %dx%d CSS px' % (dims['W'], dims['H']))
        print('.fc-chart img width must be %dpx; .vt-desc width min(%dpx,98vw)'
              % (dims['W'], dims['W'] + 31))
    finally:
        srv.shutdown()

if __name__ == '__main__':
    main()
