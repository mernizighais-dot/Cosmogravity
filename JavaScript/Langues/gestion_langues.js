const PATH_JSON_FR = "./JavaScript/Langues/fr.json";
const PATH_JSON_EN = "./JavaScript/Langues/en.json";

const PATH_UNIV_THEORIE_FR = "./Fichiers/Théorie/theorie_univers_FR.pdf";
const PATH_UNIV_THEORIE_EN = "./Fichiers/Théorie/theorie_univers_EN.pdf";

const PATH_TRAJ_THEO_FR = "./Fichiers/Théorie/theorie_trajectoires_FR.pdf";
const PATH_TRAJ_THEO_EN = "./Fichiers/Théorie/theorie_trajectoires_EN.pdf";

const PATH_UNIV_TUTO_FR = "./Fichiers/Tutoriels/Tuto-Univ-FR.pdf";
const PATH_UNIV_TUTO_EN = "./Fichiers/Tutoriels/Tuto-Univ-EN.pdf";

const PATH_TRAJ_TUTO_FR = "./Fichiers/Tutoriels/Tuto-Traj-FR.pdf";
const PATH_TRAJ_TUTO_EN = "./Fichiers/Tutoriels/Tuto-Traj-EN.pdf";


/**
 * Fonction qui rafraîchi la page
 */
function rafraichirPage() {
    document.location.reload();
}

/**
 * Fonction qui permet de choisir la langue FR et de la stocker localement dans un item nommé LANGUE
 */
function choixLangueFr() {
    var langue = "fr";
    sessionStorage.setItem("LANGUE", langue);
}

/**
 * Fonction qui permet de choisir la langue EN et de la stocker localement dans un item nommé LANGUE
 */
function choixLangueEn() {
    var langue = "en";
    sessionStorage.setItem("LANGUE", langue);
}

/**
 * Fonction qui permet de vérifier la langue choisie et renvoie le fichier JSON correspondant
 * @return {string} Chemin du fichier JSON
 */
function s_testLangueJson() {
    if (sessionStorage.getItem("LANGUE")) {
        var langue = sessionStorage.getItem("LANGUE");
        if (langue === "fr") {
            return PATH_JSON_FR;
        } else {
            return PATH_JSON_EN;
        }
    } else {
        // recupere la langue du navigateur par defaut
        var userLang = navigator.language || navigator.userLanguage;
        if (userLang === "fr" || userLang === "fr-FR" || userLang === "fr-fr") {
            userLang === "fr";
            return PATH_JSON_FR;
        } else {
            userLang === "en"
            return PATH_JSON_EN;
        }
        sessionStorage.setItem("LANGUE", userLang);
    }
}

/**
 * Fonction qui permet de vérifier la langue choisie et renvoie l'accronyme correspondant
 * @return {string} fr pour français et en pour anglais
 */
function s_testLangue() {
    var langue;
    if (sessionStorage.getItem("LANGUE")) {
        langue = sessionStorage.getItem("LANGUE");
        return langue;
    } else {
        langue = navigator.language || navigator.userLanguage;
        if (langue === "fr" || langue === "fr-FR" || langue === "fr-fr"){
            langue="fr";
        }
        else{
            langue="en";
        }
        sessionStorage.setItem("LANGUE", langue);
        return langue;
    }
}

/**
 * Fonction permettant d'avoir la bonne langue pour la page de tutoriel Univers
 */
function langageTutorielUnivers() {
    if (s_testLangue() === "fr") {
        window.open(PATH_UNIV_TUTO_FR, "_blank");
    } else if (s_testLangue() === "en") {
        window.open(PATH_UNIV_TUTO_EN, "_blank");
    }
}

/**
 * Fonction permettant d'avoir la bonne langue pour la page de tutoriel Trajectoire
 */
function langageTutorielTrajectoires() {
    if (s_testLangue() === "fr") {
        window.open(PATH_TRAJ_TUTO_FR, "_blank");
    } else if (s_testLangue() === "en") {
        window.open(PATH_TRAJ_TUTO_EN, "_blank");
    }
}


/**
 * Fonction permettant d'avoir la bonne langue pour la page de théorie Univers
 */
function langageTheorieUnivers() {
    if (s_testLangue() === "fr") {
        window.open(PATH_UNIV_THEORIE_FR, "_blank");
    } else if (s_testLangue() === "en") {
        window.open(PATH_UNIV_THEORIE_EN, "_blank");
    }
}

/**
 * Fonction permettant d'avoir la bonne langue pour la page de théorie Trajectoire
 */
function langageTheorieTrajectoire() {
    if (s_testLangue() === "fr") {
        window.open(PATH_TRAJ_THEO_FR, "_blank");
    } else if (s_testLangue() === "en") {
        window.open(PATH_TRAJ_THEO_EN, "_blank");
    }
}


/**
 * Fonction qui permet de récupérer le json correspondant à la langue choisie
 * @return {*} Json
 */
function o_recupereJson() {
    var req = new XMLHttpRequest();
    var texte;
    req.open("GET", s_testLangueJson(), false);
    req.onreadystatechange = function() {
        if (req.readyState === 4 && req.status === 200) {
            texte = JSON.parse(req.responseText);
        }
    };
    req.overrideMimeType('application/json');
    req.send();
    return texte;
}

// Fonctions chargeant le texte pour chaque page

function texte_navigation() {
    let isHome = sessionStorage.getItem("isHome")
    let size
    if (isHome == "True") {
        size = "1.5rem";
        const items = document.getElementsByClassName("item");
        for (let i = 0; i < items.length; i++) {
            items[i].style.animation = "blinker 1s alternate infinite";
        }
        document.getElementById("nav").style.background = "linear-gradient(90deg, rgba(121, 20, 123, 0.7), rgba(39, 121, 124, 0.7))"
    } else {
        size= "1.2rem";
        const items = document.getElementsByClassName("item");
            for (let i = 0; i < items.length; i++) {
        items[i].style.animation = "none";
    }
    }

    document.getElementById("nav").style.fontSize = size
    document.getElementById("txt-théorieTrajectoire").style.fontSize = size
    document.getElementById("txt-tutoTrajectoire").style.fontSize = size
    document.getElementById("txt-théorieUnivers").style.fontSize = size
    document.getElementById("txt-tutoUnivers").style.fontSize = size
    document.getElementById("LangueFr").style.fontSize = size
    document.getElementById("LangueEn").style.fontSize = size
    let texte = o_recupereJson();
    document.getElementById("txt-acceuil").innerHTML = texte.nav.acceuil
    document.getElementById("txt-univers").insertAdjacentHTML("beforeend", texte.nav.univers)
    document.getElementById("txt-théorieUnivers").insertAdjacentHTML("beforeend", texte.nav.theorie)
    document.getElementById("txt-théorieTrajectoire").insertAdjacentHTML("beforeend", texte.nav.theorie)
    document.getElementById("txt-tutoUnivers").insertAdjacentHTML("beforeend", texte.nav.tutoriel)
    document.getElementById("txt-tutoTrajectoire").insertAdjacentHTML("beforeend", texte.nav.tutoriel)
    document.getElementById("txt-simulationUnivers").insertAdjacentHTML("beforeend", texte.nav.simulation)
    document.getElementById("txt-simulationTrajectoire").insertAdjacentHTML("beforeend", texte.nav.simulation)
    document.getElementById("txt-modeleLCDM").insertAdjacentHTML("beforeend", texte.nav.modeleLCDM)
    document.getElementById("txt-modeleDE").insertAdjacentHTML("beforeend", texte.nav.modeleDE)
    document.getElementById("txt-trajectoire").insertAdjacentHTML("beforeend", texte.nav.trajectoire)
    document.getElementById("txt-metriqueSCH").insertAdjacentHTML("beforeend", texte.nav.SCH)
    document.getElementById("txt-metriqueK").insertAdjacentHTML("beforeend", texte.nav.K)
    document.getElementById("txt-BBSCH").insertAdjacentHTML("beforeend", texte.nav.BBSCH)
    document.getElementById("txt-BPSCH").insertAdjacentHTML("beforeend", texte.nav.BPSCH)
    document.getElementById("txt-nBnBSCH").insertAdjacentHTML("beforeend", texte.nav.nBnBSCH)
    document.getElementById("txt-nBPSCH").insertAdjacentHTML("beforeend", texte.nav.nBPSCH)
    document.getElementById("txt-BK").insertAdjacentHTML("beforeend", texte.nav.BK)
    document.getElementById("txt-PK").insertAdjacentHTML("beforeend", texte.nav.PK)
    document.getElementById("txt-langue").insertAdjacentHTML("beforeend", texte.nav.langue)
    document.getElementById("txt-propos").insertAdjacentHTML("beforeend", texte.nav.propos)
    document.getElementById("txt-LUPM").insertAdjacentHTML("beforeend", texte.nav.LUPM)
}


