"""Audit the migration inventory; block a replacement release until parity is verified."""
import argparse
import json
import pathlib
import re
import sys

root = pathlib.Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument("--candidate-release", action="store_true")
args = parser.parse_args()
ledger = json.loads((root / "docs/feature-parity.json").read_text())

current = set()
for filename in ["app.js", "learning-ui.js"]:
    source = (root / "outputs/Cyberpath/public" / filename).read_text()
    match = re.search(r"const views=\{([^\n]+?)\};", source)
    if not match:
        raise SystemExit("Could not read the current route inventory: " + filename)
    current.update(part.split(":", 1)[0].strip().strip("'\"") for part in match[1].split(","))

rows = ledger["routes"]
listed = {row["route"] for row in rows}
if len(listed) != len(rows) or listed != current:
    raise SystemExit("Inventory mismatch. Missing: " + repr(sorted(current - listed)) + "; extra: " + repr(sorted(listed - current)))

allowed = {"pending", "implemented", "verified", "regressed"}
if any(row["flutter_status"] not in allowed for row in rows):
    raise SystemExit("Unknown Flutter verification status.")
native = ledger["native_capabilities"]
if not native or any(row["status"] not in allowed for row in native):
    raise SystemExit("The native capability inventory is incomplete or invalid.")

pending_routes = [row["route"] for row in rows if row["required_for_replacement"] and row["flutter_status"] != "verified"]
pending_native = [row["id"] for row in native if row["required_for_replacement"] and row["status"] != "verified"]
print(f"Inventory complete: {len(rows)} screens, {len(native)} native/data capabilities.")
print(f"Verified for replacement: {len(rows) - len(pending_routes)} screens, {len(native) - len(pending_native)} capabilities.")
if args.candidate_release and (pending_routes or pending_native):
    print("Replacement release blocked: Flutter parity and native verification remain incomplete.", file=sys.stderr)
    sys.exit(1)
