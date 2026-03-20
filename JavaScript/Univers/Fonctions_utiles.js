/*
Ce fichier javascript a pour but de rassembler toutes les fonctions qui sont utilisé dans les javascript
"calcul_facteur_echelle_xxx et calculette_xxx"
 */


// Variables globales, utilisées un peu partout
const AU = 149597870700; // en mètres

let T0 = Number(document.getElementById("T0").value);
let H0 = Number(document.getElementById("H0").value);
let c = Number(document.getElementById("c").value);
let h = Number(document.getElementById("h").value);
let G = Number(document.getElementById("G").value);
let k = Number(document.getElementById("k").value);


/**
 * Fonction permettant de récupérer le nombre de jours par ans en fonction du type d'année sélectionné
 * @return {number} Le nombre de jour par ans
 */
function nbrJours() {
    let typeAnnee = document.getElementById("typeAnnee").value
    switch (typeAnnee) {
        case 'Sidérale':
            return 365.256363051;
        case 'Julienne':
            return 365.25;
        case 'Tropique (2000)':
            return 365.242190517;
        default:
            return 365.2425;
    }
}

/**
 * Fonction permettant de convertir H0 des km / s / Mpc vers les s
 * @param H0 {number} H0 en kilomètre par seconde par Mégaparsec
 * @return {number} H0 en par secondes
 */
function H0_parSecondes(H0) {
    // Conversion des kilomètre en mètre
    let H0_convertis = H0 * 1000

    // Conversion des Mégaparsec en mètres
    H0_convertis = H0_convertis / ( (648000 / Math.PI ) * AU * 1000000)

    return H0_convertis
}

/**
 * Fonction permettant de convertir H0 des km / s / Mpc vers les Ga
 * @param H0 {number} H0 en kilomètre par seconde par Mégaparsec
 * @return {number} H0 en par GigaAnnées
 */
function H0_parAnnees(H0) {
    // Conversion des kilomètre en mètre
    let H0_convertis = H0 * 1000

    // Conversion des Mégaparsec en mètres
    H0_convertis = H0_convertis / ( (648000 / Math.PI ) * AU * 1000000)

    // Conversion des secondes en Années
    let nombreDeJours = nbrJours()
    let secondesParAns = nombreDeJours * 24 * 3600 
    H0_convertis = H0_convertis * secondesParAns

    return H0_convertis
}

/**
 * Fonction permettant de convertir H0 des km / s / Mpc vers les Ga
 * @param H0 {number} H0 en kilomètre par seconde par Mégaparsec
 * @return {number} H0 en par GigaAnnées
 */
function H0_parGAnnees(H0) {
    // Conversion des kilomètre en mètre
    let H0_convertis = H0 * 1000

    // Conversion des Mégaparsec en mètres
    H0_convertis = H0_convertis / ( (648000 / Math.PI ) * AU * 1000000)

    // Conversion des secondes en GAnnées
    let nombreDeJours = nbrJours()
    let secondesParAns = nombreDeJours * 24 * 3600 * Math.pow(10, 9)
    H0_convertis = H0_convertis * secondesParAns

    return H0_convertis
}


/**
 * Fonction permettant de calculer Oméga_r en fonction du décalage spectral
 * @param z {number} décalage spectral
 * @return {number} la valeur du oméga
 */
function Omega_r(z) {
    let H0 = Number(document.getElementById("H0").value);
    let c = Number(document.getElementById("c").value);
    let h = Number(document.getElementById("h").value);
    let G = Number(document.getElementById("G").value);
    let k = Number(document.getElementById("k").value);
    let rho_r
    let omega_r

    let T0 = Number(document.getElementById("T0").value);

    // Si z = 0 on renvoie le calcul direct de omega_r0 sinon on le calcule en fonction de omega_r0
    let sigma = ( 2 * Math.pow(Math.PI, 5) * Math.pow(k, 4) ) / ( 15 * Math.pow(h, 3) * Math.pow(c, 2) );
    if (z === 0) {
        rho_r = ( 4 * sigma * Math.pow(T0, 4) ) / Math.pow(c, 3)
        if (document.getElementById("optionsOmégar0").options[0].selected) {
            rho_r = rho_r * 1.6913
        }
        if (document.getElementById("optionsOmégar0").options[2].selected) {
            rho_r = 0
        }
        omega_r = ( 8 * Math.PI * G * rho_r) / ( 3 * Math.pow(H0_parSecondes(H0), 2) )
    }
    else {
        if (document.getElementById("Omégal0")){
            omega_r = ( Omega_r(0) * Math.pow(1 + z, 4) ) / fonction_E(z,true);
        }else{
            omega_r = ( Omega_r(0) * Math.pow(1 + z, 4) ) / fonction_F(z,true);
        }  
    }

    let option = document.getElementById("optionsMonofluide").value
    if ( option !== "optionNull" ) {
        if (option === "optionR") {
            omega_r = 1
        } else {
            omega_r = 0
        }
    }

    return omega_r
}


