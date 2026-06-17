/**
 * Fonction permettant d'afficher ou de cacher les panneaux d'entrée et sortie de la page univers
 * @param IDpanel {string} Id du panneau à cacher
 */
function toggleEntreeSortie (IDpanel) {
    const panneau = document.getElementById(IDpanel)
    panneau.classList.toggle("cache")

    const grillePrincipale = document.querySelector(".grillePrincipale")
    let entreeCachee = document.getElementById("panneauEntree").classList.contains("cache")
    let sortieCachee = document.getElementById("panneauSortie").classList.contains("cache")

    if (window.innerWidth > 1200) {
        if (entreeCachee && sortieCachee) {
            grillePrincipale.style.gridTemplateColumns = '1fr';
            grillePrincipale.style.gridTemplateAreas = '' +
                '"Nav"' +
                '"Graphe"';
        } else if (entreeCachee) {
            grillePrincipale.style.gridTemplateColumns = '4fr 1fr';
            grillePrincipale.style.gridTemplateAreas = '' +
                '"Nav Nav"' +
                '"Graphe Sortie"';
        } else if (sortieCachee) {
            grillePrincipale.style.gridTemplateColumns = '1fr 4fr';
            grillePrincipale.style.gridTemplateAreas = '' +
                '"Nav Nav"' +
                '"Entree Graphe"';
        } else {
            grillePrincipale.style.gridTemplateColumns = '1fr 3fr 1fr';
            grillePrincipale.style.gridTemplateAreas = '' +
                '"Nav Nav Nav"' +
                '"Entree Graphe Sortie"';
        }
    }
    else {
        if (entreeCachee) {
            document.getElementById("panneauEntree").classList.toggle("cache");
        }
        if (sortieCachee) {
            document.getElementById("panneauSortie").classList.toggle("cache");
        }
        grillePrincipale.style.gridTemplateColumns = '1fr';
        grillePrincipale.style.gridTemplateAreas = '' +
                '"Nav"' +
                '"Entree"' +
                '"Graphe"' +
                '"Sortie"';
    }

    if (IDpanel === "panneauEntree") {
        document.getElementById("flecheGauche").classList.toggle("tournee");
    } else {
        document.getElementById("flecheDroite").classList.toggle("tournee");
    }

    ajustementGraphique()
    if (typeof resize_graphs === 'function') {
        requestAnimationFrame(resize_graphs);
    }
}

function update_toggleEntreeSortie () {

    const grillePrincipale = document.querySelector(".grillePrincipale")
    let entreeCachee = document.getElementById("panneauEntree").classList.contains("cache")
    let sortieCachee = document.getElementById("panneauSortie").classList.contains("cache")

    if (window.innerWidth > 1200) {
        if (entreeCachee && sortieCachee) {
            grillePrincipale.style.gridTemplateColumns = '1fr';
            grillePrincipale.style.gridTemplateAreas = '' +
                '"Nav"' +
                '"Graphe"';
        } else if (entreeCachee) {
            grillePrincipale.style.gridTemplateColumns = '4fr 1fr';
            grillePrincipale.style.gridTemplateAreas = '' +
                '"Nav Nav"' +
                '"Graphe Sortie"';
        } else if (sortieCachee) {
            grillePrincipale.style.gridTemplateColumns = '1fr 4fr';
            grillePrincipale.style.gridTemplateAreas = '' +
                '"Nav Nav"' +
                '"Entree Graphe"';
        } else {
            grillePrincipale.style.gridTemplateColumns = '1fr 3fr 1fr';
            grillePrincipale.style.gridTemplateAreas = '' +
                '"Nav Nav Nav"' +
                '"Entree Graphe Sortie"';
        }
    }
    else {
        if (entreeCachee) {
            document.getElementById("panneauEntree").classList.toggle("cache");
        }
        if (sortieCachee) {
            document.getElementById("panneauSortie").classList.toggle("cache");
        }
        grillePrincipale.style.gridTemplateColumns = '1fr';
        grillePrincipale.style.gridTemplateAreas = '' +
                '"Nav"' +
                '"Entree"' +
                '"Graphe"' +
                '"Sortie"';
    }

    ajustementGraphique()
    if (typeof resize_graphs === 'function') {
        requestAnimationFrame(resize_graphs);
    }
}

/**
 * Fonction permettant d'ouvrir la fenêtre où la gestion des constantes a lieu
 */
function fenetreConstantes() {
    let url = "./constantes_universelles.html"
    window.open(url, "_blank", "width=500,height=250,resizable=no");
}

/**
 * Fonction permettant d'ouvrir la fenêtre contenant la calculette cosmologique
 */
function fenetreCalculette() {
    if (document.getElementById("Omégal0")) {
        savevalues(false)
        window.location.href = "Calculette_cosomologique_LCDM.html"
    } else {
        savevalues(true);
        window.location.href = "Calculette_cosomologique_DE.html"
    }
}

function savevalues(darkenergy=false){
    localStorage.setItem('T0',document.getElementById('T0').value);
    localStorage.setItem('H0',document.getElementById('H0').value);
    localStorage.setItem('optionsMonofluide',document.getElementById('optionsMonofluide').value);
    localStorage.setItem('Omégam0',document.getElementById('Omégam0').value);
    if (darkenergy){
        localStorage.setItem('OmégaDE0',document.getElementById('OmégaDE0').value);
        localStorage.setItem('w0',document.getElementById('w0').value);
        localStorage.setItem('w1',document.getElementById('w1').value);
    }else{
        localStorage.setItem('Omégal0',document.getElementById('Omégal0').value);
    }
    localStorage.setItem('optionsOmégar0',document.getElementById('optionsOmégar0').value);
    localStorage.setItem('test',document.getElementById('OptionsOmégak0').checked);
}

function loadvalues(darkenergy=false){
    if (localStorage.getItem("T0")!==null){
        document.getElementById('T0').value = localStorage.getItem('T0');
        document.getElementById('H0').value = localStorage.getItem('H0');
        document.getElementById('optionsMonofluide').value = localStorage.getItem('optionsMonofluide');
        document.getElementById('Omégam0').value = localStorage.getItem('Omégam0');
        if (darkenergy){
            document.getElementById('OmégaDE0').value = localStorage.getItem('OmégaDE0');
            document.getElementById('w0').value = localStorage.getItem('w0');
            document.getElementById('w1').value = localStorage.getItem('w1');
        }else{
            document.getElementById('Omégal0').value = localStorage.getItem('Omégal0');
        }
        document.getElementById('optionsOmégar0').value = localStorage.getItem('optionsOmégar0');
        if (localStorage.getItem('test') === "true") {
            document.getElementById('OptionsOmégak0').checked = true;
        }
        else {
            document.getElementById('OptionsOmégak0').checked = false;
        }
        localStorage.clear();
    }
}

/**
 * Fonction permettant d'ouvrir la fenêtre contenant la calculette cosmologique
 */
function fenetreFacteur() {
    if (document.getElementById("Omégal0")) {
        savevalues(false);
        window.location.href = "Univers_LCDM.html"
    } else {
        savevalues(true);
        window.location.href = "Univers_DE.html"
    }
}


/**
 * Fonction qui décide de quoi faire des instructions entrées en fonction du boutton utilisé
 * @param nomBoutton {string} Le nom du boutton pressé
 */
function envoisConstantes(nomBoutton) {
    let texte = o_recupereJson()

    let c = document.getElementById("c").value
    let G = document.getElementById("G").value
    let k = document.getElementById("k").value
    let h = document.getElementById("h").value
    let typeAnnee = document.getElementById("typeAnnee").value
    if (window.opener) {
        if (nomBoutton === "enregistrer") {
            window.opener.document.getElementById("c").value = c;
            window.opener.document.getElementById("G").value = G;
            window.opener.document.getElementById("k").value = k;
            window.opener.document.getElementById("h").value = h;
            window.opener.document.getElementById("typeAnnee").value = typeAnnee;
            window.close()
        }

        if (nomBoutton === "reset") {
            window.opener.document.getElementById("c").value = 299792458;
            window.opener.document.getElementById("G").value = 6.67385e-11;
            window.opener.document.getElementById("k").value = 1.38064852e-23;
            window.opener.document.getElementById("h").value = 6.62607004e-34;
            window.opener.document.getElementById("typeAnnee").value = "Grégorienne";
            window.close()
        }

        if (nomBoutton === "retour") {
            window.close()
        }
    } else {
        alert(texte.constante.alerteConstante)
        window.close()
    }
}

let timeoutId = null;