function text_page_index() {
    let texte = o_recupereJson();

    document.getElementById("Univers").innerHTML = texte.nav.univers;
    document.getElementById("txtUnivers").innerHTML = texte.index.txtUnivers;
    document.getElementById("Trajectoires").innerHTML = texte.nav.trajectoire;
    document.getElementById("txtTrajectoires").innerHTML = texte.index.txtTrajectoires;
    document.getElementById("version").innerHTML = texte.index.version;
}

function texte_univers_LCDM() {
    let texte = o_recupereJson();
    document.querySelectorAll(".unite_al").forEach(function(i){i.innerHTML=texte.calculette.unitéanneelumiere});
    document.getElementById("Entrées").innerHTML = texte.univers.Entrées;
    document.getElementById("constantesUniverselles").innerHTML = texte.univers.constantes
    document.getElementById("calculetteCosmologique").innerHTML = texte.univers.calculette
    document.getElementById("infoT0").title = texte.univers.infoT0
    document.getElementById("infoH0").title = texte.univers.infoH0
    document.getElementById("infoTypeUnivers").title = texte.univers.infoTypeUnivers
    document.getElementById("Monofluide_optionNull").innerHTML = texte.univers.monofluide_null
    document.getElementById("Monofluide_optionM").innerHTML = texte.univers.monofluide_M
    document.getElementById("Monofluide_optionR").innerHTML = texte.univers.monofluide_R
    document.getElementById("Monofluide_optionLDE").innerHTML = texte.univers.monofluide_L
    document.getElementById("Monofluide_optionK").innerHTML = texte.univers.monofluide_K
    document.getElementById("infoOmégam0").title = texte.univers.infoOmégam0
    document.getElementById("infoOmégaLDE0").title = texte.univers.infoOmégaL0
    document.getElementById("label_optionsOmégar0").insertAdjacentHTML("beforeend", texte.univers.label_Omégar0)
    document.getElementById("infoOmégaR0").title = texte.univers.infoOmégaR0
    document.getElementById("Omégar0_optionRFC_et_Neutrinos").innerHTML = texte.univers.Omégar0_RFC_et_Neutrinos
    document.getElementById("Omégar0_optionRFC").innerHTML = texte.univers.Omégar0_RFC
    document.getElementById("Omégar0_optionRien").innerHTML = texte.univers.Omégar0_Rien
    document.getElementById("infoOmégaK0").title = texte.univers.infoOmégaK0
    document.getElementById("label_optionsOmégak0").insertAdjacentHTML("beforeend", texte.univers.label_Omégak0)
    document.getElementById("selecParam").innerHTML = texte.univers.selecParam

    document.getElementById("Tracé").innerHTML = texte.univers.Tracé;
    document.getElementById("infoAmin").title = texte.univers.infoAmin;
    document.getElementById("infoAmax").title = texte.univers.infoAmax;
    document.getElementById("bouttonTracer").innerHTML = texte.univers.bouttonTracer;


    document.getElementById("headGraphiqueLCDM").innerHTML = texte.univers.headGraphiqueLCDM
    document.getElementById("avertissementUnivers").innerHTML = texte.univers.avertissement
    document.getElementById("entreeEnregistrer").innerHTML = texte.univers.Entrées
    document.getElementById("sortieEnregistrer").innerHTML = texte.univers.Sorties


    document.getElementById("Sorties").innerHTML = texte.univers.Sorties
    document.getElementById("Omégas").innerHTML = texte.univers.Omégas
    document.getElementById("infoOmégar0Sortie").title = texte.univers.infoOmégaR0Sortie
    document.getElementById("infoOmégak0Sortie").title = texte.univers.infoOmégaK0Sortie
    document.getElementById("Temps").innerHTML = texte.univers.Temps
    document.getElementById("evenement").innerHTML = texte.univers.evenement
    document.getElementById("particule").innerHTML = texte.univers.particules


    document.getElementById("Enregistrer").innerHTML = texte.univers.Enregistrer
    document.getElementById("infoNomFichier").title = texte.univers.infoNomFichier
    document.getElementById("labelNom_fichier").insertAdjacentHTML("beforeend", texte.univers.labelNom)
    document.getElementById("nom_fichier").value = texte.univers.nomDéfautLCDM
    document.getElementById("bouttonEnregistrer").innerHTML = texte.univers.bouttonEnregistrer

    document.getElementById("load_msg").innerHTML = texte.univers.load_msg


}

function texte_univers_DE() {
    let texte = o_recupereJson();
    document.querySelectorAll(".unite_al").forEach(function(i){i.innerHTML=texte.calculette.unitéanneelumiere});
    document.getElementById("Entrées").innerHTML = texte.univers.Entrées;
    document.getElementById("selecParamDE").innerHTML = texte.univers.selecParamDE
    document.getElementById("constantesUniverselles").innerHTML = texte.univers.constantes
    document.getElementById("calculetteCosmologique").innerHTML = texte.univers.calculette
    document.getElementById("infoT0").title = texte.univers.infoT0
    document.getElementById("infoH0").title = texte.univers.infoH0
    document.getElementById("infoTypeUnivers").title = texte.univers.infoTypeUnivers
    document.getElementById("Monofluide_optionNull").innerHTML = texte.univers.monofluide_null
    document.getElementById("Monofluide_optionM").innerHTML = texte.univers.monofluide_M
    document.getElementById("Monofluide_optionR").innerHTML = texte.univers.monofluide_R
    document.getElementById("Monofluide_optionDE").innerHTML = texte.univers.monofluide_DE
    document.getElementById("Monofluide_optionK").innerHTML = texte.univers.monofluide_K
    document.getElementById("infoOmégam0").title = texte.univers.infoOmégam0
    document.getElementById("infoOmégaLDE0").title = texte.univers.infoOmégaDE0
    document.getElementById("label_optionsOmégar0").insertAdjacentHTML("beforeend", texte.univers.label_Omégar0)
    document.getElementById("infoOmégaR0").title = texte.univers.infoOmégaR0
    document.getElementById("Omégar0_optionRFC_et_Neutrinos").innerHTML = texte.univers.Omégar0_RFC_et_Neutrinos
    document.getElementById("Omégar0_optionRFC").innerHTML = texte.univers.Omégar0_RFC
    document.getElementById("Omégar0_optionRien").innerHTML = texte.univers.Omégar0_Rien
    document.getElementById("infoOmégaK0").title = texte.univers.infoOmégaK0
    document.getElementById("label_optionsOmégak0").insertAdjacentHTML("beforeend", texte.univers.label_Omégak0)

    document.getElementById("Tracé").innerHTML = texte.univers.Tracé;
    document.getElementById("infoAmin").title = texte.univers.infoAmin;
    document.getElementById("infoAmax").title = texte.univers.infoAmax;
    document.getElementById("bouttonTracer").innerHTML = texte.univers.bouttonTracer;


    document.getElementById("headGraphiqueDE").innerHTML = texte.univers.headGraphiqueDE
    document.getElementById("avertissementUnivers").innerHTML = texte.univers.avertissement
    document.getElementById("entreeEnregistrer").innerHTML = texte.univers.Entrées
    document.getElementById("sortieEnregistrer").innerHTML = texte.univers.Sorties


    document.getElementById("Sorties").innerHTML = texte.univers.Sorties
    document.getElementById("Omégas").innerHTML = texte.univers.Omégas
    document.getElementById("infoOmégar0Sortie").title = texte.univers.infoOmégaR0Sortie
    document.getElementById("infoOmégak0Sortie").title = texte.univers.infoOmégaK0Sortie
    document.getElementById("Temps").innerHTML = texte.univers.Temps
    document.getElementById("evenement").innerHTML = texte.univers.evenement
    document.getElementById("particule").innerHTML = texte.univers.particules

    document.getElementById("Enregistrer").innerHTML = texte.univers.Enregistrer
    document.getElementById("infoNomFichier").title = texte.univers.infoNomFichier
    document.getElementById("labelNom_fichier").insertAdjacentHTML("beforeend", texte.univers.labelNom)
    document.getElementById("nom_fichier").value = texte.univers.nomDéfautDE
    document.getElementById("bouttonEnregistrer").innerHTML = texte.univers.bouttonEnregistrer

    document.getElementById("load_msg").innerHTML = texte.univers.load_msg
};

