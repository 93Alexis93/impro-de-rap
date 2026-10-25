from html.parser import HTMLParser
from pathlib import Path
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
html_path = ROOT / "index.html"
sw_path = ROOT / "sw.js"
manifest_path = ROOT / "manifest.webmanifest"

class AuditParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.scripts = []
        self.in_script = False
        self.current_script = []
        self.local_assets = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "script":
            self.in_script = True
            self.current_script = []
        for key in ("src", "href"):
            value = attrs.get(key, "")
            if value.startswith("./") and not value.startswith("//"):
                self.local_assets.append(value.split("?", 1)[0].split("#", 1)[0])

    def handle_data(self, data):
        if self.in_script:
            self.current_script.append(data)

    def handle_endtag(self, tag):
        if tag == "script" and self.in_script:
            self.scripts.append("".join(self.current_script))
            self.in_script = False
            self.current_script = []

def check(condition, message):
    if not condition:
        print("FAIL:", message)
        return False
    print("PASS:", message)
    return True

ok = True
html = html_path.read_text(encoding="utf-8")
parser = AuditParser()
parser.feed(html)
parser.close()

ok &= check(html.lstrip().lower().startswith("<!doctype html>"), "HTML document has a doctype")
ok &= check(len(parser.scripts) == 1, "exactly one inline application script is present")
dupes = sorted({item for item in parser.ids if parser.ids.count(item) > 1})
ok &= check(not dupes, "HTML IDs are unique" + (f" (duplicates: {dupes})" if dupes else ""))

script = parser.scripts[0] if parser.scripts else ""
refs = set(re.findall(r'\$\(["\']([^"\']+)["\']\)', script))
refs.update(re.findall(r'document\.getElementById\(["\']([^"\']+)["\']\)', script))
missing = sorted(refs - set(parser.ids))
ok &= check(not missing, "static JavaScript element lookups exist in HTML" + (f" (missing: {missing})" if missing else ""))

for element_id in ("freeStart", "freePause", "freeReset", "freeStop", "freeHome",
                   "freeSaveText", "freeLoadText", "freeDeleteText", "freeScroll", "freeText"):
    ok &= check(element_id in parser.ids, f"freestyle control exists: #{element_id}")

try:
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    ok &= check(bool(manifest.get("name")) and bool(manifest.get("start_url")), "web manifest parses and has name/start_url")
except Exception as exc:
    ok &= check(False, f"web manifest parses ({exc})")

try:
    sw = sw_path.read_text(encoding="utf-8")
    match = re.search(r'const\s+APP_SHELL\s*=\s*\[(.*?)\]', sw, re.S)
    assets = re.findall(r'["\']([^"\']+)["\']', match.group(1)) if match else []
    missing_assets = [asset for asset in assets if not (ROOT / asset.removeprefix("./")).is_file()]
    ok &= check(bool(match), "service worker defines an app shell")
    ok &= check(not missing_assets, "all service-worker app-shell files exist" + (f" (missing: {missing_assets})" if missing_assets else ""))
    ok &= check("request.mode===\"navigate\"" in sw and "caches.match(\"./index.html\")" in sw,
                "service worker has an offline navigation fallback")
except Exception as exc:
    ok &= check(False, f"service worker audit completed ({exc})")

# CI uses this extracted file with Node's parser; no app code is executed here.
(ROOT / ".smoke-inline.js").write_text(script, encoding="utf-8")
print("\nSmoke audit:", "PASS" if ok else "FAIL")
sys.exit(0 if ok else 1)
