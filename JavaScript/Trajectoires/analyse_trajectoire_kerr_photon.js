async function attendre(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function lancement_analyse() {
    let titre = "analyse_trajectoire_kerr_photon_";
    let M = document.getElementById("check_M").checked;

    if(M){
        titre+="M_";
        titre+=String(document.getElementById("M").value);
    }
    else{
        titre+="J_";
        titre+=String(document.getElementById("J").value);
    }

    let rayon, vitesse_radiale, vitesse_tangentielle, L, E;
    let data = "rayon,vitesse_radiale,vitesse_tangentielle,L,E\n";
    let analyse_trajectoire_en_cours = 0;

    while(analyse_trajectoire_en_cours <= 1000) {

        analyse_trajectoire_en_cours+=1;

        rayon = document.getElementById("r_par").innerHTML;
        vitesse_radiale = document.getElementById("vrkp").innerHTML;
        vitesse_tangentielle = document.getElementById("vpkp").innerHTML;
        L = document.getElementById("L").innerHTML;
        E = document.getElementById("E").innerHTML;

        data += `${rayon},${vitesse_radiale},${vitesse_tangentielle},${L},${E}\n`;

        await attendre(10); //temps en ms entre chaque ligne de données (ici 10ms)
    }
    download_csv(data, titre+".csv");  
}

async function analyse_parametre(){
    let M = document.getElementById("check_M").checked;
    let J = document.getElementById("check_J").checked;

    let valmin_parametre = Number(document.getElementById("parametre_val_min").value);
    let valmax_parametre = Number(document.getElementById("parametre_val_max").value);
    let pas = Number(document.getElementById("parametre_pas").value);


    let numero_boucle = parseInt(sessionStorage.getItem("compteur")) || 1 ;
        
    sessionStorage.setItem("valmin"+numero_boucle, valmin_parametre);
    sessionStorage.setItem("valmax"+numero_boucle, valmax_parametre);
    sessionStorage.setItem("pas"+numero_boucle, pas);

    let max_boucles = Math.trunc((Number(sessionStorage.getItem("valmax1")) - Number(sessionStorage.getItem("valmin1")))/Number(sessionStorage.getItem("pas1"))) + 1;
    console.log(max_boucles);

    if (numero_boucle <= max_boucles) {
        if (M) {
            document.getElementById("M").value = numero_boucle*Number(sessionStorage.getItem("pas1"));
            await attendre(10);
            await lancement_analyse();
            await attendre(10);
            numero_boucle++;
            await attendre(10);
            sessionStorage.setItem("compteur", numero_boucle);
            sessionStorage.setItem("cliquerSurStart", "true");
            window.location.reload();
        }
        if (J) {
            document.getElementById("J").value = numero_boucle*pas;
            await attendre(10);
            await lancement_analyse();
            await attendre(10);
            numero_boucle++;
            await attendre(10);
            sessionStorage.setItem("compteur", numero_boucle);
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