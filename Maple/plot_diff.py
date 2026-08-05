"""
plot_diff.py  –  Plot relative errors from a diff CSV produced by compare_csv.py
Usage: python plot_diff.py path/to/diff.csv
"""

import sys
import csv
import matplotlib.pyplot as plt
from pathlib import Path

path = sys.argv[1] if len(sys.argv) > 1 else "diff.csv"

# Load CSV
with open(path, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    rows = [r for r in reader]

# Find the x-axis column (first _A column) and all _reldiff columns
cols = reader.fieldnames
x_col    = next(c for c in cols if c.endswith("_A"))
rel_cols = [c for c in cols if c.endswith("_reldiff")]

def fval(s):
    try:
        return float(s)
    except (ValueError, TypeError):
        return None

x = [fval(r[x_col]) for r in rows]

fig, ax = plt.subplots(figsize=(12, 6))

for col in rel_cols:
    label = col.replace("_reldiff", "")
    y = [fval(r[col]) * 100 if fval(r[col]) is not None else None for r in rows]
    # filter out None pairs
    pairs = [(xi, yi) for xi, yi in zip(x, y) if xi is not None and yi is not None]
    if pairs:
        xs, ys = zip(*pairs)
        ax.plot(xs, ys, label=label, linewidth=1)

ax.set_xlabel(x_col)
ax.set_ylabel("Relative error (%)")
ax.set_title(Path(path).stem)
ax.legend()
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()
