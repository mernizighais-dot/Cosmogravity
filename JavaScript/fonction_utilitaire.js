function arrondie_affichage(nombre){
    if (0.1<nombre && nombre<1e4){
        return nombre.toFixed(4)
    }else if(nombre===0){
        return nombre
    }
    else{
        return nombre.toExponential(3);
    }
}

/**
 * Linear Scale
 * @param {*} zmin 
 * @param {*} zmax 
 * @param {*} nb_pts 
 * @returns points for the x-axis
 */
function linear_scale(zmin, zmax, nb_pts) {
	let pas = (zmax - zmin) / nb_pts;
	let abscisse = [];
	for (let i=zmin; i<=zmax; i+=pas) {
		abscisse.push(i);
	}
	if(abscisse[abscisse.length - 1] !== zmax){ //Pour gérér le cas particulier ou zmax n'apparait pas dans la liste par la faute du pas
		abscisse.push(zmax)
	}

	return abscisse;
}

/**
 * Logarithmic Scale
 * @param {*} zmin 
 * @param {*} zmax 
 * @param {*} nb_pts 
 * @returns points for the x-axis
 */
function log_scale(zmin, zmax, nb_pts) {
	let zmin_10 = Math.log10(zmin + 1);
	let zmax_10 = Math.log10(zmax + 1);
	let abscissa = linear_scale(zmin_10, zmax_10, nb_pts);
	let abscissa_10 = [];
	for (let i = 0; i < abscissa.length; i++) {
		abscissa_10.push(10**abscissa[i] - 1);	
	}

	
	return abscissa_10;
}


//!Converions
function annee_vers_seconde(valeur){
    return valeur*nbrJours()*24*3600;
}
function seconde_vers_annee(valeur){
    return valeur/(nbrJours()*24*3600);
}
function gigaannee_vers_seconde(valeur){
    return valeur*nbrJours()*24*3600*1e9;
}
function seconde_vers_gigaannee(valeur){
    return valeur/(nbrJours()*24*3600*1e9);
}
function m_vers_AU(valeur){
    return valeur/149597870700;
}
function AU_vers_m(valeur){
    return valeur*149597870700;
}
function AL_vers_m(valeur){
    return c*annee_vers_seconde(valeur);
}
function m_vers_AL(valeur){
    return valeur/AL_vers_m(1);
}
function pc_vers_m(valeur){
    return 648000/Math.PI*AU_vers_m(valeur);
}
function m_vers_pc(valeur){
    return m_vers_AU(valeur)/(648000/Math.PI);
}
