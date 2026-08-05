"""
compare_mult.py  (PROJETVERIF edition)
Compare Maple CSVs vs site reference CSVs across all parameter sweeps.

Folder structure expected:
    VERIF/
      maple/{lcdm,de}/{h0,omegam0,...}/   <- Maple outputs
      site/{lcdm,de}/{h0,omegal0,...}/    <- site reference files
      diffs/{lcdm,de}/{h0,...}/           <- diff CSVs written here

Run:
    python compare_mult.py
"""

import sys
import re
import csv
import math
from pathlib import Path

# ── locate compare_csv.py ──────────────────────────────────────────────────
sys.path.insert(0, str(Path(r"C:\Users\theoc\Desktop\cours\mapple\codefullmaple")))
from compare_csv import detect_delimiter, _fval, nearest_index

# ══════════════════════════════════════════════════════════════════════════
# CONFIG
# ══════════════════════════════════════════════════════════════════════════

ROOT       = Path(r"C:\Users\theoc\Desktop\PROJETVERIF\VERIF")
MAPLE_ROOT = ROOT / "maple"
SITE_ROOT  = ROOT / "site"
DIFF_ROOT  = ROOT / "diffs"

SAVE_DIFF = True
VERBOSE   = False

# (mode, maple_param_folder, site_param_folder)
FOLDERS = [
    ("lcdm", "t0",           "t0"),
    ("lcdm", "h0",           "h0"),
    ("lcdm", "omegam0",      "omegam0"),
    ("lcdm", "omegalambda0", "omegal0"),
    ("de",   "t0",           "t0"),
    ("de",   "h0",           "h0"),
    ("de",   "omegam0",      "omegam0"),
    ("de",   "omegade0",     "omegade0"),
    ("de",   "w0",           "w0"),
    ("de",   "w1",           "w1"),

    # facteur d'échelle a(t) — site files have no (type)/(MODE) suffix
    ("facteurlcdm", "h0",      "h0"),
    ("facteurlcdm", "omegam0", "omegam0"),
    ("facteurlcdm", "t0",      "t0"),
    ("facteurde",   "h0",       "h0"),
    ("facteurde",   "omegam0",  "omegam0"),
    ("facteurde",   "omegade0", "omegade0"),
    ("facteurde",   "t0",       "t0"),
    ("facteurde",   "w0",       "w0"),
    ("facteurde",   "w1",       "w1"),
]

# modes that produce a single a(t) curve (no (type)/(MODE) suffix on site files)
FACTEUR_MAPLE_TYPE = {
    "facteurlcdm": "LCDM_facteur_a",
    "facteurde":   "DE_facteur_a",
}

# ══════════════════════════════════════════════════════════════════════════

# site type string → maple filename suffix
TYPE_MAP = {
    "d(t)":     "d_t",
    "d(z)":     "d_z",
    "Omega(t)": "Omega_t",
    "Omega(z)": "Omega_z",
    "t(z)":     "z_t",    # site t(z) columns are (z, t_an) — REVERSED vs our z_t's (t_an, z)
}

# columns present in Maple files but absent from site files → skip before pairing
SKIP_BY_TYPE = {
    "d_z":     ["t_an", "t_Gyr"],
    "d_t":     ["t_Gyr", "z"],
    "Omega_z": ["t_an", "t_Gyr"],
    "Omega_t": ["t_Gyr", "z"],
    "z_t":     ["t_Gyr"],
    "LCDM_facteur_a": ["t_an"],   # maple: t_an,t_Gyr,a  vs site: Time,Reduced Scale Factor
    "DE_facteur_a":   ["t_an"],
}

# after skip, force Maple column order to match the site's column order
# (positional pairing in compute_stats otherwise cross-matches t_an with z)
REORDER_BY_TYPE = {
    "z_t": ["z", "t_an"],   # site t(z): (Z (ou X), Paramètre de densité de rayonement) = (z, t_an)
}

# distance columns flip sign for z<0 in Maple (integral bounds reverse past today)
# while the site always reports them positive — compare magnitudes, not sign
ABS_COLS = {"d_m_ly", "d_a_ly", "d_L_ly", "d_LT_ly"}

