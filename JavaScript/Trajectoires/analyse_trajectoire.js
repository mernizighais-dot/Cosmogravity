function resultatTrajectoires(fonction_EouF, is_t, distanceOuOmegaOuTemps) { 
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