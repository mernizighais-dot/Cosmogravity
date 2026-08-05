import subprocess
import tempfile
import os
from pathlib import Path

CMAPLE       = Path(r"C:\Program Files\Maple 2025\bin.X86_64_WINDOWS\cmaple.exe")
MAPLE_SCRIPT = Path(r"C:\Users\theoc\Desktop\cours\mapple\codefullmaple\verification.mpl")
# ── Param défauts ─────────────────────────────────────────────────────
z_min_graph   = -0.99
z_max_graph   = 5.0
N_pts         = 1000
param = [
    [67.74],   # 0  H0
    [0.3089],  # 1  Omega_m0
    [0.6911],  # 2  Omega_lambda0
    [2.7255],  # 3  T0
    [0]]        # 4  option_r_code  0=avec_neutrinos  1=photons_only  2=nul
corr = ("H0","Omega_m0","Omega_lambda0","T0","option_r_code")

print("paramètres par défaut :")
for j in range(len(param)):
    print(corr[j]," : ",param[j])
print("───────────────────────────────")
print()
# ── Custom Parameters ───────────────────────────────────────────────────────
edit = True
while edit:
    val = int(input(
        "Quel paramètre modifier ?\n"
        "H0:0 | Omega_m0:1 | Omega_lambda0:2 | T0:3 | option_r_code:4 \n"
        "POUR ARRETER MODIFICATION : 5\n"))
    if val==5:
        edit = False
        break
    plage = input("Plage de valeurs ? Y/N\n")
    print(plage)
    if plage=="Y" or plage=="y":
        mini  = float(input("Valeur min ? "))
        maxi  = float(input("Valeur max ? "))
        nbval = int(input("Combien de valeurs ? "))
        param[val] = [mini + i*((maxi-mini)/(nbval-1)) for i in range(nbval)]
    else : 
        param[val] = [float(input("Quelle valeur ?"))]
    # On affiche les paramètres avec modification
    for j in range(len(param)):
        print(corr[j]," : ",param[j])
    print("───────────────────────────────")
# ── Run ────────────────────────────────────────────────────────────────────
total = len(param[0])*len(param[1])*len(param[2])*len(param[3])*len(param[4])
run_i = 0
for a in param[0]: # H0
    for b in param[1]: # Omega_m0
        for c in param[2]: # Omega_lambda0
            for d in param[3]: # T0
                for e in param[4]: # option_r_code
                    run_i += 1
                    tmp = tempfile.NamedTemporaryFile(
                        mode="w", suffix=".mpl", delete=False, encoding="utf-8")
                    tmp.write(
                        f"H0            := {a}:\n"
                        f"Omega_m0      := {b}:\n"
                        f"Omega_lambda0 := {c}:\n"
                        f"T0            := {d}:\n"
                        f"option_r_code := {int(e)}:\n"
                        f"z_min_graph   := {z_min_graph}:\n"
                        f"z_max_graph   := {z_max_graph}:\n"
                        f"N_pts         := {N_pts}:\n"
                        f'read "{MAPLE_SCRIPT.as_posix()}":\n')
                    tmp.close()
                    print(f"[{run_i}/{total}] H0={a} Om={b} Ol={c} T0={d} R={int(e)}", end=" ... ", flush=True)
                    proc = subprocess.run(
                        [str(CMAPLE), tmp.name],
                        capture_output=True, text=True)
                    os.unlink(tmp.name)   # delete temp file
                    if proc.returncode != 0 or "Error," in proc.stdout:
                        print("FAILED")
                        print(proc.stdout[-600:].strip())
                    else:
                        print("Done.")
