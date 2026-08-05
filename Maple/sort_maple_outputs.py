"""
sort_maple_outputs.py  -  Route freshly generated Maple CSVs into VERIF/maple/...

Maple always writes to the flat SOURCE_DIR (output_dir in the .mpl scripts).
This script reads each filename, figures out which single parameter differs
from the default cosmology, and copies the file into the matching
VERIF/maple/{mode}/{param}/ folder. Files matching ALL defaults (the shared
baseline point) get copied into every sweep folder for that mode.

Run:
    python sort_maple_outputs.py
"""

import re
import shutil
from pathlib import Path

SOURCE_DIR = Path(r"C:\Users\theoc\Desktop\cours\mapple")
DEST_ROOT  = Path(r"C:\Users\theoc\Desktop\PROJETVERIF\VERIF\maple")

# ── defaults (must match the .mpl scripts' fallback values) ────────────────
LCDM_DEFAULTS = {"h0": 67.74, "omegam0": 0.3089, "omegalambda0": 0.6911, "t0": 2.7255}
DE_DEFAULTS   = {"h0": 67.74, "omegam0": 0.3089, "omegade0": 0.6911,
                  "w0": -1.0, "w1": 0.0, "t0": 2.7255}

EXTRACTORS_LCDM = {
    "h0":           re.compile(r'^H([\d.]+)_'),
    "omegam0":      re.compile(r'_m([\d.]+)_l'),
    "omegalambda0": re.compile(r'_l([\d.]+)_T'),
    "t0":           re.compile(r'_T([\d.]+)_R'),
}
EXTRACTORS_DE = {
    "h0":       re.compile(r'^H([\d.]+)_'),
    "omegam0":  re.compile(r'_m([\d.]+)_DE'),
    "omegade0": re.compile(r'_DE([\d.]+)_w0'),
    "t0":       re.compile(r'_T([\d.]+)_R'),
    "w0":       re.compile(r'_w0_(-?[\d.]+)_w1'),
    "w1":       re.compile(r'_w1_(-?[\d.]+)_T'),
}

# which param folders exist per mode (facteur sweeps cover fewer params)
PARAMS_LCDM         = {"h0", "omegam0", "omegalambda0", "t0"}
PARAMS_DE           = {"h0", "omegam0", "omegade0", "t0", "w0", "w1"}
PARAMS_FACTEURLCDM  = {"h0", "omegam0", "omegalambda0", "t0"}
PARAMS_FACTEURDE    = {"h0", "omegam0", "omegade0", "t0", "w0", "w1"}


def vals_match(a, b, rtol=1e-6):
    if a == b:
        return True
    denom = max(abs(a), abs(b))
    return (abs(a - b) / denom < rtol) if denom else (abs(a - b) < 1e-12)


def classify(fname):
    """Return (mode, [dest_param_folders]) or (None, None) if unrecognized,
    or (mode, None) if ambiguous (more than one param differs from default)."""
    is_facteur = fname.endswith("_facteur_a.csv")

    if "_LCDM_" in fname:
        extractors, defaults = EXTRACTORS_LCDM, LCDM_DEFAULTS
        allowed = PARAMS_FACTEURLCDM if is_facteur else PARAMS_LCDM
        mode = "facteurlcdm" if is_facteur else "lcdm"
    elif "_DE_" in fname:
        extractors, defaults = EXTRACTORS_DE, DE_DEFAULTS
        allowed = PARAMS_FACTEURDE if is_facteur else PARAMS_DE
        mode = "facteurde" if is_facteur else "de"
    else:
        return None, None

    diffs = []
    for param in allowed:
        m = extractors[param].search(fname)
        if not m:
            continue
        try:
            val = float(m.group(1))
        except ValueError:
            continue
        if not vals_match(val, defaults[param]):
            diffs.append(param)

    if len(diffs) == 0:
        return mode, sorted(allowed)   # baseline point -> belongs to every sweep
    if len(diffs) == 1:
        return mode, diffs
    return mode, None                  # ambiguous, more than one param differs


if __name__ == "__main__":
    copied, flagged, unmatched = 0, [], []

    for f in sorted(SOURCE_DIR.glob("*.csv")):
        mode, dest_params = classify(f.name)
        if mode is None:
            unmatched.append(f.name)
            continue
        if dest_params is None:
            flagged.append(f.name)
            continue
        for p in dest_params:
            dest_dir = DEST_ROOT / mode / p
            dest_dir.mkdir(parents=True, exist_ok=True)
            shutil.copy2(str(f), str(dest_dir / f.name))
        copied += 1

    print(f"Copied {copied} file(s) into VERIF/maple/...")

    if flagged:
        print(f"\n[AMBIGUOUS] {len(flagged)} file(s) have more than one param differing from default — not moved:")
        for name in flagged:
            print(f"  {name}")

    if unmatched:
        print(f"\n[UNRECOGNIZED] {len(unmatched)} file(s) didn't match LCDM or DE naming — not moved:")
        for name in unmatched:
            print(f"  {name}")