/**
 * Fonction pour retarder l'exécution d'une fonction
 */
function delaisUpdate(func, delay) {
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(context, args), delay);
    };
}

function universMonofluides() {
    let option = document.getElementById("optionsMonofluide").value
    let elementOmegaM = document.getElementById("Omégam0")
    let elementOmegaR = document.getElementById("Omégar0")
    let elementOmegaK = document.getElementById("Omégak0")

    let elementOmegaL;
    let elementOmegaDE;
    if ( document.getElementById("Omégal0") ) {
        elementOmegaL = document.getElementById("Omégal0")
    }

    if ( document.getElementById("OmégaDE0") ) {
        elementOmegaDE = document.getElementById("OmégaDE0")
    }

    if (option === "optionNull") {
        elementOmegaM.disabled = false;
        elementOmegaR.disabled = false;
        elementOmegaK.disabled = false;
        if ( document.getElementById("Omégal0") ) {
            elementOmegaL.disabled = false;
        }

        if ( document.getElementById("OmégaDE0") ) {
            elementOmegaDE.disabled = false;
        }

    } else {
        elementOmegaM.disabled = true;
        elementOmegaR.disabled = true;
        elementOmegaK.disabled = true;
        if ( document.getElementById("Omégal0") ) {
            elementOmegaL.disabled = true;
        }

        if ( document.getElementById("OmégaDE0") ) {
            elementOmegaDE.disabled = true;
        }
    }

    if (option === "optionM") {
        elementOmegaM.value = 1;
        elementOmegaR.value = 0;
        elementOmegaK.value = 0;
        if ( document.getElementById("Omégal0") ) {
            elementOmegaL.value = 0;
        }

        if ( document.getElementById("OmégaDE0") ) {
            elementOmegaDE.value = 0;
        }
    }

    if (option === "optionR") {
        elementOmegaM.value = 0;
        elementOmegaR.value = 1;
        elementOmegaK.value = 0;
        if ( document.getElementById("Omégal0") ) {
            elementOmegaL.value = 0;
        }

        if ( document.getElementById("OmégaDE0") ) {
            elementOmegaDE.value = 0;
        }
    }

    if (option === "optionLDE") {
        elementOmegaM.value = 0;
        elementOmegaR.value = 0;
        elementOmegaK.value = 0;
        if ( document.getElementById("Omégal0") ) {
            elementOmegaL.value = 1;
        }

        if ( document.getElementById("OmégaDE0") ) {
            elementOmegaDE.value = 1;
        }
    }

    if (option === "optionK") {
        elementOmegaM.value = 0;
        elementOmegaR.value = 0;
        elementOmegaK.value = 1;
        if ( document.getElementById("Omégal0") ) {
            elementOmegaL.value = 0;
        }

        if ( document.getElementById("OmégaDE0") ) {
            elementOmegaDE.value = 0;
        }
    }
}

/**
 * Fonction qui permet de rafraichir les valeurs du site pour chaque changement effectué
 */
function ajouterEcouteurs(fonctionUpdate) {
    const elements = document.querySelectorAll('input, select, list');
    const UpdateDelais = delaisUpdate(fonctionUpdate, 100);
    elements.forEach(element => {
        element.addEventListener('input', UpdateDelais);
        element.addEventListener('change', UpdateDelais);
    });
}

if (window.location.pathname==="/Calculette_cosomologique_LCDM.html"){
    window.onload = ajouterEcouteurs(updateCalculette);
} else {
    window.onload = ajouterEcouteurs(updateUnivers);
}

/**
 * Fonction qui permet de rafraîchir les éléments importants de la page univers
 */
function updateUnivers() {
    document.getElementById("loading").style.display="inline";
    setTimeout(() => {
    document.getElementById("Omégak0").value = Omega_k(0).toExponential(4)
    document.getElementById("Ok_enregistrer").innerHTML = "&Omega;<sub>k<sub>0</sub></sub> = " + Omega_k(0).toExponential(4)

    if (document.getElementById("Omégal0")) {
        document.getElementById("Omégal0").value = Omega_l(0).toExponential(4)
        document.getElementById("Ol_enregistrer").innerHTML = "&Omega;<sub>&Lambda;<sub>0</sub></sub> = " + Omega_l(0).toExponential(4)
    }

    if (document.getElementById("OmégaDE0")) {
        document.getElementById("OmégaDE0").value = Omega_DE(0).toExponential(4)
        document.getElementById("ODE_enregistrer").innerHTML = "&Omega;<sub>DE<sub>0</sub></sub> = " + Omega_DE(0).toExponential(4)
        document.getElementById("w0_enregistrer").innerHTML = "w<sub>0</sub> = " + document.getElementById("w0").value
        document.getElementById("w1_enregistrer").innerHTML = "w<sub>0</sub> = " + document.getElementById("w1").value
    }

    document.getElementById("Omégar0").value = Omega_r(0).toExponential(4)
    document.getElementById("Or_enregistrer").innerHTML = "&Omega;<sub>r<sub>0</sub></sub> = " + Omega_r(0).toExponential(4)

    document.getElementById("Omégam0").value = Omega_m(0).toExponential(4)
    document.getElementById("Om_enregistrer").innerHTML = "&Omega;<sub>m<sub>0</sub></sub> = " + Omega_m(0).toExponential(4)

    document.getElementById("tdébut_enregistrer").innerHTML = "t<sub>i</sub> = " + document.getElementById("début").innerHTML
    document.getElementById("tfin_enregistrer").innerHTML = "t<sub>f</sub> = " + document.getElementById("fin").innerHTML

    let fonction_simplifiante;
    let equa_diff_2;
    if (document.getElementById("Omégal0")) {
        fonction_simplifiante = fonction_E;
        equa_diff_2 = equa_diff_2_LCDM;
    } else {
        fonction_simplifiante = fonction_F;
        equa_diff_2 = equa_diff_2_DE;
    }
        let horizon_BB_BC = true //True si on veut les afficher false sinon mais dans tous les cas c'est sensé etre nan donc ca change rien
        //affichage des horizons seulement dans certains cas
        if (!(document.getElementById('optionsMonofluide').value === "optionNull")){//aucun horizons si univers monofluide (existe bien mais implementation pour le futur car différente formule)
            document.getElementById('horizonEvenement').style.display="none";
            document.getElementById('he_enregistrer').style.display="none"
            document.getElementById('horizonParticule').style.display="none";
            document.getElementById('hp_enregistrer').style.display="none"
        }else {
            let val_debut_fin=debut_fin_univers(equa_diff_2);
            if (val_debut_fin[2] === 0 && !horizon_BB_BC){//detecter s'il n'y a pas de big bang alors pas d'horizon des particules
                document.getElementById('horizonParticule').style.display="none";
                document.getElementById('hp_enregistrer').style.display="none"
            }else{
                let dm_horizon_particule_m = calcul_horizon_particule(fonction_simplifiante);
                if (isNaN(dm_horizon_particule_m) || (Math.sign(dm_horizon_particule_m)==-1)){
                    document.getElementById('horizonParticule').style.display="none";
                    document.getElementById('hp_enregistrer').style.display="none"
                }else{
                    document.getElementById('horizonParticule').style.display="block";
                }
                let dm_horizon_particule_pc = m_vers_pc(dm_horizon_particule_m);
                let dm_horizon_particule_al = m_vers_AL(dm_horizon_particule_m);
                document.getElementById("resultat_dm_particule_m").innerHTML = arrondie_affichage(dm_horizon_particule_m);
                document.getElementById("resultat_dm_particule_pc").innerHTML = arrondie_affichage(dm_horizon_particule_pc);
                document.getElementById("resultat_dm_particule_al").innerHTML = arrondie_affichage(dm_horizon_particule_al);
                document.getElementById("hp_enregistrer").innerHTML = "d<sub>p<sub>0</sub></sub> = " + dm_horizon_particule_pc.toExponential(4) + " pc"
            }
            if(val_debut_fin[3] === 0 && !horizon_BB_BC){//detecter si il y a big crunch alors pas d'horizon des evenements
                document.getElementById('horizonEvenement').style.display="none";
                document.getElementById('he_enregistrer').style.display="none"
            }else{
                document.getElementById('horizonEvenement').style.display="block";
                let dm_horizon_evenement_m = calcul_horizon_evenements(fonction_simplifiante);
                if (isNaN(dm_horizon_evenement_m) || (Math.sign(dm_horizon_evenement_m)==-1)){
                    document.getElementById('horizonEvenement').style.display="none";
                    document.getElementById('he_enregistrer').style.display="none"
                }else{
                    document.getElementById('horizonEvenement').style.display="block";
                }
                let dm_horizon_evenement_pc = m_vers_pc(dm_horizon_evenement_m);
                let dm_horizon_evenement_al = m_vers_AL(dm_horizon_evenement_m);
                document.getElementById("resultat_dm_evenement_m").innerHTML = arrondie_affichage(dm_horizon_evenement_m);
                document.getElementById("resultat_dm_evenement_pc").innerHTML = arrondie_affichage(dm_horizon_evenement_pc);
                document.getElementById("resultat_dm_evenement_al").innerHTML = arrondie_affichage(dm_horizon_evenement_al);
                document.getElementById("he_enregistrer").innerHTML = "d<sub>e<sub>0</sub></sub> = " + dm_horizon_evenement_pc.toExponential(4) + " pc"
            }
            
        }

       

        
    
        update_graphe_interactif();
        update_point()
    }, 100); 
    document.getElementById("loading").style.display = "none";
    }
    
