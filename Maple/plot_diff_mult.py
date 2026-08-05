"""
plot_diff_mult.py  (PROJETVERIF edition)
Walks VERIF/diffs/ recursively and saves one PNG next to each *__diff.csv.

Usage:
    python plot_diff_mult.py          # scans DIFF_ROOT defined below
    python plot_diff_mult.py <folder> # scan a specific subfolder instead
"""

import sys
import csv
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from pathlib import Path

DIFF_ROOT = Path(r"C:\Users\theoc\Desktop\PROJETVERIF\VERIF\diffs")


def fval(s):
    try:
        return float(s)
    except (ValueError, TypeError):
        return None


def plot_diff(csv_path: Path):
    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows   = list(reader)
        cols   = reader.fieldnames or []

    x_col    = next((c for c in cols if c.endswith("_A")), None)
    rel_cols = [c for c in cols if c.endswith("_reldiff")]

    if x_col is None or not rel_cols:
        print(f"  skipping {csv_path.name} — no plottable columns")
        return

    x = [fval(r[x_col]) for r in rows]

    fig, ax = plt.subplots(figsize=(12, 5))
    for col in rel_cols:
        label = col.replace("_reldiff", "")
        y     = [fval(r[col]) * 100 if fval(r[col]) is not None else None for r in rows]
        pairs = [(xi, yi) for xi, yi in zip(x, y) if xi is not None and yi is not None]
        if pairs:
            xs, ys = zip(*pairs)
            ax.plot(xs, ys, label=label, linewidth=1)

    ax.set_xlabel(x_col.replace("_A", ""))
    ax.set_ylabel("Relative error (%)")
    # title: show mode/param/filename for context
    rel = csv_path.relative_to(DIFF_ROOT) if csv_path.is_relative_to(DIFF_ROOT) else csv_path
    ax.set_title(str(rel), fontsize=7)
    ax.legend(fontsize=8)
    ax.grid(True, alpha=0.3)
    plt.tight_layout()

    out = csv_path.with_suffix(".png")
    plt.savefig(out, dpi=150)
    plt.close(fig)
    print(f"  saved: {out.relative_to(DIFF_ROOT) if out.is_relative_to(DIFF_ROOT) else out.name}")


if __name__ == "__main__":
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else DIFF_ROOT

    diff_files = sorted(root.rglob("*__diff.csv"))
    if not diff_files:
        print(f"No *__diff.csv files found under {root}")
        sys.exit(0)

    print(f"Found {len(diff_files)} diff CSV(s) under {root}\n")
    for f in diff_files:
        plot_diff(f)

    print(f"\nDone — {len(diff_files)} plot(s) saved.")
