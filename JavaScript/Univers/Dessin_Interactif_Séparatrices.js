const omegaM0Min = 0;
const omegaM0Max = 3;

const omegaL0Min = -1.5;
const omegaL0Max = 3;
const w0min = -3
const w0max = 1
const w1min = -2
const w1max = 2

const marge_droite2 = 15
const marge_gauche = 28

// Ces constantes gerent respectivement la taille en em des tags (Ouvert/Fermé), des Labels (Omega_m0) et des graduations
const fontsize = 1.1;
const fontsize_label = 1;
const fontsize_graduations = 1;


window.onload = function() {
    update_graphe_interactif();
    update_point()
};

window.onresize = function() {
    update_graphe_interactif()
    update_point()
};

function resizeCanvas() {
    let canvas = document.getElementById("canvas");
    let container = document.getElementById("conteneurCanvas");

    const size = Math.min(container.clientWidth, container.clientHeight);
    canvas.width = size;
    canvas.height = size;
}

// Om est dans le sens des x
/**
 * Fonction permettant de convertir une valeur de oméga lambda en pixel
 * @param value {number} Valeur de oméga
 * @return {number} Valeur de oméga convertis en pixel sur le canvas
 */
function omegam0_to_px(value) {
    let canvas = document.getElementById("canvas");
    let echelle = (canvas.width - (marge_droite2+marge_gauche)) / Math.abs(omegaM0Max - omegaM0Min);
    return echelle * (value - omegaM0Min) + (marge_gauche);
}

/**
* @param value {number} Valeur de w0
* @return {number} Valeur de w0 convertis en pixel sur le canvas
*/
function w0_to_px(value) {
   let canvas = document.getElementById("canvas");
   let echelle = (canvas.width - (marge_droite2+marge_gauche)) / Math.abs(w0max - w0min);
   return echelle * (value - w0min) + (marge_gauche);
}

// Ol est dans le sens des y
/**
 * Fonction permettant de convertir une valeur de oméga matière en pixel
 * @param value {number} Valeur de oméga
 * @return {number} Valeur de oméga convertis en pixel sur le canvas
 */
function omegal0_to_px(value) {
    let canvas = document.getElementById("canvas");
    let echelle = (canvas.height - (marge_droite2+marge_gauche)) / Math.abs(omegaL0Max - omegaL0Min);
    return (canvas.height - (marge_gauche)) - (echelle * (value - omegaL0Min));
}

/**
 * Fonction permettant de convertir une valeur de oméga matière en pixel
 * @param value {number} Valeur de oméga
 * @return {number} Valeur de oméga convertis en pixel sur le canvas
 */
function w1_to_px(value) {
    let canvas = document.getElementById("canvas");
    let echelle = (canvas.height - (marge_droite2+marge_gauche)) / Math.abs(w1max - w1min);
    return (canvas.height - (marge_gauche)) - (echelle * (value - w1min));
}

/**
 * Fonction permettant de convertir une coordonée x en pixel en omegam0
 * @param x {number} valeur de la coordonée
 * @return {number} Valeur de la coordonée convertie en Oméga
 */
function px_to_omegam0(x) {
    const pxMin = omegam0_to_px(omegaM0Min);
    const pxMax = omegam0_to_px(omegaM0Max);

    // Conversion des pixels en valeurs Omega
    return omegaM0Min + ((x - pxMin) / (pxMax - pxMin)) * (omegaM0Max - omegaM0Min);
}

function px_to_w0(x) {
    const pxMin = w0_to_px(w0min);
    const pxMax = w0_to_px(w0max);

    // Conversion des pixels en valeurs Omega
    return w0min + ((x - pxMin) / (pxMax - pxMin)) * (w0max - w0min);
}

/**
 * Fonction permettant de convertir une coordonée y en pixel en omegal0
 * @param y {number} valeur de la coordonée
 * @return {number} Valeur de la coordonée convertie en Oméga
 */
function px_to_omegal0(y) {
    const pxMin = omegal0_to_px(omegaL0Min);
    const pxMax = omegal0_to_px(omegaL0Max);

    // Conversion des pixels en valeurs Omega
    return omegaL0Min + ((y - pxMin) / (pxMax - pxMin)) * (omegaL0Max - omegaL0Min);
}

