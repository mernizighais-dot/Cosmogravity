# ------------------------------------------------------------------
# verification_DE.mpl - Dark Energy cosmological calculator
#
# USAGE:
#
#   1. Shell / command line:
#        cmaple -c "H0:=67.74: ..." verification_DE.mpl
#        (prefer the temp-file approach via run_DE.py to avoid quoting issues)
#
#   2. From another Maple script:
#        H0 := 67.74:  Omega_m0 := 0.3089:  Omega_DE0 := 0.6911:
#        T0 := 2.7255: w0 := -1.0: w1 := 0.0:
#        z_min_graph := 0.:  z_max_graph := 5.0:  N_pts := 300:
#        read "C:/Users/theoc/Desktop/cours/mapple/codefullmaple/verification_DE.mpl":
#
#   Any parameter not set falls back to its default.
#   Do NOT call restart before read-ing from another script.
#
#   Note: w0=-1, w1=0 recovers the LCDM cosmological-constant case exactly.
# ------------------------------------------------------------------

kernelopts(gcfreq=0):
output_dir := "C:/Users/theoc/Desktop/cours/mapple/":
currentdir(output_dir):

# --- Apply defaults ---
if not type(H0,          numeric) then H0          := 67.74  end if:
if not type(Omega_m0,    numeric) then Omega_m0    := 0.3089 end if:
if not type(Omega_DE0,   numeric) then Omega_DE0   := 0.6911 end if:
if not type(T0,          numeric) then T0          := 2.7255 end if:
if not type(w0,          numeric) then w0          := -1.0   end if:
if not type(w1,          numeric) then w1          := 0.0    end if:
if not type(z_min_graph, numeric) then z_min_graph := 0.     end if:
if not type(z_max_graph, numeric) then z_max_graph := 5.0    end if:
if not type(N_pts,       integer) then N_pts        := 1000  end if:

# option_r_code: 0=avec_neutrinos (default)  1=photons_only  2=nul
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

# output_prefix auto-generated from all parameter values
output_prefix := cat("H", H0, "_m", Omega_m0, "_DE", Omega_DE0,
                     "_w0_", w0, "_w1_", w1,
                     "_T", T0, "_R", option_r_code, "_"):

# --- Physical constants (SI) ---
c_si          := 0.2997924580e9:
G_si          := 0.6674e-10:
h_si          := 0.662607015e-33:
k_si          := 0.1380649e-22:
AU_si         := 0.1495978707000e12:
Mpc_m         := evalf(0.10e7*648000.0/Pi*AU_si):
H0_SI         := evalf(1000.*H0/Mpc_m):
sec_par_an    := 3600.0*365.2425*24.0:
H0_an         := evalf(H0_SI*sec_par_an):
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
Omega_k0 := evalf(1.0 - Omega_m0 - Omega_DE0 - Omega_r0):

# --- Dark energy equation-of-state factor ---
# Y(a) = a^{-3(1+w0+w1)} * exp(-3*w1*(1-a))
# This is the ratio rho_DE(a) / rho_DE(a=1).
# At w0=-1, w1=0: Y(a) = 1 for all a  (cosmological constant).
Y_func := a -> evalf(a^(-3.0*(1.0 + w0 + w1)) * exp(-3.0*w1*(1.0 - a))):

# --- Friedmann equation: F²(z) and F²(a) ---
# F²(z) = Omega_r0*(1+z)^4 + Omega_m0*(1+z)^3 + Omega_k0*(1+z)^2
#        + Omega_DE0 * Y(1/(1+z))
F2z := z -> evalf(Omega_r0*(1+z)^4 + Omega_m0*(1+z)^3
                  + Omega_k0*(1+z)^2 + Omega_DE0*Y_func(1.0/(1.0+z))):

# F²(a) = Omega_r0/a^4 + Omega_m0/a^3 + Omega_k0/a^2 + Omega_DE0*Y(a)
F2a := a -> evalf(Omega_r0/a^4 + Omega_m0/a^3
                  + Omega_k0/a^2 + Omega_DE0*Y_func(a)):

# --- Density parameters at redshift z ---
Om_r  := z -> evalf(Omega_r0 *(1+z)^4            / F2z(z)):
Om_m  := z -> evalf(Omega_m0 *(1+z)^3            / F2z(z)):
Om_DE := z -> evalf(Omega_DE0*Y_func(1.0/(1.0+z)) / F2z(z)):
Om_k  := z -> evalf(1.0 - Om_r(z) - Om_m(z) - Om_DE(z)):