# regex to pull the varied parameter value out of a Maple filename
MAPLE_EXTRACTORS = {
    ("lcdm", "h0"):           re.compile(r'^H([\d.]+)_'),
    ("lcdm", "omegam0"):      re.compile(r'_m([\d.]+)_l'),
    ("lcdm", "omegalambda0"): re.compile(r'_l([\d.]+)_T'),
    ("lcdm", "t0"):           re.compile(r'_T([\d.]+)_R'),
    ("de",   "h0"):           re.compile(r'^H([\d.]+)_'),
    ("de",   "omegam0"):      re.compile(r'_m([\d.]+)_DE'),
    ("de",   "t0"):           re.compile(r'_T([\d.]+)_R'),
    ("de",   "omegade0"):     re.compile(r'_DE([\d.]+)_w0'),
    ("de",   "w0"):           re.compile(r'_w0_(-?[\d.]+)_w1'),
    ("de",   "w1"):           re.compile(r'_w1_(-?[\d.]+)_T'),

    ("facteurlcdm", "h0"):      re.compile(r'^H([\d.]+)_'),
    ("facteurlcdm", "omegam0"): re.compile(r'_m([\d.]+)_l'),
    ("facteurlcdm", "t0"):      re.compile(r'_T([\d.]+)_R'),

    ("facteurde", "h0"):       re.compile(r'^H([\d.]+)_'),
    ("facteurde", "omegam0"):  re.compile(r'_m([\d.]+)_DE'),
    ("facteurde", "omegade0"): re.compile(r'_DE([\d.]+)_w0'),
    ("facteurde", "t0"):       re.compile(r'_T([\d.]+)_R'),
    ("facteurde", "w0"):       re.compile(r'_w0_(-?[\d.]+)_w1'),
    ("facteurde", "w1"):       re.compile(r'_w1_(-?[\d.]+)_T'),
}

# site filename pattern:  {Param}_{value}_{type}_{MODE}.csv
_SITE_PAT = re.compile(
    r'^([A-Za-z0-9]+)_([\d.e+\-]+)_(d\([zt]\)|Omega\([tz]\)|[zt]\([zt]\))_(LCDM|DE)\.csv$',
    re.IGNORECASE,
)


# ── helpers ───────────────────────────────────────────────────────────────

def parse_site_filename(fname):
    """Return (param_name, value_float, site_type, mode) or None."""
    m = _SITE_PAT.match(fname)
    if not m:
        return None
    param_name, value_str, site_type, mode = m.groups()
    try:
        value = float(value_str)
    except ValueError:
        return None
    return param_name, value, site_type, mode.upper()


def parse_facteur_site_filename(fname):
    """facteur site files are just {Param}_{value}.csv — no (type)/(MODE) suffix."""
    if not fname.lower().endswith(".csv"):
        return None
    stem = fname[:-4]
    if "_" not in stem:
        return None
    _, value_str = stem.split("_", 1)
    try:
        return float(value_str)
    except ValueError:
        return None


def _maple_val(fname, extractor):
    """Extract the varied parameter value from a Maple filename."""
    if extractor is None:
        return None
    m = extractor.search(fname)
    if not m:
        return None
    try:
        return float(m.group(1))
    except ValueError:
        return None


def _vals_match(a, b, rtol=1e-6):
    if a == b:
        return True
    denom = max(abs(a), abs(b))
    return (abs(a - b) / denom < rtol) if denom else (abs(a - b) < 1e-12)


def find_maple_file(maple_folder, maple_type, extractor, site_value):
    """Find the Maple CSV whose extracted param value ≈ site_value. Returns Path or None."""
    for p in maple_folder.glob(f"*_{maple_type}.csv"):
        v = _maple_val(p.name, extractor)
        if v is not None and _vals_match(v, site_value):
            return p
    return None


def load_csv(path, skip_cols=()):
    delim = detect_delimiter(path)
    skip  = set(skip_cols)
    with open(path, newline="", encoding="utf-8", errors="replace") as f:
        reader   = csv.DictReader(f, delimiter=delim)
        all_rows = list(reader)
        all_cols = list(reader.fieldnames or [])
    cols = [c for c in all_cols if c not in skip]
    rows = [{c: row[c] for c in cols if c in row} for row in all_rows]
    return cols, rows


def compute_stats(maple_path, site_path, skip_cols=(), reorder=None):
    """Return (stats, paired, cols1, cols2, diff_rows)."""
    cols1, rows1 = load_csv(maple_path, skip_cols)   # skip extra Maple columns
    if reorder:
        cols1 = [c for c in reorder if c in cols1] + [c for c in cols1 if c not in reorder]
    cols2, rows2 = load_csv(site_path)               # site file has no extras

    n_cols = min(len(cols1), len(cols2))
    paired = list(zip(cols1[:n_cols], cols2[:n_cols]))

    def skey(row, col):
        v = _fval(row, col)
        return v if v is not None else math.inf

    rows1.sort(key=lambda r: skey(r, cols1[0]))
    rows2.sort(key=lambda r: skey(r, cols2[0]))
    key2 = [_fval(r, cols2[0]) if _fval(r, cols2[0]) is not None else math.inf
            for r in rows2]

    stats, diff_rows = {}, []
    for r1 in rows1:
        v_key = _fval(r1, cols1[0])
        if v_key is None:
            continue
        from compare_csv import nearest_index as _ni
        idx2  = _ni(key2, v_key)
        r2    = rows2[idx2]
        diff_row = {}
        for c1, c2 in paired:
            v1 = _fval(r1, c1)
            v2 = _fval(r2, c2)
            if v1 is None or v2 is None or v1 == 0.0:
                continue
            if c1 in ABS_COLS:
                v1, v2 = abs(v1), abs(v2)
            rel = abs(v1 - v2) / abs(v1)
            if c1 not in stats:
                stats[c1] = {"max_rel": 0.0, "sum_rel": 0.0, "count": 0}
            s = stats[c1]
            s["max_rel"]  = max(s["max_rel"], rel)
            s["sum_rel"] += rel
            s["count"]   += 1
            diff_row[c1 + "_A"]       = v1
            diff_row[c1 + "_B"]       = v2
            diff_row[c1 + "_reldiff"] = rel
        diff_rows.append(diff_row)
    return stats, paired, cols1, cols2, diff_rows


