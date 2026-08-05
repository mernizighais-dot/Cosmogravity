"""
compare_csv.py  –  Compare two CSV files column by column.

Handles mismatched delimiters, different column names, extra columns,
reversed row ordering, and different grid sizes automatically.
Rows are matched by nearest value in the first (index) column.

Usage:
    python compare_csv.py file1.csv file2.csv
    python compare_csv.py file1.csv file2.csv --skip=t_Gyr,z
    python compare_csv.py file1.csv file2.csv --skip=t_Gyr,z --save
"""

import sys
import csv
import math
import bisect
from pathlib import Path


def detect_delimiter(path):
    with open(path, newline="", encoding="utf-8") as f:
        sample = f.read(4096)
    try:
        dialect = csv.Sniffer().sniff(sample, delimiters=",;\t|")
        return dialect.delimiter
    except csv.Error:
        return ","


def load_csv(path, skip_cols=()):
    delim = detect_delimiter(path)
    skip  = set(skip_cols)
    with open(path, newline="", encoding="utf-8") as f:
        reader   = csv.DictReader(f, delimiter=delim)
        all_rows = list(reader)
        all_cols = list(reader.fieldnames or [])
    cols = [c for c in all_cols if c not in skip]
    rows = [{c: row[c] for c in cols} for row in all_rows]
    return cols, rows


def _fval(row, col):
    try:
        return float(row[col])
    except (ValueError, TypeError):
        return None


def nearest_index(sorted_vals, target):
    """Return index of the value in sorted_vals closest to target."""
    idx = bisect.bisect_left(sorted_vals, target)
    if idx == 0:
        return 0
    if idx >= len(sorted_vals):
        return len(sorted_vals) - 1
    # pick whichever neighbour is closer
    if abs(sorted_vals[idx] - target) < abs(sorted_vals[idx - 1] - target):
        return idx
    return idx - 1


def compare(path1, path2, skip_cols=(), save_diff=False):
    cols1, rows1 = load_csv(path1, skip_cols)
    cols2, rows2 = load_csv(path2, skip_cols)

    # ── Column pairing by position ────────────────────────────────────────
    n_cols = min(len(cols1), len(cols2))
    if len(cols1) != len(cols2):
        print(f"NOTE: column counts differ ({len(cols1)} vs {len(cols2)}), "
              f"pairing first {n_cols} by position.\n")
    paired = list(zip(cols1[:n_cols], cols2[:n_cols]))

    # ── Sort both files ascending by their first column ───────────────────
    def sort_key(row, col):
        v = _fval(row, col)
        return v if v is not None else math.inf

    rows1.sort(key=lambda r: sort_key(r, cols1[0]))
    rows2.sort(key=lambda r: sort_key(r, cols2[0]))

    # Pre-extract the sorted key values from file2 for fast nearest lookup
    key2_vals = [_fval(r, cols2[0]) for r in rows2]
    key2_vals_clean = [v if v is not None else math.inf for v in key2_vals]

    # ── Match each row in file1 to its nearest row in file2 ───────────────
    pairs = []
    for r1 in rows1:
        v1 = _fval(r1, cols1[0])
        if v1 is None:
            continue
        idx2 = nearest_index(key2_vals_clean, v1)
        pairs.append((r1, rows2[idx2]))

    n = len(pairs)
    print(f"Matched {n} rows from A to nearest rows in B "
          f"(A: {len(rows1)}, B: {len(rows2)})")

    # ── Per-column statistics ─────────────────────────────────────────────
    stats     = {}
    diff_rows = []

    for r1, r2 in pairs:
        diff_row = {}
        for c1, c2 in paired:
            v1 = _fval(r1, c1)
            v2 = _fval(r2, c2)
            if v1 is None or v2 is None:
                continue

            if v1 == 0.0:
                continue  # relative error undefined at zero, skip
            abs_diff = abs(v1 - v2)
            rel_diff = abs_diff / abs(v1)

            if c1 not in stats:
                stats[c1] = {"max_rel": 0.0, "sum_rel": 0.0, "count": 0}
            s = stats[c1]
            s["max_rel"]  = max(s["max_rel"], rel_diff)
            s["sum_rel"] += rel_diff
            s["count"]   += 1

            diff_row[c1 + "_A"]       = v1
            diff_row[c1 + "_B"]       = v2
            diff_row[c1 + "_reldiff"] = rel_diff
        diff_rows.append(diff_row)

    # ── Header ────────────────────────────────────────────────────────────
    name1 = Path(path1).name
    name2 = Path(path2).name
    print(f"\nComparing ({n} rows):")
    print(f"  A: {name1}")
    print(f"  B: {name2}")
    print(f"\nColumn mapping  (A → B):")
    for c1, c2 in paired:
        print(f"  {c1:<22}  →  {c2}")
    print()

    if not stats:
        print("No numeric columns to compare.")
        return

    # ── Summary table ─────────────────────────────────────────────────────
    col_w = max(len(c) for c in stats) + 2
    print(f"{'Column (A)':<{col_w}}  {'Max rel%':>10}  {'Mean rel%':>10}")
    print("─" * (col_w + 24))
    for c1, s in stats.items():
        mean_rel = s["sum_rel"] / s["count"] * 100
        max_rel  = s["max_rel"] * 100
        print(f"{c1:<{col_w}}  {max_rel:>9.4f}%  {mean_rel:>9.4f}%")
    print()

    # ── Top-5 worst rows ─────────────────────────────────────────────────
    worst_c1 = max(stats, key=lambda c: stats[c]["max_rel"])
    worst_c2 = next(c2 for c1, c2 in paired if c1 == worst_c1)
    ref_c1   = paired[0][0]
    print(f"Largest relative differences in '{worst_c1}' / '{worst_c2}':")
    ranked = sorted(
        range(n),
        key=lambda i: (
            lambda a, b: abs(a - b) / abs(a) if a and a != 0 else 0.0
        )(_fval(pairs[i][0], worst_c1), _fval(pairs[i][1], worst_c2)),
        reverse=True,
    )
    print(f"  {'row':>5}  {ref_c1:>14}  {'A':>16}  {'B':>16}  {'rel diff':>10}")
    for i in ranked[:5]:
        r1, r2  = pairs[i]
        v1  = _fval(r1, worst_c1)
        v2  = _fval(r2, worst_c2)
        ref = _fval(r1, ref_c1)
        if v1 is None or v2 is None or ref is None:
            continue
        rd = abs(v1 - v2) / abs(v1) * 100 if v1 != 0 else 0.0
        print(f"  {i:>5}  {ref:>14.6g}  {v1:>16.8g}  {v2:>16.8g}  {rd:>9.4f}%")
    print()

    # ── Save diff CSV ─────────────────────────────────────────────────────
    if save_diff and diff_rows:
        out_path = Path(path1).stem + "__vs__" + Path(path2).stem + "__diff.csv"
        diff_cols = list(diff_rows[0].keys())
        with open(out_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=diff_cols)
            writer.writeheader()
            writer.writerows(diff_rows)
        print(f"Diff CSV saved: {out_path}")


if __name__ == "__main__":
    raw   = sys.argv[1:]
    files = [a for a in raw if not a.startswith("--")]
    save  = "--save" in raw

    skip_cols = []
    for a in raw:
        if a.startswith("--skip="):
            skip_cols = [c.strip() for c in a[len("--skip="):].split(",")]

    if len(files) != 2:
        print("Usage: python compare_csv.py file1.csv file2.csv [--skip=col1,col2] [--save]")
        sys.exit(1)

    compare(files[0], files[1], skip_cols=skip_cols, save_diff=save)