/**
 * Fonction permettant de calculer Oméga_m en fonction du décalage spectral
 * @param z {number} décalage spectral
 * @return {number} la valeur du oméga
 */
function Omega_m(z) {
    let omega_m;

    if (z === 0) {
        omega_m = Number(document.getElementById("Omégam0").value)
    }
    else {
        if (document.getElementById("Omégal0")){
            omega_m = Omega_m(0) * Math.pow(1 + z, 3) / fonction_E(z,true);
        }else{
            omega_m = Omega_m(0) * Math.pow(1 + z, 3) / fonction_F(z,true);
        }
    }

    let option = document.getElementById("optionsMonofluide").value
    if ( option !== "optionNull" ) {
        if (option === "optionM") {
            omega_m = 1
        } else {
            omega_m = 0
        }
    }

    return omega_m
}


/**
 * Fonction permettant de calculer Oméga_l en fonction du décalage spectral
 * @param z {number} décalage spectral
 * @return {number} la valeur du oméga
 */
function Omega_l(z) {
    let omega_l;

    if (z === 0) {
        omega_l = Number(document.getElementById("Omégal0").value)
    }
    else {
        omega_l = Omega_l(0) / fonction_E(z,true);
    }

    if (document.getElementById("OptionsOmégak0").checked) {
        omega_l = 1 - Omega_m(z) - Omega_r(z)
    }

    let option = document.getElementById("optionsMonofluide").value
    if ( option !== "optionNull" ) {
        if (option === "optionLDE") {
            omega_l = 1
        } else {
            omega_l = 0
        }
    }

    return omega_l
}


/**
 * Fonction permettant de calculer Oméga_DE en fonction du décalage spectral
 * @param z {number} décalage spectral
 * @return {number} la valeur du oméga
 */
function Omega_DE(z) {
    let omega_de;

    if (z === 0) {
        omega_de = Number(document.getElementById("OmégaDE0").value)
    }
    else {
        omega_de = Omega_DE(0) *  fonction_Y(1/(1+z)) / fonction_F(z,true);
    }

    if (document.getElementById("OptionsOmégak0").checked) {
        omega_de = 1 - Omega_m(z) - Omega_r(z)
    }

    let option = document.getElementById("optionsMonofluide").value
    if ( option !== "optionNull" ) {
        if (option === "optionLDE") {
            omega_de = 1
        } else {
            omega_de = 0
        }
    }

    return omega_de
}


/**
 * Fonction permettant de calculer Oméga_k en fonction du décalage spectral
 * @param z {number} décalage spectral
 * @return {number} la valeur du oméga
 */
function Omega_k(z) {
    let omega_k;

    if (document.getElementById("Omégal0")) {
        omega_k = 1 - Omega_r(z) - Omega_l(z) - Omega_m(z)
    }

    if (document.getElementById("OmégaDE0")) {
        omega_k = 1 - Omega_r(z) - Omega_DE(z) - Omega_m(z)
    }

    if (document.getElementById("OptionsOmégak0").checked) {
        omega_k = 0
    }

    let option = document.getElementById("optionsMonofluide").value
    if ( option !== "optionNull" ) {
        if (option === "optionK") {
            omega_k = 1
        } else {
            omega_k = 0
        }
    }

    return omega_k
}

/**
 * Fonction facilitant l'écriture des expression dans le cas du modlèle LCDM. On a fait la substitution u = 1 / (1 + x)
 * afin que les bornes d'intégrations soient finies
 * @param u {number} Paramètre de la fonction
 * @param z_utilise {Boolean} Pour choisir si le calcul se fait avec les a (false par defaut) ou z (true)
 * @return {number} Valeur de la fonction
 */
function fonction_E(u, z_utilise=false) {
    let Omegam0 = Omega_m(0);
    let Omegar0 = Omega_r(0);
    let Omegal0 = Omega_l(0);
    let terme_1;
    let terme_2;
    let terme_3;

    // On calcule les terme 1 à 1 par soucis de clareté
    if (z_utilise){
        terme_1 = Omegar0 * Math.pow(1+u, 4);
        terme_2 = Omegam0 * Math.pow(1+u, 3);
        terme_3 = (1 - Omegam0 - Omegal0 - Omegar0) * Math.pow(1+u, 2);
    }else{
        terme_1 = Omegar0 * Math.pow(u, -4);
        terme_2 = Omegam0 * Math.pow(u, -3);
        terme_3 = (1 - Omegam0 - Omegal0 - Omegar0) * Math.pow(u, -2);
    }
    return terme_1 + terme_2 + terme_3 + Omegal0;
}