function texte_univers_calculette() {
    let texte = o_recupereJson();
    document.getElementById("infoT0").title = texte.univers.infoT0
    document.getElementById("infoH0").title = texte.univers.infoH0
    document.getElementById("infoTypeUnivers").title = texte.univers.infoTypeUnivers
    document.getElementById("Monofluide_optionNull").innerHTML = texte.univers.monofluide_null
    document.getElementById("Monofluide_optionM").innerHTML = texte.univers.monofluide_M
    document.getElementById("Monofluide_optionR").innerHTML = texte.univers.monofluide_R
    if (document.getElementById("Monofluide_optionDE")) {
        document.getElementById("Monofluide_optionDE").innerHTML = texte.univers.monofluide_DE
    } else {
        document.getElementById("Monofluide_optionLDE").innerHTML = texte.univers.monofluide_L
    }
    document.getElementById("Monofluide_optionK").innerHTML = texte.univers.monofluide_K
    document.getElementById("infoOmégam0").title = texte.univers.infoOmégam0
    document.getElementById("infoOmégaLDE0").title = texte.univers.infoOmégaL0
    document.getElementById("infoOmégar0Sortie").title = texte.calculette.infoOmégaR0Sortie
    document.getElementById("infoOmégak0Sortie").title = texte.calculette.infoOmégaK0Sortie
    document.getElementById("label_optionsOmégar0").insertAdjacentHTML("beforeend", texte.univers.label_Omégar0)
    document.getElementById("infoOmégaR0").title = texte.univers.infoOmégaR0
    document.getElementById("Omégar0_optionRFC_et_Neutrinos").innerHTML = texte.univers.Omégar0_RFC_et_Neutrinos
    document.getElementById("Omégar0_optionRFC").innerHTML = texte.univers.Omégar0_RFC
    document.getElementById("Omégar0_optionRien").innerHTML = texte.univers.Omégar0_Rien
    document.getElementById("infoOmégaK0").title = texte.univers.infoOmégaK0
    document.getElementById("label_optionsOmégak0").insertAdjacentHTML("beforeend", texte.univers.label_Omégak0)
    document.getElementById("rho").insertAdjacentHTML("beforeend", texte.calculette.densités_titre)

    document.querySelectorAll(".unite_annee").forEach(function(i){i.innerHTML=texte.calculette.unitéannee});
    document.querySelectorAll(".unite_al").forEach(function(i){i.innerHTML=texte.calculette.unitéanneelumiere});

    document.getElementById('bouton_calculer_inverse').innerHTML=texte.calculette.bouton_calculer;
    document.getElementById('bouton_calculer_z').innerHTML=texte.calculette.bouton_calculer;

    document.getElementById("constantesUniverselles").innerHTML = texte.univers.constantes
    document.getElementById("facteurEchelle").innerHTML = texte.calculette.facteurechelle
    document.getElementById("generateur_graphique").innerHTML = texte.calculette.generateur_graphique_titre;
    document.getElementById("diametre_apparent_titre").innerHTML = texte.calculette.diametre_apparent_titre;
    document.getElementById("calcul_inverse_titre").innerHTML = texte.calculette.calcul_inverse_titre;
    document.getElementById("calcul_z_titre").innerHTML = texte.calculette.calcul_z_titre;
    document.getElementById("parametre_z_titre").innerHTML = texte.calculette.parametre_z_titre;
    document.getElementById("geometrie_titre").innerHTML = texte.calculette.geometrie_titre;
    document.getElementById("photometrie_titre").innerHTML = texte.calculette.photometrie_titre;

    // // document.getElementById("bouton_distance").innerHTML = texte.calculette.bouton_distance;
    // document.getElementById("bouton_omega").innerHTML = texte.calculette.bouton_omega;
    // document.getElementById("bouton_tempsdecalage").innerHTML = texte.calculette.bouton_tempsdecalage;
    // document.getElementById("label_radio_fonction_z").innerHTML = texte.calculette.dependz;
    // document.getElementById("label_radio_fonction_t").innerHTML = texte.calculette.dependt;
    document.getElementById("label_check_log_abs").innerHTML = texte.calculette.abscisselog;
    document.getElementById("label_check_log_ord").innerHTML = texte.calculette.ordonneelog;
    document.getElementById("label_button_dit").title = texte.calculette.infobulle_dit
    document.getElementById("label_button_diz").title = texte.calculette.infobulle_diz
    document.getElementById("label_button_omegait").title = texte.calculette.infobulle_omegait
    document.getElementById("label_button_omegaiz").title = texte.calculette.infobulle_omegaiz
    document.getElementById("label_button_zt").title = texte.calculette.infobulle_zt
    document.getElementById("label_button_tz").title = texte.calculette.infobulle_tz
    if (document.getElementById("OmégaDE0")){
        // document.getElementById("label_omegaDE_normalise").innerHTML = texte.calculette.omegaDE_normalise
    }

    xaxis_temps=texte.calculette.xaxis_temps;
    yaxis_distance=texte.calculette.yaxis_distance
    yaxis_omega=texte.calculette.yaxis_omega;
    yaxis_temps=texte.calculette.yaxis_temps;//un peu la meme chose que xaxis mais je laisse dans le doute
    yaxis_decalage=texte.calculette.yaxis_decalage;

    document.getElementById("label_zmin").title = texte.calculette.infobulle_zmin;
    document.getElementById("label_zmax").title = texte.calculette.infobulle_zmax;
    document.getElementById("label_pas").title = texte.calculette.infobulle_pas;
    // document.getElementById("label_radio_fonction_z").title = texte.calculette.infobulle_dependz;
    // document.getElementById("label_radio_fonction_t").title = texte.calculette.infobulle_dependt;
    document.getElementById("label_check_log_abs").title = texte.calculette.infobulle_logabsc;
    document.getElementById("label_check_log_ord").title = texte.calculette.infobulle_logord;
    // document.getElementById("bouton_distance").title = texte.calculette.infobulle_dist;
    // document.getElementById("bouton_omega").title = texte.calculette.infobulle_omega;
    // document.getElementById("bouton_tempsdecalage").title = texte.calculette.infobulle_tempsdecalage;
    document.getElementById("label_omega_totalz1").title = texte.calculette.infobulle_omegatotalz1;
    document.getElementById("label_omega_totalz2").title = texte.calculette.infobulle_omegatotalz2;


    document.getElementById("diametre_apparent_titre").title = texte.calculette.infobulle_diametre_apparent;
    document.getElementById("label_d_m").title = texte.calculette.infobulle_D_m;
    document.getElementById("label_d_kpc").title = texte.calculette.infobulle_D_kpc;
    document.getElementById("label_theta").title = texte.calculette.infobulle_theta;

    document.getElementById("calcul_inverse_titre").title = texte.calculette.infobulle_Calcul_inverse;
    document.getElementById("label_dminverse").title = texte.calculette.infobulle_dm_inv;
    document.getElementById("label_teminverse").title = texte.calculette.infobulle_tem_inv;
    document.getElementById("label_zneg").title = texte.calculette.infobulle_z_neg;



    document.getElementById("label_Tz1").title = texte.calculette.infobulle_Tz1;
    document.getElementById("label_Hz1").title = texte.calculette.infobulle_Hz1;
    document.getElementById("label_omegaR_z1").title = texte.calculette.infobulle_orz1;
    document.getElementById("label_omegaM_z1").title = texte.calculette.infobulle_omz1;
    document.getElementById("label_omegaK_z1").title = texte.calculette.infobulle_okz1;
    document.getElementById("label_rho_m").title = texte.calculette.infobulle_rho_m
    document.getElementById("label_rho_r").title = texte.calculette.infobulle_rho_r
    if (document.getElementById("label_omegaL_z1")){
        document.getElementById("label_omegaL_z1").title = texte.calculette.infobulle_olz1;
        document.getElementById("label_omegaL_z2").title = texte.calculette.infobulle_olz2;

        document.getElementById('bouton_calculer_horizon').innerHTML=texte.calculette.bouton_calculer;
        document.getElementById("horizons_titre").innerHTML = texte.calculette.horizons_titre;
        document.getElementById("horizons_titre").title = texte.calculette.infobulle_horizon;
        document.getElementById("label_t_hori").title = texte.calculette.infobulle_t_horizon;
        document.getElementById("label_deven").title = texte.calculette.infobulle_deven;
        document.getElementById("label_dpart").title = texte.calculette.infobulle_dpart;

    }else{
        document.getElementById("label_rho_de").title = texte.calculette.infobulle_rho_DE
        document.getElementById("label_omegaDE_z1").title = texte.calculette.infobulle_odez1;
        document.getElementById("label_omegaDE_z2").title = texte.calculette.infobulle_odez2;
        document.getElementById("label_omegaDEN_z1").title = texte.calculette.infobulle_odenz1;
        document.getElementById("label_omegaDEN_z2").title = texte.calculette.infobulle_odenz2;
    }
    document.getElementById("label_Tz2").title = texte.calculette.infobulle_Tz2;
    document.getElementById("label_Hz2").title = texte.calculette.infobulle_Hz2;
    document.getElementById("label_omegaR_z2").title = texte.calculette.infobulle_orz2;
    document.getElementById("label_omegaM_z2").title = texte.calculette.infobulle_omz2;
    document.getElementById("label_omegaK_z2").title = texte.calculette.infobulle_okz2;
    document.getElementById("label_dm1").title = texte.calculette.infobulle_dm1;
    document.getElementById("label_dm2").title = texte.calculette.infobulle_dm2;
    document.getElementById("label_delta_dm").title = texte.calculette.infobulle_delta_dm;
    document.getElementById("label_t1").title = texte.calculette.infobulle_t1;
    document.getElementById("label_t2").title = texte.calculette.infobulle_t2;
    document.getElementById("label_delta_t").title = texte.calculette.infobulle_delta_t;
    document.getElementById("label_z1").title = texte.calculette.infobulle_z1;
    document.getElementById("label_z2").title = texte.calculette.infobulle_z2;
    document.getElementById("label_ie").title = texte.calculette.infobulle_Ie;
    document.getElementById("label_dz1").title = texte.calculette.infobulle_dz1;
    document.getElementById("label_dz2").title = texte.calculette.infobulle_dz2;
    document.getElementById("label_le").title = texte.calculette.infobulle_Le;
    document.getElementById("label_dl1").title = texte.calculette.infobulle_dl1;
    document.getElementById("label_dl2").title = texte.calculette.infobulle_dl2;
    document.getElementById("label_da1").title = texte.calculette.infobulle_da1;
    document.getElementById("label_da2").title = texte.calculette.infobulle_da2;
    document.getElementById("label_E1").title = texte.calculette.infobulle_E1;
    document.getElementById("label_E2").title = texte.calculette.infobulle_E2;
    document.getElementById("label_mu1").title = texte.calculette.infobulle_mu1;
    document.getElementById("label_mu2").title = texte.calculette.infobulle_mu2;
    document.getElementById("Enregistrer").innerHTML = texte.calculette.Enregistrer;
    document.getElementById("infoNomFichier").title = texte.calculette.infoNomFichier
    document.getElementById("labelNom_fichier").insertAdjacentHTML("beforeend", texte.calculette.labelNom)
    document.getElementById("label_selection_graphe").innerHTML = texte.calculette.labelSelectionGraphe
    document.getElementById("nom_fichier").value = texte.calculette.nomDéfaut
    document.getElementById("bouttonEnregistrer").innerHTML = texte.calculette.bouttonEnregistrer
    document.getElementById("avertissement_nbb").innerHTML = texte.calculette.avertissement_nbb
    document.getElementById("avertissement_nbb2").innerHTML = texte.calculette.avertissement_nbb

    // document.getElementById('texte_avertissement_z_-1').innerHTML = texte.calculette.avertissement_z_grand;

    document.getElementById("load_msg").innerHTML = texte.univers.load_msg
    document.getElementById("load_msg2").innerHTML = texte.univers.load_msg
};

