"""
raw_values_mult.py  (PROJETVERIF edition — modele structure)

For each paired maple/site CSV, builds one output CSV with columns interleaved:
    x_maple | x_site | col1_maple | col1_site | col2_maple | col2_site | ...

Folder structure expected:
    VERIF/maple/{mode}/modeleN/   ->  {stem}_map.csv
    VERIF/site/{mode}/modeleN/    ->  {stem}.csv          (same stem, no _map)
    VERIF/raw/{mode}/modeleN/     ->  {stem}__raw.csv     (output)

Run:
    python raw_values_mult.py
"""

import sys
import csv
import math
from pathlib import Path

sys.path.insert(0, str(Path(r"C:\Users\theoc\Desktop\cours\mapple\codefullmaple")))
from compare_csv import detect_delimiter, _fval, nearest_index

ROOT       = Path(r"C:\Users\theoc\Desktop\PROJETVERIF\VERIF")
MAPLE_ROOT = ROOT / "maple"
SITE_ROOT  = ROOT / "site"
RAW_ROOT   = ROOT / "raw"

MODES   = ["lcdm", "de", "facteurlcdm", "facteurde"]
MODELES = ["modele1", "modele2", "modele3", "modele4"]

# ── type detection from filename ───────────────────────────────────────────

def get_type(stem):
    s = stem.lower()
    if "d(t)" in s:     return "d_t"
    if "d(z)" in s:     return "d_z"
    if "omega(t)" in s: return "Omega_t"
    if "omega(z)" in s: return "Omega_z"
    if "t(z)" in s:     return "z_t"
    return "facteur"

# extra Maple columns that have no counterpart in the site files
SKIP_BY_TYPE = {
    "d_z":     ["t_an", "t_Gyr"],
    "d_t":     ["t_Gyr", "z"],
    "Omega_z": ["t_an", "t_Gyr"],
    "Omega_t": ["t_Gyr", "z"],
    "z_t":     ["t_Gyr"],
    "facteur": ["t_an"],
}

# Maple z_t file has columns (z, t_an) but t(z) site file is also (z, t_an)
# after skipping t_Gyr — no reorder needed with the new naming
REORDER_BY_TYPE = {
    "z_t": ["z", "t_an"],
}

# distance columns: Maple can be negative for z<0, site is always positive
ABS_COLS = {"d_m_ly", "d_a_ly", "d_L_ly", "d_LT_ly"}


# ── CSV helpers ────────────────────────────────────────────────────────────

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


# ── core ──────────────────────────────────────────────────────────────────

def build_raw(maple_path, site_path, ftype):
    skip    = SKIP_BY_TYPE.get(ftype, [])
    reorder = REORDER_BY_TYPE.get(ftype)

    cols1, rows1 = load_csv(maple_path, skip_cols=skip)
    if reorder:
        cols1 = [c for c in reorder if c in cols1] + \
                [c for c in cols1 if c not in reorder]

    cols2, rows2 = load_csv(site_path)

    n_cols = min(len(cols1), len(cols2))
    paired = list(zip(cols1[:n_cols], cols2[:n_cols]))

    # sort both by their x-axis (first column)
    def skey(row, col):
        v = _fval(row, col)
        return v if v is not None else math.inf

    rows1.sort(key=lambda r: skey(r, cols1[0]))
    rows2.sort(key=lambda r: skey(r, cols2[0]))
    key1 = [_fval(r, cols1[0]) if _fval(r, cols1[0]) is not None else math.inf
            for r in rows1]

    # fieldnames: for every pair (maple_col, site_col) -> col_maple | col_site
    fieldnames = []
    for c1, c2 in paired:
        fieldnames.append(c1 + "_maple")
        fieldnames.append(c2 + "_site")

    raw_rows = []
    for r2 in rows2:
        v_key = _fval(r2, cols2[0])
        if v_key is None:
            continue
        idx1 = nearest_index(key1, v_key)
        r1   = rows1[idx1]

        raw_row = {}
        for c1, c2 in paired:
            v1 = _fval(r1, c1)
            v2 = _fval(r2, c2)
            if c1 in ABS_COLS:
                if v1 is not None: v1 = abs(v1)
                if v2 is not None: v2 = abs(v2)
            raw_row[c1 + "_maple"] = v1
            raw_row[c2 + "_site"]  = v2
        raw_rows.append(raw_row)

    return fieldnames, raw_rows


def save_raw(stem, fieldnames, raw_rows, out_folder):
    out_folder.mkdir(parents=True, exist_ok=True)
    out = out_folder / (stem + "__raw.csv")
    with open(out, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore", restval="")
        writer.writeheader()
        writer.writerows(raw_rows)


# ── main ──────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    total, skipped = 0, 0

    for mode in MODES:
        for modele in MODELES:
            maple_folder = MAPLE_ROOT / mode / modele
            site_folder  = SITE_ROOT  / mode / modele
            raw_folder   = RAW_ROOT   / mode / modele

            if not maple_folder.exists() or not site_folder.exists():
                continue

            # find all maple files (*_map.csv), match each to its site counterpart
            for maple_path in sorted(maple_folder.glob("*_map.csv")):
                stem       = maple_path.stem[:-4]          # strip "_map"
                site_path  = site_folder / (stem + ".csv")

                if not site_path.exists():
                    print(f"  [SKIP] no site file for {mode}/{modele}/{stem}.csv")
                    skipped += 1
                    continue

                ftype = get_type(stem)
                fieldnames, raw_rows = build_raw(str(maple_path), str(site_path), ftype)
                if not raw_rows:
                    print(f"  [EMPTY] {mode}/{modele}/{stem}")
                    skipped += 1
                    continue

                save_raw(stem, fieldnames, raw_rows, raw_folder)
                print(f"  wrote  {mode}/{modele}/{stem}__raw.csv  ({len(raw_rows)} rows)")
                total += 1

    print(f"\nDone — {total} file(s) written, {skipped} skipped.")
