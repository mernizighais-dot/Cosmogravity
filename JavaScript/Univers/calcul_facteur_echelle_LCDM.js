/*
Ce fichier est le javascript principal de la page constante cosmologique de la partie univers. Elle permet de calculer
le facteur d'échelle dans le cas du modèle LCDM.
 */

/**
 * Fonction permettant de calculer le facteur d'échelle en fonction du temps
 * @param equa_diff_1 {function} Fonction qui décrit la première dérivée du facteur d'échelle en fonction de tau
 * @param equa_diff_2 {function} Fonction qui décrit la deuxième dérivée du facteur d'échelle en fonction de tau
 * @param fonction_simplifiant Fonction qui permet de simplifier l'écriture des expression dans le modèle LCDM
 * @return Liste des abscisses ou la fonction a été calculée et liste des valeurs de la fonction.
 */
function calcul_facteur_echelle_LCDM(equa_diff_1, equa_diff_2, fonction_simplifiant) {
    let texte = o_recupereJson();

    let H0 = document.getElementById("H0").value;
    let H0parGAnnee = H0_parGAnnees(H0)

    //on recupere les valeurs des variables
    let a_min = Number(document.getElementById("a_min").value);
    let a_max = Number(document.getElementById("a_max").value);

    if (a_min === a_max) {
        a_min = a_min - 1;
        document.getElementById("a_min").value = a_min;
    }

    if (a_min > a_max) {
        let temp = a_min
        a_min = a_max
        a_max = temp
        document.getElementById("a_min").value = a_min;
        document.getElementById("a_max").value = a_max;
    }

    /**
     * Fonction qui permet de :
     *      - Redéfinir les conditions initiales
     *      - Calcule l'intervale de temps de résolution et en déduis un pas raisonnable
     */
    

    let params = bornes_temps_CI();
    let set_solution = [params[0], params[1], params[2]];
    let pas = params[3];


    let taus = [set_solution[0]]
    let facteur_echelle = [set_solution[1]]
    let nombre_point = 0;

    // Résolution dans le sens négatif
    while (set_solution[1] >= a_min && set_solution[1] <= a_max && nombre_point <= 50/Math.abs(pas)) {
        set_solution = RungeKuttaEDO2(-pas, set_solution[0], set_solution[1], set_solution[2], equa_diff_2)
        if (set_solution[1] >= a_min && set_solution[1] <= a_max) {
            taus.push(set_solution[0])
            facteur_echelle.push(set_solution[1])
        }
        nombre_point = nombre_point + 1
    }
    let nombre_point_neg = nombre_point

    // On inverse pour que les listes commencent avec le tau le plus petit puis on réinitialise les conditions initiales
    taus.reverse()
    facteur_echelle.reverse()
    set_solution = [params[0], params[1], params[2]];
    nombre_point = 0;

    // Résolution dans le sens positif
    while (set_solution[1] >= a_min && set_solution[1] <= a_max && nombre_point <= 50/Math.abs(pas)) {
        set_solution = RungeKuttaEDO2(pas, set_solution[0], set_solution[1], set_solution[2], equa_diff_2)
        if (set_solution[1] >= a_min && set_solution[1] <= a_max) {
            taus.push(set_solution[0])
            facteur_echelle.push(set_solution[1])
        }
        nombre_point = nombre_point + 1
    }
    let nombre_point_pos = nombre_point

    // On calcule le temps associé à l'instant présent et si il n'est pas définis on le met à zéro
    let t_0 = calcul_ages(fonction_simplifiant, H0parGAnnee, 1e-8, 0.999999999);

    if (isNaN(t_0)) {
        t_0 = 0
    } else {
        t_0 = t_0 / (nbrJours() * 24 * 3600 * 1e9)
    }

    let debutEtFin = debut_fin_univers(equa_diff_2,pas)

    taus = tauEnTemps(taus, debutEtFin[2])

    if (nombre_point > 50/Math.abs(pas)) {
        let nombre_point_tot = nombre_point_pos + nombre_point_neg
        alert(texte.univers.avertTropPoints+nombre_point_tot)
    }

    return [[taus, facteur_echelle], t_0, debutEtFin]
}

function affichage_site_LCDM() {
     document.getElementById("loading").style.display = "block";

    setTimeout(() => {
        let texte = o_recupereJson();
        let equa_diff_1 = equa_diff_1_LCDM;
        let equa_diff_2 = equa_diff_2_LCDM;
        let fonction = fonction_E;

        let sorties = calcul_facteur_echelle_LCDM(equa_diff_1, equa_diff_2, fonction);
        let donnee = sorties[0];
        let age_univers = sorties[1];
        let debutEtFin = sorties[2];

        document.getElementById("début").innerHTML = debutEtFin[0];
        document.getElementById("fin").innerHTML = debutEtFin[1];
        document.getElementById("duree").innerHTML = debutEtFin[4] || "";

        graphique_facteur_echelle(donnee, debutEtFin, age_univers);
        sessionStorage.setItem("abs", donnee[0]);
        sessionStorage.setItem("ord", donnee[1]);
        update_point();
        document.getElementById("loading").style.display = "none";
    }, 10); 
    
}

  