function texte_constantes() {
    let texte = o_recupereJson()
    document.getElementById("infoc").title = texte.constante.c
    document.getElementById("infoG").title = texte.constante.G
    document.getElementById("infok").title = texte.constante.k
    document.getElementById("infoh").title = texte.constante.h

    document.getElementById("infoTypeAnnee").title = texte.constante.typeAnnée
    document.getElementById("annee_grégorienne").innerHTML = texte.constante.grégorienne
    document.getElementById("annee_sidérale").innerHTML = texte.constante.sidérale
    document.getElementById("annee_julienne").innerHTML = texte.constante.julienne
    document.getElementById("annee_tropique").innerHTML = texte.constante.tropique

    document.getElementById("enregistrer").innerHTML = texte.constante.enregistrer
    document.getElementById("réinitialiser").innerHTML = texte.constante.reinitialiser
    document.getElementById("retour").innerHTML = texte.constante.retour
}

function texte_Apropos() {
    let texte = o_recupereJson()

    document.getElementById("titreDesc").innerHTML = texte.Apropos.titreDesc
    document.getElementById("desc").innerHTML = texte.Apropos.desc
    document.getElementById("desc1").innerHTML = texte.Apropos.desc1
    document.getElementById("desc2").innerHTML = texte.Apropos.desc2
	document.getElementById("desc3").innerHTML = texte.Apropos.desc3

    document.getElementById("acteurs").innerHTML = texte.Apropos.acteurs
    document.getElementById("Directeurs").innerHTML = texte.Apropos.Directeurs
    document.getElementById("Dir1").innerHTML = texte.Apropos.Directeur1
    document.getElementById("Dir2").innerHTML = texte.Apropos.Directeur2

    document.getElementById("encadrant").innerHTML = texte.Apropos.Encadrant
    document.getElementById("enc1").innerHTML = texte.Apropos.Encadrant1
    document.getElementById("enc2").innerHTML = texte.Apropos.Encadrant2
    document.getElementById("enc3").innerHTML = texte.Apropos.Encadrant3
    document.getElementById("enc4").innerHTML = texte.Apropos.Encadrant4

    document.getElementById("participant").innerHTML = texte.Apropos.Participant
    document.getElementById("parti1").innerHTML = texte.Apropos.Participant1
    document.getElementById("parti2").innerHTML = texte.Apropos.Participant2
    document.getElementById("parti3").innerHTML = texte.Apropos.Participant3
    document.getElementById("parti4").innerHTML = texte.Apropos.Participant4

    document.getElementById("remerciement").innerHTML = texte.Apropos.Remerciement
    document.getElementById("remer1").innerHTML = texte.Apropos.Remerciement1
    document.getElementById("remer2").innerHTML = texte.Apropos.Remerciement2
    document.getElementById("remer3").innerHTML = texte.Apropos.Remerciement3
    document.getElementById("remer4").innerHTML = texte.Apropos.Remerciement4

    document.getElementById("versions").innerHTML = texte.Apropos.versions
    document.getElementById("license").innerHTML = texte.Apropos.License
    document.getElementById("2025").innerHTML = texte.Apropos.v2025
    document.getElementById("2024").innerHTML = texte.Apropos.v2024
    document.getElementById("2023").innerHTML = texte.Apropos.v2023
    document.getElementById("2022").innerHTML = texte.Apropos.v2022
    document.getElementById("2021").innerHTML = texte.Apropos.v2021
    document.getElementById("2020").innerHTML = texte.Apropos.v2020
    document.getElementById("2019").innerHTML = texte.Apropos.v2019
    document.getElementById("2018").innerHTML = texte.Apropos.v2018
    document.getElementById("2017").innerHTML = texte.Apropos.v2017
    document.getElementById("2016").innerHTML = texte.Apropos.v2016
    document.getElementById("2015").innerHTML = texte.Apropos.v2015
    document.getElementById("2014").innerHTML = texte.Apropos.v2014
    document.getElementById("2013").innerHTML = texte.Apropos.v2013
    document.getElementById("2009").innerHTML = texte.Apropos.v2009

}





