/**
 * Fonction qui permet de rafraîchir les éléments importants de la page calculette
 */
function updateCalculette() {
    document.getElementById("Omégak0").value = Omega_k(0).toExponential(4)

    if (document.getElementById("Omégal0")) {
        document.getElementById("Omégal0").value = Omega_l(0).toExponential(4)
    }

    if (document.getElementById("OmégaDE0")) {
        document.getElementById("OmégaDE0").value = Omega_DE(0).toExponential(4)
    }

    document.getElementById("Omégar0").value = Omega_r(0).toExponential(4)

    document.getElementById("Omégam0").value = Omega_m(0).toExponential(4)

    if (document.getElementById("Omégal0")) {
        update_rho(0)
        resizeCanvas()
        update_graphe_interactif()
        update_point()
    } else {
        update_rho(1)
        resizeCanvas()
        update_graphe_interactif()
        update_point()
    }
    let equa_diff_2
    if (document.getElementById("Omégal0")) {
        equa_diff_2 = equa_diff_2_LCDM
    } else {
        equa_diff_2 = equa_diff_2_DE
    }
    if ((!debut_fin_univers(equa_diff_2, T0)[5] && Math.sign(document.getElementById("H0").value)==1) || (!debut_fin_univers(equa_diff_2, T0)[6] && Math.sign(document.getElementById("H0").value)==-1)) {
        document.getElementById("avertissement_nbb").classList.remove('cache')
        document.getElementById("avertissement_nbb2").classList.remove('cache')
    } else {
        document.getElementById("avertissement_nbb").classList.add('cache')
        document.getElementById("avertissement_nbb2").classList.add('cache')
    }

}

/**
 * fonction permettant de changer la taille du graphique dynamiquement, elle est utilisé dans un Event listener
 */
function ajustementGraphique() {
    if (document.getElementById("graphique_LCDM")) {
        Plotly.Plots.resize(document.getElementById("graphique_LCDM"));
    }
    if (document.getElementById("graphique_DE")) {
        Plotly.Plots.resize(document.getElementById("graphique_DE"));
    }
}
window.addEventListener('resize', ajustementGraphique());

/**
 * Redimensionne les wrappers des canvas de simulation trajectoire
 * pour remplir la largeur disponible du panneau central.
 */
function resize_graphs() {
    var graphePanel = document.getElementById('panneauGraphe');
    if (!graphePanel) return;
    var wrapperSchw = document.getElementById('wrapper');
    var wrapperKerr = document.querySelector('.wrapper_kerr');
    var wrapperPotentiel = document.getElementById('wrapper2');
    var wrapperPotentielKerr = document.getElementById('wrapper2_kerr');
    if (!wrapperSchw && !wrapperKerr && !wrapperPotentiel && !wrapperPotentielKerr) return;

    var size = Math.max(200, Math.min(graphePanel.clientWidth - 20, 1400));

    if (wrapperSchw) {
        wrapperSchw.style.width  = size + 'px';
        wrapperSchw.style.height = size + 'px';
    }
    if (wrapperKerr) {
        wrapperKerr.style.width  = size + 'px';
        wrapperKerr.style.height = size + 'px';
    }
    if (wrapperPotentiel) {
        if (window.innerWidth <= 1200) {
            wrapperPotentiel.style.width  = size + 'px';
            wrapperPotentiel.style.height = size + 'px';
        }
        else {
            wrapperPotentiel.style.width  = 400 + 'px';
            wrapperPotentiel.style.height = 400 + 'px';
        }
    }
    if (wrapperPotentielKerr) {
        if (window.innerWidth <= 1200) {
            wrapperPotentielKerr.style.width  = size + 'px';
            wrapperPotentielKerr.style.height = size + 'px';
        }
        else {
            wrapperPotentielKerr.style.width  = 400 + 'px';
            wrapperPotentielKerr.style.height = 400 + 'px';
        }
    }
}

window.addEventListener('resize', resize_graphs);
document.addEventListener('DOMContentLoaded', resize_graphs);

/**
 * Fonction qui permet de détecter un click sur le panneau d'avertissement dans univers
 */
function avertissement() {
    let message = document.getElementById('avertissementUnivers');
    var bouton = document.getElementById("bouton_avertissement");
    var croix = document.getElementById("croix");
    if (message.style.display === 'none' || message.style.display == "") {
        message.style.display = 'block';
        bouton.style.position = "absolute";
        bouton.style.gridArea = "auto";
        bouton.style.top = "0px";
        croix.style.display = "inline";
        bouton.style.color = 'black';
        bouton.style.backgroundColor = 'white';
        bouton.style.border = '2px solid black';
    } else {
        message.style.display = 'none';
        bouton.style.position = "relative";
        bouton.style.gridArea = "avertissement";
        bouton.style.removeProperty("top");
        croix.style.display = "none";
        bouton.style.backgroundColor = 'rgba(188, 167, 220, 0.6)';
        bouton.style.border = 'none';
    }
    ajustementGraphique()
}

//---------------------------------{info_univers}---------------------------------

/**
 * Fonction qui fait apparaître ou disparaître le message d'information de Univers en fonction de si il
 * était visible ou non.
 */
function info_univers(typePage) {

  var texte = o_recupereJson(); //Je récupère les textes du json.
  //Je récupère l'élément span d'ID "txt_avertissement_trajectoire" qui est l'espace pour l'avertissement :
  var span = document.getElementById("txt_info_univers"); 

  //Remplit l'espace avec le texte de l'avertissement :
  if (typePage == 'LCDM')
    span.innerHTML = texte.univers.infoLCDM;
  else if (typePage == 'DE')
    span.innerHTML = texte.univers.infoDE;
  else if (typePage == 'calculette_LCDM')
    span.innerHTML = texte.calculette.infoLCDM;
  else if (typePage == 'calculette_DE')
    span.innerHTML = texte.calculette.infoDE;


  //Si on appuie dessus :
  if(span.style.display == "none" || span.style.display == "") { //Alors qu'il était caché :

    //Il devient visible :
    span.style.display = "inline";

  } else { //Alors qu'il tait visible :

    //Il devient caché :
    span.style.display = "none";

  }
  ajustementGraphique()
}

/**
 * Fonction qui permet d'enregistrer un élément html sous plusieurs formats
 */
function enregistrer() {
    let format = document.getElementById("optionsEnregistrement").value
    let nom = document.getElementById("nom_fichier").value
    let element;
    if (format == "CSV") {
        let abs = sessionStorage.getItem("abs").split(",")
        let ord = sessionStorage.getItem("ord").split(",")
        downloadCSV(abs,ord, nom+".csv")
    } else if(format == "PNG"){
    if (document.getElementById("graphique_LCDM")) {
        element = document.getElementById("panneauGraphe")
    }
    if (document.getElementById("graphique_DE")) {
        element = document.getElementById("panneauGraphe")
    }
    html2canvas(element).then(canvas => {
        const URLimage = canvas.toDataURL("image/"+format)
        const lien = document.createElement("a")
        lien.href = URLimage
        lien.download = nom+"."+format.toLowerCase()
        lien.click()
    })
    } else {
        if (document.getElementById("graphique_LCDM")) {
            graph = "graphique_LCDM"
        } else {
            graph = "graphique_DE"
        }
        format = format.toLowerCase()
        Plotly.downloadImage(graph, {format: format, filename: nom})
    }

}

function enregistrer_calc() {
    let format = document.getElementById("optionsEnregistrement").value
    let nom = document.getElementById("nom_fichier").value
    let selection = document.getElementById("grapheSelection").value
    let item = "affichage_"+selection
    let graph = "graphique_"+selection
    if (sessionStorage.getItem(item)=="True") {
        format = format.toLowerCase()
        Plotly.downloadImage(graph, {format: format, filename: nom})
    }
}