/**
 * Première fonction facilitant l'écriture des expression dans le modèle DE.
 * Par défaut, w0 = -1, w1 = 0.
 * @param x {number} Paramètre de la fonction
 * @return {number} Valeur de la fonction
 */
function fonction_Y(x) {
    let w0 = Number(document.getElementById("w0").value) // sans unité
    let w1 = Number(document.getElementById("w1").value) // sans unité

    // On calcule les termes 1 à 1 par soucis de clareté
    let terme_1 = -3 * ( 1 + w0 + w1 ) * Math.log(x);
    let terme_2 = -3 * w1 * (1 - x)

    return Math.exp(terme_1 + terme_2)
}

/**
 * Dérivée analytique de la fonction Y(x). On aurait pu utiliser une approximation numérique mais
 * ça aurait été moins précis
 * @param x {number} Paramètre de la fonction
 * @return {number} Valeur de la fonction
 */
function derivee_fonction_Y(x) {
    let w0 = Number(document.getElementById("w0").value) // sans unité
    let w1 = Number(document.getElementById("w1").value) // sans unité

    let terme_1 = - 3 * (1 + w0 + w1) * (1 / x)
    let terme_2 = 3 * w1
    return ( terme_1 + terme_2 ) * fonction_Y(x)
}

/**
 * Deuxième fonction facilitant l'écriture des expression dans le cas du modlèle DE. On a fait la substitution u = 1 / (1 + x)
 * @param u {number} Paramètre de la fonction
 * @param z_utilise {Boolean} Pour choisir si le calcul se fait avec les a (false par defaut) ou z (true)
 * @return {number} Valeur de la fonction
 */
function fonction_F(u,z_utilise) {
    let Omegak0 = Omega_k(0)
    let Omegam0 = Omega_m(0)
    let Omegar0 = Omega_r(0)
    let OmegaDE0 = Omega_DE(0)
    let terme_1;
    let terme_2;
    let terme_3;
    let terme_4;

    if (z_utilise){
        terme_1 = Omegak0 * Math.pow(1+u, 2)
        terme_2 = Omegam0 * Math.pow(1+u, 3)
        terme_3 = Omegar0 * Math.pow(1+u, 4)
        terme_4 = OmegaDE0 * fonction_Y(Math.pow(1+u, -1))
    }else{
        terme_1 = Omegak0 * Math.pow(u, -2)
        terme_2 = Omegam0 * Math.pow(u, -3)
        terme_3 = Omegar0 * Math.pow(u, -4)
        terme_4 = OmegaDE0 * fonction_Y(u)
    }
    return terme_1 + terme_2 + terme_3 + terme_4
}

/**
 * Première équation caractéristique du facteur d'échelle. La dérivée première de a à un temps t. Dans le cas LCDM
 * @param a {number} La valeur de a au temps indiqué
 * @param t {number} La valeur du temps
 * @returns {number} La valeur de la dérivée de a en ce temps
 */
function equa_diff_1_LCDM(t, a) {
    let Omegak0 = Omega_k(0)
    let Omegam0 = Omega_m(0)
    let Omegar0 = Omega_r(0)
    let Omegal0 = Omega_l(0)

    let a_carre = a * a;
    let terme_1 = (Omegar0 / a_carre)
    let terme_2 = (Omegam0 / a)
    let terme_3 = Omegal0 * a_carre

    return Math.sqrt(terme_1 + terme_2 + terme_3 + Omegak0);
}

/**
 * Deuxième équation caractéristique du facteur d'échelle. La dérivée seconde de a à un temps t. Dans le cas LCDM
 * @param a {number} La valeur de a au temps indiqué
 * @param ap {number} La valeur de la dérivée de a au temps indiqué
 * @param t {number} La valeur du temps
 * @returns {number} La valeur de la dérivée seconde de a en ce temps
 */
function equa_diff_2_LCDM(t, a, ap) {
       let Omegam0 = Omega_m(0)
    let Omegar0 = Omega_r(0)
    let Omegal0 = Omega_l(0)

    let a_carre = a * a;
    let a_cube = a * a * a;

    let terme_1 = - (Omegar0 / a_cube)
    let terme_2 = - 0.5 * (Omegam0 / a_carre)
    let terme_3 = Omegal0 * a;

    return terme_1 + terme_2 + terme_3;
}

