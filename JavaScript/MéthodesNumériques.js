/**
 * Méthode de résolution d'équations différentielles d'ordre 2 grâce à la méthode de Runge-Kutta d'ordre 4
 * @param {number} pas pas utilisé pour la méthode
 * @param xn {number} paramètre initial ou on connait la valeur de la fonction à déterminer
 * @param yn {number} valeur de la fonction à déterminer au paramètre initial. Cette valeur doit être
 * comprise entre a_min et a_max
 * @param ypn {number} valeur de la dérivée fonction à déterminer au paramètre initial.
 * @param fonctionCarac {function} Équation caractéristique du système qui ne doit dépendre que :
 *      - Du paramètre de la fonction inconnue
 *      - De la fonction inconnue
 *      - De la dérivée de la fonction inconnue
 * Dans cet ordre, pas plus pas moins.
 * déterminer, de sa dérivée première et de son paramètre, pas plus pas moins.
 * @return liste de 3 valeurs : [x_n+1, y_n+1, y'_n+1]
 */
function RungeKuttaEDO2(pas, xn, yn, ypn, fonctionCarac) {
    let k1 = fonctionCarac(xn, yn, ypn);
    let k2 = fonctionCarac(xn + pas/2, yn + 0.5 * pas * ypn, ypn + 0.5 * pas * k1);
    let k3 = fonctionCarac(xn + pas/2, yn + 0.5 * pas * ypn + pas * pas * 0.25 * k1, ypn + 0.5 * pas * k2);
    let k4 = fonctionCarac(xn + pas, yn + pas * ypn + pas * pas * 0.5 * k2, ypn + pas * k3);

    let ypn1 = ypn + (pas / 6) * (k1 + 2*k2 + 2*k3 + k4);
    let yn1 = yn + pas * ypn + (pas * pas / 6) * (k1 + k2 + k3);
    let xn1 = xn + pas

    return [xn1, yn1, ypn1]
}


/**
 * Méthode d'intégration de simpson qui divise l'intervalle d'intégration en subdivision et interpole un polynôme
 * dans chacune de ces subdivisions.
 * @param fonction {function} Fonction ne dépendant que d'un seul paramètre
 * @param borne_inf {number} Borne inférieure d'intégration.
 * @param borne_sup {number} Borne supérieure d'intégration
 * @param subdivisions {number} Nombre de subdivisions à créer
 * @returns {number} Valeur de l'intégrale
 */
function simpson_composite(fonction, borne_inf, borne_sup, subdivisions=100) {
    let pas = (borne_sup - borne_inf) / subdivisions;
    let x = borne_inf;
    let integrale = 0;
    for (let j = 0; j < subdivisions; j = j + 1) {
        integrale = integrale + fonction(x) + 4 * fonction(x + (pas / 2)) + fonction(x + pas);
        x = x + pas;
    }
    return (pas / 6) * integrale;
}

/**
 * Méthode d'intégration de Simpson adaptative : contrairement à simpson_composite (nombre de subdivisions fixe,
 * réparties uniformément), celle-ci raffine récursivement l'intervalle là où c'est nécessaire pour atteindre la
 * tolérance demandée. simpson_composite sous-échantillonne gravement un intégrande qui varie sur plusieurs ordres
 * de grandeur sur une petite partie de l'intervalle (ex : univers avec une énergie noire très fortement fantôme,
 * où l'essentiel de la variation de l'intégrande se joue sur un intervalle bien plus petit que (borne_sup-borne_inf)/100) :
 * une subdivision fixe peut alors être fausse d'un facteur plusieurs, alors que celle-ci reste précise quel que
 * soit l'intégrande.
 * @param {function} fonction Fonction ne dépendant que d'un seul paramètre
 * @param {number} borne_inf Borne inférieure d'intégration
 * @param {number} borne_sup Borne supérieure d'intégration
 * @param {number} tolerance_relative Tolérance relative visée sur l'intégrale totale
 * @param {number} profondeur_max Profondeur maximale de subdivision (protection contre une récursion trop longue si l'intégrande est réellement singulier)
 * @returns {number} Valeur de l'intégrale
 */
function simpson_adaptatif(fonction, borne_inf, borne_sup, tolerance_relative=1e-6, profondeur_max=25) {
    function simpson_base(fa, fc, fb, largeur) {
        return (largeur / 6) * (fa + 4 * fc + fb);
    }

    function subdivise(a, b, fa, fc, fb, S, tolerance, profondeur) {
        let c = (a + b) / 2;
        let d = (a + c) / 2;
        let e = (c + b) / 2;
        let fd = fonction(d);
        let fe = fonction(e);
        let S_gauche = simpson_base(fa, fd, fc, c - a);
        let S_droite = simpson_base(fc, fe, fb, b - c);
        let S2 = S_gauche + S_droite;

        if (!isFinite(S2) || profondeur <= 0 || Math.abs(S2 - S) <= 15 * tolerance) {
            // Extrapolation de Richardson : améliore l'estimation en exploitant l'écart entre les deux niveaux de raffinement
            return S2 + (S2 - S) / 15;
        }
        return subdivise(a, c, fa, fd, fc, S_gauche, tolerance / 2, profondeur - 1)
             + subdivise(c, b, fc, fe, fb, S_droite, tolerance / 2, profondeur - 1);
    }

    let fa = fonction(borne_inf);
    let fb = fonction(borne_sup);
    let c = (borne_inf + borne_sup) / 2;
    let fc = fonction(c);
    let S = simpson_base(fa, fc, fb, borne_sup - borne_inf);
    let tolerance = tolerance_relative * Math.max(Math.abs(S), 1e-300);

    return subdivise(borne_inf, borne_sup, fa, fc, fb, S, tolerance, profondeur_max);
}


/**
 * Permet de trouver l'abscisser correspond à une ordonée d'une fonction monotone
 * @param {function} fonction fonction utilisée
 * @param {number} cible abscisse recherchée
 * @param {number} borneDebut borne de départ
 * @param {number} borneFin borne de fin
 * @param {number} precision précision recherchée
 * @param {number} iterations_max nombre maximal d'étape avant l'arrêt du code
 * @returns ordonée recherchée
 */
function Dichotomie(fonction, cible, borneDebut, borneFin, precision,iterations_max=100){
    let iterations=0
    let milieu;

    if (fonction(borneDebut)<fonction(borneFin)){
        while (Math.abs(borneFin - borneDebut) > precision && iterations<iterations_max){
            iterations = iterations+1;
            milieu = (borneDebut+borneFin)/2;
            let dm_milieu=fonction(milieu);

            if (cible>dm_milieu){
                borneDebut= milieu;
            }else if (cible<dm_milieu){
                borneFin = milieu;
            }else{
                return milieu
            }
        }

    } else {//pour le cas où la fonction est décroissante.
        while (Math.abs(borneFin - borneDebut) > precision && iterations<iterations_max){
            iterations = iterations+1;
            milieu = (borneDebut+borneFin)/2;
            let dm_milieu=fonction(milieu);
            
            if (cible<dm_milieu){
                borneDebut= milieu;
            }else if (cible>dm_milieu){
                borneFin = milieu;
            }else{
                return milieu
            }
        }
        
    }
    return milieu;
}