# ------------------------------------------------------------------
# verification_facteur.mpl - Scale factor a(t): past AND future
#
# Loops over a from ~0 to a_max (a=1 = today, a>1 = future).
# Output: one CSV with columns t_an, t_Gyr, a
#
# USAGE (temp-file via runDE.py, change MAPLE_SCRIPT):
#   a_max := 5.0:  N_pts := 300:
#   (other DE parameters as usual)
#   read "C:/Users/theoc/Desktop/cours/mapple/codefullmaple/verification_facteurDE.mpl":
# ------------------------------------------------------------------

kernelopts(gcfreq=0):
output_dir := "C:/Users/theoc/Desktop/cours/mapple/":
currentdir(output_dir):

# --- Defaults ---
if not type(H0,       numeric) then H0       := 67.74  end if:
if not type(Omega_m0, numeric) then Omega_m0 := 0.3089 end if:
if not type(Omega_DE0,numeric) then Omega_DE0:= 0.6911 end if:
if not type(T0,       numeric) then T0       := 2.7255 end if:
if not type(w0,       numeric) then w0       := -1.0   end if:
if not type(w1,       numeric) then w1       := 0.0    end if:
if not type(a_max,    numeric) then a_max    := 5.0    end if:
if not type(N_pts,    integer) then N_pts     := 1000  end if:

if type(option_r_code, integer) then
    if   option_r_code = 1 then option_r := "photons_only":
    elif option_r_code = 2 then option_r := "nul":
    else option_r := "avec_neutrinos": option_r_code := 0:
    end if:
elif not type(option_r, string) then
    option_r := "avec_neutrinos": option_r_code := 0:
else
    if   option_r = "photons_only" then option_r_code := 1:
    elif option_r = "nul"          then option_r_code := 2:
    else option_r_code := 0: end if:
end if:

output_prefix := cat("H", H0, "_m", Omega_m0, "_DE", Omega_DE0,
                     "_w0_", w0, "_w1_", w1,
                     "_T", T0, "_R", option_r_code, "_"):

# --- Physical constants ---
c_si          := 0.2997924580e9:
G_si          := 0.6674e-10:
h_si          := 0.662607015e-33:
k_si          := 0.1380649e-22:
AU_si         := 0.1495978707000e12:
Mpc_m         := evalf(0.10e7*648000.0/Pi*AU_si):
H0_SI         := evalf(1000.*H0/Mpc_m):
sec_par_an    := 3600.0*365.2425*24.0:
H0_an         := evalf(H0_SI*sec_par_an):
sigma_SB      := evalf(2.0*Pi^5*k_si^4/(15.0*h_si^3*c_si^2)):
rho_r_photons := evalf(4.0*sigma_SB*T0^4/c_si^3):

if option_r = "avec_neutrinos" then
    rho_r0 := evalf(1.6913*rho_r_photons):
elif option_r = "nul" then
    rho_r0 := 0.:
else
    rho_r0 := rho_r_photons:
end if:

Omega_r0 := evalf(8.0*Pi*G_si*rho_r0/(3.0*H0_SI^2)):
Omega_k0 := evalf(1.0 - Omega_m0 - Omega_DE0 - Omega_r0):

# --- Dark energy factor Y(a) ---
Y_func := a -> evalf(a^(-3.0*(1.0 + w0 + w1)) * exp(-3.0*w1*(1.0 - a))):

# --- Friedmann F2(a) ---
F2a := a -> evalf(Omega_r0/a^4 + Omega_m0/a^3
                  + Omega_k0/a^2 + Omega_DE0*Y_func(a)):

# --- Cosmic time as function of a (years) ---
a_eps := 0.8435:

cosmic_time_yr := proc(a_val::numeric)
    if a_val <= a_eps then return 0. end if:
    return evalf(Int(1.0/(aa*sqrt(F2a(aa))), aa = a_eps..a_val)) / H0_an:
end proc:

# --- Loop over a from ~0 to a_max ---
da_step := evalf(a_max / N_pts):

fd := fopen(cat(output_prefix, "DE_facteur_a.csv"), WRITE, TEXT):
fprintf(fd, "t_an,t_Gyr,a\n"):

for idx from 0 to N_pts do
    a_val := evalf(a_eps + (a_max - a_eps)/N_pts * idx):
    t_an  := cosmic_time_yr(a_val):
    t_Gyr := evalf(t_an/0.10e10):
    fprintf(fd, "%.12g,%.12g,%.12g\n", t_an, t_Gyr, a_val):
end do:

fclose(fd):