/**
 * Première équation caractéristique du facteur d'échelle dans le cas DE.
 * C'est la dérivée première de a à un temps t
 * @param a {number} La valeur de a au temps indiqué
 * @param t {number} La valeur du temps
 * Ne doit dépendre que d'un paramètre
 * @returns {number} La valeur de la dérivée de a en ce temps
 */
function equa_diff_1_DE(t, a) {
    let Omegak0 = Omega_k(0)
    let Omegam0 = Omega_m(0)
    let Omegar0 = Omega_r(0)
    let OmegaDE0 = Omega_DE(0)

    let a_carre = a * a

    let terme_1 = Omegar0 / a_carre
    let terme_2 = Omegam0 / a
    let terme_3 = OmegaDE0 * a_carre * fonction_Y(a)

    return Math.sqrt(terme_1 + terme_2 + terme_3 + Omegak0)
}

/**
 * Deuxième équation caractéristique du facteur d'échelle dans le cas DE.
 * C'est la dérivée seconde de a à un temps t
 * @param a {number} La valeur de a au temps indiqué
 * @param ap {number} La valeur de la dérivée de a au temps indiqué
 * @param t {number} La valeur du temps
 * @returns {number} La valeur de la dérivée seconde de a en ce temps
 */
function equa_diff_2_DE(t, a, ap) {
    let Omegam0 = Omega_m(0)
    let Omegar0 = Omega_r(0)
    let OmegaDE0 = Omega_DE(0)


    let a_carre = a * a
    let a_cube = a * a * a
    let terme_1 = - (Omegar0 / a_cube)
    let terme_2 = - 0.5 * (Omegam0 / a_carre)
    let terme_3 = OmegaDE0 * (a * fonction_Y(a) + 0.5 * a_carre * derivee_fonction_Y(a))

    return terme_1 + terme_2 + terme_3
}

/**
 * Fonction permettant de déterminer si l'univers à un début ou une fin. Si ce n'est pas le cas, renvoie un string
 * précisant pourquoi il n'y a pas de début/fin de l'univers
 * @param equa_diff {function} Fonction caractéristique de l'EDO2 du modèle
 * @return Soit les temps de naissance/mort soit un string explicant pourquoi il n'y a pas de naissance/mort
 */