def print_compact(label, stats):
    if not stats:
        print(f"  {label:<40}  (no comparable columns)")
        return
    max_rel  = max(s["max_rel"]  for s in stats.values()) * 100
    mean_rel = (sum(s["sum_rel"] for s in stats.values()) /
                sum(s["count"]  for s in stats.values())) * 100
    print(f"  {label:<40}  max={max_rel:8.4f}%   mean={mean_rel:8.4f}%")


def print_verbose(maple_path, site_path, stats, paired):
    print(f"    Maple : {Path(maple_path).name}")
    print(f"    Site  : {Path(site_path).name}")
    print(f"    Column mapping:")
    for c1, c2 in paired:
        print(f"      {c1:<25} -> {c2}")
    if not stats:
        print("    (no comparable numeric columns)")
        return
    col_w = max(len(c) for c in stats) + 2
    print(f"\n    {'Column':<{col_w}}  {'Max rel%':>10}  {'Mean rel%':>10}")
    print("    " + "─" * (col_w + 24))
    for c1, s in stats.items():
        mr  = s["max_rel"]  * 100
        mea = s["sum_rel"] / s["count"] * 100
        print(f"    {c1:<{col_w}}  {mr:>9.4f}%  {mea:>9.4f}%")
    print()


def save_diff(maple_path, diff_rows, diff_folder):
    if not diff_rows:
        return
    seen = {}
    for row in diff_rows:
        seen.update(dict.fromkeys(row))
    diff_cols = list(seen.keys())
    diff_folder.mkdir(parents=True, exist_ok=True)
    out = diff_folder / (Path(maple_path).stem + "__diff.csv")
    with open(out, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=diff_cols, extrasaction="ignore", restval="")
        writer.writeheader()
        writer.writerows(diff_rows)


# ── main ──────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    for mode, maple_param, site_param in FOLDERS:
        maple_folder = MAPLE_ROOT / mode / maple_param
        site_folder  = SITE_ROOT  / mode / site_param
        diff_folder  = DIFF_ROOT  / mode / maple_param

        if not maple_folder.exists():
            print(f"\n[SKIP] maple/{mode}/{maple_param}/ not found")
            continue
        if not site_folder.exists():
            print(f"\n[SKIP] site/{mode}/{site_param}/ not found")
            continue

        extractor  = MAPLE_EXTRACTORS.get((mode, maple_param))
        site_files = sorted(site_folder.glob("*.csv"))

        print(f"\n{'═'*70}")
        print(f"  {mode.upper()} / {maple_param}   ({len(site_files)} site files)")
        print(f"{'═'*70}")
        if not VERBOSE:
            print(f"  {'value  type':<40}  {'max rel%':>12}   {'mean rel%':>12}")
            print("  " + "─" * 68)

        is_facteur = mode in FACTEUR_MAPLE_TYPE

        for site_path in site_files:
            if is_facteur:
                site_value = parse_facteur_site_filename(site_path.name)
                if site_value is None:
                    continue
                maple_type = FACTEUR_MAPLE_TYPE[mode]
                label_type = "facteur_a"
            else:
                parsed = parse_site_filename(site_path.name)
                if not parsed:
                    continue
                _, site_value, site_type, _ = parsed

                maple_type = TYPE_MAP.get(site_type)
                if maple_type is None:
                    continue  # type not in our outputs
                label_type = site_type

            maple_path = find_maple_file(maple_folder, maple_type, extractor, site_value)
            if maple_path is None:
                # file exists on site side only → skip as requested
                continue

            skip    = SKIP_BY_TYPE.get(maple_type, [])
            reorder = REORDER_BY_TYPE.get(maple_type)
            stats, paired, cols1, cols2, diff_rows = compute_stats(
                str(maple_path), str(site_path), skip_cols=skip, reorder=reorder
            )

            label = f"{site_value}  {label_type}"
            if VERBOSE:
                print(f"\n  ── {label} ──")
                print_verbose(str(maple_path), str(site_path), stats, paired)
            else:
                print_compact(label, stats)

            if SAVE_DIFF:
                save_diff(maple_path, diff_rows, diff_folder)

    print()
