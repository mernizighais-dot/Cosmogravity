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
            let resultats = resultatCalculette(fonction_EouF,is_t,distanceOuOmegaOuTemps);
            await attendre(1000);
            console.log(resultats);
            download_csv(resultats,"T0_"+i+".csv");
        }
    }
    else if (H0) {
        for (let i=parametre_val_min; i<=parametre_val_max; i+=parametre_pas) {
            document.getElementById("H0").value=i;
            let resultats = resultatCalculette(fonction_EouF,is_t,distanceOuOmegaOuTemps);
            download_csv(resultats,"H0_"+i+".csv");
        }
    }
    else if (Omegam0) {
        for (let i=parametre_val_min; i<=parametre_val_max; i+=parametre_pas) {
            document.getElementById("Omegam0").value=i;
            let resultats = resultatCalculette(fonction_EouF,is_t,distanceOuOmegaOuTemps);
            download_csv(resultats,"Omegam0_"+i+".csv");
        }    
    }
    else if (OmegaLambda0) {
        for (let i=parametre_val_min; i<=parametre_val_max; i+=parametre_pas) {
            document.getElementById("OmegaLambda0").value=i;
            let resultats = resultatCalculette(fonction_EouF,is_t,distanceOuOmegaOuTemps);
            download_csv(resultats,"OmegaLambda0_"+i+".csv");
        }
    }
    else if (Omegar0) {
        for (let i=parametre_val_min; i<=parametre_val_max; i+=parametre_pas) {
            document.getElementById("Omegar0").value=i;
            let resultats = resultatCalculette(fonction_EouF,is_t,distanceOuOmegaOuTemps);
            download_csv(resultats,"Omegar0_"+i+".csv");
        }
    }
    else if (Omegak0) {
        for (let i=parametre_val_min; i<=parametre_val_max; i+=parametre_pas) {
            document.getElementById("Omegak0").value=i;
            let resultats = resultatCalculette(fonction_EouF,is_t,distanceOuOmegaOuTemps);
            download_csv(resultats,"Omegak0_"+i+".csv");
        }
    }
}

function resultatCalculette(fonction_EouF, is_t, distanceOuOmegaOuTemps) { 
    if (distanceOuOmegaOuTemps=="distance") {
        let resultats = generer_graphique_distance(fonction_EouF,is_t,1); 
        return resultats;
    }
    else if (distanceOuOmegaOuTemps=="omega") {
        let resultats = generer_graphique_Omega(fonction_EouF,is_t,1);
        return resultats;
    }
    else if (distanceOuOmegaOuTemps=="temps") {
        let resultats = generer_graphique_TempsDecalage(fonction_EouF,is_t,1); 
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

async function comparaison(url1,url2) {
    /*Fonction prenant en entrée deux csv de même structure et calcul l'erreur relative entre chaque valeur
    ainsi de la moyenne et l'écart type de l'erreur relative de tout l'échantillon.
    Renvoie un csv avec tous les résultats*/ 

    let donnees1 = await extraction_csv(url1);
    let donnees2 = await extraction_csv(url2);
    let resultat=[donnees1[0]];
    
    for (let i = 1; i < donnees1.length; i++) { //on commence à 1 pour enlever l'entête
        var ligne_resultat=[];
        for (let j = 0; j < donnees1[1].length; j++) {
            if (Number(donnees2[i][j]) === 0) {
                ligne_resultat.push(0);
            }
            else {
                ligne_resultat.push(Math.abs(Number(donnees1[i][j])-Number(donnees2[i][j]))/Math.abs(Number(donnees2[i][j])));
            }
        }
        resultat.push(ligne_resultat);
    }


    return [stats(resultat),resultat];
}

async function extraction_csv(url) {
    /*Extrait les données d'un csv*/

    const response = await fetch(url);
    const contenu = await response.text();

    const lignes = contenu.split('\n');
    return lignes.map(ligne =>
        ligne.split(';').map(val => val.trim())
    );
}

function stats(data) { // data = tableau de lignes (CSV déjà parsé)
    /*Renvoie la moyenne et l'écart type de chaque colonne d'un tableau*/
    if (data.length === 0) return [];

    let nbColonnes = data[0].length;

    let resultats = [];

    for (let j = 0; j < nbColonnes; j++) {

        let colonne = [];

        // 1. extraire la colonne
        for (let i = 1; i < data.length; i++) { 
            // on saute l'entête (ligne 0)
            let val = Number(data[i][j]);

            if (!isNaN(val)) {
                colonne.push(val);
            }
        }

        // 2. moyenne
        let moyenne =
            colonne.reduce((a, b) => a + b, 0) / colonne.length;

        // 3. écart-type
        let variance =
            colonne.reduce((a, b) => a + (b - moyenne) ** 2, 0) /
            colonne.length;

        let ecartType = Math.sqrt(variance);

        // 4. stocker résultat
        resultats.push({
            colonne: data[0][j], // nom de la colonne
            moyenne: moyenne,
            ecartType: ecartType
        });
    }

    return resultats;
}

comparaison('JavaScript/Univers/echelle_LCDM.csv','JavaScript/Univers/echelle_LCDM2.csv').then(data => {
    console.log(data);
});