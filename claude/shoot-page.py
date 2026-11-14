"""Screenshot any page of the site at phone and desktop widths, using the local Playwright install.

The Linux VM behind Claude's device_bash has no browser, so this runs on Jonathan's machine:

  py claude/shoot-page.py articles/greater-judgment-of-teachers.html

It serves the repo root over HTTP first, because a file:// load silently skips the scripts that
build part of the DOM. Shots land in "Claude outputs/shots/" as <name>-390.png and <name>-1280.png.
390px is the iPhone width Jonathan checks against; 1280 stands in for the desktop reading layout.
"""
import pathlib
import sys
import threading
import functools
import http.server
import socketserver

REPO = pathlib.Path(__file__).resolve().parent.parent
OUT = REPO / "Claude outputs" / "shots"
PORT = 8731
WIDTHS = [(390, 844), (1280, 1200)]


def serve():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(REPO))
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(("127.0.0.1", PORT), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def main(rel):
    from playwright.sync_api import sync_playwright

    OUT.mkdir(parents=True, exist_ok=True)
    name = pathlib.Path(rel).stem
    httpd = serve()
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            for w, h in WIDTHS:
                page = browser.new_page(viewport={"width": w, "height": h})
                page.goto(f"http://127.0.0.1:{PORT}/{rel}", wait_until="networkidle")
                page.wait_for_timeout(600)          # let webfonts settle before measuring
                target = OUT / f"{name}-{w}.png"
                page.screenshot(path=str(target), full_page=True)
                print(f"wrote {target}")
                page.close()
            browser.close()
    finally:
        httpd.shutdown()


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1].replace("\\", "/"))