# --- Cosmic time (years) ---
a_eps := 0.10e-9:

cosmic_time_yr := proc(z_val::numeric)
    local a_up:
    a_up := evalf(1.0/(1.0 + z_val)):
    if a_up <= a_eps then return 0. end if:
    return evalf(Int(1.0/(aa*sqrt(F2a(aa))), aa = a_eps..a_up)) / H0_an:
end proc:

# --- Comoving distance (metres) ---
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
    raw_int := evalf(Int(1.0/(aa^2*sqrt(F2a(aa))), aa = a_lo..1.0)):
    dm_flat  := evalf(c_si*raw_int/H0_SI):
    if abs(Omega_k0) < 0.1e-7 then
        return dm_flat:
    elif 0 < Omega_k0 then
        return evalf(c_si*Sk_func(H0_SI*sqrt(Omega_k0)*dm_flat/c_si, Omega_k0)
                         /(H0_SI*sqrt(Omega_k0))):
    else
        return evalf(c_si*Sk_func(H0_SI*sqrt(-Omega_k0)*dm_flat/c_si, Omega_k0)
                         /(H0_SI*sqrt(-Omega_k0))):
    end if:
end proc:

dist_da_m  := z -> evalf(comoving_dist_m(z)/(1.0 + z)):
dist_dL_m  := z -> evalf(comoving_dist_m(z)*(1.0 + z)):
dist_dLT_m := z -> evalf(cosmic_time_yr(z)*sec_par_an*c_si):
m_to_ly    := x -> evalf(x/ly_m):
dz_step    := evalf((z_max_graph - z_min_graph)/N_pts):

# --- Open CSV files ---
fd_dz := fopen(cat(output_prefix, "DE_d_z.csv"),    WRITE, TEXT):
fd_dt := fopen(cat(output_prefix, "DE_d_t.csv"),    WRITE, TEXT):
fd_Oz := fopen(cat(output_prefix, "DE_Omega_z.csv"),WRITE, TEXT):
fd_Ot := fopen(cat(output_prefix, "DE_Omega_t.csv"),WRITE, TEXT):
fd_tz := fopen(cat(output_prefix, "DE_t_z.csv"),    WRITE, TEXT):
fd_zt := fopen(cat(output_prefix, "DE_z_t.csv"),    WRITE, TEXT):

fprintf(fd_dz, "z,t_an,t_Gyr,d_m_ly,d_a_ly,d_L_ly,d_LT_ly\n"):
fprintf(fd_dt, "t_an,t_Gyr,z,d_m_ly,d_a_ly,d_L_ly,d_LT_ly\n"):
fprintf(fd_Oz, "z,t_an,t_Gyr,Omega_r,Omega_m,Omega_k,Omega_DE\n"):
fprintf(fd_Ot, "t_an,t_Gyr,z,Omega_r,Omega_m,Omega_k,Omega_DE\n"):
fprintf(fd_tz, "z,t_an,t_Gyr\n"):
fprintf(fd_zt, "t_an,t_Gyr,z\n"):

# --- Main loop ---
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
    o_DE   := Om_DE(z_val):
    o_k    := Om_k(z_val):
    fprintf(fd_dz, "%.12g,%.12g,%.12g,%.12g,%.12g,%.12g,%.12g\n", z_val, t_an, t_Gyr, dm_ly, da_ly, dL_ly, dLT_ly):
    fprintf(fd_dt, "%.12g,%.12g,%.12g,%.12g,%.12g,%.12g,%.12g\n", t_an, t_Gyr, z_val, dm_ly, da_ly, dL_ly, dLT_ly):
    fprintf(fd_Oz, "%.12g,%.12g,%.12g,%.12g,%.12g,%.12g,%.12g\n", z_val, t_an, t_Gyr, o_r, o_m, o_k, o_DE):
    fprintf(fd_Ot, "%.12g,%.12g,%.12g,%.12g,%.12g,%.12g,%.12g\n", t_an, t_Gyr, z_val, o_r, o_m, o_k, o_DE):
    fprintf(fd_tz, "%.12g,%.12g,%.12g\n", z_val, t_an, t_Gyr):
    fprintf(fd_zt, "%.12g,%.12g,%.12g\n", t_an, t_Gyr, z_val):
end do:

fclose(fd_dz):
fclose(fd_dt):
fclose(fd_Oz):
fclose(fd_Ot):
fclose(fd_tz):
fclose(fd_zt):