/* Anciennes fonction de texte à refaire en plus du json */


function textesimutraj(){
    var texte = o_recupereJson();
    //document.getElementById("txt_trajectoire").innerHTML = "Avertissement";
    document.getElementById("txt_trajectoire").innerHTML = texte.pages_trajectoire.simuavertissement;
    //document.getElementById("txt_avertissement_trajectoire").innerHTML = texte.pages_trajectoire.avertissement;
    //document.getElementById("acceleration1").title = texte.pages_trajectoire.diffderive;   génère une erreur dans la console pour Kerr car aussi utilisé pour Kerr --> à voir
}

function textesfinarret(){
    var texte = o_recupereJson();
    document.getElementById("vr_sc_mas").innerHTML = texte.pages_trajectoire.vrarret;
    document.getElementById("vp_sc_mas").innerHTML = texte.pages_trajectoire.vphiarret;
}

function textesfinarret_kerrphoton(){
    var texte = o_recupereJson();
    //document.getElementById("vrk").innerHTML = texte.pages_trajectoire.vrarret;
    document.getElementById("vpkp").innerHTML = texte.pages_trajectoire.vphikerrarret;
}

//Fonction htmlDecode écrite par Comrade Programmer#7608, ce qui résout le problème d'affichage.
function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}

function notationvitesseree2(){
    var texte = o_recupereJson();
    numberoftherockets = document.getElementById("nombredefusees").value;
    if(document.getElementById('traject_type2').value=="observateur"){
        document.getElementById("vitesseurlabel").title = htmlDecode(texte.pages_trajectoire.vitesseurlabeld);
        document.getElementById("thetalabel").title = htmlDecode(texte.pages_trajectoire.theta_label);

        document.getElementById("philabel").title = htmlDecode(texte.pages_trajectoire.philabel);
        for (count = 1; count <= numberoftherockets; count += 1) {
            document.getElementById("vitesseur"+count.toString()+"").title = htmlDecode(texte.pages_trajectoire.vitesseurt);
            document.getElementById("vitesseuphi"+count.toString()+"").title = htmlDecode(texte.pages_trajectoire.vitesseuphi);

        }
    }
    else{
        document.getElementById("vitesseurlabel").title = htmlDecode(texte.pages_trajectoire.vitesseurlabeld);
        document.getElementById("thetalabel").title = htmlDecode(texte.pages_trajectoire.theta_label	);
        document.getElementById("philabel").title = htmlDecode(texte.pages_trajectoire.philabelt);

        for (count = 1; count <= numberoftherockets; count += 1) {
            document.getElementById("vitesseur"+count.toString()+"").title = htmlDecode(texte.pages_trajectoire.vitesseurt);
            document.getElementById("vitesseuphi"+count.toString()+"").title = htmlDecode(texte.pages_trajectoire.vitesseuphi);
        }
    }

}


function textegravetetc_Kerr(){
    var texte = o_recupereJson();
    //document.getElementById("acceleration").title = texte.pages_trajectoire.diffderive;
    document.getElementById("ctreastre").title = texte.pages_trajectoire.ctreastre;
    document.getElementById("massetxt").title = texte.pages_trajectoire.massetxt;
    document.getElementById("moment").title = texte.pages_trajectoire.moment;
    document.getElementById("spin").title = texte.pages_trajectoire.spin;
    document.getElementById("rayonschwars").title = texte.pages_trajectoire.rayonschwars;
    document.getElementById("horizon1").title = texte.pages_trajectoire.horizon1;
    document.getElementById("horizon2").title = texte.pages_trajectoire.horizon2;
    document.getElementById("gravSurface").title = texte.pages_trajectoire.gravSurface_BulleInfo;

    var canvaswidthheightt = '750';

    if(canvaswidthheightt=="750"){
        document.getElementById("labelgp").innerHTML = texte.pages_trajectoire.labelgp;
        document.getElementById("label_depasser").innerHTML = texte.pages_trajectoire.label_depasser;
        document.getElementById("label_depasser").title = texte.pages_trajectoire.infobulle_depasser;
    }

}


function textegravetetc(){

    c = 299792458;
    var texte = o_recupereJson();

    var element = document.getElementById("TempTrouNoirtxt");
    var element2 = document.getElementById("tempsEvaporationTrouNoirtxt");
    if (element !== null && element2 !== null) {// pas pratique mais c'est juste parceque dans les cas inter il y a pas ces boites alors ca evite les problemes sinon vous devez faire une autre fonction pour inter !
        element.title = texte.pages_trajectoire.TempTN;
        element2.title = texte.pages_trajectoire.tempsEvapTN;
    }


    document.getElementById("gravtxt").title = texte.pages_trajectoire.gravtitle;
    document.getElementById("vitesseLibéra").title = texte.pages_trajectoire.Vlibtitle;
    document.getElementById("ctreastre").title = texte.pages_trajectoire.ctreastre;
    document.getElementById("rayonschwars").title = texte.pages_trajectoire.rayonschwars;
    document.getElementById("massetxt").title = texte.pages_trajectoire.massetxt;
    document.getElementById("txt_rphysique").title = texte.pages_trajectoire.txt_rphysique;
    document.getElementById("labelnumberfusees").innerHTML = texte.pages_trajectoire.labelnumberfusees;
    var canvaswidthheightt = '750';
    if(canvaswidthheightt=="750"){
        document.getElementById("labelgp").innerHTML = texte.pages_trajectoire.labelgp;
    }
}


function notationvitesseree2kerr(){
    var texte = o_recupereJson();
    document.getElementById("vitesseur").title = htmlDecode(texte.pages_trajectoire.vitesseurt);
    document.getElementById("vitesseuphi").title = htmlDecode(texte.pages_trajectoire.vitesseuphi);
    document.getElementById("philabel").title = htmlDecode(texte.pages_trajectoire.philabel);
    document.getElementById("theta_label").title = htmlDecode(texte.pages_trajectoire.theta_label);
}


function notationvitesseree1kerr(){
    var texte = o_recupereJson();

    document.getElementById("vitesseur").title = texte.pages_trajectoire.vitesseurt;
    document.getElementById("vitesseuphi").title = htmlDecode(texte.pages_trajectoire.vitesseuphi);
    document.getElementById("philabel").title = htmlDecode(texte.pages_trajectoire.philabel);
    document.getElementById("theta_label").title = htmlDecode(texte.pages_trajectoire.theta_label);
}

function notationvitesseree1(){
    var texte = o_recupereJson();
    numberoftherockets = document.getElementById("nombredefusees").value;

    if(document.getElementById('traject_type2').value=="observateur"){
        document.getElementById("philabel").title = htmlDecode(texte.pages_trajectoire.philabel);
        document.getElementById("thetalabel").title = htmlDecode(texte.pages_trajectoire.theta_label);
        for (countet = 1; countet <= numberoftherockets; countet += 1) {
            document.getElementById("vitesseur"+countet.toString()+"").title = htmlDecode(texte.pages_trajectoire.vitesseurt);
            document.getElementById("vitesseuphi"+countet.toString()+"").title = htmlDecode(texte.pages_trajectoire.vitesseuphi);
        }
    }
    else{
        document.getElementById("philabel").title = htmlDecode(texte.pages_trajectoire.philabel);
        document.getElementById("thetalabel").title = htmlDecode(texte.pages_trajectoire.theta_label);
        for (countet = 1; countet <= numberoftherockets; countet += 1) {
            document.getElementById("vitesseur"+countet.toString()+"").title = htmlDecode(texte.pages_trajectoire.vitesseurt);
            document.getElementById("vitesseuphi"+countet.toString()+"").title = htmlDecode(texte.pages_trajectoire.vitesseuphi);
        }

    }


}