function debut_fin_univers(equa_diff,pas=1e-3,nb_max=1e4) {
    let texte = o_recupereJson()
    pas = bornes_temps_CI()[3]
    let H0 = Number(document.getElementById("H0").value);
    pas = pas*Math.sign(H0)
    // Déclaration des variables et des valeurs retournés
    let set_solution = [0, 1 ,1]
    let save_set_solution;
    let nombre_point = 0
    let option = document.getElementById("optionsMonofluide").value
    let naissance_univers;
    let mort_univers;
    let age_debut;
    let age_fin;
    let duree_univers;
    let boolDebut;
    let boolFin;


    // Recherche a = 0 ou da/dtau = Infinity dans le sens négatif
    while (set_solution[1] >= 0 && (Math.abs(set_solution[1]) < +Infinity) && (Math.abs(set_solution[2]) < +Infinity) && nombre_point <= nb_max) {
        save_set_solution = set_solution
        set_solution = RungeKuttaEDO2(-pas, set_solution[0], set_solution[1], set_solution[2], equa_diff)
        nombre_point = nombre_point + 1
    }
    naissance_univers = texte.univers.pasDebut
    age_debut = 0

    // Debug bien pratique
    // console.log(set_solution," : ",save_set_solution)
    // RungeKuttaEDO2(-pas*0.1, save_set_solution[0], save_set_solution[1], save_set_solution[2], equa_diff,true)

    if (option != "optionLDE") {
        if (set_solution[1] <= 0 || (set_solution[2]>= +Infinity) || (isNaN(set_solution[1]) && save_set_solution[2]*Math.sign(H0)>0)) {
            if (isNaN(set_solution[1])) {
                set_solution = save_set_solution
            }
            age_debut = set_solution[0] / H0_parGAnnees(H0)
            boolDebut = true
            naissance_univers = texte.univers.Debut + "BigBang " + Math.abs(age_debut).toExponential(2) + " Ga = "
                + gigaannee_vers_seconde(Math.abs(age_debut)).toExponential(2) + " s"
        }else if((set_solution[1]>= +Infinity) || (set_solution[2]<= -Infinity) || (isNaN(set_solution[1]) && save_set_solution[2]*Math.sign(H0)<0)) {
            if (isNaN(set_solution[1])) {
                set_solution = save_set_solution
            }
            age_debut = set_solution[0] / H0_parGAnnees(H0)
            boolDebut = true
            naissance_univers = texte.univers.Debut + "BigFall " + Math.abs(age_debut).toExponential(2) + " Ga = "
                + gigaannee_vers_seconde(Math.abs(age_debut)).toExponential(2) + " s"
        }
    }
    // On réinitialise
    set_solution = [0, 1, 1];
    nombre_point = 0;

    // Recherche a = 0 / da/dtau = Infinity dans le sens positif
    while (set_solution[1] >= 0 && (Math.abs(set_solution[1]) < +Infinity) && (Math.abs(set_solution[2]) < +Infinity) && nombre_point <= nb_max) {
        save_set_solution = set_solution
        set_solution = RungeKuttaEDO2(pas, set_solution[0], set_solution[1], set_solution[2], equa_diff)
        nombre_point = nombre_point + 1
    }
    // Debug bien pratique
    // console.log(set_solution," : ",save_set_solution)

    mort_univers = texte.univers.pasMort
    if ( option != "optionLDE") {
        if (set_solution[1] <= 0 || (set_solution[2]<= -Infinity) || (isNaN(set_solution[1]) && save_set_solution[2]*Math.sign(H0)<0)) {
            if (isNaN(set_solution[1])) {
                set_solution = save_set_solution
            }
            age_fin = set_solution[0] / H0_parGAnnees(H0)
            boolFin = true
            mort_univers = texte.univers.Mort + "BigCrunch " + Math.abs(age_fin).toExponential(2) + " Ga = "
                + gigaannee_vers_seconde(Math.abs(age_fin)).toExponential(2) + " s"
        } else if((set_solution[1]>= +Infinity) || (set_solution[2]>= +Infinity) || (isNaN(set_solution[1]) && save_set_solution[2]*Math.sign(H0)>0)) {
            if (isNaN(set_solution[1])) {
                set_solution = save_set_solution
            }
            age_fin = set_solution[0] / H0_parGAnnees(H0)
            boolFin = true
            mort_univers = texte.univers.Mort + "BigRip " + Math.abs(age_fin).toExponential(2) + " Ga = "
                + gigaannee_vers_seconde(Math.abs(age_fin)).toExponential(2) + " s"
        }
    }

    if (boolDebut && boolFin) {
        let duree = Math.abs(age_fin) + Math.abs(age_debut)
        duree_univers = texte.univers.Duree + duree.toExponential(2) + " Ga = "
            + gigaannee_vers_seconde(duree).toExponential(2) + " s"
    } else {
        duree_univers = false
    }
    return [naissance_univers, mort_univers, age_debut, age_fin, duree_univers,boolDebut,boolFin]
}

/**
 * Fonction permettant de transformer les taux en temps
 * @param listeTaus {[number]} Liste des taux sous forme de nombre
 * @param t_debut {number} age de naissance de l'univers
 * @return La liste des temps
 */
function tauEnTemps(listeTaus, t_debut) {
    let H0 = Number(document.getElementById("H0").value);
    let H0parGAnnee = H0_parGAnnees(H0);

    for (let index = 0; index < listeTaus.length; index = index + 1) {
        listeTaus[index] = listeTaus[index] / H0parGAnnee

        if (t_debut) {
            listeTaus[index] = listeTaus[index] - t_debut
        }
    }

    return listeTaus
}

/**
 * Fonction permettant de calculer l'âge de l'univers
 * @param fonction {function} La fonction qui permet de simplifier l'écriture des relations,
 * ne doit dépendre que d'une variable
 * @param H0 {number} taux d'expansion actuel
 * @param a1 {number}
 * @param a2 {number} borne sup
 * @param z_utilise {boolean} permet de savoir si on intègre avec ou sans le changement de variable
 * @return {number} âge de l'univers.
 */
function calcul_ages(fonction, H0, a1, a2,z_utilise=false) {
    function integrande(u) {
        if (z_utilise){
            let terme_1 = Math.pow((1+u), -1)
            let terme_2 = Math.pow(fonction(u,true),-0.5)

            return terme_1 * terme_2 ;
        } else {
            let terme_1 = Math.pow(u, -1)
            let terme_2 = Math.sqrt(fonction(u))

            return terme_1 * Math.pow(terme_2 , -1);
        }
    }

    return (1 / H0) * simpson_composite(integrande, a1, a2, 100);
}

/** renvoie la fonction Sk pour calculer les distances cosmologiques en fontion de la courbure de l'espace
 * (Univers, simple, DarkEnergy et monofluide)
 * @param {*} x Paramètre d'entrée
 * @param {*} OmegaK paramètre de densité de courbure
 * @returns
 */