function px_to_w1(x) {
    const pxMin = w1_to_px(w1min);
    const pxMax = w1_to_px(w1max);

    // Conversion des pixels en valeurs Omega
    return w1min + ((x - pxMin) / (pxMax - pxMin)) * (w1max - w1min);
}


let x_min;
let x_max;
let y_min;
let y_max;
let x_to_px;
let y_to_px;
let pas
if (document.getElementById("w0")) {
    x_min = w0min
    x_max = w0max
    y_min = w1min
    y_max = w1max
    x_to_px = w0_to_px
    y_to_px = w1_to_px
    label_x = "w0"
    label_y = "w1"
    pas = 1
} else {
    x_min = omegaM0Min
    x_max = omegaM0Max
    y_min = omegaL0Min
    y_max = omegaL0Max
    x_to_px = omegam0_to_px
    y_to_px = omegal0_to_px
    label_x = "Ωm0"
    label_y = "ΩΛ0"
    pas = 1
}

function update_graphe_interactif() {
    resizeCanvas();

    let texte = o_recupereJson()
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);


    // Dessiner les axes
    context.beginPath();
    context.moveTo(x_to_px(x_min), y_to_px(y_min));
    context.lineTo(x_to_px(x_min), y_to_px(y_max));
    context.lineTo(x_to_px(x_max), y_to_px(y_max));
    context.lineTo(x_to_px(x_max), y_to_px(y_min));
    context.lineTo(x_to_px(x_min), y_to_px(y_min));

    context.lineWidth = 2;
    context.strokeStyle = "#000000";
    context.stroke();

    // Ajout des labels aux axes
    context.font = fontsize_label+"em Arial";
    context.fillStyle = '#000000';
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.save()
    context.translate(x_to_px(x_min), y_to_px(y_max));
    context.rotate(-Math.PI / 2)
    context.fillText(label_y,-23, 5);
    context.restore()
    context.textAlign = 'left';
    context.fillText(label_x,x_to_px(x_max) - 45, y_to_px(y_min) - 20);  // Label pour l'axe y

    // Dessiner les marqueurs des valeurs
    context.font = fontsize_graduations+"em Arial";
    context.fillStyle = '#000000';
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.textBaseline = 'middle';

    for (let marqueur = y_min; marqueur <= y_max; marqueur = marqueur + pas) {
        context.beginPath();
        context.moveTo(x_to_px(x_min) - 5, y_to_px(marqueur));
        context.lineTo(x_to_px(x_min) + 5, y_to_px(marqueur));
        context.lineWidth = 2;
        context.strokeStyle = "#000000";
        context.stroke();
        context.textAlign = 'center';
        if (marqueur !== -3) {
            context.save();
            context.translate(x_to_px(x_min) - 10, y_to_px(marqueur));
            context.rotate(-Math.PI / 2);
            context.textAlign = 'center';
            if (marqueur === y_min) {
                context.fillText(marqueur.toFixed(1), 3, -5)
            } else {
                context.fillText(marqueur.toFixed(1), 0, -5);
        }

            context.restore();
        }
    }

    for (let marqueur = x_min; marqueur <= x_max; marqueur = marqueur + pas) {
        context.beginPath();
        context.moveTo(x_to_px(marqueur), y_to_px(y_min) - 5);
        context.lineTo(x_to_px(marqueur), y_to_px(y_min) + 5);
        context.lineWidth = 2;
        context.strokeStyle = "#000000";
        context.stroke();
        context.textAlign = 'center';
        if (marqueur === x_min) {
            context.fillText(marqueur.toFixed(1), x_to_px(marqueur)+3, y_to_px(y_min) + 17)
        } else {
        context.fillText(marqueur.toFixed(1), x_to_px(marqueur), y_to_px(y_min) + 17);
    }
}

    if (document.getElementById("Omégal0")) {
    // Tracé de la séparatrice univers fermé / ouvert et affichage des textes
    context.beginPath();
    context.strokeStyle = "#fa2076";

    for (let omegal = omegaL0Min; omegal <= omegaL0Max; omegal += 0.01) {
        let omegam = 1 - omegal; // Calcul de Ωm pour chaque ΩΛ
        let y = y_to_px(omegal); // Conversion en coordonnées x
        let x = x_to_px(omegam); // Conversion en coordonnées y

        if (omegal === omegaL0Min) {
            context.moveTo(x, y); // Point de départ
        } else {
            if (omegaM0Max >= omegam && omegam >= omegaM0Min ) {
                context.lineTo(x, y); // Relier les points
            }
        }
    }
    context.stroke(); // Tracer la séparatrice

    context.save();
    context.font = fontsize+"em Arial";
    context.translate(x_to_px(1.7), y_to_px(1-1.7));
    context.rotate(Math.PI / 4.5);
    context.fillStyle = "#fa2076"
    context.fillText(texte.grapheSéparatrices.ouvert,0 , 15);
    context.fillText(texte.grapheSéparatrices.ferme, 0, -15);
    context.restore();

    // Tracé de la séparatrice univers avec / sans bigCrunch et affichage des textes
    context.beginPath();
    context.strokeStyle = "#06a106";

    for (let omegam = 1; omegam <= omegaM0Max + 0.01; omegam = omegam + 0.01) {
        let terme_1 = 4 * omegam
        let terme_2 = (1 / omegam) - 1
        let terme_3 = Math.cos(1/3 * Math.acos(terme_2) + 4 * Math.PI / 3 )
        let omegal = terme_1 * Math.pow(terme_3, 3); // Calcul de Ωm pour chaque ΩΛ
        let y = y_to_px(omegal); // Conversion en coordonnées x
        let x = x_to_px(omegam); // Conversion en coordonnées y

        if (omegal === 1) {
            context.moveTo(x, y); // Point de départ
        } else {
            context.lineTo(x, y); // Relier les points
        }
    }
    context.moveTo(x_to_px(1), y_to_px(0))
    context.lineTo(x_to_px(0), y_to_px(0));
    context.stroke(); // Tracer la séparatrice

    context.save();
    context.font = fontsize+"em Arial";
    context.translate(x_to_px(2.5), y_to_px(0.16));
    context.fillStyle = "#06a106"
    context.fillText(texte.grapheSéparatrices.BC, -27, 25);
    context.fillText(texte.grapheSéparatrices.pBC, -27, -10);
    context.restore();

    // Tracé de la séparatrice univers avec / sans Big Bang et affichage des textes
    context.beginPath();
    context.strokeStyle = "#3472b8";
    context.moveTo(x_to_px(0), y_to_px(0))

// Première portion de la courbe (cosh)
    for (let omegam = omegaM0Min; omegam <= 0.5; omegam += 0.01) {
        let terme_1 = 4 * omegam;
        let terme_2 = (1 / omegam) - 1;
        let terme_3 = Math.sqrt((terme_2 * terme_2) - 1);
        let terme_4 = Math.cosh(Math.log(terme_2 + terme_3) / 3);
        let omegal = terme_1 * Math.pow(terme_4, 3); // Calcul de ΩΛ pour chaque Ωm
        let y = y_to_px(omegal); // Conversion en coordonnées x
        let x = x_to_px(omegam); // Conversion en coordonnées y

        if (omegam === 0) {
        } else {
            context.lineTo(x, y); // Relier les points
        }
    }

    // On assure la continuité de la séparatrice
    let omegam = 0.5;
    let terme_1 = 4 * omegam;
    let terme_2 = (1 / omegam) - 1;
    let terme_3 = Math.acos(terme_2) / 3;
    let omegal = terme_1 * Math.pow(Math.cos(terme_3), 3); // Calcul de ΩΛ pour chaque Ωm
    let y = y_to_px(omegal); // Conversion en coordonnées x
    let x = x_to_px(omegam); // Conversion en coordonnées y
    context.lineTo(x, y); // Relier les points

// Deuxième portion de la courbe (acos)
    for (let omegam = 0.5; omegam <= omegaM0Max; omegam += 0.01) {
        let terme_1 = 4 * omegam;
        let terme_2 = (1 / omegam) - 1;
        let terme_3 = Math.acos(terme_2) / 3;
        let omegal = terme_1 * Math.pow(Math.cos(terme_3), 3); // Calcul de ΩΛ pour chaque Ωm
        if (omegal <= omegaL0Max) {
            let y = y_to_px(omegal); // Conversion en coordonnées x
            let x = x_to_px(omegam); // Conversion en coordonnées y

            context.lineTo(x, y); // Relier les points
        }
    }

    context.stroke(); // Tracer la séparatrice

    context.save();
    context.font = fontsize+"em Arial";
    context.translate(x_to_px(0.7), y_to_px(2.2));
    context.fillStyle = "#3472b8"
    context.rotate(-Math.PI / 4);
    context.fillText(texte.grapheSéparatrices.BB, 0, -20);
    context.fillText(texte.grapheSéparatrices.BB, 0, 15);
    context.fillText(texte.grapheSéparatrices.pBB, 0, -40);
    context.restore();

    // Tracé de la zone avec univers oscillants (enlever du commentaire et augmenter les bornes)
    /*
    context.beginPath();
    context.moveTo(x_to_px(omegaM0Min), y_to_px(0));
    context.lineTo(x_to_px(0), y_to_px(0));
    context.lineTo(x_to_px(0), y_to_px(omegaL0Min));

    context.lineWidth = 1;
    context.strokeStyle = "#b88121";
    context.stroke();

    context.save();
    context.font = '14px Arial'
    context.translate(x_to_px(-1.5), y_to_px(-1.5));
    context.fillStyle = "#ac791f"
    context.rotate(0);
    context.fillText(texte.grapheSéparatrices.oscillant, 0, 0);
    context.restore();
    */

    //Tracé de la séparatrice acceleration/deceleration
    context.beginPath()
    context.strokeStyle = "#000000";

    for (let omegam = omegaM0Min; omegam <= omegaM0Max; omegam += 0.01) {
        let omegal = 0.5* omegam; // Calcul de ΩΛ pour chaque Ωm
        let y = y_to_px(omegal); // Conversion en coordonnées x
        let x = x_to_px(omegam); // Conversion en coordonnées y

        if (omegam === omegaM0Min) {
            context.moveTo(x, y); // Point de départ
        } else if (omegaM0Max >= omegam && omegam >= omegaM0Min ) {
                context.lineTo(x, y); // Relier les points
        }
    }
    context.stroke(); // Tracer la séparatrice

    context.save(); 
    context.font = fontsize+"em Arial";
    context.translate(x_to_px(1.5), y_to_px(0.75));
    context.rotate(-Math.PI/10);
    context.fillStyle = "#000000"
    context.fillText(texte.grapheSéparatrices.accelere, 0, -15);
    context.fillText(texte.grapheSéparatrices.decelere,0 , 15);
    context.restore();
} else {
    context.beginPath()
    context.strokeStyle = "red";
    for (let w0 = w0min; w0 <= -1; w0 += 0.01) {
        let w1 = 0; // Calcul de ΩΛ pour chaque Ωm
        let y = y_to_px(w1); // Conversion en coordonnées x
        let x = x_to_px(w0); // Conversion en coordonnées y
        if (w0 === w0min) {
            context.moveTo(x, y); // Point de départ
        } else if (-1 >= w0 && w0 >= w0min ) {
                context.lineTo(x, y); // Relier les points
        }
    }
    context.stroke(); // Tracer la séparatrice
    context.save(); 
    context.beginPath()
    context.strokeStyle = "#000000";
    for (let w0 = -1; w0 <= w0max; w0 += 0.01) {
        let w1 = 0; // Calcul de ΩΛ pour chaque Ωm
        let y = y_to_px(w1); // Conversion en coordonnées x
        let x = x_to_px(w0); // Conversion en coordonnées y
        if (w0 === 1) {
            context.moveTo(x, y); // Point de départ
        } else if (w0max >= w0 && w0 >= -1 ) {
                context.lineTo(x, y); // Relier les points
        }
    }
    context.stroke(); 
    context.save(); 

    context.beginPath()
    context.strokeStyle = "#000000";
    context.moveTo(x_to_px(-1),y_to_px(0.1))
    context.lineTo(x_to_px(-1),y_to_px(-0.1))
    context.stroke(); 
    context.save(); 

    context.font = fontsize+"em Arial";
    context.translate(x_to_px(-2), y_to_px(0));
    context.rotate(0);
    context.fillStyle = "red"
    context.fillText(texte.grapheSéparatrices.BigRip, 0, -15);
    context.restore();
    context.font = fontsize+"em Arial";
    context.fillStyle = "#000000"
    context.translate(x_to_px(0), y_to_px(0));
    context.fillText(texte.grapheSéparatrices.pBB,0 ,15);
    context.fillText(texte.grapheSéparatrices.BigRip,0,35)
    context.restore();
}


}

