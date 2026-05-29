/*
Ce fichier est le javascript des deux pages d'analyse de la calculette LCDM et DE.
Il permet de comparer les calculs effectués par les javascript du site avec ceux d'un autre logiciel afin de confirmer la validité des calculs du site.
*/

/*
J'ai penser que la solution la plus simple était de modifier les fonctions dans calculette.js afin d'ajouter une
troisième variables qui donnerais soit les graphes en temps normale variable=0 soit la liste des valeurs calculé en 
cas de teste variable=1
*/

const attendre = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function Analyse_avec_parametre_choisis(fonction_EouF, is_t, distanceOuOmegaOuTemps) {

    T0=document.getElementById("check_T0").checked;
    H0=document.getElementById("check_H0").checked;
    Omegam0=document.getElementById("check_Omegam0").checked;
    OmegaLambda0=document.getElementById("check_OmegaLambda0").checked;
    Omegar0=document.getElementById("check_Omegar0").checked;
    Omegak0=document.getElementById("check_Omegak0").checked;

    parametre_val_min=Number(document.getElementById("parametre_val_min").value);
    parametre_val_max=Number(document.getElementById("parametre_val_max").value);
    parametre_pas=Number(document.getElementById("parametre_pas").value);

    if (T0) {
        for (let i=parametre_val_min; i<=parametre_val_max; i+=parametre_pas) {
            document.getElementById("T0").value=Number(i);
            let resultats = String(resultatCalculette(fonction_EouF,is_t,distanceOuOmegaOuTemps));
            await attendre(1000);
            console.log("T0="+i);
            console.log(resultats);
            download_csv(resultats,"T0_"+i+".csv");
        }
    }
    else if (H0) {
        for (let i=parametre_val_min; i<=parametre_val_max; i+=parametre_pas) {
            document.getElementById("H0").value=i;
            let resultats = String(resultatCalculette(fonction_EouF,is_t,distanceOuOmegaOuTemps));
            download_csv(resultats,"H0_"+i+".csv");
        }
    }
    else if (Omegam0) {
        for (let i=parametre_val_min; i<=parametre_val_max; i+=parametre_pas) {
            document.getElementById("Omegam0").value=i;
            let resultats = String(resultatCalculette(fonction_EouF,is_t,distanceOuOmegaOuTemps));
            download_csv(resultats,"Omegam0_"+i+".csv");
        }    
    }
    else if (OmegaLambda0) {
        for (let i=parametre_val_min; i<=parametre_val_max; i+=parametre_pas) {
            document.getElementById("OmegaLambda0").value=i;
            let resultats = String(resultatCalculette(fonction_EouF,is_t,distanceOuOmegaOuTemps));
            download_csv(resultats,"OmegaLambda0_"+i+".csv");
        }
    }
    else if (Omegar0) {
        for (let i=parametre_val_min; i<=parametre_val_max; i+=parametre_pas) {
            document.getElementById("Omegar0").value=i;
            let resultats = String(resultatCalculette(fonction_EouF,is_t,distanceOuOmegaOuTemps));
            download_csv(resultats,"Omegar0_"+i+".csv");
        }
    }
    else if (Omegak0) {
        for (let i=parametre_val_min; i<=parametre_val_max; i+=parametre_pas) {
            document.getElementById("Omegak0").value=i;
            let resultats = String(resultatCalculette(fonction_EouF,is_t,distanceOuOmegaOuTemps));
            download_csv(resultats,"Omegak0_"+i+".csv");
        }
    }
}

function resultatCalculette(fonction_EouF, is_t, distanceOuOmegaOuTemps) { 
    if (distanceOuOmegaOuTemps=="distance") {
        let resultats = String(generer_graphique_distance(fonction_EouF,is_t,1)); 
        return resultats;
    }
    else if (distanceOuOmegaOuTemps=="omega") {
        let resultats = String(generer_graphique_Omega(fonction_EouF,is_t,1));
        return resultats;
    }
    else if (distanceOuOmegaOuTemps=="temps") {
        let resultats = String(generer_graphique_TempsDecalage(fonction_EouF,is_t,1)); 
        return resultats;
    }
    else {
        return console.error("Erreur")
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