function Sk(x,OmegaK){
    if (OmegaK>0) { //si k=-1 alors omegaK positif
        return Math.sinh(x);
    }else if(OmegaK<0){//si k=1 alors omegaK négatif
        return Math.sin(x);
    }else{//si k=0 alors omegaK est nul
        return x;
    }
}

/** renvoie la distance métrique entre un photon émis avec un Zemission et recu a une coordonné r avec un Zreception \
 * pour avoir la distance d'un objet observé avec un certain décalge Zemission=0 \
 * pour avoir l'horizon cosmologique des particules Zreception=infini \
 * pour avoir l'horizon cosmologique des évenement Zemission=-1 (dans le futur) \
 * (Univers,simple) \
 * Si les omega et H0 sont définis dans la page pas besoin de les mettre en paramètre : DistanceMetrique(Zemission,Zreception)
 * @param {*} fonction fonction_E ou fonction_F en fonction de si c'est lcdm ou de
 * @param {*} Zemission décalage spectral au moment ou le photon est émis
 * @param {*} Zreception décalage spectral au moment ou le photon est reçu
 * @param {*} z_utilise permet de savoir si on utilise ou non le changement de variable pour l'intégrale
 * @param precision_nb_pas {number} détermine la précision de calcul
 * @returns
 */
function DistanceMetrique(fonction, Zemission, Zreception, z_utilise=false, precision_nb_pas=1e3){
    let H0 = Number(document.getElementById("H0").value);
    let c = Number(document.getElementById("c").value);

    function fonction_a_integrer(x) {
        if (z_utilise){
            return Math.pow(fonction(x,true),-0.5);
        } else {
            return Math.pow(fonction(x),-0.5)/Math.pow(x,2);
        }
    }

    if (Omega_k(0) ===0){
        return c/(H0_parSecondes(H0))*simpson_composite(fonction_a_integrer,Zemission,Zreception,precision_nb_pas);
    }else {
        return c/(H0_parSecondes(H0)*Math.pow(Math.abs(Omega_k(0)),0.5))*Sk(Math.pow(Math.abs(Omega_k(0)),0.5)*simpson_composite(fonction_a_integrer,Zemission,Zreception,precision_nb_pas),Omega_k(0));
    }
}

/**
 * Fonction qui renvoie la distance de l'horizon des particules cosmologiques (plus grande distance a laquelle on peut recevoir un signal emis à l'instant t)
 * @param fonction {function} fonction utilisée pour le calcul
 * @param {number} z_emission par defaut = 0 décalage spectral du moment où le signal est émis
 * @returns
 */
function calcul_horizon_particule(fonction, z_emission=0){
    let a_emission=1/(z_emission+1);
    //formule 21 dans la théorie du 20/05/2024
    return DistanceMetrique(fonction,1e-50,a_emission,false,1e3);
}

/**
 * Fonction qui renvoie la distance de l'horizon des évenements cosmologiques (plus grande distance a laquelle on peut envoyer un signal emis à l'instant t)
 * @param fonction {function} fonction utilisée pour le calcul
 * @param {*} z_reception par defaut = 0 décalage spectral du moment où le signal est reçu
 * @returns
 */
function calcul_horizon_evenements(fonction,z_reception=0){
    //formule 23 dans la théorie du 20/05/2024
    return DistanceMetrique(fonction,-.99999999999,z_reception,true,1e3);
}

/**
 * Inverse du calcul de l'age en fonction d'un z grâce a la fonction dichotomie (marche seulement pour des fonction absolument croissante)
 * @param {number} temps valeur t
 * @param {function} fonction fonction à rechercher
 * @param H0 {number} taux d'expansion actuel de l'univers
 * @param precision {number} présicion du calcul
 * @param iterationsmax {number} nombre d'itération avant l'rrêt du calcul
 * @returns valeur de z
 */
function calcul_t_inverse(temps,fonction,H0,precision=1e-30,iterationsmax=100){
	function a_dichotomer(x){
		return calcul_ages(fonction,H0,1e-20,x);
	}
	let age_univers = a_dichotomer(1);

    let a_t
	if (age_univers>=temps){
		a_t=Dichotomie(a_dichotomer,temps,1e-15,1,1e-30,iterationsmax);
	}else{
		a_t=Dichotomie(a_dichotomer,temps,1,1e20,1e-30,iterationsmax);
	}
	return (1-a_t)/a_t;
}

/**
     * Fonction qui permet de :
     *      - Redéfinir les conditions initiales
     *      - Calcule l'intervale de temps de résolution et en déduis un pas raisonnable
     */