function update_point() {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    let x;
    let y;
    let color = "#df1b1b"
    if (document.getElementById("Omégal0")) {
    const omegam0 = parseFloat(document.getElementById("Omégam0").value);
    const omegal0 = parseFloat(document.getElementById("Omégal0").value);

    x = x_to_px(omegam0);
    y = y_to_px(omegal0); 
    } else {
        x = x_to_px(document.getElementById("w0").value)
        y = y_to_px(document.getElementById("w1").value)
        if (!(document.getElementById("w1").value > 0 || (document.getElementById("w1").value == 0 && document.getElementById("w0").value < -1 ))) {
            color = "#000000"
        }
    }

    context.beginPath();
    context.arc(x, y, 4, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
}

let canvas = document.getElementById("canvas");

if (document.getElementById("Omégal0")) {
canvas.addEventListener('click', function(event) {
    // Récupérer les coordonnées du clic
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convertir les coordonnées en valeurs Omega
    const omegam0 = px_to_omegam0(x); // Convertir x en ΩΛ
    const omegal0 = px_to_omegal0(y);   // Convertir y en Ωm

    function update_omegas(omegal0, omegam0) {
        document.getElementById("Omégam0").value = omegam0.toFixed(4);
        if (document.getElementById("Omégal0")) {
            document.getElementById("Omégal0").value = omegal0.toFixed(4);
        }
    }

    update_graphe_interactif();
    if (omegaM0Min <= omegam0 && omegam0 <= omegaM0Max
        && omegaL0Min <= omegal0 && omegal0 <= omegaL0Max) {
        update_omegas(omegal0, omegam0);
    } else {
        // Pour les bords
        if (omegaM0Min > omegam0) { update_omegas(omegal0, omegaM0Min); }
        if (omegam0 > omegaM0Max) { update_omegas(omegal0, omegaM0Max); }
        if (omegaL0Min > omegal0) { update_omegas(omegaL0Min, omegam0); }
        if (omegal0 > omegaL0Max) { update_omegas(omegaL0Max, omegam0); }
        // Pour les coins
        if (omegaM0Min > omegam0 && omegaL0Min > omegal0) { update_omegas(omegaL0Min, omegaM0Min); }
        if (omegaM0Min > omegam0 && omegal0 > omegaL0Max) { update_omegas(omegaL0Max, omegaM0Min); }
        if (omegam0 > omegaM0Max && omegaL0Min > omegal0) { update_omegas(omegaL0Min, omegaM0Max); }
        if (omegam0 > omegaM0Max && omegal0 > omegaL0Max) { update_omegas(omegaL0Max, omegaM0Max); }
    }
    if (document.getElementById("Ok_enregistrer")) {
        updateUnivers();
    }
    if (document.getElementById("omegaL_z1")) {
        updateCalculette();
    }

    if (document.getElementById("Omégal0") && (document.getElementById("Ol_enregistrer"))) {
        affichage_site_LCDM();
        }
        
});

} else {
        canvas.addEventListener('click', function(event) {
            // Récupérer les coordonnées du clic
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
        
            // Convertir les coordonnées en valeurs Omega
            const w0 = px_to_w0(x); // Convertir x en ΩΛ
            const w1 = px_to_w1(y);   // Convertir y en Ωm

            document.getElementById("w0").value = w0.toFixed(4);
            document.getElementById("w1").value = w1.toFixed(4);
            update_graphe_interactif();
            update_point()
            if (document.getElementById("Ok_enregistrer")) {
            updateUnivers()
            affichage_site_DE();
            } else {
                updateCalculette()
            }
        });
    update_graphe_interactif();
}
update_graphe_interactif();
update_point()