function infobulleobservateurdistant(){
    var texte = o_recupereJson();
    document.getElementById("r3").title =texte.pages_trajectoire.r3;
}


function texteTrajectoireMassive(nbrderockets) {
    var texte = o_recupereJson();
    element2=document.getElementById('traject_type2');

    document.getElementById("clear").title = texte.pages_trajectoire.bouton_stop_bulleInfo;
    document.getElementById("txt_titre").innerHTML = texte.page_trajectoire_massive.titre;
    document.getElementById("txt_rphysique").innerHTML = texte.page_trajectoire_massive.rayon_physique;
    document.getElementById("moinsvi").title = texte.pages_trajectoire.bouton_moins;
    document.getElementById("plusvi").title = texte.pages_trajectoire.bouton_plus;
    document.getElementById("boutton_enregis").innerHTML = texte.pages_trajectoire.bouton_enregistrer;
    document.getElementById("clear").innerHTML = texte.pages_trajectoire.bouton_reset;
    document.getElementById("pau").title = texte.pages_trajectoire.bouton_pause;
    document.getElementById("start").innerHTML = texte.pages_trajectoire.bouton_start;
    document.getElementById("r1").innerHTML = texte.pages_trajectoire.trajectoire_complete;
    document.getElementById("r2").innerHTML = texte.pages_trajectoire.trajectoire_simple;
    document.getElementById("rebondd").innerHTML = texte.page_trajectoire_massive.rebond;
    document.getElementById("r3").innerHTML = texte.pages_trajectoire.observateur;
    document.getElementById("r4").innerHTML = texte.pages_trajectoire.mobile;
    //document.getElementById("boutton_prézoom").innerHTML = texte.pages_trajectoire.boutton_prézoom;
    document.getElementById("boutton_recup").innerHTML = texte.pages_trajectoire.boutton_recup;
    document.getElementById("amortissement").innerHTML = texte.page_trajectoire_massive.amortissement;
    document.getElementById("label_pourcentage_vphi_pilotage").innerHTML = texte.pages_trajectoire.pourcentage_vphi_pilotage_label;
    document.getElementById("label_pourcentage_vphi_pilotage").title = texte.pages_trajectoire.pourcentage_vphi_infobulle;

    document.getElementById("Entree_astre_label").innerHTML = texte.pages_trajectoire.entree_astre;
    document.getElementById("Entree_mobile_label").innerHTML = texte.pages_trajectoire.entree_mobile;

    document.getElementById("Sortie_astre_label").innerHTML = texte.pages_trajectoire.sortie_astre;
    document.getElementById("Sortie_mobile_label").innerHTML = texte.pages_trajectoire.sortie_mobile;

    document.getElementById("label-choix-potentiel").innerHTML = texte.pages_trajectoire.label_choix_potentiel;
    document.getElementById("label-choix-potentiel").title = texte.pages_trajectoire.label_choix_potentiel_infobulle;

    for (count = 1; count <= nbrderockets; count += 1) {
        document.getElementById("temps_ecoule"+count.toString()+"").innerHTML = texte.pages_trajectoire.temps_ecoule;
        document.getElementById("acceleration"+count.toString()+"").innerHTML = "Gradient &nbsp;<span id='DivClignotante"+count.toString()+"'></span>";
        document.getElementById("temps_obs"+count.toString()+"").innerHTML = texte.pages_trajectoire.temps_obs;
        document.getElementById("decal_spect"+count.toString()+"").innerHTML = texte.pages_trajectoire.decal_spect+"&nbsp;<span id='DivClignotantePilot"+count.toString()+"'></span>";
        document.getElementById("decal_spect"+count.toString()).title = texte.pages_trajectoire.decalageSpec_EnergyReserve;
        document.getElementById("v_tot"+count.toString()+"").innerHTML = texte.pages_trajectoire.vtotal;
        document.getElementById("nb_g"+count.toString()+"").innerHTML = texte.pages_trajectoire.nombre_de_g+"&nbsp;<span id='DivClignotanteNbG"+count.toString()+"'></span>"; 
        document.getElementById("dernier_g"+count.toString()+"").innerHTML = texte.pages_trajectoire.dernier_g;
        document.getElementById("nb_g"+count.toString()).title = texte.pages_trajectoire.nombre_g_infobulle;
        document.getElementById("dernier_g"+count.toString()).title = texte.pages_trajectoire.dernier_g_infobulle;
        document.getElementById("distance_metrique"+count.toString()+"").innerHTML = texte.pages_trajectoire.distance_metrique_parcourue;
        document.getElementById("distance_metrique"+count.toString()).title = texte.pages_trajectoire.distance_metrique_parcourue_infobulle;
        document.getElementById("puissance_consommee_label"+count.toString()).innerHTML = texte.pages_trajectoire.puissance_consommee_label;
        document.getElementById("puissance_consommee_label"+count.toString()).title=texte.pages_trajectoire.puissance_consommee_infobulle;

        document.getElementById("vitesse_orb_circ"+count.toString()+"").title = texte.pages_trajectoire.vitesse_orbite_circulaire;




    }
    var canvaswidthheightt = '750';

}