function downloadCSV(array1, array2, filename = "data.csv") {
    // Combine the arrays: assume equal length and 2 columns
    const rows = array1.map((val, i) => [val, array2[i]]);
  
    // Add headers (optional)
    rows.unshift(["Time", "Reduced Scale Factor"]);
  
    // Convert to CSV string
    const csvContent = rows.map(e => e.join(";")).join("\n");
  
    // Create a Blob from the CSV string
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
    // Create a download link and trigger it
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  //Agrandir taille case si nécessaire
  function resizeInput(item) {
    item.style.width = Math.max(90, 7.86 * (8 + item.value.length)) + 'px';}


//---------------------------------{exemples}---------------------------------

/*
 * Fonction qui applique des préset d'exemple dans les parties Univers et Trajctoire
 */

function exemples(exemple) {

    //PARTIE UNIVERS

    if (exemple == "ex0UnivLCDM") {
        document.getElementById("T0").value = "2.7255";
        document.getElementById("H0").value = "67.74";
        document.getElementById("optionsMonofluide").value = "optionNull";
        document.getElementById("Omégam0").value = "0.3089";
        document.getElementById("Omégal0").value = "0.6911";
        document.getElementById("optionsOmégar0").value = "optionRFC_et_Neutrinos";
        document.getElementById("OptionsOmégak0").checked = false;
        document.getElementById("a_min").value = "0";
        document.getElementById("a_max").value = "5";
        updateUnivers();
        affichage_site_LCDM();
    }

    if (exemple == "ex1UnivLCDM") {
        document.getElementById("T0").value = "2.7255";
        document.getElementById("H0").value = "67.74";
        document.getElementById("optionsMonofluide").value = "optionNull";
        document.getElementById("Omégam0").value = "0.3089";
        document.getElementById("Omégal0").value = "0.6911";
        document.getElementById("optionsOmégar0").value = "optionRFC_et_Neutrinos";
        document.getElementById("OptionsOmégak0").checked = false;
        document.getElementById("a_min").value = "0";
        document.getElementById("a_max").value = "5";
        updateUnivers();
        affichage_site_LCDM();
    }

    if (exemple == "ex2UnivLCDM") {
        document.getElementById("T0").value = "300";
        document.getElementById("H0").value = "67";
        document.getElementById("optionsMonofluide").value = "optionM";
        document.getElementById("Omégam0").value = "0.4";
        document.getElementById("Omégal0").value = "0.8";
        document.getElementById("optionsOmégar0").value = "optionRFC";
        document.getElementById("OptionsOmégak0").checked = true;
        document.getElementById("a_min").value = "0";
        document.getElementById("a_max").value = "10";
        updateUnivers();
        affichage_site_LCDM();
    }

    if (exemple == "ex3UnivLCDM") {
        document.getElementById("T0").value = "67";
        document.getElementById("H0").value = "67";
        document.getElementById("optionsMonofluide").value = "optionK";
        document.getElementById("Omégam0").value = "0.67";
        document.getElementById("Omégal0").value = "0.67";
        document.getElementById("optionsOmégar0").value = "optionRien";
        document.getElementById("OptionsOmégak0").checked = false;
        document.getElementById("a_min").value = "0";
        document.getElementById("a_max").value = "67";
        updateUnivers();
        affichage_site_LCDM();
    }






    if (exemple == "ex0UnivDE") {
        document.getElementById("T0").value = "2.7255";
        document.getElementById("H0").value = "67.74";
        document.getElementById("optionsMonofluide").value = "optionNull";
        document.getElementById("Omégam0").value = "0.3089";
        document.getElementById("OmégaDE0").value = "0.6911";
        document.getElementById("w0").value = "-1";
        document.getElementById("w1").value = "0";
        document.getElementById("optionsOmégar0").value = "optionRFC_et_Neutrinos";
        document.getElementById("OptionsOmégak0").checked = false;
        document.getElementById("a_min").value = "0";
        document.getElementById("a_max").value = "5";
        updateUnivers();
        affichage_site_DE();
    }

    if (exemple == "ex1UnivDE") {
        document.getElementById("T0").value = "2.7255";
        document.getElementById("H0").value = "67.74";
        document.getElementById("optionsMonofluide").value = "optionNull";
        document.getElementById("Omégam0").value = "0.3089";
        document.getElementById("OmégaDE0").value = "0.6911";
        document.getElementById("w0").value = "-1";
        document.getElementById("w1").value = "0";
        document.getElementById("optionsOmégar0").value = "optionRFC_et_Neutrinos";
        document.getElementById("OptionsOmégak0").checked = false;
        document.getElementById("a_min").value = "0";
        document.getElementById("a_max").value = "5";
        updateUnivers();
        affichage_site_DE();
    }

    if (exemple == "ex2UnivDE") {
        document.getElementById("T0").value = "3";
        document.getElementById("H0").value = "67.74";
        document.getElementById("optionsMonofluide").value = "optionNull";
        document.getElementById("Omégam0").value = "0.3089";
        document.getElementById("OmégaDE0").value = "0.6911";
        document.getElementById("w0").value = "0";
        document.getElementById("w1").value = "-1";
        document.getElementById("optionsOmégar0").value = "optionRFC_et_Neutrinos";
        document.getElementById("OptionsOmégak0").checked = false;
        document.getElementById("a_min").value = "0";
        document.getElementById("a_max").value = "5";
        updateUnivers();
        affichage_site_DE();
    }

    if (exemple == "ex3UnivDE") {
        document.getElementById("T0").value = "67";
        document.getElementById("H0").value = "67";
        document.getElementById("optionsMonofluide").value = "optionNull";
        document.getElementById("Omégam0").value = "67";
        document.getElementById("OmégaDE0").value = "67";
        document.getElementById("w0").value = "-67";
        document.getElementById("w1").value = "67";
        document.getElementById("optionsOmégar0").value = "optionRFC_et_Neutrinos";
        document.getElementById("OptionsOmégak0").checked = false;
        document.getElementById("a_min").value = "0";
        document.getElementById("a_max").value = "67";
        updateUnivers();
        affichage_site_DE();
    }




    if (exemple == "ex0CalcLCDM") {
        document.getElementById("T0").value = "2.7255";
        document.getElementById("H0").value = "67.74";
        document.getElementById("optionsMonofluide").value = "optionNull";
        document.getElementById("Omégam0").value = "0.3089";
        document.getElementById("Omégal0").value = "0.6911";
        document.getElementById("optionsOmégar0").value = "optionRFC_et_Neutrinos";
        document.getElementById("OptionsOmégak0").checked = false;
        document.getElementById("graphique_z_min").value = "0";
        document.getElementById("graphique_z_max").value = "5";
        document.getElementById("graphique_pas").value = "300";
        updateCalculette();
    }

    if (exemple == "ex1CalcLCDM") {
        document.getElementById("T0").value = "2.7255";
        document.getElementById("H0").value = "67.74";
        document.getElementById("optionsMonofluide").value = "optionNull";
        document.getElementById("Omégam0").value = "0.3089";
        document.getElementById("Omégal0").value = "0.6911";
        document.getElementById("optionsOmégar0").value = "optionRFC_et_Neutrinos";
        document.getElementById("OptionsOmégak0").checked = false;
        document.getElementById("graphique_z_min").value = "0";
        document.getElementById("graphique_z_max").value = "5";
        document.getElementById("graphique_pas").value = "300";
        updateCalculette();
    }

    if (exemple == "ex2CalcLCDM") {
        document.getElementById("T0").value = "300";
        document.getElementById("H0").value = "67";
        document.getElementById("optionsMonofluide").value = "optionM";
        document.getElementById("Omégam0").value = "0.4";
        document.getElementById("Omégal0").value = "0.8";
        document.getElementById("optionsOmégar0").value = "optionRFC";
        document.getElementById("OptionsOmégak0").checked = true;
        document.getElementById("graphique_z_min").value = "-0.8";
        document.getElementById("graphique_z_max").value = "4";
        document.getElementById("graphique_pas").value = "50";
        updateCalculette();
    }

    if (exemple == "ex3CalcLCDM") {
        document.getElementById("T0").value = "67";
        document.getElementById("H0").value = "67";
        document.getElementById("optionsMonofluide").value = "optionK";
        document.getElementById("Omégam0").value = "0.67";
        document.getElementById("Omégal0").value = "0.67";
        document.getElementById("optionsOmégar0").value = "optionRien";
        document.getElementById("OptionsOmégak0").checked = false;
        document.getElementById("graphique_z_min").value = "0";
        document.getElementById("graphique_z_max").value = "67";
        document.getElementById("graphique_pas").value = "67";
        updateCalculette();
    }





    if (exemple == "ex0CalcDE") {
        document.getElementById("T0").value = "2.7255";
        document.getElementById("H0").value = "67.74";
        document.getElementById("optionsMonofluide").value = "optionNull";
        document.getElementById("Omégam0").value = "0.3089";
        document.getElementById("OmégaDE0").value = "0.6911";
        document.getElementById("w0").value = "-1";
        document.getElementById("w1").value = "0";
        document.getElementById("optionsOmégar0").value = "optionRFC_et_Neutrinos";
        document.getElementById("OptionsOmégak0").checked = false;
        document.getElementById("graphique_z_min").value = "0";
        document.getElementById("graphique_z_max").value = "5";
        document.getElementById("graphique_pas").value = "300";
        updateCalculette();
    }

    if (exemple == "ex1CalcDE") {
        document.getElementById("T0").value = "2.7255";
        document.getElementById("H0").value = "67.74";
        document.getElementById("optionsMonofluide").value = "optionNull";
        document.getElementById("Omégam0").value = "0.3089";
        document.getElementById("OmégaDE0").value = "0.6911";
        document.getElementById("w0").value = "-1";
        document.getElementById("w1").value = "0";
        document.getElementById("optionsOmégar0").value = "optionRFC_et_Neutrinos";
        document.getElementById("OptionsOmégak0").checked = false;
        document.getElementById("graphique_z_min").value = "0";
        document.getElementById("graphique_z_max").value = "5";
        document.getElementById("graphique_pas").value = "300";
        updateCalculette();
    }

    if (exemple == "ex2CalcDE") {
        document.getElementById("T0").value = "300";
        document.getElementById("H0").value = "67";
        document.getElementById("optionsMonofluide").value = "optionM";
        document.getElementById("Omégam0").value = "0.4";
        document.getElementById("OmégaDE0").value = "0.8";
        document.getElementById("w0").value = "0";
        document.getElementById("w1").value = "-1";
        document.getElementById("optionsOmégar0").value = "optionRFC";
        document.getElementById("OptionsOmégak0").checked = true;
        document.getElementById("graphique_z_min").value = "-0.8";
        document.getElementById("graphique_z_max").value = "4";
        document.getElementById("graphique_pas").value = "50";
        updateCalculette();
    }

    if (exemple == "ex3CalcDE") {
        document.getElementById("T0").value = "67";
        document.getElementById("H0").value = "67";
        document.getElementById("optionsMonofluide").value = "optionNull";
        document.getElementById("Omégam0").value = "0.67";
        document.getElementById("OmégaDE0").value = "0.67";
        document.getElementById("w0").value = "-67";
        document.getElementById("w1").value = "67";
        document.getElementById("optionsOmégar0").value = "optionRien";
        document.getElementById("OptionsOmégak0").checked = false;
        document.getElementById("graphique_z_min").value = "0";
        document.getElementById("graphique_z_max").value = "67";
        document.getElementById("graphique_pas").value = "67";
        updateCalculette();
    }



    //PARTIE TRAJECTOIRE

    if (exemple == "ex0SCH1") {
        document.getElementById("M").value = "2e39";
        document.getElementById("r_phy").value = "0";
        document.getElementById("nombredefusees").value = "1";
        supprHtml();
        genereHtml();
        save_nbfusees();
        updatenbredefusees();

        document.getElementById("r01").value = "2e13";
        document.getElementById("v01").value = "7.75e7";
        document.getElementById("phi01").value = "0";
        document.getElementById("teta1").value = "90";

        document.getElementById("pourcentage_vphi_pilotage").value = "0.003";
        document.getElementById("traject_type").value = "complete";
        document.getElementById("traject_type2").value = "observateur";

        document.getElementById("rebondd").className = "bouttonChoix-inverse";
        document.getElementById("reb").value = "0";
        ammortUpdate(0);
        document.getElementById("boutton_ammorti").value = "0";//on stocke la valeur à 0 pour savoir que ce n'est pas affiché à present
        document.getElementById("barre_reb").style.display = "none"; //on le cache

        pressionBouttonTrajectoireComplete();
        pressionBouttonObservateur(false);
        notationvitesseree2();

        // Équivalent de l'écouteur d'évènement de inputRphysique :
		document.getElementById("rebondd").style.display="none"; 
		document.getElementById("barre_reb").style.display="none";
		document.getElementById("sp_reb").style.display="none";
		update_toggleEntreeSortie();

        // Équivalent de l'écouteur d'évènement de btnObservateur :
       
        inputNbfusees_div.style.display="flex";
		labelPourcentageVphiPilotage.style.display = "none";
		inputPourcentageVphiPilotage.style.display = "none";

        initialisationGenerale(1);
    }

    if (exemple == "ex1SCH1") {
        document.getElementById("M").value = "1.9884e30";
        document.getElementById("r_phy").value = "0";
        document.getElementById("nombredefusees").value = "1";
        supprHtml();
        genereHtml();
        save_nbfusees();
        updatenbredefusees();

        document.getElementById("r01").value = "12000";
        document.getElementById("v01").value = "1.21112418e8";
        document.getElementById("phi01").value = "0";
        document.getElementById("teta1").value = "90";

        document.getElementById("pourcentage_vphi_pilotage").value = "0.003";
        document.getElementById("traject_type").value = "complete";
        document.getElementById("traject_type2").value = "mobile";

        document.getElementById("rebondd").className = "bouttonChoix-inverse";
        document.getElementById("reb").value = "0";
        ammortUpdate(0);
        document.getElementById("boutton_ammorti").value = "0";//on stocke la valeur à 0 pour savoir que ce n'est pas affiché à present
        document.getElementById("barre_reb").style.display = "none"; //on le cache

        pressionBouttonTrajectoireComplete();
        pressionBouttonMobile(false);
        notationvitesseree2();

        // Équivalent de l'écouteur d'évènement de inputRphysique :
		document.getElementById("rebondd").style.display="none"; 
		document.getElementById("barre_reb").style.display="none";
		document.getElementById("sp_reb").style.display="none";
		update_toggleEntreeSortie();

        // Équivalent de l'écouteur d'évènement de btnSpationaute :

        /*Juste pour avoir les valeurs rentrées avant de cliquer sur spationaute*/
		const r01 = document.getElementById("r01").value;
		const v01 = document.getElementById("v01").value;
		const phi01 = document.getElementById("phi01").value;
		const teta1 = document.getElementById("teta1").value;

		inputNbfusees.value='1'; // on met un seul mobile
		const event = new Event('change');//on met à jour tout le changement en appelant la sa fonctionnalité de changement
		inputNbfusees.dispatchEvent(event);
		document.getElementById("r01").value=r01;
		document.getElementById("v01").value=v01;
		document.getElementById("phi01").value=phi01;
		document.getElementById("teta1").value=teta1;
		
		initialisationGenerale(1);//on actualise les valeurs de simulation


		inputNbfusees_div.style.display ="none";
		labelPourcentageVphiPilotage.style.display = "inline";
		inputPourcentageVphiPilotage.style.display = "inline";
    }

    if (exemple == "ex2SCH1") {
        document.getElementById("M").value = "2e13";
        document.getElementById("r_phy").value = "1000";
        document.getElementById("nombredefusees").value = "2";
        supprHtml();
        genereHtml();
        save_nbfusees();
        updatenbredefusees();

        document.getElementById("r01").value = "3000";
        document.getElementById("v01").value = "0.4";
        document.getElementById("phi01").value = "0";
        document.getElementById("teta1").value = "65";

        document.getElementById("r02").value = "5000";
        document.getElementById("v02").value = "0.5";
        document.getElementById("phi02").value = "0";
        document.getElementById("teta2").value = "250";

        document.getElementById("pourcentage_vphi_pilotage").value = "0.003";
        document.getElementById("traject_type").value = "complete";
        document.getElementById("traject_type2").value = "observateur";

        document.getElementById("rebondd").className = "bouttonChoix";
        document.getElementById("reb").value = "30";
        ammortUpdate(30);
        document.getElementById("boutton_ammorti").value = "1"; //on stocke la valeur à 1 pour savoir que c'est affiché à present
        document.getElementById("barre_reb").style.display = "flex"; //on l'affiche

        pressionBouttonTrajectoireComplete();
        pressionBouttonObservateur(false);
        notationvitesseree2();

        // Équivalent de l'écouteur d'évènement de inputRphysique :
        document.getElementById("rebondd").style.display="inline";
		document.getElementById("sp_reb").style.display="flex";
		update_toggleEntreeSortie();

        // Équivalent de l'écouteur d'évènement de btnObservateur :
       
        inputNbfusees_div.style.display="flex";
		labelPourcentageVphiPilotage.style.display = "none";
		inputPourcentageVphiPilotage.style.display = "none";

        initialisationGenerale(2);
    }

    if (exemple == "ex3SCH1") {
        document.getElementById("M").value = "5.97e24";
        document.getElementById("r_phy").value = "6.4e6";
        document.getElementById("nombredefusees").value = "1";
        supprHtml();
        genereHtml();
        save_nbfusees();
        updatenbredefusees();

        document.getElementById("r01").value = "6.9e6";
        document.getElementById("v01").value = "7.5989e3";
        document.getElementById("phi01").value = "0";
        document.getElementById("teta1").value = "90";

        document.getElementById("pourcentage_vphi_pilotage").value = "0.003";
        document.getElementById("traject_type").value = "complete";
        document.getElementById("traject_type2").value = "mobile";
        
        document.getElementById("rebondd").className = "bouttonChoix-inverse";
        document.getElementById("reb").value = "0";
        ammortUpdate(0);
        document.getElementById("boutton_ammorti").value = "0";//on stocke la valeur à 0 pour savoir que ce n'est pas affiché à present
        document.getElementById("barre_reb").style.display = "none"; //on le cache

        pressionBouttonTrajectoireComplete();
        pressionBouttonMobile(false);
        notationvitesseree2();

        // Équivalent de l'écouteur d'évènement de inputRphysique :
        document.getElementById("rebondd").style.display="inline";
		document.getElementById("sp_reb").style.display="flex";
		update_toggleEntreeSortie();

        // Équivalent de l'écouteur d'évènement de btnSpationaute :

        /*Juste pour avoir les valeurs rentrées avant de cliquer sur spationaute*/
		const r01 = document.getElementById("r01").value;
		const v01 = document.getElementById("v01").value;
		const phi01 = document.getElementById("phi01").value;
		const teta1 = document.getElementById("teta1").value;

		inputNbfusees.value='1'; // on met un seul mobile
		const event = new Event('change');//on met à jour tout le changement en appelant la sa fonctionnalité de changement
		inputNbfusees.dispatchEvent(event);
		document.getElementById("r01").value=r01;
		document.getElementById("v01").value=v01;
		document.getElementById("phi01").value=phi01;
		document.getElementById("teta1").value=teta1;
		
		initialisationGenerale(1);//on actualise les valeurs de simulation


		inputNbfusees_div.style.display ="none";
		labelPourcentageVphiPilotage.style.display = "inline";
		inputPourcentageVphiPilotage.style.display = "inline";
    }



    if (exemple == "ex0SCH2") {
        document.getElementById("M").value = "8e36";
        document.getElementById("r_phy").value = "0";
        document.getElementById("nombredefusees").value = "1";
        supprHtml();
        genereHtml();
        save_nbfusees();
        updatenbredefusees();

        document.getElementById("r01").value = "1.7685e11";
        document.getElementById("phi01").value = "-10";
        document.getElementById("teta1").value = "190";

        document.getElementById("traject_type").value = "complete";
        document.getElementById("traject_type2").value = "observateur";

        document.getElementById("rebondd").className = "bouttonChoix-inverse";
        document.getElementById("boutton_ammorti").value = "0";//on stocke la valeur à 0 pour savoir que ce n'est pas affiché à present

        pressionBouttonTrajectoireComplete();
        pressionBouttonObservateur(false);
        notationvitesseree1();

        // Équivalent de l'écouteur d'évènement de inputRphysique :
		document.getElementById("rebondd").style.display="none"; 
		document.getElementById("sp_reb").style.display="none";
		update_toggleEntreeSortie();

        // Équivalent de l'écouteur d'évènement de btnObservateur :
       
        inputNbfusees.style.display = "inline"; // Afficher le input et le label de nbfusees si button observateur est cliqué 
		labelNbfusees.style.display = "inline"; 

        initialisationGenerale(1);
    }

    if (exemple == "ex1SCH2") {
        document.getElementById("M").value = "8e36";
        document.getElementById("r_phy").value = "0";
        document.getElementById("nombredefusees").value = "1";
        supprHtml();
        genereHtml();
        save_nbfusees();
        updatenbredefusees();

        document.getElementById("r01").value = "1.7685e11";
        document.getElementById("phi01").value = "-10";
        document.getElementById("teta1").value = "190";

        document.getElementById("traject_type").value = "complete";
        document.getElementById("traject_type2").value = "mobile";

        document.getElementById("rebondd").className = "bouttonChoix-inverse";
        document.getElementById("boutton_ammorti").value = "0";//on stocke la valeur à 0 pour savoir que ce n'est pas affiché à present

        pressionBouttonTrajectoireComplete();
        pressionBouttonMobile(false);
        notationvitesseree1();

        // Équivalent de l'écouteur d'évènement de inputRphysique :
		document.getElementById("rebondd").style.display="none"; 
		document.getElementById("sp_reb").style.display="none";
		update_toggleEntreeSortie();

        // Équivalent de l'écouteur d'évènement de btnSpationaute :

        /*Juste pour avoir les valeurs rentrées avant de cliquer sur spationaute*/
		const r01 = document.getElementById("r01").value;
		const phi01 = document.getElementById("phi01").value;
		const teta1 = document.getElementById("teta1").value;

		inputNbfusees.value='1'; // on met un seul mobile
		const event = new Event('change');//on met à jour tout le changement en appelant la sa fonctionnalité de changement
		inputNbfusees.dispatchEvent(event);
		document.getElementById("r01").value=r01;
		document.getElementById("phi01").value=phi01;
		document.getElementById("teta1").value=teta1;
		
		initialisationGenerale(1);//on actualise les valeurs de simulation

		inputNbfusees.style.display ="none";
		labelNbfusees.style.display = "none";
    }

    if (exemple == "ex2SCH2") {
        document.getElementById("M").value = "2e30";
        document.getElementById("r_phy").value = "0";
        document.getElementById("nombredefusees").value = "2";
        supprHtml();
        genereHtml();
        save_nbfusees();
        updatenbredefusees();

        document.getElementById("r01").value = "1e4";
        document.getElementById("phi01").value = "120";
        document.getElementById("teta1").value = "-135";

        document.getElementById("r02").value = "1e4";
        document.getElementById("phi02").value = "135";
        document.getElementById("teta2").value = "210";

        document.getElementById("traject_type").value = "complete";
        document.getElementById("traject_type2").value = "observateur";

        document.getElementById("rebondd").className = "bouttonChoix-inverse";
        document.getElementById("boutton_ammorti").value = "0";//on stocke la valeur à 0 pour savoir que ce n'est pas affiché à present

        pressionBouttonTrajectoireComplete();
        pressionBouttonObservateur(false);
        notationvitesseree1();

        // Équivalent de l'écouteur d'évènement de inputRphysique :
		document.getElementById("rebondd").style.display="none"; 
		document.getElementById("sp_reb").style.display="none";
		update_toggleEntreeSortie();


        // Équivalent de l'écouteur d'évènement de btnObservateur :
       
        inputNbfusees.style.display = "inline"; // Afficher le input et le label de nbfusees si button observateur est cliqué 
		labelNbfusees.style.display = "inline"; 

        initialisationGenerale(2);
    }

    if (exemple == "ex3SCH2") {
        document.getElementById("M").value = "2e30";
        document.getElementById("r_phy").value = "3e3";
        document.getElementById("nombredefusees").value = "1";
        supprHtml();
        genereHtml();
        save_nbfusees();
        updatenbredefusees();

        document.getElementById("r01").value = "1e4";
        document.getElementById("phi01").value = "135";
        document.getElementById("teta1").value = "210";

        document.getElementById("traject_type").value = "complete";
        document.getElementById("traject_type2").value = "mobile";

        document.getElementById("rebondd").className = "bouttonChoix";
        document.getElementById("boutton_ammorti").value = "1"; //on stocke la valeur à 1 pour savoir que c'est affiché à present

        pressionBouttonTrajectoireSimple();
        pressionBouttonMobile(false);
        notationvitesseree1();

        // Équivalent de l'écouteur d'évènement de inputRphysique :
        document.getElementById("rebondd").style.display="inline";
		document.getElementById("sp_reb").style.display="flex";
		update_toggleEntreeSortie();

        // Équivalent de l'écouteur d'évènement de btnSpationaute :

        /*Juste pour avoir les valeurs rentrées avant de cliquer sur spationaute*/
		const r01 = document.getElementById("r01").value;
		const phi01 = document.getElementById("phi01").value;
		const teta1 = document.getElementById("teta1").value;

		inputNbfusees.value='1'; // on met un seul mobile
		const event = new Event('change');//on met à jour tout le changement en appelant la sa fonctionnalité de changement
		inputNbfusees.dispatchEvent(event);
		document.getElementById("r01").value=r01;
		document.getElementById("phi01").value=phi01;
		document.getElementById("teta1").value=teta1;
		
		initialisationGenerale(1);//on actualise les valeurs de simulation

		inputNbfusees.style.display ="none";
		labelNbfusees.style.display = "none";
    }




    if (exemple == "ex0SCH3") {
        document.getElementById("M").value = "2e39";
        document.getElementById("r_phy").value = "1e18";
        document.getElementById("nombredefusees").value = "1";
        supprHtml();
        genereHtml();
        save_nbfusees();
        updatenbredefusees();

        document.getElementById("r01").value = "2e18";
        document.getElementById("v01").value = "2.5e4";
        document.getElementById("phi01").value = "0";
        document.getElementById("teta1").value = "110";

        document.getElementById("pourcentage_vphi_pilotage").value = "0.003";
        document.getElementById("traject_type").value = "complete";
        document.getElementById("traject_type2").value = "observateur";

        pressionBouttonTrajectoireComplete();
        pressionBouttonObservateur(false);
        notationvitesseree2();


        // Équivalent de l'écouteur d'évènement de btnObservateur :
       
        inputNbfusees.style.display = "inline"; // Afficher le input et le label de nbfusees si button observateur est cliqué 
		labelNbfusees.style.display = "inline";
		labelPourcentageVphiPilotage.style.display = "none";
		inputPourcentageVphiPilotage.style.display = "none";

        initialisationGenerale(1);
    }

    if (exemple == "ex1SCH3") {
        document.getElementById("M").value = "2e30";
        document.getElementById("r_phy").value = "7e8";
        document.getElementById("nombredefusees").value = "3";
        supprHtml();
        genereHtml();
        save_nbfusees();
        updatenbredefusees();

        document.getElementById("r01").value = "9e8";
        document.getElementById("v01").value = "3e5";
        document.getElementById("phi01").value = "0";
        document.getElementById("teta1").value = "90";

        document.getElementById("r02").value = "4e8";
        document.getElementById("v02").value = "3e5";
        document.getElementById("phi02").value = "90";
        document.getElementById("teta2").value = "90";

        document.getElementById("r03").value = "6e8";
        document.getElementById("v03").value = "3e5";
        document.getElementById("phi03").value = "180";
        document.getElementById("teta3").value = "90";

        document.getElementById("pourcentage_vphi_pilotage").value = "0.003";
        document.getElementById("traject_type").value = "complete";
        document.getElementById("traject_type2").value = "observateur";

        pressionBouttonTrajectoireComplete();
        pressionBouttonObservateur(false);
        notationvitesseree2();


        // Équivalent de l'écouteur d'évènement de btnObservateur :
       
        inputNbfusees.style.display = "inline"; // Afficher le input et le label de nbfusees si button observateur est cliqué 
		labelNbfusees.style.display = "inline";
		labelPourcentageVphiPilotage.style.display = "none";
		inputPourcentageVphiPilotage.style.display = "none";

        initialisationGenerale(3);
    }

    if (exemple == "ex2SCH3") {
        document.getElementById("M").value = "5.97e24";
        document.getElementById("r_phy").value = "500";
        document.getElementById("nombredefusees").value = "2";
        supprHtml();
        genereHtml();
        save_nbfusees();
        updatenbredefusees();

        document.getElementById("r01").value = "2e3";
        document.getElementById("v01").value = "4.46335e5";
        document.getElementById("phi01").value = "20";
        document.getElementById("teta1").value = "90";

        document.getElementById("r02").value = "4e3";
        document.getElementById("v02").value = "3.15606e5";
        document.getElementById("phi02").value = "140";
        document.getElementById("teta2").value = "-90";

        document.getElementById("pourcentage_vphi_pilotage").value = "0.003";
        document.getElementById("traject_type").value = "complete";
        document.getElementById("traject_type2").value = "observateur";

        pressionBouttonTrajectoireComplete();
        pressionBouttonObservateur(false);
        notationvitesseree2();


        // Équivalent de l'écouteur d'évènement de btnObservateur :
       
        inputNbfusees.style.display = "inline"; // Afficher le input et le label de nbfusees si button observateur est cliqué 
		labelNbfusees.style.display = "inline";
		labelPourcentageVphiPilotage.style.display = "none";
		inputPourcentageVphiPilotage.style.display = "none";

        initialisationGenerale(2);
    }

    if (exemple == "ex3SCH3") {
        document.getElementById("M").value = "2e30";
        document.getElementById("r_phy").value = "7e8";
        document.getElementById("nombredefusees").value = "1";
        supprHtml();
        genereHtml();
        save_nbfusees();
        updatenbredefusees();

        document.getElementById("r01").value = "1e9";
        document.getElementById("v01").value = "5e4";
        document.getElementById("phi01").value = "0";
        document.getElementById("teta1").value = "120";

        document.getElementById("pourcentage_vphi_pilotage").value = "0.003";
        document.getElementById("traject_type").value = "complete";
        document.getElementById("traject_type2").value = "mobile";

        pressionBouttonTrajectoireComplete();
        pressionBouttonMobile(false);
        notationvitesseree2();


        // Équivalent de l'écouteur d'évènement de btnSpationaute :

        /*Juste pour avoir les valeurs rentrées avant de cliquer sur spationaute*/
		const r01 = document.getElementById("r01").value;
		const v01 = document.getElementById("v01").value;
		const phi01 = document.getElementById("phi01").value;
		const teta1 = document.getElementById("teta1").value;

		inputNbfusees.value='1'; // on met un seul mobile
		const event = new Event('change');//on met à jour tout le changement en appelant la sa fonctionnalité de changement
		inputNbfusees.dispatchEvent(event);
		document.getElementById("r01").value=r01;
		document.getElementById("v01").value=v01;
		document.getElementById("phi01").value=phi01;
		document.getElementById("teta1").value=teta1;
		
		initialisationGenerale(1);//on actualise les valeurs de simulation


		inputNbfusees.style.display = "none"; // Masquer le input et le label de nbfusees si button spationaute est cliqué 
		labelNbfusees.style.display = "none";
		labelPourcentageVphiPilotage.style.display = "inline";
		inputPourcentageVphiPilotage.style.display = "inline";
    }



    if (exemple == "ex0SCH4") {
        document.getElementById("M").value = "2e30";
        document.getElementById("r_phy").value = "3.5e3";
        document.getElementById("nombredefusees").value = "1";
        supprHtml();
        genereHtml();
        save_nbfusees();
        updatenbredefusees();

        document.getElementById("r01").value = "5e3";
        document.getElementById("phi01").value = "0";
        document.getElementById("teta1").value = "120";

        document.getElementById("traject_type").value = "complete";
        document.getElementById("traject_type2").value = "observateur";

        pressionBouttonTrajectoireComplete();
        pressionBouttonObservateur(false);
        notationvitesseree1();


        // Équivalent de l'écouteur d'évènement de btnObservateur :
       
        inputNbfusees.style.display = "inline"; // Afficher le input et le label de nbfusees si button observateur est cliqué 
		labelNbfusees.style.display = "inline"; 

        initialisationGenerale(1);
    }

    if (exemple == "ex1SCH4") {
        document.getElementById("M").value = "2e30";
        document.getElementById("r_phy").value = "3.5e3";
        document.getElementById("nombredefusees").value = "1";
        supprHtml();
        genereHtml();
        save_nbfusees();
        updatenbredefusees();

        document.getElementById("r01").value = "1.95907e3";
        document.getElementById("phi01").value = "200";
        document.getElementById("teta1").value = "120";

        document.getElementById("traject_type").value = "complete";
        document.getElementById("traject_type2").value = "observateur";

        pressionBouttonTrajectoireComplete();
        pressionBouttonObservateur(false);
        notationvitesseree1();


        // Équivalent de l'écouteur d'évènement de btnObservateur :
       
        inputNbfusees.style.display = "inline"; // Afficher le input et le label de nbfusees si button observateur est cliqué 
		labelNbfusees.style.display = "inline"; 

        initialisationGenerale(1);
    }

    if (exemple == "ex2SCH4") {
        document.getElementById("M").value = "2e30";
        document.getElementById("r_phy").value = "3.5e3";
        document.getElementById("nombredefusees").value = "2";
        supprHtml();
        genereHtml();
        save_nbfusees();
        updatenbredefusees();

        document.getElementById("r01").value = "5e3";
        document.getElementById("phi01").value = "0";
        document.getElementById("teta1").value = "120";

        document.getElementById("r02").value = "2e3";
        document.getElementById("phi02").value = "-50";
        document.getElementById("teta2").value = "120";

        document.getElementById("traject_type").value = "complete";
        document.getElementById("traject_type2").value = "observateur";

        pressionBouttonTrajectoireComplete();
        pressionBouttonObservateur(false);
        notationvitesseree1();


        // Équivalent de l'écouteur d'évènement de btnObservateur :
       
        inputNbfusees.style.display = "inline"; // Afficher le input et le label de nbfusees si button observateur est cliqué 
		labelNbfusees.style.display = "inline"; 

        initialisationGenerale(2);
    }

    if (exemple == "ex3SCH4") {
        document.getElementById("M").value = "5.97e24";
        document.getElementById("r_phy").value = "6.4e8";
        document.getElementById("nombredefusees").value = "1";
        supprHtml();
        genereHtml();
        save_nbfusees();
        updatenbredefusees();

        document.getElementById("r01").value = "1e9";
        document.getElementById("phi01").value = "0";
        document.getElementById("teta1").value = "160";

        document.getElementById("traject_type").value = "complete";
        document.getElementById("traject_type2").value = "mobile";

        pressionBouttonTrajectoireComplete();
        pressionBouttonMobile(false);
        notationvitesseree1();


        // Équivalent de l'écouteur d'évènement de btnSpationaute :

        /*Juste pour avoir les valeurs rentrées avant de cliquer sur spationaute*/
		const r01 = document.getElementById("r01").value;
		const phi01 = document.getElementById("phi01").value;
		const teta1 = document.getElementById("teta1").value;

		inputNbfusees.value='1'; // on met un seul mobile
		const event = new Event('change');//on met à jour tout le changement en appelant la sa fonctionnalité de changement
		inputNbfusees.dispatchEvent(event);
		document.getElementById("r01").value=r01;
		document.getElementById("phi01").value=phi01;
		document.getElementById("teta1").value=teta1;
		
		initialisationGenerale(1);//on actualise les valeurs de simulation

		inputNbfusees.style.display ="none";
		labelNbfusees.style.display = "none";
    }






    if (exemple == "ex0Kerr1") {
        document.getElementById("M").value = "1.9e38";
        document.getElementById("J").value = "8.033e57";

        document.getElementById("r0").value = "5e11";
        document.getElementById("v0").value = "1.75e8";
        document.getElementById("phi0").value = "0";
        document.getElementById("teta").value = "90";

        document.getElementById("pourcentage_vphi_pilotage").value = "0.003";
        document.getElementById("traject_type").value = "complete";
        document.getElementById("traject_type2").value = "observateur";
        document.getElementById("depasser").checked = false;

        pressionBouttonTrajectoireComplete();
        pressionBouttonObservateur(true);
        notationvitesseree2kerr();
        initialisation();


        // Équivalent de l'écouteur d'évènement de btnObservateur :
       
		labelPourcentageVphiPilotage.style.display = "none";
		inputPourcentageVphiPilotage.style.display = "none";
    }

    if (exemple == "ex1Kerr1") {
        document.getElementById("M").value = "1.9e38";
        document.getElementById("J").value = "8.033e57";

        document.getElementById("r0").value = "5e11";
        document.getElementById("v0").value = "1.75e8";
        document.getElementById("phi0").value = "0";
        document.getElementById("teta").value = "90";

        document.getElementById("pourcentage_vphi_pilotage").value = "0.003";
        document.getElementById("traject_type").value = "complete";
        document.getElementById("traject_type2").value = "mobile";
        document.getElementById("depasser").checked = true;

        pressionBouttonTrajectoireComplete();
        pressionBouttonMobile(true);
        notationvitesseree2kerr();
        initialisation();


        // Équivalent de l'écouteur d'évènement de btnSpationaute :

		labelPourcentageVphiPilotage.style.display = "inline";
		inputPourcentageVphiPilotage.style.display = "inline";
    }

    if (exemple == "ex2Kerr1") {
        document.getElementById("M").value = "1.9e38";
        document.getElementById("J").value = "7.8e57";

        document.getElementById("r0").value = "5e11";
        document.getElementById("v0").value = "1e8";
        document.getElementById("phi0").value = "0";
        document.getElementById("teta").value = "90";

        document.getElementById("pourcentage_vphi_pilotage").value = "0.003";
        document.getElementById("traject_type").value = "complete";
        document.getElementById("traject_type2").value = "observateur";
        document.getElementById("depasser").checked = false;

        pressionBouttonTrajectoireComplete();
        pressionBouttonObservateur(true);
        notationvitesseree2kerr();
        initialisation();


        // Équivalent de l'écouteur d'évènement de btnObservateur :
       
		labelPourcentageVphiPilotage.style.display = "none";
		inputPourcentageVphiPilotage.style.display = "none";
    }

    if (exemple == "ex3Kerr1") {
        document.getElementById("M").value = "2e30";
        document.getElementById("J").value = "8.5e41";

        document.getElementById("r0").value = "5e3";
        document.getElementById("v0").value = "5e7";
        document.getElementById("phi0").value = "0";
        document.getElementById("teta").value = "90";

        document.getElementById("pourcentage_vphi_pilotage").value = "0.003";
        document.getElementById("traject_type").value = "complete";
        document.getElementById("traject_type2").value = "mobile";
        document.getElementById("depasser").checked = true;

        pressionBouttonTrajectoireComplete();
        pressionBouttonMobile(true);
        notationvitesseree2kerr();
        initialisation();


        // Équivalent de l'écouteur d'évènement de btnSpationaute :

		labelPourcentageVphiPilotage.style.display = "inline";
		inputPourcentageVphiPilotage.style.display = "inline";
    }




    if (exemple == "ex0Kerr2") {
        document.getElementById("M").value = "2e30";
        document.getElementById("J").value = "8.5e41";

        document.getElementById("r0").value = "4455";
        document.getElementById("phi0").value = "0";
        document.getElementById("teta").value = "128";

        document.getElementById("traject_type").value = "complete";
        document.getElementById("traject_type2").value = "observateur";
        document.getElementById("depasser").checked = false;

        pressionBouttonTrajectoireComplete();
        pressionBouttonObservateur(true);
        notationvitesseree1kerr();
        initialisation();
    }

    if (exemple == "ex1Kerr2") {
        document.getElementById("M").value = "2e30";
        document.getElementById("J").value = "8.5e41";

        document.getElementById("r0").value = "5.88029e3";
        document.getElementById("phi0").value = "50";
        document.getElementById("teta").value = "-90";

        document.getElementById("traject_type").value = "complete";
        document.getElementById("traject_type2").value = "observateur";
        document.getElementById("depasser").checked = false;

        pressionBouttonTrajectoireComplete();
        pressionBouttonObservateur(true);
        notationvitesseree1kerr();
        initialisation();
    }

    if (exemple == "ex2Kerr2") {
        document.getElementById("M").value = "2e30";
        document.getElementById("J").value = "8.5e41";

        document.getElementById("r0").value = "5e3";
        document.getElementById("phi0").value = "0";
        document.getElementById("teta").value = "-90";

        document.getElementById("traject_type").value = "complete";
        document.getElementById("traject_type2").value = "observateur";
        document.getElementById("depasser").checked = false;

        pressionBouttonTrajectoireComplete();
        pressionBouttonObservateur(true);
        notationvitesseree1kerr();
        initialisation();
    }

    if (exemple == "ex3Kerr2") {
        document.getElementById("M").value = "2e30";
        document.getElementById("J").value = "8.5e41";

        document.getElementById("r0").value = "4e3";
        document.getElementById("phi0").value = "-30";
        document.getElementById("teta").value = "120";

        document.getElementById("traject_type").value = "complete";
        document.getElementById("traject_type2").value = "observateur";
        document.getElementById("depasser").checked = false;

        pressionBouttonTrajectoireComplete();
        pressionBouttonObservateur(true);
        notationvitesseree1kerr();
        initialisation();
    }
}