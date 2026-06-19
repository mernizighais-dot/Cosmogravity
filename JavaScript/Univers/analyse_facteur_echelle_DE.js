// On vas coder des fonctions qui vont vérifier les calcule du facteur d'échelle

async function attendre(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

async function analyse_facteur_echelle_DE(){

    let T0=document.getElementById("check_T0").checked;
    let H0=document.getElementById("check_H0").checked;
    let Omegam0=document.getElementById("check_Omegam0").checked;
    let OmegaLambda0=document.getElementById("check_OmegaLambda0").checked;
    let w0=document.getElementById("check_W0").checked;
    let w1=document.getElementById("check_W1").checked;
    

    let parametre_val_min=Number(document.getElementById("parametre_val_min").value);
    let parametre_val_max=Number(document.getElementById("parametre_val_max").value);
    let parametre_pas=Number(document.getElementById("parametre_pas").value);

    if (T0) {
        for (let i=parametre_val_min; i<=parametre_val_max; i+=parametre_pas) {
            document.getElementById("T0").value = Number(i);
            await attendre(1000);
            updateUnivers();
            await attendre(1000);
            affichage_site_DE();
            await attendre(1000);
            document.getElementById("nom_fichier").value = "T0_"+i;
            await attendre(100);
            document.getElementById("optionsEnregistrement").value = "CSV";
            await attendre(100);
            enregistrer();
        }
    }
    else if (H0) {
        for (let i=parametre_val_min; i<=parametre_val_max; i+=parametre_pas) {
            document.getElementById("H0").value = Number(i);
            await attendre(1000);
            updateUnivers();
            await attendre(1000);
            affichage_site_DE();
            await attendre(1000);
            document.getElementById("nom_fichier").value = "H0_"+i;
            await attendre(100);
            document.getElementById("optionsEnregistrement").value = "CSV";
            await attendre(100);
            enregistrer();
        }
    }
    else if (Omegam0) {
        for (let i=parametre_val_min; i<=parametre_val_max; i+=parametre_pas) {
            document.getElementById("Omégam0").value = Number(i);
            await attendre(1000);
            updateUnivers();
            await attendre(1000);
            affichage_site_DE();
            await attendre(1000);
            document.getElementById("nom_fichier").value = "Omegam0_"+i;
            await attendre(100);
            document.getElementById("optionsEnregistrement").value = "CSV";
            await attendre(100);
            enregistrer();
        }
    }
    else if (OmegaLambda0) {
        for (let i=parametre_val_min; i<=parametre_val_max; i+=parametre_pas) {
            document.getElementById("OmégaDE0").value = Number(i);
            await attendre(1000);
            updateUnivers();
            await attendre(1000);
            affichage_site_DE();
            await attendre(1000);
            document.getElementById("nom_fichier").value = "OmegaLambda0_"+i;
            await attendre(100);
            document.getElementById("optionsEnregistrement").value = "CSV";
            await attendre(100);
            enregistrer();
        }
    } 
    else if (w0) {
        for (let i=parametre_val_min; i<=parametre_val_max; i+=parametre_pas) {
            document.getElementById("w0").value = Number(i);
            await attendre(1000);
            updateUnivers();
            await attendre(1000);
            affichage_site_DE();
            await attendre(1000);
            document.getElementById("nom_fichier").value = "W0_"+i;
            await attendre(100);
            document.getElementById("optionsEnregistrement").value = "CSV";
            await attendre(100);
            enregistrer();
        }
    }
    else if (w1) {
        for (let i=parametre_val_min; i<=parametre_val_max; i+=parametre_pas) {
            document.getElementById("w1").value = Number(i);
            await attendre(1000);
            updateUnivers();
            await attendre(1000);
            affichage_site_DE();
            await attendre(1000);
            document.getElementById("nom_fichier").value = "W1_"+i;
            await attendre(100);
            document.getElementById("optionsEnregistrement").value = "CSV";
            await attendre(100);
            enregistrer();
        }
    }
}