function texteTrajectoirePhoton(nbrderockets) {
    var texte = o_recupereJson();
    document.getElementById("clear").title = texte.pages_trajectoire.bouton_stop_bulleInfo;
    document.getElementById("txt_titre").innerHTML = texte.page_trajectoire_photon.titre;
    document.getElementById("txt_rphysique").innerHTML = texte.page_trajectoire_photon.rayon_physique;
    document.getElementById("moinsvi").title = texte.pages_trajectoire.bouton_moins;
    document.getElementById("plusvi").title = texte.pages_trajectoire.bouton_plus;
    document.getElementById("boutton_enregis").innerHTML = texte.pages_trajectoire.bouton_enregistrer;
    document.getElementById("clear").innerHTML = texte.pages_trajectoire.bouton_reset;
    document.getElementById("pau").title = texte.pages_trajectoire.bouton_pause;
    document.getElementById("start").innerHTML = texte.pages_trajectoire.bouton_start;
    document.getElementById("r1").innerHTML = texte.pages_trajectoire.trajectoire_complete;
    document.getElementById("r2").innerHTML = texte.pages_trajectoire.trajectoire_simple;
    document.getElementById("r3").innerHTML = texte.pages_trajectoire.observateur;
    document.getElementById("r4").innerHTML = texte.pages_trajectoire.photon;
    //document.getElementById("boutton_prézoom").innerHTML = texte.pages_trajectoire.boutton_prézoom;
    document.getElementById("rebondd").innerHTML = texte.page_trajectoire_massive.rebond;
    document.getElementById("boutton_recup").innerHTML = texte.pages_trajectoire.boutton_recup;

    document.getElementById("Entree_astre_label").innerHTML = texte.pages_trajectoire.entree_astre;
    document.getElementById("Entree_mobile_label").innerHTML = texte.pages_trajectoire.entree_mobile;

    document.getElementById("Sortie_astre_label").innerHTML = texte.pages_trajectoire.sortie_astre;
    document.getElementById("Sortie_mobile_label").innerHTML = texte.pages_trajectoire.sortie_mobile;
    
    document.getElementById("label-choix-potentiel").innerHTML = texte.pages_trajectoire.label_choix_potentiel;
    document.getElementById("label-choix-potentiel").title = texte.pages_trajectoire.label_choix_potentiel_infobulle;
    
    for (count = 1; count <= nbrderockets; count += 1) {
        document.getElementById("temps_ecoule"+count.toString()+"").innerHTML = texte.pages_trajectoire.temps_ecoule;
        //document.getElementById("acceleration"+count.toString()+"").innerHTML ="Gradient &nbsp;<span id='DivClignotante"+count.toString()+"'></span>";
        document.getElementById("temps_obs"+count.toString()+"").innerHTML = texte.pages_trajectoire.temps_obs;
        document.getElementById("v_tot"+count.toString()+"").innerHTML = texte.pages_trajectoire.vtotal;
        document.getElementById("rayon_orb_circ"+count.toString()+"").title = texte.pages_trajectoire.rayon_orbite_circulaire_photon; 
        document.getElementById("rayon_orbite_circ_res"+count.toString()+"").title=texte.pages_trajectoire.orbite_circulaire_instable; 

    }
    var canvaswidthheightt = '750';

}
function texteTrajectoireMassiveNonBar(nbrderockets) {
    var texte = o_recupereJson();
    document.getElementById("clear").title = texte.pages_trajectoire.bouton_stop_bulleInfo;
    document.getElementById("txt_titre").innerHTML = texte.page_trajectoire_massive_nonBar.titre;
    document.getElementById("txt_rphysique").innerHTML = texte.page_trajectoire_massive.rayon_physique;
    document.getElementById("moinsvi").title = texte.pages_trajectoire.bouton_moins;
    document.getElementById("plusvi").title = texte.pages_trajectoire.bouton_plus;
    document.getElementById("boutton_enregis").innerHTML = texte.pages_trajectoire.bouton_enregistrer;
    document.getElementById("clear").innerHTML = texte.pages_trajectoire.bouton_reset;
    document.getElementById("pau").title = texte.pages_trajectoire.bouton_pause;
    document.getElementById("start").innerHTML = texte.pages_trajectoire.bouton_start;
    document.getElementById("r1").innerHTML = texte.pages_trajectoire.trajectoire_complete;
    document.getElementById("r2").innerHTML = texte.pages_trajectoire.trajectoire_simple;
    document.getElementById("r3").innerHTML = texte.pages_trajectoire.observateur;
    document.getElementById("r4").innerHTML = texte.pages_trajectoire.mobile;
    document.getElementById("label_pourcentage_vphi_pilotage").innerHTML = texte.pages_trajectoire.pourcentage_vphi_pilotage_label;
    document.getElementById("label_pourcentage_vphi_pilotage").title = texte.pages_trajectoire.pourcentage_vphi_infobulle;
    //document.getElementById("boutton_prézoom").innerHTML = texte.pages_trajectoire.boutton_prézoom;
    document.getElementById("boutton_recup").innerHTML = texte.pages_trajectoire.boutton_recup;

    document.getElementById("Entree_astre_label").innerHTML = texte.pages_trajectoire.entree_astre;
    document.getElementById("Entree_mobile_label").innerHTML = texte.pages_trajectoire.entree_mobile;

    document.getElementById("Sortie_astre_label").innerHTML = texte.pages_trajectoire.sortie_astre;
    document.getElementById("Sortie_mobile_label").innerHTML = texte.pages_trajectoire.sortie_mobile;

    document.getElementById("label-choix-potentiel").innerHTML = texte.pages_trajectoire.label_choix_potentiel;
    document.getElementById("label-choix-potentiel").title = texte.pages_trajectoire.label_choix_potentiel_infobulle;

    for (count = 1; count <= nbrderockets; count += 1) {
        document.getElementById("temps_ecoule"+count.toString()+"").innerHTML = texte.pages_trajectoire.temps_ecoule;
        document.getElementById("acceleration"+count.toString()+"").innerHTML ="Gradient &nbsp;<span id='DivClignotante"+count.toString()+"'></span>";
        document.getElementById("temps_obs"+count.toString()+"").innerHTML = texte.pages_trajectoire.temps_obs;
        document.getElementById("v_tot"+count.toString()+"").innerHTML = texte.pages_trajectoire.vtotal;
        document.getElementById("decal_spect"+count.toString()+"").innerHTML = texte.pages_trajectoire.decal_spect+"&nbsp;<span id='DivClignotantePilot"+count.toString()+"'></span>";
        document.getElementById("decal_spect"+count.toString()).title = texte.pages_trajectoire.decalageSpec_EnergyReserve;
        document.getElementById("nb_g"+count.toString()+"").innerHTML = texte.pages_trajectoire.nombre_de_g+"&nbsp;<span id='DivClignotanteNbG"+count.toString()+"'></span>"; 
        document.getElementById("dernier_g"+count.toString()+"").innerHTML = texte.pages_trajectoire.dernier_g;
        document.getElementById("nb_g"+count.toString()).title = texte.pages_trajectoire.nombre_g_infobulle;
        document.getElementById("dernier_g"+count.toString()).title = texte.pages_trajectoire.dernier_g_infobulle;
        document.getElementById("distance_metrique"+count.toString()+"").innerHTML = texte.pages_trajectoire.distance_metrique_parcourue;
        document.getElementById("distance_metrique"+count.toString()).title = texte.pages_trajectoire.distance_metrique_parcourue_infobulle;
        document.getElementById("vitesse_orb_circ_nonBar_massive"+count.toString()+"").title=texte.pages_trajectoire.vitesse_orbite_circulaire;
        document.getElementById("puissance_consommee_label"+count.toString()).innerHTML = texte.pages_trajectoire.puissance_consommee_label;
        document.getElementById("puissance_consommee_label"+count.toString()).title=texte.pages_trajectoire.puissance_consommee_infobulle;
    }
}

function texteTrajectoirePhotonNonBar(nbrderockets) {
    var texte = o_recupereJson();
    document.getElementById("clear").title = texte.pages_trajectoire.bouton_stop_bulleInfo;
    document.getElementById("txt_titre").innerHTML = texte.page_trajectoire_photon_nonBar.titre;
    document.getElementById("txt_rphysique").innerHTML = texte.page_trajectoire_photon.rayon_physique;
    document.getElementById("moinsvi").title = texte.pages_trajectoire.bouton_moins;
    document.getElementById("plusvi").title = texte.pages_trajectoire.bouton_plus;
    document.getElementById("boutton_enregis").innerHTML = texte.pages_trajectoire.bouton_enregistrer;
    document.getElementById("clear").innerHTML = texte.pages_trajectoire.bouton_reset;
    document.getElementById("pau").title = texte.pages_trajectoire.bouton_pause;
    document.getElementById("start").innerHTML = texte.pages_trajectoire.bouton_start;
    document.getElementById("r1").innerHTML = texte.pages_trajectoire.trajectoire_complete;
    document.getElementById("r2").innerHTML = texte.pages_trajectoire.trajectoire_simple;
    document.getElementById("r3").innerHTML = texte.pages_trajectoire.observateur;
    document.getElementById("r4").innerHTML = texte.pages_trajectoire.photon;
    document.getElementById("boutton_recup").innerHTML = texte.pages_trajectoire.boutton_recup;
    document.getElementById("gravtxt").title = texte.pages_trajectoire.gravtitle;
    document.getElementById("vitesseLibéra").title = texte.pages_trajectoire.Vlibtitle;
    document.getElementById("ctreastre").title = texte.pages_trajectoire.ctreastre;
    document.getElementById("rayonschwars").title = texte.pages_trajectoire.rayonschwars;
    document.getElementById("massetxt").title = texte.pages_trajectoire.massetxt;
    document.getElementById("txt_rphysique").title = texte.pages_trajectoire.txt_rphysique;
    document.getElementById("labelnumberfusees").innerHTML = texte.pages_trajectoire.labelnumberfusees;

    document.getElementById("Entree_astre_label").innerHTML = texte.pages_trajectoire.entree_astre;
    document.getElementById("Entree_mobile_label").innerHTML = texte.pages_trajectoire.entree_mobile;

    document.getElementById("Sortie_astre_label").innerHTML = texte.pages_trajectoire.sortie_astre;
    document.getElementById("Sortie_mobile_label").innerHTML = texte.pages_trajectoire.sortie_mobile;
    
    document.getElementById("label-choix-potentiel").innerHTML = texte.pages_trajectoire.label_choix_potentiel;
    document.getElementById("label-choix-potentiel").title = texte.pages_trajectoire.label_choix_potentiel_infobulle;

    var canvaswidthheightt = '750';
    if(canvaswidthheightt=="750"){
        document.getElementById("labelgp").innerHTML = texte.pages_trajectoire.labelgp;}

    for (count = 1; count <= nbrderockets; count += 1) {
        document.getElementById("temps_ecoule"+count.toString()+"").innerHTML = texte.pages_trajectoire.temps_ecoule;
        document.getElementById("temps_obs"+count.toString()+"").innerHTML = texte.pages_trajectoire.temps_obs;
        document.getElementById("v_tot"+count.toString()+"").innerHTML = texte.pages_trajectoire.vtotal;
        document.getElementById("rayon_orb_circ_ext_photon_nonBar"+count.toString()+"").title = texte.page_trajectoire_photon_nonBar.orbite_circulaire_exterieure; 
        document.getElementById("rayon_orb_circ_int_photon_nonBar"+count.toString()+"").title = texte.page_trajectoire_photon_nonBar.orbite_circulaire_interieure; 
    }
}

