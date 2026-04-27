/*
Ce fichier est le javascript des deux pages d'analyse de la calculette LCDM et DE.
Il permet de comparer les calculs effectués par les javascript du site avec ceux d'un autre logiciel afin de confirmer la validité des calculs du site.
*/

function fonction1() { //à renommer
    let texte = o_recupereJson();
    //à faire
}

function fonction2() { //à renommer
    let texte = o_recupereJson();
    //à faire
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