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

    if (IDpanel === "panneauEntree") {
        document.getElementById("flecheGauche").classList.toggle("tournee");
    } else {
        document.getElementById("flecheDroite").classList.toggle("tournee");
    }

    ajustementGraphique()
}

/**
 * Fonction permettant d'ouvrir la fenêtre ou la gestion des constantes a lieu
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
    document.getElementById("loading").style.display="block";
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
 * Fonction qui permet de détecter un click sur le panneau d'avertissement
 */
function avertissement() {
    let message = document.getElementById('avertissementUnivers');
    if (message.style.display === 'none') {
        message.style.display = 'block';
    } else {
        message.style.display = 'none';
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