function texteTrajectoireMassiveKerr() {
    var texte = o_recupereJson();
    document.getElementById("clear").title = texte.pages_trajectoire.bouton_stop_bulleInfo;
    document.getElementById("txt_titre").innerHTML = texte.page_trajectoire_massive_kerr.titre;
    document.getElementById("moinsvi").title = texte.pages_trajectoire.bouton_moins;
    document.getElementById("plusvi").title = texte.pages_trajectoire.bouton_plus;
    document.getElementById("boutton_enregis").innerHTML = texte.pages_trajectoire.bouton_enregistrer;
    document.getElementById("clear").innerHTML = texte.pages_trajectoire.bouton_reset;
    document.getElementById("pau").title = texte.pages_trajectoire.bouton_pause;
    document.getElementById("start").innerHTML = texte.pages_trajectoire.bouton_start;
    document.getElementById("r1").innerHTML = texte.pages_trajectoire.trajectoire_complete;
    document.getElementById("r2").innerHTML = texte.pages_trajectoire.trajectoire_simple;
    document.getElementById("r3").innerHTML = texte.pages_trajectoire.observateur;
    document.getElementById("r4").innerHTML = texte.pages_trajectoire.mobile;
    document.getElementById("label_pourcentage_vphi_pilotage").innerHTML = texte.pages_trajectoire.pourcentage_vphi_pilotage_label;
    document.getElementById("label_pourcentage_vphi_pilotage").title = texte.pages_trajectoire.pourcentage_vphi_infobulle;
    //document.getElementById("boutton_prézoom").innerHTML = texte.pages_trajectoire.boutton_prézoom;
    document.getElementById("temps_ecoule").innerHTML = texte.pages_trajectoire.temps_ecoule;
    document.getElementById("acceleration").innerHTML = texte.pages_trajectoire.acceleration;
    document.getElementById("nb_g").innerHTML = texte.pages_trajectoire.nombre_de_g+"&nbsp;<span id='DivClignotanteNbG'></span>"; 
    document.getElementById("dernier_g").innerHTML = texte.pages_trajectoire.dernier_g;
    document.getElementById("distance_metrique").innerHTML = texte.pages_trajectoire.distance_metrique_parcourue;
    document.getElementById("temps_obs").innerHTML = texte.pages_trajectoire.temps_obs;
    document.getElementById("boutton_recup").innerHTML = texte.pages_trajectoire.boutton_recup;
    document.getElementById("decal_spect").innerHTML = texte.pages_trajectoire.decal_spect+"&nbsp;<span id='DivClignotantePilot'></span>";
    document.getElementById("decal_spect").title = texte.pages_trajectoire.decalageSpec_EnergyReserve;
    document.getElementById("v_tot").innerHTML = texte.pages_trajectoire.vtotal;

    //document.getElementById("ouvreengrand").innerHTML = texte.pages_trajectoire.ouvreengrand;

    document.getElementById("circulaire_prograde_bar").title=texte.pages_trajectoire.vitesse_orbite_circulaire_kerr_prograde;
    document.getElementById("circulaire_retrograde_bar").title=texte.pages_trajectoire.vitesse_orbite_circulaire_kerr_retrograde;
    document.getElementById("puissance_consommee_label").innerHTML = texte.pages_trajectoire.puissance_consommee_label;
    document.getElementById("puissance_consommee_label").title=texte.pages_trajectoire.puissance_consommee_infobulle;
    document.getElementById("nb_g").title= htmlDecode(texte.pages_trajectoire.nombre_g_infobulle);
    document.getElementById("dernier_g").title= htmlDecode(texte.pages_trajectoire.dernier_g_infobulle);
    document.getElementById("distance_metrique").title = texte.pages_trajectoire.distance_metrique_parcourue_infobulle;

    document.getElementById("Entree_astre_label").innerHTML = texte.pages_trajectoire.entree_astre;
    document.getElementById("Entree_mobile_label").innerHTML = texte.pages_trajectoire.entree_mobile;

    document.getElementById("Sortie_astre_label").innerHTML = texte.pages_trajectoire.sortie_astre;
    document.getElementById("Sortie_mobile_label").innerHTML = texte.pages_trajectoire.sortie_mobile;
    
}




function texteTrajectoirePhotonKerr() {
    var texte = o_recupereJson();
    document.getElementById("clear").title = texte.pages_trajectoire.bouton_stop_bulleInfo;
    document.getElementById("txt_titre").innerHTML = texte.page_trajectoire_photon_kerr.titre;
    document.getElementById("moinsvi").title = texte.pages_trajectoire.bouton_moins;
    document.getElementById("plusvi").title = texte.pages_trajectoire.bouton_plus;
    document.getElementById("clear").innerHTML = texte.pages_trajectoire.bouton_reset;
    document.getElementById("boutton_enregis").innerHTML = texte.pages_trajectoire.bouton_enregistrer;
    document.getElementById("pau").title = texte.pages_trajectoire.bouton_pause;
    document.getElementById("start").innerHTML = texte.pages_trajectoire.bouton_start;
    document.getElementById("r1").innerHTML = texte.pages_trajectoire.trajectoire_complete;
    document.getElementById("r2").innerHTML = texte.pages_trajectoire.trajectoire_simple;
    document.getElementById("r3").innerHTML = texte.pages_trajectoire.observateur;
    document.getElementById("r4").innerHTML = texte.pages_trajectoire.photon;
    document.getElementById("boutton_prézoom").innerHTML = texte.pages_trajectoire.boutton_prézoom;
    //document.getElementById("acceleration").innerHTML = texte.pages_trajectoire.acceleration;
    document.getElementById("temps_ecoule").innerHTML = texte.pages_trajectoire.temps_ecoule;
    document.getElementById("temps_obs").innerHTML = texte.pages_trajectoire.temps_obs;
    document.getElementById("boutton_recup").innerHTML = texte.pages_trajectoire.boutton_recup;
    // document.getElementById("ouvreengrand").innerHTML = texte.pages_trajectoire.ouvreengrand;
    document.getElementById("v_tot").innerHTML = texte.pages_trajectoire.vtotal;
    document.getElementById("circulaire_prograde").title = texte.pages_trajectoire.rayon_orbite_circulaire_photon_kerr_prograde;
    document.getElementById("circulaire_retrograde").title = texte.pages_trajectoire.rayon_orbite_circulaire_photon_kerr_retrograde;
    document.getElementById("circulaire_prograde_res").title = texte.pages_trajectoire.orbite_circulaire_instable;
    document.getElementById("circulaire_retrograde_res").title = texte.pages_trajectoire.orbite_circulaire_instable;

    document.getElementById("Entree_astre_label").innerHTML = texte.pages_trajectoire.entree_astre;
    document.getElementById("Entree_mobile_label").innerHTML = texte.pages_trajectoire.entree_mobile;

    document.getElementById("Sortie_astre_label").innerHTML = texte.pages_trajectoire.sortie_astre;
    document.getElementById("Sortie_mobile_label").innerHTML = texte.pages_trajectoire.sortie_mobile;




}
