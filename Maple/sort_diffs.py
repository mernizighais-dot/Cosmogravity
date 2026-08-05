"""
sort_diffs.py  –  Sort diff CSV/PNG pairs in VERIF/diffs/{lcdm,de}/{param}/
into 5 type subfolders: d(t), d(z), Omega(t), Omega(z), t(z).

Only touches diffs/lcdm/* and diffs/de/* (each has 5 types per file).
diffs/facteurlcdm/* and diffs/facteurde/* are left alone (only 1 type each).

Run:
    python sort_diffs.py
"""

import re
import shutil
from pathlib import Path

DIFF_ROOT = Path(r"C:\Users\theoc\Desktop\PROJETVERIF\VERIF\diffs")
MODES     = ["lcdm", "de"]

# maple filename suffix → destination subfolder name
TYPE_FOLDERS = {
    "d_t":     "d(t)",
    "d_z":     "d(z)",
    "Omega_t": "Omega(t)",
    "Omega_z": "Omega(z)",
    "z_t":     "t(z)",
}

_PAT = re.compile(r'_(?:LCDM|DE)_(d_t|d_z|Omega_t|Omega_z|z_t)__diff\.(csv|png)$')


def sort_folder(folder: Path):
    moved = 0
    for f in list(folder.iterdir()):
        if not f.is_file():
            continue
        m = _PAT.search(f.name)
        if not m:
            continue
        dest_dir = folder / TYPE_FOLDERS[m.group(1)]
        dest_dir.mkdir(exist_ok=True)
        shutil.move(str(f), str(dest_dir / f.name))
        moved += 1
    return moved


if __name__ == "__main__":
    for mode in MODES:
        mode_dir = DIFF_ROOT / mode
        if not mode_dir.exists():
            print(f"[SKIP] {mode_dir} not found")
            continue
        for param_dir in sorted(mode_dir.iterdir()):
            if not param_dir.is_dir():
                continue
            n = sort_folder(param_dir)
            print(f"  {mode}/{param_dir.name}: moved {n} files into {', '.join(TYPE_FOLDERS.values())}")

    print("\nDone.")