function bornes_temps_CI() {
    // if (document.getElementById("Omega_l")) {
    let H0 = document.getElementById("H0").value;
    let H0parGAnnee = H0_parGAnnees(H0)
    
    //on recupere les valeurs des variables
    let a_min = 0
    let a_max = 5
    if (document.getElementById("a_min")) {
        a_min = Number(document.getElementById("a_min").value);
        a_max = Number(document.getElementById("a_max").value);
    }
    if(document.getElementById("Omégal0")) {
        fonction_simplifiant = fonction_E
    } else {
        fonction_simplifiant = fonction_F
    }
    let pas;
    let tau_init = 0;
    let a_init = 1;
    let ap_init = 1;

    let t_0 = calcul_ages(fonction_simplifiant, H0parGAnnee, 1e-10, 1)

    let t_min = calcul_ages(fonction_simplifiant, H0parGAnnee, 1e-10, a_min)
    let tau_min = H0parGAnnee * (t_min - t_0)

    let t_max = calcul_ages(fonction_simplifiant, H0parGAnnee, 1e-10, a_max)
    let tau_max = H0parGAnnee * (t_max - t_0)

    if (a_min > 1 && !isNaN(tau_min)) {
        tau_init = tau_min
        a_init = a_min
        ap_init = equa_diff_1(tau_min, a_init)
    }

    if (a_max < 1 && !isNaN(tau_max)) {
        tau_init = tau_max
        a_init = a_max
        ap_init = equa_diff_1(tau_max, a_init)
    }

    // On calcule le pas qui sera utilisé

    let universInconnu = true
    if ( (isNaN(tau_min) || isNaN(tau_max)) && !isNaN(t_0)) {
        pas = Math.abs(t_0) * 1e-3
        universInconnu = false
    } else {
        pas = 1e-3
    }

    let option = document.getElementById("optionsMonofluide").value
    if (!isNaN(tau_min) && !isNaN(tau_max) && option === "optionNull") {
        pas = Math.abs(tau_max - tau_min) * 1e-3
        universInconnu = false
    }
    if (document.getElementById("Omégal0")) {
    if (document.getElementById("Omégam0").value == 0 && document.getElementById("Omégal0").value == 1 && document.getElementById("Omégar0").value == 0 && document.getElementById("Omégak0").value == 0) {
        pas = 1e-3
    }}

    if (universInconnu && option === "optionNull") {
        if (a_min > 1) {a_min = 1}
        if (a_max < 1) {a_max = 1}
    }
    return [tau_init, a_init, ap_init, pas]
    // } else {
    //     let pas;
    //     let tau_init = 0;
    //     let a_init = 1;
    //     let ap_init = 1;

    //     let t_0 = calcul_ages(fonction_simplifiant_1, H0parGAnnee, 1e-10, 1)

    //     let t_min = calcul_ages(fonction_simplifiant_1, H0parGAnnee, 1e-10, a_min)
    //     let tau_min = H0parGAnnee * (t_min - t_0)

    //     let t_max = calcul_ages(fonction_simplifiant_1, H0parGAnnee, 1e-10, a_max)
    //     let tau_max = H0parGAnnee * (t_max - t_0)


    //     if (a_min > 1 && !isNaN(tau_min)) {
    //         tau_init = tau_min
    //         a_init = a_min
    //         ap_init = equa_diff_1(tau_min, a_init)
    //     }

    //     if (a_max < 1 && !isNaN(tau_max)) {
    //         tau_init = tau_max
    //         a_init = a_max
    //         ap_init = equa_diff_1(tau_max, a_init)
    //     }

    //     // On calcule le pas qui sera utilisé
    //     let universInconnu = true
    //     if ( (isNaN(tau_min) || isNaN(tau_max)) && !isNaN(t_0) ) {
    //         pas = Math.abs(t_0) * 1e-3
    //         universInconnu = false
    //     } else {
    //         pas = 1e-3
    //     }

    //     let option = document.getElementById("optionsMonofluide").value
    //     if (!isNaN(tau_min) && !isNaN(tau_max) && option === "optionNull") {
    //         pas = Math.abs(tau_max - tau_min) * 1e-3
    //         universInconnu = false
    //     }

    //     if (universInconnu && option === "optionNull") {
    //         if (a_min > 1) {a_min = 1}
    //         if (a_max < 1) {a_max = 1}
    //     }


        // return [tau_init, a_init, ap_init, pas]
    }

/**
 * Fonction permettant de tracer le facteur d'échelle en fonction du temps.
 * @param solution {[number[], number[]]} Liste contenant la liste des temps et les valeurs du facteur d'échelle
 * @param debutEtFin
 * @param t_0 {number} age actuel de l'univers
 */
