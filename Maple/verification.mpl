# ------------------------------------------------------------------
# verification.mpl - LCDM cosmological calculator
#
# USAGE:
#
#   1. Shell / command line (like python3 code.py arg1 arg2):
#        cmaple -c "H0:=70.0: Omega_m0:=0.27: Omega_lambda0:=0.73: T0:=2.725: option_r:=\"avec_neutrinos\": z_min_graph:=0.: z_max_graph:=5.0: N_pts:=300:" verification.mpl
#
#   2. From another Maple script (caller sets vars, then reads this file):
#        H0 := 70.0:  Omega_m0 := 0.27:  Omega_lambda0 := 0.73:
#        T0 := 2.725: option_r := "avec_neutrinos":
#        z_min_graph := 0.:  z_max_graph := 5.0:  N_pts := 300:
#        read "C:/Users/theoc/Desktop/cours/mapple/codefullmaple/verification.mpl":
#
#   Any parameter not set by the caller falls back to its default (Planck 2015).
#   Do NOT call restart before read-ing this file from another script.
# ------------------------------------------------------------------

kernelopts(gcfreq=0):
output_dir := "C:/Users/theoc/Desktop/cours/mapple/":
currentdir(output_dir):

# --- Apply defaults for any parameter not provided by the caller ---
if not type(H0,            numeric) then H0            := 67.74 end if:
if not type(Omega_m0,      numeric) then Omega_m0      := 0.3089 end if:
if not type(Omega_lambda0, numeric) then Omega_lambda0 := 0.6911 end if:
if not type(T0,            numeric) then T0            := 2.7255 end if:
if not type(z_min_graph,   numeric) then z_min_graph   := 0.     end if:
if not type(z_max_graph,   numeric) then z_max_graph   := 5.0    end if:
if not type(N_pts,         integer) then N_pts          := 1000  end if:

# option_r: accept string directly ("avec_neutrinos" | "photons_only" | "nul")
#           OR numeric code via option_r_code (avoids subprocess quoting issues):
#             0 = avec_neutrinos (default)
#             1 = photons_only
#             2 = nul
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

# output_prefix: always auto-generated from parameter values (no need to pass from Python)
output_prefix := cat("H", H0, "_m", Omega_m0, "_l", Omega_lambda0, "_T", T0, "_R", option_r_code, "_"):

c_si          := 0.2997924580e9:
G_si          := 0.6674e-10:
h_si          := 0.662607015e-33:
k_si          := 0.1380649e-22:
AU_si         := 0.1495978707000e12:
Mpc_m         := evalf(0.10e7*648000.0/Pi*AU_si):
H0_SI         := evalf(1000.*H0/Mpc_m):
sec_par_an    := 3600.0*365.2425*24.0:
H0_an         := evalf(H0_SI*sec_par_an):
H0_Gan        := evalf(0.10e10*H0_an):
ly_m          := evalf(c_si*sec_par_an):
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
Omega_k0 := evalf(1.0 - Omega_m0 - Omega_lambda0 - Omega_r0):

E2z      := z -> evalf(Omega_r0*(z+1)^4 + Omega_m0*(z+1)^3 + Omega_k0*(z+1)^2 + Omega_lambda0):
E2a      := a -> evalf(Omega_r0/a^4 + Omega_m0/a^3 + Omega_k0/a^2 + Omega_lambda0):
Om_r     := z -> evalf(Omega_r0*(z+1)^4/E2z(z)):
Om_m     := z -> evalf(Omega_m0*(z+1)^3/E2z(z)):
Om_L     := z -> evalf(Omega_lambda0/E2z(z)):
Om_k     := z -> evalf(1.0 - Om_r(z) - Om_m(z) - Om_L(z)):

a_eps := 0.10e-9:

cosmic_time_yr := proc(z_val::numeric)
    local a_up:
    a_up := evalf(1.0/(1.0 + z_val)):
    if a_up <= a_eps then return 0. end if:
    return evalf(Int(1.0/(aa*sqrt(E2a(aa))), aa = a_eps..a_up)) / H0_an:
end proc:

Sk_func := proc(x::numeric, Ok::numeric)
    if abs(Ok) < 0.1e-7 then x:
    elif 0 < Ok then evalf(sinh(x)):
    else evalf(sin(x)):
    end if:
end proc:

comoving_dist_m := proc(z_val::numeric)
    local a_lo, raw_int, dm_flat:
    a_lo := evalf(1.0/(1.0 + z_val)):
    if abs(1.0 - a_lo) < 0.1e-13 then return 0. end if:
    raw_int := evalf(Int(1.0/(aa^2*sqrt(E2a(aa))), aa = a_lo..1.0)):
    dm_flat := evalf(c_si*raw_int/H0_SI):
    if abs(Omega_k0) < 0.1e-7 then
        return dm_flat:
    elif 0 < Omega_k0 then
        return evalf(c_si*Sk_func(H0_SI*sqrt(Omega_k0)*dm_flat/c_si, Omega_k0)/(H0_SI*sqrt(Omega_k0))):
    else
        return evalf(c_si*Sk_func(H0_SI*sqrt(-Omega_k0)*dm_flat/c_si, Omega_k0)/(H0_SI*sqrt(-Omega_k0))):
    end if:
end proc:

dist_da_m  := z -> evalf(comoving_dist_m(z)/(1.0 + z)):
dist_dL_m  := z -> evalf(comoving_dist_m(z)*(1.0 + z)):
dist_dLT_m := z -> evalf(cosmic_time_yr(z)*sec_par_an*c_si):
m_to_ly    := x -> evalf(x/ly_m):
dz_step    := evalf((z_max_graph - z_min_graph)/N_pts):

fd_dz := fopen(cat(output_prefix, "LCDM_d_z.csv"),    WRITE, TEXT):
fd_dt := fopen(cat(output_prefix, "LCDM_d_t.csv"),    WRITE, TEXT):
fd_Oz := fopen(cat(output_prefix, "LCDM_Omega_z.csv"),WRITE, TEXT):
fd_Ot := fopen(cat(output_prefix, "LCDM_Omega_t.csv"),WRITE, TEXT):
fd_tz := fopen(cat(output_prefix, "LCDM_t_z.csv"),    WRITE, TEXT):
fd_zt := fopen(cat(output_prefix, "LCDM_z_t.csv"),    WRITE, TEXT):

fprintf(fd_dz, "z,t_an,t_Gyr,d_m_ly,d_a_ly,d_L_ly,d_LT_ly\n"):
fprintf(fd_dt, "t_an,t_Gyr,z,d_m_ly,d_a_ly,d_L_ly,d_LT_ly\n"):
fprintf(fd_Oz, "z,t_an,t_Gyr,Omega_r,Omega_m,Omega_k,Omega_Lambda\n"):
fprintf(fd_Ot, "t_an,t_Gyr,z,Omega_r,Omega_m,Omega_k,Omega_Lambda\n"):
fprintf(fd_tz, "z,t_an,t_Gyr\n"):
fprintf(fd_zt, "t_an,t_Gyr,z\n"):

for idx from 0 to N_pts do
    z_val  := evalf(dz_step*idx + z_min_graph):
    t_an   := cosmic_time_yr(z_val):
    t_Gyr  := evalf(t_an/0.10e10):
    dm_ly  := m_to_ly(comoving_dist_m(z_val)):
    da_ly  := m_to_ly(dist_da_m(z_val)):
    dL_ly  := m_to_ly(dist_dL_m(z_val)):
    dLT_ly := m_to_ly(dist_dLT_m(z_val)):
    o_r    := Om_r(z_val):
    o_m    := Om_m(z_val):
    o_L    := Om_L(z_val):
    o_k    := Om_k(z_val):
    fprintf(fd_dz, "%.12g,%.12g,%.12g,%.12g,%.12g,%.12g,%.12g\n", z_val, t_an, t_Gyr, dm_ly, da_ly, dL_ly, dLT_ly):
    fprintf(fd_dt, "%.12g,%.12g,%.12g,%.12g,%.12g,%.12g,%.12g\n", t_an, t_Gyr, z_val, dm_ly, da_ly, dL_ly, dLT_ly):
    fprintf(fd_Oz, "%.12g,%.12g,%.12g,%.12g,%.12g,%.12g,%.12g\n", z_val, t_an, t_Gyr, o_r, o_m, o_k, o_L):
    fprintf(fd_Ot, "%.12g,%.12g,%.12g,%.12g,%.12g,%.12g,%.12g\n", t_an, t_Gyr, z_val, o_r, o_m, o_k, o_L):
    fprintf(fd_tz, "%.12g,%.12g,%.12g\n", z_val, t_an, t_Gyr):
    fprintf(fd_zt, "%.12g,%.12g,%.12g\n", t_an, t_Gyr, z_val):
end do:

fclose(fd_dz):
fclose(fd_dt):
fclose(fd_Oz):
fclose(fd_Ot):
fclose(fd_tz):
fclose(fd_zt):
