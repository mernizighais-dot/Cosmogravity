async function attendre(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function lancement_analyse() {

    let rayon, vitesse_radiale, vitesse_tangentielle, L, E;
    let data = "rayon,vitesse_radiale,vitesse_tangentielle,L,E\n";
    let analyse_trajectoire_en_cours = 0;

    while(analyse_trajectoire_en_cours <= 1000) {

        analyse_trajectoire_en_cours+=1;

        rayon = document.getElementById("r_par1").innerHTML;
        vitesse_radiale = document.getElementById("vr_sc_mas1").innerHTML;
        vitesse_tangentielle = document.getElementById("vp_sc_mas1").innerHTML;
        L = document.getElementById("L1").innerHTML;
        E = document.getElementById("E1").innerHTML;

        data += `${rayon},${vitesse_radiale},${vitesse_tangentielle},${L},${E}\n`;

        await attendre(10); //temps en ms entre chaque ligne de données (ici 100ms)
    }
    download_csv(data, "analyse_trajectoire.csv");  
}

async function analyse_parametre(){
    let M = document.getElementById("check_M").checked;
    let r = document.getElementById("check_r_physique").checked;

    let valmin_parametre = Number(document.getElementById("parametre_val_min").value);
    let valmax_parametre = Number(document.getElementById("parametre_val_max").value);
    let pas = Number(document.getElementById("parametre_pas").value);

    if ( valmin_parametre<=valmax_parametre) {
        if (M) {
            document.getElementById("M").value = valmin_parametre;
            await attendre(10);
            await lancement_analyse();
            await attendre(10);
            document.getElementById("parametre_val_min").value = Number(valmin_parametre + pas);
            await attendre(10);
            sessionStorage.setItem("cliquerSurStart", "true");
            window.location.reload();
        }
        if (r) {
            document.getElementById("r_phy").value = valmin_parametre
            await attendre(10);
            await lancement_analyse();
            await attendre(10);
            document.getElementById("parametre_val_min").value = Number(valmin_parametre + pas);
            await attendre(10);
            sessionStorage.setItem("cliquerSurStart", "true");
            window.location.reload();
        }
    }
}

function download_csv(data, filename) {

    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
        
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
        
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}