function graphique_facteur_echelle(solution,debutEtFin , t_0) {
    let texte = o_recupereJson()
    let a_min = Number(document.getElementById("a_min").value)
    let a_max = Number(document.getElementById("a_max").value)

    let H0 = Number(document.getElementById("H0").value);
    let abscisse = solution[0];
    let ordonnee = solution[1];
    if (H0 < 0) {
        abscisse.reverse()
        ordonnee.reverse()
    }
    let naissance = debutEtFin[0]
    let mort = debutEtFin[1]
    let t_debut = debutEtFin[2]
    let t_fin = debutEtFin[3]

    let temps_debut = abscisse[0]
    let facteur_debut = ordonnee[0]
    let temps_fin = abscisse[abscisse.length - 1]
    let facteur_fin = ordonnee[ordonnee.length - 1]

    let max = ordonnee.reduce((a, b) => Math.max(a, b), -Infinity);
    let min = ordonnee.reduce((a, b) => Math.min(a, b), +Infinity);

    // On corrige l'erreur numérique provoquée par la dérivée infinie en a=0
    if (t_0 > 0 && a_min === 0) {
        for (let index = 0; index < abscisse.length; index = index + 1) {
            abscisse[index] = abscisse[index] - temps_debut
        }
    }

    if ( t_debut && facteur_debut < Math.abs(max - min) * 1e-1 && a_min === 0) {
        abscisse[0] = 0
        ordonnee[0] = 0
    }

    if ( t_fin && facteur_fin < Math.abs(max - min) * 1e-1 && a_min === 0) {
        ordonnee[ordonnee.length - 1] = 0
    }

    let donnee = [{
        x: abscisse,
        y: ordonnee,
        type: "scatter",
        mode: "lines",
        name: "a(t)",
        line: { color: 'purple' }
    }];
    let x_min = abscisse[0];
    let x_max = abscisse[abscisse.length-1];
    const BigFallRegEx = /BigFall/;
    if (BigFallRegEx.test(naissance)) {
        x_min = 0
        donnee.push({
            type: 'line',
            x:[0, 0],
            y:[-1, max*2],
            line: {
                color: "black",
                simplify: false,
                shape: 'linear',
                dash: 'dash'
            },
        });
    }
    const BigRipRegEx = /BigRip/;
    let x_assymptote;
    if (BigRipRegEx.test(mort)) {
        if (t_fin && t_debut) {
            x_assymptote = Math.abs(Math.abs(t_fin) + Math.abs(t_debut))
        } else {
            x_assymptote = t_fin
        }
        x_max = x_assymptote
        donnee.push({
            type: 'line',
            x:[x_assymptote, x_assymptote],
            y:[-1, max*2],
            line: {
                color: "black",
                simplify: false,
                shape: 'linear',
                dash: 'dash',
            },
        });
    }
    let ticks = [0]
    let step = a_max/6
    if (a_max <= 10) {
    ticks = [0,1]
    donnee.push({
        type:'line',
        x:[x_min-(x_max-x_min),x_max+(x_max-x_min)],
        y:[1,1],
        line: {
            color:"black",
            simplify:"true",
            width: 1,
        }
    })
    if (a_max/6 < 0.02) {
        step = 0.02
    } else if (a_max/6 < 0.2) {
        step = 0.2
    } else {
        step = 1
    }} else { 
    step = parseFloat(step.toExponential(0))
    }
    let a = step
    while (a < a_max) {
        ticks.push(a),
        a = a+step
    }
    let apparence = {
        xaxis: {
            title: texte.univers.axeX,
            gridcolor: "#b1b1b1",
            zerolinewidth: 2,
            zeroline: true,
            range:[x_min-0.1*(x_max-x_min),x_max+0.1*(x_max-x_min)]
        },
        yaxis: {
            title: texte.univers.axeY,
            gridcolor: "#b1b1b1",
            zerolinewidth: 2,
            zeroline: true,
            range:[-0.1,max],
            tickmode: "array",
            tickvals: ticks,
        },
        showlegend: false,

        autosize: true,
        margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 50,
            pad: 4
        },
        plot_bgcolor: "rgb(255,255,255)",
        paper_bgcolor: "rgb(255,255,255)"
    };

    let configuration = {
        responsive: true
    };

    if (document.getElementById("graphique_LCDM")) {
        Plotly.newPlot("graphique_LCDM", donnee, apparence, configuration);
    }

    if (document.getElementById("graphique_DE")) {
        Plotly.newPlot("graphique_DE", donnee, apparence, configuration);
    }

    
    updateUnivers()
}


