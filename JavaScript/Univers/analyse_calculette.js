/*
Ce fichier est le javascript des deux pages d'analyse de la calculette LCDM et DE.
Il permet de comparer les calculs effectués par les javascript du site avec ceux d'un autre logiciel afin de confirmer la validité des calculs du site.
*/

/*
J'ai penser que la solution la plus simple était de modifier les fonctions dans calculette.js afin d'ajouter une
troisième variables qui donnerais soit les graphes en temps normale variable=0 soit la liste des valeurs calculé en 
cas de teste variable=1
*/
async function attendre(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function Analyse_avec_parametre_choisis(fonction_EouF, is_t, distanceOuOmegaOuTemps) {

    let T0=document.getElementById("check_T0").checked;
    let H0=document.getElementById("check_H0").checked;
    let Omegam0=document.getElementById("check_Omegam0").checked;
    let OmegaLambda0=document.getElementById("check_OmegaLambda0").checked;
    let w0=false;
    let w1=false;
    let DE_ouLCDM="LCDM";
    let t_ou_z="t";
    let zt_ou_tz="t(z)";

    if (is_t == 0) {
        t_ou_z="z";
        zt_ou_tz="t(z)";
    }

    if (fonction_EouF==fonction_F) {
        w0=document.getElementById("check_W0").checked;
        w1=document.getElementById("check_W1").checked;
        DE_ouLCDM="DE";
    }

    let parametre_val_min=Number(document.getElementById("parametre_val_min").value);
    let parametre_val_max=Number(document.getElementById("parametre_val_max").value);
    let parametre_pas=Number(document.getElementById("parametre_pas").value);

    if (T0) {

        for (let i=parametre_val_min; i<=parametre_val_max; i+=parametre_pas) {

            document.getElementById("T0").value = Number(i);

            if (distanceOuOmegaOuTemps=="distance") {
                const resultats = await generer_graphique_distance(fonction_EouF,is_t,1);
                download_csv(resultats,"T0_"+i+"_d("+t_ou_z+")_"+DE_ouLCDM+".csv");
            }

            else if (distanceOuOmegaOuTemps=="omega") {
                const resultats = await generer_graphique_Omega(fonction_EouF,is_t,1);
                download_csv(resultats,"T0_"+i+"_Omega("+t_ou_z+")_"+DE_ouLCDM+".csv");
            }

            else if (distanceOuOmegaOuTemps=="temps") {
                const resultats = await generer_graphique_TempsDecalage(fonction_EouF,is_t,1);
                download_csv(resultats,"T0_"+i+"_"+zt_ou_tz+"_"+DE_ouLCDM+".csv");
            }
        }
    }
    else if (H0) {

        for (let i=parametre_val_min; i<=parametre_val_max; i+=parametre_pas) {
            
            document.getElementById("H0").value=i;

             if (distanceOuOmegaOuTemps=="distance") {
                const resultats = await generer_graphique_distance(fonction_EouF,is_t,1);
                download_csv(resultats,"H0_"+i+"_d("+t_ou_z+")_"+DE_ouLCDM+".csv");
            }

            else if (distanceOuOmegaOuTemps=="omega") {
                const resultats = await generer_graphique_Omega(fonction_EouF,is_t,1);
                download_csv(resultats,"H0_"+i+"_Omega("+t_ou_z+")_"+DE_ouLCDM+".csv");
            }

            else if (distanceOuOmegaOuTemps=="temps") {
                const resultats = await generer_graphique_TempsDecalage(fonction_EouF,is_t,1);
                download_csv(resultats,"H0_"+i+"_"+zt_ou_tz+"_"+DE_ouLCDM+".csv");
            }
        }
    }
    else if (Omegam0) {
        for (let i=parametre_val_min; i<=parametre_val_max; i+=parametre_pas) {
            document.getElementById("Omégam0").value=i;
            
             if (distanceOuOmegaOuTemps=="distance") {
                const resultats = await generer_graphique_distance(fonction_EouF,is_t,1);
                download_csv(resultats,"Omegam0_"+i+"_d("+t_ou_z+")_"+DE_ouLCDM+".csv");
            }

            else if (distanceOuOmegaOuTemps=="omega") {
                const resultats = await generer_graphique_Omega(fonction_EouF,is_t,1);
                download_csv(resultats,"Omegam0_"+i+"_Omega("+t_ou_z+")_"+DE_ouLCDM+".csv");
            }

            else if (distanceOuOmegaOuTemps=="temps") {
                const resultats = await generer_graphique_TempsDecalage(fonction_EouF,is_t,1);
                download_csv(resultats,"Omegam0_"+i+"_"+zt_ou_tz+"_"+DE_ouLCDM+".csv");
            }
        }    
    }
    else if (OmegaLambda0) {
        for (let i=parametre_val_min; i<=parametre_val_max; i+=parametre_pas) {
            document.getElementById("Omégal0").value=i;
            
             if (distanceOuOmegaOuTemps=="distance") {
                const resultats = await generer_graphique_distance(fonction_EouF,is_t,1);
                download_csv(resultats,"OmegaLambda0_"+i+"_d("+t_ou_z+")_"+DE_ouLCDM+".csv");
            }

            else if (distanceOuOmegaOuTemps=="omega") {
                const resultats = await generer_graphique_Omega(fonction_EouF,is_t,1);
                download_csv(resultats,"OmegaLambda0_"+i+"_Omega("+t_ou_z+")_"+DE_ouLCDM+".csv");
            }

            else if (distanceOuOmegaOuTemps=="temps") {
                const resultats = await generer_graphique_TempsDecalage(fonction_EouF,is_t,1);
                download_csv(resultats,"OmegaLambda0_"+i+"_"+zt_ou_tz+"_"+DE_ouLCDM+".csv");
            }
        }
    }
    else if (fonction_EouF==fonction_F && w0) { 
        for (let i=parametre_val_min; i<=parametre_val_max; i+=parametre_pas) {
            document.getElementById("w0").value=i;

             if (distanceOuOmegaOuTemps=="distance") {
                const resultats = await generer_graphique_distance(fonction_EouF,is_t,1);
                download_csv(resultats,"W0_"+i+"_d("+t_ou_z+")_"+DE_ouLCDM+".csv");
            }

            else if (distanceOuOmegaOuTemps=="omega") {
                const resultats = await generer_graphique_Omega(fonction_EouF,is_t,1);
                download_csv(resultats,"W0_"+i+"_Omega("+t_ou_z+")_"+DE_ouLCDM+".csv");
            }

            else if (distanceOuOmegaOuTemps=="temps") {
                const resultats = await generer_graphique_TempsDecalage(fonction_EouF,is_t,1);
                download_csv(resultats,"W0_"+i+"_"+zt_ou_tz+"_"+DE_ouLCDM+".csv");
            }
        }
    }
    else if (fonction_EouF==fonction_F && w1) { 
        for (let i=parametre_val_min; i<=parametre_val_max; i+=parametre_pas) {
            document.getElementById("w1").value=i;

             if (distanceOuOmegaOuTemps=="distance") {
                const resultats = await generer_graphique_distance(fonction_EouF,is_t,1);
                download_csv(resultats,"W1_"+i+"_d("+t_ou_z+")_"+DE_ouLCDM+".csv");
            }

            else if (distanceOuOmegaOuTemps=="omega") {
                const resultats = await generer_graphique_Omega(fonction_EouF,is_t,1);
                download_csv(resultats,"W1_"+i+"_Omega("+t_ou_z+")_"+DE_ouLCDM+".csv");
            }

            else if (distanceOuOmegaOuTemps=="temps") {
                const resultats = await generer_graphique_TempsDecalage(fonction_EouF,is_t,1);
                download_csv(resultats,"W1_"+i+"_"+zt_ou_tz+"_"+DE_ouLCDM+".csv");
            }
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