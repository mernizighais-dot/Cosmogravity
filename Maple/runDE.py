import subprocess
import tempfile
import os
from pathlib import Path

CMAPLE       = Path(r"C:\Program Files\Maple 2025\bin.X86_64_WINDOWS\cmaple.exe")
MAPLE_SCRIPT = Path(r"C:\Users\theoc\Desktop\cours\mapple\codefullmaple\verification_DE.mpl")

# ── Default Parameters ─────────────────────────────────────────────────────
z_min_graph   = -0.99
z_max_graph   = 5.0
N_pts         = 1000

param = [
    [67.74],   # 0  H0           (km/s/Mpc)
    [0.3089],  # 1  Omega_m0
    [0.6911],  # 2  Omega_DE0
    [-1.0],    # 3  w0           (-1 = cosmological constant)
    [0.0],     # 4  w1           (0  = no evolution)
    [2.7255],  # 5  T0           (K)
    [0],       # 6  option_r_code  0=avec_neutrinos  1=photons_only  2=nul
]
corr = ("H0", "Omega_m0", "Omega_DE0", "w0", "w1", "T0", "option_r_code")

print("paramètres par défaut :")
for j in range(len(param)):
    print(corr[j], " : ", param[j])
print("───────────────────────────────")
print()

# ── Custom Parameters ───────────────────────────────────────────────────────
edit = True
while edit:
    val = int(input(
        "Quel paramètre modifier ?\n"
        " H0:0 | Omega_m0:1 | Omega_DE0:2 | w0:3 | w1:4 | T0:5 | option_r_code:6\n"
        " POUR ARRETER MODIFICATION : 7\n"
    ))
    if val == 7:
        edit = False
        break

    plage = input("Plage de valeurs ? Y/N\n")
    print(plage)
    if plage=="Y" or plage == "y":
        mini  = float(input("Valeur min ? "))
        maxi  = float(input("Valeur max ? "))
        nbval = int(input("Combien de valeurs ? "))
        param[val] = [mini + i*((maxi-mini)/(nbval-1)) for i in range(nbval)]
    else:
        param[val] = [float(input("Quelle valeur ? "))]

    # On affiche les paramètres avec modification
    for j in range(len(param)):
        print(corr[j], " : ", param[j])
    print("───────────────────────────────")


# ── Run ────────────────────────────────────────────────────────────────────

total = 1
for p in param:
    total *= len(p)
run_i = 0

for a in param[0]:   # H0
    for b in param[1]:   # Omega_m0
        for c in param[2]:   # Omega_DE0
            for d in param[3]:   # w0
                for e in param[4]:   # w1
                    for f in param[5]:   # T0
                        for g in param[6]:   # option_r_code
                            run_i += 1

                            tmp = tempfile.NamedTemporaryFile(
                                mode="w", suffix=".mpl", delete=False, encoding="utf-8"
                            )
                            tmp.write(
                                f"H0            := {a}:\n"
                                f"Omega_m0      := {b}:\n"
                                f"Omega_DE0     := {c}:\n"
                                f"w0            := {d}:\n"
                                f"w1            := {e}:\n"
                                f"T0            := {f}:\n"
                                f"option_r_code := {int(g)}:\n"
                                f"z_min_graph   := {z_min_graph}:\n"
                                f"z_max_graph   := {z_max_graph}:\n"
                                f"N_pts         := {N_pts}:\n"
                                f'read "{MAPLE_SCRIPT.as_posix()}":\n'
                            )
                            tmp.close()

                            print(
                                f"[{run_i}/{total}] "
                                f"H0={a} Om={b} ODE={c} w0={d} w1={e} T0={f} R={int(g)}",
                                end=" ... ", flush=True
                            )
                            proc = subprocess.run(
                                [str(CMAPLE), tmp.name],
                                capture_output=True, text=True
                            )
                            os.unlink(tmp.name)

                            if proc.returncode != 0 or "Error," in proc.stdout:
                                print("FAILED")
                                print(proc.stdout[-600:].strip())
                            else:
                                print("Done.")

